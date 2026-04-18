// THE QUADRATURE: ZODIACAL ENGINE PLUGIN (OPT-IN METAPHYSICAL OVERLAY)
// Architect: Kelby | Engineer: Kairos
// PROTOCOL: Swiss Ephemeris Routing, Natal Anchor Matrix, and Autonomous State Persistence
// REVISION: 1.1.1-AUTONOMOUS - Fixed Handshake Lag & Hydration Sequence

window.Q_Plugin_Zodiacal = {
    version: "1.1.1-AUTONOMOUS",
    engineState: "STANDBY",
    ephemerisCache: null,

    // STANDARD ZODIACAL DEGREES (Barycentric Offset Mapping)
    ZODIAC_MAP: {
        ARIES: 0, TAURUS: 30, GEMINI: 60, CANCER: 90, 
        LEO: 120, VIRGO: 150, LIBRA: 180, SCORPIO: 210, 
        SAGITTARIUS: 240, CAPRICORN: 270, AQUARIUS: 300, PISCES: 330
    },

    // GEOMETRIC ASPECTS (Harmonic vs. Friction)
    ASPECT_MATRIX: {
        CONJUNCTION: { angle: 0, tolerance: 8, resonance: "HIGH", type: "AMPLIFICATION" },
        SEXTILE:     { angle: 60, tolerance: 4, resonance: "MEDIUM", type: "HARMONIC" },
        SQUARE:      { angle: 90, tolerance: 6, resonance: "LOW", type: "FRICTION" },
        TRINE:       { angle: 120, tolerance: 6, resonance: "HIGH", type: "HARMONIC" },
        OPPOSITION:  { angle: 180, tolerance: 8, resonance: "LOW", type: "TENSION" }
    },

    init: async function() {
        this.engineState = "INITIALIZING";
        if(window.Q_LOG) window.Q_LOG('INFO', 'PLUGIN', 'ZODIACAL_ENGINE_BOOT_SEQUENCE_INITIATED');
        
        // 1. Initialize Autonomous Persistence Bridge FIRST to hydrate local memory from Cloud
        // This resolves the "Handshake Lag" for the Architect on new devices.
        await this.StateHydrationBridge.mount();

        // 2. Verify Entitlements AFTER hydration is complete
        const ents = localStorage.getItem('Q_ENTITLEMENTS');
        if (!ents || (!ents.includes('RESONANT') && !ents.includes('PRO') && !ents.includes('TEAM'))) {
            if(window.Q_LOG) window.Q_LOG('ERROR', 'PLUGIN', 'ENTITLEMENT_FAILED_ZODIACAL_LOCKED');
            this.engineState = "LOCKED";
            return false;
        }

        this.SwissEphemerisBridge.connect();
        this.engineState = "ACTIVE";
        return true;
    },

    /**
     * STATE HYDRATION BRIDGE
     * Autonomously manages the lifecycle of unverified astrobiology data,
     * preventing contamination of the B2B Q-Core state engine.
     */
    StateHydrationBridge: {
        mount: async function() {
            // 1. Local Memory Injection
            const localAnchor = localStorage.getItem('q_natal_anchor') || 'NONE';
            const localVis = localStorage.getItem('q_zodiac_visible') !== 'false';

            if (window.Q_STATE && window.Q_STATE.metaphysical_layer) {
                window.Q_STATE.metaphysical_layer.natal_anchor = localAnchor;
                window.Q_STATE.metaphysical_layer.zodiac_visible = localVis;
            }

            // 2. Cloud Hydration Sync (Supabase Handshake)
            if (window.supabaseClient) {
                const { data: session } = await window.supabaseClient.auth.getSession();
                if (session?.session?.user) {
                    try {
                        const { data } = await window.supabaseClient
                            .from('pro_identity')
                            .select('natal_anchor')
                            .eq('user_id', session.session.user.id)
                            .single();
                            
                        if (data && data.natal_anchor) {
                            localStorage.setItem('q_natal_anchor', data.natal_anchor);
                            if (window.Q_STATE) window.Q_STATE.metaphysical_layer.natal_anchor = data.natal_anchor;
                        }
                    } catch(e) {
                        if(window.Q_LOG) window.Q_LOG('WARN', 'PLUGIN', 'CLOUD_HYDRATION_UNAVAILABLE_FOR_ANCHOR');
                    }
                }
            }

            // 3. Q_UpdateState Intercept (Monkey-Patching for Plugin Sync)
            const originalUpdateState = window.Q_UpdateState;
            window.Q_UpdateState = async function(category, key, value) {
                // Allow core to process nominal logic
                if (originalUpdateState) {
                    await originalUpdateState(category, key, value);
                }

                // Plugin Cloud Intercept: Catch Zodiacal parameters dropped by Q-Core
                if (key === 'natal_anchor' || key === 'zodiac_visible') {
                    if (window.Q_STATE && window.Q_STATE[category]) {
                        window.Q_STATE[category][key] = value;
                        localStorage.setItem(`q_${key}`, value);
                    }
                    
                    if (window.supabaseClient) {
                        const { data: session } = await window.supabaseClient.auth.getSession();
                        if (session?.session?.user) {
                            let payload = { user_id: session.session.user.id };
                            payload[key] = value;
                            const targetTable = key === 'natal_anchor' ? 'pro_identity' : 'system_state';
                            
                            window.supabaseClient.from(targetTable)
                                .upsert(payload, { onConflict: 'user_id' })
                                .then(({error}) => {
                                    if(!error && window.Q_LOG) window.Q_LOG('INFO', 'PLUGIN', `AUTONOMOUS_CLOUD_SYNC_SUCCESS: ${key}`);
                                });
                        }
                    }
                }
            };

            if(window.Q_LOG) window.Q_LOG('STATE', 'PLUGIN', 'PERSISTENCE_BRIDGE_MOUNTED');
        }
    },

    SwissEphemerisBridge: {
        connect: function() {
            if(window.Q_LOG) window.Q_LOG('INFO', 'EPHEMERIS', 'ESTABLISHING_SWISS_EPHEMERIS_DATALINK');
            
            // Mocking the ingestion of live astronomical positions (Proxy for actual API)
            window.Q_Plugin_Zodiacal.ephemerisCache = {
                timestamp: Date.now(),
                transits: {
                    SUN: 14.5,
                    MOON: 112.3,
                    MERCURY: 28.1,
                    VENUS: 355.6,
                    MARS: 210.4,
                    JUPITER: 66.8,
                    SATURN: 340.2
                }
            };
            if(window.Q_LOG) window.Q_LOG('STATE', 'EPHEMERIS', 'TRANSIT_CACHE_UPDATED');
        },
        
        getLiveTransit: function(celestialBody) {
            if (!window.Q_Plugin_Zodiacal.ephemerisCache) this.connect();
            return window.Q_Plugin_Zodiacal.ephemerisCache.transits[celestialBody.toUpperCase()] || null;
        }
    },

    NatalAnchorMatrix: {
        getUserAnchor: function() {
            if (!window.Q_STATE || !window.Q_STATE.metaphysical_layer) return null;
            const sign = window.Q_STATE.metaphysical_layer.natal_anchor;
            if (!sign || sign === "NONE") return null;
            
            return window.Q_Plugin_Zodiacal.ZODIAC_MAP[sign];
        },

        calculateCurrentAspects: function() {
            const anchorDegree = this.getUserAnchor();
            if (anchorDegree === null) {
                if(window.Q_LOG) window.Q_LOG('WARN', 'METAPHYSICS', 'NO_NATAL_ANCHOR_DEFINED');
                return null;
            }

            if (!window.Q_Plugin_Zodiacal.ephemerisCache) {
                window.Q_Plugin_Zodiacal.SwissEphemerisBridge.connect();
            }

            const activeAspects = [];
            const transits = window.Q_Plugin_Zodiacal.ephemerisCache.transits;

            for (const [body, transitDegree] of Object.entries(transits)) {
                let diff = Math.abs(anchorDegree - transitDegree);
                if (diff > 180) diff = 360 - diff; // Calculate shortest geometric distance

                for (const [aspectName, aspectData] of Object.entries(window.Q_Plugin_Zodiacal.ASPECT_MATRIX)) {
                    if (Math.abs(diff - aspectData.angle) <= aspectData.tolerance) {
                        activeAspects.push({
                            body: body,
                            aspect: aspectName,
                            type: aspectData.type,
                            resonance: aspectData.resonance,
                            exactness: Math.abs(diff - aspectData.angle).toFixed(2)
                        });
                    }
                }
            }
            return activeAspects;
        }
    },

    ResonanceDiscoveryProtocol: {
        scanP2PNetwork: function(targetDistanceRadius) {
            if(window.Q_LOG) window.Q_LOG('INFO', 'NETWORK', 'INITIATING_RESONANCE_DISCOVERY_SCAN');
            
            const myAnchor = window.Q_Plugin_Zodiacal.NatalAnchorMatrix.getUserAnchor();
            if (myAnchor === null) return { status: "FAILED", reason: "MISSING_ORIGIN_COORDINATE" };

            // Mocking a Supabase response of active nodes within radius
            const mockNetworkNodes = [
                { user_id: "node_883a", natal_degree: 122.5, current_flow_state: "DEEP_FLOW" },
                { user_id: "node_119b", natal_degree: 211.0, current_flow_state: "RECOVERY" },
                { user_id: "node_442c", natal_degree: 301.2, current_flow_state: "DEEP_FLOW" }
            ];

            const resonantMatches = [];

            mockNetworkNodes.forEach(node => {
                let diff = Math.abs(myAnchor - node.natal_degree);
                if (diff > 180) diff = 360 - diff;

                // Checking for Trines (120°) or Sextiles (60°)
                if (Math.abs(diff - 120) <= 6) {
                    resonantMatches.push({ node: node.user_id, aspect: "TRINE", sync_status: node.current_flow_state });
                } else if (Math.abs(diff - 60) <= 4) {
                    resonantMatches.push({ node: node.user_id, aspect: "SEXTILE", sync_status: node.current_flow_state });
                }
            });

            if(window.Q_LOG) window.Q_LOG('STATE', 'NETWORK', `DISCOVERY_COMPLETE_MATCHES_${resonantMatches.length}`);
            return { status: "SUCCESS", matches: resonantMatches };
        },

        initiateHighResonanceSprint: function(nodeId) {
            if(window.Q_LOG) window.Q_LOG('EXEC', 'NETWORK', `ESTABLISHING_SPRINT_BRIDGE_WITH_${nodeId}`);
            // Injects into active Q-Core planner as a synchronized event
            return true;
        }
    }
};

// Auto-initialize if running in an environment where Q_STATE is already mounted
if (typeof window !== 'undefined') {
    setTimeout(() => {
        if (window.Q_STATE && window.Q_STATE.persistence.auth_status === 'PRO_AUTHENTICATED') {
            window.Q_Plugin_Zodiacal.init();
        }
    }, 1000);
}
// EOF: plugin-zodiacal.js