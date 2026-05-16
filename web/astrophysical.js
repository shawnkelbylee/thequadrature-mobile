// THE QUADRATURE: ASTROPHYSICAL VECTOR ENGINE
// Architect: Kelby | Engineer: Kairos
// STATUS: Phase XLVI. Barycentric Kinematics & Lunar Telemetry.

let isBooted = false;
let currentOptTarget = '';
let unitSystem = localStorage.getItem('Q_UNIT_SYS') || 'METRIC';

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
    if (quadTR) quadTR.innerHTML = `<div class="panel-data-wrapper"><div class="v-head">MACRO TELEMETRY</div><div class="t-row"><span class="w-lbl">ORBITAL VELOCITY:</span> <span class="val-sm val-highlight" id="val-vel">--</span></div><div class="t-row"><span class="w-lbl">SOLAR DISTANCE:</span> <span class="val-sm val-highlight" id="val-au">--</span></div><div class="t-row"><span class="w-lbl">ACCELERATION:</span> <span class="val-sm val-highlight" id="val-accel">--</span></div><div style="${dStyleTop}">[ HELIOCENTRIC VECTORS ]</div></div>`;

    const quadBL = document.getElementById('quad-bl') || document.getElementById('quad-ENV');
    if (quadBL) quadBL.innerHTML = `<div class="panel-data-wrapper"><div class="v-head">LUNAR GRAVITY</div><div style="${dStyleBot}">[ SATELLITE INTERFERENCE ]</div><div class="t-row"><span class="w-lbl">LUNAR PHASE:</span> <span class="val-sm val-highlight" id="val-lunar-phase">--</span></div><div class="t-row"><span class="w-lbl">ILLUMINATION:</span> <span class="val-sm val-highlight" id="val-lunar-ill">--</span></div><div class="t-row"><span class="w-lbl">ORBITAL DISTANCE:</span> <span class="val-sm val-highlight" id="val-lunar-dist">--</span></div></div>`;

    const quadBR = document.getElementById('quad-br') || document.getElementById('quad-MEC');
    if (quadBR) quadBR.innerHTML = `<div class="panel-data-wrapper"><div class="v-head">SYSTEM ALIGNMENT</div><div style="${dStyleBot}">[ BARYCENTRIC MATRICES ]</div><div class="t-row"><span class="w-lbl">BARYCENTER OFFSET:</span> <span class="val-sm val-highlight" id="val-bary">--</span></div><div class="t-row"><span class="w-lbl">Q-DELTA ANCHOR:</span> <span class="val-sm val-highlight" id="val-qdelta">--</span></div><div class="t-row"><span class="w-lbl">MERIDIAN TENSION:</span> <span class="val-sm val-highlight" id="val-tension">--</span></div></div>`;
};

window.openOptions = function(e, target) {
    if(e) e.stopPropagation();
    currentOptTarget = target;
    let title = "ASTROPHYSICAL CALIBRATION";
    let html = `<div style="font-family: 'JetBrains Mono'; font-size: 0.75rem; color: var(--st