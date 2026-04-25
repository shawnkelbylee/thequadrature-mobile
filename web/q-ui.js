// THE QUADRATURE: UNIFIED UI MATRIX & RENDERER
// Architect: Kelby | Engineer: Kairos
// STATUS: Phase IV UI Engine. Hollow Shell Optimization. 
// REVISION: Single-Index Purge Override, Aperture Parser Fix, & Mobile Panel Geometry

window.injectUniversalUI = function() {
    if (window.self !== window.top) return;
    if (document.getElementById('q-ui-injected-flag')) return;

    if (document.body.classList.contains('boot-active')) {
        document.body.classList.remove('boot-active');
    }

    let oldMeta = document.querySelector('meta[name="viewport"]');
    if (oldMeta) oldMeta.remove();
    let meta = document.createElement('meta');
    meta.name = "viewport";
    meta.content = "width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no, viewport-fit=cover";
    document.head.appendChild(meta);
    
    let noCache1 = document.createElement('meta'); noCache1.httpEquiv = "Cache-Control"; noCache1.content = "no-cache, no-store, must-revalidate"; document.head.appendChild(noCache1);
    let noCache2 = document.createElement('meta'); noCache2.httpEquiv = "Pragma"; noCache2.content = "no-cache"; document.head.appendChild(noCache2);
    let noCache3 = document.createElement('meta'); noCache3.httpEquiv = "Expires"; noCache3.content = "0"; document.head.appendChild(noCache3);
    
    // --- EXACT PATH DETECTION (Aperture Override) ---
    const path = window.location.pathname.toUpperCase();
    const href = window.location.href.toUpperCase();
    const docTitle = document.title.toUpperCase();
    
    const isHome = path.endsWith("/") || path.endsWith("INDEX.HTML") || path === "" || href.includes("APERTURE") || docTitle.includes("APERTURE");
    
    const bActive = href.includes("PHYSIOLOGICAL") || docTitle.includes("PHYSIOLOGICAL");
    const cActive = href.includes("METAPHYSICAL") || docTitle.includes("METAPHYSICAL");
    const eActive = href.includes("METEOROLOGICAL") || docTitle.includes("METEOROLOGICAL");
    const mActive = href.includes("ASTROPHYSICAL") || docTitle.includes("ASTROPHYSICAL");
    
    const isVector = bActive || cActive || eActive || mActive;
    
    if (isHome && !isVector) {
        document.body.classList.add('q-aperture-home');
        document.body.classList.remove('q-vector-hud');
    } else {
        document.body.classList.add('q-vector-hud');
        document.body.classList.remove('q-aperture-home');
    }
    
    const authState = localStorage.getItem('Q_PRO_AUTH') === 'true' ? 'ACTIVE' : 'STANDBY';
    const authBg = authState === 'ACTIVE' ? '#39ff14' : 'transparent';
    const authColor = authState === 'ACTIVE' ? '#000' : '#ff003c';
    const authBorder = authState === 'ACTIVE' ? '#39ff14' : '#ff003c';
    const authText = authState === 'ACTIVE' ? '[ IN THE QUAD ]' : '[ AUTHENTICATE ]';

    const style = document.createElement('style');
    style.innerHTML = `
        /* --- CORE NORMALIZATION --- */
        html, body { 
            position: fixed !important; top: 0px !important; left: 0px !important; right: 0px !important; bottom: 0px !important; 
            width: 100% !important; height: var(--app-height, 100vh) !important; 
            margin: 0px !important; padding: 0px !important; 
            overflow: hidden !important; touch-action: none !important; overscroll-behavior: none !important; transform: none !important; 
            background-color: #010205; 
        }
        #mobile-telemetry-btn { display: none !important; pointer-events: none !important; }

        :root { 
            --wing-w: 240px; --mod-w: 320px; --dial-size: 60vh; --wing-offset: calc((var(--dial-size) / 2) + 4vw); 
            --glass-med: rgba(2, 12, 25, 0.65); --blur-med: blur(16px); --white-pure: #ffffff; 
            --starlight: rgba(255, 255, 255, 0.7); --platinum: #E5E4E2; --chrono-amber: #B97A35; 
            --chrono-amber-dim: rgba(185, 122, 53, 0.2); 
            --q-blue-glow: rgba(0, 163, 255, 0.3); --q-metal: #e2e8f0;
            --center-gap-x: 36vh; 
            --corner-gap-y: 21vh; 
            --corner-gap-x: 32vh;
            --panel-w: 460px;
            --panel-h: 170px;
        }
        
        body.q-aperture-home {
            --center-gap-x: 31vh; 
            --corner-gap-y: 24vh; 
            --corner-gap-x: 23vh;
            --panel-w: 340px;
            --panel-h: 80px;
        }
        
        .modal-overlay { position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.85); backdrop-filter: blur(10px); z-index: 10000; display: none; justify-content: center; align-items: center; cursor: pointer; }
        .modal-box { width: 400px; background: rgba(2, 6, 15, 0.95); border: 1px solid var(--theme-main, #00f0ff); border-radius: 12px; padding: 25px; box-shadow: 0 20px 50px rgba(0,0,0,0.9); display: flex; flex-direction: column; gap: 16px; cursor: default; pointer-events: auto; }
        .btn-close { background: transparent; border: 1px solid var(--platinum); color: var(--platinum); padding: 10px; font-family: 'Orbitron'; cursor: pointer; transition: 0.3s; width: 100%; margin-top: 10px; border-radius: 8px; font-weight: 700; letter-spacing: 2px; }

        .space-bg { position: fixed; inset: 0; z-index: 0; background-image: radial-gradient(circle at 50% 50%, #030814 0%, #010205 100%); pointer-events: none;}
        .star-container { position: absolute; inset: 0; z-index: 1; pointer-events: none; }

        .nebula-left { position: fixed; top: -10%; bottom: -10%; left: -10%; width: 55vw; z-index: 1; background: url('assets/nebula-left.png') center/cover no-repeat; mix-blend-mode: screen; animation: nebula-drift-l 35s ease-in-out infinite alternate; -webkit-mask-image: radial-gradient(ellipse 100% 100% at 0% 50%, rgba(0,0,0,1) 20%, rgba(0,0,0,0) 80%); mask-image: radial-gradient(ellipse 100% 100% at 0% 50%, rgba(0,0,0,1) 20%, rgba(0,0,0,0) 80%); pointer-events: none; }
        .nebula-right { position: fixed; top: -10%; bottom: -10%; right: -10%; width: 55vw; z-index: 1; background: url('assets/nebula-right.png') center/cover no-repeat; mix-blend-mode: screen; animation: nebula-drift-r 42s ease-in-out infinite alternate-reverse; -webkit-mask-image: radial-gradient(ellipse 100% 100% at 100% 50%, rgba(0,0,0,1) 20%, rgba(0,0,0,0) 80%); mask-image: radial-gradient(ellipse 100% 100% at 100% 50%, rgba(0,0,0,1) 20%, rgba(0,0,0,0) 80%); pointer-events: none; }

        @keyframes nebula-drift-l { 0% { transform: scale(1) translate(0, 0); opacity: 0.5; } 50% { transform: scale(1.05) translate(2%, 2%); opacity: 0.85; } 100% { transform: scale(1.02) translate(-1%, -1%); opacity: 0.6; } }
        @keyframes nebula-drift-r { 0% { transform: scale(1) translate(0, 0); opacity: 0.6; } 50% { transform: scale(1.05) translate(-2%, 2%); opacity: 0.9; } 100% { transform: scale(1.02) translate(1%, -1%); opacity: 0.55; } }
        
        .dust-layer-global { position: fixed; inset: 0; z-index: 2; background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise2'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.012' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise2)' opacity='0.08'/%3E%3C/svg%3E"); mix-blend-mode: screen; pointer-events: none; }

        .corner-panel { position: absolute; width: var(--panel-w); height: var(--panel-h); z-index: 20; transition: transform 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275); }
        .corner-panel:hover { transform: translate(var(--tx-hover), var(--ty-hover)) scale(1.03); }

        .frost-zone { position: absolute; inset: 6px 12px; background: rgba(15, 20, 35, 0.5); backdrop-filter: blur(12px); -webkit-backdrop-filter: blur(12px); border-radius: 6px; z-index: -2; box-shadow: inset 0 0 20px var(--theme-dim, rgba(0, 163, 255, 0.15)) !important; transition: 0.3s ease; }
        .corner-panel:hover .frost-zone { background: rgba(20, 25, 45, 0.65); box-shadow: 0 0 20px var(--theme-dim, rgba(0, 240, 255, 0.4)), inset 0 0 25px rgba(255, 255, 255, 0.1) !important; }

        .panel-bg { position: absolute; inset: 0; background: url('assets/panel-frame.png') center/100% 100% no-repeat; z-index: -1; filter: drop-shadow(0 5px 10px rgba(0,0,0,0.6)); pointer-events: none; }

        .tl { bottom: calc(50% + var(--corner-gap-y)); right: calc(50% + var(--corner-gap-x)); --tx-hover: -2px; --ty-hover: -2px;}
        .tr { bottom: calc(50% + var(--corner-gap-y)); left: calc(50% + var(--corner-gap-x)); --tx-hover: 2px; --ty-hover: -2px;}
        .tr .panel-bg { transform: scaleX(-1); }
        .bl { top: calc(50% + var(--corner-gap-y)); right: calc(50% + var(--corner-gap-x)); --tx-hover: -2px; --ty-hover: 2px;}
        .bl .panel-bg { transform: scaleY(-1); }
        .br { top: calc(50% + var(--corner-gap-y)); left: calc(50% + var(--corner-gap-x)); --tx-hover: 2px; --ty-hover: 2px;}
        .br .panel-bg { transform: scale(-1, -1); }

        .panel-data-container {
            height: 100%; width: 100%; display: flex; flex-direction: column; align-items: stretch; justify-content: center; text-align: left;
            position: relative; z-index: 2; box-sizing: border-box; pointer-events: none;
        }

        .tl .panel-data-container { padding: 12px 30px 12px 75px; }
        .tr .panel-data-container { padding: 12px 75px 12px 30px; }
        .bl .panel-data-container { padding: 12px 30px 12px 75px; }
        .br .panel-data-container { padding: 12px 75px 12px 30px; }

        .opt-oval { position: absolute; font-family: 'JetBrains Mono'; font-size: 0.55rem; font-weight: 700; letter-spacing: 1px; display: flex; justify-content: center; align-items: center; cursor: pointer; z-index: 30; transition: 0.3s; pointer-events: auto !important; color: var(--theme-main, #00f0ff); text-shadow: 0 0 5px var(--theme-dim, rgba(0,240,255,0.2)); }
        .opt-oval:hover { color: #fff !important; text-shadow: 0 0 8px #fff !important; }
        .tl .opt-oval { top: 36px; left: 45px; }
        .tr .opt-oval { top: 36px; right: 45px; }
        .bl .opt-oval { bottom: 36px; left: 45px; }
        .br .opt-oval { bottom: 36px; right: 45px; }

        .wing-panel { position: absolute; width: 240px; height: 250px; z-index: 15; box-sizing: border-box; top: 50%; transform: translateY(-50%); text-align: center; pointer-events: none; }
        .wing-frost { position: absolute; inset: 12px; background: rgba(10, 15, 25, 0.55); backdrop-filter: blur(14px); -webkit-backdrop-filter: blur(14px); border-radius: 8px; z-index: -2; box-shadow: inset 0 0 30px var(--theme-dim, rgba(0, 163, 255, 0.2)); }
        .wing-bg { position: absolute; inset: 0; background: url('assets/wing-panel.png') center/100% 100% no-repeat; z-index: -1; filter: drop-shadow(0 15px 25px rgba(0,0,0,0.6)); }

        .wing-l { right: calc(50% + var(--center-gap-x)); }
        .wing-r { left: calc(50% + var(--center-gap-x)); }
        .wing-r .wing-bg { transform: scaleX(-1); }
        
        .wing-r .wing-header, .wing-r .wing-data-center, .wing-r .wing-footer { padding-left: 15px; }

        .wing-header { position: absolute; top: 25px; left: 0; width: 100%; z-index: 10; display: flex; justify-content: center; pointer-events: none;}
        .wing-data-center { display: flex; flex-direction: column; justify-content: center; align-items: center; text-align: center; height: 100%; width: 100%; padding: 40px 0; box-sizing: border-box; position: relative; z-index: 10; pointer-events: none;}
        .wing-footer { position: absolute; bottom: 20px; left: 0; width: 100%; z-index: 10; display: flex; justify-content: center; pointer-events: none;}

        .w-head { font-family: 'Orbitron'; font-weight: 600; font-size: 0.75rem; letter-spacing: 3px; padding-left: 3px; color: rgba(255,255,255,0.6); border-bottom: 1px solid var(--theme-dim, rgba(0,240,255,0.2)); padding-bottom: 4px; display: inline-block; z-index: 20; text-align: center; }
        .w-lbl { font-family: 'JetBrains Mono'; font-size: 0.55rem; color: var(--starlight); letter-spacing: 1px; padding-left: 1px; text-transform: uppercase; margin-bottom: 2px; z-index: 20; text-align: center; }
        .val-lg { font-family: 'Orbitron'; font-size: 1.2rem; font-weight: 700; letter-spacing: 1px; padding-left: 1px; white-space: nowrap; color: #fff; text-shadow: 0 4px 10px rgba(0,0,0,0.5); z-index: 20; text-align: center; }
        .val-sm { font-family: 'Orbitron'; font-size: 0.85rem; font-weight: 700; z-index: 20; text-align: center; }
        .fmt-toggle { font-family: 'JetBrains Mono'; font-weight: bold; font-size: 0.5rem; color: var(--theme-main, #00f0ff); cursor: pointer; border: 1px solid var(--theme-dim, rgba(0,240,255,0.2)); padding: 2px 8px; border-radius: 4px; background: rgba(0,0,0,0.6); pointer-events: auto; transition: 0.3s; white-space: nowrap; text-align: center; }
        .fmt-toggle:hover { background: var(--theme-main, #00f0ff); color: #000; box-shadow: 0 0 10px var(--theme-main, #00f0ff); }

        .desktop-only { display: flex !important; }
        .mobile-only-flex { display: none !important; }

        /* --- GLOBAL DESKTOP NAVBAR --- */
        .q-nav-bar { 
            position: fixed; 
            bottom: 2.5vh; left: 50%; transform: translateX(-50%); width: max-content; padding: 0 20px; border: 1px solid rgba(255,255,255,0.1); border-radius: 12px; box-shadow: 0 10px 30px rgba(0,0,0,0.9), inset 0 0 20px rgba(255,255,255,0.05);
            height: 45px; background: rgba(2, 6, 15, 0.95); 
            display: flex; justify-content: center; align-items: center; box-sizing: border-box; z-index: 100000; font-family: 'Orbitron'; pointer-events: auto !important; 
        }
        
        body.q-aperture-home .q-nav-bar { display: none !important; }
        
        .q-nav-menu { display: flex; align-items: center; gap: 0.8vw; pointer-events: auto !important; width: 100%; justify-content: center; }
        .q-nav-btn { background: transparent; border: 1px solid rgba(255,255,255,0.2); color: rgba(255,255,255,0.6); padding: 6px 12px; border-radius: 4px; font-family: 'Orbitron'; font-size: 0.6rem; font-weight: bold; cursor: pointer; transition: 0.3s; letter-spacing: 1px; padding-left: 13px; text-decoration: none; display: inline-block; text-align: center; pointer-events: auto !important; white-space: nowrap; }
        .q-nav-btn:hover { border-color: #fff; color: #fff; box-shadow: 0 0 10px rgba(255, 255, 255, 0.3); }
        
        .q-nav-btn.sim-badge { border-color: ${authBorder} !important; color: ${authColor} !important; background: ${authBg} !important; padding-left: 12px; }
        
        .q-nav-btn.face-btn.active { border-color: var(--chrono-amber) !important; color: var(--chrono-amber) !important; box-shadow: inset 0 0 10px var(--chrono-amber-dim) !important; }
        .q-nav-btn.bio-btn.active { border-color: var(--bio-purple, #b829ff) !important; color: var(--bio-purple, #b829ff) !important; box-shadow: inset 0 0 10px rgba(184, 41, 255, 0.15) !important; }
        .q-nav-btn.com-btn.active { border-color: var(--gold, #F4D068) !important; color: var(--gold, #F4D068) !important; box-shadow: inset 0 0 10px rgba(244,208,104,0.2) !important; }
        .q-nav-btn.env-btn.active { border-color: var(--env-green, #a7ff83) !important; color: var(--env-green, #a7ff83) !important; box-shadow: inset 0 0 10px rgba(167,255,131,0.2) !important; }
        .q-nav-btn.mec-btn.active { border-color: var(--sys-cyan, #00f0ff) !important; color: var(--sys-cyan, #00f0ff) !important; box-shadow: inset 0 0 10px rgba(0,240,255,0.2) !important; }

        #q-mic-fab-desktop { position: fixed; bottom: 20px; right: 20px; width: 50px; height: 50px; border-radius: 50%; background: rgba(5, 8, 15, 0.9); border: 1px solid var(--theme-main, #00f0ff); color: var(--theme-main, #00f0ff); display: flex; justify-content: center; align-items: center; z-index: 100000; box-shadow: 0 0 15px rgba(0,0,0,0.8); cursor: pointer; font-size: 1.2rem; transition: all 0.3s ease; pointer-events: auto !important; }
        #q-mic-fab-desktop:hover, #q-mic-fab-desktop.listening { background: var(--theme-main, #00f0ff); color: #000; box-shadow: 0 0 20px var(--theme-main, #00f0ff); }
        #q-mic-fab-desktop.listening { animation: pulse-mic-desktop 1.5s infinite; }
        @keyframes pulse-mic-desktop { 0% { transform: scale(1); box-shadow: 0 0 10px var(--theme-main, #00f0ff); } 50% { transform: scale(1.1); box-shadow: 0 0 25px var(--theme-main, #00f0ff); } 100% { transform: scale(1); box-shadow: 0 0 10px var(--theme-main, #00f0ff); } }
        
        .q-global-controls { position: fixed; left: 50%; transform: translateX(-50%); z-index: 9995; align-items: center; gap: 12px; background: rgba(10, 12, 18, 0.95); backdrop-filter: blur(20px); border-radius: 50px; padding: 10px 25px; justify-content: space-between; box-shadow: 0 10px 40px rgba(0,0,0,0.9), 0 0 20px rgba(255,255,255,0.05); border: 1px solid rgba(255, 255, 255, 0.1); pointer-events: auto; display: flex; bottom: calc(2.5vh + 60px); }
        body.q-aperture-home .q-global-controls { display: none !important; }
        
        .q-ctrl-btn { background: transparent; border: 1px solid var(--theme-main, #00f0ff); color: var(--theme-main, #00f0ff); padding: 8px 14px; cursor: pointer; font-family: 'Orbitron'; font-size: 0.65rem; font-weight: 700; border-radius: 6px; transition: 0.3s; letter-spacing: 1px; padding-left: 15px; white-space: nowrap; pointer-events: auto; }
        .q-ctrl-btn:hover { background: rgba(255,255,255,0.1); color: #fff; }
        .q-ctrl-btn.active { background: var(--theme-main, #00f0ff); color: #000; }
        .q-scrubber { flex-grow: 1; min-width: 250px; accent-color: var(--theme-main, #00f0ff); cursor: pointer; height: 4px; -webkit-appearance: none; margin: 0 10px; border-radius: 2px; background: rgba(255,255,255,0.1); pointer-events: auto; }
        .q-scrubber::-webkit-slider-thumb { -webkit-appearance: none; height: 22px; width: 22px; background: var(--theme-main, #00f0ff); clip-path: polygon(50% 0%, 60% 40%, 100% 50%, 60% 60%, 50% 100%, 40% 60%, 0% 50%, 40% 40%); cursor: grab; pointer-events: auto; }
        .q-scrubber::-webkit-slider-thumb:active { cursor: grabbing; }

        @media (max-width: 950px) {
            /* ANDROID/SAMSUNG SCALING LOCKDOWN */
            :root { 
                --dial-size: min(85vw, 340px) !important;
            } 
            .desktop-only { display: none !important; }
            .mobile-only-flex { display: flex !important; }
            
            body:not(.telemetry-open) .telemetry-node { display: none !important; visibility: hidden !important; }
            body:not(.telemetry-open) .vector-anchor { display: none !important; visibility: hidden !important; }
            body:not(.telemetry-open) .wing-panel { display: none !important; }
            
            /* --- SURGICAL ISOLATION: VECTOR HUD VS APERTURE --- */
            /* Vector HUD: Dials pushed down to clear navbar, locked to z-index 10 */
            body.q-vector-hud .q-center-dial { 
                margin-top: 10vh !important; 
                z-index: 10 !important; 
            }
            /* Aperture Home: Original Iris alignment maintained */
            body.q-aperture-home .q-center-dial {
                margin-top: -4vh !important; 
            }

            /* --- MOBILE APERTURE PANEL FRAMES --- */
            body.q-aperture-home .corner-panel { 
                display: flex !important; 
                left: 50% !important; 
                transform: translateX(-50%) !important; 
                right: auto !important; 
            }
            body.q-aperture-home .corner-panel.tl { top: 5vh !important; bottom: auto !important; }
            body.q-aperture-home .corner-panel.tr { top: 16vh !important; bottom: auto !important; }
            body.q-aperture-home .corner-panel.bl { bottom: 5vh !important; top: auto !important; }
            body.q-aperture-home .corner-panel.br { bottom: 16vh !important; top: auto !important; }
            
            /* --- APERTURE MOBILE SUPPRESSION MATRIX --- */
            body.q-aperture-home .q-control-strip,
            body.q-aperture-home #mobile-telemetry-ribbon,
            body.q-aperture-home #q-universal-controls,
            body.q-aperture-home .q-nav-bar {
                display: none !important;
                visibility: hidden !important;
                opacity: 0 !important;
                pointer-events: none !important;
            }
            
            /* --- PURE 2D VECTOR HUD MOBILE ACTIVATION MATRIX --- */
            body.q-vector-hud .q-nav-bar { 
                display: flex !important;
                position: fixed !important;
                top: 0px !important; 
                left: 0px !important; 
                padding: 0 10px !important; 
                height: 50px !important; 
                width: 100% !important; 
                background: rgba(2, 6, 15, 0.95) !important; 
                border-bottom: 1px solid rgba(255,255,255,0.1) !important; 
                box-shadow: 0 5px 15px rgba(0,0,0,0.9) !important; 
                z-index: 2147483647 !important;
                visibility: visible !important;
                opacity: 1 !important;
                transform: none !important; 
                pointer-events: none !important;
                box-sizing: border-box !important;
            }
            body.q-vector-hud .q-nav-bar * { pointer-events: auto !important; }
            
            body.q-vector-hud .hamburger-btn {
                display: block !important;
                pointer-events: auto !important; 
                position: absolute !important;
                right: 15px !important;
                top: 10px !important;
            }

            body.q-vector-hud .q-nav-menu { 
                display: flex !important; 
                position: static !important;
                flex-direction: row !important;
                justify-content: flex-start !important;
                align-items: center !important;
                width: calc(100% - 50px) !important; 
                background: transparent !important;
                overflow-x: auto !important;
                gap: 8px !important;
            } 
            body.q-vector-hud .q-nav-menu::-webkit-scrollbar { display: none; }

            body.q-vector-hud .q-nav-menu .bio-btn,
            body.q-vector-hud .q-nav-menu .com-btn,
            body.q-vector-hud .q-nav-menu .env-btn,
            body.q-vector-hud .q-nav-menu .mec-btn,
            body.q-vector-hud .q-nav-menu .omni,
            body.q-vector-hud .q-nav-menu .special {
                display: none !important;
            }

            body.q-vector-hud .q-nav-menu .face-btn,
            body.q-vector-hud .q-nav-menu .sim-badge {
                display: inline-block !important;
            }

            body.q-vector-hud #q-global-sim-badge { font-size: 0.45rem !important; padding: 2px 4px !important; letter-spacing: 0px !important; white-space: nowrap; flex-shrink: 0; pointer-events: auto !important; }
            body.q-vector-hud .q-nav-btn { padding: 4px 8px; font-size: 0.55rem; border-radius: 4px; border: 1px solid rgba(255,255,255,0.2) !important; }
            
            /* --- CONTROL STRIP GATEWAY --- */
            body.q-vector-hud .q-control-strip {
                display: flex !important;
                position: fixed !important;
                bottom: 0px !important; 
                left: 0px !important;
                transform: none !important; 
                width: 100% !important; 
                height: calc(65px + env(safe-area-inset-bottom, 0px)) !important;
                padding-bottom: env(safe-area-inset-bottom, 0px) !important;
                z-index: 2147483647 !important;
                background: rgba(2, 6, 15, 0.98) !important;
                border-top: 1px solid var(--theme-dim, rgba(0, 240, 255, 0.2)) !important;
                justify-content: space-around !important;
                align-items: center !important;
                box-shadow: 0 -10px 30px rgba(0,0,0,0.9) !important;
                visibility: visible !important;
                opacity: 1 !important;
                pointer-events: auto !important;
                box-sizing: border-box !important;
            }

            body.q-vector-hud #q-universal-controls {
                display: flex !important;
                position: fixed !important;
                bottom: calc(65px + env(safe-area-inset-bottom, 0px)) !important; 
                left: 0px !important;
                transform: none !important; 
                z-index: 2147483646 !important;
                visibility: visible !important;
                opacity: 1 !important;
                pointer-events: auto !important;
                align-items: center !important; 
                justify-content: space-between !important;
                width: 100% !important; 
                box-sizing: border-box !important; 
                padding: 6px 12px !important; 
                gap: 4px !important;
            }

            body.q-vector-hud #mobile-telemetry-ribbon {
                display: flex !important;
                position: fixed !important;
                top: 50px !important;
                left: 0px !important;
                height: 45px !important;
                width: 100% !important;
                background: rgba(2, 6, 15, 0.98) !important;
                border-bottom: 1px solid var(--theme-dim, rgba(0, 240, 255, 0.2)) !important;
                z-index: 2147483645 !important;
                transform: none !important; 
                justify-content: space-between !important;
                align-items: center !important;
                box-shadow: 0 5px 15px rgba(0,0,0,0.9) !important;
                padding: 0 10px !important;
                box-sizing: border-box !important;
                white-space: nowrap !important;
                visibility: visible !important;
                opacity: 1 !important;
                pointer-events: auto !important;
            }
            
            .strip-btn { background: transparent; border: none; color: var(--platinum); display: flex; flex-direction: column; align-items: center; gap: 4px; cursor: pointer; text-decoration: none; padding: 5px; pointer-events: auto !important; }
            .strip-btn svg { transition: 0.3s; }
            .strip-btn.face-strip.active svg { color: var(--chrono-amber) !important; filter: drop-shadow(0 0 8px var(--chrono-amber)) !important; }
            .strip-btn.face-strip.active .strip-lbl { color: var(--chrono-amber) !important; }
            .strip-btn.bio-strip.active svg { color: var(--bio-purple, #b829ff) !important; filter: drop-shadow(0 0 8px var(--bio-purple, #b829ff)) !important; }
            .strip-btn.bio-strip.active .strip-lbl { color: var(--bio-purple, #b829ff) !important; }
            .strip-btn.com-strip.active svg { color: var(--gold, #F4D068) !important; filter: drop-shadow(0 0 8px var(--gold, #F4D068)) !important; }
            .strip-btn.com-strip.active .strip-lbl { color: var(--gold, #F4D068) !important; }
            .strip-btn.env-strip.active svg { color: var(--env-green, #a7ff83) !important; filter: drop-shadow(0 0 8px var(--env-green, #a7ff83)) !important; }
            .strip-btn.env-strip.active .strip-lbl { color: var(--env-green, #a7ff83) !important; }
            .strip-btn.mec-strip.active svg { color: var(--sys-cyan, #00f0ff) !important; filter: drop-shadow(0 0 8px var(--sys-cyan, #00f0ff)) !important; }
            .strip-btn.mec-strip.active .strip-lbl { color: var(--sys-cyan, #00f0ff) !important; }
            .strip-lbl { font-family: 'Orbitron'; font-size: 0.4rem; font-weight: 900; letter-spacing: 1px; padding-left: 1px; color: rgba(255,255,255,0.5); transition: 0.3s; }

            /* Telemetry Viewport (Data Panels) */
            #mobile-telemetry-viewport { 
                display: none; 
                position: fixed !important; 
                top: 45vh !important; 
                bottom: calc(65px + env(safe-area-inset-bottom, 0px)) !important; 
                height: auto !important; 
                left: 0; 
                width: 100vw; 
                background: linear-gradient(to bottom, transparent 0%, rgba(5,5,8,0.85) 15%, rgba(5,5,8,0.98) 100%); 
                backdrop-filter: blur(8px); 
                -webkit-backdrop-filter: blur(8px); 
                z-index: 50 !important; 
                overflow-y: scroll !important; 
                overflow-x: hidden !important; 
                -webkit-overflow-scrolling: touch; 
                overscroll-behavior: contain; 
                flex-direction: column; 
                align-items: center; 
                justify-content: flex-start; 
                padding-top: 15px !important; 
                margin-top: 0 !important; 
                padding-bottom: 20px !important; 
                box-sizing: border-box !important; 
                gap: 15px; 
                pointer-events: auto !important; 
            }
            #mobile-telemetry-viewport .telemetry-node { display: flex !important; position: relative !important; top: auto !important; left: auto !important; right: auto !important; bottom: auto !important; transform: translateZ(0) !important; margin: 0 !important; width: 95vw !important; max-width: 360px !important; min-height: min-content !important; height: auto !important; box-sizing: border-box !important; backface-visibility: hidden !important; visibility: visible !important; flex-shrink: 0 !important; pointer-events: auto !important; opacity: 1 !important; }
            #mobile-telemetry-viewport .wing-panel { display: none !important; }
            #mobile-telemetry-viewport .corner-panel { height: auto !important; min-height: 120px !important; padding: 20px !important; }
            #mobile-telemetry-viewport .panel-bg { display: none !important; } 
            #mobile-telemetry-viewport .frost-zone { inset: 0 !important; border-radius: 8px !important; border: 1px solid rgba(255,255,255,0.1); }
            #mobile-telemetry-viewport .panel-data-container { padding: 0 !important; margin-top: 10px !important; align-items: center !important; text-align: center !important; }
            #mobile-telemetry-viewport .panel-label { padding: 0 !important; position: relative !important; }
            #mobile-telemetry-viewport .opt-oval { position: absolute !important; top: 15px !important; right: 15px !important; left: auto !important; bottom: auto !important; }

            #q-mic-fab { 
                position: static !important; transform: none !important;
                width: 32px !important; height: 32px !important; border-radius: 6px !important; font-size: 1rem !important; box-shadow: none !important; order: 1 !important; flex-shrink: 0 !important;
                background: rgba(5, 8, 15, 0.9); border: 1px solid var(--theme-main, #00f0ff); color: var(--theme-main, #00f0ff);
                display: flex; justify-content: center; align-items: center; cursor: pointer; transition: all 0.3s ease; pointer-events: auto !important;
            }
            #q-mic-fab.listening { animation: pulse-mic 1.5s infinite; background: var(--theme-main, #00f0ff); color: #000; box-shadow: 0 0 25px var(--theme-main, #00f0ff) !important; }
            .q-global-controls > .q-ctrl-btn:nth-child(1) { order: 2 !important; padding: 0 8px !important; height: 32px !important; min-width: 24px !important; flex-shrink: 0; }
            .q-scrubber { order: 3 !important; min-width: 0 !important; width: 100% !important; margin: 0 !important; flex-grow: 1 !important; }
            .q-global-controls > .q-ctrl-btn:nth-child(3) { order: 4 !important; padding: 0 8px !important; height: 32px !important; min-width: 24px !important; flex-shrink: 0; }
            #q-live-toggle { order: 5 !important; width: auto !important; min-width: 32px !important; height: 32px !important; padding: 0 6px !important; font-size: 0.55rem !important; flex-shrink: 0 !important; margin: 0 !important; }
        }
    `;
    document.head.appendChild(style);

    const uiContainer = document.createElement('div');
    uiContainer.id = 'q-ui-injected-flag';

    uiContainer.innerHTML = `
        <div class="space-bg"></div>
        <div class="star-container" id="stars"></div>
        <div class="nebula-left"></div>
        <div class="nebula-right"></div>
        <div class="dust-layer-global"></div>

        <div class="q-nav-bar">
            <div style="display:flex; width: 100%; justify-content: center; align-items: center;">
                <div class="q-nav-menu" id="q-nav-menu">
                    <button id="q-global-sim-badge" class="q-nav-btn sim-badge" style="display: inline-block; border-color:${authBorder} !important; color:${authColor} !important; background:${authBg} !important;" onclick="window.triggerDomainShift(event)">${authText}</button>
                    <a href="index.html" class="q-nav-btn face-btn vector-link ${isHome ? 'active' : ''}" onclick="window.location.href=this.href; return false;">THE APERTURE</a>
                    <a href="PHYSIOLOGICAL.html" class="q-nav-btn bio-btn vector-link ${bActive ? 'active' : ''}" onclick="window.location.href=this.href; return false;">PHYSIOLOGICAL</a>
                    <a href="METAPHYSICAL.html" class="q-nav-btn com-btn vector-link ${cActive ? 'active' : ''}" onclick="window.location.href=this.href; return false;">METAPHYSICAL</a>
                    <a href="METEOROLOGICAL.html" class="q-nav-btn env-btn vector-link ${eActive ? 'active' : ''}" onclick="window.location.href=this.href; return false;">METEOROLOGICAL</a>
                    <a href="ASTROPHYSICAL.html" class="q-nav-btn mec-btn vector-link ${mActive ? 'active' : ''}" onclick="window.location.href=this.href; return false;">ASTROPHYSICAL</a>
                    <button class="q-nav-btn omni desktop-only" style="border-color: var(--chrono-amber); color: var(--chrono-amber); display: inline-block;" onclick="if(typeof window.Q_OmniPlanner !== 'undefined') window.Q_OmniPlanner.openPlanner()">[ OMNI-PLANNER ]</button>
                    <button class="q-nav-btn special desktop-only" style="border-color: var(--chrono-amber); color: var(--chrono-amber); display: inline-block;" onclick="if(typeof window.Q_IntegrationHub !== 'undefined') window.Q_IntegrationHub.openHub()">[ DASHBOARD ]</button>
                </div>
            </div>
            <button class="mobile-only-flex hamburger-btn" style="background:transparent; border:none; color:var(--theme-main, #00f0ff); font-size:1.5rem; padding:0; margin:0; cursor:pointer;" onclick="if(typeof window.Q_IntegrationHub !== 'undefined') window.Q_IntegrationHub.openHub()">☰</button>
        </div>

        <div id="mobile-telemetry-ribbon" class="mobile-only-flex">
            <span id="ribbon-leg-date" style="font-family:'Orbitron'; font-size:0.65rem; color:var(--starlight); font-weight:bold; letter-spacing:1px; white-space:nowrap;">--</span>
            <div style="display:flex; align-items:center; gap: 4px;">
                <span class="val-gold" id="ribbon-leg" style="color:var(--chrono-amber); font-family:'JetBrains Mono'; font-size:0.65rem; font-weight:bold; margin-top:2px; white-space:nowrap;">--</span>
                <div class="fmt-toggle" onclick="window.toggleTimeFmt('ribbon-fmt')" id="ribbon-fmt" style="border-color:var(--chrono-amber); color:var(--chrono-amber); padding:2px 6px; font-size:0.5rem; pointer-events:auto; position:relative; z-index:100000; white-space:nowrap;">UTC</div>
            </div>
        </div>
        
        <div class="q-control-strip mobile-only-flex">
            <button class="strip-btn" onclick="if(typeof window.toggleTelemetry === 'function') window.toggleTelemetry()">
                <svg id="tele-icon" viewBox="0 0 24 24" width="22" height="22" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" fill="none"><path d="M18 20V10M12 20V4M6 20v-6"/></svg>
                <span class="strip-lbl">DATA</span>
            </button>
            <a href="PHYSIOLOGICAL.html" class="strip-btn bio-strip ${bActive ? 'active' : ''}" onclick="window.location.href=this.href; return false;">
                <svg viewBox="0 0 24 24" width="22" height="22" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" fill="none"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/></svg>
                <span class="strip-lbl">PHY</span>
            </a>
            <a href="METAPHYSICAL.html" class="strip-btn com-strip ${cActive ? 'active' : ''}" onclick="window.location.href=this.href; return false;">
                <svg viewBox="0 0 24 24" width="22" height="22" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" fill="none"><circle cx="12" cy="5" r="3"/><line x1="12" y1="8" x2="12" y2="16"/><circle cx="6" cy="20" r="3"/><circle cx="18" cy="20" r="3"/><line x1="12" y1="16" x2="6" y2="17"/><line x1="12" y1="16" x2="18" y2="17"/></svg>
                <span class="strip-lbl">MET</span>
            </a>
            <a href="index.html" class="strip-btn face-strip ${isHome ? 'active' : ''}" onclick="window.location.href=this.href; return false;">
                <svg viewBox="0 0 24 24" width="22" height="22" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" fill="none"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/></svg>
                <span class="strip-lbl">APT</span>
            </a>
            <a href="METEOROLOGICAL.html" class="strip-btn env-strip ${eActive ? 'active' : ''}" onclick="window.location.href=this.href; return false;">
                <svg viewBox="0 0 24 24" width="22" height="22" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" fill="none"><path d="M2 22h20L12 2z"/></svg>
                <span class="strip-lbl">MTR</span>
            </a>
            <a href="ASTROPHYSICAL.html" class="strip-btn mec-strip ${mActive ? 'active' : ''}" onclick="window.location.href=this.href; return false;">
                <svg viewBox="0 0 24 24" width="22" height="22" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" fill="none"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0-1.51 1z"/></svg>
                <span class="strip-lbl">AST</span>
            </a>
            <button class="strip-btn" onclick="if(typeof window.Q_OmniPlanner !== 'undefined') window.Q_OmniPlanner.openPlanner()">
                <svg viewBox="0 0 24 24" width="22" height="22" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" fill="none"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><line x1="3" y1="9" x2="21" y2="9"/><line x1="9" y1="21" x2="9" y2="9"/></svg>
                <span class="strip-lbl">PLAN</span>
            </button>
        </div>

        <div class="q-global-controls" id="q-universal-controls">
            <button class="q-ctrl-btn" onclick="window.stepScrubber(-1)">&lt;</button>
            <input type="range" min="0" max="365" step="1" value="0" class="q-scrubber" id="q-global-scrubber" oninput="window.scrubTime(this.value)">
            <button class="q-ctrl-btn" onclick="window.stepScrubber(1)">&gt;</button>
            <button class="q-ctrl-btn" id="q-live-toggle" onclick="window.setLiveClock()">LIVE</button>
        </div>

        <button id="q-mic-fab" class="mobile-only-flex" onclick="if(window.Q_KairosVoice) window.Q_KairosVoice.toggle()">🎙</button>
        <button id="q-mic-fab-desktop" class="desktop-only" onclick="if(window.Q_KairosVoice) window.Q_KairosVoice.toggle()">🎙</button>
        
        <div class="corner-panel tl telemetry-node">
            <div class="frost-zone"></div>
            <div class="panel-bg"></div>
            <div class="opt-oval" id="opt-tl">OPT</div>
            <div class="panel-data-container" id="quad-tl"></div>
        </div>
        <div class="corner-panel tr telemetry-node">
            <div class="frost-zone"></div>
            <div class="panel-bg"></div>
            <div class="opt-oval" id="opt-tr">OPT</div>
            <div class="panel-data-container" id="quad-tr"></div>
        </div>
        <div class="corner-panel bl telemetry-node">
            <div class="frost-zone"></div>
            <div class="panel-bg"></div>
            <div class="opt-oval" id="opt-bl">OPT</div>
            <div class="panel-data-container" id="quad-bl"></div>
        </div>
        <div class="corner-panel br telemetry-node">
            <div class="frost-zone"></div>
            <div class="panel-bg"></div>
            <div class="opt-oval" id="opt-br">OPT</div>
            <div class="panel-data-container" id="quad-br"></div>
        </div>

        <div class="wing-panel wing-l telemetry-node" id="q-wing-left">
            <div class="wing-frost"></div>
            <div class="wing-bg"></div>
            <div class="wing-header">
                <span class="w-head" style="position:static; transform:none;">LEGACY OS</span>
            </div>
            <div class="wing-data-center">
                <div style="margin-bottom: 15px;">
                    <div class="w-lbl">DATE</div>
                    <div class="val-lg" id="leg-date" style="color: var(--theme-main, #00f0ff); text-shadow: 0 0 10px var(--theme-dim, rgba(0,240,255,0.2));">--</div>
                </div>
                <div>
                    <div style="display:flex; align-items:center; justify-content:center; gap: 5px;">
                        <div class="w-lbl" style="margin:0;">TIME</div>
                        <div class="fmt-toggle" onclick="window.toggleTimeFmt('fmt-btn')" id="fmt-btn">UTC</div>
                    </div>
                    <div class="val-lg" id="leg-time" style="color: var(--theme-main, #00f0ff); text-shadow: 0 0 10px var(--theme-dim, rgba(0,240,255,0.2));">--</div>
                </div>
            </div>
            <div class="wing-footer">
                <div style="font-size:0.5rem; color:var(--starlight); border-top: 1px dashed var(--theme-dim, rgba(0,240,255,0.2)); padding-top: 8px; width: 85%; margin: 0 auto;">STATUS: CONTINUITY ACTIVE</div>
            </div>
        </div>

        <div class="wing-panel wing-r telemetry-node" id="q-wing-right">
            <div class="wing-frost"></div>
            <div class="wing-bg"></div>
            <div class="wing-header">
                <span class="w-head" style="position:static; transform:none;">QUAD OS</span>
            </div>
            <div class="wing-data-center">
                <div style="margin-bottom: 15px;">
                    <div class="w-lbl">Q COORDINATE</div>
                    <div class="val-lg" id="q-coord-wing" style="margin-top: 4px; color: var(--theme-main, #00f0ff); text-shadow: 0 0 10px var(--theme-dim, rgba(0,240,255,0.2));">--</div>
                </div>
                <div style="display:flex; width: 100%; justify-content: space-around;">
                    <div style="display:flex; flex-direction:column; align-items:center;">
                        <div class="w-lbl">MEAN CIRCLE (CIVIL)</div>
                        <div class="val-sm" id="mean-deg" style="color:var(--theme-main, #00f0ff) !important; text-shadow:0 0 10px var(--theme-dim, rgba(0,240,255,0.2)); margin-top: 4px;">--</div>
                    </div>
                    <div style="display:flex; flex-direction:column; align-items:center;">
                        <div class="w-lbl">TRUE ELLIPSE (PHYSICS)</div>
                        <div class="val-sm" id="true-deg" style="color:var(--theme-main, #00f0ff) !important; text-shadow:0 0 10px var(--theme-dim, rgba(0,240,255,0.2)); margin-top: 4px;">--</div>
                    </div>
                </div>
            </div>
            <div class="wing-footer">
                <div style="font-size:0.5rem; color:var(--starlight); border-top: 1px dashed var(--theme-dim, rgba(0,240,255,0.2)); padding-top: 8px; width: 85%; margin: 0 auto;">DUAL-STATE ENGINE</div>
            </div>
        </div>
    `;

    document.body.appendChild(uiContainer);
    
    window.bindMasterTickScrubber();
    window.syncScrubberUI();

    window.addEventListener('q-tick', (e) => {
        const ribbonLeg = document.getElementById('ribbon-leg');
        const ribbonLegDate = document.getElementById('ribbon-leg-date');
        const ribbonFmt = document.getElementById('ribbon-fmt');
        
        if (ribbonLeg && ribbonLegDate) {
            function formatDualColorMobile(str) {
                const letterStyle = "color:var(--starlight); font-family:'Orbitron'; font-size:0.6rem; margin-right:2px;";
                const numStyle = "color:var(--chrono-amber); font-size:0.75rem; font-weight:bold;";
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

            let cleanTimeStr = e.detail.legacyTimeStr.replace(/Z|LCL/gi, '').trim();
            ribbonLeg.innerHTML = formatDualColorMobile(cleanTimeStr);
            
            if (ribbonFmt) ribbonFmt.innerText = localStorage.getItem('Q_TIME_FMT') || 'UTC_24';

            if (document.body.classList.contains('planner-quad-active')) {
                const qData = e.detail.qData;
                const t = e.detail.t;
                let activeBlock = window.getQBlockByTime ? window.getQBlockByTime(t) : null;
                let cCycle = activeBlock ? activeBlock.cycle : 0;
                let qcStr = (activeBlock && activeBlock.type === 'ANCHOR') ? 
                    `<span style="color:var(--chrono-amber);">QC</span> <span style="color:#fff;">${cCycle}</span> <span style="color:var(--chrono-amber);">${activeBlock.name}</span>` : 
                    `<span style="color:var(--chrono-amber);">QC</span> <span style="color:#fff;">${cCycle}</span> <span style="color:var(--chrono-amber);">Q</span><span style="color:#fff;">${qData.quad}</span> <span style="color:var(--chrono-amber);">S</span><span style="color:#fff;">${qData.sect}</span> <span style="color:var(--chrono-amber);">DAY</span> <span style="color:#fff;">${qData.day}</span>`;
                
                ribbonLegDate.innerHTML = qcStr;
            } else {
                ribbonLegDate.innerHTML = `<span style="color:var(--chrono-amber); font-size:0.75rem; font-weight:bold;">${e.detail.legacyDateStr.toUpperCase()}</span>`;
            }
        }

        function formatDualColorWing(str) {
            const letterStyle = "color:var(--starlight); font-family:'Orbitron'; font-size:0.8rem; margin-right:2px;";
            const numStyle = `color:var(--theme-main, #00f0ff); font-size:1.1rem; font-weight:bold;`;
            let out = "";
            let tokens = str.match(/([0-9]+)|([^0-9]+)/g);
            if (tokens) {
                tokens.forEach(tk => { out += `<span style="${/[0-9]/.test(tk) ? numStyle : letterStyle}">${tk}</span>`; });
            }
            return out;
        }

        const legDateEl = document.getElementById('leg-date');
        if (legDateEl) legDateEl.innerHTML = `<span style="color:var(--theme-main, #00f0ff); font-weight:bold; text-shadow:0 0 10px var(--theme-dim, rgba(0,240,255,0.2));">${e.detail.legacyDateStr.toUpperCase()}</span>`;

        const legTimeEl = document.getElementById('leg-time');
        if (legTimeEl) legTimeEl.innerHTML = formatDualColorWing(e.detail.legacyTimeStr);
        
        const meanDegEl = document.getElementById('mean-deg');
        if (meanDegEl) meanDegEl.innerText = e.detail.qData.meanArc.toFixed(4) + "°";
        
        const trueDegEl = document.getElementById('true-deg');
        if (trueDegEl) trueDegEl.innerText = e.detail.qData.trueArc.toFixed(4) + "°"; 

        let activeBlock = window.getQBlockByTime ? window.getQBlockByTime(e.detail.t) : null;
        const qCoordWing = document.getElementById('q-coord-wing');
        
        if (qCoordWing) {
            if (activeBlock && activeBlock.type === 'ANCHOR') {
                qCoordWing.innerHTML = `<span style="font-size:0.9rem; color:var(--theme-main, #00f0ff); font-family:'Orbitron'; font-weight:bold;">${activeBlock.name}</span>`;
            } else {
                qCoordWing.innerHTML = `<span style="color:var(--starlight); font-family:'Orbitron'; font-size:0.8rem;">QC</span><span style="color:var(--theme-main, #00f0ff); font-size:1.1rem; font-weight:bold;">${activeBlock ? activeBlock.cycle : 0}</span> ` +
                                       `<span style="color:var(--starlight); font-family:'Orbitron'; font-size:0.8rem; margin-left:6px;">Q</span><span style="color:var(--theme-main, #00f0ff); font-size:1.1rem; font-weight:bold;">${e.detail.qData.quad}</span> ` +
                                       `<span style="color:var(--starlight); font-family:'Orbitron'; font-size:0.8rem; margin-left:6px;">S</span><span style="color:var(--theme-main, #00f0ff); font-size:1.1rem; font-weight:bold;">${e.detail.qData.sect}</span> ` +
                                       `<span style="color:var(--starlight); font-family:'Orbitron'; font-size:0.8rem; margin-left:6px;">DAY</span><span style="color:var(--theme-main, #00f0ff); font-size:1.1rem; font-weight:bold;">${e.detail.qData.day}</span>`;
            }
        }
    });

    window.dispatchEvent(new Event('q-ui-mounted'));
};

window.addEventListener('click', (e) => {
    let el = e.target;
    if (el && el.id === 'q-modal-btn' && document.getElementById('btn-sys')) {
        const sysActive = document.getElementById('btn-sys').classList.contains('active');
        if (!sysActive) {
            window.SYS_DB = [];
        } else {
            window.SYS_DB = [ { name: "Tax Day (US)", coord: 113.4, type: 'node-sys', glyph: '$' } ];
        }
    }
});

window.addEventListener('click', (e) => {
    try {
        let el = e.target;
        if (el && el.nodeType === Node.TEXT_NODE) el = el.parentNode;
        if (!el || typeof el.closest !== 'function') return;

        if (el.closest('.q-hub-overlay') || el.closest('.modal-overlay') || el.closest('.q-planner-overlay') || el.closest('.opt-oval') || el.id === 'btn-return-home') {
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
            const dataRoute = (checkEl.getAttribute && checkEl.getAttribute('data-route') || '').toLowerCase();

            let isShortText = text.length > 0 && text.length < 40;

            if (dataTarget === 'dashboard' || dataRoute === 'dashboard' || hrefStr.includes('dashboard') || onClickStr.includes('dashboard') || (isShortText && text.includes('dashboard'))) {
                e.preventDefault(); e.stopPropagation();
                if (window.Q_IntegrationHub && typeof window.Q_IntegrationHub.openHub === 'function') window.Q_IntegrationHub.openHub();
                return; 
            }

            if (dataTarget === 'planner' || dataRoute === 'planner' || hrefStr.includes('planner') || onClickStr.includes('planner') || (isShortText && text.includes('omni-planner')) || (isShortText && text.includes('omni planner'))) {
                e.preventDefault(); e.stopPropagation();
                if (window.Q_OmniPlanner && typeof window.Q_OmniPlanner.openPlanner === 'function') window.Q_OmniPlanner.openPlanner();
                return; 
            }

            if (dataTarget.includes('physiological') || dataRoute.includes('physiological') || hrefStr.includes('physiological') || onClickStr.includes('physiological') || (isShortText && text.includes('physiological'))) {
                targetUrl = 'PHYSIOLOGICAL.html'; break;
            } else if (dataTarget.includes('metaphysical') || dataRoute.includes('metaphysical') || hrefStr.includes('metaphysical') || onClickStr.includes('metaphysical') || (isShortText && text.includes('metaphysical'))) {
                targetUrl = 'METAPHYSICAL.html'; break;
            } else if (dataTarget.includes('meteorological') || dataRoute.includes('meteorological') || hrefStr.includes('meteorological') || onClickStr.includes('meteorological') || (isShortText && text.includes('meteorological'))) {
                targetUrl = 'METEOROLOGICAL.html'; break;
            } else if (dataTarget.includes('astrophysical') || dataRoute.includes('astrophysical') || hrefStr.includes('astrophysical') || onClickStr.includes('astrophysical') || (isShortText && text.includes('astrophysical'))) {
                targetUrl = 'ASTROPHYSICAL.html'; break;
            } else if (dataTarget.includes('aperture') || dataRoute.includes('aperture') || hrefStr.includes('index') || onClickStr.includes('aperture') || (isShortText && text.includes('aperture'))) {
                targetUrl = 'index.html'; break;
            }

            checkEl = checkEl.parentElement;
            depth++;
        }

        if (targetUrl) {
            e.preventDefault(); e.stopPropagation(); 
            if (typeof window.executeHomeSequence === 'function') {
                window.executeHomeSequence(targetUrl);
            } else {
                window.location.href = targetUrl;
            }
        }
    } catch (err) {
        console.error("Q-OS Routing Intercept Failed:", err);
    }
}, true);

window.triggerDomainShift = function(e) {
    if(e && typeof e.preventDefault === 'function') e.preventDefault();
    let authState = localStorage.getItem('Q_PRO_AUTH') === 'true' ? 'ACTIVE' : 'STANDBY';
    
    if(authState !== 'ACTIVE') {
        if(window.Q_Auth && typeof window.Q_Auth.triggerOAuth === 'function') window.Q_Auth.triggerOAuth();
        else alert("OAuth Service Unavailable. Boot from System Home Gateway.");
        return;
    }
    
    if(window.Q_Auth && typeof window.Q_Auth.triggerOAuth === 'function') window.Q_Auth.triggerOAuth(); 
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
            if (!node.classList.contains('q-control-strip') && !node.classList.contains('q-nav-bar') && !node.classList.contains('wing-panel')) {
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
                position: absolute; top: 50%; left: 50%; width: 2px;
                height: calc(2px + (60px * var(--warp-factor, 0)));
                background: linear-gradient(to bottom, #fff, var(--warp-color, #fff));
                border-radius: 2px;
                animation: warp-travel linear infinite;
            }
            @keyframes warp-travel {
                0% { transform: translate(-50%, -50%) rotate(var(--angle)) translateX(var(--radius)) translateZ(-500px); opacity: 0; }
                20% { opacity: var(--opacity); }
                80% { opacity: var(--opacity); }
                100% { transform: translate(-50%, -50%) rotate(var(--angle)) translateX(var(--radius)) translateZ(500px); opacity: 0; }
            }
        `;
        document.head.appendChild(style);
    }
    
    container.innerHTML = '';
    for(let i=0; i<300; i++) {
        let star = document.createElement('div');
        star.className = 'star-kinetic';
        star.style.setProperty('--angle', Math.random() * 360 + 'deg');
        star.style.setProperty('--radius', (Math.random() * 800 + 50) + 'px');
        star.style.setProperty('--opacity', Math.random() * 0.8 + 0.2);
        star.style.animationDuration = (Math.random() * 5 + 5) + 's';
        star.style.animationDelay = -(Math.random() * 10) + 's';
        container.appendChild(star);
    }
};

(function initWarpEngine() {
    let warpFactor = 0;
    let targetWarp = 0;
    let lastDays = null;

    window.addEventListener('q-tick', (e) => {
        const currentDays = e.detail.daysElapsed;
        if (lastDays !== null && !e.detail.isLive) {
            const delta = Math.abs(currentDays - lastDays);
            if (delta > 0) {
                targetWarp = Math.min(1.0, targetWarp + (delta * 0.4)); 
            }
        }
        lastDays = currentDays;
    });

    const tick = () => {
        targetWarp *= 0.85; 
        warpFactor += (targetWarp - warpFactor) * 0.15; 
        
        if (document.documentElement) {
            document.documentElement.style.setProperty('--warp-factor', Math.max(0, warpFactor).toFixed(3));
            document.documentElement.style.setProperty('--warp-color', warpFactor > 0.1 ? 'var(--theme-main)' : '#fff');
        }
        requestAnimationFrame(tick);
    };
    
    window.addEventListener('DOMContentLoaded', () => {
        requestAnimationFrame(tick);
    });
})();

window.bindMasterTickScrubber = function() {
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
};

window.scrubTime = function(val) {
    if(!window.getSimState || !window.ANCHOR_ALPHA_DYNAMIC) return;
    const saved = window.getSimState();
    const baseTime = saved.isLive ? Date.now() : saved.simTime;
    const currentDays = (baseTime - window.ANCHOR_ALPHA_DYNAMIC) / window.MS_DAY;
    const cycleBaseDays = Math.floor(currentDays / 365.24219) * 365.24219;
    const discreteDays = parseInt(val, 10);
    
    const targetMs = window.ANCHOR_ALPHA_DYNAMIC + ((cycleBaseDays + discreteDays) * window.MS_DAY);
    const d = new Date(targetMs);
    d.setUTCHours(12, 0, 0, 0);
    
    window.updateMasterClock(false, d.getTime());
    if(window.Q_MobileBridge) window.Q_MobileBridge.pulse('LIGHT');
};

window.stepScrubber = function(n) {
    if(!window.getSimState) return;
    const saved = window.getSimState();
    const baseTime = saved.isLive ? Date.now() : saved.simTime;
    const targetMs = baseTime + (n * window.MS_DAY);
    window.updateMasterClock(false, targetMs);
    if(window.Q_MobileBridge) window.Q_MobileBridge.pulse('MEDIUM');
};

window.setLiveClock = function() {
    window.updateMasterClock(true, Date.now());
    if(window.Q_MobileBridge) window.Q_MobileBridge.pulse('HEAVY');
};

window.updateMasterClock = function(isLive, simTime) {
    const payload = JSON.stringify({ isLive, simTime, scrubSpeed: 0 });
    localStorage.setItem('Q_MASTER_CLOCK', payload);
    window.dispatchEvent(new StorageEvent('storage', { key: 'Q_MASTER_CLOCK', newValue: payload }));
    window.syncScrubberUI();
};

window.syncScrubberUI = function() {
    if(!window.getSimState) return;
    const state = window.getSimState();
    const liveBtn = document.getElementById('q-live-toggle');
    const scrubber = document.getElementById('q-global-scrubber');
    
    if(liveBtn) {
        liveBtn.classList.toggle('active', state.isLive);
        liveBtn.innerText = state.isLive ? "LIVE" : "RESYNC";
    }
    
    if(scrubber && state.isLive === false && window.ANCHOR_ALPHA_DYNAMIC) {
        let daysElapsed = (state.simTime - window.ANCHOR_ALPHA_DYNAMIC) / window.MS_DAY;
        let cycleDay = Math.floor(daysElapsed % 365.24219);
        if (cycleDay < 0) cycleDay += 365;
        scrubber.value = cycleDay;
    }
};

window.addEventListener('DOMContentLoaded', () => {
    window.injectUniversalUI();
    if (window.generateStars) window.generateStars('stars');

    if (window.innerWidth <= 950) {
        const micFab = document.getElementById('q-mic-fab');
        const controlsPanel = document.getElementById('q-universal-controls');
        
        if (micFab && controlsPanel) {
            controlsPanel.appendChild(micFab);
        }
    }
});