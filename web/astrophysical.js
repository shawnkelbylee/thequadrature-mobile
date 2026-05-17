// THE QUADRATURE: ASTROPHYSICAL VECTOR ENGINE
// Architect: Kelby | Engineer: Kairos
// STATUS: Phase XLIX. Restored Legacy Panels & Barycentric Engine integration.
// REVISION: Dual-Targeting initialized via q-ui-mounted.

let currentRadarStatus = 'STABLE';
let lastThermoPhase = "";

// Modal State Options
let atomicSync = "MASTER";
let standardizedInterval = "ACTIVE";
let varianceResolution = "HIGH";
let isBooted = false;
let currentOptTarget = '';

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
    // DUAL-ID Targeting: Catches the element whether the UI generates 'opt-tl' or just classes
    const optTL = document.getElementById('opt-tl') || document.querySelectorAll('.opt-oval')[0];
    const optTR = document.getElementById('opt-tr') || document.querySelectorAll('.opt-oval')[1];
    const optBL = document.getElementById('opt-bl') || document.querySelectorAll('.opt-oval')[2];
    const optBR = document.getElementById('opt-br') || document.querySelectorAll('.opt-oval')[3];

    if (optTL) { optTL.onclick = (e) => { e.stopPropagation(); window.openOptions(e, 'orbital'); }; optTL.style.color = 'var(--cyan-glow)'; }
    if (optTR) { optTR.onclick = (e) => { e.stopPropagation(); window.openOptions(e, 'telemetry'); }; optTR.style.color = 'var(--cyan-glow)'; }
    if (optBL) { optBL.onclick = (e) => { e.stopPropagation(); window.openOptions(e, 'thermo'); }; optBL.style.color = 'var(--cyan-glow)'; }
    if (optBR) { optBR.onclick = (e) => { e.stopPropagation(); window.openOptions(e, 'civil'); }; optBR.style.color = 'var(--cyan-glow)'; }

    // RESTORED LEGACY PANEL: ORBITAL POSITION
    const quadTL = document.getElementById('quad-tl') || document.getElementById('quad-BIO');
    if (quadTL) {
        quadTL.innerHTML = `
            <div class="panel-data-wrapper">
                <div class="v-head">ORBITAL POSITION</div>
                <div class="t-row"><span class="w-lbl">NEXT ANCHOR:</span> <span class="val-sm" id="next-anchor">--</span></div>
                <div class="t-row"><span class="w-lbl">DRIFT TO ANCHOR:</span> <span class="val-sm" id="drift-to-anchor">--</span></div>
                <div class="t-row"><span class="w-lbl">ANCHOR DURATION:</span> <span class="val-sm" id="anchor-duration">--</span></div>
                <div class="t-row"><span class="w-lbl">ATOMIC FREQUENCY:</span> <span class="val-sm" id="atomic-sync-val">SYNCED</span></div>
                <div style="width:100%; height:3px; background:#000; margin-top:2px; border:1px solid var(--core-dim);">
                    <div id="macro-bar" style="height:100%; width:0%; background:var(--cyan-glow); box-shadow:0 0 8px var(--cyan-glow); transition: width 0.3s;"></div>
                </div>
            </div>
        `;
    }

    // RESTORED LEGACY PANEL: TIME DRIFT / Q-DELTA
    const quadTR = document.getElementById('quad-tr') || document.getElementById('quad-COM');
    if (quadTR) {
        quadTR.innerHTML = `
            <div class="panel-data-wrapper" onclick="window.openOptions(event, 'telemetry')" style="cursor: pointer;">
                <div class="v-head">TIME DRIFT / Q-DELTA</div>
                <div class="t-row"><span class="w-lbl">ORBITAL ECCENTRICITY:</span> <span class="val-sm">0.0167</span></div>
                <div class="t-row"><span class="w-lbl">SYMMETRY LOSS:</span> <span class="val-sm" id="sym-loss">--%</span></div>
                <div class="t-row"><span class="w-lbl">EQUATION OF TIME (Q-DELTA):</span></div>
                <div style="font-size:0.8rem; padding:4px; text-align:center; border: 1px solid var(--cyan-glow); background: rgba(0, 240, 255, 0.1); color: var(--cyan-glow); font-family: 'Orbitron'; font-weight: 900; letter-spacing: 2px;" id="rt-delta">--</div>
            </div>
        `;
    }

    // RESTORED LEGACY PANEL: THERMODYNAMICS
    const quadBL = document.getElementById('quad-bl') || document.getElementById('quad-ENV');
    if (quadBL) {
        quadBL.innerHTML = `
            <div class="panel-data-wrapper">
                <div class="v-head">THERMODYNAMICS</div>
                <div class="t-row" style="justify-content:center; margin-bottom:2px;"><span style="color:var(--cyan-glow); font-family: 'Orbitron'; font-weight: 900; text-shadow:0 0 8px var(--cyan-dim);" id="solar-float-delta">KEPLERIAN MULTIPLIER: --</span></div>
                <div style="width: 100%; height: 2.5vh; min-height: 20px; background: rgba(0,0,0,0.8); border: 1px solid var(--titanium); border-radius: 4px; position: relative; overflow: hidden; display: flex; align-items: center; justify-content: center; box-shadow: inset 0 0 10px rgba(0,240,255,0.1); margin-bottom: 2px;">
                    <div class="respiration-wave" id="resp-wave"></div>
                    <div id="resp-phase-text" style="position: absolute; font-family: 'Orbitron'; font-size: 0.55rem; color: #fff; text-shadow: 0 0 5px #000; font-weight: 900; z-index: 2; letter-spacing: 1px;">CALCULATING VARIANCE...</div>
                </div>
                <div class="radar-box" onclick="window.openOptions(event, 'thermo')" style="margin-top:0;">
                    <div class="radar-sweep"></div>
                    <div class="radar-text" id="radar-readout">CALCULATING THERMAL MODEL...</div>
                </div>
            </div>
        `;
    }

    // RESTORED LEGACY PANEL: CIVIL TIME LAG
    const quadBR = document.getElementById('quad-br') || document.getElementById('quad-MEC');
    if (quadBR) {
        quadBR.innerHTML = `
            <div class="panel-data-wrapper">
                <div class="v-head">CIVIL TIME LAG</div>
                <div class="t-row"><span class="w-lbl">STANDARDIZED INTERVAL:</span> <span class="val-sm" id="si-lock">ACTIVE</span></div>
                <div class="val-display" style="padding:2px 8px; margin-bottom:2px;"><div id="nano-counter" style="font-size:0.8rem; text-align:right; color:var(--cyan-glow); font-family:'Orbitron'; font-weight:900;">0.000000000</div></div>
                <div class="t-row"><span class="w-lbl">ORBITAL DELTA:</span></div>
                <div class="variance-container">
                    <div class="variance-wave"></div>
                    <div class="variance-val" id="variance-val">+ 0.0000000000</div>
                </div>
                <div class="val-display" style="padding:2px 8px; margin-bottom:0; cursor:pointer; margin-top:2px;" onclick="window.openOptions(event, 'civil')">
                    <div id="civil-tension-readout" style="font-size:0.65rem; color:var(--cyan-glow); text-shadow: 0 0 8px var(--cyan-dim); text-align: center; font-family:'JetBrains Mono'; font-weight:700;">
                        CALCULATING OFFSET...
                    </div>
                </div>
            </div>
        `;
    }
};

window.openOptions = function(e, target) {
    if(e) e.stopPropagation();
    currentOptTarget = target;
    let title = ""; let html = "";

    if(target === 'orbital') {
        title = "ORBITAL CALIBRATION";
        html = `
            <div>
                <label style="font-size: 0.6rem; color: rgba(255,255,255,0.6); font-family: 'Orbitron'; letter-spacing: 1px;">ATOMIC FREQUENCY SYNC</label>
                <select id="opt-atomic" class="modal-input" style="background: rgba(0,0,0,0.6); border: 1px solid var(--cyan-glow); color: #fff; padding: 10px; font-family: 'JetBrains Mono'; font-size: 0.8rem; border-radius: 4px; outline: none; margin-top: 4px; width: 100%;">
                    <option value="MASTER" ${atomicSync==='MASTER'?'selected':''}>MASTER (STRICT TRACKING)</option>
                    <option value="SLAVE" ${atomicSync==='SLAVE'?'selected':''}>SLAVE (FLUID TRACKING)</option>
                </select>
            </div>
        `;
        if (window.Q_ModalEngine) window.Q_ModalEngine.render(title, html, 'SAVE PARAMETERS', window.saveOptions);
    } else if (target === 'telemetry') {
        title = "DUAL-STATE TELEMETRY";
        html = `
            <div style="text-align: center;">
                <div style="font-size: 0.65rem; color: var(--steel); margin-bottom: 15px;">MAPPING THE VELOCITY VARIANCE</div>
                <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 1px dashed var(--titanium); padding-bottom: 15px; margin-bottom: 15px;">
                    <div style="display:flex; flex-direction:column; align-items:center; width: 45%;">
                        <span style="font-family:'Orbitron'; font-size:0.55rem; color:var(--cyan-glow); margin-bottom: 4px;">MEAN CIRCLE (CIVIL)</span>
                        <span id="tel-mean" style="font-weight:bold; font-size:1.1rem; color:var(--cyan-glow); text-shadow:0 0 8px var(--cyan-dim);">--°</span>
                    </div>
                    <div style="font-family:'JetBrains Mono'; font-size:0.8rem; color:var(--steel);">VS</div>
                    <div style="display:flex; flex-direction:column; align-items:center; width: 45%;">
                        <span style="font-family:'Orbitron'; font-size:0.55rem; color:var(--cyan-glow); margin-bottom: 4px;">TRUE ELLIPSE (PHYSICS)</span>
                        <span id="tel-true" style="font-weight:bold; font-size:1.1rem; color:var(--cyan-glow); text-shadow:0 0 8px var(--cyan-dim);">--°</span>
                    </div>
                </div>
                <div style="display:flex; flex-direction:column; align-items:center;">
                    <span style="font-family:'Orbitron'; font-size:0.65rem; color:var(--core-plat);">Q-DELTA (VARIANCE)</span>
                    <span id="tel-delta" style="font-weight:900; font-size:1.5rem; color:#fff; text-shadow:0 0 15px var(--core-glow); margin-top:5px;">--°</span>
                </div>
            </div>
        `;
        if (window.Q_ModalEngine) window.Q_ModalEngine.render(title, html);
    } else if (target === 'thermo') {
        let iconStr = "⛨", statusStr = "THERMODYNAMICS STABLE", descStr = "Orbital arc in optimal transit window.";
        if(currentRadarStatus === 'THERMODYNAMIC FRICTION') {
            iconStr = "🌪"; statusStr = "THERMODYNAMIC FRICTION"; descStr = "Approaching Seasonal Node. Thermodynamic friction elevated.";
        } else if(currentRadarStatus === 'THERMAL SPIKE') {
            iconStr = "⚡"; statusStr = "THERMAL SPIKE DETECTED"; descStr = "Approaching inter-quadrant threshold.";
        }
        title = "CLIMATIC BASELOAD MODELING";
        html = `
            <div style="text-align: center; padding: 10px 0;">
                <div style="font-size: 2rem; margin-bottom: 10px; color: var(--cyan-glow);">${iconStr}</div>
                <div style="font-family: 'Orbitron'; font-size: 1.1rem; color: var(--cyan-glow); margin-bottom: 5px;">${statusStr}</div>
                <div style="font-size: 0.65rem; color: var(--steel); padding: 0 10px;">${descStr}</div>
            </div>
        `;
        if (window.Q_ModalEngine) window.Q_ModalEngine.render(title, html);
    } else if (target === 'civil') {
        title = "CIVIL TIME SETTINGS";
        html = `
            <div>
                <label style="font-size: 0.6rem; color: rgba(255,255,255,0.6); font-family: 'Orbitron'; letter-spacing: 1px;">STANDARDIZED INTERVAL</label>
                <select id="opt-interval" class="modal-input" style="background: rgba(0,0,0,0.6); border: 1px solid var(--cyan-glow); color: #fff; padding: 10px; font-family: 'JetBrains Mono'; font-size: 0.8rem; border-radius: 4px; outline: none; margin-top: 4px; width: 100%;">
                    <option value="ACTIVE" ${standardizedInterval==='ACTIVE'?'selected':''}>ACTIVE (LOCKED TO CIVIL)</option>
                    <option value="SUSPENDED" ${standardizedInterval==='SUSPENDED'?'selected':''}>SUSPENDED (DRIFTING)</option>
                </select>
            </div>
            <div style="margin-top: 10px;">
                <label style="font-size: 0.6rem; color: rgba(255,255,255,0.6); font-family: 'Orbitron'; letter-spacing: 1px;">VARIANCE RESOLUTION</label>
                <select id="opt-resolution" class="modal-input" style="background: rgba(0,0,0,0.6); border: 1px solid var(--cyan-glow); color: #fff; padding: 10px; font-family: 'JetBrains Mono'; font-size: 0.8rem; border-radius: 4px; outline: none; margin-top: 4px; width: 100%;">
                    <option value="HIGH" ${varianceResolution==='HIGH'?'selected':''}>HIGH (NANOSECONDS)</option>
                    <option value="LOW" ${varianceResolution==='LOW'?'selected':''}>LOW (MILLISECONDS)</option>
                </select>
            </div>
        `;
        if (window.Q_ModalEngine) window.Q_ModalEngine.render(title, html, 'SAVE SETTINGS', window.saveOptions);
    }
};

window.saveOptions = function() {
    if (currentOptTarget === 'orbital') {
        const atomicEl = document.getElementById('opt-atomic');
        if (atomicEl) atomicSync = atomicEl.value;
        const syncEl = document.getElementById('atomic-sync-val');
        if (syncEl) syncEl.innerText = atomicSync === 'MASTER' ? 'SYNCED' : 'FLUID';
    } else if (currentOptTarget === 'civil') {
        const intEl = document.getElementById('opt-interval');
        if (intEl) standardizedInterval = intEl.value;
        const resEl = document.getElementById('opt-resolution');
        if (resEl) varianceResolution = resEl.value;
        const siEl = document.getElementById('si-lock');
        if (siEl) siEl.innerText = standardizedInterval;
    }
    if (window.Q_ModalEngine) window.Q_ModalEngine.close();
};

window.addEventListener('q-tick', (e) => {
    const { t, isLive, activeTime, daysElapsed, qData, lagDays, legacyDateStr, legacyTimeStr, activePostulate } = e.detail;

    // --- RESTORED LEGACY PANEL LOGIC ---
    let anchorName = "SOUTHERN SOLSTICE";
    let progressToAnchor = 0;
    let driftDeg = 0;
    let anchorDurMs = window.Q_GEAR_CONSTANTS ? window.Q_GEAR_CONSTANTS.ALPHA : 86400000;
    
    if (qData.trueArc >= 0 && qData.trueArc < 90) { 
        anchorName = "1ST EQUINOX"; 
        driftDeg = 90 - qData.trueArc;
        progressToAnchor = (qData.trueArc / 90) * 100; 
        anchorDurMs = window.Q_GEAR_CONSTANTS ? window.Q_GEAR_CONSTANTS.BETA : 84600000;
    } else if (qData.trueArc >= 90 && qData.trueArc < 180) { 
        anchorName = "NORTHERN SOLSTICE"; 
        driftDeg = 180 - qData.trueArc;
        progressToAnchor = ((qData.trueArc - 90) / 90) * 100; 
        anchorDurMs = window.Q_GEAR_CONSTANTS ? window.Q_GEAR_CONSTANTS.GAMMA : 89662680;
    } else if (qData.trueArc >= 180 && qData.trueArc < 270) { 
        anchorName = "2ND EQUINOX"; 
        driftDeg = 270 - qData.trueArc;
        progressToAnchor = ((qData.trueArc - 180) / 90) * 100; 
        anchorDurMs = window.Q_GEAR_CONSTANTS ? window.Q_GEAR_CONSTANTS.DELTA : 102599640;
    } else { 
        anchorName = "360° THRESHOLD"; 
        driftDeg = 360 - qData.trueArc;
        progressToAnchor = ((qData.trueArc - 270) / 90) * 100; 
        anchorDurMs = window.Q_GEAR_CONSTANTS ? window.Q_GEAR_CONSTANTS.EPSILON : 89662680;
    }
    
    const nextAnchorEl = document.getElementById('next-anchor');
    if (nextAnchorEl) nextAnchorEl.innerText = anchorName;
    
    const driftEl = document.getElementById('drift-to-anchor');
    if (driftEl) driftEl.innerText = driftDeg.toFixed(2) + "° REMAINING";
    
    const durEl = document.getElementById('anchor-duration');
    if (durEl) durEl.innerText = (anchorDurMs / 3600000).toFixed(4) + "h";
    
    const macroBar = document.getElementById('macro-bar');
    if (macroBar) macroBar.style.width = `${progressToAnchor}%`;
    
    let symLoss = Math.abs(qData.delta) / 180 * 100; 
    let symLossEl = document.getElementById('sym-loss');
    if (symLossEl) symLossEl.innerText = symLoss.toFixed(2) + "%";

    let radDist = (qData.trueArc - 14) * (Math.PI / 180);
    let velocityMult = 1 + 0.0334 * Math.cos(radDist);

    const waveEl = document.getElementById('resp-wave');
    const phaseTextEl = document.getElementById('resp-phase-text');
    const deltaEl = document.getElementById('solar-float-delta');
    
    let newPhase = "";
    if (velocityMult > 1.015) {
        if (waveEl) {
            waveEl.style.background = "repeating-linear-gradient(90deg, transparent, transparent 6px, rgba(0,240,255,0.4) 6px, rgba(0,240,255,0.4) 12px)";
            waveEl.style.animation = "wave-shift 0.8s linear infinite";
        }
        newPhase = "ACCELERATED (PERIHELION)";
    } else if (velocityMult < 0.985) {
        if (waveEl) {
            waveEl.style.background = "repeating-linear-gradient(90deg, transparent, transparent 20px, rgba(0,240,255,0.2) 20px, rgba(0,240,255,0.2) 40px)";
            waveEl.style.animation = "wave-shift 5s linear infinite";
        }
        newPhase = "DILATED (APHELION)";
    } else {
        if (waveEl) {
            waveEl.style.background = "repeating-linear-gradient(90deg, transparent, transparent 15px, rgba(226,232,240,0.3) 15px, rgba(226,232,240,0.3) 30px)";
            waveEl.style.animation = "wave-shift 2.5s linear infinite";
        }
        newPhase = "NOMINAL TRANSIT";
    }

    const rtDeltaEl = document.getElementById('rt-delta');
    if (rtDeltaEl) rtDeltaEl.innerText = (qData.delta > 0 ? "+" : "") + qData.delta.toFixed(4) + "°";
    
    if (deltaEl) deltaEl.innerText = `KEPLERIAN MULTIPLIER: ${velocityMult.toFixed(3)}x`;
    if (phaseTextEl) phaseTextEl.innerText = newPhase;

    const radarProximity = Math.abs(Math.sin((qData.trueArc * Math.PI) / 45)); 
    const radarText = document.getElementById('radar-readout');
    
    if(radarProximity > 0.98) { 
        currentRadarStatus = 'THERMODYNAMIC FRICTION'; 
        if (radarText) radarText.innerText = "⚠ THERMODYNAMIC FRICTION"; 
    } else if(radarProximity > 0.85) { 
        currentRadarStatus = 'THERMAL SPIKE'; 
        if (radarText) radarText.innerText = "THERMAL SPIKE DETECTED"; 
    } else { 
        currentRadarStatus = 'STABLE'; 
        if (radarText) radarText.innerText = "THERMODYNAMICS STABLE"; 
    }

    const nanoCounter = document.getElementById('nano-counter');
    if (nanoCounter) {
        const nanoString = (t / 1000).toFixed(9).split('.'); 
        nanoCounter.innerText = `+${nanoString[1]}`;
    }
    
    const varianceValText = document.getElementById('variance-val');
    if (varianceValText) {
        const expected = Math.round(t / 1000) * 1000;
        const varianceVal = (t - expected) / 1000;
        if(varianceResolution === 'HIGH') {
            varianceValText.innerText = `${varianceVal > 0 ? '+' : ''} ${varianceVal.toFixed(10)}`;
        } else {
            varianceValText.innerText = `${varianceVal > 0 ? '+' : ''} ${varianceVal.toFixed(3)} ms`;
        }
    }

    let offsetStr = "--";
    if (typeof lagDays !== 'undefined') {
        offsetStr = `[LAG: +${(lagDays * 24).toFixed(2)}h]`; 
    }
    const civilTensionReadout = document.getElementById('civil-tension-readout');
    if (civilTensionReadout) {
        civilTensionReadout.innerHTML = `<span style="color:var(--cyan-glow);">${offsetStr}</span>`; 
    }

    // --- NEW BARYCENTRIC SVG LOGIC ---
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

// Fallback execution block if `q-ui-mounted` fired before this file initialized
if (document.readyState === 'complete' || document.readyState === 'interactive') {
    setTimeout(() => {
        if(!isBooted && document.getElementById('q-ui-injected-flag')) bootAstrophysicalVector();
    }, 150);
}