// THE QUADRATURE: GLOBAL UI MATRIX & RENDERER
// Architect: Kelby | Engineer: Kairos
// STATUS: Phase II UI Decoupled. Aggressive Cache-Override Engaged.

window.injectUniversalUI = function() {
    if (window.self !== window.top) return;
    if (document.getElementById('q-ui-injected-flag')) return;

    let oldMeta = document.querySelector('meta[name="viewport"]');
    if (oldMeta) oldMeta.remove();
    let meta = document.createElement('meta');
    meta.name = "viewport";
    meta.content = "width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no, viewport-fit=cover";
    document.head.appendChild(meta);
    
    // Aggressive Cache-Control injection for OAuth Redirects
    let noCache1 = document.createElement('meta'); noCache1.httpEquiv = "Cache-Control"; noCache1.content = "no-cache, no-store, must-revalidate"; document.head.appendChild(noCache1);
    let noCache2 = document.createElement('meta'); noCache2.httpEquiv = "Pragma"; noCache2.content = "no-cache"; document.head.appendChild(noCache2);
    let noCache3 = document.createElement('meta'); noCache3.httpEquiv = "Expires"; noCache3.content = "0"; document.head.appendChild(noCache3);
    
    const path = window.location.pathname.toUpperCase();
    const bActive = path.includes("BIO");
    const eActive = path.includes("ENV");
    const mActive = path.includes("MEC");
    const cActive = path.includes("COM");
    const faceActive = (!bActive && !eActive && !mActive && !cActive);
    
    if (faceActive) {
        document.body.classList.add('q-chrono-face');
    } else {
        document.body.classList.add('q-vector-hud');
    }
    
    let wingAesthetic = "";
    if (bActive) {
        wingAesthetic = `background: linear-gradient(135deg, rgba(5, 8, 15, 0.8) 0%, rgba(10, 15, 30, 0.95) 100%); border: 1px solid rgba(0, 243, 255, 0.2); border-top: 1px solid var(--neon-cyan, #00f3ff); border-radius: 8px; box-shadow: 0 15px 35px rgba(0,0,0,0.8), inset 0 0 20px rgba(0,243,255,0.05);`;
    } else if (eActive) {
        wingAesthetic = `background: radial-gradient(circle at center, var(--env-green-dim, rgba(167, 255, 131, 0.2)) 0%, var(--glass-med, rgba(2, 12, 25, 0.65)) 80%); backdrop-filter: var(--blur-med, blur(16px)); -webkit-backdrop-filter: var(--blur-med, blur(16px)); box-shadow: 0 15px 40px rgba(0,0,0,0.7), inset 0 0 20px rgba(0,0,0,0.4); border-radius: 12px; border: 1px solid var(--env-green-dim, rgba(167, 255, 131, 0.2));`;
    } else if (mActive) {
        wingAesthetic = `backdrop-filter: blur(20px); -webkit-backdrop-filter: blur(20px); background: linear-gradient(135deg, rgba(15, 23, 42, 0.8) 0%, rgba(3, 4, 6, 0.95) 100%); border: 1px solid var(--titanium, #334155); border-top: 1px solid var(--theme-main, #f43f5e); border-radius: 4px; box-shadow: 0 20px 50px rgba(0,0,0,0.9), inset 0 0 30px rgba(0,0,0,0.5);`;
    } else if (cActive) {
        wingAesthetic = `background: linear-gradient(120deg, rgba(25,20,5,0.85) 0%, rgba(255,215,0,0.1) 40%, rgba(255,255,255,0.15) 50%, rgba(255,215,0,0.1) 60%, rgba(25,20,5,0.85) 100%); background-size: 300% 100%; backdrop-filter: var(--blur-med, blur(16px)); -webkit-backdrop-filter: var(--blur-med, blur(16px)); border: 2px solid var(--gold-bright, #ffd700); border-top: 1px solid rgba(255,215,0,0.5); border-radius: 20px; box-shadow: 0 10px 40px rgba(0,0,0,0.9), inset 0 0 20px rgba(255,215,0,0.1);`;
    } else { 
        wingAesthetic = `background: rgba(15, 12, 10, 0.9); backdrop-filter: var(--blur-med, blur(16px)); -webkit-backdrop-filter: var(--blur-med, blur(16px)); border-radius: 8px; box-shadow: 0 15px 35px rgba(0,0,0,0.8), inset 0 0 20px rgba(229, 228, 226, 0.1); border: 1px solid rgba(244, 208, 104, 0.3);`;
    }

    const style = document.createElement('style');
    style.innerHTML = `
        /* IRONCLAD VIEWPORT RECOVERY */
        html, body { 
            position: fixed !important; top: 0px !important; left: 0px !important; right: 0px !important; bottom: 0px !important; 
            width: 100vw !important; height: var(--app-height, 100vh) !important; 
            margin: 0px !important; padding: 0px !important; 
            overflow: hidden !important; touch-action: none !important; overscroll-behavior: none !important; transform: none !important; 
        }
        #mobile-telemetry-btn { display: none !important; pointer-events: none !important; }

        :root { --wing-w: 240px; --mod-w: 320px; --dial-size: 60vh; --wing-offset: calc((var(--dial-size) / 2) + 4vw); --glass-med: rgba(2, 12, 25, 0.65); --blur-med: blur(16px); --white-pure: #ffffff; --starlight: rgba(255, 255, 255, 0.7); --platinum: #E5E4E2; }
        
        .modal-overlay { position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.85); backdrop-filter: blur(10px); z-index: 10000; display: none; justify-content: center; align-items: center; cursor: pointer; }
        .modal-box { width: 400px; background: rgba(2, 6, 15, 0.95); border: 1px solid var(--theme-main, #00f0ff); border-radius: 12px; padding: 25px; box-shadow: 0 20px 50px rgba(0,0,0,0.9); display: flex; flex-direction: column; gap: 16px; cursor: default; pointer-events: auto; }
        .btn-close { background: transparent; border: 1px solid var(--platinum); color: var(--platinum); padding: 10px; font-family: 'Orbitron'; cursor: pointer; transition: 0.3s; width: 100%; margin-top: 10px; border-radius: 8px; font-weight: 700; letter-spacing: 2px; }

        .q-nav-bar { position: fixed; top: 0px !important; margin-top: 0px !important; left: 0 !important; width: 100%; height: 45px; background: rgba(2, 6, 15, 0.95); border-bottom: 1px solid var(--theme-dim, rgba(0, 240, 255, 0.2)); display: flex; justify-content: space-between; align-items: center; padding: 0 20px; box-sizing: border-box; z-index: 100000; font-family: 'Orbitron'; box-shadow: 0 5px 20px rgba(0,0,0,0.8); pointer-events: auto !important; }
        .q-nav-brand { color: #E5E4E2; font-weight: 900; letter-spacing: 4px; font-size: 0.8rem; text-shadow: 0 0 10px rgba(229, 228, 226, 0.4); flex-shrink: 0; }
        
        .q-nav-menu { display: flex; align-items: center; gap: 1vw; pointer-events: auto !important; }
        .q-nav-btn { background: transparent; border: 1px solid rgba(255,255,255,0.2); color: rgba(255,255,255,0.6); padding: 6px 12px; border-radius: 4px; font-family: 'Orbitron'; font-size: 0.6rem; font-weight: bold; cursor: pointer; transition: 0.3s; letter-spacing: 1px; text-decoration: none; display: inline-block; text-align: center; pointer-events: auto !important; }
        .q-nav-btn:hover { border-color: #fff; color: #fff; box-shadow: 0 0 10px rgba(255, 255, 255, 0.3); }
        
        /* AGGRESSIVE OAUTH CACHE OVERRIDES (!important forces vector colors through any lingering CSS) */
        .q-nav-btn.face-btn.active { border-color: var(--gold, #F4D068) !important; color: var(--gold, #F4D068) !important; box-shadow: inset 0 0 10px rgba(244,208,104,0.2) !important; }
        .q-nav-btn.bio-btn.active { border-color: var(--sys-cyan, #00f0ff) !important; color: var(--sys-cyan, #00f0ff) !important; box-shadow: inset 0 0 10px rgba(0,240,255,0.2) !important; }
        .q-nav-btn.com-btn.active { border-color: var(--gold, #F4D068) !important; color: var(--gold, #F4D068) !important; box-shadow: inset 0 0 10px rgba(244,208,104,0.2) !important; }
        .q-nav-btn.env-btn.active { border-color: var(--env-green, #a7ff83) !important; color: var(--env-green, #a7ff83) !important; box-shadow: inset 0 0 10px rgba(167,255,131,0.2) !important; }
        .q-nav-btn.mec-btn.active { border-color: var(--theme-main, #f43f5e) !important; color: var(--theme-main, #f43f5e) !important; box-shadow: inset 0 0 10px rgba(244,63,94,0.2) !important; }

        #q-mic-fab-desktop { position: fixed; bottom: 20px; right: 20px; width: 50px; height: 50px; border-radius: 50%; background: rgba(5, 8, 15, 0.9); border: 1px solid var(--theme-main, #00f0ff); color: var(--theme-main, #00f0ff); display: flex; justify-content: center; align-items: center; z-index: 100000; box-shadow: 0 0 15px rgba(0,0,0,0.8); cursor: pointer; font-size: 1.2rem; transition: all 0.3s ease; pointer-events: auto !important; }
        #q-mic-fab-desktop:hover { background: var(--theme-main, #00f0ff); color: #000; box-shadow: 0 0 20px var(--theme-main, #00f0ff); }
        #q-mic-fab-desktop.listening { background: var(--theme-main, #00f0ff); color: #000; box-shadow: 0 0 20px var(--theme-main, #00f0ff); animation: pulse-mic 1.5s infinite; }
        
        .q-control-strip { display: none; }
        .star-container { position: absolute; top: 0; left: 0; width: 100vw; height: var(--app-height, 100vh); z-index: 1; pointer-events: none; overflow: hidden; transform: translateZ(0); backface-visibility: hidden; }
        
        .wing { position: absolute; top: 50%; height: 220px; width: var(--wing-w); min-width: 240px; z-index: 50; display: flex; flex-direction: column; justify-content: center; transform: translateY(-50%); pointer-events: none; }
        .wing-left { right: calc(50% + var(--wing-offset)); left: auto; perspective: 1000px; }
        .wing-right { left: calc(50% + var(--wing-offset)); right: auto; perspective: 1000px; }
        .wing-content { display: flex; flex-direction: column; justify-content: center; align-items: center; text-align: center; width: 100%; height: 100%; overflow: hidden; pointer-events: auto; ${wingAesthetic} }
        .w-head { font-family: 'Orbitron'; font-weight: 600; font-size: 0.75rem; letter-spacing: 3px; color: rgba(255,255,255,0.6); border-bottom: 1px solid var(--theme-dim); padding-bottom: 4px; margin-bottom: 8px; display: inline-block; z-index: 20;}
        .w-lbl { font-family: 'JetBrains Mono'; font-size: 0.55rem; color: var(--starlight); letter-spacing: 1px; text-transform: uppercase; margin-bottom: 2px; z-index: 20;}
        .val-lg { font-family: 'Orbitron'; font-size: 1.2rem; font-weight: 700; letter-spacing: 1px; white-space: nowrap; color: #fff; text-shadow: 0 4px 10px rgba(0,0,0,0.5); z-index: 20;}
        .q-prefix { font-size: 0.6rem; color: rgba(255,255,255,0.4); font-family: 'JetBrains Mono'; margin-right: 2px; z-index: 20;}
        .q-val { color: var(--theme-main); font-family: 'Orbitron'; font-weight: 700; text-shadow: 0 0 15px var(--theme-dim); margin-right: 6px; z-index: 20;}

        .fmt-toggle { font-family: 'JetBrains Mono'; font-weight: bold; font-size: 0.6rem; color: var(--theme-main); cursor: pointer; border: 1px solid var(--theme-dim); padding: 2px 8px; border-radius: 4px; background: rgba(0,0,0,0.6); pointer-events: auto; transition: 0.3s; white-space: nowrap; }
        .fmt-toggle:hover { background: var(--theme-main); color: #000; box-shadow: 0 0 10px var(--theme-main); }
        
        .desktop-only { display: block !important; }
        .mobile-only-flex { display: none !important; }

        @media (max-width: 950px) {
            :root { --dial-size: min(48vh, 85vw) !important; } 
            .desktop-only { display: none !important; }
            .mobile-only-flex { display: flex !important; }
            
            body:not(.telemetry-open) .telemetry-node { display: none !important; visibility: hidden !important; }
            body:not(.telemetry-open) .vector-anchor { display: none !important; visibility: hidden !important; }
            body:not(.telemetry-open) .wing { display: none !important; }
            
            .q-nav-bar { 
                top: 0px !important; margin-top: 0px !important; left: 0px !important; 
                padding: 0 10px !important; 
                height: 50px !important; 
            }
            
            .q-nav-brand { font-size: 0.55rem !important; letter-spacing: 1px !important; white-space: nowrap; }
            
            #q-global-sim-badge { font-size: 0.45rem !important; padding: 2px 4px !important; letter-spacing: 0px !important; margin-left: 0 !important; white-space: nowrap; flex-shrink: 0; position: relative; z-index: 100000; pointer-events: auto !important; }
            
            .q-nav-menu { 
                position: static; flex-direction: row; overflow-x: auto; white-space: nowrap; 
                background: transparent; box-shadow: none; transform: none; width: auto;
                -webkit-overflow-scrolling: touch; border: none; padding-bottom: 0; gap: 5px;
            }
            .q-nav-menu::-webkit-scrollbar { display: none; }
            .q-nav-btn { padding: 4px 8px; font-size: 0.55rem; margin-right: 0; border-radius: 4px; border: 1px solid rgba(255,255,255,0.2) !important; }
            .vector-link { display: none !important; }

            .q-center-dial { margin-top: -3vh !important; }
            
            .q-control-strip { 
                position: fixed; bottom: 0 !important; left: 0; width: 100%; 
                background: rgba(2, 6, 15, 0.98); border-top: 1px solid var(--theme-dim, rgba(0, 240, 255, 0.2)); 
                display: flex; justify-content: space-around; align-items: center; z-index: 100000; 
                height: 65px !important; 
                padding-bottom: 0 !important;
                box-shadow: 0 -10px 30px rgba(0,0,0,0.9); pointer-events: auto !important; 
            }
            .strip-btn { background: transparent; border: none; color: var(--platinum); display: flex; flex-direction: column; align-items: center; gap: 4px; cursor: pointer; text-decoration: none; padding: 5px; pointer-events: auto !important; }
            .strip-btn svg { transition: 0.3s; }
            
            /* Aggressive Mobile Strip Active States */
            .strip-btn.face-strip.active svg { color: var(--gold, #F4D068) !important; filter: drop-shadow(0 0 8px var(--gold, #F4D068)) !important; }
            .strip-btn.face-strip.active .strip-lbl { color: var(--gold, #F4D068) !important; }
            .strip-btn.bio-strip.active svg { color: var(--sys-cyan, #00f0ff) !important; filter: drop-shadow(0 0 8px var(--sys-cyan, #00f0ff)) !important; }
            .strip-btn.bio-strip.active .strip-lbl { color: var(--sys-cyan, #00f0ff) !important; }
            .strip-btn.com-strip.active svg { color: var(--gold, #F4D068) !important; filter: drop-shadow(0 0 8px var(--gold, #F4D068)) !important; }
            .strip-btn.com-strip.active .strip-lbl { color: var(--gold, #F4D068) !important; }
            .strip-btn.env-strip.active svg { color: var(--env-green, #a7ff83) !important; filter: drop-shadow(0 0 8px var(--env-green, #a7ff83)) !important; }
            .strip-btn.env-strip.active .strip-lbl { color: var(--env-green, #a7ff83) !important; }
            .strip-btn.mec-strip.active svg { color: var(--theme-main, #f43f5e) !important; filter: drop-shadow(0 0 8px var(--theme-main, #f43f5e)) !important; }
            .strip-btn.mec-strip.active .strip-lbl { color: var(--theme-main, #f43f5e) !important; }

            .strip-lbl { font-family: 'Orbitron'; font-size: 0.4rem; font-weight: 900; letter-spacing: 1px; color: rgba(255,255,255,0.5); transition: 0.3s; }
            
            #q-mic-fab { position: fixed; bottom: 85px; right: 15px; width: 45px; height: 45px; border-radius: 50%; background: rgba(5, 8, 15, 0.9); border: 1px solid var(--sys-cyan, #00f0ff); color: var(--sys-cyan, #00f0ff); display: flex; justify-content: center; align-items: center; z-index: 100000; box-shadow: 0 0 15px rgba(0,0,0,0.8); cursor: pointer; font-size: 1.1rem; transition: all 0.3s ease; pointer-events: auto !important;}
            #q-mic-fab.listening { background: var(--sys-cyan, #00f0ff); color: #000; box-shadow: 0 0 20px var(--sys-cyan, #00f0ff); animation: pulse-mic 1.5s infinite; }

            /* STRICT RIBBON WRAP FIX */
            #mobile-telemetry-ribbon { 
                display: flex !important; position: fixed; 
                top: 50px !important; 
                margin-top: 0 !important; left: 0px !important; height: 45px !important; 
                width: 100vw !important; background: rgba(2, 6, 15, 0.98); border-bottom: 1px solid var(--theme-dim, rgba(0, 240, 255, 0.2)); 
                z-index: 99998 !important; justify-content: space-between; align-items: center; box-shadow: 0 5px 15px rgba(0,0,0,0.9); 
                padding: 0 10px !important; box-sizing: border-box;
                white-space: nowrap; overflow: hidden;
            }
            #ribbon-leg-date {
                white-space: nowrap;
                font-size: 0.6rem !important;
            }
            #ribbon-leg {
                white-space: nowrap;
                font-size: 0.65rem !important;
            }

            #mobile-telemetry-viewport { 
                display: none; position: fixed !important; 
                top: 95px !important; 
                bottom: 65px !important; 
                height: auto !important; 
                left: 0; width: 100vw; 
                background: rgba(5,5,8,0.95); backdrop-filter: blur(15px); -webkit-backdrop-filter: blur(15px); z-index: 99900; 
                overflow-y: scroll !important; overflow-x: hidden !important; -webkit-overflow-scrolling: touch; overscroll-behavior: contain;
                flex-direction: column; align-items: center; justify-content: flex-start; 
                padding-top: 15px !important; margin-top: 0 !important; 
                padding-bottom: 20px !important; 
                box-sizing: border-box !important; 
                gap: 15px; pointer-events: auto !important;
            }
            #mobile-telemetry-viewport .telemetry-node { 
                display: flex !important; position: relative !important; top: auto !important; left: auto !important; right: auto !important; bottom: auto !important; 
                transform: translateZ(0) !important; margin: 0 !important; width: 95vw !important; max-width: 360px !important; 
                min-height: min-content !important; height: auto !important; box-sizing: border-box !important; backface-visibility: hidden !important; 
                visibility: visible !important; flex-shrink: 0 !important; pointer-events: auto !important; opacity: 1 !important;
            }
            #mobile-telemetry-viewport .wing { display: none !important; }
            
            body.telemetry-open .q-center-dial { display: none !important; }
        }
    `;
    document.head.appendChild(style);

    const uiContainer = document.createElement('div');
    uiContainer.id = 'q-ui-injected-flag';
    uiContainer.innerHTML = `
        <div class="q-nav-bar">
            <div style="display:flex; align-items:center; gap:8px; flex-wrap: nowrap; overflow: hidden;">
                <span class="q-nav-brand" style="white-space: nowrap;">THE QUADRATURE</span>
                <div id="q-global-sim-badge" style="display: none; background: var(--gold, #F4D068); color: #000; font-family: 'Orbitron'; font-size: 0.55rem; font-weight: 900; padding: 4px 8px; border-radius: 4px; cursor: pointer; white-space: nowrap; flex-shrink: 0; position: relative; z-index: 100000; pointer-events: auto !important;" onclick="if(window.Q_Auth) window.Q_Auth.triggerOAuth();" ontouchstart="if(window.Q_Auth) window.Q_Auth.triggerOAuth(); event.preventDefault();">[ IN THE QUAD ]</div>
            </div>
            <div class="q-nav-menu" id="q-nav-menu">
                <a href="index.html?v=16.4" class="q-nav-btn face-btn vector-link ${faceActive ? 'active' : ''}" ontouchstart="window.location.href=this.href; event.preventDefault();">CHRONO-FACE</a>
                <a href="BIOVECHUD.html?v=16.4" class="q-nav-btn bio-btn vector-link ${bActive ? 'active' : ''}" ontouchstart="window.location.href=this.href; event.preventDefault();">BIOLOGICAL</a>
                <a href="COMVECHUD.html?v=16.4" class="q-nav-btn com-btn vector-link ${cActive ? 'active' : ''}" ontouchstart="window.location.href=this.href; event.preventDefault();">COMMUNAL</a>
                <a href="ENVVECHUD.html?v=16.4" class="q-nav-btn env-btn vector-link ${eActive ? 'active' : ''}" ontouchstart="window.location.href=this.href; event.preventDefault();">ENVIRONMENTAL</a>
                <a href="MECVECHUD.html?v=16.4" class="q-nav-btn mec-btn vector-link ${mActive ? 'active' : ''}" ontouchstart="window.location.href=this.href; event.preventDefault();">MECHANICAL</a>
                <button class="q-nav-btn omni desktop-only" style="border-color: var(--gold, #F4D068); color: var(--gold, #F4D068);" onclick="if(typeof window.Q_OmniPlanner !== 'undefined') window.Q_OmniPlanner.openPlanner()" ontouchstart="if(typeof window.Q_OmniPlanner !== 'undefined') window.Q_OmniPlanner.openPlanner(); event.preventDefault();">[ OMNI-PLANNER ]</button>
                <button class="q-nav-btn special desktop-only" style="border-color: var(--gold, #F4D068); color: var(--gold, #F4D068);" onclick="if(typeof window.Q_IntegrationHub !== 'undefined') window.Q_IntegrationHub.openHub()" ontouchstart="if(typeof window.Q_IntegrationHub !== 'undefined') window.Q_IntegrationHub.openHub(); event.preventDefault();">[ DASHBOARD ]</button>
            </div>
            <button class="mobile-only-flex" style="background:transparent; border:none; color:var(--theme-main, #00f0ff); font-size:1.5rem; padding:0; margin:0; cursor:pointer;" onclick="if(typeof window.Q_IntegrationHub !== 'undefined') window.Q_IntegrationHub.openHub()" ontouchstart="if(typeof window.Q_IntegrationHub !== 'undefined') window.Q_IntegrationHub.openHub(); event.preventDefault();">☰</button>
        </div>

        <div id="mobile-telemetry-ribbon" class="mobile-only-flex">
            <span id="ribbon-leg-date" style="font-family:'Orbitron'; font-size:0.65rem; color:var(--starlight); font-weight:bold; letter-spacing:1px; white-space:nowrap;">--</span>
            <div style="display:flex; align-items:center; gap: 4px;">
                <span class="val-gold" id="ribbon-leg" style="color:var(--gold); font-family:'JetBrains Mono'; font-size:0.65rem; font-weight:bold; margin-top:2px; white-space:nowrap;">--</span>
                <div class="fmt-toggle" onclick="window.toggleTimeFmt('ribbon-fmt')" ontouchstart="window.toggleTimeFmt('ribbon-fmt'); event.preventDefault();" id="ribbon-fmt" style="border-color:var(--gold); color:var(--gold); padding:2px 6px; font-size:0.5rem; pointer-events:auto; position:relative; z-index:100000; white-space:nowrap;">UTC</div>
            </div>
        </div>
        
        <div class="q-control-strip mobile-only-flex">
            <button class="strip-btn" onclick="if(typeof window.toggleTelemetry === 'function') window.toggleTelemetry()" ontouchstart="if(typeof window.toggleTelemetry === 'function') window.toggleTelemetry(); event.preventDefault();">
                <svg id="tele-icon" viewBox="0 0 24 24" width="22" height="22" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" fill="none"><path d="M18 20V10M12 20V4M6 20v-6"/></svg>
                <span class="strip-lbl">DATA</span>
            </button>
            <a href="BIOVECHUD.html?v=16.4" class="strip-btn bio-strip ${bActive ? 'active' : ''}" ontouchstart="window.location.href=this.href; event.preventDefault();">
                <svg viewBox="0 0 24 24" width="22" height="22" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" fill="none"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/></svg>
                <span class="strip-lbl">BIO</span>
            </a>
            <a href="COMVECHUD.html?v=16.4" class="strip-btn com-strip ${cActive ? 'active' : ''}" ontouchstart="window.location.href=this.href; event.preventDefault();">
                <svg viewBox="0 0 24 24" width="22" height="22" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" fill="none"><circle cx="12" cy="5" r="3"/><line x1="12" y1="8" x2="12" y2="16"/><circle cx="6" cy="20" r="3"/><circle cx="18" cy="20" r="3"/><line x1="12" y1="16" x2="6" y2="17"/><line x1="12" y1="16" x2="18" y2="17"/></svg>
                <span class="strip-lbl">COM</span>
            </a>
            <a href="index.html?v=16.4" class="strip-btn face-strip ${faceActive ? 'active' : ''}" ontouchstart="window.location.href=this.href; event.preventDefault();">
                <svg viewBox="0 0 24 24" width="22" height="22" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" fill="none"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/></svg>
                <span class="strip-lbl">CHRONO</span>
            </a>
            <a href="ENVVECHUD.html?v=16.4" class="strip-btn env-strip ${eActive ? 'active' : ''}" ontouchstart="window.location.href=this.href; event.preventDefault();">
                <svg viewBox="0 0 24 24" width="22" height="22" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" fill="none"><path d="M2 22h20L12 2z"/></svg>
                <span class="strip-lbl">ENV</span>
            </a>
            <a href="MECVECHUD.html?v=16.4" class="strip-btn mec-strip ${mActive ? 'active' : ''}" ontouchstart="window.location.href=this.href; event.preventDefault();">
                <svg viewBox="0 0 24 24" width="22" height="22" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" fill="none"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>
                <span class="strip-lbl">MEC</span>
            </a>
            <button class="strip-btn" onclick="if(typeof window.Q_OmniPlanner !== 'undefined') window.Q_OmniPlanner.openPlanner()" ontouchstart="if(typeof window.Q_OmniPlanner !== 'undefined') window.Q_OmniPlanner.openPlanner(); event.preventDefault();">
                <svg viewBox="0 0 24 24" width="22" height="22" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" fill="none"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><line x1="3" y1="9" x2="21" y2="9"/><line x1="9" y1="21" x2="9" y2="9"/></svg>
                <span class="strip-lbl">PLAN</span>
            </button>
        </div>

        <button id="q-mic-fab" class="mobile-only-flex" onclick="if(window.Q_KairosVoice) window.Q_KairosVoice.toggle()" ontouchstart="if(window.Q_KairosVoice) window.Q_KairosVoice.toggle(); event.preventDefault();">🎙</button>
    `;
    
    const refNode = document.body.firstChild;
    while (uiContainer.firstChild) document.body.insertBefore(uiContainer.firstChild, refNode);

    window.addEventListener('q-tick', (e) => {
        const badge = document.getElementById('q-global-sim-badge');
        if (badge) {
            badge.style.display = e.detail.isLive ? 'flex' : 'none';
            badge.innerText = e.detail.isLive ? "[ IN THE QUAD ]" : "[ TEMPORAL PROJECTION ]";
            if (!e.detail.isLive) {
                badge.style.background = "#ff003c";
                badge.style.color = "#fff";
                badge.style.border = "none";
            } else {
                badge.style.background = "var(--gold, #F4D068)";
                badge.style.color = "#000";
            }
        }

        const ribbonLeg = document.getElementById('ribbon-leg');
        const ribbonLegDate = document.getElementById('ribbon-leg-date');
        const ribbonFmt = document.getElementById('ribbon-fmt');
        
        if (ribbonLeg && ribbonLegDate) {
            function formatDualColorMobile(str) {
                const letterStyle = "color:var(--starlight); font-family:'Orbitron'; font-size:0.6rem; margin-right:2px;";
                const numStyle = "color:var(--gold); font-size:0.75rem; font-weight:bold;";
                let out = "";
                let tokens = str.match(/([0-9]+)|([^0-9]+)/g);
                if (tokens) {
                    tokens.forEach(t => {
                        if (/[0-9]/.test(t)) out += `<span style="${numStyle}">${t}</span>`;
                        else out += `<span style="${letterStyle}">${t}</span>`;
                    });
                }
                return out;
            }

            ribbonLeg.innerHTML = formatDualColorMobile(e.detail.legacyTimeStr);
            if (ribbonFmt) ribbonFmt.innerText = localStorage.getItem('Q_TIME_FMT') || 'UTC_24';

            if (document.body.classList.contains('planner-quad-active')) {
                const qData = e.detail.qData;
                const t = e.detail.t;
                let activeBlock = window.getQBlockByTime ? window.getQBlockByTime(t) : null;
                let cCycle = activeBlock ? activeBlock.cycle : 0;
                let qcStr = (activeBlock && activeBlock.type === 'PYLON') ? 
                    `<span style="color:var(--gold, #F4D068);">QC</span> <span style="color:#fff;">${cCycle}</span> <span style="color:var(--gold, #F4D068);">${activeBlock.name}</span>` : 
                    `<span style="color:var(--gold, #F4D068);">QC</span> <span style="color:#fff;">${cCycle}</span> <span style="color:var(--gold, #F4D068);">Q</span><span style="color:#fff;">${qData.quad}</span> <span style="color:var(--gold, #F4D068);">S</span><span style="color:#fff;">${qData.sect}</span> <span style="color:var(--gold, #F4D068);">DAY</span> <span style="color:#fff;">${qData.day}</span>`;
                
                ribbonLegDate.innerHTML = qcStr;
            } else {
                // FIXED: Hard-binds the date string to the main theme color, dropping the dual-color regex
                ribbonLegDate.innerHTML = `<span style="color:var(--theme-main, #F4D068); font-size:0.75rem; font-weight:bold;">${e.detail.legacyDateStr.toUpperCase()}</span>`;
            }
        }
    });
};

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
    if (window.Q_LOG) window.Q_LOG('INFO', 'INTERFACE', 'TIME_FORMAT_TOGGLED', { format: newFmt });
};

window.toggleTelemetry = function() {
    const isOpen = document.body.classList.toggle('telemetry-open');
    const icon = document.getElementById('tele-icon');
    if(icon) icon.innerHTML = isOpen ? "✖" : `<path d="M18 20V10M12 20V4M6 20v-6"/>`;
    let viewport = document.getElementById('mobile-telemetry-viewport');
    if (isOpen) {
        if (!viewport) { 
            viewport = document.createElement('div'); 
            viewport.id = 'mobile-telemetry-viewport'; 
            document.body.appendChild(viewport); 
        }
        viewport.style.display = 'flex';
        document.querySelectorAll('.telemetry-node').forEach(node => {
            if (!node.classList.contains('q-control-strip') && !node.classList.contains('q-nav-bar') && !node.classList.contains('wing')) {
                viewport.appendChild(node);
            }
        });
    } else {
        if (viewport) { 
            Array.from(viewport.childNodes).forEach(node => document.body.appendChild(node)); 
            viewport.style.display = 'none'; 
        }
    }
    if(window.Q_MobileBridge) window.Q_MobileBridge.pulse('LIGHT');
};

window.generateStars = function(containerId) {
    const container = document.getElementById(containerId);
    if(!container) return;
    
    if (!document.getElementById('q-star-style')) {
        const style = document.createElement('style');
        style.id = 'q-star-style';
        style.innerHTML = `
            .star-kinetic {
                position: absolute; top: 50%; left: 50%; width: 2px; height: 2px;
                background: var(--warp-color, #fff); border-radius: 50%;
                transform-origin: 0 0;
                transform: rotate(var(--angle)) translateX(var(--radius)) scaleX(calc(1 + var(--warp-factor, 0) * 20));
                opacity: var(--opacity);
                transition: transform 0.1s linear, background 0.3s ease;
            }
        `;
        document.head.appendChild(style);
    }
    
    container.innerHTML = '';
    for(let i=0; i<150; i++) {
        let star = document.createElement('div'); 
        star.className = 'star-kinetic';
        star.style.setProperty('--angle', Math.random() * 360 + 'deg'); 
        star.style.setProperty('--radius', (Math.random() * 600 + 50) + 'px');
        star.style.setProperty('--opacity', Math.random() * 0.8 + 0.2); 
        container.appendChild(star);
    }
};

// --- DECOUPLED VISUAL WARP ENGINE ---
(function initWarpEngine() {
    let warpFactor = 0;
    let targetWarp = 0;
    let lastDays = null;

    window.addEventListener('q-tick', (e) => {
        const currentDays = e.detail.daysElapsed;
        if (lastDays !== null && !e.detail.isLive) {
            const delta = Math.abs(currentDays - lastDays);
            if (delta > 0) {
                targetWarp = Math.min(1.0, targetWarp + (delta * 0.5)); 
            }
        }
        lastDays = currentDays;
    });

    const tick = () => {
        targetWarp *= 0.90; 
        warpFactor += (targetWarp - warpFactor) * 0.2; 
        
        if (document.documentElement) {
            document.documentElement.style.setProperty('--warp-factor', Math.max(0, warpFactor).toFixed(3));
            document.documentElement.style.setProperty('--warp-color', warpFactor > 0.05 ? 'var(--sys-cyan, #00f0ff)' : '#fff');
        }
        requestAnimationFrame(tick);
    };
    
    window.addEventListener('DOMContentLoaded', () => {
        requestAnimationFrame(tick);
    });
})();

// Auto-init UI if logic hasn't yet, or standard load
window.addEventListener('DOMContentLoaded', () => {
    window.injectUniversalUI();
});