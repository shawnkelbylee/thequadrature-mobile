// THE QUADRATURE: UNIFIED UI MATRIX & RENDERER
// Architect: Kelby | Engineer: Kairos
// STATUS: Phase XIII UI Engine. Dual-Row Scrubber Matrix & Free-Cam Dispatch.

window.injectUniversalUI = function() {
    if (window.self !== window.top) return;
    if (document.getElementById('q-ui-injected-flag')) return;

    if (document.body.classList.contains('boot-active')) {
        document.body.classList.remove('boot-active');
    }

    let meta = document.querySelector('meta[name="viewport"]');
    if (!meta) {
        meta = document.createElement('meta');
        meta.name = "viewport";
        document.head.appendChild(meta);
    }
    meta.content = "width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no, viewport-fit=cover";
    
    // Inject Styles for Dual-Row Scrubber Matrix
    const style = document.createElement('style');
    style.innerHTML = `
        .q-scrubber-panel {
            position: absolute;
            bottom: 20px;
            left: 50%;
            transform: translateX(-50%);
            width: 80%;
            max-width: 600px;
            background: rgba(2, 6, 15, 0.85);
            border: 1px solid var(--env-green);
            border-radius: 6px;
            padding: 10px;
            z-index: 1000;
            display: flex;
            flex-direction: column;
            gap: 12px;
            box-shadow: 0 0 20px rgba(14, 165, 233, 0.15);
        }
        .scrub-row-1 {
            display: flex;
            justify-content: space-between;
            align-items: center;
            width: 100%;
        }
        .macro-micro-group {
            display: flex;
            gap: 4px;
        }
        .btn-micro {
            background: rgba(0,0,0,0.6);
            border: 1px solid var(--env-green-dim);
            color: var(--env-green);
            font-family: 'JetBrains Mono', monospace;
            font-size: 0.75rem;
            padding: 6px 12px;
            cursor: pointer;
            border-radius: 3px;
            transition: all 0.2s;
        }
        .btn-micro:hover:not(:disabled) {
            background: rgba(14, 165, 233, 0.2);
            border-color: var(--env-green);
        }
        .btn-micro:disabled {
            opacity: 0.3;
            cursor: not-allowed;
            border-color: #333;
            color: #555;
        }
        .btn-micro.active {
            background: var(--env-green);
            color: #000;
            font-weight: bold;
        }
        .scrub-row-2 {
            width: 100%;
        }
        input[type="range"]#q-global-scrubber {
            -webkit-appearance: none;
            width: 100%;
            background: transparent;
        }
        input[type="range"]#q-global-scrubber::-webkit-slider-runnable-track {
            width: 100%;
            height: 4px;
            background: rgba(14, 165, 233, 0.3);
            border-radius: 2px;
        }
        input[type="range"]#q-global-scrubber::-webkit-slider-thumb {
            -webkit-appearance: none;
            height: 16px;
            width: 16px;
            border-radius: 50%;
            background: var(--env-green);
            cursor: pointer;
            margin-top: -6px;
            box-shadow: 0 0 10px var(--env-green);
        }
    `;
    document.head.appendChild(style);

    // Ensure Master Container Exists
    let masterContainer = document.getElementById('q-master-container');
    if (!masterContainer) {
        masterContainer = document.createElement('div');
        masterContainer.id = 'q-master-container';
        document.body.appendChild(masterContainer);
    }

    // Inject Dual-Row Scrubber Matrix
    if (!document.getElementById('q-scrubber-panel')) {
        const scrubberHTML = `
            <div id="q-scrubber-panel" class="q-scrubber-panel">
                <div class="scrub-row-1">
                    <button id="q-cam-toggle" class="btn-micro">[ CAM: ECLIPTIC ]</button>
                    <div class="macro-micro-group">
                        <button id="q-macro-rev" class="btn-micro">&lt;&lt;</button>
                        <button id="q-micro-rev" class="btn-micro">&lt;</button>
                        <button id="q-macro-stop" class="btn-micro" disabled>||</button>
                        <button id="q-micro-fwd" class="btn-micro">&gt;</button>
                        <button id="q-macro-fwd" class="btn-micro">&gt;&gt;</button>
                    </div>
                    <button id="q-live-toggle" class="btn-micro active">LIVE</button>
                </div>
                <div class="scrub-row-2">
                    <input type="range" id="q-global-scrubber" min="-365" max="365" step="0.041666" value="0">
                </div>
            </div>
            <div id="q-ui-injected-flag" style="display:none;"></div>
        `;
        masterContainer.insertAdjacentHTML('beforeend', scrubberHTML);
    }

    window.attachScrubberEvents();
    window.dispatchEvent(new CustomEvent('q-ui-mounted'));
};

// --- TEMPORAL STATE MANAGEMENT ---
window.getSimState = function() {
    try {
        let stored = localStorage.getItem('Q_MASTER_CLOCK');
        if (stored) return JSON.parse(stored);
    } catch(e) {}
    return { isLive: true, simTime: Date.now() };
};

window.setSimState = function(state) {
    let payload = JSON.stringify(state);
    localStorage.setItem('Q_MASTER_CLOCK', payload);
    window.dispatchEvent(new StorageEvent('storage', { key: 'Q_MASTER_CLOCK', newValue: payload }));
};

window.setLiveClock = function() {
    window.stopMacroLoop();
    let payload = JSON.stringify({ isLive: true, simTime: Date.now() });
    localStorage.setItem('Q_MASTER_CLOCK', payload);
    window.dispatchEvent(new StorageEvent('storage', { key: 'Q_MASTER_CLOCK', newValue: payload }));
    
    // Explicitly reset camera toggle to Ecliptic
    const camBtn = document.getElementById('q-cam-toggle');
    if (camBtn) {
        camBtn.innerText = '[ CAM: ECLIPTIC ]';
        camBtn.classList.remove('active');
    }
    
    window.syncScrubberUI();
};

window.syncScrubberUI = function() {
    if(!window.getSimState) return;
    const state = window.getSimState();
    const liveBtn = document.getElementById('q-live-toggle');
    const scrubber = document.getElementById('q-global-scrubber');
    
    if(liveBtn) {
        liveBtn.classList.toggle('active', state.isLive);
        liveBtn.innerText = state.isLive ? "LIVE" : "RESYNC";
    }
    
    if(scrubber && state.isLive === false && window.ANCHOR_ALPHA_DYNAMIC) {
        let daysElapsed = (state.simTime - window.ANCHOR_ALPHA_DYNAMIC) / window.MS_DAY;
        let sMax = parseFloat(scrubber.max);
        let sMin = parseFloat(scrubber.min);
        
        if (daysElapsed >= sMax - 90) scrubber.max = Math.floor(daysElapsed) + 365;
        if (daysElapsed <= sMin + 90) scrubber.min = Math.floor(daysElapsed) - 365;
        
        scrubber.value = daysElapsed;
    } else if (scrubber && state.isLive && window.ANCHOR_ALPHA_DYNAMIC) {
        let daysElapsed = (Date.now() - window.ANCHOR_ALPHA_DYNAMIC) / window.MS_DAY;
        scrubber.value = daysElapsed;
    }
};

// --- KINETIC EVENT LISTENERS & MACRO LOOP ---
let macroInterval = null;

window.stopMacroLoop = function() {
    if (macroInterval) {
        clearInterval(macroInterval);
        macroInterval = null;
    }
    const btnStop = document.getElementById('q-macro-stop');
    const btnRev = document.getElementById('q-macro-rev');
    const btnFwd = document.getElementById('q-macro-fwd');
    
    if (btnStop) btnStop.disabled = true;
    if (btnRev) btnRev.classList.remove('active');
    if (btnFwd) btnFwd.classList.remove('active');
};

window.executeMicroStep = function(daysDelta) {
    window.stopMacroLoop();
    let state = window.getSimState();
    if (state.isLive) {
        state.isLive = false;
        state.simTime = Date.now();
    }
    state.simTime += daysDelta * window.MS_DAY;
    window.setSimState(state);
    window.syncScrubberUI();
};

window.executeMacroLoop = function(direction) {
    window.stopMacroLoop();
    
    let state = window.getSimState();
    if (state.isLive) {
        state.isLive = false;
        state.simTime = Date.now();
    }

    const btnStop = document.getElementById('q-macro-stop');
    const activeBtn = document.getElementById(direction < 0 ? 'q-macro-rev' : 'q-macro-fwd');
    
    if (btnStop) btnStop.disabled = false;
    if (activeBtn) activeBtn.classList.add('active');

    // 15 FPS Loop (66ms interval) stepping exactly 1 standard day (86,400,000 ms) per frame
    macroInterval = setInterval(() => {
        state.simTime += direction * window.MS_DAY;
        window.setSimState(state);
        window.syncScrubberUI();
    }, 66); 
};

window.attachScrubberEvents = function() {
    const liveToggle = document.getElementById('q-live-toggle');
    const scrubber = document.getElementById('q-global-scrubber');
    const camToggle = document.getElementById('q-cam-toggle');
    
    const microRev = document.getElementById('q-micro-rev');
    const microFwd = document.getElementById('q-micro-fwd');
    const macroRev = document.getElementById('q-macro-rev');
    const macroFwd = document.getElementById('q-macro-fwd');
    const macroStop = document.getElementById('q-macro-stop');

    // Live / Resync Hook
    if (liveToggle) {
        liveToggle.addEventListener('click', () => {
            window.setLiveClock();
        });
    }

    // Camera Mode Authority Dispatch
    if (camToggle) {
        camToggle.addEventListener('click', () => {
            const isCurrentlyFree = camToggle.classList.contains('active');
            if (isCurrentlyFree) {
                camToggle.classList.remove('active');
                camToggle.innerText = '[ CAM: ECLIPTIC ]';
                window.dispatchEvent(new CustomEvent('q-camera-toggle', { detail: { isFree: false } }));
            } else {
                camToggle.classList.add('active');
                camToggle.innerText = '[ CAM: FREE ]';
                window.dispatchEvent(new CustomEvent('q-camera-toggle', { detail: { isFree: true } }));
            }
        });
    }

    // High-Resolution Slider Hook (0.041666 Step / 1 Hour)
    if (scrubber) {
        scrubber.addEventListener('input', (e) => {
            window.stopMacroLoop(); // Slider acts as universal kill-switch
            let val = parseFloat(e.target.value);
            let msOffset = window.ANCHOR_ALPHA_DYNAMIC + (val * window.MS_DAY);
            window.setSimState({ isLive: false, simTime: msOffset });
            window.syncScrubberUI();
        });
    }

    // Micro / Macro Kinetic Hooks
    if (microRev) microRev.addEventListener('click', () => window.executeMicroStep(-1));
    if (microFwd) microFwd.addEventListener('click', () => window.executeMicroStep(1));
    if (macroRev) macroRev.addEventListener('click', () => window.executeMacroLoop(-1));
    if (macroFwd) macroFwd.addEventListener('click', () => window.executeMacroLoop(1));
    if (macroStop) macroStop.addEventListener('click', window.stopMacroLoop);
};

window.addEventListener('DOMContentLoaded', () => {
    window.injectUniversalUI();
    if (window.generateStars) window.generateStars('stars');
});

// Watch for external system state changes
window.addEventListener('storage', (e) => {
    if (e.key === 'Q_MASTER_CLOCK') {
        window.syncScrubberUI();
    }
});