// THE QUADRATURE: GLOBAL DASHBOARD & PRO MATRIX
// Architect: Kelby | Engineer: Kairos
// PROTOCOL: Account Settings, Calibration Module, Tiered Access Gate & Native Library Reader
// REVISION: 24.2.7 - Explicit OAuth Bridge & Scope Resolution

// --- AUTONOMOUS OAUTH BRIDGE ---
window.Q_Auth = {
    supabase: null,
    init: async function() {
        if (!window.supabase) {
            await new Promise((resolve) => {
                const script = document.createElement('script');
                script.src = 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2';
                script.onload = resolve;
                document.head.appendChild(script);
            });
        }
        const SUPABASE_URL = 'https://wnfpxozpeucrwqmrqpzv.supabase.co';
        const SUPABASE_KEY = 'sb_publishable_g6JfCH6FefIwEmXztgkdTw_Md1z4se5';
        this.supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);
        
        const { data } = await this.supabase.auth.getSession();
        if (data && data.session) {
            localStorage.setItem('Q_PRO_AUTH', 'true');
        }
    },
    triggerOAuth: async function() {
        if (!this.supabase) await this.init();
        const { error } = await this.supabase.auth.signInWithOAuth({
            provider: 'google',
            options: { 
                redirectTo: window.location.origin + window.location.pathname,
                queryParams: {
                    client_id: '295194884701-td2lcfbtote5j98gbaluvt4ajjv6rv0u.apps.googleusercontent.com'
                     prompt: 'select_account'
                }
            }
        });
        if (error) alert("OAuth Handshake Failed: " + error.message);
    },
    signOut: async function() {
        if (!this.supabase) await this.init();
        await this.supabase.auth.signOut();
        localStorage.setItem('Q_PRO_AUTH', 'false');
        window.location.reload();
    }
};

window.addEventListener('DOMContentLoaded', () => window.Q_Auth.init());
// -------------------------------

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
        if (!dob || !loc) {
            alert("DOB AND GEOLOCATION ARE REQUIRED.");
            return;
        }

        localStorage.setItem('q_dob', dob);
        localStorage.setItem('q_tob', isUnknown ? '12:00' : tob);
        localStorage.setItem('q_tob_unknown', isUnknown);
        localStorage.setItem('q_loc_name', loc.toUpperCase());
        
        if (window.Q_UpdateState) {
            window.Q_UpdateState('metaphysical_layer', 'dob', dob);
            window.Q_UpdateState('metaphysical_layer', 'tob', isUnknown ? '12:00' : tob);
            window.Q_UpdateState('metaphysical_layer', 'tob_unknown', isUnknown);
            window.Q_UpdateState('location', 'name', loc.toUpperCase());
        }

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

        const sDob = window.Q_STATE?.metaphysical_layer?.dob || localStorage.getItem('q_dob') || "";
        const sTob = window.Q_STATE?.metaphysical_layer?.tob || localStorage.getItem('q_tob') || "12:00";
        const sTobUnknown = window.Q_STATE?.metaphysical_layer?.tob_unknown === true || localStorage.getItem('q_tob_unknown') === 'true';
        
        let sLoc = window.Q_STATE?.location?.name || localStorage.getItem('q_loc_name') || "CLEARWATER, FL";
        if (sLoc.toUpperCase().includes('LOS ANGELES')) sLoc = "CLEARWATER, FL";
        
        const sAi = window.Q_STATE?.logic_layer?.preferred_ai_diplomat || 'DEFAULT';
        const sDeepFlowEnforcement = window.Q_STATE?.logic_layer?.deep_flow_enforcement !== false;

        const jplStatus = '<span style="color:#00f0ff; text-shadow:0 0 5px rgba(0,240,255,0.5);">[ EDGE-COMPUTED / SYNCED ]</span>';
        const swissStatus = isPersonalActive ? '<span style="color:#00f0ff; text-shadow:0 0 5px rgba(0,240,255,0.5);">[ ACTIVE ]</span>' : '<span style="color:#aaa;">[ STANDBY ]</span>';

        dom.innerHTML = `
            <div class="q-hub-box" onclick="event.stopPropagation()">
                <div class="hub-header">PRO MATRIX // ACCOUNT</div>
                
                <button id="hub-main-auth-btn" style="background:rgba(0,0,0,0.6); border:1px solid ${authColor}; color:${authColor}; padding: 8px 12px; font-family:'Orbitron'; font-size:0.65rem; font-weight:bold; letter-spacing:1px; cursor:pointer; border-radius:4px; margin-bottom:15px; width:100%; transition:0.3s; box-shadow: inset 0 0 10px rgba(${authState === 'ACTIVE' ? '57,255,20' : '0,240,255'}, 0.1);" onmouseover="this.style.background='${authColor}'; this.style.color='#000';" onmouseout="this.style.background='rgba(0,0,0,0.6)'; this.style.color='${authColor}';">${authText}</button>

                <div class="hub-tabs">
                    <button class="hub-tab-btn ${this.activeTab === 'guide' ? 'active' : ''}" id="tab-btn-guide" onclick="window.Q_IntegrationHub.switchTab('guide')">GUIDE</button>
                    <button class="hub-tab-btn ${this.activeTab === 'settings' ? 'active' : ''}" id="tab-btn-settings" onclick="window.Q_IntegrationHub.switchTab('settings')">SETTINGS</button>
                    <button class="hub-tab-btn ${this.activeTab === 'tiers' ? 'active' : ''}" id="tab-btn-tiers" onclick="window.Q_IntegrationHub.switchTab('tiers')">TIERS</button>
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
<div class="hub-tab-content ${this.activeTab === 'settings' ? 'active' : ''}" id="tab-content-settings">
                    <div style="font-family:'Orbitron'; font-size:0.75rem; color:#fff; font-weight:bold; margin-bottom:8px; border-bottom:1px dashed rgba(255,255,255,0.2); padding-bottom:4px;">CALIBRATION</div>
                    <div style="display:flex; gap:10px;">
                        <div class="hub-input-group" style="flex:2;"><label class="hub-input-lbl">DATE OF BIRTH</label><input type="date" id="cal-dob" class="hub-input" value="${sDob}"></div>
                        <div class="hub-input-group" style="flex:1;"><label class="hub-input-lbl">TIME OF BIRTH</label><input type="time" id="cal-tob" class="hub-input" value="${sTob}" ${sTobUnknown ? 'disabled' : ''}></div>
                    </div>
                    <label class="hub-checkbox-group" style="justify-content: flex-end; margin-top:-10px;"><input type="checkbox" id="cal-tob-unknown" onchange="window.Q_IntegrationHub.toggleTOB()" ${sTobUnknown ? 'checked' : ''}> Exact Time Unknown</label>
                    <div class="hub-input-group"><label class="hub-input-lbl">GEOLOCATION</label><input type="text" id="cal-loc" class="hub-input" value="${sLoc}"></div>
                    <button class="hub-action-btn" id="btn-save-identity" onclick="window.Q_IntegrationHub.saveIdentityParameters()" style="margin-top:10px;">SAVE CALIBRATION</button>

                    <div style="font-family:'Orbitron'; font-size:0.75rem; color:#fff; font-weight:bold; margin-top:20px; margin-bottom:8px; border-bottom:1px dashed rgba(255,255,255,0.2); padding-bottom:4px;">SYSTEM BEHAVIOR</div>
                    <div class="hub-input-group"><label class="hub-input-lbl">AI DIPLOMAT</label><select class="hub-input" id="pref-ai-diplomat" onchange="if(window.Q_UpdateState) window.Q_UpdateState('logic_layer', 'preferred_ai_diplomat', this.value)"><option value="DEFAULT" ${sAi === 'DEFAULT' ? 'selected' : ''}>DEFAULT</option><option value="KAIROS" ${sAi === 'KAIROS' ? 'selected' : ''}>KAIROS</option></select></div>
                    <div class="hub-input-group"><label class="hub-input-lbl">FLOW ENFORCEMENT</label><select class="hub-input" id="pref-deep-flow" onchange="if(window.Q_UpdateState) window.Q_UpdateState('logic_layer', 'deep_flow_enforcement', this.value === 'true')"><option value="true" ${sDeepFlowEnforcement ? 'selected' : ''}>ACTIVE</option><option value="false" ${!sDeepFlowEnforcement ? 'selected' : ''}>STANDBY</option></select></div>

                    <div style="font-family:'Orbitron'; font-size:0.75rem; color:#fff; font-weight:bold; margin-top:20px; margin-bottom:8px; border-bottom:1px dashed rgba(255,255,255,0.2); padding-bottom:4px;">DATA BRIDGES</div>
                    <button class="hub-action-btn" style="background:rgba(0, 240, 255, 0.1); border-color:#00f0ff; color:#00f0ff; margin-bottom:10px;" onclick="if(window.Q_Auth) window.Q_Auth.triggerGoogleCalendarSync()">SYNC GOOGLE CALENDAR</button>
                    <div style="display:flex; gap:10px; flex-wrap:wrap;">
                        <button class="hub-action-btn" style="flex:1; padding:8px; font-size:0.5rem; border-color:#39ff14; color:#39ff14;" onclick="if(window.Q_UniversalSync) window.Q_UniversalSync.routeBiometricAuth('oura', 'ON_DEMAND')">SYNC OURA</button>
                        <button class="hub-action-btn" style="flex:1; padding:8px; font-size:0.5rem; border-color:#fff; color:#fff;" onclick="if(window.Q_UniversalSync) window.Q_UniversalSync.routeBiometricAuth('whoop', 'ON_DEMAND')">SYNC WHOOP</button>
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