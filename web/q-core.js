// THE QUADRATURE: CORE PHYSICS & METROLOGY ENGINE
// Architect: Kelby | Engineer: Kairos
// STATUS: Phase XII Physics Engine. Pure Spatial Kinematics & Orbital Ledger Arrays.

(function() {
    if (window.Q_CORE_LOADED) return;
    window.Q_CORE_LOADED = true;

    window.Q_LOG = function(level, module, message, data={}) {
        const ts = new Date().toISOString();
        console.log(`[Q-OS] ${ts} | ${level} | ${module} | ${message}`, data);
    };

    document.addEventListener('DOMContentLoaded', () => { window.initQCore(); });

    window.initQCore = function() {
        console.log("[Q-CORE] V25 System Initialized...");
        
        window.ANCHOR_ALPHA_DYNAMIC = Date.UTC(2025, 11, 21, 15, 3, 0); 
        window.MS_DAY = 86400000;
        window.TROPICAL_YEAR_MS = 31556925216;

        window.Q_GEAR_CONSTANTS = {
            ALPHA: 86400000,
            BETA: 84600000,
            GAMMA: 89662680,
            DELTA: 102599640,
            EPSILON: 89662680
        };

        window.EPHEMERIS_ANCHORS = [
            Date.UTC(2025, 11, 21, 15, 3, 0), Date.UTC(2026, 2, 20, 14, 46, 0), Date.UTC(2026, 5, 21, 8, 24, 0), Date.UTC(2026, 8, 23, 0, 5, 0),
            Date.UTC(2026, 11, 21, 20, 50, 0), Date.UTC(2027, 2, 20, 20, 25, 0), Date.UTC(2027, 5, 21, 14, 11, 0), Date.UTC(2027, 8, 23, 6, 2, 0),
            Date.UTC(2027, 11, 21, 2, 43, 0), Date.UTC(2028, 2, 20, 2, 17, 0), Date.UTC(2028, 5, 20, 20, 2, 0), Date.UTC(2028, 8, 22, 11, 45, 0),
            Date.UTC(2028, 11, 21, 8, 20, 0), Date.UTC(2029, 2, 20, 8, 2, 0), Date.UTC(2029, 5, 21, 1, 48, 0), Date.UTC(2029, 8, 22, 17, 38, 0),
            Date.UTC(2029, 11, 21, 14, 14, 0), Date.UTC(2030, 2, 20, 13, 52, 0), Date.UTC(2030, 5, 21, 7, 31, 0), Date.UTC(2030, 8, 22, 23, 27, 0),
            Date.UTC(2030, 11, 21, 20, 9, 0)
        ];

        window.initQBlocks = function() {
            if (!window.TROPICAL_YEAR_MS) return;

            window.Q_BLOCK_DEFS = [];
            let rawDurs = [];
            let totalRaw = 0;
            
            for(let d=0; d<360; d++) {
                let v = 1 + 0.0167 * Math.cos((d - 14) * Math.PI / 180); 
                let dur = 1 / v;
                rawDurs.push(dur);
                totalRaw += dur;
            }
            
            let scale = window.TROPICAL_YEAR_MS / totalRaw;
            
            for(let d=0; d<360; d++) {
                let q = Math.floor(d / 90) + 1;
                let s = Math.floor((d % 90) / 30) + 1;
                let degInSect = (d % 30) + 1; 
                
                let isAnchor = (d === 0 || d === 90 || d === 180 || d === 270);
                let aName = "";
                if(d===0) aName = "SOUTHERN SOLSTICE";
                if(d===90) aName = "1ST EQUINOX";
                if(d===180) aName = "NORTHERN SOLSTICE";
                if(d===270) aName = "2ND EQUINOX";
                
                window.Q_BLOCK_DEFS.push({
                    type: 'DEGREE', quad: q, sect: s, deg: degInSect, absDeg: d,
                    dur: rawDurs[d] * scale, isAnchor: isAnchor, name: aName
                });
            }
            
            window.Q_BLOCKS = [];
            let acc = 0;
            window.Q_BLOCK_DEFS.forEach((b, i) => {
                window.Q_BLOCKS.push({ ...b, relStart: acc, blockIndex: i });
                acc += b.dur;
            });

            window.Q_YEAR_MS = acc;
        };

        window.getQBlockByTime = function(ts) {
            if(!window.ANCHOR_ALPHA_DYNAMIC || !window.Q_BLOCKS) return null;
            let diff = (ts + 5) - window.ANCHOR_ALPHA_DYNAMIC;
            let cycleIdx = Math.floor(diff / window.Q_YEAR_MS);
            let rem = diff % window.Q_YEAR_MS;
            if(rem < 0) { rem += window.Q_YEAR_MS; cycleIdx -= 1; }
            
            for(let i=0; i<window.Q_BLOCKS.length; i++) {
                let b = window.Q_BLOCKS[i];
                if(rem >= b.relStart && rem < b.relStart + b.dur) {
                    return { ...b, cycle: cycleIdx, absoluteStart: window.ANCHOR_ALPHA_DYNAMIC + (cycleIdx * window.Q_YEAR_MS) + b.relStart };
                }
            }
            return null;
        };

       window.stepQBlock = function(ts, n) {
            let current = window.getQBlockByTime(ts);
            if(!current) return ts;
            let targetIdx = current.blockIndex + n;
            let targetCycle = current.cycle;
            
            while(targetIdx >= window.Q_BLOCKS.length) { targetIdx -= window.Q_BLOCKS.length; targetCycle += 1; }
            while(targetIdx < 0) { targetIdx += window.Q_BLOCKS.length; targetCycle -= 1; }
            
            let targetBlock = window.Q_BLOCKS[targetIdx];
            return window.ANCHOR_ALPHA_DYNAMIC + (targetCycle * window.Q_YEAR_MS) + targetBlock.relStart + (targetBlock.dur / 2);
        };

        window.stepQSector = function(ts, n) {
            let current = window.getQBlockByTime(ts);
            if(!current) return ts;
            let cIdx = current.blockIndex;
            let cCycle = current.cycle;
            let steps = Math.abs(n);
            let dir = n > 0 ? 1 : -1;
            
            for(let i=0; i<steps; i++) {
                do {
                    cIdx += dir;
                    if(cIdx >= window.Q_BLOCKS.length) { cIdx -= window.Q_BLOCKS.length; cCycle++; }
                    if(cIdx < 0) { cIdx += window.Q_BLOCKS.length; cCycle--; }
                } while (window.Q_BLOCKS[cIdx].deg !== 1);
            }
            let targetBlock = window.Q_BLOCKS[cIdx];
            return window.ANCHOR_ALPHA_DYNAMIC + (cCycle * window.Q_YEAR_MS) + targetBlock.relStart + (targetBlock.dur / 2);
        };

        window.initQBlocks();

        let lastPulse = 0;
        let scrubSpeed = 0;
        
        window.Q_STATE = {
            isLive: true, simTime: Date.now(),
            logic_layer: { active: true, offset_ms: 0 },
            metaphysical_layer: { zodiac_active: true, natal_anchor: localStorage.getItem('Q_NATAL_ANCHOR') || 'NONE' },
            location: {
                lat: localStorage.getItem('Q_LAT') || 34.0522,
                lon: localStorage.getItem('Q_LON') || -118.2437,
                name: localStorage.getItem('Q_LOC_NAME') || 'CLEARWATER, FL'
            }
        };

        // --- NATIVE SUPABASE OAUTH BRIDGE ---
        window.Q_Auth = {
            triggerOAuth: async function() {
                window.Q_LOG('INFO', 'AUTH', 'Initiating Supabase Google OAuth Flow');
                if (typeof window.supabaseClient === 'undefined') {
                    alert("[ ARCHITECTURE ERROR ]\nSupabase client not detected in global scope. Ensure Supabase SDK is loaded.");
                    return;
                }
                const { data, error } = await window.supabaseClient.auth.signInWithOAuth({
                    provider: 'google',
                    options: {
                        redirectTo: window.location.origin + window.location.pathname
                    }
                });
                if (error) {
                    window.Q_LOG('ERROR', 'AUTH', 'Supabase OAuth routing failed.', error);
                }
            },
            
            signOut: async function() {
                window.Q_LOG('STATE', 'AUTH', 'OAuth Token Revoked');
                if (typeof window.supabaseClient !== 'undefined') {
                    await window.supabaseClient.auth.signOut();
                }
                localStorage.setItem('Q_PRO_AUTH', 'false');
                localStorage.removeItem('Q_AUTH_TOKEN');
                localStorage.removeItem('Q_ENTITLEMENTS');
                window.location.reload();
            },

            handleRedirectReturn: async function() {
                if (typeof window.supabaseClient !== 'undefined') {
                    const { data: { session } } = await window.supabaseClient.auth.getSession();
                    if (session) {
                        window.Q_LOG('STATE', 'AUTH', 'OAuth Session Captured via Supabase');
                        localStorage.setItem('Q_PRO_AUTH', 'true');
                        localStorage.setItem('Q_AUTH_TOKEN', session.access_token);
                        
                        let ents = JSON.parse(localStorage.getItem('Q_ENTITLEMENTS') || '[]');
                        if(!ents.includes('PRO')) ents.push('PRO');
                        localStorage.setItem('Q_ENTITLEMENTS', JSON.stringify(ents));
                    }
                }
            }
        };

        // Ensure session validation fires upon boot
        setTimeout(() => { window.Q_Auth.handleRedirectReturn(); }, 500);

        window.getSimState = () => window.Q_STATE;

        window.addEventListener('storage', (e) => {
            if (e.key === 'Q_MASTER_CLOCK' && e.newValue) {
                try {
                    const data = JSON.parse(e.newValue);
                    window.Q_STATE.isLive = data.isLive;
                    window.Q_STATE.simTime = data.simTime;
                    scrubSpeed = data.scrubSpeed || 0;
                    window.Q_LOG('INFO', 'CLOCK', 'Master Sync', data);
                } catch(err) {
                    console.error("Master Clock Sync Failed", err);
                }
            }
        });

        window.formatLegacyDate = function(tMs) {
            let d = tMs instanceof Date ? tMs : new Date(tMs);
            const months = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"];
            let fmt = localStorage.getItem('Q_TIME_FMT') || 'UTC_24';
            
            let dateStr = ""; let timeStr = "";

            if (fmt.includes('UTC')) {
                dateStr = `${months[d.getUTCMonth()]} ${d.getUTCDate().toString().padStart(2, '0')}, ${d.getUTCFullYear()}`;
            } else {
                dateStr = `${months[d.getMonth()]} ${d.getDate().toString().padStart(2, '0')}, ${d.getFullYear()}`;
            }

            if (fmt === 'UTC_24') {
                timeStr = `${d.getUTCHours().toString().padStart(2,'0')}:${d.getUTCMinutes().toString().padStart(2,'0')}:${d.getUTCSeconds().toString().padStart(2,'0')}Z`;
            } else if (fmt === 'LOCAL_24') {
                timeStr = `${d.getHours().toString().padStart(2,'0')}:${d.getMinutes().toString().padStart(2,'0')}:${d.getSeconds().toString().padStart(2,'0')} LCL`;
            } else if (fmt === 'UTC_12') {
                let h = d.getUTCHours(); let ampm = h >= 12 ? 'PM' : 'AM'; h = h % 12; h = h ? h : 12;
                timeStr = `${h.toString().padStart(2,'0')}:${d.getUTCMinutes().toString().padStart(2,'0')}:${d.getUTCSeconds().toString().padStart(2,'0')} ${ampm} UTC`;
            } else if (fmt === 'LOCAL_12') {
                let h = d.getHours(); let ampm = h >= 12 ? 'PM' : 'AM'; h = h % 12; h = h ? h : 12;
                timeStr = `${h.toString().padStart(2,'0')}:${d.getMinutes().toString().padStart(2,'0')}:${d.getSeconds().toString().padStart(2,'0')} ${ampm} LCL`;
            }

            return { dateStr: dateStr, timeStr: timeStr, date: dateStr, time: timeStr };
        };

        window.getOrbitalData = function(daysElapsed) {
            let meanArc = (daysElapsed * (360 / 365.24219)) % 360;
            if (meanArc < 0) meanArc += 360;

            const daysSincePerihelion = daysElapsed - 14; 
            const M = daysSincePerihelion * (360 / 365.24219);
            const Mrad = M * Math.PI / 180;
            const e = 0.0167; 
            
            const equationOfCenter = (2 * e * Math.sin(Mrad) + 1.25 * e * e * Math.sin(2 * Mrad)) * 180 / Math.PI;
            
            let trueArc = (meanArc + equationOfCenter) % 360;
            if (trueArc < 0) trueArc += 360;

            const cycleDayFloat = daysElapsed % 365.24219;
            const cycleDay = Math.floor(cycleDayFloat < 0 ? cycleDayFloat + 365.24219 : cycleDayFloat);

            return {
                meanArc: meanArc, trueArc: trueArc, delta: trueArc - meanArc,
                quad: Math.floor(meanArc / 90) + 1, sect: Math.floor((meanArc % 90) / 30) + 1,
                day: Math.floor(meanArc % 30) + 1, cycleDay: cycleDay
            };
        };

        function calculateQData(t) {
            const daysElapsed = (t - window.ANCHOR_ALPHA_DYNAMIC) / window.MS_DAY;
            const orbitalData = window.getOrbitalData(daysElapsed);

            const G_BASE = 277.0; const S_BASE = 45.0; 
            const STELLAR_DEG_PER_DAY = 360 / (230000000 * 365.24219);
            const GALACTIC_DEG_PER_DAY = STELLAR_DEG_PER_DAY * 0.4;

            let sOrbit = (S_BASE + (daysElapsed * STELLAR_DEG_PER_DAY)) % 360;
            if (sOrbit < 0) sOrbit += 360;
            
            let gAzimuth = (G_BASE + (daysElapsed * GALACTIC_DEG_PER_DAY)) % 360;
            if (gAzimuth < 0) gAzimuth += 360;

            orbitalData.galactic = gAzimuth; orbitalData.stellar = sOrbit;

            const knownNewMoon = Date.UTC(2024, 0, 11, 11, 57);
            const lunarCycle = 29.53058867 * window.MS_DAY;
            const lunarPhase = ((t - knownNewMoon) % lunarCycle) / lunarCycle;
            orbitalData.lunarPhase = lunarPhase > 0 ? lunarPhase : lunarPhase + 1;

            return orbitalData;
        }

        window.getGlobalHolidays = function(year) {
            return [
                { type: 'node-sys', coord: 0, name: "SOUTHERN SOLSTICE" },
                { type: 'node-sys', coord: 90, name: "1ST EQUINOX" },
                { type: 'node-sys', coord: 180, name: "NORTHERN SOLSTICE" },
                { type: 'node-sys', coord: 270, name: "2ND EQUINOX" }
            ];
        };

        window.getNextCelestialEvent = function(t) {
            for (let i = 0; i < window.EPHEMERIS_ANCHORS.length; i++) {
                if (window.EPHEMERIS_ANCHORS[i] > t) return { timestamp: window.EPHEMERIS_ANCHORS[i], isPredictive: false };
            }
            const tropicalQuarter = 7889231304; 
            const elapsedQs = Math.ceil((t - window.EPHEMERIS_ANCHORS[window.EPHEMERIS_ANCHORS.length - 1]) / tropicalQuarter);
            return { timestamp: window.EPHEMERIS_ANCHORS[window.EPHEMERIS_ANCHORS.length - 1] + (elapsedQs * tropicalQuarter), isPredictive: true };
        };

        function mainLoop(timestamp) {
            if (timestamp - lastPulse >= 50) { 
                let state = window.Q_STATE;
                let now = state.isLive ? Date.now() : state.simTime;
                
                if (!state.isLive && scrubSpeed !== 0) {
                    now += scrubSpeed;
                    state.simTime = now;
                }

                let d = new Date(now);
                let qData = calculateQData(now);
                let daysElapsed = (now - window.ANCHOR_ALPHA_DYNAMIC) / window.MS_DAY;
                
                let legacy = window.formatLegacyDate(d);
                let nextEvent = window.getNextCelestialEvent(now);
                
                window.CURRENT_TRUE_ARC = qData.trueArc;

                const event = new CustomEvent('q-tick', {
                    detail: {
                        t: now, isLive: state.isLive, activeTime: d, daysElapsed: daysElapsed,
                        qData: qData, legacyDateStr: legacy.dateStr, legacyTimeStr: legacy.timeStr,
                        lagDays: (qData.delta / 360) * 365.24219,
                        activePostulate: window.getPostulateByTime ? window.getPostulateByTime(now) : "PENDING",
                        nextCelestialEvent: nextEvent.timestamp, isPredictiveEphemeris: nextEvent.isPredictive
                    }
                });
                window.dispatchEvent(event);
                lastPulse = timestamp;
            }
            requestAnimationFrame(mainLoop);
        }

        requestAnimationFrame(mainLoop);
    };
})();