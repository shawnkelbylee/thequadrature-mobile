// THE QUADRATURE: OFFLINE EPHEMERIS ENGINE (WEB WORKER)
// Architect: Kelby | Engineer: Kairos
// PROTOCOL: Background NASA JPL Horizons Telemetry Caching & IndexedDB Integration

const CACHE_NAME = 'q_ephemeris_db';
const STORE_NAME = 'jpl_telemetry';

function initDB() {
    return new Promise((resolve, reject) => {
        const request = indexedDB.open(CACHE_NAME, 1);
        request.onupgradeneeded = (event) => {
            const db = event.target.result;
            if (!db.objectStoreNames.contains(STORE_NAME)) {
                db.createObjectStore(STORE_NAME, { keyPath: 'date' });
            }
        };
        request.onsuccess = () => resolve(request.result);
        request.onerror = () => reject(request.error);
    });
}

async function cacheTelemetry(dateKey, payload) {
    const db = await initDB();
    return new Promise((resolve, reject) => {
        const tx = db.transaction(STORE_NAME, 'readwrite');
        const store = tx.objectStore(STORE_NAME);
        store.put({ date: dateKey, data: payload, timestamp: Date.now() });
        tx.oncomplete = () => resolve();
        tx.onerror = () => reject(tx.error);
    });
}

async function getCachedTelemetry(dateKey) {
    const db = await initDB();
    return new Promise((resolve, reject) => {
        const tx = db.transaction(STORE_NAME, 'readonly');
        const store = tx.objectStore(STORE_NAME);
        const request = store.get(dateKey);
        request.onsuccess = () => {
            // Validate cache freshness (24 hours)
            if (request.result && (Date.now() - request.result.timestamp < 86400000)) {
                resolve(request.result.data);
            } else {
                resolve(null);
            }
        };
        request.onerror = () => resolve(null);
    });
}

async function fetchFromNASA(startStr, stopStr) {
    const url = `https://ssd.jpl.nasa.gov/api/horizons.api?format=json&COMMAND='399'&OBJ_DATA='YES'&MAKE_EPHEM='YES'&EPHEM_TYPE='OBSERVER'&CENTER='500@10'&START_TIME='${startStr}'&STOP_TIME='${stopStr}'&STEP_SIZE='1 d'&QUANTITIES='18'`;
    const response = await fetch(url);
    if (!response.ok) throw new Error('NASA Horizons API Rate Limited or Offline');
    const data = await response.json();
    if (!data || !data.result) throw new Error('Invalid Payload Structure from JPL');
    return data;
}

self.onmessage = async function(e) {
    const { action, payload } = e.data;

    if (action === 'SYNC_TELEMETRY') {
        try {
            const tDate = new Date(payload.timestamp || Date.now());
            const eDate = new Date(tDate.getTime() + 86400000);
            
            const fmt = (d) => `${d.getUTCFullYear()}-${(d.getUTCMonth()+1).toString().padStart(2,'0')}-${d.getUTCDate().toString().padStart(2,'0')}`;
            
            const startStr = fmt(tDate);
            const stopStr = fmt(eDate);
            const cacheKey = `HORIZONS_${startStr}`;

            const cached = await getCachedTelemetry(cacheKey);
            if (cached) {
                self.postMessage({ 
                    type: 'TELEMETRY_SUCCESS', 
                    source: 'INDEXED_DB', 
                    data: cached, 
                    window: `${startStr} to ${stopStr}` 
                });
                return;
            }

            const liveData = await fetchFromNASA(startStr, stopStr);
            await cacheTelemetry(cacheKey, liveData);
            
            self.postMessage({ 
                type: 'TELEMETRY_SUCCESS', 
                source: 'NASA_JPL_LIVE', 
                data: liveData, 
                window: `${startStr} to ${stopStr}` 
            });

        } catch (error) {
            self.postMessage({ 
                type: 'TELEMETRY_FAILED', 
                error: error.message 
            });
        }
    }
};