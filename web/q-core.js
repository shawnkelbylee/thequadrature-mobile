// THE QUADRATURE: MASTER CORE LOGIC (ZERO-REDUNDANCY ENGINE)
// Architect: Kelby | Engineer: Kairos
// STATUS: Active. Sovereign Handshake, Safe-Harbor Auth Routing & Session Memory Rerouting Integrated.

window.MS_DAY = 86400000;

// --- ASYMMETRICAL GEAR CONSTANTS ---
window.Q_GEAR_CONSTANTS = {
    ALPHA: 86400000,    // 24.0h
    BETA: 84600000,     // 23.5h
    GAMMA: 89662680,    // 24.9063h
    DELTA: 102599640,   // 28.4999h
    EPSILON: 89662680   // 24.9063h
};

// --- GLOBAL UNIVERSAL EVENT REGISTRY (EXACT 2026 METROLOGY) ---
window.Q_REGISTRY = {
    REL_DB: {
        jud: [ 
            { name: "Purim", coord: 70.9, type: 'node-jud', glyph: '✡', durationDays: 1 }, 
            { name: "Passover (Pesach)", coord: 98.44, type: 'node-jud', glyph: '✡', durationDays: 8 }, 
            { name: "Shavuot", coord: 161.8, type: 'node-jud', glyph: '✡', durationDays: 2 }, 
            { name: "Rosh Hashanah", coord: 259.10, type: 'node-jud', glyph: '✡', durationDays: 2 }, 
            { name: "Yom Kippur", coord: 270.0, type: 'node-jud', glyph: '✡', durationDays: 1 }, 
            { name: "Hanukkah", coord: 344.0, type: 'node-jud', glyph: '✡', durationDays: 8 } 
        ],
        chr: [ 
            { name: "Ash Wednesday", coord: 58.1, type: 'node-chr', glyph: '✝', durationDays: 1 }, 
            { name: "Easter", coord: 102.38, type: 'node-chr', glyph: '✝', durationDays: 1 }, 
            { name: "Pentecost", coord: 153.8, type: 'node-chr', glyph: '✝', durationDays: 1 }, 
            { name: "Christmas", coord: 3.9, type: 'node-chr', glyph: '✝', durationDays: 1 } 
        ],
        hin: [ 
            { name: "Holi", coord: 70.9, type: 'node-hin', glyph: 'ॐ', durationDays: 1 }, 
            { name: "Diwali", coord: 317.3, type: 'node-hin', glyph: 'ॐ', durationDays: 5 } 
        ],
        bud: [ 
            { name: "Vesak", coord: 129.1, type: 'node-bud', glyph: '☸', durationDays: 1 }, 
            { name: "Bodhi Day", coord: 346.9, type: 'node-bud', glyph: '☸', durationDays: 1 } 
        ],
        tao: [ 
            { name: "Qingming", coord: 103.5, type: 'node-tao', glyph: '☯', durationDays: 1 }, 
            { name: "Ghost Festival", coord: 245.4, type: 'node-tao', glyph: '☯', durationDays: 1 } 
        ]
    },
    SOLAR_TERMS: [
        { name: "Winter Solstice", start: 0, theme: "Rest and deepest reflection." }, { name: "Minor Cold", start: 15, theme: "Preparation for harsh conditions." }, { name: "Major Cold", start: 30, theme: "Endurance and inner warmth." }, 
        { name: "Spring Begins", start: 45, theme: "First stirring of new intent." }, { name: "Rain Water", start: 60, theme: "Nourishing early concepts." }, { name: "Insects Awaken", start: 75, theme: "Sudden activity and emergence." },
        { name: "Vernal Equinox", start: 90, theme: "Perfect balance. The Initiator." }, { name: "Clear & Bright", start: 105, theme: "Clarity of vision and purification." }, { name: "Grain Rain", start: 120, theme: "Rapid growth requiring sustenance." }, 
        { name: "Summer Begins", start: 135, theme: "Commitment to outward expansion." }, { name: "Grain Buds", start: 150, theme: "Early signs of maturation." }, { name: "Grain in Ear", start: 165, theme: "Intense labor labor the peak." },
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
    ],
    CIV_LEDGER: [
        { name: "New Year", month: 0, day: 1, type: 'node-civ', glyph: '🏛', durationDays: 1 },
        { name: "Valentine's Day", month: 1, day: 14, type: 'node-hol', glyph: '💝', durationDays: 1 },
        { name: "St. Patrick's Day", month: 2, day: 17, type: 'node-hol', glyph: '☘', durationDays: 1 },
        { name: "Earth Day", month: 3, day: 22, type: 'node-hol', glyph: '🌍', durationDays: 1 },
        { name: "Cinco de Mayo", month: 4, day: 5, type: 'node-hol', glyph: '🌮', durationDays: 1 },
        { name: "Independence Day", month: 6, day: 4, type: 'node-civ', glyph: '✦', durationDays: 1 },
        { name: "Halloween", month: 9, day: 31, type: 'node-hol', glyph: '🎃', durationDays: 1 },
        { name: "Veterans Day", month: 10, day: 11, type: 'node-civ', glyph: '⚒', durationDays: 1 }
    ]
};

// --- EPHEMERIS BRIDGE ---
window.Q_ACTIVE_EPHEMERIS = null;
window.Q_EphemerisBridge = {
    offlineMode: localStorage.getItem('Q_EPHEMERIS_OFFLINE') === 'true',
    
    syncYear: async function(year) {
        if (window.Q_ACTIVE_EPHEMERIS && window.Q_ACTIVE_EPHEMERIS.year === year) return;

        if (this.offlineMode) {
            window.Q_LOG('INFO', 'PHYSICS', 'SOVEREIGN_EPHEMERIS_ACTIVE', { year, status: 'INDEXED_DB_HOOK_PENDING' });
            return;
        }

        if (!window.supabaseClient) return;

        try {
            const { data, error } = await window.supabaseClient.functions.invoke('q-ephemeris', {
                body: { year: year }
            });
            
            if (error) throw error;
            if (data && data.holidays) {
                window.Q_ACTIVE_EPHEMERIS = { year: year, data: data.holidays };
                window.Q_LOG('STATE', 'PHYSICS', 'CLOUD_EPHEMERIS_SYNCED', { year });
                window.dispatchEvent(new CustomEvent('q-ephemeris-updated', { detail: { year } }));
            }
        } catch (err) {
            window.Q_LOG('WARN', 'PHYSICS', 'EPHEMERIS_SYNC_FAILED', { error: err.message, fallback: 'STATIC_REGISTRY' });
        }
    },
    
    toggleOfflineMode: function(enabled) {
        this.offlineMode = enabled;
        localStorage.setItem('Q_EPHEMERIS_OFFLINE', enabled ? 'true' : 'false');
        window.Q_LOG('STATE', 'PHYSICS', enabled ? 'SOVEREIGN_EPHEMERIS_ENGAGED' : 'CLOUD_EPHEMERIS_ENGAGED');
    }
};

// GLOBAL HOLIDAY COORDINATE RESOLVER
window.getGlobalHolidays = function(year) {
    if (!window.PYLON_ALPHA_DYNAMIC) return [];
    let list = [];
    
    window.Q_REGISTRY.CIV_LEDGER.forEach(ev => {
        let ts = Date.UTC(year, ev.month, ev.day, 12, 0, 0);
        let days = (ts - window.PYLON_ALPHA_DYNAMIC) / window.MS_DAY;
        list.push({ ...ev, coord: window.getOrbitalData(days).meanArc, durationDays: ev.durationDays || 1 });
    });
    
    if (window.Q_ACTIVE_EPHEMERIS && window.Q_ACTIVE_EPHEMERIS.year === year) {
        list = list.concat(window.Q_ACTIVE_EPHEMERIS.data);
    } else {
        Object.keys(window.Q_REGISTRY.REL_DB).forEach(k => {
            window.Q_REGISTRY.REL_DB[k].forEach(ev => {
                list.push({ ...ev, durationDays: ev.durationDays || 1 });
            });
        });
    }
    
    window.Q_REGISTRY.PYLONS.forEach(ev => list.push({ ...ev, durationDays: 1 }));
    return list;
};

// --- GLOBAL LEXICON ---
window.Q_LEXICON = {
    CIVIL: "Mean Circle",
    PHYSICS: "True Ellipse",
    INTERFACE: "The Quadrature HUD",
    SYSTEM: "Q Logic"
};

// --- SUPABASE CLOUD BRIDGE & HYDRATION PROTOCOL ---
window.Q_SUPABASE_URL = 'https://wnfpxozpeucrwqmrqpzv.supabase.co';
window.Q_SUPABASE_KEY = 'sb_publishable_g6JfCH6FefIwEmXztgkdTw_Md1z4se5';
window.supabaseClient = null;

window.initCloudBridge = async function() {
    return new Promise((resolve) => {
        if (window.supabase) {
            window.supabaseClient = window.supabase.createClient(window.Q_SUPABASE_URL, window.Q_SUPABASE_KEY);
            window.bindAuthListener();
            resolve();
            return;
        }
        const script = document.createElement('script');
        script.src = "https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2";
        script.onload = () => {
            window.supabaseClient = window.supabase.createClient(window.Q_SUPABASE_URL, window.Q_SUPABASE_KEY);
            window.bindAuthListener();
            window.Q_LOG('INFO', 'CORE', 'SUPABASE_CLIENT_INITIALIZED');
            resolve();
        };
        document.head.appendChild(script);
    });
};

window.bindAuthListener = function() {
    if(!window.supabaseClient) return;
    window.supabaseClient.auth.onAuthStateChange((event, session) => {
        if (event === 'SIGNED_IN' || (event === 'INITIAL_SESSION' && session)) {
            localStorage.setItem('Q_SOVEREIGN_AUTH', 'true');
        } else if (event === 'SIGNED_OUT') {
            localStorage.setItem('Q_SOVEREIGN_AUTH', 'false');
            window.Q_STATE.persistence.auth_status = 'STANDBY';
        }
    });
};

window.Q_UpdateStateLocal = function(category, key, value, localStoreKey) {
    if(window.Q_STATE[category]) window.Q_STATE[category][key] = value;
    if(localStoreKey) localStorage.setItem(localStoreKey, value);
    if (window.ReactNativeWebView) {
        window.ReactNativeWebView.postMessage(JSON.stringify({ action: 'SECURE_STORE_SET', key: localStoreKey || `q_${key}`, value: value }));
    }
};

window.fetchCloudState = async function() {
    if (!window.supabaseClient) return;
    
    const { data: session } = await window.supabaseClient.auth.getSession();
    if (!session?.session?.user) {
        window.Q_LOG('WARN', 'CORE', 'CLOUD_SYNC_ABORTED: No Active Supabase Auth Session.');
        return; 
    }

    try {
        const { data: stateData, error: stateErr } = await window.supabaseClient
            .from('system_state')
            .select('*')
            .eq('user_id', session.session.user.id)
            .single();

        const { data: idData, error: idErr } = await window.supabaseClient
            .from('sovereign_identity')
            .select('*')
            .eq('user_id', session.session.user.id)
            .single();

        if (stateErr && stateErr.code !== 'PGRST116') throw stateErr;
        if (idErr && idErr.code !== 'PGRST116') throw idErr;
        
        if (stateData) {
            if (stateData.q_time_fmt) {
                window.Q_UpdateStateLocal('system_state', 'q_time_fmt', stateData.q_time_fmt, 'Q_TIME_FMT');
                document.querySelectorAll('.fmt-toggle').forEach(btn => { btn.innerText = stateData.q_time_fmt.replace('_', ' '); });
            }
            if (stateData.preferred_ai_diplomat) window.Q_UpdateStateLocal('logic_layer', 'preferred_ai_diplomat', stateData.preferred_ai_diplomat, 'q_ai_diplomat');
            if (stateData.asset_track_mode) window.Q_UpdateStateLocal('system_state', 'asset_track_mode', stateData.asset_track_mode, 'q_asset_mode');
            if (stateData.active_faiths) window.Q_UpdateStateLocal('metaphysical_layer', 'active_faiths', stateData.active_faiths, 'q_active_faiths');
            if (stateData.zodiac_visible !== null) window.Q_UpdateStateLocal('metaphysical_layer', 'zodiac_visible', stateData.zodiac_visible, 'q_zodiac_visible');
            if (stateData.deep_flow_enforcement !== null) window.Q_UpdateStateLocal('logic_layer', 'deep_flow_enforcement', stateData.deep_flow_enforcement, 'q_deep_flow_enforcement');
        }

        if (idData) {
            if (idData.dob) window.Q_UpdateStateLocal('metaphysical_layer', 'dob', idData.dob, 'q_dob');
            if (idData.tob) window.Q_UpdateStateLocal('metaphysical_layer', 'tob', idData.tob, 'q_tob');
            if (idData.tob_unknown !== null) window.Q_UpdateStateLocal('metaphysical_layer', 'tob_unknown', idData.tob_unknown, 'q_tob_unknown');
            if (idData.location_name) window.Q_UpdateStateLocal('location', 'name', idData.location_name, 'q_current_loc_name');
            if (idData.lat) window.Q_UpdateStateLocal('location', 'lat', idData.lat, 'q_current_lat');
            if (idData.lon) window.Q_UpdateStateLocal('location', 'lon', idData.lon, 'q_current_lon');
            if (idData.wake_anchor_mins !== null) window.Q_UpdateStateLocal('metaphysical_layer', 'wake_anchor_mins', idData.wake_anchor_mins, 'q_bio_anchor');
            if (idData.sleep_cycle_duration !== null) window.Q_UpdateStateLocal('metaphysical_layer', 'sleep_cycle_duration', idData.sleep_cycle_duration, 'q_sleep_cycle_duration');
            if (idData.sleep_inertia_mins !== null) window.Q_UpdateStateLocal('metaphysical_layer', 'sleep_inertia_mins', idData.sleep_inertia_mins, 'q_sleep_inertia_mins');
            if (idData.dlmo_offset_mins !== null) window.Q_UpdateStateLocal('metaphysical_layer', 'dlmo_offset_mins', idData.dlmo_offset_mins, 'q_dlmo_offset_mins');
            if (idData.natal_anchor) window.Q_UpdateStateLocal('metaphysical_layer', 'natal_anchor', idData.natal_anchor, 'q_natal_anchor');
            if (idData.fiat_routing_id) window.Q_UpdateStateLocal('capital_ledger', 'fiat_routing_id', idData.fiat_routing_id, 'q_fiat_routing_id');
        }

        window.Q_LOG('STATE', 'CORE', 'CLOUD_STATE_HYDRATED');
    } catch (err) {
        window.Q_LOG('ERROR', 'CORE', 'CLOUD_STATE_FETCH_FAILED', { error: err.message });
    }
};

// CENTRALIZED STATE MANAGEMENT
window.Q_STATE = {
    persistence: { 
        db_migration: 'ACTIVE', 
        auth_status: localStorage.getItem('Q_SOVEREIGN_AUTH') === 'true' ? 'SOVEREIGN_AUTHENTICATED' : 'STANDBY', 
        sync_active: false 
    },
    logic_layer: { 
        predictive_friction: true, 
        civil_exporter: 'ACTIVE',
        preferred_ai_diplomat: localStorage.getItem('q_ai_diplomat') || 'DEFAULT',
        deep_flow_enforcement: localStorage.getItem('q_deep_flow_enforcement') !== 'false'
    },
    hardware_hooks: { biometric_api: 'ACTIVE', iot_webhooks: 'ACTIVE' },
    capital_ledger: { 
        fiat_api: 'STANDBY', 
        resonance_tracker: 'ACTIVE',
        fiat_routing_id: localStorage.getItem('q_fiat_routing_id') || null
    },
    metaphysical_layer: { 
        swiss_ephemeris: 'ACTIVE', 
        patreon_gating: 'STANDBY', 
        access_tier: 0,
        natal_anchor: localStorage.getItem('q_natal_anchor') || 'NONE',
        dob: localStorage.getItem('q_dob') || null,
        tob: localStorage.getItem('q_tob') || '12:00',
        tob_unknown: localStorage.getItem('q_tob_unknown') === 'true',
        wake_anchor_mins: parseInt(localStorage.getItem('q_bio_anchor')) || null,
        sleep_cycle_duration: parseInt(localStorage.getItem('q_sleep_cycle_duration')) || null,
        sleep_inertia_mins: parseInt(localStorage.getItem('q_sleep_inertia_mins')) || null,
        dlmo_offset_mins: parseInt(localStorage.getItem('q_dlmo_offset_mins')) || null,
        active_faiths: localStorage.getItem('q_active_faiths') ? JSON.parse(localStorage.getItem('q_active_faiths')) : [],
        zodiac_visible: localStorage.getItem('q_zodiac_visible') !== 'false'
    },
    location: { 
        lat: parseFloat(localStorage.getItem('q_current_lat')) || 0, 
        lon: parseFloat(localStorage.getItem('q_current_lon')) || 0, 
        name: localStorage.getItem('q_current_loc_name') || 'UNKNOWN', 
        synced: false 
    },
    system_state: {
        q_time_fmt: localStorage.getItem('Q_TIME_FMT') || 'UTC_24',
        asset_track_mode: localStorage.getItem('q_asset_mode') || 'STANDARD'
    }
};

window.Q_UpdateState = async function(category, key, value) {
    if(window.Q_STATE[category]) {
        window.Q_STATE[category][key] = value;
    }

    const localMap = {
        'lat': 'q_current_lat', 'lon': 'q_current_lon', 'name': 'q_current_loc_name',
        'natal_anchor': 'q_natal_anchor', 'dob': 'q_dob', 'tob': 'q_tob', 'tob_unknown': 'q_tob_unknown',
        'wake_anchor_mins': 'q_bio_anchor', 'sleep_cycle_duration': 'q_sleep_cycle_duration',
        'sleep_inertia_mins': 'q_sleep_inertia_mins', 'dlmo_offset_mins': 'q_dlmo_offset_mins',
        'fiat_routing_id': 'q_fiat_routing_id', 'q_time_fmt': 'Q_TIME_FMT', 'preferred_ai_diplomat': 'q_ai_diplomat',
        'asset_track_mode': 'q_asset_mode', 'active_faiths': 'q_active_faiths', 'zodiac_visible': 'q_zodiac_visible',
        'deep_flow_enforcement': 'q_deep_flow_enforcement'
    };

    const localKey = localMap[key] || `q_${key}`;
    const stringValue = typeof value === 'object' ? JSON.stringify(value) : value;
    
    localStorage.setItem(localKey, stringValue);

    if (window.ReactNativeWebView) {
        window.ReactNativeWebView.postMessage(JSON.stringify({ action: 'SECURE_STORE_SET', key: localKey, value: stringValue }));
    }

    if (window.supabaseClient) {
        const { data: session } = await window.supabaseClient.auth.getSession();
        if (session?.session?.user) {
            try {
                const identityKeys = ['dob', 'tob', 'tob_unknown', 'location_name', 'lat', 'lon', 'wake_anchor_mins', 'sleep_cycle_duration', 'sleep_inertia_mins', 'dlmo_offset_mins', 'natal_anchor', 'fiat_routing_id'];
                const stateKeys = ['q_time_fmt', 'preferred_ai_diplomat', 'asset_track_mode', 'active_faiths', 'zodiac_visible', 'deep_flow_enforcement'];
                
                let targetTable = null;
                let payload = { user_id: session.session.user.id };

                if (identityKeys.includes(key) || key === 'name') {
                    targetTable = 'sovereign_identity';
                    let dbKey = key === 'name' ? 'location_name' : key;
                    payload[dbKey] = value;
                } else if (stateKeys.includes(key)) {
                    targetTable = 'system_state';
                    payload[key] = value;
                }

                if (targetTable) {
                    const { error } = await window.supabaseClient.from(targetTable).upsert(payload, { onConflict: 'user_id' });
                    if (error) throw error;
                    window.Q_LOG('INFO', 'CORE', 'STATE_SYNCED_TO_CLOUD', { table: targetTable, key, value });
                }
            } catch (err) {
                window.Q_LOG('ERROR', 'CORE', 'CLOUD_SYNC_FAILED', { error: err.message });
            }
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

// --- NATIVE BIOMETRIC OVERRIDE HIERARCHY ---
window.Q_LATEST_NATIVE_BIO_DURATION = null;
window.Q_LATEST_NATIVE_WAKE_ANCHOR = null;
window.Q_LATEST_NATIVE_INERTIA = null;
window.Q_LATEST_NATIVE_DLMO = null;

window.getActiveCycleDuration = function() {
    if (window.Q_STATE.hardware_hooks.biometric_api === 'ACTIVE' && window.Q_LATEST_NATIVE_BIO_DURATION) {
        return window.Q_LATEST_NATIVE_BIO_DURATION;
    }
    return window.Q_STATE.metaphysical_layer.sleep_cycle_duration || parseInt(localStorage.getItem('q_sleep_cycle_duration')) || 450; 
};

window.getActiveWakeAnchor = function() {
    if (window.Q_STATE.hardware_hooks.biometric_api === 'ACTIVE' && window.Q_LATEST_NATIVE_WAKE_ANCHOR !== null) {
        return window.Q_LATEST_NATIVE_WAKE_ANCHOR;
    }
    return window.Q_STATE.metaphysical_layer.wake_anchor_mins !== null ? window.Q_STATE.metaphysical_layer.wake_anchor_mins : (parseInt(localStorage.getItem('q_bio_anchor')) || 0);
};

window.getActiveSleepInertia = function() {
    if (window.Q_STATE.hardware_hooks.biometric_api === 'ACTIVE' && window.Q_LATEST_NATIVE_INERTIA !== null) {
        return window.Q_LATEST_NATIVE_INERTIA;
    }
    let val = window.Q_STATE.metaphysical_layer.sleep_inertia_mins;
    return val !== null && !isNaN(val) ? val : (parseInt(localStorage.getItem('q_sleep_inertia_mins')) || 45);
};

window.getActiveDLMO = function() {
    if (window.Q_STATE.hardware_hooks.biometric_api === 'ACTIVE' && window.Q_LATEST_NATIVE_DLMO !== null) {
        return window.Q_LATEST_NATIVE_DLMO;
    }
    let val = window.Q_STATE.metaphysical_layer.dlmo_offset_mins;
    return val !== null && !isNaN(val) ? val : (parseInt(localStorage.getItem('q_dlmo_offset_mins')) || 90);
};

window.getBiologicalState = function(t) {
    let anchorMins = window.getActiveWakeAnchor();
    let cycleDuration = window.getActiveCycleDuration();
    let activeMs = ((t % 86400000) - (anchorMins * 60000) + 86400000) % 86400000;
    let minsSinceWake = Math.floor(activeMs / 60000);
    
    let sleepDuration = window.Q_STATE.metaphysical_layer.sleep_cycle_duration || 450;
    let wakingDurationMins = 1440 - sleepDuration;
    let inertiaMins = window.getActiveSleepInertia();
    let dlmoMins = window.getActiveDLMO();
    
    if (minsSinceWake >= wakingDurationMins) return "SLEEP / RECOVERY";
    if (minsSinceWake < inertiaMins) return "SLEEP INERTIA";
    if (minsSinceWake >= wakingDurationMins - dlmoMins) return "DLMO WIND-DOWN";
    
    let coreMins = minsSinceWake - inertiaMins;
    let cyclePosFloat = (coreMins % cycleDuration) / cycleDuration;
    return (cyclePosFloat < 0.77) ? "DEEP FLOW" : "VENT/RECOVERY";
};

// --- UNIVERSAL PAYLOAD SYNC & ICS INGESTION (TASK 12) ---
window.Q_UniversalSync = {
    ingestICS: function(icsData) {
        window.Q_LOG('INFO', 'CORE', 'ICS_PAYLOAD_INGESTION_STARTED');
        const lines = icsData.split(/\r\n|\n|\r/);
        let inEvent = false;
        let currentEvent = {};
        let eventCount = 0;

        for (let i = 0; i < lines.length; i++) {
            const line = lines[i];
            if (line.startsWith('BEGIN:VEVENT')) {
                inEvent = true;
                currentEvent = {};
            } else if (line.startsWith('END:VEVENT')) {
                inEvent = false;
                if (currentEvent.start && currentEvent.summary) {
                    this.mapEventToPlanner(currentEvent);
                    eventCount++;
                }
            } else if (inEvent) {
                if (line.startsWith('DTSTART')) {
                    currentEvent.start = this.parseICSDate(line);
                } else if (line.startsWith('DTEND')) {
                    currentEvent.end = this.parseICSDate(line);
                } else if (line.startsWith('SUMMARY:')) {
                    currentEvent.summary = line.substring(8);
                }
            }
        }
        
        window.savePlannerData();
        window.dispatchEvent(new Event('storage'));
        window.Q_LOG('STATE', 'CORE', 'ICS_PAYLOAD_SYNCED', { events_processed: eventCount });
        return eventCount;
    },
    parseICSDate: function(line) {
        const parts = line.split(':');
        if (parts.length < 2) return null;
        const dateStr = parts[1];
        if (dateStr.length < 15) return null;
        
        const y = parseInt(dateStr.substring(0,4));
        const m = parseInt(dateStr.substring(4,6)) - 1;
        const d = parseInt(dateStr.substring(6,8));
        const h = parseInt(dateStr.substring(9,11));
        const min = parseInt(dateStr.substring(11,13));
        
        if (dateStr.endsWith('Z')) {
            return new Date(Date.UTC(y, m, d, h, min));
        } else {
            return new Date(y, m, d, h, min);
        }
    },
    mapEventToPlanner: function(ev) {
        if (!window.qData) window.qData = {};
        if (!window.getDataKey) return;
        
        const key = window.getDataKey(ev.start, ev.start.getHours(), ev.start.getMinutes());
        if (!window.qData[key]) window.qData[key] = { text: "", link: "" };
        
        const prefix = "[FIXED]";
        if (!window.qData[key].text.includes(ev.summary)) {
            let existing = window.qData[key].text;
            window.qData[key].text = existing ? `${existing}\n${prefix} ${ev.summary}` : `${prefix} ${ev.summary}`;
        }
    },
    routeBiometricAuth: function(provider) {
        window.Q_LOG('INFO', 'CAPITAL', `ROUTING_BIOMETRIC_OAUTH_${provider.toUpperCase()}`);
        if (window.ReactNativeWebView) {
            window.ReactNativeWebView.postMessage(JSON.stringify({ 
                action: 'INITIATE_EXTERNAL_OAUTH', 
                provider: provider 
            }));
        } else {
            alert(`[ UNIVERSAL PAYLOAD SYNC ]\nRouting to ${provider} API gateway for hardware authorization...`);
            window.Q_UpdateState('hardware_hooks', `${provider}_synced`, 'ACTIVE');
        }
    }
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
    },
    invokeQuadState: function(isActive) {
        if (window.ReactNativeWebView) {
            window.ReactNativeWebView.postMessage(JSON.stringify({ 
                action: 'SET_QUAD_STATE', 
                blackout_notifications: isActive,
                app_lock: isActive 
            }));
        }
        window.Q_LOG('STATE', 'HARDWARE', isActive ? 'IN_THE_QUAD_PROTOCOL_ENGAGED' : 'IN_THE_QUAD_PROTOCOL_DISENGAGED', { blackout: isActive, app_lock: isActive });
    }
};
window.Q_MobileBridge.init();

// --- IN THE QUAD PROTOCOL: DEEP FLOW MONITOR ---
window.Q_DeepFlowMonitor = {
    lastState: null,
    lastEnforcementState: null,
    check: function(t) {
        const currentState = window.getBiologicalState(t);
        const enforcementActive = window.Q_STATE.logic_layer.deep_flow_enforcement;
        
        const stateChanged = currentState !== this.lastState;
        const enforcementChanged = enforcementActive !== this.lastEnforcementState;

        if (stateChanged || enforcementChanged) {
            if (currentState === "DEEP FLOW" && enforcementActive) {
                window.Q_MobileBridge.invokeQuadState(true);
            } else {
                window.Q_MobileBridge.invokeQuadState(false);
            }
            this.lastState = currentState;
            this.lastEnforcementState = enforcementActive;
        }
    }
};

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
        const currentVersion = "16.1.1"; 
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
                
                <label style="font-size:0.65rem; color:#fff; font-weight:bold;">WAKE ANCHOR (LOCAL WAKE TIME)</label>
                <input type="time" id="init-anchor" style="width:100%; background:rgba(0,0,0,0.8); border:1px solid #00f0ff; color:#00f0ff; padding:10px; margin-top:4px; margin-bottom:25px; font-family:'JetBrains Mono'; box-sizing:border-box; outline:none;">
                
                <button onclick="window.Q_Onboarding.save()" style="width:100%; background:#00f0ff; color:#000; border:none; padding:12px; font-family:'Orbitron'; font-weight:900; cursor:pointer; letter-spacing:3px; box-shadow:0 0 20px #00f0ff; transition: 0.3s;">INITIALIZE</button>
            </div>
        `;
        document.body.appendChild(overlay);

        if (window.syncGeoLocation) {
            window.syncGeoLocation().then(() => {
                const locInput = document.getElementById('init-loc');
                if (locInput && window.Q_STATE.location.synced && window.Q_STATE.location.name !== 'UNKNOWN') {
                    locInput.value = window.Q_STATE.location.name;
                    locInput.style.boxShadow = "inset 0 0 15px rgba(0,240,255,0.4)";
                    setTimeout(() => { locInput.style.boxShadow = "none"; }, 1000);
                }
            });
        }
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

// --- SOVEREIGN AUTHENTICATION (MAGIC LINK & OAUTH) ---
window.Q_Auth = {
    getRedirectVector: function() {
        // ALWAYS fallback to the explicit safe harbor to pass the firewall
        const origin = window.location.origin;
        return `${origin}/personal/index.html`;
    },
    triggerOAuthProvider: async function(provider) {
        if (!window.supabaseClient) {
            alert("CLOUD BRIDGE DISCONNECTED. AWAITING SUPABASE INIT.");
            return;
        }
        
        // Cache the user's active screen so we can route them back after Supabase drops them off
        sessionStorage.setItem('Q_AUTH_RETURN_VECTOR', window.location.pathname);
        
        try {
            const { error } = await window.supabaseClient.auth.signInWithOAuth({
                provider: provider,
                options: {
                    redirectTo: this.getRedirectVector() 
                }
            });
            if (error) throw error;
        } catch (err) {
            window.Q_LOG('ERROR', 'CORE', `OAUTH_${provider.toUpperCase()}_FAILED`, { error: err.message });
            alert(`[ FAULT: ${err.message} ]`);
        }
    },
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
                <div style="font-family:'JetBrains Mono'; font-size:0.7rem; color:#aaa; margin-bottom: 20px; text-align:center; line-height: 1.5;">Authenticate to sync your temporal state across the Quadrature Matrix.</div>
                
                <div style="display:flex; gap:10px; margin-bottom:15px; justify-content:center;">
                    <button onclick="window.Q_Auth.triggerOAuthProvider('google')" style="flex:1; background:rgba(0,0,0,0.8); border:1px solid #00f0ff; color:#00f0ff; padding:10px; font-family:'Orbitron'; cursor:pointer; font-weight:bold; transition:0.3s;" onmouseover="this.style.background='#00f0ff'; this.style.color='#000';" onmouseout="this.style.background='rgba(0,0,0,0.8)'; this.style.color='#00f0ff';">GOOGLE</button>
                    <button onclick="window.Q_Auth.triggerOAuthProvider('apple')" style="flex:1; background:rgba(0,0,0,0.8); border:1px solid #00f0ff; color:#00f0ff; padding:10px; font-family:'Orbitron'; cursor:pointer; font-weight:bold; transition:0.3s;" onmouseover="this.style.background='#00f0ff'; this.style.color='#000';" onmouseout="this.style.background='rgba(0,0,0,0.8)'; this.style.color='#00f0ff';">APPLE</button>
                    <button onclick="window.Q_Auth.triggerOAuthProvider('azure')" style="flex:1; background:rgba(0,0,0,0.8); border:1px solid #00f0ff; color:#00f0ff; padding:10px; font-family:'Orbitron'; cursor:pointer; font-weight:bold; transition:0.3s;" onmouseover="this.style.background='#00f0ff'; this.style.color='#000';" onmouseout="this.style.background='rgba(0,0,0,0.8)'; this.style.color='#00f0ff';">AZURE</button>
                </div>
                
                <div style="text-align:center; font-size:0.6rem; color:#aaa; margin-bottom:15px; font-family:'JetBrains Mono';">OR VIA SECURE MAGIC LINK</div>
                
                <input type="email" id="auth-email" placeholder="architect@thequadrature.com" style="width:100%; background:rgba(0,0,0,0.8); border:1px solid #00f0ff; color:#00f0ff; padding:10px; margin-top:4px; margin-bottom:15px; font-family:'JetBrains Mono'; box-sizing:border-box; outline:none;">
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
        
        sessionStorage.setItem('Q_AUTH_RETURN_VECTOR', window.location.pathname);

        try {
            const { error } = await window.supabaseClient.auth.signInWithOtp({
                email: email,
                options: {
                    emailRedirectTo: this.getRedirectVector() 
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
            localStorage.setItem('Q_SOVEREIGN_AUTH', 'true');
            window.Q_LOG('STATE', 'CORE', 'SOVEREIGN_IDENTITY_VERIFIED', { user: session.session.user.email });
            
            if (window.ReactNativeWebView) {
                window.ReactNativeWebView.postMessage(JSON.stringify({ action: 'SECURE_AUTH_SUCCESS', token: session.session.access_token }));
            }
            
            const badge = document.getElementById('q-global-sim-badge');
            if (badge) {
                badge.style.border = "1px solid #39ff14";
                badge.style.boxShadow = "0 0 10px rgba(57, 255, 20, 0.4)";
                badge.innerText = "[ IN THE QUAD ]";
                badge.style.color = "#000";
                badge.style.background = "#39ff14";
            }
            
            // Contextual UX Return Logic
            const returnVector = sessionStorage.getItem('Q_AUTH_RETURN_VECTOR');
            if (returnVector && returnVector !== '/personal/index.html' && returnVector !== '/' && returnVector !== '') {
                sessionStorage.removeItem('Q_AUTH_RETURN_VECTOR');
                window.location.replace(window.location.origin + returnVector);
            }
            
        } else {
            localStorage.setItem('Q_SOVEREIGN_AUTH', 'false');
            window.Q_STATE.persistence.auth_status = 'STANDBY';
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

                if (window.Q_DeepFlowMonitor) window.Q_DeepFlowMonitor.check(t);

                window.dispatchEvent(new CustomEvent('q-tick', {
                    detail: { t, isLive: state.isLive, activeTime, daysElapsed, qData, lagDays, legacyDateStr: formatted.dateStr, legacyTimeStr: formatted.timeStr, activePostulate }
                }));
            }
            requestAnimationFrame(loop);
        };
        requestAnimationFrame(loop);
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
                            window.Q_LOG('INFO', 'BIOLOGICAL', 'NATIVE_HEALTH_PAYLOAD_RECEIVED', { status: 'AWAITING_PURGE' });
                            
                            // Extract necessary abstract metrics
                            const derivedDuration = window.Q_BIOMETRICS.calculateUltradian(msg.payload.hrv);
                            
                            // THE 256MS PURGE PROTOCOL (Ephemeral Conduit Enforcement)
                            setTimeout(() => {
                                // Systematically destroy the raw PHI payload from active memory
                                msg.payload.hrv = null;
                                msg.payload.rhr = null;
                                msg.payload.sleep_stage = null;
                                delete msg.payload;
                                
                                window.Q_LOG('STATE', 'BIOLOGICAL', '256MS_PURGE_PROTOCOL_EXECUTED', { status: 'PHI_DESTROYED' });
                                
                                // Resolve with only the mathematically generated Q-metric
                                resolve(derivedDuration);
                            }, 256); // strictly 256ms

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
    if (window.Q_Onboarding) window.Q_Onboarding.check(); 
    window.loadPlannerData(); 
    
    await window.initCloudBridge();
    
    if (window.Q_Auth && window.Q_Auth.handleAuthRedirect) {
        await window.Q_Auth.handleAuthRedirect();
        if (window.Q_STATE.persistence.auth_status === 'SOVEREIGN_AUTHENTICATED') {
            await window.syncGeoLocation();
        }
    }
    
    await window.fetchCloudState();
    await window.calculatePylonAlpha();

    // Trigger Initial Ephemeris Bridge Sync
    const initYear = new Date(window.PYLON_ALPHA_DYNAMIC || Date.now()).getUTCFullYear();
    if (window.Q_EphemerisBridge) window.Q_EphemerisBridge.syncYear(initYear);

    if (window.Q_KairosVoice) window.Q_KairosVoice.init(); 
    if (window.Q_MasterLoop) window.Q_MasterLoop.start(); 
    window.Q_LOG('INFO', 'CORE', 'ZERO_REDUNDANCY_ENGINE_INITIALIZED', { status: 'LEXICON_ENFORCED' });

    window.fetchJPLTelemetry().finally(() => {
        setInterval(window.fetchJPLTelemetry, 300000);
    });

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