// THE QUADRATURE: ASTROPHYSICAL VECTOR ENGINE
// Architect: Kelby | Engineer: Kairos
// STATUS: Phase VIII UI Engine. Top-Zero Clockwise Mapping & Logarithmic Macro.

let isBooted = false;
let currentOptTarget = '';
let isMacroView = false;
let astroScrubInterval = null;

// Local User Preferences for Panel Rendering
let panelPrefs = {
    tl: 'SYNODIC',   // SYNODIC | APSIDAL
    tr: 'MASS',      // MASS | MOMENTUM
    bl: 'KINETIC',   // KINETIC | FRICTION
    br: 'TRUE_MEAN'  // TRUE_MEAN | CHRONO
};

// Logarithmic approximation of orbital radii (percentages relative to container)
const ORBITS = {
    MERCURY: 19.3,
    VENUS: 36.1,
    EARTH: 50.0,
    MARS: 76.0,
    JUPITER: 160.0,
    SATURN: 280.0,
    URANUS: 400.0,
    NEPTUNE: 520.0
};

// Orbital periods in Earth days
const PERIODS = {
    MERCURY: 87.97,
    VENUS: 224.70,
    EARTH: 365.24219,
    MARS: 686.98,
    JUPITER: 4332.59,
    SATURN: 10759.22,
    URANUS: 30688.5,
    NEPTUNE: 60182.0
};

// Baseline Heliocentric Offsets mapped for the May 17, 2026 Epoch
const EPOCH_OFFSETS = {
    MERCURY: 215.4,
    VENUS: 118.2,
    MARS: 45.6,
    JUPITER: 112.3,
    SATURN: 355.8,
    URANUS: 68.4,
    NEPTUNE: 350.1
};

window.injectVectorData = function() {
    const optTL = document.getElementById('opt-tl') || document.querySelectorAll('.opt-oval')[0];
    const optTR = document.getElementById('opt-tr') || document.querySelectorAll('.opt-oval')[1];
    const optBL = document.getElementById('opt-bl') || document.querySelectorAll('.opt-oval')[2];
    const optBR = document.getElementById('opt-br') || document.querySelectorAll('.opt-oval')[3];

    if (optTL) { optTL.onclick = (e) => { e.stopPropagation(); window.openOptions(e, 'tl'); }; optTL.style.color = 'var(--cyan-glow)'; }
    if (optTR) { optTR.onclick = (e) => { e.stopPropagation(); window.openOptions(e, 'tr'); }; optTR.style.color = 'var(--cyan-glow)'; }
    if (optBL) { optBL.onclick = (e) => { e.stopPropagation(); window.openOptions(e, 'bl'); }; optBL.style.color = 'var(--cyan-glow)'; }
    if (optBR) { optBR.onclick = (e) => { e.stopPropagation(); window.openOptions(e, 'br'); }; optBR.style.color = 'var(--cyan-glow)'; }

    const quadTL = document.getElementById('quad-tl') || document.getElementById('quad-BIO');
    if (quadTL) {
        if (panelPrefs.tl === 'SYNODIC') {
            quadTL.innerHTML = `
                <div class="panel-data-wrapper">
                    <div class="v-head">LUNAR KINEMATICS</div>
                    <div class="t-row"><span class="w-lbl">SYNODIC PHASE:</span> <span class="val-sm" id="lunar-p1">--</span></div>
                    <div class="t-row"><span class="w-lbl">ILLUMINATION:</span> <span class="val-sm" id="lunar-p2">--%</span></div>
                    <div class="t-row"><span class="w-lbl">SYNODIC DAY:</span> <span class="val-sm" id="lunar-p3">-- / 29.5</span></div>
                </div>`;
        } else {
            quadTL.innerHTML = `
                <div class="panel-data-wrapper">
                    <div class="v-head">LUNAR APSIDES</div>
                    <div class="t-row"><span class="w-lbl">ORBITAL PROXIMITY:</span> <span class="val-sm" id="lunar-p1">--</span></div>
                    <div class="t-row"><span class="w-lbl">GRAVITATIONAL LOAD:</span> <span class="val-sm" id="lunar-p2">--x</span></div>
                    <div class="t-row"><span class="w-lbl">LUNAR Q-DELTA:</span> <span class="val-sm" id="lunar-p3">--°</span></div>
                </div>`;
        }
    }

    const quadTR = document.getElementById('quad-tr') || document.getElementById('quad-COM');
    if (quadTR) {
        if (panelPrefs.tr === 'MASS') {
            quadTR.innerHTML = `
                <div class="panel-data-wrapper">
                    <div class="v-head">BARYCENTRIC TRACKING</div>
                    <div class="t-row"><span class="w-lbl">PRIMARY INFLUENCER:</span> <span class="val-sm" style="color:#ff9933;">JUPITER</span></div>
                    <div class="t-row"><span class="w-lbl">SOLAR WOBBLE:</span> <span class="val-sm" id="bary-p2">-- R☉</span></div>
                    <div class="t-row"><span class="w-lbl">BARYCENTER STATE:</span> <span class="val-sm" id="bary-p3">--</span></div>
                </div>`;
        } else {
            quadTR.innerHTML = `
                <div class="panel-data-wrapper">
                    <div class="v-head">ANGULAR MOMENTUM</div>
                    <div class="t-row"><span class="w-lbl">SYSTEM MOMENTUM:</span> <span class="val-sm" id="bary-p1">--</span></div>
                    <div class="t-row"><span class="w-lbl">JOVIAN DELTA:</span> <span class="val-sm" id="bary-p2">--°</span></div>
                    <div class="t-row"><span class="w-lbl">SATURNIAN DELTA:</span> <span class="val-sm" id="bary-p3">--°</span></div>
                </div>`;
        }
    }

    const quadBL = document.getElementById('quad-bl') || document.getElementById('quad-ENV');
    if (quadBL) {
        if (panelPrefs.bl === 'KINETIC') {
            quadBL.innerHTML = `
                <div class="panel-data-wrapper">
                    <div class="v-head">PLANETARY VELOCITY</div>
                    <div class="t-row"><span class="w-lbl">ORBITAL SPEED:</span> <span class="val-sm" id="vel-p1">-- KM/S</span></div>
                    <div class="t-row"><span class="w-lbl">KEPLERIAN MULTIPLIER:</span> <span class="val-sm" id="vel-p2">--x</span></div>
                    <div class="t-row"><span class="w-lbl">APSIDAL PROXIMITY:</span> <span class="val-sm" id="vel-p3" style="color:var(--magenta-glow);">--</span></div>
                </div>`;
        } else {
            quadBL.innerHTML = `
                <div class="panel-data-wrapper">
                    <div class="v-head">SYSTEMIC FRICTION</div>
                    <div class="t-row"><span class="w-lbl">ORBITAL SPEED:</span> <span class="val-sm" id="vel-p1">-- KM/S</span></div>
                    <div class="t-row"><span class="w-lbl">VENUS VELOCITY DELTA:</span> <span class="val-sm" id="vel-p2">-- KM/S</span></div>
                    <div class="t-row"><span class="w-lbl">MARS VELOCITY DELTA:</span> <span class="val-sm" id="vel-p3">-- KM/S</span></div>
                </div>`;
        }
    }

    const quadBR = document.getElementById('quad-br') || document.getElementById('quad-MEC');
    if (quadBR) {
        if (panelPrefs.br === 'TRUE_MEAN') {
            quadBR.innerHTML = `
                <div class="panel-data-wrapper">
                    <div class="v-head">EQUATION OF TIME</div>
                    <div class="t-row"><span class="w-lbl">MEAN ANOMALY (CIVIL):</span> <span class="val-sm" id="eq-p1">--°</span></div>
                    <div class="t-row"><span class="w-lbl">TRUE ANOMALY (PHYSICS):</span> <span class="val-sm" id="eq-p2">--°</span></div>
                    <div class="val-display" style="padding:4px 8px; margin-top:4px;">
                        <div class="w-lbl" style="margin-bottom:2px;">KINEMATIC DRIFT (Q-DELTA)</div>
                        <div id="eq-p3" style="font-size:0.8rem; color:var(--cyan-glow); font-family:'Orbitron'; font-weight:900; text-shadow:0 0 8px var(--cyan-dim);">--°</div>
                    </div>
                </div>`;
        } else {
            quadBR.innerHTML = `
                <div class="panel-data-wrapper">
                    <div class="v-head">CHRONO DISTORTION</div>
                    <div class="t-row"><span class="w-lbl">APPARENT SOLAR NOON:</span> <span class="val-sm" id="eq-p1">--</span></div>
                    <div class="t-row"><span class="w-lbl">MEAN SOLAR NOON:</span> <span class="val-sm" id="eq-p2">12:00:00</span></div>
                    <div class="t-row"><span class="w-lbl">THERMODYNAMIC LAG:</span> <span class="val-sm" id="eq-p3" style="color:var(--gold);">ACTIVE</span></div>
                </div>`;
        }
    }
};

window.showNeedleHUD = function(text, color) { 
    const hud = document.getElementById('needle-hud'); 
    if (hud) {
        hud.innerText = text; 
        hud.style.borderColor = color; 
        hud.style.color = color; 
        hud.style.opacity = '1'; 
    }
};

window.hideNeedleHUD = function() { 
    const hud = document.getElementById('needle-hud');
    if (hud) hud.style.opacity = '0'; 
};

window.openOptions = function(e, target) {
    if(e) e.stopPropagation();
    currentOptTarget = target;
    let title = ""; let html = "";

    if(target === 'tl') {
        title = "LUNAR KINEMATICS";
        html = `
            <select id="opt-select" class="modal-input" style="background: rgba(0,0,0,0.6); border: 1px solid var(--cyan-glow); color: #fff; padding: 10px; font-family: 'JetBrains Mono'; font-size: 0.8rem; border-radius: 4px; outline: none; width: 100%;">
                <option value="SYNODIC" ${panelPrefs.tl==='SYNODIC'?'selected':''}>SYNODIC STANDARD (PHASE)</option>
                <option value="APSIDAL" ${panelPrefs.tl==='APSIDAL'?'selected':''}>APSIDAL FOCUS (PROXIMITY)</option>
            </select>`;
    } else if (target === 'tr') {
        title = "BARYCENTRIC TRACKING";
        html = `
            <select id="opt-select" class="modal-input" style="background: rgba(0,0,0,0.6); border: 1px solid var(--cyan-glow); color: #fff; padding: 10px; font-family: 'JetBrains Mono'; font-size: 0.8rem; border-radius: 4px; outline: none; width: 100%;">
                <option value="MASS" ${panelPrefs.tr==='MASS'?'selected':''}>MASS INFLUENCE (WOBBLE)</option>
                <option value="MOMENTUM" ${panelPrefs.tr==='MOMENTUM'?'selected':''}>ANGULAR MOMENTUM (DELTA)</option>
            </select>`;
    } else if (target === 'bl') {
        title = "PLANETARY VELOCITY";
        html = `
            <select id="opt-select" class="modal-input" style="background: rgba(0,0,0,0.6); border: 1px solid var(--cyan-glow); color: #fff; padding: 10px; font-family: 'JetBrains Mono'; font-size: 0.8rem; border-radius: 4px; outline: none; width: 100%;">
                <option value="KINETIC" ${panelPrefs.bl==='KINETIC'?'selected':''}>KINETIC ACCELERATION</option>
                <option value="FRICTION" ${panelPrefs.bl==='FRICTION'?'selected':''}>RELATIVE SYSTEMIC FRICTION</option>
            </select>`;
    } else if (target === 'br') {
        title = "EQUATION OF TIME";
        html = `
            <select id="opt-select" class="modal-input" style="background: rgba(0,0,0,0.6); border: 1px solid var(--cyan-glow); color: #fff; padding: 10px; font-family: 'JetBrains Mono'; font-size: 0.8rem; border-radius: 4px; outline: none; width: 100%;">
                <option value="TRUE_MEAN" ${panelPrefs.br==='TRUE_MEAN'?'selected':''}>TRUE VS. MEAN (Q-DELTA)</option>
                <option value="CHRONO" ${panelPrefs.br==='CHRONO'?'selected':''}>CHRONOLOGICAL DISTORTION</option>
            </select>`;
    }

    if (window.Q_ModalEngine) window.Q_ModalEngine.render(title, html, 'APPLY KINEMATICS', window.saveOptions);
};

window.saveOptions = function() {
    const sel = document.getElementById('opt-select');
    if (sel && currentOptTarget) {
        panelPrefs[currentOptTarget] = sel.value;
        window.injectVectorData();
    }
    if (window.Q_ModalEngine) window.Q_ModalEngine.close();
};

window.openAnchorModal = function(node) {
    if(window.Q_LOG) window.Q_LOG('INFO', 'ASTRO', `Anchor inspected: ${node}`);
    // Defers to q-ui standard anchor modal payload
};

function injectAstroScrubber() {
    const container = document.createElement('div');
    container.className = 'q-astro-controls';
    container.innerHTML = `
        <div class="astro-scrub-row">
            <button class="btn-astro active" id="btn-ast-live">LIVE KINEMATICS</button>
            <div style="width: 1px; height: 15px; background: rgba(255,255,255,0.2); margin: 0 10px;"></div>
            <button class="btn-astro" id="btn-ast-rev" title="Rewind Orbit">&lt;&lt;</button>
            <button class="btn-astro" id="btn-ast-stop">||</button>
            <button class="btn-astro" id="btn-ast-fwd" title="Fast Forward Orbit">&gt;&gt;</button>
            <button class="btn-astro btn-macro-zoom" id="btn-macro-zoom">[ MACRO ZOOM ]</button>
        </div>
    `;
    document.body.appendChild(container);

    document.getElementById('btn-ast-live').addEventListener('click', () => {
        if(astroScrubInterval) clearInterval(astroScrubInterval);
        
        let payload = JSON.stringify({ isLive: true, simTime: Date.now(), scrubSpeed: 0 });
        localStorage.setItem('Q_MASTER_CLOCK', payload);
        window.dispatchEvent(new StorageEvent('storage', { key: 'Q_MASTER_CLOCK', newValue: payload }));
        if(window.Q_STATE) { window.Q_STATE.isLive = true; window.Q_STATE.simTime = Date.now(); }
        
        document.getElementById('btn-ast-live').classList.add('active');
    });

    document.getElementById('btn-ast-stop').addEventListener('click', () => {
        if(astroScrubInterval) clearInterval(astroScrubInterval);
        document.getElementById('btn-ast-live').classList.remove('active');
    });

    const runSim = (direction) => {
        if(astroScrubInterval) clearInterval(astroScrubInterval);
        document.getElementById('btn-ast-live').classList.remove('active');
        let state = window.getSimState ? window.getSimState() : { isLive: false, simTime: Date.now() };
        if(state.isLive) { state.isLive = false; state.simTime = Date.now(); }
        
        astroScrubInterval = setInterval(() => {
            state.simTime += direction * 86400000; 
            
            let payload = JSON.stringify(state);
            localStorage.setItem('Q_MASTER_CLOCK', payload);
            window.dispatchEvent(new StorageEvent('storage', { key: 'Q_MASTER_CLOCK', newValue: payload }));
            if(window.Q_STATE) { window.Q_STATE.isLive = false; window.Q_STATE.simTime = state.simTime; }
            
        }, 33);
    };

    document.getElementById('btn-ast-rev').addEventListener('click', () => runSim(-1));
    document.getElementById('btn-ast-fwd').addEventListener('click', () => runSim(1));

    document.getElementById('btn-macro-zoom').addEventListener('click', (e) => {
        isMacroView = !isMacroView;
        e.target.classList.toggle('active', isMacroView);
        document.getElementById('sys-container').parentElement.classList.toggle('macro-active', isMacroView);
    });
}

// Top=0° Clockwise Progression Algorithm
function p2c(radiusPct, angleDeg) {
    const rad = angleDeg * Math.PI / 180.0;
    return { 
        x: 50 + (radiusPct / 2 * Math.sin(rad)), 
        y: 50 - (radiusPct / 2 * Math.cos(rad)) 
    };
}

window.addEventListener('q-tick', (e) => {
    const { t, qData, daysElapsed } = e.detail;

    // --- DYNAMIC TELEMETRY POPULATION ---
    const p1_tl = document.getElementById('lunar-p1');
    const p2_tl = document.getElementById('lunar-p2');
    const p3_tl = document.getElementById('lunar-p3');
    const lunarPhase = qData.lunarPhase || 0; 
    
    if (panelPrefs.tl === 'SYNODIC' && p1_tl) {
        const lunarIllum = (1 - Math.cos(lunarPhase * Math.PI * 2)) / 2 * 100;
        let phaseText = "NEW MOON";
        if (lunarPhase > 0.03 && lunarPhase < 0.22) phaseText = "WAXING CRESCENT";
        else if (lunarPhase >= 0.22 && lunarPhase <= 0.28) phaseText = "FIRST QUARTER";
        else if (lunarPhase > 0.28 && lunarPhase < 0.47) phaseText = "WAXING GIBBOUS";
        else if (lunarPhase >= 0.47 && lunarPhase <= 0.53) phaseText = "FULL MOON";
        else if (lunarPhase > 0.53 && lunarPhase < 0.72) phaseText = "WANING GIBBOUS";
        else if (lunarPhase >= 0.72 && lunarPhase <= 0.78) phaseText = "LAST QUARTER";
        else if (lunarPhase > 0.78 && lunarPhase < 0.97) phaseText = "WANING CRESCENT";
        p1_tl.innerText = phaseText;
        p2_tl.innerText = lunarIllum.toFixed(1) + "%";
        p3_tl.innerText = (lunarPhase * 29.53).toFixed(1) + " / 29.5";
    } else if (p1_tl) {
        const prox = Math.cos(lunarPhase * Math.PI * 2);
        p1_tl.innerText = prox > 0 ? "APPROACHING PERIGEE" : "APPROACHING APOGEE";
        p2_tl.innerText = (1 + (prox * 0.05)).toFixed(3) + "x";
        p3_tl.innerText = ((lunarPhase * 360) % 360).toFixed(2) + "°";
    }

    let radDist = (qData.trueArc - 14) * (Math.PI / 180);
    let velocityMult = 1 + 0.0334 * Math.cos(radDist);
    let baseSpeedKmS = 29.78; 
    
    const p1_bl = document.getElementById('vel-p1');
    const p2_bl = document.getElementById('vel-p2');
    const p3_bl = document.getElementById('vel-p3');
    
    if (panelPrefs.bl === 'KINETIC' && p1_bl) {
        p1_bl.innerText = (baseSpeedKmS * velocityMult).toFixed(2) + " KM/S";
        p2_bl.innerText = velocityMult.toFixed(4) + "x";
        if (velocityMult > 1.015) p3_bl.innerText = "APPROACHING PERIHELION";
        else if (velocityMult < 0.985) p3_bl.innerText = "APPROACHING APHELION";
        else p3_bl.innerText = "NOMINAL TRANSIT";
    } else if (p1_bl) {
        p1_bl.innerText = (baseSpeedKmS * velocityMult).toFixed(2) + " KM/S";
        p2_bl.innerText = "-5.24 KM/S"; 
        p3_bl.innerText = "+5.71 KM/S"; 
    }

    const p1_br = document.getElementById('eq-p1');
    const p2_br = document.getElementById('eq-p2');
    const p3_br = document.getElementById('eq-p3');
    
    if (panelPrefs.br === 'TRUE_MEAN' && p1_br) {
        p1_br.innerText = qData.meanArc.toFixed(4) + "°";
        p2_br.innerText = qData.trueArc.toFixed(4) + "°";
        p3_br.innerText = (qData.delta > 0 ? "+" : "") + qData.delta.toFixed(4) + "°";
    } else if (p1_br) {
        let eotMins = qData.delta * 4; 
        let sign = eotMins > 0 ? "+" : "";
        p1_br.innerText = `12:00 ${sign}${eotMins.toFixed(1)}m`;
        p2_br.innerText = "12:00:00";
    }

    // --- SOLAR SYSTEM KINEMATICS RENDERING ---
    const eDeg = qData.trueArc; 
    const mDeg = ((((daysElapsed % PERIODS.MERCURY) / PERIODS.MERCURY) * 360) + EPOCH_OFFSETS.MERCURY) % 360;
    const vDeg = ((((daysElapsed % PERIODS.VENUS) / PERIODS.VENUS) * 360) + EPOCH_OFFSETS.VENUS) % 360;
    const marsDeg = ((((daysElapsed % PERIODS.MARS) / PERIODS.MARS) * 360) + EPOCH_OFFSETS.MARS) % 360;
    const jDeg = ((((daysElapsed % PERIODS.JUPITER) / PERIODS.JUPITER) * 360) + EPOCH_OFFSETS.JUPITER) % 360;
    const sDeg = ((((daysElapsed % PERIODS.SATURN) / PERIODS.SATURN) * 360) + EPOCH_OFFSETS.SATURN) % 360;
    const uDeg = ((((daysElapsed % PERIODS.URANUS) / PERIODS.URANUS) * 360) + EPOCH_OFFSETS.URANUS) % 360;
    const nDeg = ((((daysElapsed % PERIODS.NEPTUNE) / PERIODS.NEPTUNE) * 360) + EPOCH_OFFSETS.NEPTUNE) % 360;
    
    // Moon orbits Earth
    const moonDeg = (lunarPhase * 360);

    const elEarthSys = document.getElementById('earth-system');
    const elMerc = document.getElementById('p-mercury');
    const elVen = document.getElementById('p-venus');
    const elMars = document.getElementById('p-mars');
    const elJup = document.getElementById('p-jupiter');
    const elSat = document.getElementById('p-saturn');
    const elUra = document.getElementById('p-uranus');
    const elNep = document.getElementById('p-neptune');
    const elMoon = document.getElementById('p-moon');
    const elSun = document.getElementById('sys-sun');

    if (elEarthSys) {
        const ePos = p2c(ORBITS.EARTH, eDeg);
        elEarthSys.style.left = ePos.x + '%'; elEarthSys.style.top = ePos.y + '%';
        if (elMoon) {
            const moonRad = isMacroView ? 5.5 : 3.5; 
            const moonRadCalc = moonDeg * Math.PI / 180.0;
            elMoon.style.transform = `translate(calc(-50% + ${Math.sin(moonRadCalc) * moonRad}vh), calc(-50% - ${Math.cos(moonRadCalc) * moonRad}vh))`;
        }
    }
    if (elMerc) { const pos = p2c(ORBITS.MERCURY, mDeg); elMerc.style.left = pos.x + '%'; elMerc.style.top = pos.y + '%'; }
    if (elVen) { const pos = p2c(ORBITS.VENUS, vDeg); elVen.style.left = pos.x + '%'; elVen.style.top = pos.y + '%'; }
    if (elMars) { const pos = p2c(ORBITS.MARS, marsDeg); elMars.style.left = pos.x + '%'; elMars.style.top = pos.y + '%'; }
    if (elJup) { const pos = p2c(ORBITS.JUPITER, jDeg); elJup.style.left = pos.x + '%'; elJup.style.top = pos.y + '%'; }
    if (elSat) { const pos = p2c(ORBITS.SATURN, sDeg); elSat.style.left = pos.x + '%'; elSat.style.top = pos.y + '%'; }
    if (elUra) { const pos = p2c(ORBITS.URANUS, uDeg); elUra.style.left = pos.x + '%'; elUra.style.top = pos.y + '%'; }
    if (elNep) { const pos = p2c(ORBITS.NEPTUNE, nDeg); elNep.style.left = pos.x + '%'; elNep.style.top = pos.y + '%'; }

    // Fixed Nodes on Earth Orbit
    const nodePeri = document.getElementById('node-peri');
    const nodeAph = document.getElementById('node-aph');
    const nodeSouth = document.getElementById('node-south');
    const nodeEq1 = document.getElementById('node-eq1');
    const nodeNorth = document.getElementById('node-north');
    const nodeEq2 = document.getElementById('node-eq2');

    if (nodeSouth) { const pos = p2c(ORBITS.EARTH, 0); nodeSouth.style.left = pos.x + '%'; nodeSouth.style.top = pos.y + '%'; }
    if (nodeEq1) { const pos = p2c(ORBITS.EARTH, 90); nodeEq1.style.left = pos.x + '%'; nodeEq1.style.top = pos.y + '%'; }
    if (nodeNorth) { const pos = p2c(ORBITS.EARTH, 180); nodeNorth.style.left = pos.x + '%'; nodeNorth.style.top = pos.y + '%'; }
    if (nodeEq2) { const pos = p2c(ORBITS.EARTH, 270); nodeEq2.style.left = pos.x + '%'; nodeEq2.style.top = pos.y + '%'; }

    if (nodePeri) { const pos = p2c(ORBITS.EARTH, 14); nodePeri.style.left = pos.x + '%'; nodePeri.style.top = pos.y + '%'; }
    if (nodeAph) { const pos = p2c(ORBITS.EARTH, 194); nodeAph.style.left = pos.x + '%'; nodeAph.style.top = pos.y + '%'; }

    // --- BARYCENTRIC WOBBLE ---
    // Inverted to match the new 12-o'clock clockwise orientation
    const jX = Math.sin(jDeg * Math.PI / 180); const jY = -Math.cos(jDeg * Math.PI / 180);
    const sX = Math.sin(sDeg * Math.PI / 180) * 0.3; const sY = -Math.cos(sDeg * Math.PI / 180) * 0.3;

    const wobX = (jX + sX); const wobY = (jY + sY);
    const wobbleScale = isMacroView ? 0.3 : 1.5; 
    
    if (elSun) {
        elSun.style.transform = `translate(calc(-50% + ${wobX * wobbleScale}vh), calc(-50% + ${wobY * wobbleScale}vh))`;
    }

    const p1_tr = document.getElementById('bary-p1');
    const p2_tr = document.getElementById('bary-p2');
    const p3_tr = document.getElementById('bary-p3');
    
    if (panelPrefs.tr === 'MASS' && p2_tr) {
        const totalPull = Math.sqrt(wobX*wobX + wobY*wobY);
        const offsetRadii = (totalPull / 1.3) * 2.2; 
        p2_tr.innerText = offsetRadii.toFixed(2) + " R☉";
        p3_tr.innerText = offsetRadii > 1.0 ? "EXTRA-SOLAR" : "INTRA-SOLAR";
    } else if (p1_tr) {
        p1_tr.innerText = "+0.0042"; 
        p2_tr.innerText = jDeg.toFixed(2) + "°";
        p3_tr.innerText = sDeg.toFixed(2) + "°";
    }

});

// BOOT SEQUENCE
function bootAstrophysicalVector() {
    if(isBooted) return;
    const tlNode = document.getElementById('quad-tl') || document.getElementById('quad-BIO');
    if(!tlNode) return; 

    isBooted = true;
    window.injectVectorData();
    injectAstroScrubber();
    if(window.generateStars) window.generateStars('stars');
}

window.addEventListener('q-ui-mounted', bootAstrophysicalVector);

if (document.readyState === 'complete' || document.readyState === 'interactive') {
    setTimeout(() => {
        if(!isBooted && document.getElementById('q-ui-injected-flag')) bootAstrophysicalVector();
    }, 150);
}