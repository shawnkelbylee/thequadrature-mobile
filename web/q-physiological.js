// THE QUADRATURE: PHYSIOLOGICAL VECTOR ENGINE
// Architect: Kelby | Engineer: Kairos
// STATUS: Phase IV UI Engine. Decoupled Logic & Math Engine.
// REVISION: Restoration of Exact DOM Coordinates & OS-Grey Typographic Fix

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
                <div class="v-head">CIRCADIAN DRIFT</div>
                <div class="t-row"><span style="color: #888888;">τ-OFFSET INFERENCE:</span> <span id="tau-offset" class="val-sm">--</span></div>
                <div class="t-row"><span style="color: #888888;">METROLOGICAL DEBT:</span> <span id="metro-debt" class="val-sm">--</span></div>
            </div>
        `;
    }

    const quadTR = document.getElementById('quad-tr');
    if (quadTR) {
        quadTR.innerHTML = `
            <div style="position: relative; width: 280px; height: 100%; display: flex; flex-direction: column; justify-content: center; gap: 2px; margin: 0 auto;">
                <div class="v-head">ULTRADIAN FLOW</div>
                <div class="t-row"><span style="color: #888888;">BRAC STATE:</span> <span id="brac-state" class="val-sm">--</span></div>
                <div class="t-row"><span style="color: #888888;">PHASE HORIZON:</span> <span id="phase-horizon" class="val-sm">--</span></div>
            </div>
        `;
    }

    const quadBL = document.getElementById('quad-bl');
    if (quadBL) {
        quadBL.innerHTML = `
            <div style="position: relative; width: 280px; height: 100%; display: flex; flex-direction: column; justify-content: center; gap: 2px; margin: 0 auto;">