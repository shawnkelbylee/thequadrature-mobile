// THE QUADRATURE: GLOBAL DASHBOARD & SOVEREIGN MATRIX
// Architect: Kelby | Engineer: Kairos
// PROTOCOL: Account Settings, Calibration Module, & Tiered Access Gate

window.Q_IntegrationHub = {
    viewState: 'closed',
    activeTab: 'identity',

    init: function() { 
        if(window.self !== window.top) return;
        this.injectCSS(); 
        this.injectDOM(); 
        if(window.Q_LOG) window.Q_LOG('INFO', 'CORE', 'SOVEREIGN_MATRIX_INITIALIZED');
    },

    injectCSS: function() {
        if (document.getElementById('q-hub-css')) return;
        const style = document.createElement('style');
        style.id = 'q-hub-css';
        style.innerHTML = `
            .q-hub-overlay { position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.85); backdrop-filter: blur(12px); z-index: 10010; display: none; justify-content: center; align-items: center; pointer-events: auto; }
            .q-hub-overlay.active { display: flex; }
            .q-hub-box { width: 90vw; max-width: 550px; max-height: 85vh; overflow-y: auto; background: rgba(5, 8, 15, 0.95); border: 1px solid var(--theme-main, #ff003c) !important; border-radius: 8px; padding: 25px; box-sizing: border-box; box-shadow: 0 20px 50px rgba(0,0,0,0.9); display: flex; flex-direction: column; gap: 15px; color: #fff; font-family: 'JetBrains Mono', monospace; pointer-events: auto; }
            
            .q-hub-box::-webkit-scrollbar { width: 6px; }
            .q-hub-box::-webkit-scrollbar-track { background: rgba(0,0,0,0.2); }
            .q-hub-box::-webkit-scrollbar-thumb { background: var(--theme-main, #ff003c) !important; border-radius: 3px; }

            .hub-header { font-family:'Orbitron'; text-align:center; padding-bottom:15px; font-size: 1.1rem; color: var(--theme-main, #ff003c); font-weight: 900; letter-spacing: 2px; text-shadow: 0 0 10px rgba(255,0,60,0.2); border-bottom: 1px dashed rgba(255,255,255,0.2); }
            
            .hub-tabs { display: flex; border-bottom: 1px solid rgba(255,255,255,0.1); margin-bottom: 15px; gap: 5px; }
            .hub-tab-btn { flex: 1; background: transparent; border: none; color: rgba(255,255,255,0.6); font-family: 'Orbitron'; font-size: 0.65rem; font-weight: 700; padding: 10px 5px; cursor: pointer; transition: 0.3s; letter-spacing: 1px; border-bottom: 2px solid transparent; }
            .hub-tab-btn:hover { color: #fff; background: rgba(255,255,255,0.05); }
            .hub-tab-btn.active { color: var(--theme-main, #ff003c); border-bottom-color: var(--theme-main, #ff003c); background: rgba(255,0,60,0.05); }

            .hub-tab-content { display: none; flex-direction: column; gap: 15px; animation: fadeIn 0.3s ease; }
            .hub-tab-content.active { display: flex; }
            @keyframes fadeIn { from { opacity: 0; transform: translateY(5px); } to { opacity: 1; transform: translateY(0); } }

            .hub-tier-row { background:rgba(0,0,0,0.5); border:1px solid rgba(255,255,255,0.1); padding:12px; border-radius:6px; display:flex; justify-content:space-between; align-items:center; transition: 0.3s; pointer-events: auto; }
            .hub-tier-row:hover { border-color: var(--theme-main) !important; box-shadow: inset 0 0 10px rgba(255, 255, 255, 0.1); }
            
            .hub-input-group { display: flex; flex-direction: column; gap: 4px; }
            .hub-input-lbl { font-size: 0.6rem; color: rgba(255,255,255,0.6); font-family: 'Orbitron'; letter-spacing: 1px; }
            .hub-input { background: rgba(0,0,0,0.6); border: 1px solid rgba(255,255,255,0.3); color: #fff; padding: 10px; font-family: 'JetBrains Mono'; font-size: 0.8rem; border-radius: 4px; outline: none; transition: 0.3s; width: 100%; box-sizing: border-box; }
            .hub-input:focus { border-color: var(--theme-main, #ff003c); box-shadow: 0 0 10px rgba(255,0,60,0.2); }
            .hub-input:disabled { opacity: 0.5; cursor: not-allowed; }

            .hub-checkbox-group { display: flex; align-items: center; gap: 8px; font-size: 0.65rem; color: rgba(255,255,255,0.6); cursor: pointer; }
            .hub-checkbox-group input[type="checkbox"] { accent-color: var(--theme-main, #ff003c); width: 14px; height: 14px; cursor: pointer; }

            .hub-action-btn { background: rgba(0,0,0,0.8); border: 1px solid var(--theme-main, #ff003c); color: var(--theme-main, #ff003c); font-family: 'Orbitron'; font-weight: 900; padding: 12px; cursor: pointer; letter-spacing: 2px; border-radius: 4px; transition: 0.3s; width: 100%; text-transform: uppercase; }
            .hub-action-btn:hover { background: var(--theme-main, #ff003c); color: #000; box-shadow: 0 0 15px var(--theme-main, #ff003c); }
            
            .hub-close-btn { background: transparent; border: 1px solid rgba(255,255,255,0.6); color: rgba(255,255,255,0.6); font-family: 'Orbitron'; font-weight: 700; padding: 10px; cursor: pointer; letter-spacing: 1px; border-radius: 4px; transition: 0.3s; width: 100%; margin-top: 10px; }
            .hub-close-btn:hover { background: rgba(255,255,255,0.1); color: #fff; border-color: #fff; }

            .support-links { border-top: 1px dashed rgba(255,255,255,0.2); padding-top: 15px; margin-top: 10px; display: flex; flex-wrap: wrap; justify-content: center; gap: 12px; font-size: 0.6rem; font-family: 'Orbitron'; font-weight: 700; }
            .support-links a { color: rgba(255,255,255,0.6); text-decoration: none; transition: 0.3s; letter-spacing: 1px; }
            .support-links a:hover { color: var(--theme-main, #ff003c); text-shadow: 0 0 8px rgba(255,0,60,0.5); }
            .support-links a.highlight { color: #F4D068; }
            .support-links a.highlight:hover { color: #fff; text-shadow: 0 0 10px #F4D068; }
        `;
        document.head.appendChild(style);
    },

    requestStateGate: function(featureKey, tierLevel, categoryKey) {
        if(window.Q_LOG) window.Q_LOG('WARN', 'CAPITAL', 'TIER_UPGRADE_REQUIRED', { feature: featureKey, required_tier: tierLevel });
        
        if (window.ReactNativeWebView) {
            window.ReactNativeWebView.postMessage(JSON.stringify({ action: 'TRIGGER_PAYWALL', tier: tierLevel, feature: featureKey }));
        } else {
            alert(`[ THE QUADRATURE: SOVEREIGN MATRIX ]\nAccess to ${featureKey.toUpperCase()} requires ${tierLevel} verification.\n\nProceeding to gateway simulation...`);
            if(categoryKey && window.Q_STATE[categoryKey]) {
                window.Q_UpdateState(categoryKey, featureKey, 'ACTIVE');
            }
            this.injectDOM(); 
        }
    },

    switchTab: function(tabId) {
        this.activeTab = tabId;
        document.querySelectorAll('.hub-tab-btn').forEach(btn => btn.classList.remove('active'));
        document.querySelectorAll('.hub-tab-content').forEach(content => content.classList.remove('active'));
        
        const btn = document.getElementById(`tab-btn-${tabId}`);
        const content = document.getElementById(`tab-content-${tabId}`);
        if(btn) btn.classList.add('active');
        if(content) content.classList.add('active');
    },

    toggleTOB: function() {
        const isUnknown = document.getElementById('cal-tob-unknown').checked;
        const tobInput = document.getElementById('cal-tob');
        if (isUnknown) {
            tobInput.disabled = true;
            tobInput.value = "12:00";
        } else {
            tobInput.disabled = false;
        }
    },

    saveIdentityParameters: function() {
        const dob = document.getElementById('cal-dob').value;
        const tob = document.getElementById('cal-tob').value;
        const isUnknown = document.getElementById('cal-tob-unknown').checked;
        const loc = document.getElementById('cal-loc').value;
        const anchor = document.getElementById('cal-anchor').value;
        const natal = document.getElementById('cal-natal').value;

        if (!dob || !loc || !anchor) {
            alert("DOB, GEOLOCATION, AND WAKE ANCHOR ARE REQUIRED.");
            return;
        }

        window.Q_UpdateState('metaphysical_layer', 'dob', dob);
        window.Q_UpdateState('metaphysical_layer', 'tob', isUnknown ? '12:00' : tob);
        window.Q_UpdateState('metaphysical_layer', 'tob_unknown', isUnknown);
        window.Q_UpdateState('location', 'name', loc.toUpperCase());
        window.Q_UpdateState('metaphysical_layer', 'natal_anchor', natal);

        const parts = anchor.split(':');
        const mins = (parseInt(parts[0]) * 60) + parseInt(parts[1]);
        localStorage.setItem('q_bio_anchor', mins);

        if(window.Q_LOG) window.Q_LOG('STATE', 'CORE', 'IDENTITY_PARAMETERS_UPDATED');
        
        const saveBtn = document.getElementById('btn-save-identity');
        const ogText = saveBtn.innerText;
        saveBtn.innerText = "CALIBRATION LOCKED";
        saveBtn.style.background = "var(--theme-main, #ff003c)";
        saveBtn.style.color = "#000";
        
        setTimeout(() => {
            saveBtn.innerText = ogText;
            saveBtn.style.background = "rgba(0,0,0,0.8)";
            saveBtn.style.color = "var(--theme-main, #ff003c)";
        }, 2000);
    },

    injectDOM: function() {
        const existing = document.getElementById('unified-integration-hub');
        if (existing) existing.remove();

        const dom = document.createElement('div');
        dom.className = 'q-hub-overlay';
        dom.id = 'unified-integration-hub';
        
        const renderBadge = (statusColor, textColor, text) => `<span style="font-size:0.55rem; background:${statusColor}; color:${textColor}; padding:4px 8px; border-radius:4px; font-weight:900; letter-spacing: 1px;">${text}</span>`;
        const renderUpgradeBtn = (feature, tier, category, color) => `<button onclick="window.Q_IntegrationHub.requestStateGate('${feature}', '${tier}', '${category}')" style="font-size:0.55rem; background:transparent; border:1px solid ${color}; color:${color}; padding:4px 8px; border-radius:4px; font-weight:900; letter-spacing: 1px; cursor:pointer; transition:0.3s; pointer-events:auto;" onmouseover="this.style.background='${color}'; this.style.color='#000';" onmouseout="this.style.background='transparent'; this.style.color='${color}';">UPGRADE</button>`;

        const isBioActive = window.Q_STATE?.hardware_hooks?.biometric_api === 'ACTIVE';
        const bioStatus = isBioActive ? renderBadge('#39ff14', '#000', 'ACTIVE') : renderUpgradeBtn('biometric_api', 'STANDARD TIER', 'hardware_hooks', '#39ff14');

        const isEphActive = window.Q_STATE?.metaphysical_layer?.swiss_ephemeris === 'ACTIVE';
        const ephStatus = isEphActive ? renderBadge('#00f0ff', '#000', 'ACTIVE') : renderUpgradeBtn('swiss_ephemeris', 'RESONANT TIER', 'metaphysical_layer', '#00f0ff');

        const isSyndicateActive = window.Q_STATE?.metaphysical_layer?.patreon_gating === 'ACTIVE';
        const syndicateStatus = isSyndicateActive ? renderBadge('#ff003c', '#fff', 'ACTIVE') : renderUpgradeBtn('patreon_gating', 'SYNDICATE TIER', 'metaphysical_layer', '#ff003c');

        const isFiatActive = window.Q_STATE?.capital_ledger?.fiat_api === 'ACTIVE';
        const fiatStatus = isFiatActive ? renderBadge('#F4D068', '#000', 'ACTIVE') : renderUpgradeBtn('fiat_api', 'ENTERPRISE TIER', 'capital_ledger', '#F4D068');

        // Identity Data Retrieval
        const sDob = window.Q_STATE?.metaphysical_layer?.dob || "";
        const sTob = window.Q_STATE?.metaphysical_layer?.tob || "12:00";
        const sTobUnknown = window.Q_STATE?.metaphysical_layer?.tob_unknown === true;
        const sLoc = window.Q_STATE?.location?.name || "";
        const sNatal = window.Q_STATE?.metaphysical_layer?.natal_anchor || "NONE";
        const savedAnchorMins = parseInt(localStorage.getItem('q_bio_anchor')) || 0;
        const sAnchorStr = `${Math.floor(savedAnchorMins / 60).toString().padStart(2, '0')}:${(savedAnchorMins % 60).toString().padStart(2, '0')}`;

        // Diagnostic Status Retrieval
        const jplStatus = window.EPHEMERIS_LIVE ? '<span style="color:#39ff14; text-shadow:0 0 5px rgba(57,255,20,0.5);">[ CONNECTED / LIVE ]</span>' : '<span style="color:#ff003c; text-shadow:0 0 5px rgba(255,0,60,0.5);">[ DISCONNECTED / FAILOVER ]</span>';
        const swissStatus = isEphActive ? '<span style="color:#00f0ff; text-shadow:0 0 5px rgba(0,240,255,0.5);">[ API ACTIVE ]</span>' : '<span style="color:#aaa;">[ STANDBY / INACTIVE ]</span>';

        dom.innerHTML = `
            <div class="q-hub-box" onclick="event.stopPropagation()">
                <div class="hub-header">SOVEREIGN MATRIX // ACCOUNT</div>
                
                <div class="hub-tabs">
                    <button class="hub-tab-btn ${this.activeTab === 'identity' ? 'active' : ''}" id="tab-btn-identity" onclick="window.Q_IntegrationHub.switchTab('identity')">IDENTITY</button>
                    <button class="hub-tab-btn ${this.activeTab === 'tiers' ? 'active' : ''}" id="tab-btn-tiers" onclick="window.Q_IntegrationHub.switchTab('tiers')">TIER STATUS</button>
                    <button class="hub-tab-btn ${this.activeTab === 'prefs' ? 'active' : ''}" id="tab-btn-prefs" onclick="window.Q_IntegrationHub.switchTab('prefs')">PREFERENCES</button>
                </div>

                <div class="hub-tab-content ${this.activeTab === 'identity' ? 'active' : ''}" id="tab-content-identity">
                    <div style="font-size:0.65rem; color:#aaa; margin-bottom: 5px; line-height: 1.4;">Define your personal metrological anchors to calibrate the physics engine and Swiss Ephemeris.</div>
                    
                    <div style="display:flex; gap:10px;">
                        <div class="hub-input-group" style="flex:2;">
                            <label class="hub-input-lbl">DATE OF BIRTH</label>
                            <input type="date" id="cal-dob" class="hub-input" value="${sDob}">
                        </div>
                        <div class="hub-input-group" style="flex:1;">
                            <label class="hub-input-lbl">TIME OF BIRTH</label>
                            <input type="time" id="cal-tob" class="hub-input" value="${sTob}" ${sTobUnknown ? 'disabled' : ''}>
                        </div>
                    </div>
                    <label class="hub-checkbox-group" style="justify-content: flex-end; margin-top:-10px;">
                        <input type="checkbox" id="cal-tob-unknown" onchange="window.Q_IntegrationHub.toggleTOB()" ${sTobUnknown ? 'checked' : ''}> Exact Time Unknown (Defaults 12:00)
                    </label>

                    <div class="hub-input-group">
                        <label class="hub-input-lbl">NATAL ANCHOR (ZODIACAL)</label>
                        <select id="cal-natal" class="hub-input">
                            <option value="NONE" ${sNatal==='NONE'?'selected':''}>-- UNASSIGNED --</option>
                            <option value="ARIES" ${sNatal==='ARIES'?'selected':''}>ARIES</option><option value="TAURUS" ${sNatal==='TAURUS'?'selected':''}>TAURUS</option><option value="GEMINI" ${sNatal==='GEMINI'?'selected':''}>GEMINI</option>
                            <option value="CANCER" ${sNatal==='CANCER'?'selected':''}>CANCER</option><option value="LEO" ${sNatal==='LEO'?'selected':''}>LEO</option><option value="VIRGO" ${sNatal==='VIRGO'?'selected':''}>VIRGO</option>
                            <option value="LIBRA" ${sNatal==='LIBRA'?'selected':''}>LIBRA</option><option value="SCORPIO" ${sNatal==='SCORPIO'?'selected':''}>SCORPIO</option><option value="SAGITTARIUS" ${sNatal==='SAGITTARIUS'?'selected':''}>SAGITTARIUS</option>
                            <option value="CAPRICORN" ${sNatal==='CAPRICORN'?'selected':''}>CAPRICORN</option><option value="AQUARIUS" ${sNatal==='AQUARIUS'?'selected':''}>AQUARIUS</option><option value="PISCES" ${sNatal==='PISCES'?'selected':''}>PISCES</option>
                        </select>
                    </div>

                    <div class="hub-input-group">
                        <label class="hub-input-lbl">GEOLOCATION (CITY, REGION)</label>
                        <input type="text" id="cal-loc" class="hub-input" value="${sLoc}" placeholder="e.g. CLEARWATER, FL">
                    </div>

                    <div class="hub-input-group">
                        <label class="hub-input-lbl">WAKE ANCHOR (UTC)</label>
                        <input type="time" id="cal-anchor" class="hub-input" value="${sAnchorStr}">
                    </div>

                    <button class="hub-action-btn" id="btn-save-identity" onclick="window.Q_IntegrationHub.saveIdentityParameters()" style="margin-top:10px;">COMMIT TO STATE</button>
                </div>

                <div class="hub-tab-content ${this.activeTab === 'tiers' ? 'active' : ''}" id="tab-content-tiers">
                    <div class="hub-tier-row" style="border-color: rgba(255,255,255,0.3);">
                        <div>
                            <div style="font-family:'Orbitron'; font-size:0.75rem; color:#fff; font-weight: bold;">BASIC TIER ($9.99/mo)</div>
                            <div style="font-size:0.55rem; color:#888; margin-top: 4px;">Full Vector HUDs & Omni-Planner.</div>
                        </div>
                        ${renderBadge('#fff', '#000', 'ACTIVE')}
                    </div>

                    <div class="hub-tier-row">
                        <div>
                            <div style="font-family:'Orbitron'; font-size:0.75rem; color:#39ff14; font-weight: bold;">STANDARD TIER ($14.99/mo)</div>
                            <div style="font-size:0.55rem; color:#888; margin-top: 4px;">Health Connect/HealthKit integration.</div>
                        </div>
                        ${bioStatus}
                    </div>

                    <div class="hub-tier-row">
                        <div>
                            <div style="font-family:'Orbitron'; font-size:0.75rem; color:#00f0ff; font-weight: bold;">RESONANT TIER ($19.99/mo)</div>
                            <div style="font-size:0.55rem; color:#888; margin-top: 4px;">Swiss Ephemeris precision mapping.</div>
                        </div>
                        ${ephStatus}
                    </div>
                    
                    <div class="hub-tier-row" style="background: rgba(255,0,60,0.05);">
                        <div>
                            <div style="font-family:'Orbitron'; font-size:0.75rem; color:#ff003c; font-weight: bold;">SYNDICATE TIER ($24.99/mo)</div>
                            <div style="font-size:0.55rem; color:#888; margin-top: 4px;">P2P Social License & Deep Flow.</div>
                        </div>
                        ${syndicateStatus}
                    </div>

                    <div class="hub-tier-row">
                        <div>
                            <div style="font-family:'Orbitron'; font-size:0.75rem; color:#F4D068; font-weight: bold;">ENTERPRISE TIER ($199.00+/mo)</div>
                            <div style="font-size:0.55rem; color:#888; margin-top: 4px;">B2B Resonance & Civil Ledger Exporter.</div>
                        </div>
                        ${fiatStatus}
                    </div>
                </div>

                <div class="hub-tab-content ${this.activeTab === 'prefs' ? 'active' : ''}" id="tab-content-prefs">
                    <div class="hub-input-group">
                        <label class="hub-input-lbl">SYSTEM AUDIO NOTIFICATIONS</label>
                        <select class="hub-input">
                            <option value="ALL">ALL ALERTS & CUES</option>
                            <option value="CRITICAL">CRITICAL THERMODYNAMIC ONLY</option>
                            <option value="NONE">SILENT OPERATION</option>
                        </select>
                    </div>
                    <div class="hub-input-group">
                        <label class="hub-input-lbl">FINANCIAL API BRIDGE (ENTERPRISE)</label>
                        <button class="hub-action-btn" style="background:rgba(244, 208, 104, 0.1); border-color:var(--gold); color:var(--gold);" ${isFiatActive ? '' : 'disabled'}>${isFiatActive ? 'MANAGE PLAID / STRIPE' : 'LOCKED (REQUIRES ENTERPRISE)'}</button>
                    </div>
                    
                    <div style="border-top: 1px dashed rgba(255,255,255,0.2); padding-top: 15px; margin-top: 5px;">
                        <div style="font-family:'Orbitron'; font-size:0.75rem; color:#fff; font-weight:bold; margin-bottom:10px; text-shadow:0 0 8px rgba(255,255,255,0.3);">SYSTEM DIAGNOSTICS</div>
                        <div class="hub-input-group" style="margin-bottom: 8px;">
                            <label class="hub-input-lbl">NASA JPL HORIZONS BARYCENTRIC API</label>
                            <div style="font-family:'JetBrains Mono'; font-size:0.65rem; background:rgba(0,0,0,0.4); padding:6px 10px; border-radius:4px; border:1px solid rgba(255,255,255,0.1);">${jplStatus}</div>
                        </div>
                        <div class="hub-input-group">
                            <label class="hub-input-lbl">SWISS EPHEMERIS API</label>
                            <div style="font-family:'JetBrains Mono'; font-size:0.65rem; background:rgba(0,0,0,0.4); padding:6px 10px; border-radius:4px; border:1px solid rgba(255,255,255,0.1);">${swissStatus}</div>
                        </div>
                    </div>
                </div>

                <div class="support-links">
                    <a href="#">[ HELP ]</a>
                    <a href="#">[ CONTACT US ]</a>
                    <a href="#">[ TECH SUPPORT ]</a>
                    <a href="#" class="highlight">[ POD / DIGITAL PRINT ]</a>
                </div>

                <button class="hub-close-btn" onclick="window.Q_IntegrationHub.closeHub()">DISMISS MATRIX</button>
            </div>
        `;
        document.body.appendChild(dom);
    },

    openHub: function() { 
        this.injectDOM(); 
        document.getElementById('unified-integration-hub').classList.add('active'); 
    },
    
    closeHub: function() { 
        const hub = document.getElementById('unified-integration-hub');
        if(hub) hub.classList.remove('active'); 
    }
};

window.addEventListener('DOMContentLoaded', () => window.Q_IntegrationHub.init());