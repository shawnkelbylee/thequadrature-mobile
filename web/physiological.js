// THE QUADRATURE: PHYSIOLOGICAL VECTOR ENGINE
// Architect: Kelby | Engineer: Kairos
// STATUS: Phase IV UI Engine. Localized Calibration Modals & Persistence Logic.
// REVISION: Absolute Anatomy Headers & Static Flex Descriptors (Coordinate Fix)

let cycleDuration = parseInt(localStorage.getItem('q_bio_duration')) || 90; 
let savedAnchor = localStorage.getItem('q_bio_anchor');
let isAutoAnchor = (savedAnchor === null || savedAnchor === "");
let anchorMins = isAutoAnchor ? 360 : parseInt(savedAnchor); // Default 06:00
let lastRenderedScrub = null;
let lastBioState = "";
let isBooted = false;

// --- DYNAMIC MODAL INJECTION ---
function injectPhysioModal() {
    if (document.getElementById('q-physio-modal')) return;
    const modalHTML = `
        <style>
            #q-physio-modal { position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.85); backdrop-filter: blur(12px); z-index: 10010; display: none; justify-content: center; align-items: center; pointer-events: auto; font-family: 'JetBrains Mono', monospace; }
            #q-physio-modal.active { display: flex; }
            .physio-box { width: 90vw; max-width: 400px; background: #05080f; border: 1px solid var(--theme-dim, rgba(184,41,255,0.3)); border-radius: 4px; padding: 25px; box-shadow: 0 0 40px rgba(0,0,0,1); }
            .physio-header { font-family: 'Orbitron', sans-serif; font-size: 1rem; color: var(--theme-main, #b829ff); margin-bottom: 25px; text-align: center; font-weight: 700; letter-spacing: 2px; text-shadow: 0 0 10px var(--theme-dim); }
            .physio-row { display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px; }
            .physio-label { color: #888; font-size: 0.75rem; text-transform: uppercase; font-weight: 700; }
            .physio-input { background: #111; border: 1px solid #333; color: #fff; padding: 6px 12px; font-family: 'JetBrains Mono'; font-size: 0.8rem; border-radius: 4px; width: 140px; text-align: right; outline: none; transition: border-color 0.2s; }
            .physio-input:focus { border-color: var(--theme-main); }
            .physio-btn-row { display: flex; justify-content: space-between; margin-top: 30px; }
            .physio-btn { background: transparent; border: 1px solid var(--theme-dim); color: var(--theme-main); padding: 10px 20px; cursor: pointer; font-family: 'Orbitron'; font-weight: 700; font-size: 0.75rem; transition: all 0.2s; border-radius: 4px; letter-spacing: 1px; }
            .physio-btn:hover { background: var(--theme-dim); box-shadow: 0 0 15px var(--theme-dim); }
            .physio-btn-close { color: #888; border-color: #333; text-shadow: none; }
            .physio-btn-close:hover { background: #222; box-shadow: none; color: #fff; border-color: #555; }
        </style>
        <div id="q-physio-modal">
            <div class="physio-box">
                <div class="physio-header" id="physio-modal-title">CALIBRATION</div>
                <div id="physio-modal-content"></div>
                <div class="physio-btn-row">
                    <button class="physio-btn physio-btn-close" onclick="closePhysioModal()">CANCEL</button>
                    <button class="physio-btn" onclick="savePhysioModal()">COMMIT</button>
                </div>
            </div>
        </div>
    `;
    document.body.insertAdjacentHTML('beforeend', modalHTML);
}

let currentModalTarget = '';

window.openPhysioModal = function(target) {
    currentModalTarget = target;
    const content = document.getElementById('physio-modal-content');
    const title = document.getElementById('physio-modal-title');
    let html = '';

    if (target === 'tl') {
        title.innerText = 'INTERNAL CLOCK SETTINGS';
        const currentAnchor = localStorage.getItem('q_bio_anchor_time') || '06:00';
        html = `
            <div class="physio-row"><span class="physio-label">WAKE ANCHOR:</span><input type="time" id="m-wake" class="physio-input" value="${currentAnchor}"></div>
            <div class="physio-row"><span class="physio-label">HARDWARE PAIRING:</span>
                <select id="m-hw" class="physio-input">
                    <option value="NONE">NONE</option>
                    <option value="OURA">OURA RING</option>
                    <option value="APPLE">APPLE HEALTH</option>
                    <option value="CGM">CGM API</option>
                </select>
            </div>
        `;
    } else if (target === 'tr') {
        title.innerText = 'ENERGY CYCLE SETTINGS';
        const currentDur = localStorage.getItem('q_bio_duration') || '90';
        const currentLoad = localStorage.getItem('q_bio_load') || 'NOMINAL';
        html = `
            <div class="physio-row"><span class="physio-label">ULTRADIAN BASELINE (MIN):</span><input type="number" id="m-brac" class="physio-input" value="${currentDur}"></div>
            <div class="physio-row"><span class="physio-label">METABOLIC LOAD:</span>
                <select id="m-load" class="physio-input">
                    <option value="NOMINAL" ${currentLoad==='NOMINAL'?'selected':''}>NOMINAL</option>
                    <option value="STRAIN" ${currentLoad==='STRAIN'?'selected':''}>STRAIN</option>
                    <option value="RECOVERY" ${currentLoad==='RECOVERY'?'selected':''}>RECOVERY</option>
                </select>
            </div>
        `;
    } else if (target === 'bl') {
        title.innerText = 'SLEEP TARGET SETTINGS';
        const currentSleep = localStorage.getItem('q_sleep_cycle_duration') || '450';
        const currentDlmo = localStorage.getItem('q_dlmo_offset_mins') || '90';
        html = `
            <div class="physio-row"><span class="physio-label">TARGET DURATION (MIN):</span><input type="number" id="m-sleep" class="physio-input" value="${currentSleep}"></div>
            <div class="physio-row"><span class="physio-label">DLMO OFFSET (MIN):</span><input type="number" id="m-dlmo" class="physio-input" value="${currentDlmo}"></div>
        `;
    } else if (target === 'br') {
        title.innerText = 'SCHEDULE ALIGNMENT';
        const start = localStorage.getItem('q_civil_start') || '09:00';
        const end = localStorage.getItem('q_civil_end') || '17:00';
        html = `
            <div class="physio-row"><span class="physio-label">WORKDAY START:</span><input type="time" id="m-civ-start" class="physio-input" value="${start}"></div>
            <div class="physio-row"><span class="physio-label">WORKDAY END:</span><input type="time" id="m-civ-end" class="physio-input" value="${end}"></div>
        `;
    }
    content.innerHTML = html;
    document.getElementById('q-physio-modal').classList.add('active');
};

window.closePhysioModal = function() {
    document.getElementById('q-physio-modal').classList.remove('active');
};

window.savePhysioModal = function() {
    if (currentModalTarget === 'tl') {
        let timeVal = document.getElementById('m-wake').value;
        localStorage.setItem('q_bio_anchor_time', timeVal);
        let timeParts = timeVal.split(':');
        let mins = (parseInt(timeParts[0]) * 60) + parseInt(timeParts[1]);
        localStorage.setItem('q_bio_anchor', mins);
    } else if (currentModalTarget === 'tr') {
        localStorage.setItem('q_bio_duration', document.getElementById('m-brac').value);
        localStorage.setItem('q_bio_load', document.getElementById('m-load').value);
    } else if (currentModalTarget === 'bl') {
        localStorage.setItem('q_sleep_cycle_duration', document.getElementById('m-sleep').value);
        localStorage.setItem('q_dlmo_offset_mins', document.getElementById('m-dlmo').value);
    } else if (currentModalTarget === 'br') {
        localStorage.setItem('q_civil_start', document.getElementById('m-civ-start').value);
        localStorage.setItem('q_civil_end', document.getElementById('m-civ-end').value);
    }
    
    // Refresh runtime variables
    cycleDuration = parseInt(localStorage.getItem('q_bio_duration')) || 90; 
    let savedA = localStorage.getItem('q_bio_anchor');
    anchorMins = (savedA === null || savedA === "") ? 360 : parseInt(savedA); 
    
    closePhysioModal();
};

window.injectVectorData = function() {
    // Exact match for the Quad architecture global UI overlay targeting
    const optTL = document.getElementById('opt-tl') || document.querySelectorAll('.opt-oval')[0];
    const optTR = document.getElementById('opt-tr') || document.querySelectorAll('.opt-oval')[1];
    const optBL = document.getElementById('opt-bl') || document.querySelectorAll('.opt-oval')[2];
    const optBR = document.getElementById('opt-br') || document.querySelectorAll('.opt-oval')[3];

    if (optTL) { optTL.onclick = (e) => { e.stopPropagation(); window.openPhysioModal('tl'); }; optTL.style.pointerEvents = 'auto'; optTL.style.cursor = 'pointer'; }
    if (optTR) { optTR.onclick = (e) => { e.stopPropagation(); window.openPhysioModal('tr'); }; optTR.style.pointerEvents = 'auto'; optTR.style.cursor = 'pointer'; }
    if (optBL) { optBL.onclick = (e) => { e.stopPropagation(); window.openPhysioModal('bl'); }; optBL.style.pointerEvents = 'auto'; optBL.style.cursor = 'pointer'; }
    if (optBR) { optBR.onclick = (e) => { e.stopPropagation(); window.openPhysioModal('br'); }; optBR.style.pointerEvents = 'auto'; optBR.style.cursor = 'pointer'; }
};

window.addEventListener('q-ui-mounted', () => {
    if(isBooted) return;
    isBooted = true;

    injectPhysioModal();

    const quadTL = document.getElementById('quad-tl');
    if (quadTL) {
        quadTL.innerHTML = `
            <div style="position: relative; width: 280px; height: 100%; display: flex; flex-direction: column; justify-content: center; gap: 4px; margin: 0 auto;">
                <div class="v-head">[ IRIS ]</div>
                <div class="t-row"><span class="w-lbl">SCHEDULE DRIFT:</span> <span id="tau-offset" class="val-sm">--</span></div>
                <div class="t-row"><span class="w-lbl">BIOMETRIC SENSOR:</span> <span id="bio-sensor" class="val-sm" style="color: var(--os-grey);">[ PENDING PAIRING ]</span></div>
                <div style="font-family:'Orbitron'; font-size:0.55rem; color:#888; text-align:right; font-weight:700; letter-spacing:1px; border-top:1px solid rgba(255,255,255,0.1); margin-top:4px; padding-top:4px;">INTERNAL CLOCK</div>
            </div>
        `;
    }

    const quadTR = document.getElementById('quad-tr');
    if (quadTR) {
        quadTR.innerHTML = `
            <div style="position: relative; width: 280px; height: 100%; display: flex; flex-direction: column; justify-content: center; gap: 4px; margin: 0 auto;">
                <div class="v-head">[ PUPIL ]</div>
                <div class="t-row"><span class="w-lbl">CURRENT STATE:</span> <span id="brac-state" class="val-sm">--</span></div>
                <div class="t-row"><span class="w-lbl">CYCLE REMAINING:</span> <span id="phase-horizon" class="val-sm">--</span></div>
                <div class="bar-bg"><div class="bar-fill" id="bio-bar"></div></div>
                <div style="font-family:'Orbitron'; font-size:0.55rem; color:#888; text-align:left; font-weight:700; letter-spacing:1px; border-top:1px solid rgba(255,255,255,0.1); margin-top:4px; padding-top:4px;">ENERGY CYCLE</div>
            </div>
        `;
    }

    const quadBL = document.getElementById('quad-bl');
    if (quadBL) {
        quadBL.innerHTML = `
            <div style="position: relative; width: 280px; height: 100%; display: flex; flex-direction: column; justify-content: center; gap: 4px; margin: 0 auto;">
                <div class="v-head">[ EYELID ]</div>
                <div style="font-family:'Orbitron'; font-size:0.55rem; color:#888; text-align:right; font-weight:700; letter-spacing:1px; border-bottom:1px solid rgba(255,255,255,0.1); margin-bottom:4px; padding-bottom:4px;">SLEEP TARGETS</div>
                <div class="t-row"><span class="w-lbl">OPTIMAL BEDTIME:</span> <span id="dlmo-target" class="val-sm">--</span></div>
                <div class="t-row"><span class="w-lbl">RECOVERY STATUS:</span> <span id="recovery-vec" class="val-sm">--</span></div>
            </div>
        `;
    }

    const quadBR = document.getElementById('quad-br');
    if (quadBR) {
        quadBR.innerHTML = `
            <div style="position: relative; width: 280px; height: 100%; display: flex; flex-direction: column; justify-content: center; gap: 4px; margin: 0 auto;">
                <div class="v-head">[ SCLERA ]</div>
                <div style="font-family:'Orbitron'; font-size:0.55rem; color:#888; text-align:left; font-weight:700; letter-spacing:1px; border-bottom:1px solid rgba(255,255,255,0.1); margin-bottom:4px; padding-bottom:4px;">SCHEDULE ALIGNMENT</div>
                <div class="t-row"><span class="w-lbl">CALENDAR FRICTION:</span> <span id="tension-score" class="val-sm">--</span></div>
                <div class="t-row"><span class="w-lbl">DAY STATUS:</span> <span id="align-status" class="val-sm">--</span></div>
            </div>
        `;
    }

    window.injectVectorData();
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
    const { t, qData } = e.detail;
    const dateObj = new Date(t);
    const hours = dateObj.getHours();
    const minutes = dateObj.getMinutes();
    
    // --- 5-PHASE THERMODYNAMIC MODEL ---
    let activeMs = ((t % 86400000) - (anchorMins * 60000) + 86400000) % 86400000;
    let minsSinceWake = Math.floor(activeMs / 60000);
    
    let sleepDuration = parseInt(localStorage.getItem('q_sleep_cycle_duration')) || 450;
    let wakingDurationMins = 1440 - sleepDuration;
    let inertiaMins = parseInt(localStorage.getItem('q_sleep_inertia_mins')) || 45;
    let dlmoMins = parseInt(localStorage.getItem('q_dlmo_offset_mins')) || 90;
    let metabolicLoad = localStorage.getItem('q_bio_load') || 'NOMINAL';
    
    let currentBioState;
    let cyclePosFloat = 0;
    let remainingMins = 0;
    let isDeepFlow = false;
    
    // Metabolic Load Modifier shrinks or expands the focus window
    let flowThreshold = 0.6; // Nominal
    if (metabolicLoad === 'STRAIN') flowThreshold = 0.45;
    if (metabolicLoad === 'RECOVERY') flowThreshold = 0.3;

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
        isDeepFlow = (cyclePosFloat < flowThreshold);
        currentBioState = isDeepFlow ? "DEEP FLOW" : "VENT / RECOVERY";
        remainingMins = cycleDuration - (coreMins % cycleDuration);
    }
    
    // --- CIRCADIAN DRIFT & TENSION CALCULATION ---
    let lagDays = qData ? qData.lagDays : 0;
    const tauOffset = lagDays ? (lagDays * 24).toFixed(2) : "0.00";
    
    // Civil Cage Integration
    let civStartStr = localStorage.getItem('q_civil_start') || '09:00';
    let civEndStr = localStorage.getItem('q_civil_end') || '17:00';
    let civStartVal = parseInt(civStartStr.split(':')[0]) + (parseInt(civStartStr.split(':')[1])/60);
    let civEndVal = parseInt(civEndStr.split(':')[0]) + (parseInt(civEndStr.split(':')[1])/60);
    let currentHourFloat = hours + (minutes/60);
    let isInCage = (currentHourFloat >= civStartVal && currentHourFloat < civEndVal);
    
    let tensionScore = 0;
    if (!isDeepFlow && isInCage) tensionScore = 85; // High friction: civil demand vs biological vent
    else if (isDeepFlow && !isInCage) tensionScore = 15; // Unbound focus
    else tensionScore = 40; // Synchronized

    // --- TARGET BEDTIME CALCULATION ---
    let targetBedtimeMins = (anchorMins + 1440 - sleepDuration) % 1440;
    let dlmoH = Math.floor(targetBedtimeMins / 60);
    let dlmoM = targetBedtimeMins % 60;
    let ampm = dlmoH >= 12 ? 'PM' : 'AM';
    let dlmoH12 = dlmoH % 12 || 12;
    let bedTimeStr = `${dlmoH12}:${dlmoM.toString().padStart(2, '0')} ${ampm}`;

    // --- DOM UPDATES (CORNER PANELS) ---
    const elTau = document.getElementById('tau-offset');
    const elBioSensor = document.getElementById('bio-sensor');
    if (elTau) elTau.innerText = `${tauOffset > 0 ? '+' : ''}${tauOffset} HRS`;
    
    const elBrac = document.getElementById('brac-state');
    const elHorizon = document.getElementById('phase-horizon');
    const bioBarEl = document.getElementById('bio-bar');
    if (elBrac) elBrac.innerText = isDeepFlow ? "PEAK FOCUS" : "REST REQUIRED";
    if (elHorizon) elHorizon.innerText = `${Math.floor(remainingMins)} MIN`;
    if (bioBarEl) bioBarEl.style.width = (cyclePosFloat * 100) + "%";

    const elDlmo = document.getElementById('dlmo-target');
    const elRec = document.getElementById('recovery-vec');
    if (elDlmo) elDlmo.innerText = bedTimeStr; 
    if (elRec) elRec.innerText = metabolicLoad === 'STRAIN' ? "COMPROMISED" : "STABLE";

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
    const eyelid = document.getElementById('readiness-eyelid');

    if (pupil) {
        const scaleVal = isDeepFlow ? "scale(1.2)" : "scale(0.8)";
        pupil.style.transform = scaleVal;
    }

    if (iris && currentBioState !== lastBioState) {
        iris.className = "ring iris-band"; 
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

    if (eyelid) {
        if (currentBioState === "SLEEP / RECOVERY") eyelid.className = "ring eyelid-closed";
        else if (currentBioState === "DLMO WIND-DOWN") eyelid.className = "ring eyelid-half";
        else eyelid.className = "ring eyelid-open";
    }
});