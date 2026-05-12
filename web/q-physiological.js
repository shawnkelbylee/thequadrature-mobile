// THE QUADRATURE: PHYSIOLOGICAL VECTOR ENGINE
// Architect: Kelby | Engineer: Kairos
// STATUS: Phase IV UI Engine. Decoupled Logic & Math Engine.
// REVISION: Baseline Restoration & Lexicon Enforcement

let cycleDuration = parseInt(localStorage.getItem('q_bio_duration')) || 90; 
let savedAnchor = localStorage.getItem('q_bio_anchor');
let isAutoAnchor = (savedAnchor === null || savedAnchor === "");
let anchorMins = isAutoAnchor ? 0 : parseInt(savedAnchor); 
let lastRenderedScrub = null;
let lastBioState = "";

window.addEventListener('q-ui-mounted', () => {
    // Inject local vector telemetry into the universal hollow frames
    const quadTL = document.getElementById('quad-tl');
    if (quadTL) {
        quadTL.innerHTML = `
            <div style="position: relative; width: 280px; height: 100%; display: flex; flex-direction: column; justify-content: center; gap: 2px; margin: 0 auto;">
                <div class="v-head">SUNLIGHT EXPOSURE</div>
                <div class="t-row"><span>SOLAR LUX TARGET:</span> <span id="lux-avail" class="val-sm">--</span></div>
                <div class="t-row"><span>UV INDEX EXPOSURE:</span> <span id="uv-index" class="val-sm">--</span></div>
                <div class="t-row"><span>SOLAR NOON (ZENITH):</span> <span id="solar-noon" class="val-sm">--</span></div>
            </div>
        `;
    }

    const quadTR = document.getElementById('quad-tr');
    if (quadTR) {
        quadTR.innerHTML = `
            <div style="position: relative; width: 280px; height: 100%; display: flex; flex-direction: column; justify-content: center; gap: 2px; margin: 0 auto;">
                <div class="v-head">LUNAR/TIDE IMPACT</div>
                <div class="t-row"><span>LUNAR ILLUMINATION:</span> <span id="lunar-illum" class="val-sm">--</span></div>
                <div class="t-row"><span>TIDAL GRAV (SLEEP):</span> <span id="tidal-impact" class="val-sm">NOMINAL</span></div>
                <div class="t-row"><span>LUNAR PHASE:</span> <span id="lunar-phase-name" class="val-sm">--</span></div>
            </div>
        `;
    }

    const quadBL = document.getElementById('quad-bl');
    if (quadBL) {
        quadBL.innerHTML = `
            <div style="position: relative; width: 280px; height: 100%; display: flex; flex-direction: column; justify-content: center; gap: 2px; margin: 0 auto;">
                <div class="v-head">INTERNAL CLOCK</div>
                <div class="t-row"><span>RESTING HR (RHR):</span> <span id="bio-rhr" class="val-sm">-- BPM</span></div>
                <div class="t-row"><span>HRV ELASTICITY:</span> <span id="bio-hrv" class="val-sm">-- MS</span></div>
                <div class="t-row"><span>SLEEP STAGE:</span> <span id="mat-sleep" class="val-sm">DEEP</span></div>
                <div class="t-row"><span>PHYSIOLOGICAL SYNC:</span> <span id="bio-sync-pct" class="val-sm">--%</span></div>
            </div>
        `;
    }

    const quadBR = document.getElementById('quad-br');
    if (quadBR) {
        quadBR.innerHTML = `
            <div style="position: relative; width: 280px; height: 100%; display: flex; flex-direction: column; justify-content: center; gap: 2px; margin: 0 auto;">
                <div class="v-head">FOCUS CYCLE</div>
                <div class="t-row"><span>STATE:</span> <span id="bio-state" class="val-sm">--</span></div>
                <div class="t-row"><span>ELAPSED:</span> <span id="bio-timer" class="val-sm">-- / 90 MIN</span></div>
                <div class="t-row"><span>PHASE COMPLETION:</span> <span id="phase-completion-q" class="val-sm" style="cursor:pointer; border-bottom:1px dashed var(--theme-dim); transition:0.3s;" onmouseover="this.style.color='#fff';" onmouseout="this.style.color='var(--theme-main)';">--</span></div>
                <div class="bar-bg"><div class="bar-fill" id="bio-bar"></div></div>
            </div>
        `;
    }

    engageBiometricVector();
});

async function engageBiometricVector() {
    if (window.Q_PHASE_III && window.Q_PHASE_III.syncBiometrics) {
        try {
            const dynamicDuration = await window.Q_PHASE_III.syncBiometrics();
            if (!localStorage.getItem('q_bio_duration')) cycleDuration = dynamicDuration;
            
            const syncPct = document.getElementById('bio-sync-pct');
            if (syncPct) syncPct.innerText = "100%";
        } catch(e) {
            const syncPct = document.getElementById('bio-sync-pct');
            if (syncPct) syncPct.innerText = "FAIL";
        }
    }
}

function getPhaseName(f) {
    if (f === 0 || f === 1) return "NEW MOON";
    if (f < 0.25) return "WAXING CRESCENT";
    if (f === 0.25) return "FIRST QUARTER";
    if (f < 0.5) return "WAXING GIBBOUS";
    if (f === 0.5) return "FULL MOON";
    if (f < 0.75) return "WANING GIBBOUS";
    if (f === 0.75) return "THIRD QUARTER";
    return "WANING CRESCENT";
}

function getDynamicMoonSVG(phaseFloat, isApex, isPrimary) {
    let shadowColor = isApex ? 'rgba(0, 85, 255, 1)' : `rgba(0, 85, 255, ${(phaseFloat > 0.4 && phaseFloat < 0.6) ? 0.8 : 0.2})`;
    let shadowSize = isApex ? '15px' : (isPrimary ? '8px' : '3px');
    let html = `<svg viewBox="0 0 32 32" width="100%" height="100%" style="border-radius:50%; box-shadow: 0 0 ${shadowSize} ${shadowColor};">`;
    html += `<circle cx="16" cy="16" r="15" fill="#05080f" stroke="rgba(184,41,255,0.4)" stroke-width="1"/>`;
    let rx = Math.max(0.01, Math.abs(15 * Math.cos(phaseFloat * 2 * Math.PI))); 
    let sweep = phaseFloat < 0.5 ? (phaseFloat <= 0.25 ? 0 : 1) : (phaseFloat <= 0.75 ? 0 : 1);
    let path = phaseFloat < 0.5 ? `M 16 1 A 15 15 0 0 1 16 31 A ${rx} 15 0 0 ${sweep} 16 1` : `M 16 1 A 15 15 0 0 0 16 31 A ${rx} 15 0 0 ${sweep} 16 1`;
    if (phaseFloat === 0.5) html += `<circle cx="16" cy="16" r="15" fill="#E5E4E2"/>`;
    else if (phaseFloat !== 0 && phaseFloat !== 1) html += `<path d="${path}" fill="#E5E4E2"/>`;
    html += `</svg>`;
    return html;
}

function renderDynamicMoons(daysElapsed) {
    const container = document.getElementById('lunar-nodes-container');
    if (!container) return;
    
    container.innerHTML = '';
    const synodicMonth = 29.530588;
    const C = Math.floor((daysElapsed + 1.555) / synodicMonth);
    const windowDays = 100;
    
    let closestNode = null;
    let minDelta = Infinity;
    let allNodes = [];

    for (let c = C - 4; c <= C + 4; c++) {
        for (let p = 0; p < 16; p++) {
            let phaseFloat = p / 16;
            let absoluteDays = c * synodicMonth + (phaseFloat * synodicMonth) - 1.555;
            let deltaDays = absoluteDays - daysElapsed;
            allNodes.push({ absoluteDays, deltaDays, c, p, phaseFloat });
            
            if (Math.abs(deltaDays) < minDelta) {
                minDelta = Math.abs(deltaDays);
                closestNode = { c, p };
            }
        }
    }

    allNodes.forEach(n => {
        if (Math.abs(n.deltaDays) <= windowDays) {
            let opacity = Math.pow(1 - (Math.abs(n.deltaDays) / windowDays), 1.5); 
            let meanArc = (n.absoluteDays * (360 / 365.24219)) % 360;
            if (meanArc < 0) meanArc += 360;
            let rad = (meanArc - 90) * (Math.PI / 180);
            
            let isPrimary = (n.p % 4 === 0);
            let rMap = 46 - 8 * Math.cos(n.phaseFloat * 2 * Math.PI);
            let x = 50 + rMap * Math.cos(rad);
            let y = 50 + rMap * Math.sin(rad);
            
            let isApex = (n.c === closestNode.c && n.p === closestNode.p);
            let size = isApex ? 28 : (isPrimary ? 18 : 10);
            let zIndex = isApex ? 50 : (isPrimary ? 20 : 10);
            
            let node = document.createElement('div');
            node.className = 'lunar-phase-icon';
            node.style.cssText = `position:absolute; width:${size}px; height:${size}px; margin-left:${-(size/2)}px; margin-top:${-(size/2)}px; left:${x}%; top:${y}%; opacity:${isApex ? 1.0 : opacity}; z-index:${zIndex}; cursor:help; pointer-events:auto;`;
            
            if (isApex) {
                node.style.filter = 'drop-shadow(0 0 10px var(--bio-cobalt)) drop-shadow(0 0 20px var(--bio-purple)) brightness(1.2)';
            }
            
            node.innerHTML = getDynamicMoonSVG(n.phaseFloat, isApex, isPrimary);
            
            node.onclick = () => {
                const targetMs = window.ANCHOR_ALPHA_DYNAMIC + (n.absoluteDays * window.MS_DAY);
                const fd = window.formatLegacyDate(targetMs);
                const phaseName = getPhaseName(n.phaseFloat);
                if (window.Q_ModalEngine) {
                    window.Q_ModalEngine.render(`LUNAR PHASE: ${phaseName}`, `
                        <div style="font-family:'JetBrains Mono'; font-size:0.75rem; color:var(--platinum); text-align:center; line-height: 1.6;">
                            <span style="color:var(--theme-main); font-family:'Orbitron'; font-weight:bold; font-size:0.85rem;">${fd.dateStr}</span><br>
                            ILLUMINATION: ${(n.phaseFloat > 0.5 ? (1 - n.phaseFloat) * 200 : n.phaseFloat * 200).toFixed(1)}%<br>
                            ORBITAL ARC: ${meanArc.toFixed(2)}°
                        </div>
                    `);
                }
            };
            
            container.appendChild(node);
        }
    });
}

function calculateSolarMetrics(daysElapsed) {
    const lat = window.Q_STATE?.location?.lat || 0;
    const declination = 23.45 * Math.sin((360 / 365.24219) * (daysElapsed - 81) * Math.PI / 180);
    return {
        lux: (declination > 0 && lat > 0) || (declination < 0 && lat < 0) ? "HIGH (>10,000)" : "LOW (<2,500)",
        uv: (declination > 0 && lat > 0) || (declination < 0 && lat < 0) ? "MODERATE-HIGH" : "LOW-MINIMAL",
        sunsetOffset: (declination > 0 && lat > 0) || (declination < 0 && lat < 0) ? 1 : -1
    };
}

window.addEventListener('q-tick', (e) => {
    const { t, isLive, activeTime, daysElapsed, qData, legacyDateStr, legacyTimeStr } = e.detail;

    if (lastRenderedScrub === null || Math.abs(daysElapsed - lastRenderedScrub) > 0.05) {
        renderDynamicMoons(daysElapsed);
        lastRenderedScrub = daysElapsed;
    }

    const earthSurface = document.querySelector('.bio-earth-surface');
    if (earthSurface) {
        const lon = window.Q_STATE?.location?.lon || 0;
        const siderealDayMs = 86164090;
        const utcFraction = (t % siderealDayMs) / siderealDayMs;
        const lonFraction = lon / 360;
        const bgPosition = 200 - (utcFraction * 200) - (lonFraction * 200) + 100; 
        earthSurface.style.backgroundPosition = `${bgPosition}% 0`;
    }

    // BIOMETRIC DATA SIMULATION HOOKS
    let baseRHR = 55 + Math.sin(t / 10000) * 5;
    let baseHRV = 65 + Math.cos(t / 15000) * 10;
    
    const bioRhr = document.getElementById('bio-rhr');
    if (bioRhr) bioRhr.innerText = baseRHR.toFixed(1) + " BPM";
    
    const bioHrv = document.getElementById('bio-hrv');
    if (bioHrv) bioHrv.innerText = baseHRV.toFixed(1) + " MS";

    // TIDAL GRAVITY IMPACT
    let tideStr = "NOMINAL (NEAP TIDE)";
    let tideColor = "var(--theme-main)";
    if (qData.lunarPhase < 0.05 || qData.lunarPhase > 0.95 || (qData.lunarPhase > 0.45 && qData.lunarPhase < 0.55)) {
        tideStr = "HIGH IMPACT (SPRING TIDE)";
        tideColor = "var(--friction-red)";
    }
    const tidalEl = document.getElementById('tidal-impact');
    if (tidalEl) {
        tidalEl.innerText = tideStr;
        tidalEl.style.color = tideColor;
        tidalEl.style.textShadow = tideColor === "var(--friction-red)" ? "0 0 10px rgba(255,51,51,0.4)" : "";
    }

    // --- 5-PHASE THERMODYNAMIC MODEL INTEGRATION ---
    let activeMs = ((t % 86400000) - (anchorMins * 60000) + 86400000) % 86400000;
    let minsSinceWake = Math.floor(activeMs / 60000);
    
    let sleepDuration = parseInt(localStorage.getItem('q_sleep_cycle_duration')) || 450;
    let wakingDurationMins = 1440 - sleepDuration;
    let inertiaMins = parseInt(localStorage.getItem('q_sleep_inertia_mins')) || 45;
    let dlmoMins = parseInt(localStorage.getItem('q_dlmo_offset_mins')) || 90;
    
    let currentBioState;
    let cyclePosFloat = 0;
    let remainingMins = 0;
    let elapsedStr = "";

    if (minsSinceWake >= wakingDurationMins) {
        currentBioState = "SLEEP / RECOVERY";
        cyclePosFloat = (minsSinceWake - wakingDurationMins) / sleepDuration;
        remainingMins = 1440 - minsSinceWake;
        elapsedStr = `${Math.floor(minsSinceWake - wakingDurationMins)} / ${sleepDuration} MIN`;
    } else if (minsSinceWake < inertiaMins) {
        currentBioState = "SLEEP INERTIA";
        cyclePosFloat = minsSinceWake / inertiaMins;
        remainingMins = inertiaMins - minsSinceWake;
        elapsedStr = `${minsSinceWake} / ${inertiaMins} MIN`;
    } else if (minsSinceWake >= wakingDurationMins - dlmoMins) {
        currentBioState = "DLMO WIND-DOWN";
        let dlmoElapsed = minsSinceWake - (wakingDurationMins - dlmoMins);
        cyclePosFloat = dlmoElapsed / dlmoMins;
        remainingMins = wakingDurationMins - minsSinceWake;
        elapsedStr = `${dlmoElapsed} / ${dlmoMins} MIN`;
    } else {
        let coreMins = minsSinceWake - inertiaMins;
        cyclePosFloat = (coreMins % cycleDuration) / cycleDuration;
        currentBioState = (cyclePosFloat < 0.77) ? "DEEP FLOW" : "VENT/RECOVERY";
        remainingMins = cycleDuration - (coreMins % cycleDuration);
        elapsedStr = `${Math.floor(coreMins % cycleDuration)} / ${cycleDuration} MIN`;
    }
    
    if (currentBioState !== lastBioState) {
        const bioStateEl = document.getElementById('bio-state');
        if (bioStateEl) bioStateEl.innerText = currentBioState;
        
        const bioAuraEl = document.getElementById('bio-aura');
        if (bioAuraEl) {
            if (currentBioState === "DEEP FLOW") bioAuraEl.className = "aura-glow flow-aura";
            else if (currentBioState === "VENT/RECOVERY") bioAuraEl.className = "aura-glow vent-aura";
            else if (currentBioState === "SLEEP / RECOVERY") bioAuraEl.className = "aura-glow sleep-aura";
            else if (currentBioState === "SLEEP INERTIA") bioAuraEl.className = "aura-glow inertia-aura";
            else if (currentBioState === "DLMO WIND-DOWN") bioAuraEl.className = "aura-glow dlmo-aura";
        }
        lastBioState = currentBioState;
    }
    
    const bioTimerEl = document.getElementById('bio-timer');
    if (bioTimerEl) bioTimerEl.innerText = elapsedStr;
    
    const bioBarEl = document.getElementById('bio-bar');
    if (bioBarEl) bioBarEl.style.width = (cyclePosFloat * 100) + "%";
    
    const matSleepEl = document.getElementById('mat-sleep');
    if (matSleepEl) {
        if (currentBioState === "SLEEP / RECOVERY") matSleepEl.innerText = "DEEP";
        else if (currentBioState === "DLMO WIND-DOWN" || currentBioState === "SLEEP INERTIA") matSleepEl.innerText = "LIGHT/TRANSITION";
        else matSleepEl.innerText = currentBioState === "VENT/RECOVERY" ? "LIGHT/REM" : "AWAKE";
    }

    // PHASE COMPLETION HOOK
    let remainingMs = remainingMins * 60000;
    let completionAbsoluteMs = t + remainingMs;
    let completionDays = (completionAbsoluteMs - window.ANCHOR_ALPHA_DYNAMIC) / window.MS_DAY;
    
    if (window.getOrbitalData) {
        let compData = window.getOrbitalData(completionDays);
        let compCoordStr = `Q${compData.quad} S${compData.sect} D${compData.day}`;
        
        let completionEl = document.getElementById('phase-completion-q');
        if (completionEl) {
            completionEl.innerText = compCoordStr;
            completionEl.onclick = (ev) => {
                ev.stopPropagation();
                if(window.Q_OmniPlanner && window.Q_OmniPlanner.openPlanner) {
                    const d = new Date(completionAbsoluteMs);
                    window.Q_OmniPlanner.jumpToDate(`${d.getFullYear()}-${(d.getMonth()+1).toString().padStart(2,'0')}-${d.getDate().toString().padStart(2,'0')}`);
                    window.Q_OmniPlanner.openPlanner(true);
                    if(window.Q_MobileBridge) window.Q_MobileBridge.pulse('MEDIUM');
                }
            };
        }
    }

    const sm = calculateSolarMetrics(daysElapsed);
    const luxAvail = document.getElementById('lux-avail');
    if (luxAvail) luxAvail.innerText = sm.lux;
    
    const uvIndex = document.getElementById('uv-index');
    if (uvIndex) uvIndex.innerText = sm.uv;
    
    const lunarIllum = document.getElementById('lunar-illum');
    if (lunarIllum) lunarIllum.innerText = (qData.lunarPhase > 0.5 ? (1 - qData.lunarPhase) * 200 : qData.lunarPhase * 200).toFixed(1) + '%';
    
    const lunarPhaseName = document.getElementById('lunar-phase-name');
    if (lunarPhaseName) lunarPhaseName.innerText = getPhaseName(qData.lunarPhase);
    
    const solarNoon = document.getElementById('solar-noon');
    if (solarNoon) solarNoon.innerText = "T-" + (12 - new Date(t).getUTCHours()) + "H";
});

if (window.generateStars) window.generateStars('stars');