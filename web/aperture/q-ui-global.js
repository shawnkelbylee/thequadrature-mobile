// THE QUADRATURE: APERTURE GATEWAY UI CONTROLLER
// Architect: Kelby | Engineer: Kairos
// STATUS: Version 23.6 - Interceptor rewritten. Regex target extraction + Animation bypass for Vector HUDs.

window.injectUniversalUI = function() {
    if (window.self !== window.top) return;
    if (document.getElementById('q-ui-injected-flag')) return;

    let oldMeta = document.querySelector('meta[name="viewport"]');
    if (oldMeta) oldMeta.remove();
    let meta = document.createElement('meta');
    meta.name = "viewport";
    meta.content = "width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no, viewport-fit=cover";
    document.head.appendChild(meta);
    
    let noCache1 = document.createElement('meta'); noCache1.httpEquiv = "Cache-Control"; noCache1.content = "no-cache, no-store, must-revalidate"; document.head.appendChild(noCache1);
    let noCache2 = document.createElement('meta'); noCache2.httpEquiv = "Pragma"; noCache2.content = "no-cache"; document.head.appendChild(noCache2);
    let noCache3 = document.createElement('meta'); noCache3.httpEquiv = "Expires"; noCache3.content = "0"; document.head.appendChild(noCache3);

    const flag = document.createElement('div');
    flag.id = 'q-ui-injected-flag';
    flag.style.display = 'none';
    document.body.appendChild(flag);

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
};

// --- DOMAIN SHIFT & AUTH LOGIC (APERTURE LEVEL) ---
window.triggerDomainShift = function(e) {
    if(e) e.preventDefault();
    let authState = localStorage.getItem('Q_SOVEREIGN_AUTH') === 'true' ? 'ACTIVE' : 'STANDBY';
    
    if(authState !== 'ACTIVE') {
        if(window.Q_Auth) window.Q_Auth.triggerOAuth();
        else alert("OAuth Service Unavailable. Please reload the Gateway.");
        return;
    }

    let rawEnt = localStorage.getItem('Q_ENTITLEMENTS');
    let entitlements = [];
    try { entitlements = JSON.parse(rawEnt) || []; } catch(err) {}

    // Master Access Fallback Check
    let authUser = localStorage.getItem('Q_SOVEREIGN_USER') || 'GUEST';
    if (authUser.toUpperCase() === 'KELBY' || authUser.includes('MASTER')) {
        entitlements = ["PERSONAL", "COMMERCIAL"];
        localStorage.setItem('Q_ENTITLEMENTS', JSON.stringify(entitlements));
    }

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
                <button onclick="window.Q_ModalEngine.close()" style="padding: 10px; background: transparent; border: 1px solid #555; color: #888; font-family: 'Orbitron'; font-size: 0.7rem; cursor: pointer; border-radius: 4px; margin-top: 5px;">
                    CANCEL / REMAIN
                </button>
            </div>
        `;
        if(window.Q_ModalEngine) window.Q_ModalEngine.render('DOMAIN SHIFT PROTOCOL', html);
        else alert("Routing Module Unavailable.");
    } else {
        if(window.Q_Auth) window.Q_Auth.triggerOAuth(); 
    }
};

// 3. HYPER-RESILIENT ROUTING INTERCEPTOR
window.addEventListener('click', (e) => {
    if (e.target.closest('.q-hub-overlay') || e.target.closest('.modal-overlay') || e.target.closest('.q-planner-overlay')) {
        return; 
    }

    let el = e.target;
    let targetUrl = null;
    let bypassSequence = false;
    let depth = 0;

    while (el && depth < 5 && el !== document.body) {
        const text = (el.textContent || '').trim().toLowerCase();
        const onClickStr = (el.getAttribute('onclick') || '').toLowerCase();
        const hrefStr = (el.getAttribute('href') || '').toLowerCase();
        const dataTarget = (el.getAttribute('data-target') || '').toLowerCase();

        // 1. Dashboard Intercept
        if (dataTarget === 'dashboard' || hrefStr.includes('/dashboard') || onClickStr.includes('dashboard') || text.includes('dashboard')) {
            e.preventDefault(); e.stopPropagation();
            if (window.Q_IntegrationHub) window.Q_IntegrationHub.openHub();
            return; 
        }

        // 2. Planner Intercept
        if (dataTarget === 'planner' || hrefStr.includes('/physical') || onClickStr.includes('physical') || text.includes('omni-planner') || text.includes('omni planner')) {
            e.preventDefault(); e.stopPropagation();
            if (window.Q_OmniPlanner) window.Q_OmniPlanner.openPlanner();
            return; 
        }

        // 3. EXPLICIT FILE EXTRACTION (Regex match for .html targets)
        const onClickMatch = onClickStr.match(/['"]([^'"]+\.html)['"]/);
        
        if (hrefStr.includes('.html')) {
            targetUrl = hrefStr;
            bypassSequence = !targetUrl.includes('index.html');
            break;
        } else if (onClickMatch) {
            targetUrl = onClickMatch[1];
            bypassSequence = !targetUrl.includes('index.html');
            break;
        } 
        // 4. MACRO GATEWAY FALLBACKS
        else if (dataTarget.includes('personal') || text === 'personal quad' || text === 'personal matrix') {
            targetUrl = '../personal/index.html';
            break;
        } else if (dataTarget.includes('commercial') || text === 'commercial quad' || text === 'enterprise ledger') {
            targetUrl = '../commercial/index.html';
            break;
        }

        el = el.parentElement;
        depth++;
    }

    if (targetUrl) {
        e.preventDefault();
        e.stopPropagation(); 
        
        if (window.executeApertureSequence && !bypassSequence) {
            window.executeApertureSequence(targetUrl);
        } else {
            // Hard route for specific Vector HUDs to prevent animation sequence failure
            window.location.href = targetUrl;
        }
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