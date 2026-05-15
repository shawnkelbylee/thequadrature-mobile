// THE QUADRATURE: METEOROLOGICAL VECTOR ENGINE
// Architect: Kelby | Engineer: Kairos
// STATUS: Phase V. Ecliptic-Anchored Seasonal Terminator & Live Atmosphere.
// REVISION: Corrected East-West Terminator Sweep, API URL Patch, Scrubber State Hook.

let liveWeather = null;
let sparkBars = [];
let showDelta = false;

let alertThreshold = 75;
let currentAssetMode = "FLORA";
let iotProtocol = "MANUAL";
let climateAnchor = "CLW";
let baroUnit = "hPa";
let actionHorizon = "ANCHOR";
let tempUnit = "C";
let thermoBaseline = 22.0;
let crossVectorSync = true;

let currentRiskVal = 0;
let currentOptTarget = '';
let isBooted = false;

window.injectVectorData = function() {
    const optTL = document.getElementById('opt-tl') || document.querySelectorAll('.opt-oval')[0];
    const optTR = document.getElementById('opt-tr') || document.querySelectorAll('.opt-oval')[1];
    const optBL = document.getElementById('opt-bl') || document.querySelectorAll('.opt-oval')[2];
    const optBR = document.getElementById('opt-br') || document.querySelectorAll('.opt-oval')[3];

    if (optTL) { optTL.onclick = (e) => { e.stopPropagation(); window.openOptions(e, 'insolation'); }; optTL.style.color = 'var(--env-green)'; }
    if (optTR) { optTR.onclick = (e) => { e.stopPropagation(); window.openOptions(e, 'hydrosphere'); }; optTR.style.color = 'var(--env-green)'; }
    if (optBL) { optBL.onclick = (e) => { e.stopPropagation(); window.openOptions(e, 'troposphere'); }; optBL.style.color = 'var(--env-green)'; }
    if (optBR) { optBR.onclick = (e) => { e.stopPropagation(); window.openOptions(e, 'stratosphere'); }; optBR.style.color = 'var(--env-green)'; }

    const quadTL = document.getElementById('quad-tl') || document.getElementById('quad-BIO');
    if (quadTL) quadTL.innerHTML = `<div class="panel-data-wrapper" id="pnl-insolation"><div class="v-head">INSOLATION</div><div class="t-row"><span class="w-lbl">LOCAL NOON ZENITH:</span> <span class="val-sm val-highlight">84.2° (PEAK)</span></div><div class="t-row"><span class="w-lbl">PEAK UV INDEX:</span> <span class="val-sm val-highlight">11.4 (EXTREME)</span></div><div class="t-row"><span class="w-lbl">LUMEN DENSITY:</span> <span class="val-sm val-highlight">98,500 LUX</span></div></div>`;

    const quadTR = document.getElementById('quad-tr') || document.getElementById('quad-COM');
    if (quadTR) quadTR.innerHTML = `<div class="panel-data-wrapper" id="pnl-hydro"><div class="v-head">HYDROSPHERE</div><div class="t-row"><span class="w-lbl">ENSO STATE:</span> <span class="val-sm val-highlight">LA NIÑA (COOL)</span></div><div class="t-row"><span class="w-lbl">SST ANOMALY:</span> <span class="val-sm val-highlight">-0.8°C</span></div><div class="t-row"><span class="w-lbl">GULF STREAM VEL:</span> <span class="val-sm val-highlight">1.4 M/S</span></div></div>`;

    const quadBL = document.getElementById('quad-bl') || document.getElementById('quad-ENV');
    if (quadBL) quadBL.innerHTML = `<div class="panel-data-wrapper" id="pnl-tropo"><div class="v-head">TROPOSPHERE</div><div class="t-row"><span class="w-lbl">BAROMETRIC PRESS:</span> <span class="val-sm val-highlight" id="val-pressure">1013 hPa</span></div><div class="t-row"><span class="w-lbl">AMBIENT TEMP:</span> <span class="val-sm val-highlight" id="val-temp">22.0 °C</span></div><div class="t-row"><span class="w-lbl">REL HUMIDITY:</span> <span class="val-sm val-highlight">68%</span></div></div>`;

    const quadBR = document.getElementById('quad-br') || document.getElementById('quad-MEC');
    if (quadBR) quadBR.innerHTML = `<div class="panel-data-wrapper" id="pnl-strato"><div class="v-head">STRATOSPHERE</div><div class="t-row"><span class="w-lbl">JET STREAM VEL:</span> <span class="val-sm val-highlight">120 KT</span></div><div class="t-row"><span class="w-lbl">POLAR VORTEX:</span> <span class="val-sm val-highlight">STABLE (LOCKED)</span></div><div class="t-row"><span class="w-lbl">TROPOPAUSE HGT:</span> <span class="val-sm val-highlight">16 KM</span></div></div>`;
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

async function fetchMeteoData() {
    const API_LOCATIONS = {
        'CLW': { lat: 27.9659, lon: -82.8001 },
        'PHL': { lat: 39.9526, lon: -75.1652 },
        'ENC': { lat: 34.1593, lon: -118.5012 },
        'GLOBAL': { lat: window.Q_STATE?.location?.lat || 0, lon: window.Q_STATE?.location?.lon || 0 }
    };

    const loc = API_LOCATIONS[climateAnchor] || API_LOCATIONS['CLW']; 
    
    try {
        const response = await fetch('https://api.open-meteo.com/v1/forecast?latitude=' + loc.lat + '&longitude=' + loc.lon + '&current=surface_pressure,direct_normal_irradiance,precipitation,temperature_2m');
        if (!response.ok) throw new Error('HTTP ' + response.status);
        const data = await response.json();
        if (data && data.current) {
            liveWeather = data.current;
            if(window.Q_LOG) window.Q_LOG('INFO', 'ENVIRONMENTAL', 'METEO_API_SYNC', data.current);
            const badge = document.getElementById('meteo-badge');
            if(badge) {
                badge.innerText = "ATMOS DELTA: LIVE";
            }
        }
    } catch (error) {
        if(window.Q_LOG) window.Q_LOG('ERROR', 'ENVIRONMENTAL', 'METEO_API_FAILED', { error: error.message, fallback: 'STATIC_BASELINE' });
        const badge = document.getElementById('meteo-badge');
        if(badge) {
            badge.innerText = "STATIC BASELINE (DEGRADED)";
        }
        liveWeather = null;
    }
}

function fetchAtmosphericLayer() {
    fetch('https://api.rainviewer.com/public/weather-maps.json')
    .then(res => res.json())
    .then(data => {
        const host = data.host;
        if (data.satellite && data.satellite.infrared && data.satellite.infrared.length > 0) {
            const lastInfrared = data.satellite.infrared[data.satellite.infrared.length - 1];
            const path = lastInfrared.path;
            
            // Corrected RainViewer schema: /{size}/{z}/{x}/{y}/{color}/{options}.png
            const tileUrl = `${host}${path}/2048/0/0/0/0/0_0.png`;
            const fallbackUrl = 'https://raw.githubusercontent.com/mrdoob/three.js/master/examples/textures/planets/earth_clouds_1024.png';
            
            const atmos = document.getElementById('diurnal-atmosphere');
            if (atmos) {
                // Layer the API over the fallback to guarantee coverage
                atmos.style.backgroundImage = `url('${tileUrl}'), url('${fallbackUrl}')`;
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
        title = "RISK ASSESSMENT METRICS";
        html = `
            <div>
                <label style="font-size: 0.6rem; color: rgba(255,255,255,0.6); font-family: 'Orbitron'; letter-spacing: 1px;">RISK THRESHOLD SENSITIVITY: <span id="thresh-val" style="color:var(--env-green);">${alertThreshold}%</span></label>
                <input type="range" id="risk-thresh" min="50" max="95" value="${alertThreshold}" class="modal-input" oninput="document.getElementById('thresh-val').innerText = this.value + '%'" style="width: 100%; margin-top: 4px;">
            </div>
            <div style="margin-top: 10px;">
                <label style="font-size: 0.6rem; color: rgba(255,255,255,0.6); font-family: 'Orbitron'; letter-spacing: 1px;">IOT SHIELDING PROTOCOL</label>
                <select id="iot-protocol" class="modal-input" style="background: rgba(0,0,0,0.6); border: 1px solid var(--env-green); color: #fff; padding: 10px; font-family: 'JetBrains Mono'; font-size: 0.8rem; border-radius: 4px; outline: none; margin-top: 4px; width: 100%;">
                    <option value="MANUAL" ${iotProtocol==='MANUAL'?'selected':''}>MANUAL (USER CONFIRMATION)</option>
                    <option value="AUTONOMOUS" ${iotProtocol==='AUTONOMOUS'?'selected':''}>AUTONOMOUS (AUTO-TRIGGER)</option>
                </select>
            </div>
        `;
    } else if (target === 'meteo') {
        title = "METEOROLOGICAL DATA SOURCE";
        html = `
            <div>
                <label style="font-size: 0.6rem; color: rgba