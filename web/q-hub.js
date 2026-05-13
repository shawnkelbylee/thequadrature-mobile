// THE QUADRATURE: GLOBAL DASHBOARD & PRO MATRIX
// Architect: Kelby | Engineer: Kairos
// PROTOCOL: Account Settings, Calibration Module, Tiered Access Gate & Native Library Reader
// REVISION: 24.2.6 - Persistence Fix & Physiological Variable Relocation

window.Q_IntegrationHub = {
    viewState: 'closed',
    activeTab: 'guide',

    init: function() { 
        if(window.self !== window.top) return;
        this.injectCSS(); 
        this.injectDOM(); 
        if(window.Q_LOG) window.Q_LOG('INFO', 'CORE', 'PRO_MATRIX_INITIALIZED');
    },

    injectCSS: function() {
        if (document.getElementById('q-hub-css')) return;
        const style = document.createElement('style');
        style.id = 'q-hub-css';
        style.innerHTML = `
            .q-hub-overlay { position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.85); backdrop-filter: blur(12px); z-index: 10010; display: none; justify-content: center; align-items: center; pointer-events: auto; }
            .q-hub-overlay.active { display: flex; }
            .q-hub-box { width: 90vw; max-width: 550px; max-height: 85vh; background: #05080f; border: 1px solid var(--theme-dim, rgba(184,41,255,0.3)); border-radius: 4px; display: flex; flex-direction: column; overflow: hidden; box-shadow: 0 0 40px rgba(0,0,0,1); font-family: 'JetBrains Mono', monospace; }
            
            .q-hub-header { padding: 15px 20px; background: #0a0f1a; border-bottom: 1px solid #1a2235; display: flex; justify-content: space-between; align-items: center; }
            .q-hub-title { font-family: 'Orbitron', sans-serif; font-size: 1rem; color: var(--theme-main, #b829ff); font-weight: 900; letter-spacing: 4px; text-shadow: 0 0 10px var(--theme-dim); }
            .q-hub-close { background: transparent; border: none; color: #888; font-family: 'Orbitron'; font-size: 1.2rem; cursor: pointer; transition: color 0.2s; }
            .q-hub-close:hover { color: #fff; }
            
            .q-hub-nav { display: flex; border-bottom: 1px solid #1a2235; background: #0a0f1a; overflow-x: auto; scrollbar-width: none; }
            .q-hub-nav::-webkit-scrollbar { display: none; }
            .hub-tab-btn { flex: 1; min-width: 100px; padding: 12px 10px; background: transparent; border: none; color: #666; font-family: 'Orbitron'; font-size: 0.65rem; font-weight: 700; letter-spacing: 1px; cursor: pointer; transition: 0.3s; border-bottom: 2px solid transparent; white-space: nowrap; }
            .hub-tab-btn:hover { color: #aaa; }
            .hub-tab-btn.active { color: var(--theme-main); border-bottom: 2px solid var(--theme-main); text-shadow: 0 0 8px var(--theme-dim); background: rgba(255,255,255,0.02); }
            
            .q-hub-body { flex: 1; overflow-y: auto; padding: 20px; position: relative; }
            .hub-tab-content { display: none; animation: hubFadeIn 0.3s ease; }
            .hub-tab-content.active { display: block; }
            
            @keyframes hubFadeIn { from { opacity: 0; transform: translateY(5px); } to { opacity: 1; transform: translateY(0); } }

            .hub-input-group { margin-bottom: 15px; }
            .hub-input-lbl { display: block; font-family: 'Orbitron'; font-size: 0.55rem; color: #888; letter-spacing: 1px; margin-bottom: 5px; font-weight: 700; text-transform: uppercase; }
            .hub-input { width: 100%; background: #0a0f1a; border: 1px solid #1a2235; color: #fff; padding: 10px; font-family: 'JetBrains Mono'; font-size: 0.8rem; border-radius: 4px; box-sizing: border-box; transition: border-color 0.2s; outline: none; }
            .hub-input:focus { border-color: var(--theme-main); }
            .hub-input:disabled { opacity: 0.5; cursor: not-allowed; }
            
            .hub-checkbox-group { display: flex; align-items: center; gap: 10px; margin-bottom: 15px; font-size: 0.7rem; color: #aaa; cursor: pointer; }
            .hub-checkbox-group input { cursor: pointer; }

            .hub-action-btn { width: 100%; padding: 12px; background: transparent; border: 1px solid var(--theme-main); color: var(--theme-main); font-family: 'Orbitron'; font-size: 0.8rem; font-weight: 900; letter-spacing: 2px; cursor: pointer; border-radius: 4px; transition: all 0.3s; text-transform: uppercase; }
            .hub-action-btn:hover { background: var(--theme-dim); box-shadow: 0 0 15px var(--theme-dim); }

            .hub-tier-grid { display: grid; grid-template-columns: 1fr; gap: 15px; margin-top: 15px; }
            .tier-card { border: 1px solid #1a2235; background: #0a0f1a; padding: 15px; border-radius: 4px; position: relative; overflow: hidden; }
            .tier-card.locked { opacity: 0.7; }
            .tier-card.locked::after { content: ''; position: absolute; top:0; left:0; width:100%; height:100%; background: repeating-linear-gradient(45deg, transparent, transparent 10px, rgba(0,0,0,0.2) 10px, rgba(0,0,0,0.2) 20px); pointer-events: none; }
            .tier-head { display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px; border-bottom: 1px solid #1a2235; padding-bottom: 10px; }
            .tier-title { font-family: 'Orbitron'; font-size: 0.9rem; font-weight: 900; letter-spacing: 2px; }
            .tier-price { font-size: 0.7rem; color: #888; font-weight: 700; }
            .tier-list { list-style: none; padding: 0; margin: 0; font-size: 0.65rem; color: #aaa; line-height: 1.6; }
            .tier-list li::before { content: '>'; color: var(--theme-main); margin-right: 8px; font-weight: bold; }
            .tier-btn { margin-top: 15px; width: 100%; padding: 8px; font-size: 0.7rem; }

            /* Mobile scaling for modal */
            @media (max-width: 600px) {
                .q-hub-box { width: 95vw; max-height: 90vh; }
                .q-hub-nav { flex-wrap: wrap; }
                .hub-tab-btn { flex-basis: 33%; min-width: auto; padding: 10px 5px; font-size: 0.55rem; }
            }
        `;
        document.head.appendChild(style);
    },

    toggleTOB: function() {
        const isUnknown = document.getElementById('cal-tob-unknown').checked;
        const tobInput = document.getElementById('cal-tob');
        if(isUnknown) {
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

        if (!dob || !loc) {
            alert("DOB AND GEOLOCATION ARE REQUIRED.");
            return;
        }

        // 2. PERSISTENCE FIX: Write directly to browser memory immediately
        localStorage.setItem('q_dob', dob);
        localStorage.setItem('q_tob', isUnknown ? '12:00' : tob);
        localStorage.setItem('q_tob_unknown', isUnknown);
        localStorage.setItem('q_loc_name', loc.toUpperCase());


        // 3. Update dynamic state matrix only if the module is active
        if (window.Q_UpdateState) {
            window.Q_UpdateState('metaphysical_layer', 'dob', dob);
            window.Q_UpdateState('metaphysical_layer', 'tob', isUnknown ? '12:00' : tob);
            window.Q_UpdateState('metaphysical_layer', 'tob_unknown', isUnknown);
            window.Q_UpdateState('location', 'name', loc.toUpperCase());

        }

        // 4. BROADCAST: Force immediate re-render across all active vectors
        window.dispatchEvent(new Event('storage'));

        if(window.Q_LOG) window.Q_LOG('STATE', 'CORE', 'IDENTITY_PARAMETERS_UPDATED');
        
        const saveBtn = document.getElementById('btn-save-identity');
        const ogText = saveBtn.innerText;
        saveBtn.innerText = "CALIBRATION LOCKED";
        saveBtn.style.background = "var(--theme-main, #00f0ff)";
        saveBtn.style.color = "#000";
        
        setTimeout(() => {
            saveBtn.innerText = ogText;
            saveBtn.style.background = "transparent";
            saveBtn.style.color = "var(--theme-main, #00f0ff)";
        }, 2000);
    },

    requestStateGate: function(featureId, requiredTier, category) {
        if(window.Q_LOG) window.Q_LOG('WARN', 'AUTH', `ACCESS_DENIED [${featureId}] REQ: ${requiredTier}`);
        this.switchTab('pro');
        const proTab = document.getElementById('tab-content-pro');
        if(proTab) {
            const alertBox = document.createElement('div');
            alertBox.style.background = 'rgba(255, 0, 60, 0.1)';
            alertBox.style.border = '1px solid #ff003c';
            alertBox.style.color = '#ff003c';
            alertBox.style.padding = '10px';
            alertBox.style.fontSize = '0.65rem';
            alertBox.style.marginBottom = '15px';
            alertBox.style.borderRadius = '4px';
            alertBox.style.fontFamily = 'Orbitron';
            alertBox.innerHTML = `[ STATE GATE ] ACCESS TO '${featureId.toUpperCase()}' REQUIRES ${requiredTier} ENTITLEMENT.`;
            proTab.insertBefore(alertBox, proTab.firstChild);
            setTimeout(() => alertBox.remove(), 4000);
        }
    },

    injectDOM: function() {
        if (document.getElementById('unified-integration-hub')) {
            document.getElementById('unified-integration-hub').remove();
        }

        const renderBadge = (statusColor, textColor, text) => `<span style="font-size:0.55rem; background:${statusColor}; color:${textColor}; padding:4px 8px; border-radius:4px; font-weight:900; letter-spacing: 1px;">${text}</span>`;
        const renderUpgradeBtn = (feature, tier, category, color) => `<button onclick="window.Q_IntegrationHub.requestStateGate('${feature}', '${tier}', '${category}')" style="font-size:0.55rem; background:transparent; border:1px solid ${color}; color:${color}; padding:4px 8px; border-radius:4px; font-weight:900; letter-spacing: 1px; cursor:pointer; transition:0.3s; pointer-events:auto;" onmouseover="this.style.background='${color}'; this.style.color='#000';" onmouseout="this.style.background='transparent'; this.style.color='${color}';">UPGRADE</button>`;

        const authState = localStorage.getItem('Q_PRO_AUTH') === 'true' ? 'ACTIVE' : 'STANDBY';
        const authColor = authState === 'ACTIVE' ? '#39ff14' : '#00f0ff';
        const authText = authState === 'ACTIVE' ? '[ DISCONNECT MATRIX ]' : '[ AUTHENTICATE ]';

        let ents = [];
        if (authState === 'ACTIVE') {
            const entitlementsRaw = localStorage.getItem('Q_ENTITLEMENTS');
            try { ents = entitlementsRaw ? JSON.parse(entitlementsRaw) : []; } catch(e) {}
        }

        const isPersonalActive = ents.includes('PERSONAL') || ents.includes('PRO') || ents.includes('TEAM');
        const personalStatus = isPersonalActive ? renderBadge('#00f0ff', '#000', 'ACTIVE') : renderUpgradeBtn('biometric_api', 'PERSONAL TIER', 'hardware_hooks', '#00f0ff');

        const isProActive = ents.includes('PRO');
        const proStatus = isProActive ? renderBadge('#b829ff', '#000', 'ACTIVE') : renderUpgradeBtn('ai_diplomat', 'PRO TIER', 'logic_layer', '#b829ff');

        // Local Storage Fallback Resolution & Geolocation Override Force
        const sDob = window.Q_STATE?.metaphysical_layer?.dob || localStorage.getItem('q_dob') || "";
        const sTob = window.Q_STATE?.metaphysical_layer?.tob || localStorage.getItem('q_tob') || "12:00";
        const sTobUnknown = window.Q_STATE?.metaphysical_layer?.tob_unknown === true || localStorage.getItem('q_tob_unknown') === 'true';
        
        let sLoc = window.Q_STATE?.location?.name || localStorage.getItem('q_loc_name') || "CLEARWATER, FL";
        if (sLoc.toUpperCase().includes('LOS ANGELES')) sLoc = "CLEARWATER, FL";

        const sAi = window.Q_STATE?.logic_layer?.preferred_ai_diplomat || 'DEFAULT';
        const sDeepFlowEnforcement = window.Q_STATE?.logic_layer?.deep_flow_enforcement !== false;

        // Ephemeris Diagnostic: Reporting Native Edge-Computed State
        const isEphemerisActive = typeof swisseph !== 'undefined';
        const ephemerisBadge = isEphemerisActive ? renderBadge('#a7ff83', '#000', 'EDGE COMPUTE ACTIVE') : renderBadge('#ff3333', '#fff', 'OFFLINE / FALLBACK');

        const hubHTML = `
            <div id="unified-integration-hub" class="q-hub-overlay">
                <div class="q-hub-box">
                    <div class="q-hub-header">
                        <div class="q-hub-title">Q_HUB // SYSTEM_MATRIX</div>
                        <button class="q-hub-close" onclick="window.Q_IntegrationHub.closeHub()">&#x2715;</button>
                    </div>
                    
                    <div class="q-hub-nav">
                        <button class="hub-tab-btn ${this.activeTab === 'guide' ? 'active' : ''}" id="tab-btn-guide" onclick="window.Q_IntegrationHub.switchTab('guide')">GUIDE</button>
                        <button class="hub-tab-btn ${this.activeTab === 'identity' ? 'active' : ''}" id="tab-btn-identity" onclick="window.Q_IntegrationHub.switchTab('identity')">IDENTITY</button>
                        <button class="hub-tab-btn ${this.activeTab === 'pro' ? 'active' : ''}" id="tab-btn-pro" onclick="window.Q_IntegrationHub.switchTab('pro')">PRO MATRIX</button>
                        <button class="hub-tab-btn ${this.activeTab === 'system' ? 'active' : ''}" id="tab-btn-system" onclick="window.Q_IntegrationHub.switchTab('system')">SYSTEM</button>
                    </div>

                    <div class="q-hub-body">
                        
                        <div class="hub-tab-content ${this.activeTab === 'guide' ? 'active' : ''}" id="tab-content-guide">
                            <div style="font-family:'Orbitron'; font-size:0.75rem; color:var(--theme-main); font-weight:bold; margin-bottom:15px; letter-spacing:1px;">INITIALIZATION PROTOCOL</div>
                            <div style="font-size:0.65rem; color:#aaa; line-height: 1.6; margin-bottom: 20px;">
                                Welcome to <span style="color:#fff; font-weight:bold;">The Quadrature</span>. This interface is a biometric and planetary metrology engine designed to re-anchor human physiology to the True Ellipse (the actual physical orbit of the Earth) rather than the artificial 24-hour legacy grid.<br><br>
                                To achieve true synchronization, you must calibrate the engine to your exact physical coordinates.
                            </div>

                            <div style="background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.1); padding: 15px; border-radius: 4px; margin-bottom: 20px;">
                                <div style="color: #fff; font-family: 'Orbitron'; font-size: 0.65rem; font-weight: bold; margin-bottom: 8px;">STEP 1: CALIBRATE IDENTITY</div>
                                <div style="font-size: 0.6rem; color: #888; margin-bottom: 10px;">Navigate to the <b>IDENTITY</b> tab. Input your Geolocation and Birth coordinates. This arms the Swiss Ephemeris and calculates your precise $\\tau$-offset and baseline friction.</div>
                            </div>

                            <div style="font-family:'Orbitron'; font-size:0.75rem; color:#fff; font-weight:bold; margin-bottom:8px; border-bottom:1px dashed rgba(255,255,255,0.2); padding-bottom:4px;">MASTERING THE OMNI-PLANNER</div>
                            <div style="font-size:0.6rem; color:#aaa; line-height: 1.5; margin-bottom: 15px;">
                                <span style="color:#fff; font-weight:bold;">Primary Postulate:</span> Here and Now are Infinitely One!<br><br>
                                <span style="color:#fff; font-weight:bold;">Visual Routing:</span> The Omni-Planner acts as a transparent overlay, mapping your 90-to-120 minute ultradian rhythms over legacy 24-hour integers.<br><br>
                                <span style="color:#fff; font-weight:bold;">Friction Mapping:</span><br>
                                <span style="color:#a7ff83;">&#x25A0; Green (Deep Flow):</span> Prime window for high-stakes, focused intent.<br>
                                <span style="color:#00f0ff;">&#x25A0; Blue (DLMO Wind-Down):</span> Mandatory window to step back, rest, and discharge tension.<br>
                                <span style="color:#b829ff;">&#x25A0; Violet (Sleep Recovery):</span> Core biological restoration phase.<br>
                                <span style="color:#B97A35;">&#x25A0; Amber (Sleep Inertia):</span> Wake transition and cortisol stabilization.
                            </div>
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
                                <label class="hub-input-lbl">GEOLOCATION (CITY, REGION)</label>
                                <input type="text" id="cal-loc" class="hub-input" value="${sLoc}" placeholder="e.g. CLEARWATER, FL">
                            </div>

                            <button class="hub-action-btn" id="btn-save-identity" onclick="window.Q_IntegrationHub.saveIdentityParameters()" style="margin-top:10px;">COMMIT TO STATE</button>
                        </div>

                        <div class="hub-tab-content ${this.activeTab === 'pro' ? 'active' : ''}" id="tab-content-pro">
                            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:20px; border-bottom:1px solid #1a2235; padding-bottom:15px;">
                                <div>
                                    <div style="font-family:'Orbitron'; font-size:0.8rem; font-weight:900; color:#fff;">Q_AUTH HANDSHAKE</div>
                                    <div style="font-size:0.6rem; color:#888; margin-top:4px;">STATUS: <span style="color:${authColor}; font-weight:bold;">${authState}</span></div>
                                </div>
                                <button id="btn-trigger-auth" style="background:transparent; border:1px solid ${authColor}; color:${authColor}; padding:8px 15px; border-radius:4px; font-family:'Orbitron'; font-size:0.65rem; font-weight:900; cursor:pointer; transition:0.3s;">${authText}</button>
                            </div>

                            <div style="font-size:0.65rem; color:#aaa; line-height:1.5;">The Quadrature is a decentralized operating system. Upgrading to a licensed tier unlocks direct API bridging to your biological and schedule hardware.</div>
                            
                            <div class="hub-tier-grid">
                                <div class="tier-card ${isPersonalActive ? '' : 'locked'}" style="border-color: ${isPersonalActive ? '#00f0ff' : '#1a2235'}; box-shadow: ${isPersonalActive ? '0 0 20px rgba(0,240,255,0.1)' : 'none'};">
                                    <div class="tier-head">
                                        <div>
                                            <div class="tier-title" style="color:#00f0ff;">PERSONAL TIER</div>
                                            <div class="tier-price">$12.00 / MONTH</div>
                                        </div>
                                        <div>${personalStatus}</div>
                                    </div>
                                    <ul class="tier-list">
                                        <li>Biometric Hardware API (Oura, Apple, Whoop)</li>
                                        <li>Live Weather / Irradiance Integration</li>
                                        <li>Cloud State Sync across devices</li>
                                    </ul>
                                </div>

                                <div class="tier-card ${isProActive ? '' : 'locked'}" style="border-color: ${isProActive ? '#b829ff' : '#1a2235'}; box-shadow: ${isProActive ? '0 0 20px rgba(184,41,255,0.1)' : 'none'};">
                                    <div class="tier-head">
                                        <div>
                                            <div class="tier-title" style="color:#b829ff;">PRO TIER</div>
                                            <div class="tier-price">$45.00 / MONTH</div>
                                        </div>
                                        <div>${proStatus}</div>
                                    </div>
                                    <ul class="tier-list">
                                        <li>Enterprise Calendar APIs (Google, Outlook 365)</li>
                                        <li>AI Diplomat (Automated Meeting Rescheduling)</li>
                                        <li>Predictive Tension Scoring</li>
                                    </ul>
                                </div>
                            </div>
                        </div>

                        <div class="hub-tab-content ${this.activeTab === 'system' ? 'active' : ''}" id="tab-content-system">
                            <div style="font-family:'Orbitron'; font-size:0.75rem; color:#fff; font-weight:bold; margin-bottom:15px; border-bottom:1px solid #1a2235; padding-bottom:8px;">SYSTEM DIAGNOSTICS</div>
                            
                            <div style="display:flex; justify-content:space-between; margin-bottom:10px; font-size:0.65rem;">
                                <span style="color:#888;">SWISS EPHEMERIS (C_WASM):</span>
                                ${ephemerisBadge}
                            </div>
                            
                            <div style="display:flex; justify-content:space-between; margin-bottom:10px; font-size:0.65rem;">
                                <span style="color:#888;">RENDER PIPELINE:</span>
                                <span style="color:#fff; font-weight:bold;">WEBGL / CANVAS 2D</span>
                            </div>

                            <div style="display:flex; justify-content:space-between; margin-bottom:20px; font-size:0.65rem;">
                                <span style="color:#888;">LOGIC ENGINE:</span>
                                <span style="color:#fff; font-weight:bold;">v24.2.6 // KELBY ARCHITECTURE</span>
                            </div>

                            <div style="font-family:'Orbitron'; font-size:0.75rem; color:#fff; font-weight:bold; margin-bottom:15px; border-bottom:1px solid #1a2235; padding-bottom:8px;">LOGIC_LAYER PREFERENCES</div>

                            <div class="hub-input-group">
                                <label class="hub-input-lbl">PREFERRED AI DIPLOMAT TONE (PRO)</label>
                                <select id="sys-ai-tone" class="hub-input" disabled>
                                    <option value="DEFAULT" ${sAi==='DEFAULT'?'selected':''}>DEFAULT (NEUTRAL)</option>
                                    <option value="ASSERTIVE" ${sAi==='ASSERTIVE'?'selected':''}>ASSERTIVE (STRICT BOUNDARIES)</option>
                                    <option value="ACCOMMODATING" ${sAi==='ACCOMMODATING'?'selected':''}>ACCOMMODATING (FLEXIBLE)</option>
                                </select>
                            </div>

                            <label class="hub-checkbox-group">
                                <input type="checkbox" id="sys-flow-enforce" ${sDeepFlowEnforcement ? 'checked' : ''} disabled> Hard Enforce Deep Flow Boundaries (Auto-Decline Conflicts)
                            </label>
                            
                            <div style="margin-top: 30px; border-top: 1px solid #1a2235; padding-top: 15px; text-align: center;">
                                <button onclick="window.Q_IntegrationHub.hardReset()" style="background:transparent; border:1px solid #ff3333; color:#ff3333; padding:8px 15px; border-radius:4px; font-family:'Orbitron'; font-size:0.6rem; font-weight:900; cursor:pointer; transition:0.3s;" onmouseover="this.style.background='#ff3333'; this.style.color='#000';" onmouseout="this.style.background='transparent'; this.style.color='#ff3333';">PURGE LOCAL STATE (HARD RESET)</button>
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        `;
        document.body.insertAdjacentHTML('beforeend', hubHTML);

        this.bindEvents(authState);
    },

    hardReset: function() {
        if(confirm("CRITICAL WARNING: This will purge all local identity data, coordinates, and system preferences. The UI will reload. Proceed?")) {
            localStorage.clear();
            sessionStorage.clear();
            window.location.reload();
        }
    },

    switchTab: function(tabId) {
        this.activeTab = tabId;
        document.querySelectorAll('.hub-tab-btn').forEach(b => b.classList.remove('active'));
        document.querySelectorAll('.hub-tab-content').forEach(c => c.classList.remove('active'));
        
        const btn = document.getElementById(`tab-btn-${tabId}`);
        const content = document.getElementById(`tab-content-${tabId}`);
        
        if (btn) btn.classList.add('active');
        if (content) content.classList.add('active');
    },

    bindEvents: function(authState) {
        const authBtn = document.getElementById('btn-trigger-auth');
        if (authBtn) {
            authBtn.addEventListener('click', () => {
                if (authState === 'ACTIVE') {
                    try {
                        if (window.Q_Auth && typeof window.Q_Auth.signOut === 'function') {
                            window.Q_Auth.signOut();
                        } else {
                            localStorage.setItem('Q_PRO_AUTH', 'false');
                            window.location.reload();
                        }
                    } catch(err) { console.error('OAuth Disconnect Error:', err); }
                } else {
                    try {
                        if (window.Q_Auth && typeof window.Q_Auth.triggerOAuth === 'function') {
                            window.Q_Auth.triggerOAuth();
                        } else {
                            console.error('CRITICAL: window.Q_Auth module not detected.');
                            alert('[ AUTH ERROR ] Authentication provider not found. Check bridge configuration.');
                        }
                    } catch(err) { console.error('OAuth Connect Error:', err); }
                }
            });
        }
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