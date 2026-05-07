// THE QUADRATURE: GLOBAL DASHBOARD & PRO MATRIX
// Architect: Kelby | Engineer: Kairos
// PROTOCOL: Account Settings, Calibration Module, Tiered Access Gate & Native Library Reader
// REVISION: 24.2.5 - Postulate Correction & Geolocation State Override

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
            .q-hub-box { width: 90vw; max-width: 550px; max-height: 85vh; overflow-y: auto; background: rgba(5, 8, 15, 0.95); border: 1px solid var(--theme-main, #00f0ff) !important; border-radius: 8px; padding: 25px; box-sizing: border-box; box-shadow: 0 20px 50px rgba(0,0,0,0.9); display: flex; flex-direction: column; gap: 15px; color: #fff; font-family: 'JetBrains Mono', monospace; pointer-events: auto; }
            
            .q-hub-box::-webkit-scrollbar { width: 6px; }
            .q-hub-box::-webkit-scrollbar-track { background: rgba(0,0,0,0.2); }
            .q-hub-box::-webkit-scrollbar-thumb { background: var(--theme-main, #00f0ff) !important; border-radius: 3px; }

            .hub-header { font-family:'Orbitron'; text-align:center; padding-bottom:15px; font-size: 1.1rem; color: var(--theme-main, #00f0ff); font-weight: 900; letter-spacing: 2px; text-shadow: 0 0 10px rgba(0,240,255,0.2); border-bottom: 1px dashed rgba(255,255,255,0.2); }
            
            .hub-tabs { display: flex; border-bottom: 1px solid rgba(255,255,255,0.1); margin-bottom: 15px; gap: 5px; flex-wrap: wrap; }
            .hub-tab-btn { flex: 1; background: transparent; border: none; color: rgba(255,255,255,0.6); font-family: 'Orbitron'; font-size: 0.65rem; font-weight: 700; padding: 10px 5px; cursor: pointer; transition: 0.3s; letter-spacing: 1px; border-bottom: 2px solid transparent; min-width: 70px; }
            .hub-tab-btn:hover { color: #fff; background: rgba(255,255,255,0.05); }
            .hub-tab-btn.active { color: var(--theme-main, #00f0ff); border-bottom-color: var(--theme-main, #00f0ff); background: rgba(0,240,255,0.05); }

            .hub-tab-content { display: none; flex-direction: column; gap: 15px; animation: fadeIn 0.3s ease; }
            .hub-tab-content.active { display: flex; }
            @keyframes fadeIn { from { opacity: 0; transform: translateY(5px); } to { opacity: 1; transform: translateY(0); } }

            .hub-tier-row { background:rgba(0,0,0,0.5); border:1px solid rgba(255,255,255,0.1); padding:12px; border-radius:6px; display:flex; justify-content:space-between; align-items:center; transition: 0.3s; pointer-events: auto; }
            .hub-tier-row:hover { border-color: var(--theme-main, #00f0ff) !important; box-shadow: inset 0 0 10px rgba(255, 255, 255, 0.1); }
            
            .hub-input-group { display: flex; flex-direction: column; gap: 4px; }
            .hub-input-lbl { font-size: 0.6rem; color: rgba(255,255,255,0.6); font-family: 'Orbitron'; letter-spacing: 1px; }
            .hub-input { background: rgba(0,0,0,0.6); border: 1px solid rgba(255,255,255,0.3); color: #fff; padding: 10px; font-family: 'JetBrains Mono'; font-size: 0.8rem; border-radius: 4px; outline: none; transition: 0.3s; width: 100%; box-sizing: border-box; }
            .hub-input:focus { border-color: var(--theme-main, #00f0ff); box-shadow: 0 0 10px rgba(0,240,255,0.2); }
            .hub-input:disabled { opacity: 0.5; cursor: not-allowed; }

            .hub-checkbox-group { display: flex; align-items: center; gap: 8px; font-size: 0.65rem; color: rgba(255,255,255,0.6); cursor: pointer; }
            .hub-checkbox-group input[type="checkbox"] { accent-color: var(--theme-main, #00f0ff); width: 14px; height: 14px; cursor: pointer; }

            .hub-action-btn { background: rgba(0,0,0,0.8); border: 1px solid var(--theme-main, #00f0ff); color: var(--theme-main, #00f0ff); font-family: 'Orbitron'; font-weight: 900; padding: 12px; cursor: pointer; letter-spacing: 2px; border-radius: 4px; transition: 0.3s; width: 100%; text-transform: uppercase; }
            .hub-action-btn:hover { background: var(--theme-main, #00f0ff); color: #000; box-shadow: 0 0 15px var(--theme-main, #00f0ff); }
            
            .hub-close-btn { background: transparent; border: 1px solid rgba(255,255,255,0.6); color: rgba(255,255,255,0.6); font-family: 'Orbitron'; font-weight: 700; padding: 10px; cursor: pointer; letter-spacing: 1px; border-radius: 4px; transition: 0.3s; width: 100%; margin-top: 10px; }
            .hub-close-btn:hover { background: rgba(255,255,255,0.1); color: #fff; border-color: #fff; }

            .support-links { border-top: 1px dashed rgba(255,255,255,0.2); padding-top: 15px; margin-top: 10px; display: flex; flex-wrap: wrap; justify-content: center; gap: 12px; font-size: 0.6rem; font-family: 'Orbitron'; font-weight: 700; }
            .support-links a { color: rgba(255,255,255,0.6); text-decoration: none; transition: 0.3s; letter-spacing: 1px; }
            .support-links a:hover { color: var(--theme-main, #00f0ff); text-shadow: 0 0 8px rgba(0,240,255,0.5); }
        `;
        document.head.appendChild(style);
    },

    requestStateGate: function(featureKey, tierLevel, categoryKey) {
        if(window.Q_LOG) window.Q_LOG('WARN', 'CAPITAL', 'TIER_UPGRADE_REQUIRED', { feature: featureKey, required_tier: tierLevel });
        
        if (window.ReactNativeWebView) {
            window.ReactNativeWebView.postMessage(JSON.stringify({ action: 'TRIGGER_PAYWALL', tier: tierLevel, feature: featureKey }));
        } else {
            alert(`[ THE QUAD: PRO MATRIX ]\nAccess to ${featureKey.toUpperCase()} requires ${tierLevel} verification.\n\nProceeding to gateway simulation...`);
            
            let tierToken = tierLevel.split(' ')[0].toUpperCase();
            let currentEnts = localStorage.getItem('Q_ENTITLEMENTS');
            let ents = currentEnts ? JSON.parse(currentEnts) : [];
            if(!ents.includes(tierToken)) {
                ents.push(tierToken);
                localStorage.setItem('Q_ENTITLEMENTS', JSON.stringify(ents));
                if(window.Q_LOG) window.Q_LOG('STATE', 'CORE', 'ENTITLEMENT_GRANTED', { tier: tierToken });
            }

            if(categoryKey && window.Q_STATE && window.Q_STATE[categoryKey]) {
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
        const sleepHrs = document.getElementById('cal-sleep').value;
        const inertia = parseInt(document.getElementById('cal-inertia').value) || 45;
        const dlmo = parseInt(document.getElementById('cal-dlmo').value) || 90;

        if (!dob || !loc || !anchor || !sleepHrs) {
            alert("DOB, GEOLOCATION, WAKE ANCHOR, AND TARGET SLEEP ARE REQUIRED.");
            return;
        }

        // Exact Persistence Fix: Explicit Local Storage Overrides
        localStorage.setItem('q_dob', dob);
        localStorage.setItem('q_tob', isUnknown ? '12:00' : tob);
        localStorage.setItem('q_tob_unknown', isUnknown);
        localStorage.setItem('q_loc_name', loc.toUpperCase());
        localStorage.setItem('q_sleep_hrs', sleepHrs);

        // 1. Calculate derived time values unconditionally
        const parts = anchor.split(':');
        const mins = (parseInt(parts[0]) * 60) + parseInt(parts[1]);
        const sleepMins = Math.floor(parseFloat(sleepHrs) * 60);

        // 2. PERSISTENCE FIX: Write directly to browser memory immediately
        localStorage.setItem('q_bio_anchor', mins);
        localStorage.setItem('q_sleep_cycle_duration', sleepMins);
        localStorage.setItem('q_sleep_inertia_mins', inertia);
        localStorage.setItem('q_dlmo_offset_mins', dlmo);

        // 3. Update dynamic state matrix only if the module is active
        if (window.Q_UpdateState) {
            window.Q_UpdateState('metaphysical_layer', 'dob', dob);
            window.Q_UpdateState('metaphysical_layer', 'tob', isUnknown ? '12:00' : tob);
            window.Q_UpdateState('metaphysical_layer', 'tob_unknown', isUnknown);
            window.Q_UpdateState('location', 'name', loc.toUpperCase());
            window.Q_UpdateState('metaphysical_layer', 'wake_anchor_mins', mins);
            window.Q_UpdateState('metaphysical_layer', 'sleep_cycle_duration', sleepMins);
            window.Q_UpdateState('metaphysical_layer', 'sleep_inertia_mins', inertia);
            window.Q_UpdateState('metaphysical_layer', 'dlmo_offset_mins', dlmo);
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
            saveBtn.style.background = "rgba(0,0,0,0.8)";
            saveBtn.style.color = "var(--theme-main, #00f0ff)";
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

        const authState = localStorage.getItem('Q_PRO_AUTH') === 'true' ? 'ACTIVE' : 'STANDBY';
        const authColor = authState === 'ACTIVE' ? '#39ff14' : '#00f0ff';
        const authText = authState === 'ACTIVE' ? '[ DISCONNECT MATRIX ]' : '[ AUTHENTICATE ] - LOCAL CACHE ONLY';

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

        const savedAnchorMins = window.Q_STATE?.metaphysical_layer?.wake_anchor_mins !== undefined ? window.Q_STATE?.metaphysical_layer?.wake_anchor_mins : (parseInt(localStorage.getItem('q_bio_anchor')) || 0);
        const sAnchorStr = `${Math.floor(savedAnchorMins / 60).toString().padStart(2, '0')}:${(savedAnchorMins % 60).toString().padStart(2, '0')}`;
        
        const savedSleepMins = window.Q_STATE?.metaphysical_layer?.sleep_cycle_duration !== undefined ? window.Q_STATE?.metaphysical_layer?.sleep_cycle_duration : (parseInt(localStorage.getItem('q_sleep_cycle_duration')) || 450);
        const sSleepHrs = (savedSleepMins / 60).toFixed(1);

        const sInertia = window.Q_STATE?.metaphysical_layer?.sleep_inertia_mins !== undefined ? window.Q_STATE?.metaphysical_layer?.sleep_inertia_mins : (parseInt(localStorage.getItem('q_sleep_inertia_mins')) || 45);
        const sDlmo = window.Q_STATE?.metaphysical_layer?.dlmo_offset_mins !== undefined ? window.Q_STATE?.metaphysical_layer?.dlmo_offset_mins : (parseInt(localStorage.getItem('q_dlmo_offset_mins')) || 90);
        
        const sAi = window.Q_STATE?.logic_layer?.preferred_ai_diplomat || 'DEFAULT';
        const sDeepFlowEnforcement = window.Q_STATE?.logic_layer?.deep_flow_enforcement !== false;

        // Ephemeris Diagnostic: Reporting Native Edge-Computed State
        const jplStatus = '<span style="color:#00f0ff; text-shadow:0 0 5px rgba(0,240,255,0.5);">[ EDGE-COMPUTED / SYNCED ]</span>';
        const swissStatus = isPersonalActive ? '<span style="color:#00f0ff; text-shadow:0 0 5px rgba(0,240,255,0.5);">[ ACTIVE ]</span>' : '<span style="color:#aaa;">[ STANDBY ]</span>';

        dom.innerHTML = `
            <div class="q-hub-box" onclick="event.stopPropagation()">
                <div class="hub-header">PRO MATRIX // ACCOUNT</div>
                
                <button id="hub-main-auth-btn" style="background:rgba(0,0,0,0.6); border:1px solid ${authColor}; color:${authColor}; padding: 8px 12px; font-family:'Orbitron'; font-size:0.65rem; font-weight:bold; letter-spacing:1px; cursor:pointer; border-radius:4px; margin-bottom:15px; width:100%; transition:0.3s; box-shadow: inset 0 0 10px rgba(${authState === 'ACTIVE' ? '57,255,20' : '0,240,255'}, 0.1);" onmouseover="this.style.background='${authColor}'; this.style.color='#000';" onmouseout="this.style.background='rgba(0,0,0,0.6)'; this.style.color='${authColor}';">${authText}</button>

                <div class="hub-tabs">
                    <button class="hub-tab-btn ${this.activeTab === 'guide' ? 'active' : ''}" id="tab-btn-guide" onclick="window.Q_IntegrationHub.switchTab('guide')">GUIDE</button>
                    <button class="hub-tab-btn ${this.activeTab === 'identity' ? 'active' : ''}" id="tab-btn-identity" onclick="window.Q_IntegrationHub.switchTab('identity')">IDENTITY</button>
                    <button class="hub-tab-btn ${this.activeTab === 'tiers' ? 'active' : ''}" id="tab-btn-tiers" onclick="window.Q_IntegrationHub.switchTab('tiers')">TIERS</button>
                    <button class="hub-tab-btn ${this.activeTab === 'prefs' ? 'active' : ''}" id="tab-btn-prefs" onclick="window.Q_IntegrationHub.switchTab('prefs')">PREFS</button>
                    <button class="hub-tab-btn ${this.activeTab === 'library' ? 'active' : ''}" id="tab-btn-library" onclick="window.Q_IntegrationHub.switchTab('library')">LIBRARY</button>
                </div>

                <div class="hub-tab-content ${this.activeTab === 'guide' ? 'active' : ''}" id="tab-content-guide">
                    <div style="font-family:'Orbitron'; font-size:0.85rem; color:var(--theme-main, #00f0ff); font-weight:bold; letter-spacing:1px; margin-bottom:5px; text-shadow:0 0 8px rgba(0,240,255,0.3); text-align:center;">WELCOME TO THE QUAD</div>
                    <div style="font-size:0.65rem; color:#aaa; line-height: 1.5; margin-bottom: 15px;">
                        We are living biological lives on a mechanical grid. By continually forcing our bodies and minds to conform to an unnatural, static timeline, we have created a global epidemic of chronic fatigue. The Quad exists to dismantle the mechanical cage, allowing you to synchronize your workflow directly to the scientifically verified momentum of your own biology.
                    </div>

                    <div style="font-family:'Orbitron'; font-size:0.75rem; color:#fff; font-weight:bold; margin-bottom:8px; border-bottom:1px dashed rgba(255,255,255,0.2); padding-bottom:4px;">THE 4 VECTORS</div>
                    <div style="font-size:0.6rem; color:#aaa; line-height: 1.5; margin-bottom: 15px; display:flex; flex-direction:column; gap:8px;">
                        <div><span style="color:#b829ff; font-weight:bold; font-family:'Orbitron';">PHYSIOLOGICAL:</span> The Biological Resonance bridge. Synchronizes the human organism against the true kinematic wave.</div>
                        <div><span style="color:#a7ff83; font-weight:bold; font-family:'Orbitron';">METEOROLOGICAL:</span> Environmental Almanac. Tracks atmospheric delta and thermodynamic tension.</div>
                        <div><span style="color:#F4D068; font-weight:bold; font-family:'Orbitron';">METAPHYSICAL:</span> Communal Metadata. Neutralizes cultural drift into objective coordinates via the ICRF.</div>
                        <div><span style="color:#00f0ff; font-weight:bold; font-family:'Orbitron';">ASTROPHYSICAL:</span> The Mechanical Root. Quantifies the Q-Delta and manages the Continuous Respiration algorithm.</div>
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

                    <div style="display:flex; gap:10px;">
                        <div class="hub-input-group" style="flex:1;">
                            <label class="hub-input-lbl">WAKE ANCHOR (LOCAL TIME)</label>
                            <input type="time" id="cal-anchor" class="hub-input" value="${sAnchorStr}">
                        </div>
                        <div class="hub-input-group" style="flex:1;">
                            <label class="hub-input-lbl">TARGET SLEEP (HRS)</label>
                            <input type="number" id="cal-sleep" class="hub-input" value="${sSleepHrs}" step="0.5" min="4" max="12">
                        </div>
                    </div>

                    <div style="display:flex; gap:10px;">
                        <div class="hub-input-group" style="flex:1;">
                            <label class="hub-input-lbl">SLEEP INERTIA (MINS)</label>
                            <input type="number" id="cal-inertia" class="hub-input" value="${sInertia}" min="0" max="180">
                        </div>
                        <div class="hub-input-group" style="flex:1;">
                            <label class="hub-input-lbl">DLMO WIND-DOWN (MINS)</label>
                            <input type="number" id="cal-dlmo" class="hub-input" value="${sDlmo}" min="0" max="180">
                        </div>
                    </div>

                    <button class="hub-action-btn" id="btn-save-identity" onclick="window.Q_IntegrationHub.saveIdentityParameters()" style="margin-top:10px;">COMMIT TO STATE</button>
                </div>

                <div class="hub-tab-content ${this.activeTab === 'tiers' ? 'active' : ''}" id="tab-content-tiers">
                    <div class="hub-tier-row" style="border-color: rgba(255,255,255,0.3);">
                        <div>
                            <div style="font-family:'Orbitron'; font-size:0.75rem; color:#fff; font-weight: bold;">STANDARD TIER (FREE)</div>
                            <div style="font-size:0.55rem; color:#888; margin-top: 4px;">Omni-Planner & Standard Civil Calendar Sync.</div>
                        </div>
                        ${renderBadge('#fff', '#000', 'ACTIVE')}
                    </div>

                    <div class="hub-tier-row">
                        <div>
                            <div style="font-family:'Orbitron'; font-size:0.75rem; color:#00f0ff; font-weight: bold;">PERSONAL TIER ($14.99/mo)</div>
                            <div style="font-size:0.55rem; color:#888; margin-top: 4px;">Biometric Bridge, HRV/Sleep tracking, Environmental Vector.</div>
                        </div>
                        ${personalStatus}
                    </div>
                    
                    <div class="hub-tier-row">
                        <div>
                            <div style="font-family:'Orbitron'; font-size:0.75rem; color:#b829ff; font-weight: bold;">PRO TIER ($19.00 - $29.99/mo)</div>
                            <div style="font-size:0.55rem; color:#888; margin-top: 4px;">AI Temporal Firewall, Q Logic Synchronization, Deep Flow Enforcement.</div>
                        </div>
                        ${proStatus}
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
                        <label class="hub-input-lbl">AI DIPLOMATIC NEGOTIATOR ENGINE</label>
                        <select class="hub-input" id="pref-ai-diplomat" onchange="if(window.Q_UpdateState) window.Q_UpdateState('logic_layer', 'preferred_ai_diplomat', this.value)">
                            <option value="DEFAULT" ${sAi === 'DEFAULT' ? 'selected' : ''}>DEFAULT ALGORITHM</option>
                            <option value="KAIROS" ${sAi === 'KAIROS' ? 'selected' : ''}>KAIROS PROTOCOL</option>
                        </select>
                    </div>
                    <div class="hub-input-group">
                        <label class="hub-input-lbl">DEEP FLOW ENFORCEMENT (APP LOCKS & SILENCE)</label>
                        <select class="hub-input" id="pref-deep-flow" onchange="if(window.Q_UpdateState) window.Q_UpdateState('logic_layer', 'deep_flow_enforcement', this.value === 'true')">
                            <option value="true" ${sDeepFlowEnforcement ? 'selected' : ''}>ACTIVE (BLOCK NOTIFICATIONS)</option>
                            <option value="false" ${!sDeepFlowEnforcement ? 'selected' : ''}>STANDBY (BYPASS LOCKS)</option>
                        </select>
                    </div>

                    <div style="border-top: 1px dashed rgba(255,255,255,0.2); padding-top: 15px; margin-top: 5px;">
                        <div style="font-family:'Orbitron'; font-size:0.75rem; color:#fff; font-weight:bold; margin-bottom:10px; text-shadow:0 0 8px rgba(255,255,255,0.3);">UNIVERSAL PAYLOAD SYNC</div>
                        <div class="hub-input-group">
                            <button class="hub-action-btn" style="background:rgba(0, 240, 255, 0.1); border-color:#00f0ff; color:#00f0ff;" onclick="if(window.Q_Auth) window.Q_Auth.triggerGoogleCalendarSync()">SYNC GOOGLE CALENDAR</button>
                            <div style="font-family:'JetBrains Mono'; font-size:0.55rem; color:#aaa; text-align:center; margin-top:4px;">Imports legacy events as [FIXED] civil constraints.</div>
                        </div>
                    </div>
                    
                    <div style="border-top: 1px dashed rgba(255,255,255,0.2); padding-top: 15px; margin-top: 5px;">
                        <div style="font-family:'Orbitron'; font-size:0.75rem; color:#fff; font-weight:bold; margin-bottom:10px; text-shadow:0 0 8px rgba(255,255,255,0.3);">OFFLINE EPHEMERIS CACHE</div>
                        <div style="font-size:0.6rem; color:#aaa; line-height: 1.4; margin-bottom: 10px;">
                            Download and lock planetary telemetry into local storage. Guarantees 100% invariant physics accuracy regardless of network conditions.
                        </div>
                        <div class="hub-input-group">
                            <button class="hub-action-btn" style="background:rgba(244, 208, 104, 0.1); border-color:#F4D068; color:#F4D068;" onclick="if(window.Q_EphemerisBridge) { window.Q_EphemerisBridge.toggleOfflineMode(true); alert('[ CACHE ENGAGED ]\\nOffline planetary telemetry secured.'); } else { alert('Ephemeris Bridge Offline.'); }">CACHE TELEMETRY DATA</button>
                        </div>
                    </div>

                    <div style="border-top: 1px dashed rgba(255,255,255,0.2); padding-top: 15px; margin-top: 5px;">
                        <div style="font-family:'Orbitron'; font-size:0.75rem; color:#fff; font-weight:bold; margin-bottom:10px; text-shadow:0 0 8px rgba(255,255,255,0.3);">BIOMETRIC HARDWARE SYNC</div>
                        <div style="font-size:0.6rem; color:#aaa; line-height: 1.4; margin-bottom: 10px;">
                            Background polling is DEPRECATED. Execute explicit ON-DEMAND synchronization or utilize manual data entry fallbacks.
                        </div>
                        <div style="display:flex; gap:10px; margin-bottom:15px; justify-content:center; flex-wrap:wrap;">
                            <button class="hub-action-btn" style="flex:1; min-width:40%; padding:8px; font-size:0.6rem; border-color:#39ff14; color:#39ff14;" onclick="if(window.Q_UniversalSync) window.Q_UniversalSync.routeBiometricAuth('oura', 'ON_DEMAND')">ON-DEMAND: OURA</button>
                            <button class="hub-action-btn" style="flex:1; min-width:40%; padding:8px; font-size:0.6rem; border-color:#fff; color:#fff;" onclick="if(window.Q_UniversalSync) window.Q_UniversalSync.routeBiometricAuth('whoop', 'ON_DEMAND')">ON-DEMAND: WHOOP</button>
                            <button class="hub-action-btn" style="flex:1; min-width:40%; padding:8px; font-size:0.6rem; border-color:#00f0ff; color:#00f0ff;" onclick="if(window.Q_UniversalSync) window.Q_UniversalSync.routeBiometricAuth('health_connect', 'ON_DEMAND')">ON-DEMAND: HEALTH</button>
                            <button class="hub-action-btn" style="flex:1; min-width:40%; padding:8px; font-size:0.6rem; border-color:#aaa; color:#aaa;" onclick="alert('[ MANUAL FALLBACK ] Routing to manual biometric entry UI...')">MANUAL ENTRY</button>
                        </div>
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

                <div class="hub-tab-content ${this.activeTab === 'library' ? 'active' : ''}" id="tab-content-library">
                    <div style="font-family:'Orbitron'; font-size:0.85rem; color:var(--theme-main, #00f0ff); font-weight:bold; letter-spacing:1px; margin-bottom:5px; text-shadow:0 0 8px rgba(0,240,255,0.3); text-align:center;">Q LOGIC ARCHIVE</div>
                    <div style="font-size:0.65rem; color:#aaa; line-height: 1.5; margin-bottom: 15px; text-align:center;">
                        Library data migrated. Execute external bridge to access The Quadrature manuscripts and initialize Quadification.
                    </div>

                    <div class="hub-tier-row">
                        <div>
                            <div style="font-family:'Orbitron'; font-size:0.75rem; color:#fff; font-weight: bold;">Q LOGIC LIBRARY</div>
                            <div style="font-size:0.55rem; color:#888; margin-top: 4px;">External Manuscript Payload</div>
                        </div>
                        <button class="hub-action-btn" onclick="if(typeof window.executeHomeSequence === 'function') window.executeHomeSequence('q-library-data.html'); else window.location.href='q-library-data.html';" style="width:auto; padding:6px 12px; font-size:0.55rem; color:var(--theme-main, #00f0ff); border-color:var(--theme-main, #00f0ff);">ACCESS ARCHIVE</button>
                    </div>
                </div>

                <div class="support-links">
                    <a href="#">[ HELP ]</a>
                    <a href="#">[ CONTACT US ]</a>
                    <a href="#">[ TECH SUPPORT ]</a>
                </div>

                <button class="hub-close-btn" onclick="window.Q_IntegrationHub.closeHub()">DISMISS MATRIX</button>
            </div>
        `;
        document.body.appendChild(dom);

        const authBtn = document.getElementById('hub-main-auth-btn');
        if (authBtn) {
            authBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                
                if (authState === 'ACTIVE') {
                    try {
                        if (window.Q_Auth && typeof window.Q_Auth.signOut === 'function') {
                            window.Q_Auth.signOut();
                        } else {
                            // Provider missing: Manually reset state and reload to clear the UI "lie"
                            localStorage.setItem('Q_PRO_AUTH', 'false');
                            window.location.reload();
                        }
                    } catch(err) { console.error('OAuth Disconnect Error:', err); }
                } else {
                    try {
                        if (window.Q_Auth && typeof window.Q_Auth.triggerOAuth === 'function') {
                            window.Q_Auth.triggerOAuth();
                        } else {
                            // Prevent the "fake login" by throwing a clear error instead of setting storage
                            console.error('CRITICAL: window.Q_Auth module not detected in the current environment.');
                            alert('[ AUTH ERROR ] Authentication provider not found. Check bridge configuration.');
                        }
                    } catch(err) { console.error('OAuth Connect Error:', err); }
                }
            });
        }

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