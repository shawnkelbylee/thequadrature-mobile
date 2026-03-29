// THE QUADRATURE: GLOBAL DASHBOARD
// Architect: Kelby | Engineer: Kairos
// PROTOCOL: Centralized Telemetry Subscriber & Tiered Access Matrix

window.Q_IntegrationHub = {
    viewState: 'closed',

    init: function() { 
        if(window.self !== window.top) return;
        this.injectCSS(); 
        this.injectDOM(); 
        this.injectControlBar();
        this.bindMasterTick();
        if(window.Q_LOG) window.Q_LOG('INFO', 'CORE', 'DASHBOARD_DOM_UNIFIED');
    },

    injectCSS: function() {
        const style = document.createElement('style');
        style.innerHTML = `
            .q-hub-overlay { position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.85); backdrop-filter: blur(12px); z-index: 10010; display: none; justify-content: center; align-items: center; pointer-events: auto; }
            .q-hub-overlay.active { display: flex; }
            .q-hub-box { width: 90vw; max-width: 500px; max-height: 85vh; overflow-y: auto; background: rgba(5, 8, 15, 0.95); border: 1px solid var(--theme-main) !important; border-radius: 8px; padding: 25px; box-sizing: border-box; box-shadow: 0 20px 50px rgba(0,0,0,0.9); display: flex; flex-direction: column; gap: 15px; color: #fff; font-family: 'JetBrains Mono', monospace; pointer-events: auto; }
            
            /* Scrollbar styling for the hub box */
            .q-hub-box::-webkit-scrollbar { width: 6px; }
            .q-hub-box::-webkit-scrollbar-track { background: rgba(0,0,0,0.2); }
            .q-hub-box::-webkit-scrollbar-thumb { background: var(--theme-main) !important; border-radius: 3px; }

            .q-global-controls { position: fixed; bottom: 30px; left: 50%; transform: translateX(-50%); z-index: 9995; display: flex; align-items: center; gap: 12px; background: rgba(10, 12, 18, 0.95); backdrop-filter: blur(20px); border-radius: 50px; padding: 10px 25px; min-width: 480px; justify-content: space-between; box-shadow: 0 10px 40px rgba(0,0,0,0.9), 0 0 20px rgba(255,255,255,0.05); border: 1px solid rgba(255, 255, 255, 0.1); pointer-events: auto; }
            .q-ctrl-btn { background: transparent; border: 1px solid var(--theme-main) !important; color: var(--theme-main) !important; padding: 8px 14px; cursor: pointer; font-family: 'Orbitron'; font-size: 0.65rem; font-weight: 700; border-radius: 6px; transition: 0.3s; letter-spacing: 1px; white-space: nowrap; pointer-events: auto; }
            .q-ctrl-btn:hover { background: rgba(255,255,255,0.1) !important; color: #fff !important; }
            .q-ctrl-btn.active { background: var(--theme-main) !important; color: #000 !important; }
            .q-scrubber { flex-grow: 1; accent-color: var(--theme-main) !important; cursor: pointer; height: 4px; -webkit-appearance: none; margin: 0 10px; border-radius: 2px; background: rgba(255,255,255,0.1); pointer-events: auto; }
            .q-scrubber::-webkit-slider-thumb { -webkit-appearance: none; height: 22px; width: 22px; background: var(--theme-main) !important; clip-path: polygon(50% 0%, 60% 40%, 100% 50%, 60% 60%, 50% 100%, 40% 60%, 0% 50%, 40% 40%); cursor: grab; pointer-events: auto; }
            .q-scrubber::-webkit-slider-thumb:active { cursor: grabbing; }
            .hub-tier-row { background:rgba(0,0,0,0.5); border:1px solid rgba(255,255,255,0.1); padding:12px; border-radius:6px; display:flex; justify-content:space-between; align-items:center; transition: 0.3s; pointer-events: auto; }
            .hub-tier-row:hover { border-color: var(--theme-main) !important; box-shadow: inset 0 0 10px rgba(255, 255, 255, 0.1); }
            
            .support-links { border-top: 1px dashed rgba(255,255,255,0.2); padding-top: 15px; margin-top: 5px; display: flex; flex-wrap: wrap; justify-content: center; gap: 12px; font-size: 0.6rem; font-family: 'Orbitron'; font-weight: 700; pointer-events: auto; }
            .support-links a { color: rgba(255,255,255,0.6); text-decoration: none; transition: 0.3s; letter-spacing: 1px; pointer-events: auto; }
            .support-links a:hover { color: #00f0ff; text-shadow: 0 0 8px rgba(0,240,255,0.5); }
            .support-links a.highlight { color: #F4D068; }
            .support-links a.highlight:hover { color: #fff; text-shadow: 0 0 10px #F4D068; }

            @media (max-width: 768px) { .q-global-controls { min-width: 95vw; padding: 8px 12px; gap: 5px; bottom: 15px; } .q-ctrl-btn-text { display: none; } }
        `;
        document.head.appendChild(style);
    },

    requestStateGate: function(featureKey, tierLevel, categoryKey) {
        if(window.Q_LOG) window.Q_LOG('WARN', 'CAPITAL', 'TIER_UPGRADE_REQUIRED', { feature: featureKey, required_tier: tierLevel });
        
        if (window.ReactNativeWebView) {
            window.ReactNativeWebView.postMessage(JSON.stringify({ action: 'TRIGGER_PAYWALL', tier: tierLevel, feature: featureKey }));
        } else {
            alert(`[ THE QUADRATURE: SOVEREIGN MATRIX ]\nAccess to ${featureKey.toUpperCase()} requires ${tierLevel} verification.\n\nProceeding to gateway simulation...`);
            // Mock upgrade for web testing environment
            if(categoryKey && window.Q_STATE[categoryKey]) {
                window.Q_UpdateState(categoryKey, featureKey, 'ACTIVE');
            }
            this.closeHub();
            setTimeout(() => this.openHub(), 300); // Refresh DOM to show active state
        }
    },

    injectDOM: function() {
        // Remove existing overlay if present for clean refresh
        const existing = document.getElementById('unified-integration-hub');
        if (existing) existing.remove();

        const dom = document.createElement('div');
        dom.className = 'q-hub-overlay';
        dom.id = 'unified-integration-hub';
        
        const renderBadge = (statusColor, textColor, text) => `<span style="font-size:0.55rem; background:${statusColor}; color:${textColor}; padding:4px 8px; border-radius:4px; font-weight:900; letter-spacing: 1px;">${text}</span>`;
        const renderUpgradeBtn = (feature, tier, category, color) => `<button onclick="window.Q_IntegrationHub.requestStateGate('${feature}', '${tier}', '${category}')" style="font-size:0.55rem; background:transparent; border:1px solid ${color}; color:${color}; padding:4px 8px; border-radius:4px; font-weight:900; letter-spacing: 1px; cursor:pointer; transition:0.3s; pointer-events:auto;" onmouseover="this.style.background='${color}'; this.style.color='#000';" onmouseout="this.style.background='transparent'; this.style.color='${color}';">UPGRADE</button>`;

        // Dynamically read from Q_STATE
        const isBioActive = window.Q_STATE?.hardware_hooks?.biometric_api === 'ACTIVE';
        const bioStatus = isBioActive ? renderBadge('#39ff14', '#000', 'ACTIVE') : renderUpgradeBtn('biometric_api', 'STANDARD TIER', 'hardware_hooks', '#39ff14');

        const isEphActive = window.Q_STATE?.metaphysical_layer?.swiss_ephemeris === 'ACTIVE';
        const ephStatus = isEphActive ? renderBadge('#00f0ff', '#000', 'ACTIVE') : renderUpgradeBtn('swiss_ephemeris', 'RESONANT TIER', 'metaphysical_layer', '#00f0ff');

        const isSyndicateActive = window.Q_STATE?.metaphysical_layer?.patreon_gating === 'ACTIVE';
        const syndicateStatus = isSyndicateActive ? renderBadge('#ff003c', '#fff', 'ACTIVE') : renderUpgradeBtn('patreon_gating', 'SYNDICATE TIER', 'metaphysical_layer', '#ff003c');

        const isFiatActive = window.Q_STATE?.capital_ledger?.fiat_api === 'ACTIVE';
        const fiatStatus = isFiatActive ? renderBadge('#F4D068', '#000', 'ACTIVE') : renderUpgradeBtn('fiat_api', 'ENTERPRISE TIER', 'capital_ledger', '#F4D068');

        dom.innerHTML = `
            <div class="q-hub-box" onclick="event.stopPropagation()">
                <div style="font-family:'Orbitron'; text-align:center; border-bottom:1px dashed rgba(255,255,255,0.2); padding-bottom:10px; font-size: 1.1rem; color: var(--theme-main); font-weight: 900; letter-spacing: 2px;">DASHBOARD // SOVEREIGN MATRIX</div>
                <div style="font-size:0.65rem; color:#aaa; margin:5px 0 10px 0; text-align:center; line-height: 1.5;">Manage Sovereign Identity API hooks and Tiered Access Bridges.</div>
                
                <div style="display:flex; flex-direction:column; gap:10px; margin-bottom: 5px;">
                    
                    <div class="hub-tier-row" style="border-color: rgba(255,255,255,0.3);">
                        <div>
                            <div style="font-family:'Orbitron'; font-size:0.75rem; color:#fff; font-weight: bold;">BASIC TIER ($9.99/mo)</div>
                            <div style="font-size:0.55rem; color:#888; margin-top: 4px;">Full Vector HUDs & Omni-Planner.<br>Personalization: Natal Anchor, Wake Time, Geolocation.</div>
                        </div>
                        ${renderBadge('#fff', '#000', 'ACTIVE')}
                    </div>

                    <div class="hub-tier-row">
                        <div>
                            <div style="font-family:'Orbitron'; font-size:0.75rem; color:#39ff14; font-weight: bold;">STANDARD TIER ($14.99/mo)</div>
                            <div style="font-size:0.55rem; color:#888; margin-top: 4px;">Bio Hook: Health Connect/HealthKit integration.<br>Real-time HRV & Ultradian Tracking.</div>
                        </div>
                        ${bioStatus}
                    </div>

                    <div class="hub-tier-row">
                        <div>
                            <div style="font-family:'Orbitron'; font-size:0.75rem; color:#00f0ff; font-weight: bold;">RESONANT TIER ($19.99/mo)</div>
                            <div style="font-size:0.55rem; color:#888; margin-top: 4px;">Metaphysical Hook: Swiss Ephemeris mapping.<br>Precision True Ellipse orbital resonance.</div>
                        </div>
                        ${ephStatus}
                    </div>
                    
                    <div class="hub-tier-row" style="background: rgba(255,0,60,0.05);">
                        <div>
                            <div style="font-family:'Orbitron'; font-size:0.75rem; color:#ff003c; font-weight: bold;">SYNDICATE TIER ($24.99/mo)</div>
                            <div style="font-size:0.55rem; color:#888; margin-top: 4px;">P2P Social License: Consolidated B2C Wellness.<br>Shared "Deep Flow" scheduling & broadcasting.</div>
                        </div>
                        ${syndicateStatus}
                    </div>

                    <div class="hub-tier-row">
                        <div>
                            <div style="font-family:'Orbitron'; font-size:0.75rem; color:#F4D068; font-weight: bold;">ENTERPRISE TIER ($199.00+/mo)</div>
                            <div style="font-size:0.55rem; color:#888; margin-top: 4px;">B2B Wellness: Team Resonance & Friction Reduction.<br>Capital Ledger: Stripe/Plaid API & Civil Exporter.</div>
                        </div>
                        ${fiatStatus}
                    </div>
                </div>

                <div class="support-links">
                    <a href="#">[ HELP ]</a>
                    <a href="#">[ CONTACT US ]</a>
                    <a href="#">[ TECH SUPPORT ]</a>
                    <a href="#" class="highlight">[ POD / DIGITAL PRINT ]</a>
                </div>

                <button class="q-ctrl-btn" style="width:100%; border-color: var(--theme-main); color: var(--theme-main); pointer-events:auto;" onclick="window.Q_IntegrationHub.closeHub()">ACKNOWLEDGE</button>
            </div>
        `;
        document.body.appendChild(dom);
    },

    injectControlBar: function() {
        if(document.getElementById('q-universal-controls')) return;
        const bar = document.createElement('div');
        bar.className = 'q-global-controls';
        bar.id = 'q-universal-controls';
        
        // Strict hide for-Scrubber on Boot 
        if(sessionStorage.getItem('Q_BOOT_COMPLETE') !== 'true') {
            bar.style.display = 'none';
        }

        bar.innerHTML = `
            <button class="q-ctrl-btn" onclick="window.Q_IntegrationHub.step(-1)">&lt;</button>
            <input type="range" min="0" max="365" step="1" value="0" class="q-scrubber" id="q-global-scrubber" oninput="window.Q_IntegrationHub.scrub(this.value)">
            <button class="q-ctrl-btn" onclick="window.Q_IntegrationHub.step(1)">&gt;</button>
            <button class="q-ctrl-btn" id="q-live-toggle" onclick="window.Q_IntegrationHub.setLive()">LIVE</button>
        `;
        document.body.appendChild(bar);
        this.syncUI();
    },

    bindMasterTick: function() {
        window.addEventListener('q-tick', (e) => {
            const { isLive, daysElapsed } = e.detail;
            
            if (isLive) {
                const scrubber = document.getElementById('q-global-scrubber');
                if (scrubber) {
                    let cycleDay = Math.floor(daysElapsed % 365.24219);
                    if (cycleDay < 0) cycleDay += 365; 
                    scrubber.value = cycleDay;
                }
            }
        });
    },

    scrub: function(val) {
        const saved = window.getSimState();
        const baseTime = saved.isLive ? Date.now() : saved.simTime;
        const currentDays = (baseTime - window.PYLON_ALPHA_DYNAMIC) / window.MS_DAY;
        const cycleBaseDays = Math.floor(currentDays / 365.24219) * 365.24219;
        const discreteDays = parseInt(val, 10);
        
        const targetMs = window.PYLON_ALPHA_DYNAMIC + ((cycleBaseDays + discreteDays) * window.MS_DAY);
        const d = new Date(targetMs);
        d.setUTCHours(12, 0, 0, 0);
        
        this.updateClock(false, d.getTime());
        if(window.Q_MobileBridge) window.Q_MobileBridge.pulse('LIGHT');
    },

    step: function(n) {
        const saved = window.getSimState();
        const baseTime = saved.isLive ? Date.now() : saved.simTime;
        const targetMs = baseTime + (n * window.MS_DAY);
        this.updateClock(false, targetMs);
        if(window.Q_MobileBridge) window.Q_MobileBridge.pulse('MEDIUM');
    },

    setLive: function() {
        this.updateClock(true, Date.now());
        if(window.Q_MobileBridge) window.Q_MobileBridge.pulse('HEAVY');
    },

    updateClock: function(isLive, simTime) {
        const payload = JSON.stringify({ isLive, simTime, scrubSpeed: 0 });
        localStorage.setItem('Q_MASTER_CLOCK', payload);
        window.dispatchEvent(new StorageEvent('storage', { key: 'Q_MASTER_CLOCK', newValue: payload }));
        this.syncUI();
    },

    syncUI: function() {
        const state = window.getSimState();
        const liveBtn = document.getElementById('q-live-toggle');
        const scrubber = document.getElementById('q-global-scrubber');
        
        if(liveBtn) {
            liveBtn.classList.toggle('active', state.isLive);
            liveBtn.innerText = state.isLive ? "LIVE" : "RESYNC";
        }
        
        if(scrubber && state.isLive === false && window.PYLON_ALPHA_DYNAMIC) {
            let daysElapsed = (state.simTime - window.PYLON_ALPHA_DYNAMIC) / window.MS_DAY;
            let cycleDay = Math.floor(daysElapsed % 365.24219);
            if (cycleDay < 0) cycleDay += 365;
            scrubber.value = cycleDay;
        }
    },

    openHub: function() { 
        this.injectDOM(); // Refresh DOM on open to reflect latest Q_STATE
        document.getElementById('unified-integration-hub').classList.add('active'); 
    },
    
    closeHub: function() { 
        document.getElementById('unified-integration-hub').classList.remove('active'); 
    }
};

window.addEventListener('DOMContentLoaded', () => window.Q_IntegrationHub.init());