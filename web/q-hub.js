// THE QUADRATURE: GLOBAL DASHBOARD & PRO MATRIX
// Architect: Kelby | Engineer: Kairos
// PROTOCOL: Account Settings, Calibration Module, Tiered Access Gate & Native Library Reader
// REVISION: 24.3.1 - Hotfix: ES6 Decoupling & Global Scope Attachment

window.Q_LibraryReader = {
    init: function() {
        if (document.getElementById('q-library-reader-overlay')) return;
        const dom = document.createElement('div');
        dom.id = 'q-library-reader-overlay';
        dom.className = 'q-hub-overlay';
        dom.style.zIndex = '10020';
        dom.style.backdropFilter = 'blur(20px)';
        dom.style.webkitBackdropFilter = 'blur(20px)';
        dom.innerHTML = `
            <div class="q-hub-box" style="width: 95vw; max-width: 800px; height: 95vh; max-height: none; padding: 0; display: flex; flex-direction: column; background: rgba(5, 5, 10, 0.98); box-shadow: 0 30px 60px rgba(0,0,0,0.9);">
                <div style="display: flex; justify-content: space-between; align-items: center; padding: 20px 30px; border-bottom: 1px solid var(--theme-main, #ff003c); background: rgba(0,0,0,0.8);">
                    <div id="q-lib-title" style="font-family: 'Orbitron'; font-weight: 900; color: var(--theme-main, #ff003c); letter-spacing: 2px; font-size: 1.2rem; text-shadow: 0 0 10px rgba(255,0,60,0.3);">DOCUMENT</div>
                    <button onclick="window.Q_LibraryReader.close()" style="background: transparent; border: 1px solid rgba(255,255,255,0.6); color: rgba(255,255,255,0.8); font-family: 'Orbitron'; font-size: 0.7rem; padding: 8px 15px; cursor: pointer; border-radius: 4px; font-weight: bold; transition: 0.3s; letter-spacing: 1px;" onmouseover="this.style.background='rgba(255,255,255,0.1)'; this.style.color='#fff';" onmouseout="this.style.background='transparent'; this.style.color='rgba(255,255,255,0.8)';">CLOSE MATRIX</button>
                </div>
                <div id="q-lib-content" style="flex-grow: 1; padding: 40px 45px; overflow-y: auto; font-family: 'JetBrains Mono'; font-size: 0.85rem; line-height: 1.7; color: #ccc; text-align: justify;">
                </div>
            </div>
        `;
        document.body.appendChild(dom);
    },
    
    renderDocument: function(data) {
        let html = `
            <h2 style="color:#fff; font-family:'Orbitron'; letter-spacing:2px;">THE QUADRATURE</h2>
            <h4 style="color:var(--theme-main, #ff003c); font-family:'Orbitron'; margin-top:-10px;">AUTHOR: ${data.author}</h4>
            <div style="border-bottom: 1px dashed rgba(255,255,255,0.2); margin-bottom: 20px; padding-bottom: 10px; font-size:0.75rem;">
                <strong style="color:#fff;">DOCUMENT TYPE:</strong> ${data.title}<br>
                <strong style="color:#fff;">FOCUS:</strong> ${data.subtitle}
            </div>
            <p style="margin-bottom:30px;"><i>${data.description}</i></p>
        `;

        data.sections.forEach(sec => {
            html += `<h3 style="color:var(--theme-main, #ff003c); font-family:'Orbitron'; margin-top:30px; letter-spacing:1px; border-bottom:1px solid rgba(255,0,60,0.2); padding-bottom:5px;">${sec.heading}</h3>`;
            let formattedBody = sec.body.replace(/\n\n/g, '</p><p>');
            formattedBody = formattedBody.replace(/\n•/g, '<br>•');
            html += `<p>${formattedBody}</p>`;
        });
        
        return html;
    },

    renderCommerce: function(data) {
        return `
            <h2 style="color:#fff; font-family:'Orbitron'; letter-spacing:2px; text-align:center;">${data.title}</h2>
            <h4 style="color:#F4D068; font-family:'Orbitron'; margin-top:-10px; text-align:center;">${data.subtitle}</h4>
            
            <div style="display:flex; flex-wrap:wrap; justify-content:center; gap:20px; margin: 40px 0;">
                <div style="flex:1; min-width:250px; max-width:350px; border:1px solid rgba(255,255,255,0.2); border-radius:4px; padding:10px; background:rgba(0,0,0,0.5);">
                    <div style="text-align:center; font-family:'Orbitron'; font-size:0.7rem; color:#aaa; margin-bottom:10px;">FRONT COVER</div>
                    <img src="${data.cover_front}" alt="Front Cover" style="width:100%; height:auto; box-shadow:0 10px 20px rgba(0,0,0,0.8); border-radius:2px;" onerror="this.src='data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzMDAiIGhlaWdodD0iNDAwIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjMjIyIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZpbGw9IiM1NTUiIGZvbnQtZmFtaWx5PSJzYW5zLXNlcmlmIiBmb250LXNpemU9IjE2IiB0ZXh0LWFuY2hvcj0ibWlkZGxlIj5DT1ZFUiBNSVNTSU5HPC90ZXh0Pjwvc3ZnPg=='"/>
                </div>
                <div style="flex:1; min-width:250px; max-width:350px; border:1px solid rgba(255,255,255,0.2); border-radius:4px; padding:10px; background:rgba(0,0,0,0.5);">
                    <div style="text-align:center; font-family:'Orbitron'; font-size:0.7rem; color:#aaa; margin-bottom:10px;">BACK COVER</div>
                    <img src="${data.cover_back}" alt="Back Cover" style="width:100%; height:auto; box-shadow:0 10px 20px rgba(0,0,0,0.8); border-radius:2px;" onerror="this.src='data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzMDAiIGhlaWdodD0iNDAwIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjMjIyIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZpbGw9IiM1NTUiIGZvbnQtZmFtaWx5PSJzYW5zLXNlcmlmIiBmb250LXNpemU9IjE2IiB0ZXh0LWFuY2hvcj0ibWlkZGxlIj5DT1ZFUiBNSVNTSU5HPC90ZXh0Pjwvc3ZnPg=='"/>
                </div>
            </div>

            <div style="background:rgba(244, 208, 104, 0.05); border-left:3px solid #F4D068; padding:20px; margin-bottom:30px;">
                <p style="margin-top:0;"><i>${data.description}</i></p>
                <p style="font-size:0.75rem; color:#aaa;">STATUS: <span style="color:#F4D068;">${data.pod_status.replace(/_/g, ' ').toUpperCase()}</span></p>
            </div>
            
            <button onclick="alert('ROUTING TO LULU DIRECT GATEWAY...')" style="width:100%; padding:15px; background:rgba(244, 208, 104, 0.1); border:1px solid #F4D068; color:#F4D068; font-family:'Orbitron'; font-weight:bold; letter-spacing:2px; cursor:pointer; transition:0.3s; border-radius:4px;" onmouseover="this.style.background='#F4D068'; this.style.color='#000';" onmouseout="this.style.background='rgba(244, 208, 104, 0.1)'; this.style.color='#F4D068';">
                ACQUIRE PHYSICAL MANUSCRIPT
            </button>
        `;
    },

    open: function(manuscriptId) {
        this.init();
        
        if (!window.Q_LIBRARY_MATRIX) {
            alert("SYSTEM ERROR: Library data matrix not found in global scope. Ensure q-library-data.js is loaded before q-hub.js.");
            return;
        }

        const data = window.Q_LIBRARY_MATRIX.find(item => item.id === manuscriptId);
        
        if(!data) {
            if(window.Q_LOG) window.Q_LOG('ERROR', 'CORE', 'MANUSCRIPT_NOT_FOUND', { id: manuscriptId });
            return;
        }

        document.getElementById('q-lib-title').innerText = data.title;
        const contentBox = document.getElementById('q-lib-content');
        
        if (data.type === "document") {
            contentBox.innerHTML = this.renderDocument(data);
        } else if (data.type === "manifesto_commerce") {
            contentBox.innerHTML = this.renderCommerce(data);
        }

        document.getElementById('q-library-reader-overlay').classList.add('active');
        if(window.Q_MobileBridge) window.Q_MobileBridge.pulse('MEDIUM');
    },
    
    close: function() {
        const overlay = document.getElementById('q-library-reader-overlay');
        if(overlay) overlay.classList.remove('active');
        setTimeout(() => {
            const content = document.getElementById('q-lib-content');
            if(content) content.innerHTML = ''; 
        }, 300);
        if(window.Q_MobileBridge) window.Q_MobileBridge.pulse('LIGHT');
    }
};

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
            .q-hub-box { width: 90vw; max-width: 550px; max-height: 85vh; overflow-y: auto; background: rgba(5, 8, 15, 0.95); border: 1px solid var(--theme-main, #ff003c) !important; border-radius: 8px; padding: 25px; box-sizing: border-box; box-shadow: 0 20px 50px rgba(0,0,0,0.9); display: flex; flex-direction: column; gap: 15px; color: #fff; font-family: 'JetBrains Mono', monospace; pointer-events: auto; }
            
            .q-hub-box::-webkit-scrollbar { width: 6px; }
            .q-hub-box::-webkit-scrollbar-track { background: rgba(0,0,0,0.2); }
            .q-hub-box::-webkit-scrollbar-thumb { background: var(--theme-main, #ff003c) !important; border-radius: 3px; }

            .hub-header { font-family:'Orbitron'; text-align:center; padding-bottom:15px; font-size: 1.1rem; color: var(--theme-main, #ff003c); font-weight: 900; letter-spacing: 2px; text-shadow: 0 0 10px rgba(255,0,60,0.2); border-bottom: 1px dashed rgba(255,255,255,0.2); }
            
            .hub-tabs { display: flex; border-bottom: 1px solid rgba(255,255,255,0.1); margin-bottom: 15px; gap: 5px; flex-wrap: wrap; }
            .hub-tab-btn { flex: 1; background: transparent; border: none; color: rgba(255,255,255,0.6); font-family: 'Orbitron'; font-size: 0.65rem; font-weight: 700; padding: 10px 5px; cursor: pointer; transition: 0.3s; letter-spacing: 1px; border-bottom: 2px solid transparent; min-width: 70px; }
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
            alert(`[ THE QUADRATURE: PRO MATRIX ]\nAccess to ${featureKey.toUpperCase()} requires ${tierLevel} verification.\n\nProceeding to gateway simulation...`);
            
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

        if (window.Q_UpdateState) {
            window.Q_UpdateState('metaphysical_layer', 'dob', dob);
            window.Q_UpdateState('metaphysical_layer', 'tob', isUnknown ? '12:00' : tob);
            window.Q_UpdateState('metaphysical_layer', 'tob_unknown', isUnknown);
            window.Q_UpdateState('location', 'name', loc.toUpperCase());

            const parts = anchor.split(':');
            const mins = (parseInt(parts[0]) * 60) + parseInt(parts[1]);
            window.Q_UpdateState('metaphysical_layer', 'wake_anchor_mins', mins);
            
            const sleepMins = Math.floor(parseFloat(sleepHrs) * 60);
            window.Q_UpdateState('metaphysical_layer', 'sleep_cycle_duration', sleepMins);
            window.Q_UpdateState('metaphysical_layer', 'sleep_inertia_mins', inertia);
            window.Q_UpdateState('metaphysical_layer', 'dlmo_offset_mins', dlmo);
        }

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

    generateLibraryDOM: function() {
        let html = `
            <div style="font-family:'Orbitron'; font-size:0.85rem; color:var(--theme-main, #ff003c); font-weight:bold; letter-spacing:1px; margin-bottom:5px; text-shadow:0 0 8px rgba(255,0,60,0.3); text-align:center;">THE QUADRATURE LIBRARY</div>
            <div style="font-size:0.65rem; color:#aaa; line-height: 1.5; margin-bottom: 15px; text-align:center;">
                Native DOM document rendering enabled. Disengage from linear metrology and initiate the Quadification process.
            </div>
        `;
        
        if (!window.Q_LIBRARY_MATRIX) {
             html += `<div style="color:#ff003c; text-align:center; padding: 20px; border:1px solid #ff003c;">[ERROR] q-library-data.js not found in global scope.</div>`;
             return html;
        }

        window.Q_LIBRARY_MATRIX.forEach(item => {
            let btnAction = `window.Q_LibraryReader.open('${item.id}')`;
            let btnText = "READ";
            let rowStyle = "";
            let btnStyle = "width:auto; padding:6px 12px; font-size:0.55rem; color:var(--theme-main, #ff003c); border-color:var(--theme-main, #ff003c);";
            let titleColor = "#fff";

            if (item.type === "manifesto_commerce") {
                rowStyle = "border-color: #F4D068; background: rgba(244, 208, 104, 0.05);";
                btnText = "VIEW";
                btnStyle = "width:auto; padding:6px 12px; font-size:0.55rem; color:#000; background:#F4D068; border-color:#F4D068;";
                titleColor = "#F4D068";
            }

            html += `
                <div class="hub-tier-row" style="${rowStyle}">
                    <div>
                        <div style="font-family:'Orbitron'; font-size:0.75rem; color:${titleColor}; font-weight: bold;">${item.title}</div>
                        <div style="font-size:0.55rem; color:#888; margin-top: 4px;">${item.subtitle}</div>
                    </div>
                    <button class="hub-action-btn" onclick="${btnAction}" style="${btnStyle}">${btnText}</button>
                </div>
            `;
        });
        
        return html;
    },

    injectDOM: function() {
        const existing = document.getElementById('unified-integration-hub');
        if (existing) existing.remove();

        const dom = document.createElement('div');
        dom.className = 'q-hub-overlay';
        dom.id = 'unified-integration-hub';
        
        const renderBadge = (statusColor, textColor, text) => `<span style="font-size:0.55rem; background:${statusColor}; color:${textColor}; padding:4px 8px; border-radius:4px; font-weight:900; letter-spacing: 1px;">${text}</span>`;
        const renderUpgradeBtn = (feature, tier, category, color) => `<button onclick="window.Q_IntegrationHub.requestStateGate('${feature}', '${tier}', '${category}')" style="font-size:0.55rem; background:transparent; border:1px solid ${color}; color:${color}; padding:4px 8px; border-radius:4px; font-weight:900; letter-spacing: 1px; cursor:pointer; transition:0.3s; pointer-events:auto;" onmouseover="this.style.background='${color}'; this.style.color='#000';" onmouseout="this.style.background='transparent'; this.style.color='${color}';">UPGRADE</button>`;

        const authState = window.Q_STATE?.persistence?.auth_status === 'PRO_AUTHENTICATED' ? 'ACTIVE' : 'STANDBY';
        const authColor = authState === 'ACTIVE' ? '#39ff14' : '#ff003c';
        const authText = authState === 'ACTIVE' ? '[ DISCONNECT MATRIX ]' : '[ AUTHENTICATE ] - LOCAL CACHE ONLY';

        let ents = [];
        if (authState === 'ACTIVE') {
            const entitlementsRaw = localStorage.getItem('Q_ENTITLEMENTS');
            try { ents = entitlementsRaw ? JSON.parse(entitlementsRaw) : []; } catch(e) {}
        }

        const isPersonalActive = ents.includes('PERSONAL') || ents.includes('PRO') || ents.includes('ENTERPRISE') || ents.includes('TEAM');
        const personalStatus = isPersonalActive ? renderBadge('#00f0ff', '#000', 'ACTIVE') : renderUpgradeBtn('biometric_api', 'PERSONAL TIER', 'hardware_hooks', '#00f0ff');

        const isProActive = ents.includes('PRO') || ents.includes('ENTERPRISE');
        const proStatus = isProActive ? renderBadge('#b829ff', '#000', 'ACTIVE') : renderUpgradeBtn('ai_diplomat', 'PRO TIER', 'logic_layer', '#b829ff');

        const isEnterpriseActive = ents.includes('ENTERPRISE');
        const enterpriseStatus = isEnterpriseActive ? renderBadge('#F4D068', '#000', 'ACTIVE') : renderUpgradeBtn('fiat_api', 'ENTERPRISE TIER', 'capital_ledger', '#F4D068');

        const sDob = window.Q_STATE?.metaphysical_layer?.dob || "";
        const sTob = window.Q_STATE?.metaphysical_layer?.tob || "12:00";
        const sTobUnknown = window.Q_STATE?.metaphysical_layer?.tob_unknown === true;
        const sLoc = window.Q_STATE?.location?.name || "";
        const savedAnchorMins = window.Q_STATE?.metaphysical_layer?.wake_anchor_mins !== null ? window.Q_STATE?.metaphysical_layer?.wake_anchor_mins : (parseInt(localStorage.getItem('q_bio_anchor')) || 0);
        const sAnchorStr = `${Math.floor(savedAnchorMins / 60).toString().padStart(2, '0')}:${(savedAnchorMins % 60).toString().padStart(2, '0')}`;
        
        const sSleep = window.Q_STATE?.metaphysical_layer?.sleep_cycle_duration || 450;
        const sSleepHrs = (sSleep / 60).toFixed(1);

        const sInertia = window.Q_STATE?.metaphysical_layer?.sleep_inertia_mins !== null ? window.Q_STATE?.metaphysical_layer?.sleep_inertia_mins : (parseInt(localStorage.getItem('q_sleep_inertia_mins')) || 45);
        const sDlmo = window.Q_STATE?.metaphysical_layer?.dlmo_offset_mins !== null ? window.Q_STATE?.metaphysical_layer?.dlmo_offset_mins : (parseInt(localStorage.getItem('q_dlmo_offset_mins')) || 90);
        
        const sAi = window.Q_STATE?.logic_layer?.preferred_ai_diplomat || 'DEFAULT';
        const sDeepFlowEnforcement = window.Q_STATE?.logic_layer?.deep_flow_enforcement !== false;

        const jplStatus = window.EPHEMERIS_LIVE ? '<span style="color:#39ff14; text-shadow:0 0 5px rgba(57,255,20,0.5);">[ CONNECTED / LIVE ]</span>' : '<span style="color:#ff003c; text-shadow:0 0 5px rgba(255,0,60,0.5);">[ DISCONNECTED / FAILOVER ]</span>';
        const swissStatus = isPersonalActive ? '<span style="color:#00f0ff; text-shadow:0 0 5px rgba(0,240,255,0.5);">[ API ACTIVE ]</span>' : '<span style="color:#aaa;">[ STANDBY / INACTIVE ]</span>';

        dom.innerHTML = `
            <div class="q-hub-box" onclick="event.stopPropagation()">
                <div class="hub-header">PRO MATRIX // ACCOUNT</div>
                
                <button id="hub-main-auth-btn" style="background:rgba(0,0,0,0.6); border:1px solid ${authColor}; color:${authColor}; padding: 8px 12px; font-family:'Orbitron'; font-size:0.65rem; font-weight:bold; letter-spacing:1px; cursor:pointer; border-radius:4px; margin-bottom:15px; width:100%; transition:0.3s; box-shadow: inset 0 0 10px rgba(${authState === 'ACTIVE' ? '57,255,20' : '255,0,60'}, 0.1);" onmouseover="this.style.background='${authColor}'; this.style.color='#000';" onmouseout="this.style.background='rgba(0,0,0,0.6)'; this.style.color='${authColor}';">${authText}</button>

                <div class="hub-tabs">
                    <button class="hub-tab-btn ${this.activeTab === 'guide' ? 'active' : ''}" id="tab-btn-guide" onclick="window.Q_IntegrationHub.switchTab('guide')">GUIDE</button>
                    <button class="hub-tab-btn ${this.activeTab === 'identity' ? 'active' : ''}" id="tab-btn-identity" onclick="window.Q_IntegrationHub.switchTab('identity')">IDENTITY</button>
                    <button class="hub-tab-btn ${this.activeTab === 'tiers' ? 'active' : ''}" id="tab-btn-tiers" onclick="window.Q_IntegrationHub.switchTab('tiers')">TIERS</button>
                    <button class="hub-tab-btn ${this.activeTab === 'prefs' ? 'active' : ''}" id="tab-btn-prefs" onclick="window.Q_IntegrationHub.switchTab('prefs')">PREFS</button>
                    <button class="hub-tab-btn ${this.activeTab === 'library' ? 'active' : ''}" id="tab-btn-library" onclick="window.Q_IntegrationHub.switchTab('library')">LIBRARY</button>
                </div>

                <div class="hub-tab-content ${this.activeTab === 'guide' ? 'active' : ''}" id="tab-content-guide">
                    <div style="font-family:'Orbitron'; font-size:0.85rem; color:var(--theme-main, #ff003c); font-weight:bold; letter-spacing:1px; margin-bottom:5px; text-shadow:0 0 8px rgba(255,0,60,0.3); text-align:center;">WELCOME TO THE QUADRATURE</div>
                    <div style="font-size:0.65rem; color:#aaa; line-height: 1.5; margin-bottom: 15px;">
                        For your entire life, your schedule has been dictated by a rigid calendar and a ticking clock. But your body isn't a machine—it's a living system. When you force your natural energy into an artificial 9-to-5 grid, the result is chronic exhaustion and burnout. We call this <span style="color:var(--theme-main, #ff003c); font-weight:bold;">Schedule Friction</span>.
                        <br><br>
                        The Quadrature is the cure. Instead of fighting the clock, we use real-time planetary tracking to sync your daily tasks with your body's natural peaks and valleys. You are no longer managing time; you are optimizing your energy.
                    </div>

                    <div style="font-family:'Orbitron'; font-size:0.75rem; color:#fff; font-weight:bold; margin-bottom:8px; border-bottom:1px dashed rgba(255,255,255,0.2); padding-bottom:4px;">YOUR 4 SYSTEM DASHBOARDS</div>
                    <div style="font-size:0.6rem; color:#aaa; line-height: 1.5; margin-bottom: 15px; display:flex; flex-direction:column; gap:8px;">
                        <div><span style="color:#b829ff; font-weight:bold; font-family:'Orbitron';">BIOLOGICAL:</span> Tracks your rest and focus. We monitor your heart rate variability (HRV) and sleep stages across a proprietary 5-phase logic model to tell you exactly when you are primed for deep work and when you need to recover.</div>
                        <div><span style="color:#a7ff83; font-weight:bold; font-family:'Orbitron';">ENVIRONMENTAL:</span> Replaces standard weather apps. It calculates how temperature, sunlight, and atmospheric pressure physically impact your thermodynamic baseload today.</div>
                        <div><span style="color:#F4D068; font-weight:bold; font-family:'Orbitron';">COMMUNAL:</span> The hub for your financial checkpoints, cultural holidays, and optimal collaboration windows.</div>
                        <div><span style="color:#00f0ff; font-weight:bold; font-family:'Orbitron';">MECHANICAL:</span> The core engine. Shows the exact variance between "clock time" and true "solar time," letting you ride the momentum of the planet.</div>
                    </div>

                    <div style="font-family:'Orbitron'; font-size:0.75rem; color:#fff; font-weight:bold; margin-bottom:8px; border-bottom:1px dashed rgba(255,255,255,0.2); padding-bottom:4px;">MASTERING THE OMNI-PLANNER</div>
                    <div style="font-size:0.6rem; color:#aaa; line-height: 1.5; margin-bottom: 15px;">
                        <span style="color:#fff; font-weight:bold;">Import Your Life:</span> Connect legacy calendars. We treat these standard meetings as "Fixed Constraints".<br><br>
                        <span style="color:#fff; font-weight:bold;">Tension Scoring:</span> The system analyzes your schedule. If you've crammed too many meetings into a period where your body needs rest, we'll warn you before you burn out.<br><br>
                        <span style="color:#fff; font-weight:bold;">Color-Coded Energy:</span><br>
                        <span style="color:#a7ff83;">&#x25A0; Green (Deep Flow):</span> Prime window for high-stakes, focused work.<br>
                        <span style="color:#00f0ff;">&#x25A0; Blue (Vent/Recovery):</span> Mandatory window to step back, rest, and recharge.
                    </div>

                    <div style="font-family:'Orbitron'; font-size:0.75rem; color:#fff; font-weight:bold; margin-bottom:8px; border-bottom:1px dashed rgba(255,255,255,0.2); padding-bottom:4px;">ADVANCED: AI TEMPORAL FIREWALL</div>
                    <div style="font-size:0.6rem; color:#aaa; line-height: 1.5; margin-bottom: 10px;">
                        As you upgrade your system, you unlock your own AI temporal firewall. If an Entity broadcasts a sprint that crashes into your biological "Vent/Recovery" window, the system utilizes Unidirectional Target Broadcasting and Asynchronous Buffering. Non-resonant payloads are silently absorbed and automatically routed into your next available Deep Flow window, eradicating the need for negotiation or counter-proposals.
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
                            <div style="font-size:0.55rem; color:#888; margin-top: 4px;">Omni-Planner & Standard Calendar Sync.</div>
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
                            <div style="font-size:0.55rem; color:#888; margin-top: 4px;">AI Temporal Firewall, P2P Sync, Deep Flow Enforcement.</div>
                        </div>
                        ${proStatus}
                    </div>

                    <div class="hub-tier-row" style="background: rgba(244, 208, 104, 0.05);">
                        <div>
                            <div style="font-family:'Orbitron'; font-size:0.75rem; color:#F4D068; font-weight: bold;">ENTERPRISE TIER (CUSTOM PRICING)</div>
                            <div style="font-size:0.55rem; color:#888; margin-top: 4px;">Macro-Infrastructure, Yield Metrology, IoT Webhooks. [PHASE II DEFERRED]</div>
                        </div>
                        ${enterpriseStatus}
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
                    <div class="hub-input-group">
                        <label class="hub-input-lbl">FINANCIAL API BRIDGE (ENTERPRISE)</label>
                        <button class="hub-action-btn" style="background:rgba(0,0,0,0.5); border-color:#555; color:#555;" disabled>PHASE II BETA (LOCKED)</button>
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
                            Download and lock the planetary telemetry into your device's local storage. This guarantees 100% physics accuracy and continuous system operation even without an active internet connection.
                        </div>
                        <div class="hub-input-group">
                            <button class="hub-action-btn" style="background:rgba(244, 208, 104, 0.1); border-color:#F4D068; color:#F4D068;" onclick="if(window.Q_EphemerisBridge) { window.Q_EphemerisBridge.toggleOfflineMode(true); alert('[ CACHE ENGAGED ]\nOffline planetary telemetry secured.'); } else { alert('Ephemeris Bridge Offline.'); }">CACHE TELEMETRY DATA</button>
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
                    ${this.generateLibraryDOM()}
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

        const authBtn = document.getElementById('hub-main-auth-btn');
        if (authBtn) {
            authBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                if (authState === 'ACTIVE') {
                    if (window.Q_Auth && typeof window.Q_Auth.signOut === 'function') {
                        window.Q_Auth.signOut();
                    } else {
                        alert('Auth Bridge Not Ready. Ensure q-core.js has loaded.');
                    }
                } else {
                    if (window.Q_Auth && typeof window.Q_Auth.triggerOAuth === 'function') {
                        window.Q_Auth.triggerOAuth();
                    } else {
                        alert('Auth Bridge Not Ready. Ensure q-core.js has loaded.');
                    }
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

// Handle async loading gracefully
if (document.readyState === 'loading') {
    window.addEventListener('DOMContentLoaded', () => window.Q_IntegrationHub.init());
} else {
    window.Q_IntegrationHub.init();
}
