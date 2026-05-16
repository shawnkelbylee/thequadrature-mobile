// THE QUADRATURE: METEOROLOGICAL VECTOR ENGINE
// Architect: Kelby | Engineer: Kairos
// STATUS: Phase XXXVI. Copernican Kinematics & Ecliptic Declination Sync.

let liveWeather = null;
let sparkBars = [];
let showDelta = false;

let alertThreshold = 75;
let currentAssetMode = "FAUNA"; // Boot Default
let iotProtocol = "MANUAL";
let climateAnchor = "GEO"; 
let manualLat = 0;
let manualLon = 0;
let unitSystem = localStorage.getItem('Q_UNIT_SYS') || 'METRIC';
let insolationMode = 'CHRONOLOGIC'; // Boot Default
let actionHorizon = "ANCHOR";
let thermoBaseline = 22.0; 
let crossVectorSync = true;

let currentRiskVal = 0;
let currentOptTarget = '';
let isBooted = false;

window.Q_LAST_ASTRO_DATE = "";
window.Q_ASTRO_DEBOUNCE = null;

// --- WEBGL GLOBE VARIABLES ---
let scene, camera, renderer, earthMesh, cloudMesh, nightMesh, sunLight;

// --- FREE-CAM STATE MACHINE ---
let isFreeCam = false;
let isDragging = false;
let prevMouseX = 0;
let prevMouseY = 0;
let camTheta = 0; 
let camPhi = Math.PI / 2; 

// --- EXTERNAL STATE RECEIVERS ---
window.addEventListener('q-camera-toggle', (e) => {
    isFreeCam = e.detail.isFree;
    if (!isFreeCam && camera) {
        camTheta = 0;
        camPhi = Math.PI / 2;
        camera.position.set(0, 0, 2.3);
        camera.lookAt(0, 0, 0);
    }
});

document.addEventListener('click', (e) => {
    if (e.target && e.target.id === 'q-live-toggle') {
        isFreeCam = false;
        camTheta = 0;
        camPhi = Math.PI / 2;
        if (camera) {
            camera.position.set(0, 0, 2.3);
            camera.lookAt(0, 0, 0);
        }
    }
});

window.injectVectorData = function() {
    const optTL = document.getElementById('opt-tl') || document.querySelectorAll('.opt-oval')[0];
    const optTR = document.getElementById('opt-tr') || document.querySelectorAll('.opt-oval')[1];
    const optBL = document.getElementById('opt-bl') || document.querySelectorAll('.opt-oval')[2];
    const optBR = document.getElementById('opt-br') || document.querySelectorAll('.opt-oval')[3];

    if (optTL) { optTL.onclick = (e) => { e.stopPropagation(); window.openOptions(e, 'phase'); }; optTL.style.color = 'var(--env-green)'; }
    if (optTR) { optTR.onclick = (e) => { e.stopPropagation(); window.openOptions(e, 'meteo'); }; optTR.style.color = 'var(--env-green)'; }
    if (optBL) { optBL.onclick = (e) => { e.stopPropagation(); window.openOptions(e, 'model'); }; optBL.style.color = 'var(--env-green)'; }
    if (optBR) { optBR.onclick = (e) => { e.stopPropagation(); window.openOptions(e, 'risk'); }; optBR.style.color = 'var(--env-green)'; }

    const dStyleTop = "font-family:'Orbitron'; font-size:0.55rem; color:rgba(255,255,255,0.5); font-weight:700; border-top:1px solid rgba(255,255,255,0.1); margin-top:4px; padding-top:4px; letter-spacing:1px; text-align:center;";
    const dStyleBot = "font-family:'Orbitron'; font-size:0.55rem; color:rgba(255,255,255,0.5); font-weight:700; border-bottom:1px solid rgba(255,255,255,0.1); margin-bottom:6px; padding-bottom:4px; letter-spacing:1px; text-align:center;";
    
    let isImp = (unitSystem === 'IMPERIAL');

    const quadTL = document.getElementById('quad-tl') || document.getElementById('quad-BIO');
    if (quadTL) {
        if (insolationMode === 'KINETIC') {
            quadTL.innerHTML = `<div class="panel-data-wrapper" id="pnl-insolation"><div class="v-head">INSOLATION</div><div class="t-row"><span class="w-lbl">LOCAL SOLAR NOON:</span> <span class="val-sm val-highlight" id="val-solar-noon">--:--</span></div><div class="t-row"><span class="w-lbl">MAX UV LEVEL:</span> <span class="val-sm val-highlight">11.4 (EXTREME)</span></div><div class="t-row"><span class="w-lbl">SUNLIGHT INTENSITY:</span> <span class="val-sm val-highlight" id="val-irradiance">98,500 LUX</span></div><div style="${dStyleTop}">[ SOLAR EXPOSURE - KINETIC ]</div></div>`;
        } else if (insolationMode === 'CHRONOLOGIC') {
            quadTL.innerHTML = `<div class="panel-data-wrapper" id="pnl-insolation"><div class="v-head">INSOLATION</div><div class="t-row"><span class="w-lbl">DAWN (SUNRISE):</span> <span class="val-sm val-highlight" id="val-dawn">--:--</span></div><div class="t-row"><span class="w-lbl">LOCAL SOLAR NOON:</span> <span class="val-sm val-highlight" id="val-solar-noon">--:--</span></div><div class="t-row"><span class="w-lbl">DUSK (SUNSET):</span> <span class="val-sm val-highlight" id="val-dusk">--:--</span></div><div style="${dStyleTop}">[ SOLAR EXPOSURE - CHRONOLOGIC ]</div></div>`;
        } else {
            quadTL.innerHTML = `<div class="panel-data-wrapper" id="pnl-insolation"><div class="v-head">INSOLATION</div><div class="t-row"><span class="w-lbl">CIVIL TWILIGHT:</span> <span class="val-sm val-highlight" id="val-twi-c">--:--</span></div><div class="t-row"><span class="w-lbl">NAUTICAL TWILIGHT:</span> <span class="val-sm val-highlight" id="val-twi-n">--:--</span></div><div class="t-row"><span class="w-lbl">ASTRONOMICAL:</span> <span class="val-sm val-highlight" id="val-twi-a">--:--</span></div><div style="${dStyleTop}">[ SOLAR EXPOSURE - TWILIGHT ]</div></div>`;
        }
    }

    const quadTR = document.getElementById('quad-tr') || document.getElementById('quad-COM');
    if (quadTR) quadTR.innerHTML = `<div class="panel-data-wrapper" id="pnl-hydro"><div class="v-head">HYDROSPHERE</div><div class="t-row"><span class="w-lbl">EL NIÑO PHASE:</span> <span class="val-sm val-highlight">LA NIÑA (COOL)</span></div><div class="t-row"><span class="w-lbl">SURFACE TEMP VAR:</span> <span class="val-sm val-highlight" id="val-sst">${isImp ? '-1.4 °F' : '-0.8 °C'}</span></div><div class="t-row"><span class="w-lbl">OCEAN CURRENT SPD:</span> <span class="val-sm val-highlight" id="val-gulf">${isImp ? '3.1 MPH' : '1.4 M/S'}</span></div><div style="${dStyleTop}">[ OCEAN & WATER ]</div></div>`;

    const quadBL = document.getElementById('quad-bl') || document.getElementById('quad-ENV');
    if (quadBL) quadBL.innerHTML = `<div class="panel-data-wrapper" id="pnl-tropo"><div class="v-head">TROPOSPHERE</div><div style="${dStyleBot}">[ SURFACE WEATHER ]</div><div class="t-row"><span class="w-lbl">AIR PRESSURE:</span> <span class="val-sm val-highlight" id="val-pressure">${isImp ? '29.92 inHg' : '1013 hPa'}</span></div><div class="t-row"><span class="w-lbl">AIR TEMPERATURE:</span> <span class="val-sm val-highlight" id="val-temp">${isImp ? '71.6 °F' : '22.0 °C'}</span></div><div class="t-row"><span class="w-lbl">HUMIDITY:</span> <span class="val-sm val-highlight">68%</span></div></div>`;

    const quadBR = document.getElementById('quad-br') || document.getElementById('quad-MEC');
    if (quadBR) quadBR.innerHTML = `<div class="panel-data-wrapper" id="pnl-strato"><div class="v-head">STRATOSPHERE</div><div style="${dStyleBot}">[ UPPER ATMOSPHERE ]</div><div class="t-row"><span class="w-lbl">JET STREAM SPEED:</span> <span class="val-sm val-highlight" id="val-jet">${isImp ? '138 MPH' : '222 KM/H'}</span></div><div class="t-row"><span class="w-lbl">ARCTIC AIR STABILITY:</span> <span class="val-sm val-highlight">STABLE (LOCKED)</span></div><div class="t-row"><span class="w-lbl">STORM CEILING:</span> <span class="val-sm val-highlight" id="val-tropo">${isImp ? '10 MILES' : '16 KM'}</span></div></div>`;
};

window.showAxisHUD = function(text) {
    const hud = document.getElementById('axis-hud');
    if (hud) {
        hud.innerText = text;
        hud.style.opacity = '1';
    }
};

window.hideAxisHUD = function() {
    const hud = document.getElementById('axis-hud');
    if (hud) {
        hud.style.opacity = '0';
    }
};

function initSparklines() {
    const container = document.getElementById('risk-sparkline');
    if(!container) return;
    container.innerHTML = '';
    sparkBars = [];
    for(let i=0; i<30; i++) {
        let bar = document.createElement('div');
        bar.className = 'spark-bar';
        container.appendChild(bar);
        sparkBars.push(bar);
    }
}

async function fetchAstroDataForDate(dateStr) {
    let lat = window.Q_USER_LATITUDE !== undefined ? window.Q_USER_LATITUDE : 27.9659;
    let lon = window.Q_USER_LONGITUDE !== undefined ? window.Q_USER_LONGITUDE : -82.8001;

    if (climateAnchor === 'MANUAL') { lat = manualLat; lon = manualLon; } 
    else if (climateAnchor === 'GLOBAL') { lat = 0; lon = 0; }

    try {
        const responseA = await fetch(`https://api.sunrise-sunset.org/json?lat=${lat}&lng=${lon}&formatted=0&date=${dateStr}`);
        if (responseA.ok) {
            const dataA = await responseA.json();
            if (dataA && dataA.results) {
                window.Q_METEO_SUNRISE = new Date(dataA.results.sunrise);
                window.Q_METEO_SUNSET = new Date(dataA.results.sunset);
                window.Q_METEO_NOON = new Date(dataA.results.solar_noon);
                window.Q_METEO_TWI_C = new Date(dataA.results.civil_twilight_begin);
                window.Q_METEO_TWI_N = new Date(dataA.results.nautical_twilight_begin);
                window.Q_METEO_TWI_A = new Date(dataA.results.astronomical_twilight_begin);
            }
        }
    } catch (error) {
        console.warn('Q-SYSTEM: Astronomical API offline or rate-limited.', error);
    }
}

async function fetchMeteoData() {
    let lat = window.Q_USER_LATITUDE !== undefined ? window.Q_USER_LATITUDE : 27.9659; 
    let lon = window.Q_USER_LONGITUDE !== undefined ? window.Q_USER_LONGITUDE : -82.8001;

    if (climateAnchor === 'MANUAL') { lat = manualLat; lon = manualLon; } 
    else if (climateAnchor === 'GLOBAL') { lat = 0; lon = 0; }

    try {
        const responseW = await fetch('https://api.open-meteo.com/v1/forecast?latitude=' + lat + '&longitude=' + lon + '&current=surface_pressure,direct_normal_irradiance,precipitation,temperature_2m');
        if (responseW.ok) {
            const dataW = await responseW.json();
            if (dataW && dataW.current) {
                liveWeather = dataW.current;
                if(window.Q_LOG) window.Q_LOG('INFO', 'ENVIRONMENTAL', 'METEO_API_SYNC', dataW.current);
                const badge = document.getElementById('meteo-badge');
                if(badge) badge.innerText = "ATMOS DELTA: LIVE";
            }
        }
    } catch (error) {
        if(window.Q_LOG) window.Q_LOG('ERROR', 'ENVIRONMENTAL', 'METEO_API_FAILED', { error: error.message, fallback: 'STATIC_BASELINE' });
        const badge = document.getElementById('meteo-badge');
        if(badge) badge.innerText = "STATIC BASELINE (DEGRADED)";
        liveWeather = null;
    }
}

function fetchAtmosphericLayer() {
    fetch('https://api.rainviewer.com/public/weather-maps.json?nocache=' + Date.now())
    .then(res => res.json())
    .then(data => {
        const host = data.host;
        if (data.satellite && data.satellite.infrared && data.satellite.infrared.length > 0) {
            const lastInfrared = data.satellite.infrared[data.satellite.infrared.length - 1];
            const path = lastInfrared.path;
            const tileUrl = `${host}${path}/2048/0/0/0/0/0_0.png`;
            
            if (cloudMesh && cloudMesh.material) {
                const loader = new THREE.TextureLoader();
                loader.setCrossOrigin("anonymous");
                loader.load(tileUrl, (texture) => {
                    cloudMesh.material.map = texture;
                    cloudMesh.material.needsUpdate = true;
                });
            }
        }
    })
    .catch(err => console.warn('Q-SYSTEM: Atmospheric telemetry offline.', err));
}

window.toggleDeltaView = function() {
    showDelta = !showDelta;
    const badge = document.getElementById('meteo-badge');
    if(!badge) return;
    if (showDelta) {
        badge.innerText = "100-YR DELTA";
    } else {
        badge.innerText = liveWeather ? "ATMOS DELTA: LIVE" : "STATIC BASELINE (DEGRADED)"; 
    }
};

window.updateAssetLabels = function() {
    const modeEl = document.getElementById('asset-track');
    const mode = modeEl ? modeEl.value : 'FLORA';
    if (mode === "FAUNA") {
        const stratHead = document.getElementById('strat-header');
        if(stratHead) stratHead.innerText = "BIOLOGICAL / FAUNA";
        const yieldLbl = document.getElementById('lbl-yield');
        if(yieldLbl) yieldLbl.innerText = "EXPOSURE LIMITS:";
        const allocLbl = document.getElementById('lbl-alloc');
        if(allocLbl) allocLbl.innerText = "METABOLIC DRAW:";
   } else { 
        const stratHead = document.getElementById('strat-header');
        if(stratHead) stratHead.innerText = "EXPOSURE MODELING";
        const yieldLbl = document.getElementById('lbl-yield');
        if(yieldLbl) yieldLbl.innerText = "YIELD PROJECTION:";
        const allocLbl = document.getElementById('lbl-alloc');
        if(allocLbl) allocLbl.innerText = "RESOURCE ALLOC:";
    }
};

window.openOptions = function(e, target) {
    if(e) e.stopPropagation();
    currentOptTarget = target;
    let title = ""; let html = "";

    if(target === 'risk') {
        title = "ENVIRONMENTAL RISK TOLERANCE";
        html = `
            <div>
                <label style="font-size: 0.6rem; color: rgba(255,255,255,0.6); font-family: 'Orbitron'; letter-spacing: 1px;">RISK THRESHOLD SENSITIVITY: <span id="thresh-val" style="color:var(--env-green);">${alertThreshold}%</span></label>
                <input type="range" id="risk-thresh" min="50" max="95" value="${alertThreshold}" class="modal-input" oninput="document.getElementById('thresh-val').innerText = this.value + '%'" style="width: 100%; margin-top: 4px;">
                <div style="font-size: 0.5rem; color: var(--starlight); margin-top: 8px; font-family: 'JetBrains Mono'; line-height: 1.4;">
                    Adjusts the visual threat indicator based on the true orbit eccentricity delta. Does not dispatch external data.
                </div>
            </div>
        `;
    } else if (target === 'meteo') {
        title = "METEOROLOGICAL DATA SOURCE";
        html = `
            <div>
                <label style="font-size: 0.6rem; color: rgba(255,255,255,0.6); font-family: 'Orbitron'; letter-spacing: 1px;">CLIMATE DATA ANCHOR</label>
                <select id="climate-anchor" class="modal-input" onchange="document.getElementById('manual-coord-box').style.display = this.value === 'MANUAL' ? 'block' : 'none';" style="background: rgba(0,0,0,0.6); border: 1px solid var(--env-green); color: #fff; padding: 10px; font-family: 'JetBrains Mono'; font-size: 0.8rem; border-radius: 4px; outline: none; margin-top: 4px; width: 100%;">
                    <option value="GEO" ${climateAnchor==='GEO'?'selected':''}>ACTIVE GEOLOCATION (LOCAL)</option>
                    <option value="GLOBAL" ${climateAnchor==='GLOBAL'?'selected':''}>GLOBAL AVERAGE (MACRO)</option>
                    <option value="MANUAL" ${climateAnchor==='MANUAL'?'selected':''}>MANUAL COORDINATE ENTRY</option>
                </select>
            </div>
            <div id="manual-coord-box" style="display: ${climateAnchor === 'MANUAL' ? 'block' : 'none'}; margin-top: 10px; padding: 10px; border: 1px solid rgba(14, 165, 233, 0.5); background: rgba(0,0,0,0.4); border-radius: 4px;">
                <label style="font-size: 0.6rem; color: rgba(255,255,255,0.6); font-family: 'Orbitron'; letter-spacing: 1px;">LATITUDE (DECIMAL)</label>
                <input type="number" id="manual-lat" class="modal-input" value="${manualLat}" step="0.0001" style="background: rgba(0,0,0,0.6); border: 1px solid var(--env-green); color: #fff; padding: 6px; font-family: 'JetBrains Mono'; font-size: 0.8rem; width: 100%; box-sizing:border-box; margin-bottom: 8px;">
                <label style="font-size: 0.6rem; color: rgba(255,255,255,0.6); font-family: 'Orbitron'; letter-spacing: 1px;">LONGITUDE (DECIMAL)</label>
                <input type="number" id="manual-lon" class="modal-input" value="${manualLon}" step="0.0001" style="background: rgba(0,0,0,0.6); border: 1px solid var(--env-green); color: #fff; padding: 6px; font-family: 'JetBrains Mono'; font-size: 0.8rem; width: 100%; box-sizing:border-box;">
            </div>
            <div style="margin-top: 10px;">
                <label style="font-size: 0.6rem; color: rgba(255,255,255,0.6); font-family: 'Orbitron'; letter-spacing: 1px;">GLOBAL UNIT SYSTEM</label>
                <select id="unit-sys" class="modal-input" style="background: rgba(0,0,0,0.6); border: 1px solid var(--env-green); color: #fff; padding: 10px; font-family: 'JetBrains Mono'; font-size: 0.8rem; border-radius: 4px; outline: none; margin-top: 4px; width: 100%;">
                    <option value="METRIC" ${unitSystem==='METRIC'?'selected':''}>METRIC (DECIMAL)</option>
                    <option value="IMPERIAL" ${unitSystem==='IMPERIAL'?'selected':''}>IMPERIAL (EMPIRICAL)</option>
                </select>
            </div>
        `;
    } else if (target === 'model') {
        title = "EXPOSURE MODELING PARAMETERS";
        html = `
            <div>
                <label style="font-size: 0.6rem; color: rgba(255,255,255,0.6); font-family: 'Orbitron'; letter-spacing: 1px;">DOMAIN TRACKING MODE</label>
                <select id="asset-track" class="modal-input" onchange="window.updateAssetLabels()" style="background: rgba(0,0,0,0.6); border: 1px solid var(--env-green); color: #fff; padding: 10px; font-family: 'JetBrains Mono'; font-size: 0.8rem; border-radius: 4px; outline: none; margin-top: 4px; width: 100%;">
                    <option value="FLORA" ${currentAssetMode === 'FLORA' ? 'selected' : ''}>FLORA / AGRARIAN (Agriculture & Biome)</option>
                    <option value="FAUNA" ${currentAssetMode === 'FAUNA' ? 'selected' : ''}>FAUNA / BIOLOGICAL (Livestock & Animal Care)</option>
                </select>
            </div>
            <div style="margin-top: 10px;">
                <label style="font-size: 0.6rem; color: rgba(255,255,255,0.6); font-family: 'Orbitron'; letter-spacing: 1px;">ACTION HORIZON</label>
                <select id="action-horizon" class="modal-input" style="background: rgba(0,0,0,0.6); border: 1px solid var(--env-green); color: #fff; padding: 10px; font-family: 'JetBrains Mono'; font-size: 0.8rem; border-radius: 4px; outline: none; margin-top: 4px; width: 100%;">
                    <option value="ANCHOR" ${actionHorizon==='ANCHOR'?'selected':''}>NEXT ANCHOR (SEASONAL)</option>
                    <option value="SECTOR" ${actionHorizon==='SECTOR'?'selected':''}>NEXT SECTOR (30-DAY)</option>
                </select>
            </div>
        `;
    } else if (target === 'phase') {
        title = "ENVIRONMENTAL PHASE CALIBRATION";
        html = `
            <div>
                <label style="font-size: 0.6rem; color: rgba(255,255,255,0.6); font-family: 'Orbitron'; letter-spacing: 1px;">THERMODYNAMIC BASELINE (COMFORT): <span id="base-val" style="color:var(--env-green);">${thermoBaseline.toFixed(1)}°C</span></label>
                <input type="range" id="thermo-base" min="15" max="30" step="0.5" value="${thermoBaseline}" class="modal-input" oninput="document.getElementById('base-val').innerText = this.value + '°C'" style="width: 100%; margin-top: 4px;">
            </div>
            <div style="margin-top: 10px;">
                <label style="font-size: 0.6rem; color: rgba(255,255,255,0.6); font-family: 'Orbitron'; letter-spacing: 1px;">CROSS-VECTOR SYNC (BIO)</label>
                <select id="cv-sync" class="modal-input" style="background: rgba(0,0,0,0.6); border: 1px solid var(--env-green); color: #fff; padding: 10px; font-family: 'JetBrains Mono'; font-size: 0.8rem; border-radius: 4px; outline: none; margin-top: 4px; width: 100%;">
                    <option value="ACTIVE" ${crossVectorSync?'selected':''}>ACTIVE (PUSH HRV ALERTS)</option>
                    <option value="DISABLED" ${!crossVectorSync?'selected':''}>DISABLED (ISOLATED)</option>
                </select>
            </div>
            <div style="margin-top: 10px;">
                <label style="font-size: 0.6rem; color: rgba(255,255,255,0.6); font-family: 'Orbitron'; letter-spacing: 1px;">INSOLATION TELEMETRY MODE</label>
                <select id="inso-mode" class="modal-input" style="background: rgba(0,0,0,0.6); border: 1px solid var(--env-green); color: #fff; padding: 10px; font-family: 'JetBrains Mono'; font-size: 0.8rem; border-radius: 4px; outline: none; margin-top: 4px; width: 100%;">
                    <option value="KINETIC" ${insolationMode==='KINETIC'?'selected':''}>KINETIC (UV & INTENSITY)</option>
                    <option value="CHRONOLOGIC" ${insolationMode==='CHRONOLOGIC'?'selected':''}>CHRONOLOGIC (DAWN & DUSK)</option>
                    <option value="TWILIGHT" ${insolationMode==='TWILIGHT'?'selected':''}>TWILIGHT (CIVIL & NAUTICAL)</option>
                </select>
            </div>
        `;
    }
    if (window.Q_ModalEngine) {
        window.Q_ModalEngine.render(title, html, 'APPLY PARAMETERS', window.saveOptions);
    }
};

window.saveOptions = function() {
    if (currentOptTarget === 'risk') {
        const tEl = document.getElementById('risk-thresh');
        if(tEl) alertThreshold = parseInt(tEl.value);
    } else if (currentOptTarget === 'meteo') {
        const cEl = document.getElementById('climate-anchor');
        if(cEl) climateAnchor = cEl.value;
        const latEl = document.getElementById('manual-lat');
        if(latEl) manualLat = parseFloat(latEl.value);
        const lonEl = document.getElementById('manual-lon');
        if(lonEl) manualLon = parseFloat(lonEl.value);
        const uSys = document.getElementById('unit-sys');
        if(uSys) {
            unitSystem = uSys.value;
            localStorage.setItem('Q_UNIT_SYS', unitSystem);
        }
        fetchMeteoData();
        window.injectVectorData(); 
    } else if (currentOptTarget === 'model') {
        const aEl = document.getElementById('asset-track');
        if(aEl) currentAssetMode = aEl.value;
        const hEl = document.getElementById('action-horizon');
        if(hEl) actionHorizon = hEl.value;
        window.updateAssetLabels();
    } else if (currentOptTarget === 'phase') {
        const tbEl = document.getElementById('thermo-base');
        if(tbEl) thermoBaseline = parseFloat(tbEl.value);
        const cvEl = document.getElementById('cv-sync');
        if(cvEl) crossVectorSync = cvEl.value === 'ACTIVE';
        const insoEl = document.getElementById('inso-mode');
        if(insoEl) insolationMode = insoEl.value;
        window.injectVectorData(); 
    }
    if(window.Q_ModalEngine) window.Q_ModalEngine.close();
};

window.openImpact = function() {
    if(!window.getSimState) return;
    const isLive = window.getSimState().isLive;
    let severity = currentRiskVal >= alertThreshold ? "SEVERE" : (currentRiskVal >= alertThreshold - 25 ? "ELEVATED" : "NOMINAL");
    let apiDataString = "";
    
    let isImp = (unitSystem === 'IMPERIAL');

    if (liveWeather && isLive) {
        let pDisp = isImp ? (liveWeather.surface_pressure * 0.02953).toFixed(2) + ' inHg' : liveWeather.surface_pressure.toFixed(1) + ' hPa';
        let tDisp = isImp ? (liveWeather.temperature_2m * 9/5 + 32).toFixed(1) + ' °F' : liveWeather.temperature_2m.toFixed(1) + ' °C';
        apiDataString = '<br><br><span style="color:var(--atmos-blue); font-size:0.65rem; line-height: 1.4; display:block; border-top: 1px dashed var(--atmos-blue); padding-top: 8px; margin-top: 8px;"><strong>[ CROSS-VECTOR API TELEMETRY ]</strong><br>&#x2022; OPEN-METEO (Env): Temp ' + tDisp + ' | Pressure ' + pDisp + ' | Irradiance ' + liveWeather.direct_normal_irradiance + 'W/m²</span>';
    }

    let actionLabel = '<span style="color:var(--env-green); font-weight:bold;">[ACTION REQUIRED]</span> ';

    let desc = "", action = "";

    if (currentAssetMode === "FAUNA") {
        if (severity === "SEVERE") {
            desc = 'Lethal exposure thresholds projected (' + currentRiskVal + '% probability). Significant drop in ambient survivability indices.' + apiDataString;
            action = actionLabel + "Mandate indoor sheltering. Adjust feeding schedules to match metabolic caloric burn requirements for extreme temperature resistance.";
        } else if (severity === "ELEVATED") {
            desc = 'Behavioral shift markers detected. Approaching stressful ambient conditions.' + apiDataString;
            action = actionLabel + "Shift K-9 or livestock exercise routines to cooler Arc degrees. Increase hydration provisions.";
        } else {
            desc = 'Nominal biological exposure limits.' + apiDataString;
            action = actionLabel + "Maintain standard husbandry cycles and outdoor exposure allowances.";
        }
    } else { 
        if (severity === "SEVERE") {
            desc = 'Historical cross-reference confirms a ' + currentRiskVal + '% probability of extreme exposure phenomena at this exact coordinate.' + apiDataString;
            action = actionLabel + "Execute immediate flora shielding. Alter thermodynamic allocation to mitigate shock.";
        } else if (severity === "ELEVATED") {
            desc = 'Meteorological Delta indicates non-standard atmospheric tension.' + apiDataString;
            action = actionLabel + "Prepare contingency harvesting. Withhold non-essential resource allocation until variance passes.";
        } else {
            desc = 'Optimal thermodynamic flow for human and agricultural output.' + apiDataString;
            action = actionLabel + "Execute Phase 2 expansion. Maximize resource allocation while quadrature window remains open.";
        }
    }

    const html = `
        <div style="font-family: 'JetBrains Mono'; font-size: 0.8rem; color: var(--starlight); line-height: 1.5;">${desc}</div>
        <div style="background: rgba(245, 158, 11, 0.1); border-left: 3px solid var(--squall-amber); padding: 10px; margin-top: 10px; font-family: 'Orbitron'; color: var(--white-pure); font-size: 0.7rem; letter-spacing: 1px;">${action}</div>
    `;
    if(window.Q_ModalEngine) window.Q_ModalEngine.render('&#x26A0;&#xFE0E; IMPACT DIAGNOSTIC', html);
};

// --- CORE PHYSICS SYNC BRIDGE ---
window.addEventListener('q-tick', (e) => {
    const { t, isLive, activeTime, daysElapsed, qData, legacyDateStr, legacyTimeStr, activePostulate } = e.detail;
    
    const userLon = window.Q_USER_LONGITUDE !== undefined ? window.Q_USER_LONGITUDE : -82.8001; 
    
    // 1. DEBOUNCED ASTRONOMICAL TELEMETRY SYNC
    const simD = new Date(activeTime);
    const simDateStr = `${simD.getUTCFullYear()}-${String(simD.getUTCMonth()+1).padStart(2,'0')}-${String(simD.getUTCDate()).padStart(2,'0')}`;
    
    if (simDateStr !== window.Q_LAST_ASTRO_DATE) {
        window.Q_LAST_ASTRO_DATE = simDateStr;
        clearTimeout(window.Q_ASTRO_DEBOUNCE);
        window.Q_ASTRO_DEBOUNCE = setTimeout(() => {
            fetchAstroDataForDate(simDateStr);
        }, 400); 
    }
    
    // 2. UPDATE 3D KINEMATICS STRICTLY FROM Q-CORE PAYLOAD
    if (scene && camera && renderer) {
        updateGlobeKinematics(activeTime, daysElapsed, userLon, qData.delta);
        renderer.render(scene, camera);
    }

    // 3. DOM UPDATES & METRIC CONVERSION
    let isImp = (unitSystem === 'IMPERIAL');

    function formatApiTime(dObj) {
        if (!dObj || isNaN(dObj.getTime())) return "--:--";
        let hr = dObj.getHours();
        let min = dObj.getMinutes();
        let tz = isImp ? (hr >= 12 ? ' PM' : ' AM') : '';
        if (isImp && hr > 12) hr -= 12;
        if (isImp && hr === 0) hr = 12;
        return `${hr.toString().padStart(2,'0')}:${min.toString().padStart(2,'0')}${tz}`;
    }

    const valSolarNoon = document.getElementById('val-solar-noon');
    const valDawn = document.getElementById('val-dawn');
    const valDusk = document.getElementById('val-dusk');
    const valTwiC = document.getElementById('val-twi-c');
    const valTwiN = document.getElementById('val-twi-n');
    const valTwiA = document.getElementById('val-twi-a');

    if (window.Q_METEO_SUNRISE && window.Q_METEO_SUNSET && window.Q_METEO_NOON) {
        if (valDawn) valDawn.innerText = formatApiTime(window.Q_METEO_SUNRISE);
        if (valDusk) valDusk.innerText = formatApiTime(window.Q_METEO_SUNSET);
        if (valSolarNoon) valSolarNoon.innerText = formatApiTime(window.Q_METEO_NOON);
        if (valTwiC) valTwiC.innerText = formatApiTime(window.Q_METEO_TWI_C);
        if (valTwiN) valTwiN.innerText = formatApiTime(window.Q_METEO_TWI_N);
        if (valTwiA) valTwiA.innerText = formatApiTime(window.Q_METEO_TWI_A);
    } else {
        if (valDawn) valDawn.innerText = "--:--";
        if (valDusk) valDusk.innerText = "--:--";
        if (valSolarNoon) valSolarNoon.innerText = "--:--";
        if (valTwiC) valTwiC.innerText = "--:--";
        if (valTwiN) valTwiN.innerText = "--:--";
        if (valTwiA) valTwiA.innerText = "--:--";
    }

    const valSst = document.getElementById('val-sst');
    if(valSst) valSst.innerText = isImp ? '-1.4 °F' : '-0.8 °C';

    const valGulf = document.getElementById('val-gulf');
    if(valGulf) valGulf.innerText = isImp ? '3.1 MPH' : '1.4 M/S';

    const valJet = document.getElementById('val-jet');
    if(valJet) valJet.innerText = isImp ? '138 MPH' : '222 KM/H';

    const valTropo = document.getElementById('val-tropo');
    if(valTropo) valTropo.innerText = isImp ? '10 MILES' : '16 KM';

    const trueArc = qData.trueArc;
    
    if (Math.abs(qData.delta) > 0.025 && window.Q_PHASE_III) {
        window.Q_PHASE_III.executeThermicOverride(qData.delta);
    }

    const continuousMeanDeg = daysElapsed * (360 / 365.24219);
    const continuousTrueDeg = continuousMeanDeg + qData.delta;
    const actionRing = document.getElementById('action-horizon-ring');
    if (actionRing) {
        actionRing.style.transform = `rotate(${continuousTrueDeg}deg)`;
    }

    let dangerProximity = Math.abs(Math.sin((trueArc * Math.PI) / 90)); 
    currentRiskVal = Math.floor(dangerProximity * 85) + 10; 
    
    if (liveWeather && isLive) {
        if (liveWeather.precipitation > 0) currentRiskVal += (liveWeather.precipitation * 2);
        if (liveWeather.surface_pressure < 1005) currentRiskVal += 15;
        if (liveWeather.direct_normal_irradiance > 600) currentRiskVal += 10;
        currentRiskVal = Math.min(currentRiskVal, 99);
    } 
    
    let riskEl = document.getElementById('risk-index');
    let hazardEl = document.getElementById('hazard-status');
    let yieldEl = document.getElementById('strat-yield');
    let allocEl = document.getElementById('strat-alloc');
    let horizonEl = document.getElementById('strat-horizon');
    
    if (hazardEl) hazardEl.onclick = (e) => { e.stopPropagation(); window.openImpact(); };
    if (yieldEl) yieldEl.onclick = (e) => { e.stopPropagation(); window.openImpact(); };
    if (allocEl) allocEl.onclick = (e) => { e.stopPropagation(); window.openImpact(); };
    
    if(riskEl) riskEl.innerText = currentRiskVal + '% (ORBITAL DELTA)';
    if(currentRiskVal >= alertThreshold) {
        if(hazardEl) hazardEl.innerText = "IMMINENT THREAT";
    } else if (currentRiskVal >= alertThreshold - 25) {
        if(hazardEl) hazardEl.innerText = "ELEVATED CONCERN";
    } else {
        if(hazardEl) hazardEl.innerText = "MONITORED / STABLE";
    }

    sparkBars.forEach((bar, index) => {
        let pastArc = trueArc - (30 - index);
        let pastDanger = Math.abs(Math.sin((pastArc * Math.PI) / 90));
        let h = Math.floor(pastDanger * 14);
        if(bar) {
            bar.style.height = h + 'px';
            bar.style.background = "var(--env-green)";
        }
    });

    if(horizonEl) horizonEl.innerText = actionHorizon === 'SECTOR' ? '+30.00° (SECTOR)' : '+14.00° (SEASONAL)';

    if (showDelta) {
        const valPress = document.getElementById('val-pressure');
        if(valPress) {
            let deltaPress = currentRiskVal / 10;
            let sign = currentRiskVal > 50 ? '-' : '+';
            let v = isImp ? (deltaPress * 0.02953).toFixed(2) : deltaPress.toFixed(1);
            let u = isImp ? 'inHg' : 'hPa';
            valPress.innerText = `${sign}${v} ${u}`;
        }
        const valIrr = document.getElementById('val-irradiance');
        if(valIrr) {
            valIrr.innerText = (currentRiskVal > 50 ? '-12' : '+4') + ' W/m²';
        }
        const valTemp = document.getElementById('val-temp');
        if(valTemp) {
            let deltaTemp = currentRiskVal / 15;
            let sign = currentRiskVal > 50 ? '+' : '-';
            let v = isImp ? (deltaTemp * 9/5).toFixed(1) : deltaTemp.toFixed(1);
            let u = isImp ? '°F' : '°C';
            valTemp.innerText = `${sign}${v} ${u}`;
        }
    } else {
        let currentTempC = 22.0;
        let currentPress = (1015 - Math.floor(currentRiskVal/2));
        
        if (liveWeather && isLive) {
            currentTempC = liveWeather.temperature_2m;
            currentPress = liveWeather.surface_pressure;
            
            const valIrr = document.getElementById('val-irradiance');
            if(valIrr) valIrr.innerText = liveWeather.direct_normal_irradiance.toFixed(1) + ' W/m²';
        } else {
            const valIrr = document.getElementById('val-irradiance');
            if(valIrr) valIrr.innerText = "ACTIVE / NOMINAL";
        }
        
        const valPress = document.getElementById('val-pressure');
        if(valPress) {
            let v = isImp ? (currentPress * 0.02953).toFixed(2) : currentPress.toFixed(1);
            let u = isImp ? 'inHg' : 'hPa';
            valPress.innerText = `${v} ${u}`;
        }
        
        const valTemp = document.getElementById('val-temp');
        if(valTemp) {
            let v = isImp ? (currentTempC * 9/5 + 32).toFixed(1) : currentTempC.toFixed(1);
            let u = isImp ? '°F' : '°C';
            valTemp.innerText = `${v} ${u}`;
        }
    }

    if (currentAssetMode === "FAUNA") {
        if(currentRiskVal >= alertThreshold) {
            if(yieldEl) { yieldEl.innerText = "LETHAL ZONE"; }
            if(allocEl) { allocEl.innerText = "SHELTER / HYDRATE"; }
        } else if (currentRiskVal >= alertThreshold - 25) {
            if(yieldEl) { yieldEl.innerText = "BEHAVIORAL SHIFT"; }
            if(allocEl) { allocEl.innerText = "ADJUST CALORIC BURN"; }
        } else {
            if(yieldEl) { yieldEl.innerText = "NOMINAL EXPOSURE"; }
            if(allocEl) { allocEl.innerText = "STANDARD ROUTINE"; }
        }
    } else {
        if(currentRiskVal >= alertThreshold) {
            if(yieldEl) { yieldEl.innerText = "COMPROMISED"; }
            if(allocEl) { allocEl.innerText = "EMERGENCY SHIELD"; }
        } else if (currentRiskVal >= alertThreshold - 25) {
            if(yieldEl) { yieldEl.innerText = "MODERATE VARIANCE"; }
            if(allocEl) { allocEl.innerText = "CONSERVATION MODE"; }
        } else {
            if(yieldEl) { yieldEl.innerText = "OPTIMAL / GROWTH"; }
            if(allocEl) { allocEl.innerText = "PHASE 2 (EXPANSION)"; }
        }
    }
    
    let tensionEl = document.getElementById('agri-tension');
    if(tensionEl) {
        if (qData.quad === 1) { tensionEl.innerText = "DORMANT / GATHER"; }
        else if (qData.quad === 2) { tensionEl.innerText = "AWAKENING / PUSH"; }
        else if (qData.quad === 3) { tensionEl.innerText = "CLIMAX / SUSTAIN"; }
        else { tensionEl.innerText = "RECESSION / HARVEST"; }
    }
    
    const solarBaselineTempC = thermoBaseline + 10 * Math.sin((trueArc - 90) * Math.PI / 180);
    let currentTempC = (liveWeather && isLive) ? liveWeather.temperature_2m : 22.0;
    let thermoFrictionC = Math.abs(currentTempC - solarBaselineTempC);
    
    const thermoFrictionEl = document.getElementById('thermo-friction');
    if (thermoFrictionEl) {
        let fricDisp = isImp ? (thermoFrictionC * 9/5).toFixed(2) : thermoFrictionC.toFixed(2);
        let u = isImp ? 'ΔF' : 'ΔC';
        thermoFrictionEl.innerText = `${fricDisp} ${u}`;
    }
});

// --- NATIVE 3D PHYSICS ENGINE ---
function initThreeGlobe() {
    const container = document.getElementById('webgl-globe');
    if (!container) return;
    
    scene = new THREE.Scene();
    
    camera = new THREE.PerspectiveCamera(45, container.clientWidth / container.clientHeight, 0.1, 100);
    camera.position.z = 2.3; 
    
    renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(container.clientWidth, container.clientHeight);
    container.appendChild(renderer.domElement);

    const loader = new THREE.TextureLoader();
    loader.setCrossOrigin("anonymous");
    
    // Base Earth
    const earthGeo = new THREE.SphereGeometry(1, 64, 64);
    const earthMat = new THREE.MeshStandardMaterial({
        map: loader.load('https://raw.githubusercontent.com/mrdoob/three.js/master/examples/textures/planets/earth_atmos_2048.jpg'),
        roughness: 0.8
    });
    earthMesh = new THREE.Mesh(earthGeo, earthMat);
    scene.add(earthMesh);

    // Live Cloud Layer
    const cloudGeo = new THREE.SphereGeometry(1.015, 64, 64);
    const cloudMat = new THREE.MeshStandardMaterial({
        map: loader.load('https://raw.githubusercontent.com/mrdoob/three.js/master/examples/textures/planets/earth_clouds_1024.png'),
        transparent: true,
        opacity: 0.8,
        blending: THREE.AdditiveBlending,
        depthWrite: false
    });
    cloudMesh = new THREE.Mesh(cloudGeo, cloudMat);
    scene.add(cloudMesh);

    // Dynamic Nocturnal Mask (ShaderMaterial)
    const nightGeo = new THREE.SphereGeometry(1.002, 64, 64);
    const nightShader = {
        uniforms: {
            tNight: { value: loader.load('https://raw.githubusercontent.com/mrdoob/three.js/master/examples/textures/planets/earth_lights_2048.png') },
            sunPos: { value: new THREE.Vector3(0, 0, 5) }
        },
        vertexShader: `
            varying vec2 vUv;
            varying vec3 vWorldNormal;
            void main() {
                vUv = uv;
                vWorldNormal = normalize(mat3(modelMatrix) * normal);
                gl_Position = projectionMatrix * viewMatrix * modelMatrix * vec4(position, 1.0);
            }
        `,
        fragmentShader: `
            uniform sampler2D tNight;
            uniform vec3 sunPos;
            varying vec2 vUv;
            varying vec3 vWorldNormal;
            void main() {
                vec3 nightColor = texture2D(tNight, vUv).rgb;
                vec3 sunDir = normalize(sunPos);
                
                // Dot product calculates angle between surface normal and sun vector
                float intensity = dot(vWorldNormal, sunDir);
                
                // Fade lights in strictly on the dark hemisphere (-0.2 is deep shadow)
                float alpha = smoothstep(0.05, -0.2, intensity);
                gl_FragColor = vec4(nightColor, alpha);
            }
        `,
        transparent: true,
        blending: THREE.AdditiveBlending,
        depthWrite: false
    };
    const nightMat = new THREE.ShaderMaterial(nightShader);
    nightMesh = new THREE.Mesh(nightGeo, nightMat);
    scene.add(nightMesh);

    // The Sun (Directional Light)
    sunLight = new THREE.DirectionalLight(0xffffff, 1.5);
    scene.add(sunLight);
    
    // Starlight Ambient Base (Crushed to expose the dark side terminator contrast)
    const ambient = new THREE.AmbientLight(0x111b33, 0.15);
    scene.add(ambient);
    
    // --- RESTRICTED SPHERICAL CAMERA DRAG CONTROLLER ---
    renderer.domElement.style.touchAction = 'none';

    renderer.domElement.addEventListener('pointerdown', (e) => {
        // KILL SWITCH: If the UI button is set to ECLIPTIC, entirely reject the mouse input.
        if (!isFreeCam) return; 
        
        isDragging = true;
        prevMouseX = e.clientX;
        prevMouseY = e.clientY;
        if (window.showAxisHUD) window.showAxisHUD('FREE-CAM ORBIT ACTIVE');
    });
    
    window.addEventListener('pointermove', (e) => {
        if (!isDragging || !camera) return;
        
        const deltaX = e.clientX - prevMouseX;
        const deltaY = e.clientY - prevMouseY;
        
        // Map 2D pixel drag to 3D spherical radians
        camTheta -= deltaX * 0.005;
        camPhi -= deltaY * 0.005;
        
        // Clamp Phi to prevent camera from flipping upside down at the poles
        camPhi = Math.max(0.001, Math.min(Math.PI - 0.001, camPhi));
        
        // Apply pure spherical coordinate matrix
        const radius = 2.3;
        camera.position.x = radius * Math.sin(camPhi) * Math.sin(camTheta);
        camera.position.y = radius * Math.cos(camPhi);
        camera.position.z = radius * Math.sin(camPhi) * Math.cos(camTheta);
        camera.lookAt(0, 0, 0);
        
        prevMouseX = e.clientX;
        prevMouseY = e.clientY;
    });
    
    window.addEventListener('pointerup', () => {
        isDragging = false;
    });
    // ----------------------------------------

    window.addEventListener('resize', () => {
        if(container && camera && renderer) {
            camera.aspect = container.clientWidth / container.clientHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(container.clientWidth, container.clientHeight);
        }
    });
}

// THE KINEMATIC BRIDGE (Triggered exclusively by Q-Core q-tick)
function updateGlobeKinematics(activeTimeMs, daysElapsed, userLon, qDataDelta) {
    if (!earthMesh || !cloudMesh || !sunLight) return;

    // 1. ECLIPTIC CAMERA LOCK (Viewport securely anchored to local longitude)
    // Keep Earth mesh upright to prevent 3D geometric shear.
    earthMesh.rotation.x = 0;
    earthMesh.rotation.z = 0;

    const rotationOffset = -(Math.PI / 2); 
    const rotationY = -(userLon * (Math.PI / 180)) + rotationOffset;
    earthMesh.rotation.y = rotationY;

    // 1b. ATMOSPHERIC DRIFT
    const atmosphericSlip = (daysElapsed * 0.03) * (Math.PI * 2);
    cloudMesh.rotation.y = rotationY + atmosphericSlip;
    cloudMesh.rotation.x = 0;

    // 2. TRUE COPERNICAN DECLINATION (The Sun shifts North/South)
    // Eliminates Ptolemaic diagonal shear by tilting the Sun's orbit along the Ecliptic plane.
    const declinationRad = -Math.cos((daysElapsed / 365.24219) * Math.PI * 2) * (23.44 * Math.PI / 180);

    // 3. DIURNAL SWEEP (Absolute Solar Noon Anchor)
    let theta = 0;
    
    // SAFEGUARD: Only execute API anchor if the async fetch has completed and returned a valid date
    if (window.Q_METEO_NOON && !isNaN(window.Q_METEO_NOON.getTime())) {
        const noonMs = window.Q_METEO_NOON.getTime();
        const msOffset = activeTimeMs - noonMs;
        
        // PHYSICS: Clockwise celestial rotation across the X-Z plane
        theta = -(msOffset / 86400000) * (Math.PI * 2);
    } else {
        // FALLBACK: Execute geometric standard rotation while API is fetching or if offline
        const d = new Date(activeTimeMs);
        const timeFractionUTC = (d.getUTCHours() + (d.getUTCMinutes() / 60) + (d.getUTCSeconds() / 3600)) / 24;
        let localTimeFraction = (timeFractionUTC + (userLon / 360)) % 1;
        if (localTimeFraction < 0) localTimeFraction += 1;
        theta = (0.5 - localTimeFraction) * (Math.PI * 2);
    }
    
    // Map the Sun's orbit applying the seasonal declination to the Y-axis.
    const sunDistance = 5;
    const sunY = sunDistance * Math.sin(declinationRad); 
    const sunRadiusXZ = sunDistance * Math.cos(declinationRad); 
    
    const sunX = sunRadiusXZ * Math.sin(theta);
    const sunZ = sunRadiusXZ * Math.cos(theta);

    sunLight.position.set(sunX, sunY, sunZ);

    // 4. NOCTURNAL SHADER SYNC
    if (nightMesh) {
        nightMesh.rotation.y = rotationY;
        nightMesh.rotation.x = 0;
        if (nightMesh.material.uniforms) {
            nightMesh.material.uniforms.sunPos.value.set(sunX, sunY, sunZ);
        }
    }

    // 5. CAMERA STATE ENFORCEMENT
    if (!isFreeCam && camera) {
        camera.position.set(0, 0, 2.3);
        camera.lookAt(0, 0, 0);
    }
}

// DECOUPLED BOOT SEQUENCE - Bound strictly to q-ui.js emission
window.addEventListener('q-ui-mounted', () => {
    if(isBooted) return;
    const tlNode = document.getElementById('quad-tl') || document.getElementById('quad-BIO');
    if(!tlNode) return; 

    isBooted = true;
    window.injectVectorData();
    initSparklines();
    initThreeGlobe();
    fetchMeteoData();
    fetchAtmosphericLayer();
    
    // Initial Boot Fetch for Astronomical Data
    const dObj = new Date();
    const localDateStr = `${dObj.getUTCFullYear()}-${String(dObj.getUTCMonth()+1).padStart(2,'0')}-${String(dObj.getUTCDate()).padStart(2,'0')}`;
    window.Q_LAST_ASTRO_DATE = localDateStr;
    fetchAstroDataForDate(localDateStr);
});

if (document.readyState === 'complete' || document.readyState === 'interactive') {
    setTimeout(() => {
        if(!isBooted && document.getElementById('quad-tl')) {
            isBooted = true;
            window.injectVectorData();
            initSparklines();
            initThreeGlobe();
            fetchMeteoData();
            fetchAtmosphericLayer();
            
            const dObj = new Date();
            const localDateStr = `${dObj.getUTCFullYear()}-${String(dObj.getUTCMonth()+1).padStart(2,'0')}-${String(dObj.getUTCDate()).padStart(2,'0')}`;
            window.Q_LAST_ASTRO_DATE = localDateStr;
            fetchAstroDataForDate(localDateStr);
        }
    }, 500);
}
setInterval(fetchMeteoData, 300000);
setInterval(fetchAtmosphericLayer, 300000);

// ==========================================
// LOCALIZED METEOROLOGICAL SCRUBBER ENGINE
// ==========================================

function injectLocalScrubber() {
    const scrubberContainer = document.createElement('div');
    scrubberContainer.className = "q-global-controls q-scrubber-panel";
    scrubberContainer.id = "q-universal-controls";
    scrubberContainer.innerHTML = `
        <div class="scrub-row-1">
            <button id="q-cam-toggle" class="btn-micro">[ CAM: ECLIPTIC ]</button>
            <div class="macro-micro-group">
                <button id="q-macro-rev" class="btn-micro" title="Season Macro">&lt;&lt;</button>
                <button id="q-micro-rev" class="btn-micro" title="Season Micro">&lt;</button>
                <button id="q-macro-stop" class="btn-micro" disabled>||</button>
                <button id="q-micro-fwd" class="btn-micro" title="Season Micro">&gt;</button>
                <button id="q-macro-fwd" class="btn-micro" title="Season Macro">&gt;&gt;</button>
            </div>
            <button id="q-live-toggle" class="btn-micro active">LIVE</button>
        </div>
        <div class="scrub-row-2">
            <button id="q-time-macro-rev" class="btn-micro" title="Time Macro">&lt;&lt;</button>
            <button id="q-time-micro-rev" class="btn-micro" title="Time Micro">&lt;</button>
            <input type="range" id="q-global-scrubber" min="-365" max="365" step="any" value="0" class="q-scrubber">
            <button id="q-time-micro-fwd" class="btn-micro" title="Time Micro">&gt;</button>
            <button id="q-time-macro-fwd" class="btn-micro" title="Time Macro">&gt;&gt;</button>
        </div>
    `;
    document.body.appendChild(scrubberContainer);

    window.bindMasterTickScrubber();
    window.syncScrubberUI();
    window.attachScrubberEvents();
}

window.bindMasterTickScrubber = function() {
    window.addEventListener('q-tick', (e) => {
        const { isLive, daysElapsed } = e.detail;
        if (isLive) {
            const scrubber = document.getElementById('q-global-scrubber');
            if (scrubber) {
                let sMax = parseInt(scrubber.max);
                let sMin = parseInt(scrubber.min);
                if (daysElapsed >= sMax - 90) scrubber.max = Math.floor(daysElapsed) + 365;
                if (daysElapsed <= sMin + 90) scrubber.min = Math.floor(daysElapsed) - 365;
                scrubber.value = daysElapsed;
            }
        }
    });
};

window.getSimState = function() {
    try { let stored = localStorage.getItem('Q_MASTER_CLOCK'); if (stored) return JSON.parse(stored); } catch(e) {}
    return { isLive: true, simTime: Date.now() };
};

window.setSimState = function(state) {
    let payload = JSON.stringify(state);
    localStorage.setItem('Q_MASTER_CLOCK', payload);
    window.dispatchEvent(new StorageEvent('storage', { key: 'Q_MASTER_CLOCK', newValue: payload }));
    if (window.Q_STATE) { window.Q_STATE.isLive = state.isLive; window.Q_STATE.simTime = state.simTime; }
};

window.setLiveClock = function() {
    if(window.stopMacroLoop) window.stopMacroLoop();
    let state = { isLive: true, simTime: Date.now() };
    window.setSimState(state);
    if(window.Q_MobileBridge) window.Q_MobileBridge.pulse('HEAVY');
    const camBtn = document.getElementById('q-cam-toggle');
    if (camBtn) { camBtn.innerText = '[ CAM: ECLIPTIC ]'; camBtn.classList.remove('active'); }
    window.dispatchEvent(new CustomEvent('q-camera-toggle', { detail: { isFree: false } }));
    window.syncScrubberUI();
};

window.syncScrubberUI = function() {
    if(!window.getSimState) return;
    const state = window.getSimState();
    const liveBtn = document.getElementById('q-live-toggle');
    const scrubber = document.getElementById('q-global-scrubber');
    if(liveBtn) { liveBtn.classList.toggle('active', state.isLive); liveBtn.innerText = state.isLive ? "LIVE" : "RESYNC"; }
    if (scrubber && window.ANCHOR_ALPHA_DYNAMIC) {
        let targetTime = state.isLive ? Date.now() : state.simTime;
        let daysElapsed = (targetTime - window.ANCHOR_ALPHA_DYNAMIC) / 86400000;
        let currentDay = Math.floor(daysElapsed);
        let sMax = parseInt(scrubber.max); let sMin = parseInt(scrubber.min);
        if (currentDay >= sMax - 90) scrubber.max = currentDay + 365;
        if (currentDay <= sMin + 90) scrubber.min = currentDay - 365;
        scrubber.value = daysElapsed;
    }
};

let macroInterval = null; let timeLoopInterval = null;

window.stopMacroLoop = function() {
    if (macroInterval) { clearInterval(macroInterval); macroInterval = null; }
    if (timeLoopInterval) { clearInterval(timeLoopInterval); timeLoopInterval = null; }
    const btnStop = document.getElementById('q-macro-stop');
    const btnRevSeason = document.getElementById('q-macro-rev');
    const btnFwdSeason = document.getElementById('q-macro-fwd');
    const btnRevTime = document.getElementById('q-time-macro-rev');
    const btnFwdTime = document.getElementById('q-time-macro-fwd');
    const btnMicroRevTime = document.getElementById('q-time-micro-rev');
    const btnMicroFwdTime = document.getElementById('q-time-micro-fwd');
    if (btnStop) btnStop.disabled = true;
    if (btnRevSeason) btnRevSeason.classList.remove('active');
    if (btnFwdSeason) btnFwdSeason.classList.remove('active');
    if (btnRevTime) btnRevTime.classList.remove('active');
    if (btnFwdTime) btnFwdTime.classList.remove('active');
    if (btnMicroRevTime) btnMicroRevTime.classList.remove('active');
    if (btnMicroFwdTime) btnMicroFwdTime.classList.remove('active');
};

window.executeMicroStep = function(daysDelta) {
    window.stopMacroLoop();
    let state = window.getSimState();
    if (state.isLive) { state.isLive = false; state.simTime = Date.now(); }
    state.simTime += daysDelta * 86400000;
    window.setSimState(state); window.syncScrubberUI();
};

window.executeMacroLoop = function(direction) {
    window.stopMacroLoop();
    let state = window.getSimState();
    if (state.isLive) { state.isLive = false; state.simTime = Date.now(); }
    const btnStop = document.getElementById('q-macro-stop');
    const activeBtn = document.getElementById(direction < 0 ? 'q-macro-rev' : 'q-macro-fwd');
    if (btnStop) btnStop.disabled = false; if (activeBtn) activeBtn.classList.add('active');
    macroInterval = setInterval(() => { state.simTime += direction * 86400000; window.setSimState(state); window.syncScrubberUI(); }, 66); 
};

window.executeTimeLoop = function(direction, stepMs, activeBtnId) {
    window.stopMacroLoop();
    let state = window.getSimState();
    if (state.isLive) { state.isLive = false; state.simTime = Date.now(); }
    const btnStop = document.getElementById('q-macro-stop');
    const activeBtn = document.getElementById(activeBtnId);
    if (btnStop) btnStop.disabled = false; if (activeBtn) activeBtn.classList.add('active');
    timeLoopInterval = setInterval(() => { state.simTime += direction * stepMs; window.setSimState(state); window.syncScrubberUI(); }, 33); 
};

window.attachScrubberEvents = function() {
    const liveToggle = document.getElementById('q-live-toggle');
    const scrubber = document.getElementById('q-global-scrubber');
    const camToggle = document.getElementById('q-cam-toggle');
    
    if (liveToggle) liveToggle.addEventListener('click', () => window.setLiveClock());
    if (camToggle) {
        camToggle.addEventListener('click', () => {
            const isCurrentlyFree = camToggle.classList.contains('active');
            if (isCurrentlyFree) {
                camToggle.classList.remove('active'); camToggle.innerText = '[ CAM: ECLIPTIC ]';
                window.dispatchEvent(new CustomEvent('q-camera-toggle', { detail: { isFree: false } }));
            } else {
                camToggle.classList.add('active'); camToggle.innerText = '[ CAM: FREE ]';
                window.dispatchEvent(new CustomEvent('q-camera-toggle', { detail: { isFree: true } }));
            }
        });
    }
    if (scrubber) {
        scrubber.addEventListener('input', (e) => {
            window.stopMacroLoop();
            let val = parseFloat(e.target.value);
            let msOffset = window.ANCHOR_ALPHA_DYNAMIC + (val * 86400000);
            window.setSimState({ isLive: false, simTime: msOffset });
            window.syncScrubberUI();
        });
    }

    document.getElementById('q-micro-rev')?.addEventListener('click', () => window.executeMicroStep(-1));
    document.getElementById('q-micro-fwd')?.addEventListener('click', () => window.executeMicroStep(1));
    document.getElementById('q-macro-rev')?.addEventListener('click', () => window.executeMacroLoop(-1));
    document.getElementById('q-macro-fwd')?.addEventListener('click', () => window.executeMacroLoop(1));
    document.getElementById('q-macro-stop')?.addEventListener('click', window.stopMacroLoop);
    
    document.getElementById('q-time-macro-rev')?.addEventListener('click', () => window.executeTimeLoop(-1, 87300000, 'q-time-macro-rev'));
    document.getElementById('q-time-micro-rev')?.addEventListener('click', () => window.executeTimeLoop(-1, 900000, 'q-time-micro-rev'));
    document.getElementById('q-time-micro-fwd')?.addEventListener('click', () => window.executeTimeLoop(1, 900000, 'q-time-micro-fwd'));
    document.getElementById('q-time-macro-fwd')?.addEventListener('click', () => window.executeTimeLoop(1, 87300000, 'q-time-macro-fwd'));
};

// Auto-inject on load
if (document.readyState === 'complete' || document.readyState === 'interactive') {
    setTimeout(injectLocalScrubber, 600);
} else {
    window.addEventListener('DOMContentLoaded', () => setTimeout(injectLocalScrubber, 600));
}