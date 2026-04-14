// THE QUADRATURE: APERTURE GATEWAY UI CONTROLLER
// Architect: Kelby | Engineer: Kairos
// STATUS: Version 24.2 - Gateway Controller Optimized. Architect Master Override integrated and Mobile UI cross-talk neutralized.

window.injectUniversalUI = function() {
    if (window.self !== window.top) return;
    if (document.getElementById('q-ui-injected-flag')) return;

    // 1. IRONCLAD METADATA ENFORCEMENT
    let oldMeta = document.querySelector('meta[name="viewport"]');
    if (oldMeta) oldMeta.remove();
    let meta = document.createElement('meta');
    meta.name = "viewport";
    meta.content = "width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no, viewport-fit=cover";
    document.head.appendChild(meta);
    
    let noCache1 = document.createElement('meta'); noCache1.httpEquiv = "Cache-Control"; noCache1.content = "no-cache, no-store, must-revalidate"; document.head.appendChild(noCache1);
    let noCache2 = document.createElement('meta'); noCache2.httpEquiv = "Pragma"; noCache2.content = "no-cache"; document.head.appendChild(noCache2);
    let noCache3 = document.createElement('meta'); noCache3.httpEquiv = "Expires"; noCache3.content = "0"; document.head.appendChild(noCache3);

    // Flag injection to prevent duplicate runs
    const flag = document.createElement('div');
    flag.id = 'q-ui-injected-flag';
    flag.style.display = 'none';
    document.body.appendChild(flag);

    // 2. LOCAL TIME FORMAT TOGGLE LOGIC
    window.toggleTimeFmt = function(btnId) {
        let fmt = localStorage.getItem('Q_TIME_FMT') || 'UTC_24';
        const cycle = { 'UTC_24': 'LOCAL_24', 'LOCAL_24': 'UTC_12', 'UTC_12': 'LOCAL_12', 'LOCAL_12': 'UTC_24' };
        let newFmt = cycle[fmt] || 'UTC_24';
        
        if (window.Q_UpdateState) window.Q_UpdateState('system_state', 'q_time_fmt', newFmt);
        else localStorage.setItem('Q_TIME_FMT', newFmt);
        
        document.querySelectorAll('.fmt-toggle').forEach(btn => {
            btn.innerText = newFmt.replace('_', ' ');
        });
        
        if (window.Q_MobileBridge) window.Q_MobileBridge.pulse('LIGHT');
    };

    // 3. APERTURE RETURN TAB INJECTION
    // Injects a global return button into the top navigation bar to return to the gateway.
    setTimeout(() => {
        const navBar = document.querySelector('.q-nav-bar') || document.querySelector('header');
        if (navBar && !document.getElementById('btn-return-aperture')) {
            const returnBtn = document.createElement('button');
            returnBtn.id = 'btn-return-aperture';
            returnBtn.innerText = 'APERTURE';
            returnBtn.style.cssText = "background: rgba(0, 240, 255, 0.1); border: 1px solid #00f0ff; color: #00f0ff; font-family: 'Orbitron'; font-size: 0.65rem; font-weight: 900; padding: 6px 12px; border-radius: 4px; cursor: pointer; letter-spacing: 2px; position: absolute; right: 70px; top: 50%; transform: translateY(-50%); z-index: 1000; box-shadow: 0 0 10px rgba(0, 240, 255, 0.2); transition: 0.3s;";
            
            returnBtn.onmouseover = () => { 
                returnBtn.style.background = '#00f0ff'; 
                returnBtn.style.color = '#000'; 
                returnBtn.style.boxShadow = '0 0 15px #00f0ff'; 
            };
            returnBtn.onmouseout = () => { 
                returnBtn.style.background = 'rgba(0, 240, 255, 0.1)'; 
                returnBtn.style.color = '#00f0ff'; 
                returnBtn.style.boxShadow = '0 0 10px rgba(0, 240, 255, 0.2)'; 
            };

            returnBtn.onclick = (e) => {
                e.preventDefault();
                e.stopPropagation();
                // Route back to the root gateway
                window.location.href = '/'; 
            };
            
            // Ensure the navbar can hold absolute children without breaking layout
            if (window.getComputedStyle(navBar).position === 'static') {
                navBar.style.position = 'relative';
            }
            navBar.appendChild(returnBtn);
        }
    }, 500); 
};

// --- DOMAIN SHIFT & AUTH LOGIC (APERTURE LEVEL) ---
window.triggerDomainShift = function(e) {
    if(e) e.preventDefault();
    let authState = localStorage.getItem('Q_SOVEREIGN_AUTH') === 'true' ? 'ACTIVE' : 'STANDBY';
    
    if(authState !== 'ACTIVE') {
        if(window.Q_Auth && typeof window.Q_Auth.triggerOAuth === 'function') window.Q_Auth.triggerOAuth();
        else alert("OAuth Service Unavailable. Please reload the Gateway.");
        return;
    }

    let rawEnt = localStorage.getItem('Q_ENTITLEMENTS');
    let entitlements = [];
    try { entitlements = JSON.parse(rawEnt) || []; } catch(err) {}

    // --- MASTER ACCESS OVERRIDE (THE ARCHITECT) ---
    let authUser = localStorage.getItem('Q_SOVEREIGN_USER') || 'GUEST';
    let isLocalEnv = (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1' || window.location.protocol === 'file:');
    
    if (isLocalEnv || authUser.toUpperCase().includes('KELBY') || authUser.toUpperCase().includes('MASTER') || localStorage.getItem('Q_ARCHITECT_MODE') === 'TRUE') {
        if (!entitlements.includes("PERSONAL")) entitlements.push("PERSONAL");
        if (!entitlements.includes("COMMERCIAL")) entitlements.push("COMMERCIAL");
        localStorage.setItem('Q_ENTITLEMENTS', JSON.stringify(entitlements));
    }
    // ----------------------------------------------

    if(entitlements.includes("PERSONAL") && entitlements.includes("COMMERCIAL")) {
        const html = `
            <div style="font-family:'JetBrains Mono'; font-size:0.7rem; color:#aaa; margin-bottom: 15px; text-align:center;">
                Dual entitlements detected. Select operating domain.
            </div>
            <div style="display:flex; flex-direction:column; gap:10px;">
                <button onclick="window.location.href='../personal/index.html'" style="padding: 15px; background: rgba(0,0,0,0.8); border: 1px solid #F4D068; color: #F4D068; font-family: 'Orbitron'; font-size: 0.9rem; cursor: pointer; border-radius: 4px; box-shadow: 0 0 15px rgba(244, 208, 104, 0.25);">
                    PERSONAL MATRIX
                </button>
                <button onclick="window.location.href='../commercial/index.html'" style="padding: 15px; background: rgba(0,0,0,0.8); border: 1px solid #ffffff; color: #ffffff; font-family: 'Orbitron'; font-size: 0.9rem; cursor: pointer; border-radius: 4px; box-shadow: 0 0 15px rgba(255, 255, 255, 0.25);">
                    ENTERPRISE LEDGER
                </button>
                <button onclick="if(window.Q_ModalEngine) window.Q_ModalEngine.close()" style="padding: 10px; background: transparent; border: 1px solid #555; color: #888; font-family: 'Orbitron'; font-size: 0.7rem; cursor: pointer; border-radius: 4px; margin-top: 5px;">
                    CANCEL / REMAIN
                </button>
            </div>
        `;
        if(window.Q_ModalEngine) window.Q_ModalEngine.render('DOMAIN SHIFT PROTOCOL', html);
        else alert("Routing Module Unavailable.");
    } else {
        if(window.Q_Auth && typeof window.Q_Auth.triggerOAuth === 'function') window.Q_Auth.triggerOAuth(); 
    }
};

// 3. BULLETPROOF ROUTING INTERCEPTOR
window.addEventListener('click', (e) => {
    try {
        let el = e.target;
        
        if (el && el.nodeType === Node.TEXT_NODE) {
            el = el.parentNode;
        }
        
        if (!el || typeof el.closest !== 'function') return;

        // EXCLUSION PROTOCOL: Exempt mobile panels from the global interceptor to allow native routing
        if (el.closest('.q-hub-overlay') || el.closest('.modal-overlay') || el.closest('.q-planner-overlay') || el.id === 'btn-return-aperture' || el.closest('.m-panel') || el.closest('.mobile-routing-grid')) {
            return; 
        }

        let targetUrl = null;
        let depth = 0;
        let checkEl = el;

        while (checkEl && depth < 5 && checkEl !== document.body) {
            const text = (checkEl.textContent || '').trim().toLowerCase();
            const onClickStr = (checkEl.getAttribute && checkEl.getAttribute('onclick') || '').toLowerCase();
            const hrefStr = (checkEl.getAttribute && checkEl.getAttribute('href') || '').toLowerCase();
            const dataTarget = (checkEl.getAttribute && checkEl.getAttribute('data-target') || '').toLowerCase();

            if (dataTarget === 'dashboard' || hrefStr.includes('/dashboard') || onClickStr.includes('dashboard') || text.includes('dashboard')) {
                e.preventDefault();
                e.stopPropagation();
                if (window.Q_IntegrationHub && typeof window.Q_IntegrationHub.openHub === 'function') {
                    window.Q_IntegrationHub.openHub();
                }
                return; 
            }

            if (dataTarget === 'planner' || hrefStr.includes('/physical') || onClickStr.includes('physical') || text.includes('physical assets') || text.includes('omni-planner') || text.includes('omni planner')) {
                e.preventDefault();
                e.stopPropagation();
                if (window.Q_OmniPlanner && typeof window.Q_OmniPlanner.openPlanner === 'function') {
                    window.Q_OmniPlanner.openPlanner();
                }
                return; 
            }

            if (dataTarget.includes('personal') || hrefStr.includes('/personal') || onClickStr.includes('personal') || text.includes('personal quad')) {
                targetUrl = '../personal/index.html';
                break;
            } else if (dataTarget.includes('commercial') || hrefStr.includes('/commercial') || onClickStr.includes('commercial') || text.includes('commercial quad')) {
                targetUrl = '../commercial/index.html';
                break;
            } 

            checkEl = checkEl.parentElement;
            depth++;
        }

        if (targetUrl) {
            e.preventDefault();
            e.stopPropagation(); 
            if (typeof window.executeApertureSequence === 'function') {
                window.executeApertureSequence(targetUrl);
            } else {
                window.location.href = targetUrl;
            }
        }
    } catch (err) {
        console.error("Q-OS Routing Intercept Failed:", err);
    }
}, true);

// INIT SEQUENCE
window.addEventListener('DOMContentLoaded', () => {
    window.injectUniversalUI();
    
    const renamePanel = () => {
        const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT, null, false);
        let node;
        while ((node = walker.nextNode())) {
            if (node.nodeValue.trim().toUpperCase() === 'PHYSICAL ASSETS') {
                node.nodeValue = node.nodeValue.replace(/PHYSICAL ASSETS/ig, 'OMNI-PLANNER');
            }
        }
    };
    
    renamePanel();
    setTimeout(renamePanel, 150);
    setTimeout(renamePanel, 500);
});