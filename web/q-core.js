// THE QUADRATURE: MASTER CORE LOGIC (ZERO-REDUNDANCY ENGINE)
// Architect: Kelby | Engineer: Kairos
// STATUS: Phase II Active. Supabase Cloud Bridge & Magic Link Auth Engaged.

window.MS_DAY = 86400000;

// --- ASYMMETRICAL GEAR CONSTANTS ---
window.Q_GEAR_CONSTANTS = {
    ALPHA: 86400000,    // 24.0h
    BETA: 84600000,     // 23.5h
    GAMMA: 89662680,    // 24.9063h
    DELTA: 102599640,   // 28.4999h
    EPSILON: 89662680   // 24.9063h
};

// --- GLOBAL UNIVERSAL EVENT REGISTRY ---
window.Q_REGISTRY = {
    REL_DB: {
        jud: [ { name: "Purim", coord: 74.5, type: 'node-jud', glyph: '✡' }, { name: "Passover (Pesach)", coord: 110.0, type: 'node-jud', glyph: '✡' }, { name: "Shavuot", coord: 165.2, type: 'node-jud', glyph: '✡' }, { name: "Rosh Hashanah", coord: 275.5, type: 'node-jud', glyph: '✡' }, { name: "Yom Kippur", coord: 285.0, type: 'node-jud', glyph: '✡' }, { name: "Hanukkah", coord: 350.5, type: 'node-jud', glyph: '✡' } ],
        chr: [ { name: "Ash Wednesday", coord: 65.0, type: 'node-chr', glyph: '✝' }, { name: "Easter", coord: 105.0, type: 'node-chr', glyph: '✝' }, { name: "Pentecost", coord: 154.0, type: 'node-chr', glyph: '✝' }, { name: "Christmas", coord: 3.9, type: 'node-chr', glyph: '✝' } ],
        hin: [ { name: "Holi", coord: 75.0, type: 'node-hin', glyph: 'ॐ' }, { name: "Diwali", coord: 230.0, type: 'node-hin', glyph: 'ॐ' } ],
        bud: [ { name: "Vesak", coord: 135.0, type: 'node-bud', glyph: '☸' }, { name: "Bodhi Day", coord: 260.0, type: 'node-bud', glyph: '☸' } ],
        tao: [ { name: "Qingming", coord: 105.0, type: 'node-tao', glyph: '☯' }, { name: "Ghost Festival", coord: 225.0, type: 'node-tao', glyph: '☯' } ]
    },
    SOLAR_TERMS: [
        { name: "Winter Solstice", start: 0, theme: "Rest and deepest reflection." }, { name: "Minor Cold", start: 15, theme: "Preparation for harsh conditions." }, { name: "Major Cold", start: 30, theme: "Endurance and inner warmth." }, 
        { name: "Spring Begins", start: 45, theme: "First stirring of new intent." }, { name: "Rain Water", start: 60, theme: "Nourishing early concepts." }, { name: "Insects Awaken", start: 75, theme: "Sudden activity and emergence." },
        { name: "Vernal Equinox", start: 90, theme: "Perfect balance. The Initiator." }, { name: "Clear & Bright", start: 105, theme: "Clarity of vision and purification." }, { name: "Grain Rain", start: 120, theme: "Rapid growth requiring sustenance." }, 
        { name: "Summer Begins", start: 135, theme: "Commitment to outward expansion." }, { name: "Grain Buds", start: 150, theme: "Early signs of maturation." }, { name: "Grain in Ear", start: 165, theme: "Intense labor before the peak." },
        { name: "Summer Solstice", start: 180, theme: "The Apex. Maximum illumination." }, { name: "Minor Heat", start: 195, theme: "Sustaining momentum under pressure." }, { name: "Major Heat", start: 210, theme: "The crucible of final development." }, 
        { name: "Autumn Begins", start: 225, theme: "Shifting focus to harvest." }, { name: "End of Heat", start: 240, theme: "Cooling down, solidifying gains." }, { name: "White Dew", start: 255, theme: "Gathering resources, transition." },
        { name: "Autumnal Equinox", start: 270, theme: "Balance before the descent." }, { name: "Cold Dew", start: 285, theme: "Letting go of the non-essential." }, { name: "Frost Descends", start: 300, theme: "Finalizing storage and protection." }, 
        { name: "Winter Begins", start: 315, theme: "Retreating inward." }, { name: "Minor Snow", start: 330, theme: "Quieting the mind." }, { name: "Major Snow", start: 345, theme: "Absolute stillness before rebirth." }
    ],
    PYLONS: [
        { name: "Alpha Pylon", coord: 0, type: 'node-pyl', glyph: '⬟', duration: window.Q_GEAR_CONSTANTS.ALPHA, event: 'WINTER SOLSTICE (NADIR)', desc: "PRINCIPLE: Quadrature Nadir. Zero-crossing metrology anchor. Initiates primary orbital cycle.", renderUI: true },
        { name: "Beta Pylon", coord: 90, type: 'node-pyl', glyph: '⬟', duration: window.Q_GEAR_CONSTANTS.BETA, event: 'VERNAL EQUINOX', desc: "PRINCIPLE: First Quadrant Anchor. Balance threshold. Initiates Q2 thermodynamic shift.", renderUI: true },
        { name: "Gamma Pylon", coord: 180, type: 'node-pyl', glyph: '⬟', duration: window.Q_GEAR_CONSTANTS.GAMMA, event: 'SUMMER SOLSTICE (APEX)', desc: "PRINCIPLE: Quadrature Apex. Maximum orbital variance. Initiates Q3 decline.", renderUI: true },
        { name: "Delta Pylon", coord: 270, type: 'node-pyl', glyph: '⬟', duration: window.Q_GEAR_CONSTANTS.DELTA, event: 'AUTUMNAL EQUINOX', desc: "PRINCIPLE: Final Quadrant Anchor. Entropy return threshold. Initiates Q4 system transit.", renderUI: true },
        { name: "Epsilon Pylon", coord: 360, type: 'node-pyl', glyph: '⬟', duration: window.Q_GEAR_CONSTANTS.EPSILON, event: 'TERMINAL RESOLUTION', desc: "PRINCIPLE: Terminal Oddity integration. Resolution of the Keplerian Smear. Closes the Mean Circle.", renderUI: false }
    ]
};

// --- GLOBAL LEXICON ---
window.Q_LEXICON = {
    CIVIL: "Mean Circle",
    PHYSICS: "True Ellipse",
    INTERFACE: "The Quad"
};

// --- SUPABASE CLOUD BRIDGE ---
window.Q_SUPABASE_URL = 'https://wnfpxozpeucrwqmrqpzv.supabase.co';
window.Q_SUPABASE_KEY = 'sb_publishable_g6JfCH6FefIwEmXztgkdTw_Md1z4se5';
window.supabaseClient = null;

window.initCloudBridge = async function() {
    return new Promise((resolve) => {
        if (window.supabase) {
            window.supabaseClient = window.supabase.createClient(window.Q_SUPABASE_URL, window.Q_SUPABASE_KEY);
            resolve();
            return;
        }
        const script = document.createElement('script');
        script.src = "https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2";
        script.onload = () => {
            window.supabaseClient = window.supabase.createClient(window.Q_SUPABASE_URL, window.Q_SUPABASE_KEY);
            window.Q_LOG('INFO', 'CORE', 'SUPABASE_CLIENT_INITIALIZED');
            resolve();
        };
        document.head.appendChild(script);
    });
};

window.fetchCloudState = async function() {
    if (!window.supabaseClient) return;
    
    const { data: session } = await window.supabaseClient.auth.getSession();
    if (!session?.session?.user) {
        window.Q_LOG('WARN', 'CORE', 'CLOUD_SYNC_ABORTED: No Active Supabase Auth Session.');
        return; 
    }

    try {
        const { data, error } = await window.supabaseClient
            .from('system_state')
            .select('*')
            .eq('user_id', session.session.user.id)
            .single();

        if (error) throw error;
        
        if (data) {
            if (data.q_time_fmt) {
                window.Q_STATE.system_state.q_time_fmt = data.q_time_fmt;
                localStorage.setItem('Q_TIME_FMT', data.q_time_fmt);
                
                document.querySelectorAll('.fmt-toggle').forEach(btn => {
                    btn.innerText = data.q_time_fmt.replace('_', ' ');
                });
            }
            window.Q_LOG('STATE', 'CORE', 'CLOUD_STATE_SYNCED_TO_LOCAL');
        }
    } catch (err) {
        window.Q_LOG('ERROR', 'CORE', 'CLOUD_STATE_FETCH_FAILED', { error: err.message });
    }
};

// CENTRALIZED STATE MANAGEMENT
window.Q_STATE = {
    persistence: { db_migration: 'ACTIVE', auth_status: 'STANDBY', sync_active: false },
    logic_layer: { predictive_friction: true, civil_exporter: 'ACTIVE' },
    hardware_hooks: { biometric_api: 'ACTIVE', iot_webhooks: 'ACTIVE' },
    capital_ledger: { fiat_api: 'STANDBY', resonance_tracker: 'ACTIVE' },
    metaphysical_layer: { 
        swiss_ephemeris: 'STANDBY', 
        patreon_gating: 'STANDBY', 
        access_tier: 0,
        natal_anchor: localStorage.getItem('q_natal_anchor') || 'NONE',
        dob: localStorage.getItem('q_dob') || null
    },
    location: { 
        lat: parseFloat(localStorage.getItem('q_current_lat')) || 0, 
        lon: parseFloat(localStorage.getItem('q_current_lon')) || 0, 
        name: localStorage.getItem('q_current_loc_name') || 'UNKNOWN', 
        synced: false 
    },
    system_state: {
        q_time_fmt: localStorage.getItem('Q_TIME_FMT') || 'UTC_24'
    }
};

window.Q_UpdateState = async function(category, key, value) {
    if(window.Q_STATE[category]) {
        window.Q_STATE[category][key] = value;
    }

    if (window.ReactNativeWebView) {
        window.ReactNativeWebView.postMessage(JSON.stringify({ action: 'SECURE_STORE_SET', key: `q_${key}`, value: value }));
    }
    
    if(key === 'lat') localStorage.setItem('q_current_lat', value);
    if(key === 'lon') localStorage.setItem('q_current_lon', value);
    if(key === 'name') localStorage.setItem('q_current_loc_name', value);
    if(key === 'natal_anchor') localStorage.setItem('q_natal_anchor', value);
    if(key === 'dob') localStorage.setItem('q_dob', value);
    if(key === 'q_time_fmt') localStorage.setItem('Q_TIME_FMT', value);

    if (window.supabaseClient) {
        const { data: session } = await window.supabaseClient.auth.getSession();
        if (session?.session?.user) {
            try {
                let payload = { user_id: session.session.user.id };
                if (key === 'q_time_fmt') payload.q_time_fmt = value;
                
                const { error } = await window.supabaseClient
                    .from('system_state')
                    .upsert(payload, { onConflict: 'user_id' });

                if (error) throw error;
                window.Q_LOG('INFO', 'CORE', 'STATE_SYNCED_TO_CLOUD', { key, value });
            } catch (err) {
                window.Q_LOG('ERROR', 'CORE', 'CLOUD_SYNC_FAILED', { error: err.message });
            }
        } else {
             window.Q_LOG('WARN', 'CORE', 'CLOUD_WRITE_ABORTED: Authentication Required.');
        }
    }
};

window.getSimState = function() {
    let state = { isLive: true, simTime: Date.now(), scrubSpeed: 0 };
    try {
        const raw = localStorage.getItem('Q_MASTER_CLOCK');
        if (raw) {
            const parsed = JSON.parse(raw);
            state.isLive = parsed.isLive;
            state.simTime = state.isLive ? Date.now() : parsed.simTime;
            state.scrubSpeed = parsed.scrubSpeed || 0;
        }
    } catch (e) {}
    if (state.isLive) state.simTime = Date.now();
    return state;
};

// --- ABSOLUTE PIXEL HEIGHT BINDING FOR MOBILE VIEWPORT SUPREMACY ---
window.Q_ForceAppHeight = function() {
    document.documentElement.style.setProperty('--app-height', `${window.innerHeight}px`);
};
window.addEventListener('resize', window.Q_ForceAppHeight);
window.Q_ForceAppHeight();

// --- MOBILE NATIVE BRIDGE & HAPTICS (WITH GRACEFUL FALLBACK) ---
window.Q_MobileBridge = {
    init: function() {
        document.addEventListener('message', (e) => {
            try {
                const msg = JSON.parse(e.data);
                if (msg.type === 'HAPTIC_ACK') {
                    window.Q_LOG('INFO', 'HARDWARE', 'HAPTIC_FEEDBACK_CONFIRMED');
                }
                if (msg.type === 'APP_STATE_FOREGROUND') {
                    window.Q_LOG('INFO', 'CORE', 'NATIVE_WAKE_EVENT_RESYNC');
                }
            } catch(err) {}
        });

        document.addEventListener('visibilitychange', () => {
            if (document.visibilityState === 'visible') {
                window.Q_LOG('INFO', 'CORE', 'BROWSER_WAKE_EVENT_RESYNC');
            }
        });
    },
    pulse: function(intensity) {
        if (window.ReactNativeWebView) {
            window.ReactNativeWebView.postMessage(JSON.stringify({ action: 'HAPTIC_PULSE', intensity: intensity }));
        } else {
            window.Q_LOG('INFO', 'HARDWARE', 'MOCK_HAPTIC_PULSE_BROWSER', { intensity: intensity });
        }
    }
};
window.Q_MobileBridge.init();

// --- KAIROS SOVEREIGN COMMAND (VOICE LISTENER) ---
window.Q_KairosVoice = {
    recognition: null,
    isListening: false,
    toastTimer: null,
    showErrorToast: function(msg) {
        let toast = document.getElementById('q-voice-error-toast');
        if (!toast) {
            toast = document.createElement('div');
            toast.id = 'q-voice-error-toast';
            toast.style.cssText = 'position:fixed; top:60px; left:50%; transform:translateX(-50%); width:90%; background:rgba(255,0,60,0.95); border:1px solid #ff003c; color:#fff; padding:15px; border-radius:6px; font-family:"JetBrains Mono"; font-size:0.65rem; z-index:1000000; text-align:center; box-shadow: 0 10px 30px rgba(0,0,0,0.9); font-weight: bold; pointer-events:none; backdrop-filter: blur(10px); text-shadow: 0 0 5px #000;';
            document.body.appendChild(toast);
        }
        toast.innerText = `[ VOICE PROTOCOL DIAGNOSTIC ]\n\n${msg}`;
        setTimeout(() => { if(toast) toast.remove(); }, 6000);
    },
    init: function() {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        if (!SpeechRecognition) {
            window.Q_LOG('WARN', 'INTERFACE', 'WEB_SPEECH_API_UNSUPPORTED_SILENT');
            return; 
        }
        this.recognition = new SpeechRecognition();
        this.recognition.continuous = true;
        this.recognition.interimResults = false;
        this.recognition.lang = 'en-US';

        this.recognition.onstart = () => {
            const fab = document.getElementById('q-mic-fab') || document.getElementById('q-mic-fab-desktop');
            if(fab) fab.classList.add('listening');
        };

        this.recognition.onresult = (event) => {
            const lastResult = event.results[event.results.length - 1];
            if (lastResult.isFinal) {
                const rawTranscript = lastResult[0].transcript;
                window.Q_LOG('INFO', 'INTERFACE', 'SOVEREIGN_COMMAND_DETECTED', { raw: rawTranscript });
                this.showFeedback(rawTranscript);
                this.processCommand(rawTranscript);
            }
        };

        this.recognition.onerror = (event) => {
            window.Q_LOG('ERROR', 'INTERFACE', 'VOICE_RECOGNITION_ERROR', { error: event.error });
            if (event.error === 'not-allowed' || event.error === 'service-not-allowed') {
                this.showErrorToast("MICROPHONE ACCESS DENIED.\nEnsure browser permissions are granted. If testing via local Expo LAN, Android requires a secure HTTPS tunnel to access the microphone array.");
                this.isListening = false;
                const fab = document.getElementById('q-mic-fab') || document.getElementById('q-mic-fab-desktop');
                if(fab) fab.classList.remove('listening');
            } else if (event.error === 'network') {
                this.showErrorToast("NETWORK ERROR.\nWeb Speech API failed to connect. A secure HTTPS origin is mandatory on Android.");
            } else {
                this.showErrorToast(`SYSTEM FAULT: ${event.error.toUpperCase()}`);
            }
        };
        
        this.recognition.onend = () => {
            const fab = document.getElementById('q-mic-fab') || document.getElementById('q-mic-fab-desktop');
            if (this.isListening) {
                try { this.recognition.start(); } catch(e){ 
                    this.isListening = false; 
                    if(fab) fab.classList.remove('listening'); 
                }
            } else {
                if(fab) fab.classList.remove('listening');
            }
        };
    },
    showFeedback: function(text) {
        let toast = document.getElementById('q-voice-toast');
        if (!toast) {
            toast = document.createElement('div');
            toast.id = 'q-voice-toast';
            toast.style.cssText = 'position:fixed; bottom:85px; right:20px; background:rgba(0,240,255,0.15); border:1px solid #00f0ff; color:#00f0ff; padding:10px 15px; border-radius:6px; font-family:"Orbitron"; font-size:0.75rem; z-index:100000; pointer-events:none; transition:opacity 0.5s ease-in-out; text-shadow:0 0 8px #00f0ff; backdrop-filter: blur(5px); box-shadow: 0 0 20px rgba(0,240,255,0.2); font-weight: bold;';
            document.body.appendChild(toast);
        }
        toast.innerText = `[ HEARD: "${text}" ]`;
        toast.style.opacity = '1';
        clearTimeout(this.toastTimer);
        this.toastTimer = setTimeout(() => { toast.style.opacity = '0'; }, 3500);
    },
    engage: function() {
        if (!this.recognition) {
            this.showErrorToast("VOICE MODULE UNAVAILABLE.\nYour browser does not support the Web Speech API, or it is being blocked by an insecure (HTTP) development environment.");
            return;
        }
        if(window.isSecureContext === false) {
             this.showErrorToast("INSECURE CONTEXT DETECTED.\nThe Android WebView strictly blocks microphone access on local HTTP IP addresses. Deploy via HTTPS/Tunnel.");
        }
        
        this.isListening = true;
        try { 
            this.recognition.start(); 
            window.Q_LOG('STATE', 'INTERFACE', 'KAIROS_VOICE_ACTIVATED');
        } catch(e) {
            window.Q_LOG('ERROR', 'INTERFACE', 'MIC_START_FAILED', { error: e.message });
            this.showErrorToast(`START FAILED: ${e.message}`);
            this.isListening = false;
            const fab = document.getElementById('q-mic-fab') || document.getElementById('q-mic-fab-desktop');
            if(fab) fab.classList.remove('listening');
        }
    },
    disengage: function() {
        if (!this.recognition) return;
        this.isListening = false;
        this.recognition.stop();
        window.Q_LOG('STATE', 'INTERFACE', 'KAIROS_VOICE_DEACTIVATED');
    },
    toggle: function() {
        if (this.isListening) {
            this.disengage();
        } else {
            this.engage();
        }
    },
    processCommand: function(cmd) {
        const normalized = cmd.toLowerCase().replace(/[^a-z0-9\s]/g, '').trim();

        if (normalized.includes("close") || normalized.includes("dismiss") || normalized.includes("hide")) {
            window.Q_LOG('INFO', 'INTERFACE', 'VOICE_INTENT_CLOSE');
            if (window.Q_ModalEngine) window.Q_ModalEngine.close();
            if (window.Q_IntegrationHub) window.Q_IntegrationHub.closeHub();
            if (window.Q_OmniPlanner) window.Q_OmniPlanner.closePlanner();
            if (document.body.classList.contains('telemetry-open') && typeof window.toggleTelemetry === 'function') window.toggleTelemetry();
            window.Q_MobileBridge.pulse('LIGHT');
            return;
        }

        if (normalized.includes("biological") || normalized.includes("bio vector")) {
            window.location.href = "BIOVECHUD.html";
            return;
        }
        if (normalized.includes("communal") || normalized.includes("com vector")) {
            window.location.href = "COMVECHUD.html";
            return;
        }
        if (normalized.includes("environmental") || normalized.includes("env vector")) {
            window.location.href = "ENVVECHUD.html";
            return;
        }
        if (normalized.includes("mechanical") || normalized.includes("mech vector")) {
            window.location.href = "MECVECHUD.html";
            return;
        }
        if (normalized.includes("chrono") || normalized.includes("main face") || normalized.includes("home")) {
            window.location.href = "index.html";
            return;
        }

        if (normalized.includes("open planner") || normalized.includes("launch planner") || normalized.includes("omni planner")) {
            window.Q_LOG('INFO', 'INTERFACE', 'VOICE_INTENT_PLANNER_OPEN');
            if (window.Q_OmniPlanner && window.Q_OmniPlanner.openPlanner) {
                window.Q_OmniPlanner.openPlanner();
                window.Q_MobileBridge.pulse('MEDIUM');
            }
            return;
        }
        
        if (sessionStorage.getItem('Q_PLANNER_ACTIVE') === 'true') {
            if (normalized.includes("view cycle") || normalized.includes("annual view")) {
                window.Q_OmniPlanner.setViewMode('cycle');
            }
            else if (normalized.includes("view quad") || normalized.includes("quadrant view")) {
                window.Q_OmniPlanner.setViewMode('quad');
            }
            else if (normalized.includes("view sect") || normalized.includes("sector view") || normalized.includes("month view")) {
                window.Q_OmniPlanner.setViewMode('sect');
            }
            else if (normalized.includes("view day") || normalized.includes("daily view")) {
                window.Q_OmniPlanner.setViewMode('day');
            }
            else if (normalized.includes("next day") || normalized.includes("step forward")) {
                window.Q_OmniPlanner.stepDay(1);
            }
            else if (normalized.includes("previous day") || normalized.includes("step back")) {
                window.Q_OmniPlanner.stepDay(-1);
            }
            else if (normalized.includes("next sector") || normalized.includes("next month")) {
                window.Q_OmniPlanner.stepSector(1);
            }
            else if (normalized.includes("previous sector") || normalized.includes("previous month")) {
                window.Q_OmniPlanner.stepSector(-1);
            }
            else if (normalized.includes("toggle format") || normalized.includes("switch format")) {
                window.Q_OmniPlanner.toggleFormat();
            }
            window.Q_MobileBridge.pulse('LIGHT');
            return;
        }

        window.Q_LOG('WARN', 'INTERFACE', 'UNRECOGNIZED_VOICE_COMMAND', { cmd: normalized });
    }
};

// --- SOVEREIGN ONBOARDING (FIRST-BOOT INITIATION) ---
window.Q_Onboarding = {
    check: function() {
        const currentVersion = "15.5.1";
        if (localStorage.getItem('Q_CORE_VERSION') !== currentVersion) {
            localStorage.removeItem('q_dob');
            localStorage.removeItem('q_current_loc_name');
            localStorage.removeItem('q_bio_anchor');
            localStorage.setItem('Q_CORE_VERSION', currentVersion);
            window.Q_LOG('STATE', 'CORE', 'VERSION_UPDATE_STORAGE_CLEARED', { version: currentVersion });
        }

        const dob = localStorage.getItem('q_dob');
        const loc = localStorage.getItem('q_current_loc_name');
        const anchor = localStorage.getItem('q_bio_anchor');
        
        if (!dob || !loc || !anchor) {
            this.render();
        }
    },
    render: function() {
        const overlay = document.createElement('div');
        overlay.id = 'q-onboarding-overlay';
        overlay.style.cssText = 'position:fixed; top:0; left:0; width:100%; height:100%; background:rgba(0,0,0,0.95); z-index:999999; display:flex; justify-content:center; align-items:center; flex-direction:column; color:#00f0ff; font-family:"Orbitron"; backdrop-filter:blur(15px);';
        
        overlay.innerHTML = `
            <div style="width: 90%; max-width: 400px; border: 1px solid #00f0ff; padding: 25px; background: rgba(0, 240, 255, 0.05); box-shadow: 0 0 30px rgba(0, 240, 255, 0.2); border-radius: 8px;">
                <h3 style="text-align:center; letter-spacing:3px; text-shadow:0 0 10px #00f0ff; margin-top:0;">SOVEREIGN INITIATION</h3>
                <div style="font-family:'JetBrains Mono'; font-size:0.7rem; color:#aaa; margin-bottom: 25px; text-align:center; line-height: 1.5;">Define your personal metrological anchors to calibrate the Quadrature Structure.</div>
                
                <label style="font-size:0.65rem; color:#fff; font-weight:bold;">DATE OF BIRTH (NATAL METROLOGY)</label>
                <input type="date" id="init-dob" style="width:100%; background:rgba(0,0,0,0.8); border:1px solid #00f0ff; color:#00f0ff; padding:10px; margin-top:4px; margin-bottom:15px; font-family:'JetBrains Mono'; box-sizing:border-box; outline:none;">
                
                <label style="font-size:0.65rem; color:#fff; font-weight:bold;">GEOLOCATION (CITY, STATE)</label>
                <input type="text" id="init-loc" placeholder="ACQUIRING DEVICE LOCATION..." style="width:100%; background:rgba(0,0,0,0.8); border:1px solid #00f0ff; color:#00f0ff; padding:10px; margin-top:4px; margin-bottom:15px; font-family:'JetBrains Mono'; box-sizing:border-box; outline:none;">
                
                <label style="font-size:0.65rem; color:#fff; font-weight:bold;">WAKE ANCHOR (UTC WAKE TIME)</label>
                <input type="time" id="init-anchor" style="width:100%; background:rgba(0,0,0,0.8); border:1px solid #00f0ff; color:#00f0ff; padding:10px; margin-top:4px; margin-bottom:25px; font-family:'JetBrains Mono'; box-sizing:border-box; outline:none;">
                
                <button onclick="window.Q_Onboarding.save()" style="width:100%; background:#00f0ff; color:#000; border:none; padding:12px; font-family:'Orbitron'; font-weight:900; cursor:pointer; letter-spacing:3px; box-shadow:0 0 20px #00f0ff; transition: 0.3s;">INITIALIZE</button>
            </div>
        `;
        document.body.appendChild(overlay);

        window.syncGeoLocation().then(() => {
            const locInput = document.getElementById('init-loc');
            if (locInput && window.Q_STATE.location.synced && window.Q_STATE.location.name !== 'UNKNOWN') {
                locInput.value = window.Q_STATE.location.name;
                locInput.style.boxShadow = "inset 0 0 15px rgba(0,240,255,0.4)";
                setTimeout(() => { locInput.style.boxShadow = "none"; }, 1000);
            }
        });
    },
    save: function() {
        const dob = document.getElementById('init-dob').value;
        const loc = document.getElementById('init-loc').value;
        const anchor = document.getElementById('init-anchor').value;
        
        if(!dob || !loc || !anchor) {
            alert("ALL FIELDS REQUIRED FOR SOVEREIGN INITIATION.");
            return;
        }
        
        window.Q_UpdateState('metaphysical_layer', 'dob', dob);
        window.Q_UpdateState('location', 'name', loc.toUpperCase());
        
        const parts = anchor.split(':');
        const mins = (parseInt(parts[0]) * 60) + parseInt(parts[1]);
        localStorage.setItem('q_bio_anchor', mins);
        
        const overlay = document.getElementById('q-onboarding-overlay');
        if (overlay) overlay.remove();
        
        window.Q_LOG('STATE', 'CORE', 'SOVEREIGN_INITIATION_COMPLETE');
    }
};

// --- SOVEREIGN AUTHENTICATION (MAGIC LINK) ---
window.Q_Auth = {
    triggerOAuth: function() {
        window.Q_LOG('INFO', 'CORE', 'SOVEREIGN_IDENTITY_AUTH_TRIGGERED');
        if (window.ReactNativeWebView) {
            window.ReactNativeWebView.postMessage(JSON.stringify({ action: 'OAUTH_LOGIN' }));
        } else {
            this.renderLoginModal();
        }
    },
    renderLoginModal: function() {
        if (document.getElementById('q-auth-overlay')) return;

        const overlay = document.createElement('div');
        overlay.id = 'q-auth-overlay';
        overlay.style.cssText = 'position:fixed; top:0; left:0; width:100%; height:100%; background:rgba(0,0,0,0.95); z-index:999999; display:flex; justify-content:center; align-items:center; flex-direction:column; color:#00f0ff; font-family:"Orbitron"; backdrop-filter:blur(15px);';
        
        overlay.innerHTML = `
            <div style="width: 90%; max-width: 400px; border: 1px solid #00f0ff; padding: 25px; background: rgba(0, 240, 255, 0.05); box-shadow: 0 0 30px rgba(0, 240, 255, 0.2); border-radius: 8px; position:relative;">
                <button onclick="document.getElementById('q-auth-overlay').remove()" style="position:absolute; top:10px; right:10px; background:transparent; border:none; color:#ff003c; font-size:1.2rem; cursor:pointer;">✖</button>
                <h3 style="text-align:center; letter-spacing:3px; text-shadow:0 0 10px #00f0ff; margin-top:0;">SOVEREIGN LOGIN</h3>
                <div style="font-family:'JetBrains Mono'; font-size:0.7rem; color:#aaa; margin-bottom: 25px; text-align:center; line-height: 1.5;">Authenticate via Magic Link to sync your temporal state across the Quadrature Matrix.</div>
                
                <label style="font-size:0.65rem; color:#fff; font-weight:bold;">EMAIL ADDRESS</label>
                <input type="email" id="auth-email" placeholder="architect@thequadrature.com" style="width:100%; background:rgba(0,0,0,0.8); border:1px solid #00f0ff; color:#00f0ff; padding:10px; margin-top:4px; margin-bottom:25px; font-family:'JetBrains Mono'; box-sizing:border-box; outline:none;">
                
                <button onclick="window.Q_Auth.sendMagicLink()" id="auth-submit-btn" style="width:100%; background:#00f0ff; color:#000; border:none; padding:12px; font-family:'Orbitron'; font-weight:900; cursor:pointer; letter-spacing:3px; box-shadow:0 0 20px #00f0ff; transition: 0.3s;">SEND MAGIC LINK</button>
                <div id="auth-status" style="margin-top:15px; font-family:'JetBrains Mono'; font-size:0.65rem; color:#39ff14; text-align:center; display:none;"></div>
            </div>
        `;
        document.body.appendChild(overlay);
    },
    sendMagicLink: async function() {
        const email = document.getElementById('auth-email').value;
        const statusEl = document.getElementById('auth-status');
        const btn = document.getElementById('auth-submit-btn');
        
        if (!email || !email.includes('@')) {
            alert("INVALID EMAIL PROTOCOL.");
            return;
        }

        if (!window.supabaseClient) {
            alert("CLOUD BRIDGE DISCONNECTED. AWAITING SUPABASE INIT.");
            return;
        }

        btn.innerText = "TRANSMITTING...";
        btn.style.opacity = "0.5";
        btn.style.pointerEvents = "none";

        try {
            const { error } = await window.supabaseClient.auth.signInWithOtp({
                email: email,
                options: {
                    emailRedirectTo: window.location.origin
                }
            });

            if (error) throw error;

            statusEl.innerText = "[ LINK TRANSMITTED. CHECK SECURE COMMS. ]";
            statusEl.style.color = "#39ff14";
            statusEl.style.display = "block";
            btn.innerText = "LINK SENT";
            window.Q_LOG('STATE', 'CORE', 'MAGIC_LINK_DISPATCHED', { email });

        } catch (err) {
            statusEl.innerText = `[ FAULT: ${err.message} ]`;
            statusEl.style.color = "#ff003c";
            statusEl.style.display = "block";
            btn.innerText = "SEND MAGIC LINK";
            btn.style.opacity = "1";
            btn.style.pointerEvents = "auto";
            window.Q_LOG('ERROR', 'CORE', 'MAGIC_LINK_FAILED', { error: err.message });
        }
    },
    handleAuthRedirect: async function() {
        if (!window.supabaseClient) return;
        
        const { data: session } = await window.supabaseClient.auth.getSession();
        if (session?.session?.user) {
            window.Q_STATE.persistence.auth_status = 'SOVEREIGN_AUTHENTICATED';
            window.Q_LOG('STATE', 'CORE', 'SOVEREIGN_IDENTITY_VERIFIED', { user: session.session.user.email });
            
            const badge = document.getElementById('q-global-sim-badge');
            if (badge) {
                badge.style.border = "1px solid #39ff14";
                badge.style.boxShadow = "0 0 10px rgba(57, 255, 20, 0.4)";
            }
        }
    }
};

// --- UNIVERSAL DATE/TIME FORMATTER ---
window.formatLegacyDate = function(ms) {
    const d = new Date(ms);
    const months = ["JAN","FEB","MAR","APR","MAY","JUN","JUL","AUG","SEP","OCT","NOV","DEC"];
    const fmt = localStorage.getItem('Q_TIME_FMT') || 'UTC_24';
    const isLocal = fmt.includes('LOCAL');
    const is12 = fmt.includes('12');
    
    return {
        dateStr: `${months[isLocal ? d.getMonth() : d.getUTCMonth()]} ${isLocal ? d.getDate() : d.getUTCDate()}, ${isLocal ? d.getFullYear() : d.getUTCFullYear()}`,
        timeStr: d.toLocaleTimeString('en-US', { hour12: is12, hour: '2-digit', minute: '2-digit', second: '2-digit', timeZone: isLocal ? undefined : 'UTC' }) + (isLocal ? ' LCL' : ' Z')
    };
};

// --- TIME FORMAT TOGGLE LOGIC ---
window.toggleTimeFmt = function(btnId) {
    let fmt = localStorage.getItem('Q_TIME_FMT') || 'UTC_24';
    const cycle = { 'UTC_24': 'LOCAL_24', 'LOCAL_24': 'UTC_12', 'UTC_12': 'LOCAL_12', 'LOCAL_12': 'UTC_24' };
    let newFmt = cycle[fmt] || 'UTC_24';
    
    window.Q_UpdateState('system_state', 'q_time_fmt', newFmt);
    
    document.querySelectorAll('.fmt-toggle').forEach(btn => {
        btn.innerText = newFmt.replace('_', ' ');
    });
    
    if (window.Q_MobileBridge) window.Q_MobileBridge.pulse('LIGHT');
    window.Q_LOG('INFO', 'INTERFACE', 'TIME_FORMAT_TOGGLED', { format: newFmt });
};

// --- THE MASTER RENDER LOOP ---
window.Q_MasterLoop = {
    lastPylonIndex: null,

    start: function() {
        const loop = () => {
            if(window.PYLON_ALPHA_DYNAMIC) {
                const state = window.getSimState();
                const t = state.isLive ? Date.now() : state.simTime;
                const activeTime = new Date(t);
                const diff = t - window.PYLON_ALPHA_DYNAMIC;
                const daysElapsed = diff / window.MS_DAY;
                
                // Execute Zero-Redundancy Orbital Mapping
                const qData = window.getOrbitalData(daysElapsed);
                
                const lagDays = 10.5 + (daysElapsed * 0.0001);
                const formatted = window.formatLegacyDate(t);

                const sovereignPostulates = ["LOCATION IS TRUTH", "THE ARC IS QUADRATURE"];
                const postulateIndex = Math.floor((t / 90000) % sovereignPostulates.length);
                const activePostulate = sovereignPostulates[postulateIndex];

                let currentPylonIndex = Math.floor(qData.trueArc / 90);
                if (this.lastPylonIndex !== null && currentPylonIndex !== this.lastPylonIndex) {
                    window.Q_LOG('STATE', 'PHYSICS', 'CARDINAL_PYLON_CROSSED', { arc: qData.trueArc });
                    window.Q_MobileBridge.pulse('HEAVY');
                }
                this.lastPylonIndex = currentPylonIndex;

                window.dispatchEvent(new CustomEvent('q-tick', {
                    detail: { t, isLive: state.isLive, activeTime, daysElapsed, qData, lagDays, legacyDateStr: formatted.dateStr, legacyTimeStr: formatted.timeStr, activePostulate }
                }));
            }
            requestAnimationFrame(loop);
        };
        requestAnimationFrame(loop);
    }
};

// --- DECOUPLED VISUAL WARP ENGINE ---
(function initWarpEngine() {
    let warpFactor = 0;
    let targetWarp = 0;
    let lastDays = null;

    window.addEventListener('q-tick', (e) => {
        const currentDays = e.detail.daysElapsed;
        if (lastDays !== null && !e.detail.isLive) {
            const delta = Math.abs(currentDays - lastDays);
            if (delta > 0) {
                targetWarp = Math.min(1.0, targetWarp + (delta * 0.5)); 
            }
        }
        lastDays = currentDays;
    });

    const tick = () => {
        targetWarp *= 0.90; 
        warpFactor += (targetWarp - warpFactor) * 0.2; 
        
        if (document.documentElement) {
            document.documentElement.style.setProperty('--warp-factor', Math.max(0, warpFactor).toFixed(3));
            document.documentElement.style.setProperty('--warp-color', warpFactor > 0.05 ? 'var(--sys-cyan, #00f0ff)' : '#fff');
        }
        requestAnimationFrame(tick);
    };
    
    window.addEventListener('DOMContentLoaded', () => {
        requestAnimationFrame(tick);
    });
})();

window.generateStars = function(containerId) {
    const container = document.getElementById(containerId);
    if(!container) return;
    
    if (!document.getElementById('q-star-style')) {
        const style = document.createElement('style');
        style.id = 'q-star-style';
        style.innerHTML = `
            .star-kinetic {
                position: absolute; top: 50%; left: 50%; width: 2px; height: 2px;
                background: var(--warp-color, #fff); border-radius: 50%;
                transform-origin: 0 0;
                transform: rotate(var(--angle)) translateX(var(--radius)) scaleX(calc(1 + var(--warp-factor, 0) * 20));
                opacity: var(--opacity);
                transition: transform 0.1s linear, background 0.3s ease;
            }
        `;
        document.head.appendChild(style);
    }
    
    container.innerHTML = '';
    for(let i=0; i<150; i++) {
        let star = document.createElement('div'); 
        star.className = 'star-kinetic';
        star.style.setProperty('--angle', Math.random() * 360 + 'deg'); 
        star.style.setProperty('--radius', (Math.random() * 600 + 50) + 'px');
        star.style.setProperty('--opacity', Math.random() * 0.8 + 0.2); 
        container.appendChild(star);
    }
};

window.Q_BIOMETRICS = {
    calculateUltradian: function(hrvScore = 50) {
        let duration = 45 + ((hrvScore / 100) * 99); 
        return Math.max(45, Math.min(144, duration));
    }
};

window.Q_PHASE_II = {
    thresholds: { friction_warn: 0.015, thermic_spike: 0.030 },
    allocateResource: function(name, amount, type) {
        const daysElapsed = (Date.now() - window.PYLON_ALPHA_DYNAMIC) / window.MS_DAY;
        const orbital = window.getOrbitalData(daysElapsed);
        const entry = {
            id: `RES-${Date.now()}`, name: name, value: amount, mode: type,
            anchor_deg: type === 'B2B' ? orbital.meanArc : orbital.trueArc,
            q_delta_at_entry: orbital.delta, ts: Date.now()
        };
        if (!window.qData.ledger) window.qData.ledger = [];
        window.qData.ledger.push(entry);
        window.savePlannerData();
        window.Q_LOG('STATE', 'CAPITAL', 'RESOURCE_ALLOCATED', entry);
        return entry;
    },
    checkScheduleFriction: function(meanArcTarget) {
        const days = (meanArcTarget / (360 / 365.24219));
        const projected = window.getOrbitalData(days);
        const variance = Math.abs(projected.delta);
        const status = variance > this.thresholds.friction_warn ? 'FRICTION_HIGH' : 'RESONANCE_OPTIMAL';
        if (status === 'FRICTION_HIGH') {
            window.Q_LOG('WARN', 'LOGIC', 'PREDICTIVE_FRICTION_DETECTED', { target: meanArcTarget, delta: projected.delta });
        }
        return { status, variance: projected.delta };
    }
};

window.Q_PHASE_III = {
    syncBiometrics: function() {
        return new Promise((resolve, reject) => {
            window.Q_LOG('INFO', 'BIOLOGICAL', 'NATIVE_HEALTH_SYNC_INITIATED');
            
            if (window.ReactNativeWebView) {
                window.ReactNativeWebView.postMessage(JSON.stringify({ 
                    action: 'REQUEST_NATIVE_BIOMETRICS',
                    providers: ['HealthConnect', 'HealthKit'],
                    metrics: ['HRV', 'RHR', 'SLEEP_STAGE']
                }));
                
                const bioListener = (e) => {
                    try {
                        const msg = JSON.parse(e.data);
                        if (msg.type === 'NATIVE_BIOMETRIC_PAYLOAD') {
                            document.removeEventListener('message', bioListener);
                            window.Q_LOG('INFO', 'BIOLOGICAL', 'NATIVE_HEALTH_PAYLOAD_RECEIVED', { hrv: msg.payload.hrv });
                            resolve(window.Q_BIOMETRICS.calculateUltradian(msg.payload.hrv));
                        } else if (msg.type === 'NATIVE_BIOMETRIC_ERROR') {
                            document.removeEventListener('message', bioListener);
                            window.Q_LOG('ERROR', 'BIOLOGICAL', 'NATIVE_HEALTH_SYNC_FAILED', msg.payload);
                            reject(new Error(msg.payload.error));
                        }
                    } catch(err) {}
                };
                document.addEventListener('message', bioListener);
                
                setTimeout(() => { 
                    document.removeEventListener('message', bioListener); 
                    window.Q_LOG('ERROR', 'BIOLOGICAL', 'NATIVE_HEALTH_BRIDGE_TIMEOUT');
                    reject(new Error("HealthKit/HealthConnect timeout")); 
                }, 10000);
            } else {
                window.Q_LOG('WARN', 'BIOLOGICAL', 'NATIVE_BRIDGE_MISSING_ABORTING_SYNC');
                reject(new Error("Native bridge missing. Run in Sovereign Container."));
            }
        });
    },
    executeThermicOverride: async function(currentDelta) {
        if (window.Q_STATE.hardware_hooks.iot_webhooks !== 'ACTIVE') return;
        const payload = {
            vector: 'ENVIRONMENTAL',
            pylon: window.CURRENT_TRUE_ARC < 90 ? 'ALPHA' : 'OTHER',
            action: 'ADJUST_BASELOAD',
            adjustment: currentDelta > 0 ? -2 : 0 
        };
        window.Q_LOG('STATE', 'ENVIRONMENTAL', 'IoT_WEBHOOK_PUSHED', payload);
    }
};

window.Q_EVENT_BUFFER = [];
window.PYLON_ALPHA_DYNAMIC = null;
window.EPHEMERIS_LIVE = false;

window.injectUniversalUI = function() {
    if (window.self !== window.top) return;
    
    if (document.getElementById('q-ui-injected-flag')) return;

    let oldMeta = document.querySelector('meta[name="viewport"]');
    if (oldMeta) oldMeta.remove();
    let meta = document.createElement('meta');
    meta.name = "viewport";
    meta.content = "width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no, viewport-fit=cover";
    document.head.appendChild(meta);
    
    const path = window.location.pathname.toUpperCase();
    const bActive = path.includes("BIO");
    const eActive = path.includes("ENV");
    const mActive = path.includes("MEC");
    const cActive = path.includes("COM");
    const faceActive = (!bActive && !eActive && !mActive && !cActive);
    
    if (faceActive) {
        document.body.classList.add('q-chrono-face');
    } else {
        document.body.classList.add('q-vector-hud');
    }
    
    let wingAesthetic = "";
    if (bActive) {
        wingAesthetic = `background: linear-gradient(135deg, rgba(5, 8, 15, 0.8) 0%, rgba(10, 15, 30, 0.95) 100%); border: 1px solid rgba(0, 243, 255, 0.2); border-top: 1px solid var(--neon-cyan, #00f3ff); border-radius: 8px; box-shadow: 0 15px 35px rgba(0,0,0,0.8), inset 0 0 20px rgba(0,243,255,0.05);`;
    } else if (eActive) {
        wingAesthetic = `background: radial-gradient(circle at center, var(--env-green-dim, rgba(167, 255, 131, 0.2)) 0%, var(--glass-med, rgba(2, 12, 25, 0.65)) 80%); backdrop-filter: var(--blur-med, blur(16px)); -webkit-backdrop-filter: var(--blur-med, blur(16px)); box-shadow: 0 15px 40px rgba(0,0,0,0.7), inset 0 0 20px rgba(0,0,0,0.4); border-radius: 12px; border: 1px solid var(--env-green-dim, rgba(167, 255, 131, 0.2));`;
    } else if (mActive) {
        wingAesthetic = `backdrop-filter: blur(20px); -webkit-backdrop-filter: blur(20px); background: linear-gradient(135deg, rgba(15, 23, 42, 0.8) 0%, rgba(3, 4, 6, 0.95) 100%); border: 1px solid var(--titanium, #334155); border-top: 1px solid var(--cyan-glow, #00f0ff); border-radius: 4px; box-shadow: 0 20px 50px rgba(0,0,0,0.9), inset 0 0 30px rgba(0,0,0,0.5);`;
    } else if (cActive) {
        wingAesthetic = `background: linear-gradient(120deg, rgba(25,20,5,0.85) 0%, rgba(255,215,0,0.1) 40%, rgba(255,255,255,0.15) 50%, rgba(255,215,0,0.1) 60%, rgba(25,20,5,0.85) 100%); background-size: 300% 100%; backdrop-filter: var(--blur-med, blur(16px)); -webkit-backdrop-filter: var(--blur-med, blur(16px)); border: 2px solid var(--gold-bright, #ffd700); border-top: 1px solid rgba(255,215,0,0.5); border-radius: 20px; box-shadow: 0 10px 40px rgba(0,0,0,0.9), inset 0 0 20px rgba(255,215,0,0.1);`;
    } else { 
        wingAesthetic = `background: rgba(15, 12, 10, 0.9); backdrop-filter: var(--blur-med, blur(16px)); -webkit-backdrop-filter: var(--blur-med, blur(16px)); border-radius: 8px; box-shadow: 0 15px 35px rgba(0,0,0,0.8), inset 0 0 20px rgba(229, 228, 226, 0.1); border: 1px solid rgba(244, 208, 104, 0.3);`;
    }

    const style = document.createElement('style');
    style.innerHTML = `
        /* IRONCLAD VIEWPORT RECOVERY - FULL ABSOLUTE BOUNDING */
        html, body { 
            position: fixed !important; top: 0px !important; left: 0px !important; right: 0px !important; bottom: 0px !important; 
            width: 100vw !important; height: var(--app-height, 100vh) !important; 
            margin: 0px !important; padding: 0px !important; 
            overflow: hidden !important; touch-action: none !important; overscroll-behavior: none !important; transform: none !important; 
        }
        #mobile-telemetry-btn { display: none !important; pointer-events: none !important; }

        :root { --wing-w: 240px; --mod-w: 320px; --dial-size: 60vh; --wing-offset: calc((var(--dial-size) / 2) + 4vw); --glass-med: rgba(2, 12, 25, 0.65); --blur-med: blur(16px); --white-pure: #ffffff; --starlight: rgba(255, 255, 255, 0.7); --platinum: #E5E4E2; }
        
        .modal-overlay { position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.85); backdrop-filter: blur(10px); z-index: 10000; display: none; justify-content: center; align-items: center; cursor: pointer; }
        .modal-box { width: 400px; background: rgba(2, 6, 15, 0.95); border: 1px solid var(--theme-main, #00f0ff); border-radius: 12px; padding: 25px; box-shadow: 0 20px 50px rgba(0,0,0,0.9); display: flex; flex-direction: column; gap: 16px; cursor: default; pointer-events: auto; }
        .btn-close { background: transparent; border: 1px solid var(--platinum); color: var(--platinum); padding: 10px; font-family: 'Orbitron'; cursor: pointer; transition: 0.3s; width: 100%; margin-top: 10px; border-radius: 8px; font-weight: 700; letter-spacing: 2px; }

        .q-nav-bar { position: fixed; top: 0px !important; margin-top: 0px !important; left: 0 !important; width: 100%; height: 45px; background: rgba(2, 6, 15, 0.95); border-bottom: 1px solid var(--theme-dim, rgba(0, 240, 255, 0.2)); display: flex; justify-content: space-between; align-items: center; padding: 0 20px; box-sizing: border-box; z-index: 100000; font-family: 'Orbitron'; box-shadow: 0 5px 20px rgba(0,0,0,0.8); pointer-events: auto !important; }
        .q-nav-brand { color: #E5E4E2; font-weight: 900; letter-spacing: 4px; font-size: 0.8rem; text-shadow: 0 0 10px rgba(229, 228, 226, 0.4); flex-shrink: 0; }
        
        .q-nav-menu { display: flex; align-items: center; gap: 1vw; pointer-events: auto !important; }
        .q-nav-btn { background: transparent; border: 1px solid rgba(255,255,255,0.2); color: rgba(255,255,255,0.6); padding: 6px 12px; border-radius: 4px; font-family: 'Orbitron'; font-size: 0.6rem; font-weight: bold; cursor: pointer; transition: 0.3s; letter-spacing: 1px; text-decoration: none; display: inline-block; text-align: center; pointer-events: auto !important; }
        .q-nav-btn:hover { border-color: #fff; color: #fff; box-shadow: 0 0 10px rgba(255, 255, 255, 0.3); }
        
        .q-nav-btn.face-btn.active { border-color: #00f0ff; color: #00f0ff; box-shadow: inset 0 0 10px rgba(0,240,255,0.2); }
        .q-nav-btn.bio-btn.active { border-color: #39ff14; color: #39ff14; box-shadow: inset 0 0 10px rgba(57,255,20,0.2); }
        .q-nav-btn.com-btn.active { border-color: #F4D068; color: #F4D068; box-shadow: inset 0 0 10px rgba(244,208,104,0.2); }
        .q-nav-btn.env-btn.active { border-color: #a7ff83; color: #a7ff83; box-shadow: inset 0 0 10px rgba(167,255,131,0.2); }
        .q-nav-btn.mec-btn.active { border-color: #ff003c; color: #ff003c; box-shadow: inset 0 0 10px rgba(255,0,60,0.2); }

        #q-mic-fab-desktop { position: fixed; bottom: 20px; right: 20px; width: 50px; height: 50px; border-radius: 50%; background: rgba(5, 8, 15, 0.9); border: 1px solid var(--theme-main, #00f0ff); color: var(--theme-main, #00f0ff); display: flex; justify-content: center; align-items: center; z-index: 100000; box-shadow: 0 0 15px rgba(0,0,0,0.8); cursor: pointer; font-size: 1.2rem; transition: all 0.3s ease; pointer-events: auto !important; }
        #q-mic-fab-desktop:hover { background: var(--theme-main, #00f0ff); color: #000; box-shadow: 0 0 20px var(--theme-main, #00f0ff); }
        #q-mic-fab-desktop.listening { background: var(--theme-main, #00f0ff); color: #000; box-shadow: 0 0 20px var(--theme-main, #00f0ff); animation: pulse-mic 1.5s infinite; }
        
        .q-control-strip { display: none; }
        .star-container { position: absolute; top: 0; left: 0; width: 100vw; height: var(--app-height, 100vh); z-index: 1; pointer-events: none; overflow: hidden; transform: translateZ(0); backface-visibility: hidden; }
        
        .wing { position: absolute; top: 50%; height: 220px; width: var(--wing-w); min-width: 240px; z-index: 50; display: flex; flex-direction: column; justify-content: center; transform: translateY(-50%); pointer-events: none; }
        .wing-left { right: calc(50% + var(--wing-offset)); left: auto; perspective: 1000px; }
        .wing-right { left: calc(50% + var(--wing-offset)); right: auto; perspective: 1000px; }
        .wing-content { display: flex; flex-direction: column; justify-content: center; align-items: center; text-align: center; width: 100%; height: 100%; overflow: hidden; pointer-events: auto; ${wingAesthetic} }
        .w-head { font-family: 'Orbitron'; font-weight: 600; font-size: 0.75rem; letter-spacing: 3px; color: rgba(255,255,255,0.6); border-bottom: 1px solid var(--theme-dim); padding-bottom: 4px; margin-bottom: 8px; display: inline-block; z-index: 20;}
        .w-lbl { font-family: 'JetBrains Mono'; font-size: 0.55rem; color: var(--starlight); letter-spacing: 1px; text-transform: uppercase; margin-bottom: 2px; z-index: 20;}
        .val-lg { font-family: 'Orbitron'; font-size: 1.2rem; font-weight: 700; letter-spacing: 1px; white-space: nowrap; color: #fff; text-shadow: 0 4px 10px rgba(0,0,0,0.5); z-index: 20;}
        .q-prefix { font-size: 0.6rem; color: rgba(255,255,255,0.4); font-family: 'JetBrains Mono'; margin-right: 2px; z-index: 20;}
        .q-val { color: var(--theme-main); font-family: 'Orbitron'; font-weight: 700; text-shadow: 0 0 15px var(--theme-dim); margin-right: 6px; z-index: 20;}

        .fmt-toggle { font-family: 'JetBrains Mono'; font-weight: bold; font-size: 0.6rem; color: var(--theme-main); cursor: pointer; border: 1px solid var(--theme-dim); padding: 2px 8px; border-radius: 4px; background: rgba(0,0,0,0.6); pointer-events: auto; transition: 0.3s; white-space: nowrap; }
        .fmt-toggle:hover { background: var(--theme-main); color: #000; box-shadow: 0 0 10px var(--theme-main); }
        
        .desktop-only { display: block !important; }
        .mobile-only-flex { display: none !important; }

        @media (max-width: 950px) {
            :root { --dial-size: min(48vh, 85vw) !important; } 
            .desktop-only { display: none !important; }
            .mobile-only-flex { display: flex !important; }
            
            body:not(.telemetry-open) .telemetry-node { display: none !important; visibility: hidden !important; }
            body:not(.telemetry-open) .vector-anchor { display: none !important; visibility: hidden !important; }
            body:not(.telemetry-open) .wing { display: none !important; }
            
            .q-nav-bar { 
                top: 0px !important; margin-top: 0px !important; left: 0px !important; 
                padding: 0 10px !important; 
                height: 50px !important; 
            }
            
            .q-nav-brand { font-size: 0.55rem !important; letter-spacing: 1px !important; white-space: nowrap; }
            #q-global-sim-badge { font-size: 0.45rem !important; padding: 2px 4px !important; letter-spacing: 0px !important; margin-left: 0 !important; white-space: nowrap; flex-shrink: 0; }
            
            .q-nav-menu { 
                position: static; flex-direction: row; overflow-x: auto; white-space: nowrap; 
                background: transparent; box-shadow: none; transform: none; width: auto;
                -webkit-overflow-scrolling: touch; border: none; padding-bottom: 0; gap: 5px;
            }
            .q-nav-menu::-webkit-scrollbar { display: none; }
            .q-nav-btn { padding: 4px 8px; font-size: 0.55rem; margin-right: 0; border-radius: 4px; border: 1px solid rgba(255,255,255,0.2) !important; }
            .vector-link { display: none !important; }

            .q-center-dial { margin-top: -3vh !important; }
            
            .q-control-strip { 
                position: fixed; bottom: 0 !important; left: 0; width: 100%; 
                background: rgba(2, 6, 15, 0.98); border-top: 1px solid var(--theme-dim, rgba(0, 240, 255, 0.2)); 
                display: flex; justify-content: space-around; align-items: center; z-index: 100000; 
                height: 65px !important; 
                padding-bottom: 0 !important;
                box-shadow: 0 -10px 30px rgba(0,0,0,0.9); pointer-events: auto !important; 
            }
            .strip-btn { background: transparent; border: none; color: var(--platinum); display: flex; flex-direction: column; align-items: center; gap: 4px; cursor: pointer; text-decoration: none; padding: 5px; pointer-events: auto !important; }
            .strip-btn svg { transition: 0.3s; }
            .strip-btn.active svg { color: var(--theme-main, #00f0ff); filter: drop-shadow(0 0 8px var(--theme-main)); }
            .strip-lbl { font-family: 'Orbitron'; font-size: 0.4rem; font-weight: 900; letter-spacing: 1px; color: rgba(255,255,255,0.5); transition: 0.3s; }
            .strip-btn.active .strip-lbl { color: var(--theme-main); }
            
            #q-mic-fab { position: fixed; bottom: 85px; right: 15px; width: 45px; height: 45px; border-radius: 50%; background: rgba(5, 8, 15, 0.9); border: 1px solid var(--theme-main, #00f0ff); color: var(--theme-main, #00f0ff); display: flex; justify-content: center; align-items: center; z-index: 100000; box-shadow: 0 0 15px rgba(0,0,0,0.8); cursor: pointer; font-size: 1.1rem; transition: all 0.3s ease; pointer-events: auto !important;}
            #q-mic-fab.listening { background: var(--theme-main, #00f0ff); color: #000; box-shadow: 0 0 20px var(--theme-main, #00f0ff); animation: pulse-mic 1.5s infinite; }

            /* STRICT RIBBON WRAP FIX */
            #mobile-telemetry-ribbon { 
                display: flex !important; position: fixed; 
                top: 50px !important; 
                margin-top: 0 !important; left: 0px !important; height: 45px !important; 
                width: 100vw !important; background: rgba(2, 6, 15, 0.98); border-bottom: 1px solid var(--theme-dim, rgba(0, 240, 255, 0.2)); 
                z-index: 99998 !important; justify-content: space-between; align-items: center; box-shadow: 0 5px 15px rgba(0,0,0,0.9); 
                padding: 0 10px !important; box-sizing: border-box;
                white-space: nowrap; overflow: hidden;
            }
            #ribbon-leg-date {
                white-space: nowrap;
                font-size: 0.6rem !important;
            }
            #ribbon-leg {
                white-space: nowrap;
                font-size: 0.65rem !important;
            }

            #mobile-telemetry-viewport { 
                display: none; position: fixed !important; 
                top: 95px !important; 
                bottom: 65px !important; 
                height: auto !important; 
                left: 0; width: 100vw; 
                background: rgba(5,5,8,0.95); backdrop-filter: blur(15px); -webkit-backdrop-filter: blur(15px); z-index: 99900; 
                overflow-y: scroll !important; overflow-x: hidden !important; -webkit-overflow-scrolling: touch; overscroll-behavior: contain;
                flex-direction: column; align-items: center; justify-content: flex-start; 
                padding-top: 15px !important; margin-top: 0 !important; 
                padding-bottom: 20px !important; 
                box-sizing: border-box !important; 
                gap: 15px; pointer-events: auto !important;
            }
            #mobile-telemetry-viewport .telemetry-node { 
                display: flex !important; position: relative !important; top: auto !important; left: auto !important; right: auto !important; bottom: auto !important; 
                transform: translateZ(0) !important; margin: 0 !important; width: 95vw !important; max-width: 360px !important; 
                min-height: min-content !important; height: auto !important; box-sizing: border-box !important; backface-visibility: hidden !important; 
                visibility: visible !important; flex-shrink: 0 !important; pointer-events: auto !important; opacity: 1 !important;
            }
            #mobile-telemetry-viewport .wing { display: none !important; }
            
            body.telemetry-open .q-center-dial { display: none !important; }
        }
    `;
    document.head.appendChild(style);

    const uiContainer = document.createElement('div');
    uiContainer.id = 'q-ui-injected-flag';
    uiContainer.innerHTML = `
        <div class="q-nav-bar">
            <div style="display:flex; align-items:center; gap:8px; flex-wrap: nowrap; overflow: hidden;">
                <span class="q-nav-brand" style="white-space: nowrap;">THE QUADRATURE</span>
                <div id="q-global-sim-badge" style="display: none; background: var(--theme-main, #00f0ff); color: #000; font-family: 'Orbitron'; font-size: 0.55rem; font-weight: 900; padding: 4px 8px; border-radius: 4px; cursor: pointer; white-space: nowrap; flex-shrink: 0;" onclick="if(window.Q_Auth) window.Q_Auth.triggerOAuth();">[ IN THE QUAD ]</div>
            </div>
            <div class="q-nav-menu" id="q-nav-menu">
                <a href="index.html" class="q-nav-btn face-btn vector-link ${faceActive ? 'active' : ''}">CHRONO-FACE</a>
                <a href="BIOVECHUD.html" class="q-nav-btn bio-btn vector-link ${bActive ? 'active' : ''}">BIOLOGICAL</a>
                <a href="COMVECHUD.html" class="q-nav-btn com-btn vector-link ${cActive ? 'active' : ''}">COMMUNAL</a>
                <a href="ENVVECHUD.html" class="q-nav-btn env-btn vector-link ${eActive ? 'active' : ''}">ENVIRONMENTAL</a>
                <a href="MECVECHUD.html" class="q-nav-btn mec-btn vector-link ${mActive ? 'active' : ''}">MECHANICAL</a>
                <button class="q-nav-btn omni desktop-only" style="border-color: #ff003c; color: #ff003c;" onclick="if(typeof window.Q_OmniPlanner !== 'undefined') window.Q_OmniPlanner.openPlanner()">[ OMNI-PLANNER ]</button>
                <button class="q-nav-btn special desktop-only" style="border-color: #00f0ff; color: #00f0ff;" onclick="if(typeof window.Q_IntegrationHub !== 'undefined') window.Q_IntegrationHub.openHub()">[ DASHBOARD ]</button>
            </div>
            <button class="mobile-only-flex" style="background:transparent; border:none; color:var(--theme-main, #00f0ff); font-size:1.5rem; padding:0; margin:0; cursor:pointer;" onclick="if(typeof window.Q_IntegrationHub !== 'undefined') window.Q_IntegrationHub.openHub()">☰</button>
        </div>

        <div id="mobile-telemetry-ribbon" class="mobile-only-flex">
            <span id="ribbon-leg-date" style="font-family:'Orbitron'; font-size:0.65rem; color:var(--starlight); font-weight:bold; letter-spacing:1px; white-space:nowrap;">--</span>
            <div style="display:flex; align-items:center; gap: 4px;">
                <span class="val-gold" id="ribbon-leg" style="font-family:'JetBrains Mono'; font-size:0.65rem; font-weight:bold; margin-top:2px; white-space:nowrap;">--</span>
                <div class="fmt-toggle" onclick="window.toggleTimeFmt('ribbon-fmt')" id="ribbon-fmt" style="padding:2px 6px; font-size:0.5rem; pointer-events:auto; position:relative; z-index:100000; white-space:nowrap;">UTC</div>
            </div>
        </div>
        
        <div class="q-control-strip mobile-only-flex">
            <button class="strip-btn" onclick="if(typeof window.toggleTelemetry === 'function') window.toggleTelemetry()">
                <svg id="tele-icon" viewBox="0 0 24 24" width="22" height="22" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" fill="none"><path d="M18 20V10M12 20V4M6 20v-6"/></svg>
                <span class="strip-lbl">DATA</span>
            </button>
            <a href="BIOVECHUD.html" class="strip-btn ${bActive ? 'active' : ''}">
                <svg viewBox="0 0 24 24" width="22" height="22" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" fill="none"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/></svg>
                <span class="strip-lbl">BIO</span>
            </a>
            <a href="COMVECHUD.html" class="strip-btn ${cActive ? 'active' : ''}">
                <svg viewBox="0 0 24 24" width="22" height="22" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" fill="none"><circle cx="12" cy="5" r="3"/><line x1="12" y1="8" x2="12" y2="16"/><circle cx="6" cy="20" r="3"/><circle cx="18" cy="20" r="3"/><line x1="12" y1="16" x2="6" y2="17"/><line x1="12" y1="16" x2="18" y2="17"/></svg>
                <span class="strip-lbl">COM</span>
            </a>
            <a href="index.html" class="strip-btn ${faceActive ? 'active' : ''}">
                <svg viewBox="0 0 24 24" width="22" height="22" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" fill="none"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/></svg>
                <span class="strip-lbl">CHRONO</span>
            </a>
            <a href="ENVVECHUD.html" class="strip-btn ${eActive ? 'active' : ''}">
                <svg viewBox="0 0 24 24" width="22" height="22" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" fill="none"><path d="M2 22h20L12 2z"/></svg>
                <span class="strip-lbl">ENV</span>
            </a>
            <a href="MECVECHUD.html" class="strip-btn ${mActive ? 'active' : ''}">
                <svg viewBox="0 0 24 24" width="22" height="22" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" fill="none"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>
                <span class="strip-lbl">MEC</span>
            </a>
            <button class="strip-btn" onclick="if(typeof window.Q_OmniPlanner !== 'undefined') window.Q_OmniPlanner.openPlanner()">
                <svg viewBox="0 0 24 24" width="22" height="22" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" fill="none"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><line x1="3" y1="9" x2="21" y2="9"/><line x1="9" y1="21" x2="9" y2="9"/></svg>
                <span class="strip-lbl">PLAN</span>
            </button>
        </div>

        <button id="q-mic-fab" class="mobile-only-flex" onclick="if(window.Q_KairosVoice) window.Q_KairosVoice.toggle()">🎙</button>
    `;
    
    const refNode = document.body.firstChild;
    while (uiContainer.firstChild) document.body.insertBefore(uiContainer.firstChild, refNode);

    window.addEventListener('q-tick', (e) => {
        const badge = document.getElementById('q-global-sim-badge');
        if (badge) {
            badge.style.display = e.detail.isLive ? 'flex' : 'none';
            badge.innerText = e.detail.isLive ? "[ IN THE QUAD ]" : "[ TEMPORAL PROJECTION ]";
            if (!e.detail.isLive) {
                badge.style.background = "#ff003c";
                badge.style.color = "#fff";
                badge.style.border = "none";
            } else {
                badge.style.background = "var(--theme-main, #00f0ff)";
                badge.style.color = "#000";
            }
        }

        const ribbonLeg = document.getElementById('ribbon-leg');
        const ribbonLegDate = document.getElementById('ribbon-leg-date');
        const ribbonFmt = document.getElementById('ribbon-fmt');
        
        if (ribbonLeg && ribbonLegDate) {
            ribbonLeg.innerText = e.detail.legacyTimeStr;
            if (ribbonFmt) ribbonFmt.innerText = localStorage.getItem('Q_TIME_FMT') || 'UTC_24';

            if (document.body.classList.contains('planner-quad-active')) {
                const qData = e.detail.qData;
                const t = e.detail.t;
                let activeBlock = window.getQBlockByTime ? window.getQBlockByTime(t) : null;
                let cCycle = activeBlock ? activeBlock.cycle : 0;
                let qcStr = (activeBlock && activeBlock.type === 'PYLON') ? 
                    `<span style="color:var(--gold, #F4D068);">QC</span> <span style="color:#fff;">${cCycle}</span> <span style="color:var(--gold, #F4D068);">${activeBlock.name}</span>` : 
                    `<span style="color:var(--gold, #F4D068);">QC</span> <span style="color:#fff;">${cCycle}</span> <span style="color:var(--gold, #F4D068);">Q</span><span style="color:#fff;">${qData.quad}</span> <span style="color:var(--gold, #F4D068);">S</span><span style="color:#fff;">${qData.sect}</span> <span style="color:var(--gold, #F4D068);">DAY</span> <span style="color:#fff;">${qData.day}</span>`;
                
                ribbonLegDate.innerHTML = qcStr;
            } else {
                ribbonLegDate.innerText = e.detail.legacyDateStr.toUpperCase();
            }
        }
    });
};

window.toggleTelemetry = function() {
    const isOpen = document.body.classList.toggle('telemetry-open');
    const icon = document.getElementById('tele-icon');
    if(icon) icon.innerHTML = isOpen ? "✖" : `<path d="M18 20V10M12 20V4M6 20v-6"/>`;
    let viewport = document.getElementById('mobile-telemetry-viewport');
    if (isOpen) {
        if (!viewport) { 
            viewport = document.createElement('div'); 
            viewport.id = 'mobile-telemetry-viewport'; 
            document.body.appendChild(viewport); 
        }
        viewport.style.display = 'flex';
        document.querySelectorAll('.telemetry-node').forEach(node => {
            if (!node.classList.contains('q-control-strip') && !node.classList.contains('q-nav-bar') && !node.classList.contains('wing')) {
                viewport.appendChild(node);
            }
        });
    } else {
        if (viewport) { 
            Array.from(viewport.childNodes).forEach(node => document.body.appendChild(node)); 
            viewport.style.display = 'none'; 
        }
    }
    if(window.Q_MobileBridge) window.Q_MobileBridge.pulse('LIGHT');
};

window.syncGeoLocation = async function() {
    if (window.Q_STATE.location.synced) return;
    
    try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 4000);
        
        const res = await fetch('https://ipapi.co/json/', { signal: controller.signal });
        clearTimeout(timeoutId);
        
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();
        
        window.Q_UpdateState('location', 'lat', data.latitude);
        window.Q_UpdateState('location', 'lon', data.longitude);
        
        const geoString = data.city && data.region_code ? `${data.city.toUpperCase()}, ${data.region_code.toUpperCase()}` : 'UNKNOWN';
        window.Q_UpdateState('location', 'name', geoString);
        window.Q_STATE.location.synced = true;
        
        window.Q_LOG('INFO', 'CORE', 'GLOBAL_GEO_SYNCED', { lat: data.latitude, lon: data.longitude, string: geoString });
        
    } catch (e) {
        window.Q_LOG('WARN', 'CORE', 'GLOBAL_GEO_FAILED', { using_fallback: true, error: e.message });
        
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (pos) => {
                    window.Q_UpdateState('location', 'lat', pos.coords.latitude);
                    window.Q_UpdateState('location', 'lon', pos.coords.longitude);
                    const hardGeo = `GPS: ${pos.coords.latitude.toFixed(2)}, ${pos.coords.longitude.toFixed(2)}`;
                    window.Q_UpdateState('location', 'name', hardGeo);
                    window.Q_STATE.location.synced = true;
                    
                    const locInput = document.getElementById('init-loc');
                    if (locInput) {
                        locInput.value = hardGeo;
                        locInput.style.boxShadow = "inset 0 0 15px rgba(0,240,255,0.4)";
                    }
                },
                (err) => { window.Q_LOG('ERROR', 'CORE', 'HARDWARE_GPS_DENIED'); }
            );
        }
    }
};

window.Q_STORAGE_KEY = "Q_DATA_V1";
window.qData = {};

window.loadPlannerData = function() {
    const raw = localStorage.getItem(window.Q_STORAGE_KEY);
    if(raw) window.qData = JSON.parse(raw);
};

window.savePlannerData = function() {
    localStorage.setItem(window.Q_STORAGE_KEY, JSON.stringify(window.qData));
};

window.getDataKey = function(date, h, m) {
    const y = date.getFullYear();
    const mo = (date.getMonth()+1).toString().padStart(2,'0');
    const d = date.getDate().toString().padStart(2,'0');
    const hh = h.toString().padStart(2,'0');
    const mm = m.toString().padStart(2,'0');
    return `${y}-${mo}-${d}-${hh}-${mm}`;
};

window.hasDataInMinute = function(date, h, m) {
    const key = window.getDataKey(date, h, m);
    const entry = window.qData[key];
    return entry && (entry.text.trim() !== "" || entry.link.trim() !== "");
};

window.hasDataInHour = function(date, h) {
    for(let m=0; m<60; m+=5) { if(window.hasDataInMinute(date, h, m)) return true; }
    return false;
};

window.hasDataInDay = function(date) {
    for(let h=0; h<24; h++) { if(window.hasDataInHour(date, h)) return true; }
    return false;
};

window.exportCivilLedger = function() {
    window.Q_LOG('INFO', 'CORE', 'CIVIL_LEDGER_EXPORT_INITIATED', { format: 'Standardized Interval Formatting' });
    const rawData = localStorage.getItem(window.Q_STORAGE_KEY);
    return rawData ? JSON.parse(rawData) : {};
};

window.Q_LOG = function(level, vector, event, data = {}) {
    const timestamp = Date.now();
    const entry = { ts: timestamp, level, vector, event, data };
    const colors = { INFO: '#00f0ff', WARN: '#F4D068', ERROR: '#ff2d78', STATE: '#39ff14' };
    console.log(`%c[Q-${level}] [${vector}] ${event}`, `color:${colors[level] || '#fff'}; font-family:'JetBrains Mono', monospace; font-weight:bold;`, data);
    if (!window.Q_EVENT_BUFFER) window.Q_EVENT_BUFFER = [];
    window.Q_EVENT_BUFFER.push(entry);
    if (window.Q_EVENT_BUFFER.length > 500) window.Q_EVENT_BUFFER.shift();
    try { localStorage.setItem('Q_TELEMETRY_LOG', JSON.stringify(window.Q_EVENT_BUFFER)); } catch(e) { }
};

(function loadPersistence() {
    try {
        const saved = localStorage.getItem('Q_TELEMETRY_LOG');
        if (saved) window.Q_EVENT_BUFFER = JSON.parse(saved);
    } catch (e) {}
})();

window.calculatePylonAlpha = async function() {
    try {
        const absoluteEpochMs = new Date(Date.UTC(2025, 11, 21, 15, 3, 0)).getTime();
        window.PYLON_ALPHA_DYNAMIC = absoluteEpochMs;
        window.Q_LOG('STATE', 'CORE', 'PYLON_ALPHA_ANCHORED', { year: 2025, timestamp: window.PYLON_ALPHA_DYNAMIC, dynamic: false });
    } catch (err) {
        window.Q_LOG('ERROR', 'CORE', 'ALPHA_ANCHOR_FAILED', { error: err.message });
        window.PYLON_ALPHA_DYNAMIC = new Date(Date.UTC(2025, 11, 21, 15, 3, 0)).getTime(); 
    }
    return window.PYLON_ALPHA_DYNAMIC;
};

window.fetchJPLTelemetry = async function() {
    try {
        const tDate = new Date();
        const eDate = new Date(tDate.getTime() + window.MS_DAY);
        const fmt = (d) => `${d.getUTCFullYear()}-${(d.getUTCMonth()+1).toString().padStart(2,'0')}-${d.getUTCDate().toString().padStart(2,'0')}`;
        
        const startStr = fmt(tDate);
        const stopStr = fmt(eDate);

        const response = await fetch(`https://ssd.jpl.nasa.gov/api/horizons.api?format=json&COMMAND=%27399%27&OBJ_DATA=%27YES%27&MAKE_EPHEM=%27YES%27&EPHEM_TYPE=%27OBSERVER%27&CENTER=%27500@10%27&START_TIME=%27${startStr}%27&STOP_TIME=%27${stopStr}%27&STEP_SIZE=%271%20d%27&QUANTITIES=%2718%27`);
        if (!response.ok) throw new Error('Telemetry endpoint unreachable or rate-limited.');
        const data = await response.json();
        
        if (data && data.result) {
            window.EPHEMERIS_LIVE = true;
            window.Q_LOG('INFO', 'CORE', 'JPL_TELEMETRY_SYNCED', { source: 'NASA JPL HORIZONS', window: `${startStr} to ${stopStr}` });
        } else {
            throw new Error("Invalid telemetry payload.");
        }
    } catch (err) {
        window.EPHEMERIS_LIVE = false;
        window.Q_LOG('WARN', 'CORE', 'JPL_DESYNC_DETECTED', { error: err.message, action: 'ENGAGING_KEPLERIAN_FAILOVER' });
    }
};

window.getOrbitalData = function(daysElapsed) {
    const meanVelocity = 360 / 365.24219;
    let meanArc = (daysElapsed * meanVelocity) % 360;
    if (meanArc < 0) meanArc += 360;

    const meanAnomaly = (daysElapsed / 365.24219) * Math.PI * 2;
    const e = 0.0167; 
    const trueAnomaly = meanAnomaly + (2 * e * Math.sin(meanAnomaly)) + (1.25 * e * e * Math.sin(2 * meanAnomaly));
    let trueArc = (trueAnomaly * (180 / Math.PI)) % 360;
    if (trueArc < 0) trueArc += 360;

    let delta = trueArc - meanArc;
    if (delta > 180) delta -= 360;
    if (delta < -180) delta += 360;

    let cycleDays = daysElapsed % 365.24219;
    if (cycleDays < 0) cycleDays += 365.24219;

    let quad = Math.floor(meanArc / 90) + 1; if(quad > 4) quad = 4;
    let sect = Math.floor((meanArc % 90) / 30) + 1; if(sect > 3) sect = 3;
    let day = Math.floor(cycleDays % 30) + 1; 

    const absoluteTime = window.PYLON_ALPHA_DYNAMIC ? window.PYLON_ALPHA_DYNAMIC + (daysElapsed * window.MS_DAY) : Date.now();
    if (window.getQBlockByTime) {
        let activeBlock = window.getQBlockByTime(absoluteTime);
        if (activeBlock) {
            quad = activeBlock.quad || quad;
            sect = activeBlock.sect || sect;
            day = activeBlock.day || day;
            
            if (activeBlock.type === 'PYLON') {
                let progress = (absoluteTime - activeBlock.absoluteStart) / activeBlock.dur;
                delta = delta * (1 - progress);
                trueArc = (meanArc + delta) % 360;
                if (trueArc < 0) trueArc += 360;
            }
        }
    }

    const lunarDaysElapsed = daysElapsed + 1.555; 
    let lunarPhase = (lunarDaysElapsed % 29.530588) / 29.530588;
    if (lunarPhase < 0) lunarPhase += 1;
    let lunarArc = lunarPhase * 360;

    const currentYear = new Date(absoluteTime).getUTCFullYear();
    const metonicYear = (currentYear % 19) + 1;

    window.CURRENT_MEAN_ARC = meanArc;
    window.CURRENT_TRUE_ARC = trueArc;
    window.Q_DELTA = delta;

    return { meanArc, trueArc, delta, quad, sect, day, lunarPhase, lunarArc, metonicYear };
};

// INITIALIZATION SEQUENCE
window.addEventListener('DOMContentLoaded', async () => {
    window.injectUniversalUI();
    if (window.Q_Onboarding) window.Q_Onboarding.check(); 
    window.loadPlannerData(); 
    
    await window.initCloudBridge();
    
    // Check if returning from a Magic Link redirect
    if (window.Q_Auth && window.Q_Auth.handleAuthRedirect) {
        await window.Q_Auth.handleAuthRedirect();
    }
    
    await window.fetchCloudState();
    await window.calculatePylonAlpha();

    if (window.Q_KairosVoice) window.Q_KairosVoice.init(); 
    if (window.Q_MasterLoop) window.Q_MasterLoop.start(); 
    window.Q_LOG('INFO', 'CORE', 'ZERO_REDUNDANCY_ENGINE_INITIALIZED', { status: 'LEXICON_ENFORCED' });

    window.fetchJPLTelemetry().finally(() => {
        setInterval(window.fetchJPLTelemetry, 300000);
    });

    // MOBILE DATA POPULATION SYNC
    setTimeout(() => {
        if (window.innerWidth <= 768 && window.PYLON_ALPHA_DYNAMIC) {
            const state = window.getSimState ? window.getSimState() : { simTime: Date.now(), isLive: true };
            const oData = window.getOrbitalData((state.simTime - window.PYLON_ALPHA_DYNAMIC)/86400000);
            const initFmt = window.formatLegacyDate(state.simTime);
            window.dispatchEvent(new CustomEvent('q-tick', { detail: { 
                t: state.simTime, 
                isLive: state.isLive,
                qData: oData, 
                legacyDateStr: initFmt.dateStr, 
                legacyTimeStr: initFmt.timeStr,
                activePostulate: "HERE AND NOW ARE INFINITELY ONE!"
            } }));
        }
    }, 1000);
});