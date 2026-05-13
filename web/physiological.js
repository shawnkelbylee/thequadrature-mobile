// THE QUADRATURE: PHYSIOLOGICAL VECTOR ENGINE
// Architect: Kelby | Engineer: Kairos
// STATUS: Phase IV UI Engine. Decoupled Logic & Math Engine.
// REVISION: Terminology Simplification & Bar Chart Migration

let cycleDuration = parseInt(localStorage.getItem('q_bio_duration')) || 90; 
let savedAnchor = localStorage.getItem('q_bio_anchor');
let isAutoAnchor = (savedAnchor === null || savedAnchor === "");
let anchorMins = isAutoAnchor ? 0 : parseInt(savedAnchor); 
let lastRenderedScrub = null;
let lastBioState = "";
let isBooted = false;

window.addEventListener('q-ui-mounted', () => {
    if(isBooted) return;
    isBooted = true;

    // Inject local vector telemetry into the universal hollow frames provided by q-ui.js
    const quadTL = document.getElementById('quad-tl');
    if (quadTL) {
        quadTL.innerHTML = `
            <div style="position: relative; width: 280px; height: 100%; display: flex; flex-direction: column; justify-content: center; gap: 2px; margin: 0 auto;">
                <div class="v-head">INTERNAL CLOCK</div>
                <div class="t-row"><span class="w-lbl">SCHEDULE DRIFT:</span> <span id="tau-offset" class="val-sm">--</span></div>
                <div class="t-row"><span class="w-lbl">BIOMETRIC SENSOR:</span> <span id="bio-sensor" class="val-sm" style="color: var(--os-grey);">[ PENDING PAIRING ]</span></div>
            </div>
        `;
    }

    const quadTR = document.getElementById('quad-tr');
    if (quadTR) {
        quadTR.innerHTML = `
            <div style="position: relative; width: 280px; height: 100%; display: flex; flex-direction: column; justify-content: center; gap: 2px; margin: 0 auto;">
                <div class="v-head">ENERGY CYCLE</div>
                <div class="t-row"><span class="w-lbl">CURRENT STATE:</span> <span id="brac-state" class="val-sm">--</span></div>
                <div class="t-row"><span class="w-lbl">CYCLE REMAINING:</span> <span id="phase-horizon" class="val-sm">--</span></div>
                <div class="bar-bg"><div class="bar-fill" id="bio-bar"></div></div>
            </div>
        `;
    }

    const quadBL = document.getElementById('quad-bl');
    if (quadBL) {
        quadBL.innerHTML = `
            <div style="position: relative; width: 280px; height: 100%; display: flex; flex-direction: column; justify-content: center; gap: 2px; margin: 0 auto;">
                <div class="v-head">SLEEP TARGETS</div>
                <div class="t-row"><span class="w-lbl">OPTIMAL BEDTIME:</span> <span id="dlmo-target" class="val-sm">--</span></div>
                <div class="t-row"><span class="w-lbl">RECOVERY STATUS:</span> <span id="recovery-vec" class="val-sm">--</span></div>
            </div>
        `;
    }

    const quadBR = document.getElementById('quad-br');
    if (quadBR) {
        quadBR.innerHTML = `
            <div style="position: relative; width: 280px; height: 100%; display: flex; flex-direction: column; justify-content: center; gap: 2px; margin: 0 auto;">
                <div class="v-head">SCHEDULE ALIGNMENT</div>
                <div class="t-row"><span class="w-lbl">CALENDAR FRICTION:</span> <span id="tension-score" class="val-sm">--</span></div>
                <div class="t-row"><span class="w-lbl">DAY STATUS:</span> <span id="align-status" class="val-sm">--</span></div>
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
        } catch(e) {
            console.warn("Biometric sync bypassed.");
        }
    }
}

window.addEventListener('q-tick', (e) => {
    const { t, isLive, activeTime, daysElapsed, qData, legacyDateStr, legacyTimeStr } = e.detail;

    const dateObj = new Date(t);
    const hours = dateObj.getHours();
    const minutes = dateObj.getMinutes();
    
    // --- 5-PHASE THERMODYNAMIC MODEL (ULTRADIAN INFERENCE) ---
    let activeMs = ((t % 86400000) - (anchorMins * 60000) + 86400000) % 86400000;
    let minsSinceWake = Math.floor(activeMs / 60000);
    
    let sleepDuration = parseInt(localStorage.getItem('q_sleep_cycle_duration')) || 450;
    let wakingDurationMins = 1440 - sleepDuration;
    let inertiaMins = parseInt(localStorage.getItem('q_sleep_inertia_mins')) || 45;
    let dlmoMins = parseInt(localStorage.getItem('q_dlmo_offset_mins')) || 90;
    
    let currentBioState;
    let cyclePosFloat = 0;
    let remainingMins = 0;
    let isDeepFlow = false;

    if (minsSinceWake >= wakingDurationMins) {
        currentBioState = "SLEEP / RECOVERY";
        cyclePosFloat = (minsSinceWake - wakingDurationMins) / sleepDuration;
        remainingMins = 1440 - minsSinceWake;
    } else if (minsSinceWake < inertiaMins) {
        currentBioState = "SLEEP INERTIA";
        cyclePosFloat = minsSinceWake / inertiaMins;
        remainingMins = inertiaMins - minsSinceWake;
    } else if (minsSinceWake >= wakingDurationMins - dlmoMins) {
        currentBioState = "DLMO WIND-DOWN";
        let dlmoElapsed = minsSinceWake - (wakingDurationMins - dlmoMins);
        cyclePosFloat = dlmoElapsed / dlmoMins;
        remainingMins = wakingDurationMins - minsSinceWake;
    } else {
        let coreMins = minsSinceWake - inertiaMins;
        cyclePosFloat = (coreMins % cycleDuration) / cycleDuration;
        isDeepFlow = (cyclePosFloat < 0.77);
        currentBioState = isDeepFlow ? "DEEP FLOW" : "VENT / RECOVERY";
        remainingMins = cycleDuration - (coreMins % cycleDuration);
    }
    
    // --- CIRCADIAN DRIFT & TENSION CALCULATION ---
    let lagDays = qData ? qData.lagDays : 0;
    const tauOffset = lagDays ? (lagDays * 24).toFixed(2) : "0.00";
    
    let tensionScore = 0;
    if (!isDeepFlow && hours >= 9 && hours <= 17) tensionScore = 85; 
    else if (isDeepFlow) tensionScore = 15;
    else tensionScore = 40;

    // --- DOM UPDATES (CORNER PANELS) ---
    const elTau = document.getElementById('tau-offset');
    const elBioSensor = document.getElementById('bio-sensor');
    if (elTau) elTau.innerText = `${tauOffset > 0 ? '+' : ''}${tauOffset} HRS`;
    if (elBioSensor) elBioSensor.innerText = "[ PENDING PAIRING ]";

    const elBrac = document.getElementById('brac-state');
    const elHorizon = document.getElementById('phase-horizon');
    const bioBarEl = document.getElementById('bio-bar');
    if (elBrac) elBrac.innerText = isDeepFlow ? "PEAK FOCUS" : "REST REQUIRED";
    if (elHorizon) elHorizon.innerText = `${Math.floor(remainingMins)} MIN`;
    if (bioBarEl) bioBarEl.style.width = (cyclePosFloat * 100) + "%";

    const elDlmo = document.getElementById('dlmo-target');
    const elRec = document.getElementById('recovery-vec');
    if (elDlmo) elDlmo.innerText = "10:30 PM"; 
    if (elRec) elRec.innerText = "STABLE";

    const elTension = document.getElementById('tension-score');
    const elAlign = document.getElementById('align-status');
    if (elTension) {
        elTension.innerText = tensionScore > 70 ? "HIGH" : `${tensionScore}%`;
        elTension.style.color = tensionScore > 70 ? "var(--friction-red)" : "var(--theme-main)";
    }
    if (elAlign) {
        elAlign.innerText = tensionScore > 70 ? "CONFLICT DETECTED" : "ALIGNED";
        elAlign.style.color = tensionScore > 70 ? "var(--friction-red)" : "var(--theme-main)";
    }

    // --- PROPRIOCEPTIVE EYE ACTUATION ---
    const pupil = document.getElementById('ultradian-pupil');
    const iris = document.getElementById('thermal-iris');
    const sclera = document.getElementById('tension-sclera');

    if (pupil) {
        const scaleVal = isDeepFlow ? "scale(1.2)" : "scale(0.8)";
        pupil.style.transform = scaleVal;
    }

    if (iris && currentBioState !== lastBioState) {
        iris.className = "iris-band"; 
        if (currentBioState === "DEEP FLOW") iris.classList.add('flow-aura');
        else if (currentBioState === "VENT / RECOVERY") iris.classList.add('vent-aura');
        else if (currentBioState === "SLEEP / RECOVERY") iris.classList.add('sleep-aura');
        else if (currentBioState === "SLEEP INERTIA") iris.classList.add('inertia-aura');
        else if (currentBioState === "DLMO WIND-DOWN") iris.classList.add('dlmo-aura');
        lastBioState = currentBioState;
    }

    if (sclera) {
        if (tensionScore > 70) sclera.classList.add('tension-high');
        else sclera.classList.remove('tension-high');
    }
});