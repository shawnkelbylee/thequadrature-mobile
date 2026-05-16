// THE QUADRATURE: ASTROPHYSICAL VECTOR ENGINE
// Architect: Kelby | Engineer: Kairos
// STATUS: Phase XLVII. Barycentric Scaling & Apside Fidelity.

let isBooted = false;
let currentOptTarget = '';
let unitSystem = localStorage.getItem('Q_UNIT_SYS') || 'METRIC';
let isZoomed = false;

window.injectVectorData = function() {
    const optTL = document.getElementById('opt-tl') || document.querySelectorAll('.opt-oval')[0];
    const optTR = document.getElementById('opt-tr') || document.querySelectorAll('.opt-oval')[1];
    const optBL = document.getElementById('opt-bl') || document.querySelectorAll('.opt-oval')[2];
    const optBR = document.getElementById('opt-br') || document.querySelectorAll('.opt-oval')[3];

    if (optTL) { optTL.onclick = (e) => { e.stopPropagation(); window.openOptions(e, 'orbital'); }; optTL.style.color = 'var(--cyan-glow)'; }
    if (optTR) { optTR.onclick = (e) => { e.stopPropagation(); window.openOptions(e, 'telemetry'); }; optTR.style.color = 'var(--cyan-glow)'; }
    if (optBL) { optBL.onclick = (e) => { e.stopPropagation(); window.openOptions(e, 'lunar'); }; optBL.style.color = 'var(--cyan-glow)'; }
    if (optBR) { optBR.onclick = (e) => { e.stopPropagation(); window.openOptions(e, 'system'); }; optBR.style.color = 'var(--cyan-glow)'; }

    const dStyleTop = "font-family:'Orbitron'; font-size:0.55rem; color:rgba(255,255,255,0.5); font-weight:700; border-top:1px solid rgba(255,255,255,0.1); margin-top:4px; padding-top:4px; letter-spacing:1px; text-align:center;";
    const dStyleBot = "font-family:'Orbitron'; font-size:0.55rem; color:rgba(255,255,255,0.5); font-weight:700; border-bottom:1px solid rgba(255,255,255,0.1); margin-bottom:6px; padding-bottom:4px; letter-spacing:1px; text-align:center;";

    const quadTL = document.getElementById('quad-tl') || document.getElementById('quad-BIO');
    if (quadTL) quadTL.innerHTML = `<div class="panel-data-wrapper"><div class="v-head">ORBITAL DYNAMICS</div><div class="t-row"><span class="w-lbl">SOLAR VS CIVIL (EOT):</span> <span class="val-sm val-highlight" id="val-eot">--</span></div><div class="t-row"><span class="w-lbl">TRUE ANOMALY:</span> <span class="val-sm val-highlight" id="val-anomaly">--</span></div><div class="t-row"><span class="w-lbl">ECCENTRICITY:</span> <span class="val-sm val-highlight">0.0167</span></div><div style="${dStyleTop}">[ KEPLERIAN MECHANICS ]</div></div>`;

    const quadTR = document.getElementById('quad-tr') || document.getElementById('quad-COM');
    if (quadTR) quadTR.innerHTML = `<div class="panel-data-wrapper"><div class="v-head">MACRO TELEMETRY</div><div class="t-row"><span class="w-lbl">ORBITAL VELOCITY:</span> <span class="val-sm val-highlight" id="val-vel">--</span></div><div class="t-row"><span class="w-lbl">SOLAR DISTANCE:</span> <span class="val-sm val-highlight" id="val-au">--</span></div><div class="t-row"><span class="w-lbl">ACCELERATION:</span> <span class="val-sm val-highlight" id="val-accel" style="color: var(--cyan-glow);">--</span></div><div style="${dStyleTop}">[ HELIOCENTRIC VECTORS ]</div></div>`;

    const quadBL = document.getElementById('quad-bl') || document.getElementById('quad-ENV');
    if (quadBL) quadBL.innerHTML = `<div class="panel-data-wrapper"><div class="v-head">LUNAR GRAVITY</div><div style="${dStyleBot}">[ SATELLITE INTERFERENCE ]</div><div class="t-row"><span class="w-lbl">LUNAR PHASE:</span> <span class="val-sm val-highlight" id="val-lunar-phase">--</span></div><div class="t-row"><span class="w-lbl">ILLUMINATION:</span> <span class="val-sm val-highlight" id="val-lunar-ill">--</span></div><div class="t-row"><span class="w-lbl">ORBITAL DISTANCE:</span> <span class="val-sm val-highlight" id="val-lunar-dist">--</span></div></div>`;

    const quadBR = document.getElementById('quad-br') || document.getElementById('quad-MEC');
    if (quadBR) quadBR.innerHTML = `<div class="panel-data-wrapper"><div class="v-head">SYSTEM ALIGNMENT</div><div style="${dStyleBot}">[ BARYCENTRIC MATRICES ]</div><div class="t-row"><span class="w-lbl">BARYCENTER OFFSET:</span> <span class="val-sm val-highlight" id="val-bary">--</span></div><div class="t-row"><span class="w-lbl">Q-DELTA ANCHOR:</span> <span class="val-sm val-highlight" id="val-qdelta">--</span></div><div class="t-row"><span class="w-lbl">MERIDIAN TENSION:</span> <span class="val-sm val-highlight" id="val-tension">--</span></div></div>`;
};

window.openOptions = function(e, target) {
    if(e) e.stopPropagation();
    currentOptTarget = target;
    let title = "ASTROPHYSICAL CALIBRATION";
    let html = `<div style="font-family: 'JetBrains Mono'; font-size: 0.75rem; color: var(--starlight); line-height: 1.5; text-align: center;">Vector isolation engaged. Telemetry is hard-locked to planetary invariants and cannot be manually overridden.</div>`;
    if (window.Q_ModalEngine) {
        window.Q_ModalEngine.render(title, html, 'ACKNOWLEDGE', () => { window.Q_ModalEngine.close(); });
    }
};

// --- DYNAMIC TOOLTIP LOGIC ---
const tooltip = document.getElementById('astro-tooltip');
document.addEventListener('mousemove', (e) => {
    if(tooltip && tooltip.style.opacity === '1') {
        tooltip.style.left = (e.clientX + 15) + 'px';
        tooltip.style.top = (e.clientY + 15) + 'px';
    }
});

window.showAstroTooltip = function(text, color) {
    if(!tooltip) return;
    tooltip.innerHTML = `<span style="color:${color}; font-weight:900;">[DATA]</span><br>${text}`;
    tooltip.style.borderLeftColor = color;
    tooltip.style.opacity = '1';
};

window.hideAstroTooltip = function() {
    if(!tooltip) return;
    tooltip.style.opacity = '0';
};

window.toggleMacroZoom = function() {
    isZoomed = !isZoomed;
    const group = document.getElementById('macro-zoom-group');
    const btn = document.getElementById('q-zoom-toggle');
    if (group && btn) {
        if (isZoomed) {
            group.style.transform = "scale(0.12)";
            btn.innerText = "[ VIEW: MICRO ]";
            btn.classList.add('active');
        } else {
            group.style.transform = "scale(1)";
            btn.innerText = "[ VIEW: MACRO ]";
            btn.classList.remove('active');
        }
    }
};

window.addEventListener('q-tick', (e) => {
    const { t, activeTime, daysElapsed, qData } = e.detail;
    
    // 1. DATA INJECTIONS
    const B = (360 / 365.24) * (daysElapsed - 81) * (Math.PI / 180);
    const eotMinutes = 9.87 * Math.sin(2 * B) - 7.53 * Math.cos(B) - 1.5 * Math.sin(B);
    const valEot = document.getElementById('val-eot');
    if (valEot) valEot.innerText = (eotMinutes > 0 ? '+' : '') + eotMinutes.toFixed(1) + ' MIN';

    const valAnomaly = document.getElementById('val-anomaly');
    if (valAnomaly) valAnomaly.innerText = qData.trueArc.toFixed(2) + '°';

    const isImp = (unitSystem === 'IMPERIAL');
    const vKmS = 29.78 - (0.5 * Math.cos(qData.trueArc * Math.PI / 180));
    const valVel = document.getElementById('val-vel');
    if (valVel) valVel.innerText = isImp ? (vKmS * 2236.94).toFixed(0) + ' MPH' : vKmS.toFixed(2) + ' KM/S';

    const au = 1 - 0.01672 * Math.cos((daysElapsed / 365.24219) * Math.PI * 2);
    const valAu = document.getElementById('val-au');
    if (valAu) valAu.innerText = au.toFixed(5) + ' AU';

    const valAccel = document.getElementById('val-accel');
    if (valAccel) {
        if (qData.trueArc > 0 && qData.trueArc < 180) {
            valAccel.innerText = '- (DECELERATING)';
        } else {
            valAccel.innerText = '+ (TOWARD PERIHELION)';
        }
    }

    const lunarCycle = 29.53059;
    const lunarDays = ((daysElapsed % lunarCycle) + lunarCycle) % lunarCycle;
    const ill = 0.5 * (1 - Math.cos((lunarDays / lunarCycle) * Math.PI * 2));
    
    const valLunarPhase = document.getElementById('val-lunar-phase');
    if (valLunarPhase) {
        if (lunarDays < 1 || lunarDays > 28.5) valLunarPhase.innerText = 'NEW MOON';
        else if (lunarDays < 6) valLunarPhase.innerText = 'WAXING CRESCENT';
        else if (lunarDays < 8) valLunarPhase.innerText = 'FIRST QUARTER';
        else if (lunarDays < 13) valLunarPhase.innerText = 'WAXING GIBBOUS';
        else if (lunarDays < 16) valLunarPhase.innerText = 'FULL MOON';
        else if (lunarDays < 21) valLunarPhase.innerText = 'WANING GIBBOUS';
        else if (lunarDays < 23) valLunarPhase.innerText = 'LAST QUARTER';
        else valLunarPhase.innerText = 'WANING CRESCENT';
    }

    const valLunarIll = document.getElementById('val-lunar-ill');
    if (valLunarIll) valLunarIll.innerText = (ill * 100).toFixed(1) + '%';

    const lunarDistKm = 384400 - (20000 * Math.cos((lunarDays/27.32)*Math.PI*2));
    const valLunarDist = document.getElementById('val-lunar-dist');
    if (valLunarDist) valLunarDist.innerText = isImp ? (lunarDistKm * 0.621371).toFixed(0) + ' MI' : lunarDistKm.toFixed(0) + ' KM';

    const baryOffset = 1.1 + 0.4 * Math.sin(daysElapsed / 4332 * Math.PI * 2); 
    const valBary = document.getElementById('val-bary');
    if (valBary) valBary.innerText = baryOffset.toFixed(2) + ' R⊙';

    const valQDelta = document.getElementById('val-qdelta');
    if (valQDelta) valQDelta.innerText = (qData.delta > 0 ? '+' : '') + qData.delta.toFixed(4) + '°';

    const valTension = document.getElementById('val-tension');
    if (valTension) valTension.innerText = Math.abs(qData.delta * 24).toFixed(2) + ' HRS';

    // 2. SVG ANIMATION INJECTIONS
    const mercAngle = (daysElapsed / 87.97) * Math.PI * 2;
    const svgMerc = document.getElementById('svg-mercury');
    if (svgMerc) {
        svgMerc.setAttribute('cx', 30 * Math.cos(mercAngle));
        svgMerc.setAttribute('cy', 30 * Math.sin(mercAngle));
    }

    const venAngle = (daysElapsed / 224.7) * Math.PI * 2;
    const svgVen = document.getElementById('svg-venus');
    if (svgVen) {
        svgVen.setAttribute('cx', 55 * Math.cos(venAngle));
        svgVen.setAttribute('cy', 55 * Math.sin(venAngle));
    }

    const jupAngle = (daysElapsed / 4332.59) * Math.PI * 2;
    const svgJup = document.getElementById('svg-jupiter');
    if (svgJup) {
        svgJup.setAttribute('cx', 442 * Math.cos(jupAngle));
        svgJup.setAttribute('cy', 442 * Math.sin(jupAngle));
    }

    const satAngle = (daysElapsed / 10759.22) * Math.PI * 2;
    const svgSat = document.getElementById('svg-saturn');
    if (svgSat) {
        svgSat.setAttribute('cx', 807 * Math.cos(satAngle));
        svgSat.setAttribute('cy', 807 * Math.sin(satAngle));
    }

    const earthAngle = (daysElapsed / 365.24219) * Math.PI * 2;
    const ex = 85 * Math.cos(earthAngle);
    const ey = 85 * Math.sin(earthAngle);
    const svgEarthGroup = document.getElementById('svg-earth-group');
    if (svgEarthGroup) {
        svgEarthGroup.setAttribute('transform', `translate(${ex}, ${ey})`);
    }

    const moonAngle = (daysElapsed / 27.32) * Math.PI * 2;
    const mx = 14 * Math.cos(moonAngle);
    const my = 14 * Math.sin(moonAngle);
    const svgMoon = document.getElementById('svg-moon');
    const svgLunarLine = document.getElementById('svg-lunar-line');
    if (svgMoon) {
        svgMoon.setAttribute('cx', mx);
        svgMoon.setAttribute('cy', my);
    }
    if (svgLunarLine) {
        svgLunarLine.setAttribute('x2', mx);
        svgLunarLine.setAttribute('y2', my);
    }

    const svgSun = document.getElementById('svg-sun');
    if (svgSun) {
        svgSun.setAttribute('cx', -2 * Math.cos(jupAngle));
        svgSun.setAttribute('cy', 2 * Math.sin(jupAngle));
    }
});

// --- LOCALIZED ASTROPHYSICAL SCRUBBER ---
function injectAstroScrubber() {
    const scrubberContainer = document.createElement('div');
    scrubberContainer.className = "q-global-controls q-scrubber-panel";
    scrubberContainer.id = "q-astro-controls";
    scrubberContainer.innerHTML = `
        <div class="scrub-row-1">
            <button id="q-zoom-toggle" class="btn-micro" onclick="window.toggleMacroZoom()">[ VIEW: MACRO ]</button>
            <div class="macro-micro-group">
                <button id="q-play-rev" class="btn-micro">&lt;&lt;</button>
                <button id="q-play-stop" class="btn-micro" disabled>||</button>
                <button id="q-play-fwd" class="btn-micro">&gt;&gt;</button>
            </div>
            <button id="q-live-toggle" class="btn-micro active">LIVE</button>
        </div>
    `;
    document.body.appendChild(scrubberContainer);
    window.attachAstroScrubberEvents();
}

let astroPlayInterval = null;

window.stopAstroLoop = function() {
    if (astroPlayInterval) { clearInterval(astroPlayInterval); astroPlayInterval = null; }
    const btnStop = document.getElementById('q-play-stop');
    const btnRev = document.getElementById('q-play-rev');
    const btnFwd = document.getElementById('q-play-fwd');
    if (btnStop) btnStop.disabled = true;
    if (btnRev) btnRev.classList.remove('active');
    if (btnFwd) btnFwd.classList.remove('active');
};

window.executeAstroLoop = function(direction) {
    window.stopAstroLoop();
    let state = window.Q_STATE || { isLive: true, simTime: Date.now() };
    if (state.isLive) { state.isLive = false; state.simTime = Date.now(); }
    const btnStop = document.getElementById('q-play-stop');
    const activeBtn = document.getElementById(direction < 0 ? 'q-play-rev' : 'q-play-fwd');
    if (btnStop) btnStop.disabled = false; if (activeBtn) activeBtn.classList.add('active');
    
    astroPlayInterval = setInterval(() => { 
        state.simTime += direction * 86400000 * 2; // Fast orbit 
        window.Q_STATE = state;
        const liveBtn = document.getElementById('q-live-toggle');
        if(liveBtn) { liveBtn.classList.remove('active'); liveBtn.innerText = "RESYNC"; }
    }, 33); 
};

window.attachAstroScrubberEvents = function() {
    const liveToggle = document.getElementById('q-live-toggle');
    if (liveToggle) {
        liveToggle.addEventListener('click', () => {
            window.stopAstroLoop();
            window.Q_STATE = { isLive: true, simTime: Date.now() };
            liveToggle.classList.add('active'); 
            liveToggle.innerText = "LIVE";
        });
    }
    document.getElementById('q-play-rev')?.addEventListener('click', () => window.executeAstroLoop(-1));
    document.getElementById('q-play-fwd')?.addEventListener('click', () => window.executeAstroLoop(1));
    document.getElementById('q-play-stop')?.addEventListener('click', window.stopAstroLoop);
};

window.addEventListener('q-ui-mounted', () => {
    if(isBooted) return;
    const tlNode = document.getElementById('quad-tl') || document.getElementById('quad-BIO');
    if(!tlNode) return; 

    isBooted = true;
    window.injectVectorData();
    injectAstroScrubber();
    if(window.generateStars) window.generateStars('stars');
});

if (document.readyState === 'complete' || document.readyState === 'interactive') {
    setTimeout(() => {
        if(!isBooted && (document.getElementById('quad-tl') || document.getElementById('quad-BIO'))) {
            isBooted = true;
            window.injectVectorData();
            injectAstroScrubber();
            if(window.generateStars) window.generateStars('stars');
        }
    }, 500);
}