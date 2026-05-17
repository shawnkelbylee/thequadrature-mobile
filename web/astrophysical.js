// THE QUADRATURE: ASTROPHYSICAL VECTOR ENGINE
// Architect: Kelby | Engineer: Kairos
// STATUS: Phase L. Perfect Structural Replication of Legacy Panels with New Telemetry.
// REVISION: Dual-Targeting initialized via q-ui-mounted.

let currentRadarStatus = 'STABLE';
let lastThermoPhase = "";

// Modal State Options
let atomicSync = "MASTER";
let standardizedInterval = "ACTIVE";
let varianceResolution = "HIGH";
let isBooted = false;
let currentOptTarget = '';
let unitSystem = localStorage.getItem('Q_UNIT_SYS') || 'METRIC';

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
    let isZoomed = window.Q_MACRO_ZOOM || false;
    isZoomed = !isZoomed;
    window.Q_MACRO_ZOOM = isZoomed;
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

window.injectVectorData = function() {
    const optTL = document.getElementById('opt-tl') || document.querySelectorAll('.opt-oval')[0];
    const optTR = document.getElementById('opt-tr') || document.querySelectorAll('.opt-oval')[1];
    const optBL = document.getElementById('opt-bl') || document.querySelectorAll('.opt-oval')[2];
    const optBR = document.getElementById('opt-br') || document.querySelectorAll('.opt-oval')[3];

    if (optTL) { optTL.onclick = (e) => { e.stopPropagation(); window.openOptions(e, 'orbital'); }; optTL.style.color = 'var(--cyan-glow)'; }
    if (optTR) { optTR.onclick = (e) => { e.stopPropagation(); window.openOptions(e, 'telemetry'); }; optTR.style.color = 'var(--cyan-glow)'; }
    if (optBL) { optBL.onclick = (e) => { e.stopPropagation(); window.openOptions(e, 'lunar'); }; optBL.style.color = 'var(--cyan-glow)'; }
    if (optBR) { optBR.onclick = (e) => { e.stopPropagation(); window.openOptions(e, 'system'); }; optBR.style.color = 'var(--cyan-glow)'; }

    // IDENTICAL STRUCTURE: TOP LEFT
    const quadTL = document.getElementById('quad-tl') || document.getElementById('quad-BIO');
    if (quadTL) {
        quadTL.innerHTML = `
            <div class="panel-data-wrapper">
                <div class="v-head">ORBITAL MECHANICS</div>
                <div class="t-row"><span class="w-lbl">SOLAR VS CIVIL (EOT):</span> <span class="val-sm" id="val-eot">--</span></div>
                <div class="t-row"><span class="w-lbl">TRUE ANOMALY:</span> <span class="val-sm" id="val-anomaly">--</span></div>
                <div class="t-row"><span class="w-lbl">ECCENTRICITY:</span> <span class="val-sm">0.0167</span></div>
                <div class="t-row"><span class="w-lbl">KEPLERIAN STATE:</span> <span class="val-sm" id="kepler-state">ACTIVE</span></div>
                <div style="width:100%; height:3px; background:#000; margin-top:2px; border:1px solid var(--core-dim);">
                    <div id="macro-bar" style="height:100%; width:0%; background:var(--cyan-glow); box-shadow:0 0 8px var(--cyan-glow); transition: width 0.3s;"></div>
                </div>
            </div>
        `;
    }

    // IDENTICAL STRUCTURE: TOP RIGHT
    const quadTR = document.getElementById('quad-tr') || document.getElementById('quad-COM');
    if (quadTR) {
        quadTR.innerHTML = `
            <div class="panel-data-wrapper" onclick="window.openOptions(event, 'telemetry')" style="cursor: pointer;">
                <div class="v-head">MACRO TELEMETRY</div>
                <div class="t-row"><span class="w-lbl">ORBITAL VELOCITY:</span> <span class="val-sm" id="val-vel">--</span></div>
                <div class="t-row"><span class="w-lbl">SOLAR DISTANCE:</span> <span class="val-sm" id="val-au">--</span></div>
                <div class="t-row"><span class="w-lbl">ACCELERATION:</span></div>
                <div style="font-size:0.8rem; padding:4px; text-align:center; border: 1px solid var(--cyan-glow); background: rgba(0, 240, 255, 0.1); color: var(--cyan-glow); font-family: 'Orbitron'; font-weight: 900; letter-spacing: 2px;" id="val-accel">--</div>
            </div>
        `;
    }

    // IDENTICAL STRUCTURE: BOTTOM LEFT
    const quadBL = document.getElementById('quad-bl') || document.getElementById('quad-ENV');
    if (quadBL) {
        quadBL.innerHTML = `
            <div class="panel-data-wrapper">
                <div class="v-head">LUNAR DYNAMICS</div>
                <div class="t-row" style="justify-content:center; margin-bottom:2px;"><span style="color:var(--cyan-glow); font-family: 'Orbitron'; font-weight: 900; text-shadow:0 0 8px var(--cyan-dim);" id="lunar-dist">ORBITAL DISTANCE: --</span></div>
                <div style="width: 100%; height: 2.5vh; min-height: 20px; background: rgba(0,0,0,0.8); border: 1px solid var(--titanium); border-radius: 4px; position: relative; overflow: hidden; display: flex; align-items: center; justify-content: center; box-shadow: inset 0 0 10px rgba(0,240,255,0.1); margin-bottom: 2px;">
                    <div class="respiration-wave" id="lunar-wave"></div>
                    <div id="lunar-phase-text" style="position: absolute; font-family: 'Orbitron'; font-size: 0.55rem; color: #fff; text-shadow: 0 0 5px #000; font-weight: 900; z-index: 2; letter-spacing: 1px;">CALCULATING PHASE...</div>
                </div>
                <div class="radar-box" onclick="window.openOptions(event, 'lunar')" style="margin-top:0;">
                    <div class="radar-sweep"></div>
                    <div class="radar-text" id="lunar-ill-readout">ILLUMINATION: --</div>
                </div>
            </div>
        `;
    }

    // IDENTICAL STRUCTURE: BOTTOM RIGHT
    const quadBR = document.getElementById('quad-br') || document.getElementById('quad-MEC');
    if (quadBR) {
        quadBR.innerHTML = `
            <div class="panel-data-wrapper">
                <div class="v-head">SYSTEM ALIGNMENT</div>
                <div class="t-row"><span class="w-lbl">BARYCENTRIC OFFSET:</span> <span class="val-sm" id="val-bary">--</span></div>
                <div class="val-display" style="padding:2px 8px; margin-bottom:2px;"><div id="nano-counter" style="font-size:0.8rem; text-align:right; color:var(--cyan-glow); font-family:'Orbitron'; font-weight:900;">0.000000000</div></div>
                <div class="t-row"><span class="w-lbl">Q-DELTA ANCHOR:</span></div>
                <div class="variance-container">
                    <div class="variance-wave"></div>
                    <div class="variance-val" id="val-qdelta">+ 0.0000000000</div>
                </div>
                <div class="val-display" style="padding:2px 8px; margin-bottom:0; cursor:pointer; margin-top:2px;" onclick="window.openOptions(event, 'system')">
                    <div id="val-tension" style="font-size:0.65rem; color:var(--cyan-glow); text-shadow: 0 0 8px var(--cyan-dim); text-align: center; font-family:'JetBrains Mono'; font-weight:700;">
                        MERIDIAN TENSION: --
                    </div>
                </div>
            </div>
        `;
    }
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

window.addEventListener('q-tick', (e) => {
    const { t, isLive, activeTime, daysElapsed, qData, lagDays } = e.detail;

    // --- PANEL DATA SYNC ---
    const isImp = (unitSystem === 'IMPERIAL');
    const B = (360 / 365.24) * (daysElapsed - 81) * (Math.PI / 180);
    const eotMinutes = 9.87 * Math.sin(2 * B) - 7.53 * Math.cos(B) - 1.5 * Math.sin(B);
    
    // Panel TL
    const valEot = document.getElementById('val-eot');
    if (valEot) valEot.innerText = (eotMinutes > 0 ? '+' : '') + eotMinutes.toFixed(1) + ' MIN';
    const valAnomaly = document.getElementById('val-anomaly');
    if (valAnomaly) valAnomaly.innerText = qData.trueArc.toFixed(2) + '°';
    const keplerState = document.getElementById('kepler-state');
    if (keplerState) keplerState.innerText = atomicSync;
    const macroBar = document.getElementById('macro-bar');
    if (macroBar) macroBar.style.width = `${(qData.trueArc / 360) * 100}%`;

    // Panel TR
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

    // Panel BL
    const lunarCycle = 29.53059;
    const lunarDays = ((daysElapsed % lunarCycle) + lunarCycle) % lunarCycle;
    const ill = 0.5 * (1 - Math.cos((lunarDays / lunarCycle) * Math.PI * 2));
    const lunarDistKm = 384400 - (20000 * Math.cos((lunarDays/27.32)*Math.PI*2));
    
    const lunarDist = document.getElementById('lunar-dist');
    if (lunarDist) lunarDist.innerText = isImp ? `ORBITAL DISTANCE: ${(lunarDistKm * 0.621371).toFixed(0)} MI` : `ORBITAL DISTANCE: ${lunarDistKm.toFixed(0)} KM`;
    const lunarIll = document.getElementById('lunar-ill-readout');
    if (lunarIll) lunarIll.innerText = `ILLUMINATION: ${(ill * 100).toFixed(1)}%`;
    const lunarPhaseText = document.getElementById('lunar-phase-text');
    if (lunarPhaseText) {
        if (lunarDays < 1 || lunarDays > 28.5) lunarPhaseText.innerText = 'NEW MOON';
        else if (lunarDays < 6) lunarPhaseText.innerText = 'WAXING CRESCENT';
        else if (lunarDays < 8) lunarPhaseText.innerText = 'FIRST QUARTER';
        else if (lunarDays < 13) lunarPhaseText.innerText = 'WAXING GIBBOUS';
        else if (lunarDays < 16) lunarPhaseText.innerText = 'FULL MOON';
        else if (lunarDays < 21) lunarPhaseText.innerText = 'WANING GIBBOUS';
        else if (lunarDays < 23) lunarPhaseText.innerText = 'LAST QUARTER';
        else lunarPhaseText.innerText = 'WANING CRESCENT';
    }
    const lunarWave = document.getElementById('lunar-wave');
    if (lunarWave) {
        if (lunarDays < 15) {
            lunarWave.style.background = "repeating-linear-gradient(90deg, transparent, transparent 6px, rgba(0,240,255,0.4) 6px, rgba(0,240,255,0.4) 12px)";
            lunarWave.style.animation = "wave-shift 0.8s linear infinite";
        } else {
            lunarWave.style.background = "repeating-linear-gradient(90deg, transparent, transparent 20px, rgba(226,232,240,0.3) 20px, rgba(226,232,240,0.3) 40px)";
            lunarWave.style.animation = "wave-shift 5s linear infinite";
        }
    }

    // Panel BR
    const baryOffset = 1.1 + 0.4 * Math.sin(daysElapsed / 4332 * Math.PI * 2); 
    const valBary = document.getElementById('val-bary');
    if (valBary) valBary.innerText = baryOffset.toFixed(2) + ' R⊙';
    const nanoCounter = document.getElementById('nano-counter');
    if (nanoCounter) {
        const nanoString = (t / 1000).toFixed(9).split('.'); 
        nanoCounter.innerText = `+${nanoString[1]}`;
    }
    const valQdelta = document.getElementById('val-qdelta');
    if (valQdelta) valQdelta.innerText = (qData.delta > 0 ? '+' : '') + qData.delta.toFixed(4) + '°';
    const valTension = document.getElementById('val-tension');
    if (valTension) {
        let tensionHrs = Math.abs(qData.delta * 24).toFixed(2);
        valTension.innerText = `MERIDIAN TENSION: ${tensionHrs} HRS`;
    }

    // --- BARYCENTRIC SVG LOGIC ---
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
    const mx = 12 * Math.cos(moonAngle);
    const my = 12 * Math.sin(moonAngle);
    const svgMoon = document.getElementById('svg-moon');
    if (svgMoon) {
        svgMoon.setAttribute('cx', mx);
        svgMoon.setAttribute('cy', my);
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
        state.simTime += direction * 86400000 * 2; 
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

// DECOUPLED BOOT SEQUENCE
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