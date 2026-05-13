// THE QUADRATURE: METEOROLOGICAL VECTOR ENGINE
// Architect: Kelby | Engineer: Kairos
// STATUS: Phase IV UI Engine. Decoupled Logic & Math Engine.
// REVISION: Guaranteed DOM Mount Hooking & Correct Transit Mathematical Restore.

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

    if (optTL) { optTL.onclick = (e) => { e.stopPropagation(); window.openOptions(e, 'risk'); }; optTL.style.color = 'var(--env-green)'; }
    if (optTR) { optTR.onclick = (e) => { e.stopPropagation(); window.openOptions(e, 'meteo'); }; optTR.style.color = 'var(--env-green)'; }
    if (optBL) { optBL.onclick = (e) => { e.stopPropagation(); window.openOptions(e, 'model'); }; optBL.style.color = 'var(--env-green)'; }
    if (optBR) { optBR.onclick = (e) => { e.stopPropagation(); window.openOptions(e, 'phase'); }; optBR.style.color = 'var(--env-green)'; }

    const quadTL = document.getElementById('quad-tl') || document.getElementById('quad-BIO');
    if (quadTL) {
        quadTL.innerHTML = `
            <div class="panel-data-wrapper">
                <div class="v-head">RISK ASSESSMENT</div>
                <div class="t-row"><span>SYSTEM HOOK:</span> <span id="iot-status-badge" class="val-sm val-highlight">IOT: ACTIVE</span></div>
                <div class="t-row"><span>PROBABILITY INDEX:</span> <span class="val-sm val-highlight" id="risk-index">EPHEMERIS SYNCED</span></div>
                <div class="sparkline-container" id="risk-sparkline"></div>
                <div class="t-row"><span>ADVERSE CONDITION:</span> <span class="val-sm val-highlight" id="hazard-status" style="cursor:pointer;" onclick="window.openImpact()">MONITORED</span></div>
            </div>
        `;
    }

    const quadTR = document.getElementById('quad-tr') || document.getElementById('quad-COM');
    if (quadTR) {
        quadTR.innerHTML = `
            <div class="panel-data-wrapper" style="cursor: pointer;" onclick="window.toggleDeltaView()">
                <div class="v-head">METEOROLOGICAL</div>
                <div class="t-row"><span>DATA STREAM:</span> <span id="meteo-badge" class="val-sm val-highlight">ATMOS DELTA: LIVE</span></div>
                <div class="t-row"><span id="lbl-pressure">ATMOSPHERIC PRESSURE:</span> <span class="val-sm val-highlight" id="val-pressure">1013 hPa</span></div>
                <div class="t-row"><span id="lbl-irradiance">SOLAR IRRADIANCE:</span> <span class="val-sm val-highlight" id="val-irradiance">ACTIVE</span></div>
                <div class="t-row"><span id="lbl-precip">VOLUME / TREND:</span> <span class="val-sm val-highlight" id="val-precip">0.0mm / STABLE</span></div>
            </div>
        `;
    }

    const quadBL = document.getElementById('quad-bl') || document.getElementById('quad-ENV');
    if (quadBL) {
        quadBL.innerHTML = `
            <div class="panel-data-wrapper">
                <div class="v-head" id="strat-header">EXPOSURE MODELING</div>
                <div class="t-row"><span id="lbl-yield">YIELD PROJECTION:</span> <span class="val-sm val-highlight" id="strat-yield" style="cursor:pointer;" onclick="window.openImpact()">OPTIMAL</span></div>
                <div class="t-row"><span id="lbl-alloc">RESOURCE ALLOC:</span> <span class="val-sm val-highlight" id="strat-alloc" style="cursor:pointer;" onclick="window.openImpact()">PHASE 2 (GROWTH)</span></div>
                <div class="t-row"><span>ACTION HORIZON:</span> <span class="val-sm val-highlight" id="strat-horizon">+14.00°</span></div>
            </div>
        `;
    }

    const quadBR = document.getElementById('quad-br') || document.getElementById('quad-MEC');
    if (quadBR) {
        quadBR.innerHTML = `
            <div class="panel-data-wrapper">
                <div class="v-head">ENVIRONMENTAL</div>
                <div class="t-row"><span>AMBIENT TEMP:</span> <span class="val-sm val-highlight" id="val-temp">-- °C</span></div>
                <div class="t-row"><span>BIOME TENSION:</span> <span class="val-sm val-highlight" id="agri-tension">DORMANT / GATHER</span></div>
                <div class="t-row"><span>THERMODYNAMIC FRICTION:</span> <span class="val-sm val-highlight" id="thermo-friction">--</span></div>
            </div>
        `;
    }
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

function renderSeasonalMarkers(mode) {
    const container = document.getElementById('seasonal-markers');
    if(!container) return;
    container.innerHTML = '';
    
    const markers = [
        { arc: 45, icon: mode === 'FAUNA' ? '❄️' : '🌱' },
        { arc: 135, icon: mode === 'FAUNA' ? '🐣' : '🌿' },
        { arc: 225, icon: mode === 'FAUNA' ? '☀️' : '🌾' },
        { arc: 315, icon: mode === 'FAUNA' ? '🍂' : '🍁' }
    ];
    
    markers.forEach(m => {
        let el = document.createElement('div');
        el.className = 'seasonal-marker';
        el.innerText = m.icon;
        let angle = (m.arc - 90) * (Math.PI / 180);
        let x = 50 + 40 * Math.cos(angle);
        let y = 50 + 40 * Math.sin(angle);
        el.style.left = x + '%';
        el.style.top = y + '%';
        container.appendChild(el);
    });
}

function renderOrbitalNodes() {
    const container = document.getElementById('orbital-nodes');
    if(!container) return;
    container.innerHTML = '';
    
    let peri = document.createElement('div');
    peri.className = 'perihelion-marker';
    let pAngle = (14 - 90) * (Math.PI / 180);
    peri.style.left = (50 + 40 * Math.cos(pAngle)) + '%';
    peri.style.top = (50 + 40 * Math.sin(pAngle)) + '%';
    peri.innerHTML = '<div class="astro-tooltip"><div class="astro-tt-head">PERIHELION (14.00°)</div>Maximum orbital velocity. True Ellipse acceleration.</div>';
    container.appendChild(peri);

    let aph = document.createElement('div');
    aph.className = 'aphelion-marker';
    let aAngle = (194 - 90) * (Math.PI / 180);
    aph.style.left = (50 + 40 * Math.cos(aAngle)) + '%';
    aph.style.top = (50 + 40 * Math.sin(aAngle)) + '%';
    aph.innerHTML = '<div class="astro-tooltip"><div class="astro-tt-head">APHELION (194.00°)</div>Minimum orbital velocity. True Ellipse deceleration.</div>';
    container.appendChild(aph);
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
    renderSeasonalMarkers(mode);
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
                <label style="font-size: 0.6rem; color: rgba(255,255,255,0.6); font-family: 'Orbitron'; letter-spacing: 1px;">MICRO-CLIMATE ANCHOR</label>
                <select id="climate-anchor" class="modal-input" style="background: rgba(0,0,0,0.6); border: 1px solid var(--env-green); color: #fff; padding: 10px; font-family: 'JetBrains Mono'; font-size: 0.8rem; border-radius: 4px; outline: none; margin-top: 4px; width: 100%;">
                    <option value="CLW" ${climateAnchor==='CLW'?'selected':''}>Clearwater, FL (Current Base)</option>
                    <option value="PHL" ${climateAnchor==='PHL'?'selected':''}>Philadelphia, PA (Eastern Seaboard)</option>
                    <option value="ENC" ${climateAnchor==='ENC'?'selected':''}>Encino, CA (Western Coastal)</option>
                    <option value="GLOBAL" ${climateAnchor==='GLOBAL'?'selected':''}>Global Average (Macro)</option>
                </select>
            </div>
            <div style="margin-top: 10px;">
                <label style="font-size: 0.6rem; color: rgba(255,255,255,0.6); font-family: 'Orbitron'; letter-spacing: 1px;">BAROMETRIC UNIT</label>
                <select id="baro-unit" class="modal-input" style="background: rgba(0,0,0,0.6); border: 1px solid var(--env-green); color: #fff; padding: 10px; font-family: 'JetBrains Mono'; font-size: 0.8rem; border-radius: 4px; outline: none; margin-top: 4px; width: 100%;">
                    <option value="hPa" ${baroUnit==='hPa'?'selected':''}>HECTOPASCALS (hPa)</option>
                    <option value="inHg" ${baroUnit==='inHg'?'selected':''}>INCHES OF MERCURY (inHg)</option>
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
                <label style="font-size: 0.6rem; color: rgba(255,255,255,0.6); font-family: 'Orbitron'; letter-spacing: 1px;">TEMPERATURE UNIT</label>
                <select id="temp-unit" class="modal-input" style="background: rgba(0,0,0,0.6); border: 1px solid var(--env-green); color: #fff; padding: 10px; font-family: 'JetBrains Mono'; font-size: 0.8rem; border-radius: 4px; outline: none; margin-top: 4px; width: 100%;">
                    <option value="C" ${tempUnit==='C'?'selected':''}>CELSIUS (°C)</option>
                    <option value="F" ${tempUnit==='F'?'selected':''}>FAHRENHEIT (°F)</option>
                </select>
            </div>
            <div style="margin-top: 10px;">
                <label style="font-size: 0.6rem; color: rgba(255,255,255,0.6); font-family: 'Orbitron'; letter-spacing: 1px;">THERMODYNAMIC BASELINE (COMFORT): <span id="base-val" style="color:var(--env-green);">${thermoBaseline.toFixed(1)}°</span></label>
                <input type="range" id="thermo-base" min="15" max="30" step="0.5" value="${thermoBaseline}" class="modal-input" oninput="document.getElementById('base-val').innerText = this.value + '°'" style="width: 100%; margin-top: 4px;">
            </div>
            <div style="margin-top: 10px;">
                <label style="font-size: 0.6rem; color: rgba(255,255,255,0.6); font-family: 'Orbitron'; letter-spacing: 1px;">CROSS-VECTOR SYNC (BIO)</label>
                <select id="cv-sync" class="modal-input" style="background: rgba(0,0,0,0.6); border: 1px solid var(--env-green); color: #fff; padding: 10px; font-family: 'JetBrains Mono'; font-size: 0.8rem; border-radius: 4px; outline: none; margin-top: 4px; width: 100%;">
                    <option value="ACTIVE" ${crossVectorSync?'selected':''}>ACTIVE (PUSH HRV ALERTS)</option>
                    <option value="DISABLED" ${!crossVectorSync?'selected':''}>DISABLED (ISOLATED)</option>
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
        const pEl = document.getElementById('iot-protocol');
        if(pEl) iotProtocol = pEl.value;
    } else if (currentOptTarget === 'meteo') {
        const cEl = document.getElementById('climate-anchor');
        if(cEl) climateAnchor = cEl.value;
        const bEl = document.getElementById('baro-unit');
        if(bEl) baroUnit = bEl.value;
        fetchMeteoData();
    } else if (currentOptTarget === 'model') {
        const aEl = document.getElementById('asset-track');
        if(aEl) currentAssetMode = aEl.value;
        const hEl = document.getElementById('action-horizon');
        if(hEl) actionHorizon = hEl.value;
        window.updateAssetLabels();
    } else if (currentOptTarget === 'phase') {
        const uEl = document.getElementById('temp-unit');
        if(uEl) tempUnit = uEl.value;
        const tbEl = document.getElementById('thermo-base');
        if(tbEl) thermoBaseline = parseFloat(tbEl.value);
        const cvEl = document.getElementById('cv-sync');
        if(cvEl) crossVectorSync = cvEl.value === 'ACTIVE';
    }
    if(window.Q_ModalEngine) window.Q_ModalEngine.close();
};

window.logShieldingIntent = function() {
    if(!window.ANCHOR_ALPHA_DYNAMIC) return;
    const state = window.getSimState ? window.getSimState() : null;
    if(!state) return;
    const t = state.isLive ? Date.now() : state.simTime;
    const pDate = new Date(t);
    const y = pDate.getFullYear();
    const mo = (pDate.getMonth()+1).toString().padStart(2,'0');
    const d = pDate.getDate().toString().padStart(2,'0');
    const key = `${y}-${mo}-${d}-12-00`; 

    if(window.loadPlannerData) window.loadPlannerData();
    if(!window.qData) window.qData = {};
    if(!window.qData[key]) window.qData[key] = { text: "", link: "" };

    if(!window.qData[key].text.includes("[SHIELDING/SHELTER]")) {
        window.qData[key].text = `[SHIELDING/SHELTER] SEVERE ENVIRONMENTAL HAZARD DETECTED. SHELTER PROTOCOL ENGAGED.\n` + window.qData[key].text;
        if(window.savePlannerData) window.savePlannerData();
        window.dispatchEvent(new Event('storage'));
    }
    
    if(window.Q_MobileBridge) window.Q_MobileBridge.pulse('HEAVY');
    
    if(window.Q_OmniPlanner && window.Q_OmniPlanner.openPlanner) {
        window.Q_OmniPlanner.jumpToDate(`${y}-${mo}-${d}`);
        window.Q_OmniPlanner.openPlanner(true);
    } else if (window.Q_ModalEngine) {
        window.Q_ModalEngine.render('INTENT LOGGED', '<div style="color:var(--env-green); text-align:center; font-family:\'JetBrains Mono\';">SHIELDING/SHELTER intent synchronized to Omni-Planner.</div>', 'ACKNOWLEDGE');
    }
};

window.openImpact = function() {
    if(!window.getSimState) return;
    const isLive = window.getSimState().isLive;
    let severity = currentRiskVal >= alertThreshold ? "SEVERE" : (currentRiskVal >= alertThreshold - 25 ? "ELEVATED" : "NOMINAL");
    let apiDataString = "";
    
    if (liveWeather && isLive) {
        let pDisp = baroUnit === 'inHg' ? (liveWeather.surface_pressure * 0.02953).toFixed(2) + ' inHg' : liveWeather.surface_pressure.toFixed(1) + ' hPa';
        let tDisp = tempUnit === 'F' ? (liveWeather.temperature_2m * 9/5 + 32).toFixed(1) + ' °F' : liveWeather.temperature_2m.toFixed(1) + ' °C';
        apiDataString = '<br><br><span style="color:var(--atmos-blue); font-size:0.65rem; line-height: 1.4; display:block; border-top: 1px dashed var(--atmos-blue); padding-top: 8px; margin-top: 8px;"><strong>[ CROSS-VECTOR API TELEMETRY ]</strong><br>&#x2022; OPEN-METEO (Env): Temp ' + tDisp + ' | Pressure ' + pDisp + ' | Irradiance ' + liveWeather.direct_normal_irradiance + 'W/m²</span>';
    }

    let iotHook = (window.Q_STATE && window.Q_STATE.hardware_hooks) ? window.Q_STATE.hardware_hooks.iot_webhooks : 'STANDBY';
    let iotString = '<span style="color:var(--env-green); font-weight:bold;">[IoT: ' + iotProtocol + ']</span> ';

    let desc = "", action = "";

    if (currentAssetMode === "FAUNA") {
        if (severity === "SEVERE") {
            desc = 'Lethal exposure thresholds projected (' + currentRiskVal + '% probability). Significant drop in ambient survivability indices.' + apiDataString;
            action = iotString + "ACTION: Mandate indoor sheltering. Adjust feeding schedules to match metabolic caloric burn requirements for extreme temperature resistance.";
        } else if (severity === "ELEVATED") {
            desc = 'Behavioral shift markers detected. Approaching stressful ambient conditions.' + apiDataString;
            action = iotString + "ACTION: Shift K-9 or livestock exercise routines to cooler Arc degrees. Increase hydration provisions.";
        } else {
            desc = 'Nominal biological exposure limits.' + apiDataString;
            action = iotString + "ACTION: Maintain standard husbandry cycles and outdoor exposure allowances.";
        }
    } else { 
        if (severity === "SEVERE") {
            desc = 'Historical cross-reference confirms a ' + currentRiskVal + '% probability of extreme exposure phenomena at this exact coordinate.' + apiDataString;
            action = iotString + "ACTION: Execute immediate flora shielding. Alter thermodynamic allocation to mitigate shock.";
        } else if (severity === "ELEVATED") {
            desc = 'Meteorological Delta indicates non-standard atmospheric tension.' + apiDataString;
            action = iotString + "ACTION: Prepare contingency harvesting. Withhold non-essential resource allocation until variance passes.";
        } else {
            desc = 'Optimal thermodynamic flow for human and agricultural output.' + apiDataString;
            action = iotString + "ACTION: Execute Phase 2 expansion. Maximize resource allocation while quadrature window remains open.";
        }
    }

    const html = `
        <div style="font-family: 'JetBrains Mono'; font-size: 0.8rem; color: var(--starlight); line-height: 1.5;">${desc}</div>
        <div style="background: rgba(245, 158, 11, 0.1); border-left: 3px solid var(--squall-amber); padding: 10px; margin-top: 10px; font-family: 'Orbitron'; color: var(--white-pure); font-size: 0.7rem; letter-spacing: 1px;">${action}</div>
    `;
    if(window.Q_ModalEngine) window.Q_ModalEngine.render('&#x26A0;&#xFE0E; IMPACT DIAGNOSTIC', html);
};

window.addEventListener('q-tick', (e) => {
    const { t, isLive, activeTime, daysElapsed, qData, legacyDateStr, legacyTimeStr, activePostulate } = e.detail;
    
    const badge = document.getElementById('iot-status-badge');
    if(badge) badge.innerText = 'IOT: ' + iotProtocol;

    const trueArc = qData.trueArc;
    
    if (Math.abs(qData.delta) > 0.025 && window.Q_PHASE_III) {
        window.Q_PHASE_III.executeThermicOverride(qData.delta);
    }

    // EXACT MATH RESTORED FROM ENVVECHUD.HTML BASELINE
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
        
        if(iotProtocol === "AUTONOMOUS") {
            window.logShieldingIntent();
        } else {
            if(hazardEl) hazardEl.onclick = (e) => { e.stopPropagation(); window.logShieldingIntent(); };
            if(yieldEl) yieldEl.onclick = (e) => { e.stopPropagation(); window.logShieldingIntent(); };
            if(allocEl) allocEl.onclick = (e) => { e.stopPropagation(); window.logShieldingIntent(); };
        }
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
            let v = baroUnit === 'inHg' ? (deltaPress * 0.02953).toFixed(2) : deltaPress.toFixed(1);
            let u = baroUnit === 'inHg' ? 'inHg' : 'hPa';
            valPress.innerText = `${sign}${v} ${u}`;
        }
        const valIrr = document.getElementById('val-irradiance');
        if(valIrr) {
            valIrr.innerText = (currentRiskVal > 50 ? '-12' : '+4') + ' W/m²';
        }
        const valPrecip = document.getElementById('val-precip');
        if(valPrecip) {
            valPrecip.innerText = (currentRiskVal > 50 ? '+45%' : '-5%') + ' FROM NORM';
        }
        const valTemp = document.getElementById('val-temp');
        if(valTemp) {
            let deltaTemp = currentRiskVal / 15;
            let sign = currentRiskVal > 50 ? '+' : '-';
            let v = tempUnit === 'F' ? (deltaTemp * 9/5).toFixed(1) : deltaTemp.toFixed(1);
            let u = tempUnit === 'F' ? '°F' : '°C';
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
            
            const valPrecip = document.getElementById('val-precip');
            if(valPrecip) {
                valPrecip.innerText = liveWeather.precipitation.toFixed(1) + 'mm / LIVE';
            }
        } else {
            const valIrr = document.getElementById('val-irradiance');
            if(valIrr) valIrr.innerText = "ACTIVE / NOMINAL";
            const valPrecip = document.getElementById('val-precip');
            if(valPrecip) {
                valPrecip.innerText = "0.0mm / STABLE";
            }
        }
        
        const valPress = document.getElementById('val-pressure');
        if(valPress) {
            let v = baroUnit === 'inHg' ? (currentPress * 0.02953).toFixed(2) : currentPress.toFixed(1);
            let u = baroUnit === 'inHg' ? 'inHg' : 'hPa';
            valPress.innerText = `${v} ${u}`;
        }
        
        const valTemp = document.getElementById('val-temp');
        if(valTemp) {
            let v = tempUnit === 'F' ? (currentTempC * 9/5 + 32).toFixed(1) : currentTempC.toFixed(1);
            let u = tempUnit === 'F' ? '°F' : '°C';
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
        let fricDisp = tempUnit === 'F' ? (thermoFrictionC * 9/5).toFixed(2) : thermoFrictionC.toFixed(2);
        let u = tempUnit === 'F' ? 'ΔF' : 'ΔC';
        thermoFrictionEl.innerText = `${fricDisp} ${u}`;
    }
});

// DECOUPLED BOOT SEQUENCE - Bound strictly to q-ui.js emission
window.addEventListener('q-ui-mounted', () => {
    if(isBooted) return;
    const tlNode = document.getElementById('quad-tl') || document.getElementById('quad-BIO');
    if(!tlNode) return; 

    isBooted = true;
    window.injectVectorData();
    initSparklines();
    renderSeasonalMarkers(currentAssetMode);
    renderOrbitalNodes();
    fetchMeteoData();
});

// Fallback execution block if `q-ui-mounted` fired before this file initialized
if (document.readyState === 'complete' || document.readyState === 'interactive') {
    setTimeout(() => {
        if(!isBooted && document.getElementById('q-ui-injected-flag')) {
            isBooted = true;
            window.injectVectorData();
            initSparklines();
            renderSeasonalMarkers(currentAssetMode);
            renderOrbitalNodes();
            fetchMeteoData();
        }
    }, 150);
}

setInterval(fetchMeteoData, 300000);