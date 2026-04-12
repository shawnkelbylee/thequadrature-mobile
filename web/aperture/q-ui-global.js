// THE QUADRATURE: APERTURE GATEWAY UI CONTROLLER
// Architect: Kelby | Engineer: Kairos
// STATUS: Version 23.3 - Gateway Controller Optimized. UI render logic offloaded to HTML. Handles strict routing and universal states.

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
};

// 3. AGGRESSIVE CAPTURE-PHASE ROUTING INTERCEPTOR
// Centralized kinematic routing logic for the Gateway
window.addEventListener('click', (e) => {
    // Bypass interceptor entirely if clicking inside the dashboard, planner, or modals
    if (e.target.closest('.q-hub-overlay') || e.target.closest('.modal-overlay') || e.target.closest('.q-planner-overlay')) {
        return; 
    }

    let el = e.target;
    let targetUrl = null;
    let depth = 0;

    while (el && depth < 5 && el !== document.body) {
        const text = (el.textContent || '').trim().toLowerCase();
        const onClickStr = (el.getAttribute('onclick') || '').toLowerCase();
        const hrefStr = (el.getAttribute('href') || '').toLowerCase();
        const dataTarget = (el.getAttribute('data-target') || '').toLowerCase();

        // Explicitly intercept Dashboard intents to prevent 404 sequencing
        if (dataTarget === 'dashboard' || hrefStr.includes('/dashboard') || onClickStr.includes('dashboard') || text.includes('dashboard')) {
            e.preventDefault();
            e.stopPropagation();
            if (window.Q_IntegrationHub) window.Q_IntegrationHub.openHub();
            return; // Halt interceptor loop
        }

        // Explicitly route Omni-Planner intents
        if (dataTarget === 'planner' || hrefStr.includes('/physical') || onClickStr.includes('physical') || text.includes('physical assets') || text.includes('omni-planner') || text.includes('omni planner')) {
            e.preventDefault();
            e.stopPropagation();
            if (window.Q_OmniPlanner) window.Q_OmniPlanner.openPlanner();
            return; // Halt interceptor loop
        }

        // GATEWAY ROUTING RESOLUTION (Jumping out of /aperture/ into target quads)
        if (dataTarget.includes('personal') || hrefStr.includes('/personal') || onClickStr.includes('personal') || text.includes('personal quad')) {
            targetUrl = '../personal/index.html';
        } else if (dataTarget.includes('commercial') || hrefStr.includes('/commercial') || onClickStr.includes('commercial') || text.includes('commercial quad')) {
            targetUrl = '../commercial/index.html';
        } 

        if (targetUrl) break;
        el = el.parentElement;
        depth++;
    }

    if (targetUrl) {
        e.preventDefault();
        e.stopPropagation(); 
        if (window.executeApertureSequence) {
            window.executeApertureSequence(targetUrl);
        } else {
            window.location.href = targetUrl;
        }
    }
}, true);

// INIT SEQUENCE
window.addEventListener('DOMContentLoaded', () => {
    window.injectUniversalUI();
    
    // UI TEXT OVERRIDE: Failsafe to ensure Omni-Planner nomenclature is enforced globally
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