// THE QUADRATURE: METEOROLOGICAL VECTOR ENGINE
// Architect: Kelby | Engineer: Kairos
// STATUS: Phase V. Ecliptic-Anchored Seasonal Terminator Globe.
// REVISION: Decoupled Terminator Spin & Q-Core Geolocation Hooking.

let liveWeather = null;
let sparkBars = [];
let showDelta = false;

let alertThreshold = 75;
let currentAssetMode = "FLORA";
let iotProtocol = "MANUAL";
let climateAnchor = "CLW";
let baroUnit = "hPa";
let actionHorizon = "ANCHOR";
let tempUnit = "C";
let thermoBaseline = 22.0;
let crossVectorSync = true;

let currentRiskVal = 0;
let currentOptTarget = '';
let isBooted = false;

window.injectVectorData = function() {
    const optTL = document.getElementById('opt-tl') || document.querySelectorAll('.opt-oval')[0];
    const optTR = document.getElementById('opt-tr') || document.querySelectorAll('.opt-oval')[1];
    const optBL = document.getElementById('opt-bl') || document.querySelectorAll('.opt-oval')[2];
    const optBR = document.getElementById('opt-br') || document.querySelectorAll('.opt-oval')[3];

    // Routed to Macro-Climate Vector Panels
    if (optTL) { optTL.onclick = (e) => { e.stopPropagation(); window.openOptions(e, 'insolation'); }; optTL.style.color = 'var(--env-green)'; }
    if (optTR) { optTR.onclick = (e) => { e.stopPropagation(); window.openOptions(e, 'hydrosphere'); }; optTR.style.color = 'var(--env-green)'; }
    if (optBL) { optBL.onclick = (e) => { e.stopPropagation(); window.openOptions(e, 'troposphere'); }; optBL.style.color = 'var(--env-green)'; }
    if (optBR) { optBR.onclick = (e) => { e.stopPropagation(); window.openOptions(e, 'stratosphere'); }; optBR.style.color = 'var(--env-green)'; }
};

function initSparklines() {
    // Reserved for unified data mapping
}

function fetchMeteoData() {
    // Reserved for live API injection
}

// --- THE ECLIPTIC DIURNAL ENGINE ---
function initEclipticEngine() {
    updateGlobeKinematics();
    setInterval(updateGlobeKinematics, 1000); // 1 Hz Kinetic Tick
}

function updateGlobeKinematics() {
    const now = window.Q_MASTER_CLOCK ? new Date(window.Q_MASTER_CLOCK) : new Date();

    // 1. SEASONAL Y-AXIS SHIFT (The Rise and Fall)
    const start = new Date(now.getFullYear(), 0, 0);
    const diff = now - start;
    const oneDay = 1000 * 60 * 60 * 24;
    const dayOfYear = Math.floor(diff / oneDay);

    // Vernal Equinox offset (~Day 80). Calculates radians for the sine wave.
    const rads = ((dayOfYear - 80) / 365.24) * (Math.PI * 2);
    
    // 23.5 degrees of tilt translated to UI pixels. Max Y offset +/- 35px.
    const maxTiltPX = 35; 
    const yShift = -(Math.sin(rads) * maxTiltPX);

    const globe = document.querySelector('.q-meteo-globe');
    if (globe) {
        globe.style.transform = `translate(-50%, calc(-50% + ${yShift}px))`;
    }

    // 2. GEOLOCATION LOCK (The Camera Anchor)
    // Pulls from q-core.js. Defaults to 0 (Prime Meridian) if unavailable.
    const userLon = window.Q_USER_LONGITUDE !== undefined ? window.Q_USER_LONGITUDE : 0; 
    
    const surface = document.getElementById('diurnal-surface');
    if(surface) {
        // Shift background position so the user's longitude is locked to Dead Center (50%)
        const lonOffsetPct = ((userLon + 180) / 360) * 100;
        surface.style.backgroundPosition = `${lonOffsetPct}% 0`;
    }

    // 3. DIURNAL ROTATION (The Terminator Sweep)
    const hoursUTC = now.getUTCHours();
    const minutesUTC = now.getUTCMinutes();
    const secondsUTC = now.getUTCSeconds();
    
    // 24-hour fractional progression (0.0 to 1.0) based on Universal Time
    const timeFractionUTC = (hoursUTC + (minutesUTC / 60) + (secondsUTC / 3600)) / 24;
    
    const terminator = document.getElementById('diurnal-terminator');
    if(terminator) {
        // Calculate terminator X-axis translation based on UTC time and locked longitude
        // Moves the 200% wide shadow block from left to right across the 100% wide sphere
        const solarOffset = (timeFractionUTC * 360 + userLon) % 360;
        const transX = -(solarOffset / 360) * 100;
        terminator.style.transform = `translateX(${transX}%)`;
    }
}

// --- HUD HOVERS ---
window.showAxisHUD = function(text) {
    const hud = document.getElementById('axis-hud');
    if(hud) {
        hud.innerText = text;
        hud.style.opacity = '1';
    }
};

window.hideAxisHUD = function() {
    const hud = document.getElementById('axis-hud');
    if(hud) hud.style.opacity = '0';
};

// DECOUPLED BOOT SEQUENCE - Bound strictly to q-ui.js emission
window.addEventListener('q-ui-mounted', () => {
    if(isBooted) return;
    const tlNode = document.getElementById('quad-tl') || document.getElementById('quad-BIO');
    if(!tlNode) return; 

    isBooted = true;
    window.injectVectorData();
    initSparklines();
    initEclipticEngine();
    fetchMeteoData();
});

// Fallback execution block
if (document.readyState === 'complete' || document.readyState === 'interactive') {
    setTimeout(() => {
        if(!isBooted && document.getElementById('quad-tl')) {
            isBooted = true;
            window.injectVectorData();
            initSparklines();
            initEclipticEngine();
            fetchMeteoData();
        }
    }, 500);
}