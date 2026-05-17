// THE QUADRATURE: ASTROPHYSICAL VECTOR ENGINE
// Architect: Kelby | Engineer: Kairos
// STATUS: Phase V UI Engine. Barycentric Solar System Model & Kinematic Scrubber.

let isBooted = false;
let currentOptTarget = '';
let isMacroView = false;
let astroScrubInterval = null;

// Orbital parameters relative to dial size percentages
const ORBITS = {
    MERCURY: 10,
    VENUS: 18,
    EARTH: 27,
    MOON: 3.5,
    JUPITER: 70,
    SATURN: 130
};

// Orbital periods in Earth days
const PERIODS = {
    MERCURY: 87.97,
    VENUS: 224.70,
    EARTH: 365.24219,
    MOON: 29.53,
    JUPITER: 4332.59,
    SATURN: 10759.22
};

window.injectVectorData = function() {
    const optTL = document.getElementById('opt-tl') || document.querySelectorAll('.opt-oval')[0];
    const optTR = document.getElementById('opt-tr') || document.querySelectorAll('.opt-oval')[1];
    const optBL = document.getElementById('opt-bl') || document.querySelectorAll('.opt-oval')[2];
    const optBR = document.getElementById('opt-br') || document.querySelectorAll('.opt-oval')[3];

    if (optTL) { optTL.onclick = (e) => { e.stopPropagation(); window.openOptions(e, 'lunar'); }; optTL.style.color = 'var(--cyan-glow)'; }
    if (optTR) { optTR.onclick = (e) => { e.stopPropagation(); window.openOptions(e, 'bary'); }; optTR.style.color = 'var(--cyan-glow)'; }
    if (optBL) { optBL.onclick = (e) => { e.stopPropagation(); window.openOptions(e, 'velocity'); }; optBL.style.color = 'var(--cyan-glow)'; }
    if (optBR) { optBR.onclick = (e) => { e.stopPropagation(); window.openOptions(e, 'equation'); }; optBR.style.color = 'var(--cyan-glow)'; }

    const quadTL = document.getElementById('quad-tl') || document.getElementById('quad-BIO');
    if (quadTL) {
        quadTL.innerHTML = `
            <div class="panel-data-wrapper">
                <div class="v-head">LUNAR KINEMATICS</div>
                <div class="t-row"><span class="w-lbl">SYNODIC PHASE:</span> <span class="val-sm" id="lunar-phase-text">--</span></div>
                <div class="t-row"><span class="w-lbl">ILLUMINATION:</span> <span class="val-sm" id="lunar-illum">--%</span></div>
                <div class="t-row"><span class="w-lbl">SYNODIC DAY:</span> <span class="val-sm" id="lunar-day">-- / 29.5</span></div>
                <div style="width:100%; height:3px; background:#000; margin-top:2px; border:1px solid var(--core-dim);">
                    <div id="lunar-bar" style="height:100%; width:0%; background:var(--silver); box-shadow:0 0 8px var(--silver); transition: width 0.3s;"></div>
                </div>
            </div>
        `;
    }

    const quadTR = document.getElementById('quad-tr') || document.getElementById('quad-COM');
    if (quadTR) {
        quadTR.innerHTML = `
            <div class="panel-data-wrapper">
                <div class="v-head">BARYCENTRIC TRACKING</div>
                <div class="t-row"><span class="w-lbl">SYSTEM MASS CENTER:</span> <span class="val-sm">SOLAR SYSTEM BARYCENTER</span></div>
                <div class="t-row"><span class="w-lbl">PRIMARY INFLUENCE:</span> <span class="val-sm" style="color:#ff9933;">JUPITER (J1)</span></div>
                <div class="t-row"><span class="w-lbl">SOLAR OFFSET (WOBBLE):</span> <span class="val-sm" id="solar-wobble-val">-- R☉</span></div>
            </div>
        `;
    }

    const quadBL = document.getElementById('quad-bl') || document.getElementById('quad-ENV');
    if (quadBL) {
        quadBL.innerHTML = `
            <div class="panel-data-wrapper">
                <div class="v-head">PLANETARY VELOCITY</div>
                <div class="t-row"><span class="w-lbl">KEPLERIAN MULTIPLIER:</span> <span class="val-sm" id="vel-mult">--x</span></div>
                <div class="t-row"><span class="w-lbl">APSIDAL PROXIMITY:</span> <span class="val-sm" id="vel-apsis">--</span></div>
                <div class="val-display" style="padding:4px 8px; margin-top:4px; text-align:center;">
                    <div class="w-lbl" style="margin-bottom:2px;">CURRENT ORBITAL SPEED</div>
                    <div id="vel-speed" style="font-size:0.8rem; color:var(--magenta-glow); font-family:'Orbitron'; font-weight:900; text-shadow:0 0 8px var(--magenta-dim);">-- KM/S</div>
                </div>
            </div>
        `;
    }

    const quadBR = document.getElementById('quad-br') || document.getElementById('quad-MEC');
    if (quadBR) {
        quadBR.innerHTML = `
            <div class="panel-data-wrapper">
                <div class="v-head">EQUATION OF TIME</div>
                <div class="t-row"><span class="w-lbl">MEAN ANOMALY (CIVIL):</span> <span class="val-sm" id="eq-mean">--°</span></div>
                <div class="t-row"><span class="w-lbl">TRUE ANOMALY (PHYSICS):</span> <span class="val-sm" id="eq-true">--°</span></div>
                <div class="val-display" style="padding:4px 8px; margin-top:4px; text-align:center;">
                    <div class="w-lbl" style="margin-bottom:2px;">Q-DELTA VARIANCE</div>
                    <div id="eq-delta" style="font-size:0.8rem; color:var(--cyan-glow); font-family:'Orbitron'; font-weight:900; text-shadow:0 0 8px var(--cyan-dim);">--°</div>
                </div>
            </div>
        `;
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
    if(window.Q_LOG) window.Q_LOG('INFO', 'ASTRO', `Settings trigger: ${target}`);
    // Modal implementation deferred to standard Q_ModalEngine parameters
};

window.openAnchorModal = function(node) {
    if(window.Q_LOG) window.Q_LOG('INFO', 'ASTRO', `Anchor inspected: ${node}`);
    // Defer to q-ui standard anchor modal
};

function injectAstroScrubber() {
    const container = document.createElement('div');
    container.className = 'q-astro-controls';
    container.innerHTML = `
        <div class="astro-scrub-row">
            <button class="btn-astro" id="btn-ast-live">LIVE KINEMATICS</button>
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
        if(window.setSimState) window.setSimState({ isLive: true, simTime: Date.now() });
        document.getElementById('btn-ast-live').classList.add('active');
    });

    document.getElementById('btn-ast-stop').addEventListener('click', () => {
        if(astroScrubInterval) clearInterval(astroScrubInterval);
        document.getElementById('btn-ast-live').classList.remove('active');
    });

    const runSim = (direction) => {
        if(astroScrubInterval) clearInterval(astroScrubInterval);
        document.getElementById('btn-ast-live').classList.remove('active');
        let state = window.getSimState ? window.getSimState() : { simTime: Date.now() };
        if(state.isLive) { state.isLive = false; state.simTime = Date.now(); }
        
        astroScrubInterval = setInterval(() => {
            state.simTime += direction * 86400000; // 1 day per tick
            if(window.setSimState) window.setSimState(state);
        }, 50);
    };

    document.getElementById('btn-ast-rev').addEventListener('click', () => runSim(-1));
    document.getElementById('btn-ast-fwd').addEventListener('click', () => runSim(1));

    document.getElementById('btn-macro-zoom').addEventListener('click', (e) => {
        isMacroView = !isMacroView;
        e.target.classList.toggle('active', isMacroView);
        document.getElementById('sys-container').parentElement.classList.toggle('macro-active', isMacroView);
    });
}

function p2c(radiusPct, angleDeg) {
    const rad = (angleDeg - 90) * Math.PI / 180.0;
    return {
        x: 50 + (radiusPct * Math.cos(rad)),
        y: 50 + (radiusPct * Math.sin(rad))
    };
}

window.addEventListener('q-tick', (e) => {
    const { t, qData, daysElapsed } = e.detail;

    // --- LUNAR KINEMATICS (Top Left) ---
    const lunarPhase = qData.lunarPhase || 0; // 0 to 1
    const lunarIllum = (1 - Math.cos(lunarPhase * Math.PI * 2)) / 2 * 100;
    const lunarDay = lunarPhase * 29.53;
    
    let phaseText = "NEW MOON";
    if (lunarPhase > 0.03 && lunarPhase < 0.22) phaseText = "WAXING CRESCENT";
    else if (lunarPhase >= 0.22 && lunarPhase <= 0.28) phaseText = "FIRST QUARTER";
    else if (lunarPhase > 0.28 && lunarPhase < 0.47) phaseText = "WAXING GIBBOUS";
    else if (lunarPhase >= 0.47 && lunarPhase <= 0.53) phaseText = "FULL MOON";
    else if (lunarPhase > 0.53 && lunarPhase < 0.72) phaseText = "WANING GIBBOUS";
    else if (lunarPhase >= 0.72 && lunarPhase <= 0.78) phaseText = "LAST QUARTER";
    else if (lunarPhase > 0.78 && lunarPhase < 0.97) phaseText = "WANING CRESCENT";

    const elLunarTxt = document.getElementById('lunar-phase-text');
    const elLunarIllum = document.getElementById('lunar-illum');
    const elLunarDay = document.getElementById('lunar-day');
    const elLunarBar = document.getElementById('lunar-bar');
    if (elLunarTxt) elLunarTxt.innerText = phaseText;
    if (elLunarIllum) elLunarIllum.innerText = lunarIllum.toFixed(1) + "%";
    if (elLunarDay) elLunarDay.innerText = lunarDay.toFixed(1) + " / 29.5";
    if (elLunarBar) elLunarBar.style.width = (lunarPhase * 100) + "%";

    // --- PLANETARY VELOCITY (Bottom Left) ---
    let radDist = (qData.trueArc - 14) * (Math.PI / 180);
    let velocityMult = 1 + 0.0334 * Math.cos(radDist);
    let baseSpeedKmS = 29.78; // Mean orbital velocity of Earth
    let currentSpeed = baseSpeedKmS * velocityMult;

    const elVelMult = document.getElementById('vel-mult');
    const elVelApsis = document.getElementById('vel-apsis');
    const elVelSpeed = document.getElementById('vel-speed');
    
    if (elVelMult) elVelMult.innerText = velocityMult.toFixed(4) + "x";
    if (elVelSpeed) elVelSpeed.innerText = currentSpeed.toFixed(2) + " KM/S";
    if (elVelApsis) {
        if (velocityMult > 1.015) elVelApsis.innerText = "APPROACHING PERIHELION";
        else if (velocityMult < 0.985) elVelApsis.innerText = "APPROACHING APHELION";
        else elVelApsis.innerText = "NOMINAL TRANSIT";
    }

    // --- EQUATION OF TIME (Bottom Right) ---
    const elEqMean = document.getElementById('eq-mean');
    const elEqTrue = document.getElementById('eq-true');
    const elEqDelta = document.getElementById('eq-delta');
    if (elEqMean) elEqMean.innerText = qData.meanArc.toFixed(4) + "°";
    if (elEqTrue) elEqTrue.innerText = qData.trueArc.toFixed(4) + "°";
    if (elEqDelta) elEqDelta.innerText = (qData.delta > 0 ? "+" : "") + qData.delta.toFixed(4) + "°";

    // --- SOLAR SYSTEM KINEMATICS RENDERING ---
    // Earth uses True Anomaly to reflect physics. Other planets use simplified mean calculation.
    const eDeg = qData.trueArc; 
    
    // Calculate raw degrees based on orbital periods
    const mDeg = ((daysElapsed % PERIODS.MERCURY) / PERIODS.MERCURY) * 360;
    const vDeg = ((daysElapsed % PERIODS.VENUS) / PERIODS.VENUS) * 360;
    const jDeg = ((daysElapsed % PERIODS.JUPITER) / PERIODS.JUPITER) * 360;
    const sDeg = ((daysElapsed % PERIODS.SATURN) / PERIODS.SATURN) * 360;
    const moonDeg = (lunarPhase * 360);

    const elEarthSys = document.getElementById('earth-system');
    const elMerc = document.getElementById('p-mercury');
    const elVen = document.getElementById('p-venus');
    const elJup = document.getElementById('p-jupiter');
    const elSat = document.getElementById('p-saturn');
    const elMoon = document.getElementById('p-moon');
    const elSun = document.getElementById('sun-core');

    if (elEarthSys) {
        const ePos = p2c(ORBITS.EARTH, eDeg);
        elEarthSys.style.left = ePos.x + '%';
        elEarthSys.style.top = ePos.y + '%';
    }
    if (elMerc) {
        const mPos = p2c(ORBITS.MERCURY, mDeg);
        elMerc.style.left = mPos.x + '%'; elMerc.style.top = mPos.y + '%';
    }
    if (elVen) {
        const vPos = p2c(ORBITS.VENUS, vDeg);
        elVen.style.left = vPos.x + '%'; elVen.style.top = vPos.y + '%';
    }
    if (elJup) {
        const jPos = p2c(ORBITS.JUPITER, jDeg);
        elJup.style.left = jPos.x + '%'; elJup.style.top = jPos.y + '%';
    }
    if (elSat) {
        const sPos = p2c(ORBITS.SATURN, sDeg);
        elSat.style.left = sPos.x + '%'; elSat.style.top = sPos.y + '%';
    }
    if (elMoon) {
        const moonPos = p2c(ORBITS.MOON, moonDeg);
        elMoon.style.left = moonPos.x + '%'; elMoon.style.top = moonPos.y + '%';
    }

    // Fixed Perihelion and Aphelion markers on Earth's orbit (14° and 194°)
    const nodePeri = document.getElementById('node-peri');
    const nodeAph = document.getElementById('node-aph');
    if (nodePeri) {
        const pPos = p2c(ORBITS.EARTH, 14);
        nodePeri.style.left = pPos.x + '%'; nodePeri.style.top = pPos.y + '%';
    }
    if (nodeAph) {
        const aPos = p2c(ORBITS.EARTH, 194);
        nodeAph.style.left = aPos.x + '%'; nodeAph.style.top = aPos.y + '%';
    }

    // --- BARYCENTRIC WOBBLE (Top Right & Center Rendering) ---
    // Simulate pull primarily from Jupiter (J1) and Saturn
    const jX = Math.cos((jDeg - 90) * Math.PI / 180);
    const jY = Math.sin((jDeg - 90) * Math.PI / 180);
    const sX = Math.cos((sDeg - 90) * Math.PI / 180) * 0.3; // Saturn has ~30% gravitational influence relative to Jupiter
    const sY = Math.sin((sDeg - 90) * Math.PI / 180) * 0.3;

    // Wobble displacement vector
    const wobX = (jX + sX);
    const wobY = (jY + sY);
    
    // In Macro view, displacement is visually scaled relative to the outer orbits
    // In Micro view, the wobble is highly exaggerated so it's visible relative to inner planets
    const wobbleScale = isMacroView ? 0.5 : 2.5; 
    
    if (elSun) {
        elSun.style.transform = `translate(calc(-50% + ${wobX * wobbleScale}vh), calc(-50% + ${wobY * wobbleScale}vh))`;
    }

    const elSolarWobble = document.getElementById('solar-wobble-val');
    if (elSolarWobble) {
        // Calculate abstract solar radii offset
        const totalPull = Math.sqrt(wobX*wobX + wobY*wobY);
        // Map abstract pull to 0.0 - 2.2 Solar Radii (approx Barycenter max offset)
        const offsetRadii = (totalPull / 1.3) * 2.2; 
        elSolarWobble.innerText = offsetRadii.toFixed(2) + " R☉";
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