// THE QUADRATURE: UNIFIED UI MATRIX & RENDERER
// Architect: Kelby | Engineer: Kairos
// STATUS: Phase XII UI Engine. True Ephemeris Sync, Typographic Hierarchy & Infinite Horizon Scrubber.

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

    const faceActive = isHome;

    const style = document.createElement('style');
    style.innerHTML = `
        /* --- CORE NORMALIZATION & WEBKIT Z-INDEX FIX --- */
        html, body { 
            position: fixed !important; top: 0px !important; left: 0px !important; right: 0px !important; bottom: 0px !important; 
            width: 100vw !important; height: var(--app-height, 100vh) !important; 
            margin: 0px !important; padding: 0px !important; 
            overflow: hidden !important; touch-action: none !important; overscroll-behavior: none !important; 
            transform: none !important; perspective: none !important; transform-style: flat !important; 
            background-color: #010205; 
        }
        #mobile-telemetry-btn { display: none !important; pointer-events: none !important; }

        :root { 
            --wing-w: 240px; --mod-w: 320px; --dial-size: 60vh; --wing-offset: calc((var(--dial-size) / 2) + 4vw); 
            --glass-med: rgba(2, 12, 25, 0.65); --blur-med: blur(16px); --white-pure: #ffffff; 
            --starlight: rgba(255, 255, 255, 0.7); --platinum: #E5E4E2; --chrono-amber: #B97A35; 
            --chrono-amber-dim: rgba(185, 122, 53, 0.2); 
            --q-blue-glow: rgba(0, 163, 255, 0.3); --q-metal: #e2e8f0;
            --center-gap-x: ${isHome ? '31vh' : '36vh'}; 
            --corner-gap-y: ${isHome ? '24vh' : '21vh'}; 
            --corner-gap-x: ${isHome ? '23vh' : '32vh'};
            --panel-w: ${isHome ? '340px' : '460px'};
            --panel-h: ${isHome ? '80px' : '170px'};
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

        .corner-panel { position: absolute; width: var(--panel-w); height: var(--panel-h); z-index: 20; transition: transform 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275); pointer-events: auto; }
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
        
        .wing-r .wing-data-center, .wing-r .wing-footer { padding-left: 15px; }

        .wing-header { position: absolute; top: 25px; left: 0; width: 100%; z-index: 10; display: flex; justify-content: center; pointer-events: none;}
        .wing-data-center { display: flex; flex-direction: column; justify-content: center; align-items: center; text-align: center; height: 100%; width: 100%; padding: 40px 0; box-sizing: border-box; position: relative; z-index: 10; pointer-events: none;}
        .wing-footer { position: absolute; bottom: 20px; left: 0; width: 100%; z-index: 10; display: flex; justify-content: center; pointer-events: none;}

        .w-head { font-family: 'Orbitron'; font-weight: 600; font-size: 0.75rem; letter-spacing: 3px; padding-left: 3px; color: rgba(255,255,255,0.6); border-bottom: 1px solid var(--theme-dim, rgba(0,240,255,0.2)); padding-bottom: 4px; display: inline-block; z-index: 20; text-align: center; }
        .w-lbl { font-family: 'JetBrains Mono'; font-size: 0.55rem; color: var(--starlight); letter-spacing: 1px; padding-left: 1px; text-transform: uppercase; margin-bottom: 2px; z-index: 20; text-align: center; }
        .val-lg { font-family: 'Orbitron'; font-size: 1.2rem; font-weight: 700; letter-spacing: 1px; padding-left: 1px; white-space: nowrap; color: #fff; text-shadow: 0 4px 10px rgba(0,0,0,0.5); z-index: 20; text-align: center; }
        .val-sm { font-family: 'Orbitron'; font-size: 0.85rem; font-weight: 700; z-index: 20; text-align: center; }
        .fmt-toggle { font-family: 'JetBrains Mono'; font-weight: bold; font-size: 0.5rem; color: var(--theme-main, #00f0ff); cursor: pointer; border: 1px solid var(--theme-dim, rgba(0,240,255,0.2)); padding: 2px 8px; border-radius: 4px; background: rgba(0,0,0,0.6); pointer-events: auto; transition: 0.3s; white-space: nowrap; text-align: center; }
        .fmt-toggle:hover { background: var(--theme-main, #00f0ff); color: #000; box-shadow: 0 0 10px var(--theme-main, #00f0ff); }

        /* --- HEX STRING HOVER CLASSES --- */
        .exp-view { text-align: left; font-family: 'JetBrains Mono'; font-size: 0.45rem; line-height: 1.6; letter-spacing: 0.5px; white-space: nowrap; }
        .rest-view { text-align: center; font-family: 'Orbitron'; font-size: 0.75rem; letter-spacing: 1px; white-space: nowrap; }

        .desktop-only { display: flex !important; }
        .mobile-only-flex { display: none !important; }

        /* --- GLOBAL DESKTOP NAVBAR --- */
        .q-nav-bar { 
            position: fixed; 
            ${isHome ? 'display: none !important;' : 'bottom: 2.5vh; left: 50%; transform: translateX(-50%); width: max-content; padding: 0 20px; border: 1px solid rgba(255,255,255,0.1); border-radius: 12px; box-shadow: 0 10px 30px rgba(0,0,0,0.9), inset 0 0 20px rgba(255,255,255,0.05);'}
            height: 45px; background: rgba(2, 6, 15, 0.95); 
            display: flex; justify-content: center; align-items: center; box-sizing: border-box; z-index: 100000; font-family: 'Orbitron'; pointer-events: auto !important; 
        }
        
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
        
        .q-global-controls { position: fixed; ${isHome ? 'display: none !important;' : 'bottom: calc(2.5vh + 60px);'} left: 50%; transform: translateX(-50%); z-index: 9995; display: flex; align-items: center; gap: 12px; background: rgba(10, 12, 18, 0.95); backdrop-filter: blur(20px); border-radius: 50px; padding: 10px 25px; justify-content: space-between; box-shadow: 0 10px 40px rgba(0,0,0,0.9), 0 0 20px rgba(255,255,255,0.05); border: 1px solid rgba(255, 255, 255, 0.1); pointer-events: auto; }
        .q-ctrl-btn { background: transparent; border: 1px solid var(--theme-main, #00f0ff); color: var(--theme-main, #00f0ff); padding: 8px 14px; cursor: pointer; font-family: 'Orbitron'; font-size: 0.65rem; font-weight: 700; border-radius: 6px; transition: 0.3s; letter-spacing: 1px; padding-left: 15px; white-space: nowrap; pointer-events: auto; }
        .q-ctrl-btn:hover { background: rgba(255,255,255,0.1); color: #fff; }
        .q-ctrl-btn.active { background: var(--theme-main, #00f0ff); color: #000; }
        .q-scrubber { flex-grow: 1; min-width: 250px; accent-color: var(--theme-main, #00f0ff); cursor: pointer; height: 4px; -webkit-appearance: none; margin: 0 10px; border-radius: 2px; background: rgba(255,255,255,0.1); pointer-events: auto; }
        .q-scrubber::-webkit-slider-thumb { -webkit-appearance: none; height: 22px; width: 22px; background: var(--theme-main, #00f0ff); clip-path: polygon(50% 0%, 60% 40%, 100% 50%, 60% 60%, 50% 100%, 40% 60%, 0% 50%, 40% 40%); cursor: grab; pointer-events: auto; }
        .q-scrubber::-webkit-slider-thumb:active { cursor: grabbing; }

        @media (max-width: 950px) {
            :root { --dial-size: min(48vh, 85vw) !important; } 
            .desktop-only { display: none !important; }
            .mobile-only-flex { display: flex !important; }
            
            /* --- APERTURE SUPPRESSION MATRIX --- */
            body.q-aperture-home .q-control-strip,
            body.q-aperture-home #mobile-telemetry-ribbon,
            body.q-aperture-home #q-universal-controls,
            body.q-aperture-home .q-nav-bar {
                display: none !important;
                visibility: hidden !important;
                opacity: 0 !important;
                pointer-events: none !important;
            }

            /* Fix Telemetry conflict overrides */
            body:not(.telemetry-open) .telemetry-node { display: none !important; visibility: hidden !important; }
            body:not(.telemetry-open) .vector-anchor { display: none !important; visibility: hidden !important; }
            body:not(.telemetry-open) .wing-panel { display: none !important; }
            
            /* --- MOBILE IRIS PANEL ROUTING --- */
            /* Hide corner panels on Aperture home by default */
            body.q-aperture-home:not(.mobile-panels-revealed) .corner-panel { 
                display: none !important; 
                opacity: 0 !important;
                visibility: hidden !important;
                pointer-events: none !important;
            }
            
            /* CRITICAL FIX: Override Desktop-Only to reveal panels over Iris on Mobile */
            body.q-aperture-home.mobile-panels-revealed div.corner-panel.desktop-only {
                display: flex !important;
                opacity: 1 !important;
                visibility: visible !important; 
                pointer-events: auto !important;
                z-index: 100 !important;
                left: 50% !important;
                transform: translateX(-50%) !important;
                right: auto !important;
                width: 220px !important;
                height: 45px !important;
                position: fixed !important;
                background: rgba(10, 15, 25, 0.95) !important;
                border: 1px solid rgba(255,255,255,0.2) !important;
                border-radius: 8px !important;
                box-shadow: 0 10px 30px rgba(0,0,0,0.9) !important;
            }
            
            /* Typography Scaling for Native Expo Alignment */
            body.q-aperture-home.mobile-panels-revealed div.corner-panel.desktop-only .panel-label {
                padding: 0 !important;
                font-size: 0.65rem !important;
                letter-spacing: 1px !important;
                line-height: 45px !important;
            }
            
            /* Hide the visual artifacts that do not fit the mobile panel layout */
            body.q-aperture-home.mobile-panels-revealed div.corner-panel.desktop-only .frost-zone,
            body.q-aperture-home.mobile-panels-revealed div.corner-panel.desktop-only .panel-bg,
            body.q-aperture-home.mobile-panels-revealed div.corner-panel.desktop-only .opt-oval {
                display: none !important;
            }
            
            /* Precision Mobile Positioning: Centered exactly over shifted Iris (47vh) */
            body.q-aperture-home.mobile-panels-revealed div.corner-panel.tl { top: 26vh !important; bottom: auto !important; border-color: var(--bio-purple, #b829ff) !important; }
            body.q-aperture-home.mobile-panels-revealed div.corner-panel.tr { top: 38vh !important; bottom: auto !important; border-color: var(--gold, #F4D068) !important; }
            body.q-aperture-home.mobile-panels-revealed div.corner-panel.bl { top: 50vh !important; bottom: auto !important; border-color: var(--env-green, #a7ff83) !important; }
            body.q-aperture-home.mobile-panels-revealed div.corner-panel.br { top: 62vh !important; bottom: auto !important; border-color: var(--sys-cyan, #00f0ff) !important; }

            /* Dim Iris when panels are active */
            body.q-aperture-home.mobile-panels-revealed .q-center-dial {
                opacity: 0.2 !important;
                filter: blur(4px) !important;
                transition: opacity 0.3s ease, filter 0.3s ease;
            }
            
            .q-nav-bar { 
                top: 0px !important; margin-top: 0px !important; left: 0px !important; padding: 0 10px !important; 
                height: 50px !important; width: 100vw !important; transform: none !important; border-radius: 0 !important; 
                background: transparent !important; border: none !important; box-shadow: none !important; pointer-events: none !important; 
            }
            .q-nav-bar * { pointer-events: auto !important; }
            
            /* CRITICAL FIX: Ensure Aperture Nav Button is Visible on Vectors */
            .q-nav-menu > *:not(.face-btn):not(.sim-badge) { display: none !important; } 
            body.q-vector-hud .q-nav-menu .face-btn { display: inline-block !important; margin-left: 8px !important; }
            
            #q-global-sim-badge { font-size: 0.45rem !important; padding: 2px 4px !important; letter-spacing: 0px !important; margin-left: 0 !important; white-space: nowrap; flex-shrink: 0; position: relative; z-index: 100000; pointer-events: auto !important; }
            
            .q-nav-menu { position: static; flex-direction: row; overflow-x: auto; white-space: nowrap; background: transparent; box-shadow: none; transform: none; width: auto; -webkit-overflow-scrolling: touch; border: none; padding-bottom: 0; gap: 5px; justify-content: flex-start; }
            .q-nav-menu::-webkit-scrollbar { display: none; }
            .q-nav-btn { padding: 4px 8px; font-size: 0.55rem; margin-right: 0; border-radius: 4px; border: 1px solid rgba(255,255,255,0.2) !important; }
            
            .q-center-dial { margin-top: -3vh !important; z-index: 10 !important;}
            .axis-omni { bottom: calc(50% + 33.5vh) !important; }
            .axis-dash { top: calc(50% + 27.5vh) !important; }
            .q-control-strip { position: fixed; bottom: 0 !important; left: 0; width: 100%; background: rgba(2, 6, 15, 0.98); border-top: 1px solid var(--theme-dim, rgba(0, 240, 255, 0.2)); display: flex; justify-content: space-around; align-items: center; z-index: 100000; height: 65px !important; padding-bottom: env(safe-area-inset-bottom, 15px) !important; box-shadow: 0 -10px 30px rgba(0,0,0,0.9); pointer-events: auto !important; box-sizing: content-box !important; }
            .strip-btn { background: transparent; border: none; color: var(--platinum); display: flex; flex-direction: column; align-items: center; gap: 4px; cursor: pointer; text-decoration: none; padding: 5px; pointer-events: auto !important; }
            .strip-btn svg { transition: 0.3s; }
            
            .strip-btn.face-strip.active svg { color: var(--chrono-amber) !important; filter: drop-shadow(0 0 8px var(--chrono-amber)) !important; }
            .strip-btn.face-strip.active .strip-lbl { color: var(--chrono-amber) !important; }
            .strip-btn.bio-strip.active svg { color: var(--bio-purple) !important; filter: drop-shadow(0 0 8px var(--bio-purple)) !important; }
            .strip-btn.bio-strip.active .strip-lbl { color: var(--bio-purple) !important; }
            .strip-btn.com-strip.active svg { color: var(--gold, #F4D068) !important; filter: drop-shadow(0 0 8px var(--gold, #F4D068)) !important; }
            .strip-btn.com-strip.active .strip-lbl { color: var(--gold, #F4D068) !important; }
            .strip-btn.env-strip.active svg { color: var(--env-green, #a7ff83) !important; filter: drop-shadow(0 0 8px var(--env-green, #a7ff83)) !important; }
            .strip-btn.env-strip.active .strip-lbl { color: var(--env-green, #a7ff83) !important; }
            .strip-btn.mec-strip.active svg { color: var(--sys-cyan, #00f0ff) !important; filter: drop-shadow(0 0 8px var(--sys-cyan, #00f0ff)) !important; }
            .strip-btn.mec-strip.active .strip-lbl { color: var(--sys-cyan, #00f0ff) !important; }

            .strip-lbl { font-family: 'Orbitron'; font-size: 0.4rem; font-weight: 900; letter-spacing: 1px; padding-left: 1px; color: rgba(255,255,255,0.5); transition: 0.3s; }
            
            #mobile-telemetry-ribbon { display: flex !important; position: fixed; top: 50px !important; margin-top: 0 !important; left: 0px !important; height: 45px !important; width: 100vw !important; background: rgba(2, 6, 15, 0.98); border-bottom: 1px solid var(--theme-dim, rgba(0, 240, 255, 0.2)); z-index: 99998 !important; justify-content: space-between; align-items: center; box-shadow: 0 5px 15px rgba(0,0,0,0.9); padding: 0 10px !important; box-sizing: border-box; white-space: nowrap; overflow: hidden; }
            #ribbon-leg-date { white-space: nowrap; font-size: 0.6rem !important; }
            #ribbon-leg { white-space: nowrap; font-size: 0.65rem !important; }

            #mobile-telemetry-viewport { display: none; position: fixed !important; top: 95px !important; bottom: calc(65px + env(safe-area-inset-bottom, 15px)) !important; height: auto !important; left: 0; width: 100vw; background: rgba(5,5,8,0.95); backdrop-filter: blur(15px); -webkit-backdrop-filter: blur(15px); z-index: 99900; overflow-y: scroll !important; overflow-x: hidden !important; -webkit-overflow-scrolling: touch; overscroll-behavior: contain; flex-direction: column; align-items: center; justify-content: flex-start; padding-top: 15px !important; margin-top: 0 !important; padding-bottom: 20px !important; box-sizing: border-box !important; gap: 15px; pointer-events: auto !important; }
            #mobile-telemetry-viewport .telemetry-node { display: flex !important; position: relative !important; top: auto !important; left: auto !important; right: auto !important; bottom: auto !important; transform: translateZ(0) !important; margin: 0 !important; width: 95vw !important; max-width: 360px !important; min-height: min-content !important; height: auto !important; box-sizing: border-box !important; backface-visibility: hidden !important; visibility: visible !important; flex-shrink: 0 !important; pointer-events: auto !important; opacity: 1 !important; }
            #mobile-telemetry-viewport .wing-panel { display: none !important; }
            
            #mobile-telemetry-viewport .corner-panel { height: auto !important; min-height: 120px !important; padding: 20px !important; }
            #mobile-telemetry-viewport .panel-bg { display: none !important; } 
            #mobile-telemetry-viewport .frost-zone { inset: 0 !important; border-radius: 8px !important; border: 1px solid rgba(255,255,255,0.1); }
            #mobile-telemetry-viewport .panel-data-container { padding: 0 !important; margin-top: 10px !important; align-items: center !important; text-align: center !important; }
            #mobile-telemetry-viewport .panel-label { padding: 0 !important; position: relative !important; }
            #mobile-telemetry-viewport .opt-oval { position: absolute !important; top: 15px !important; right: 15px !important; left: auto !important; bottom: auto !important; }
            
            body.telemetry-open .q-center-dial { display: none !important; }

            .q-global-controls { 
                display: flex !important; 
                align-items: center !important; 
                justify-content: space-between !important;
                width: 95vw !important; 
                min-width: unset !important; 
                box-sizing: border-box !important; 
                padding: 6px 8px !important; 
                gap: 4px !important;
                ${isHome ? 'display: none !important;' : 'bottom: calc(65px + env(safe-area-inset-bottom, 15px)) !important;'}
            } 
            
            #q-mic-fab { 
                position: static !important; 
                transform: none !important;
                width: 32px !important; 
                height: 32px !important; 
                border-radius: 6px !important; 
                font-size: 1rem !important; 
                box-shadow: none !important;
                order: 1 !important; 
                flex-shrink: 0 !important;
                background: rgba(5, 8, 15, 0.9);
                border: 1px solid var(--theme-main, #00f0ff);
                color: var(--theme-main, #00f0ff);
                display: flex; justify-content: center; align-items: center;
                cursor: pointer; transition: all 0.3s ease; pointer-events: auto !important;
            }
            #q-mic-fab.listening { animation: pulse-mic 1.5s infinite; background: var(--theme-main, #00f0ff); color: #000; box-shadow: 0 0 25px var(--theme-main, #00f0ff) !important; }
            
            .q-global-controls > .q-ctrl-btn:nth-child(1) { order: 2 !important; padding: 0 8px !important; height: 32px !important; min-width: 24px !important; flex-shrink: 0; }
            .q-scrubber { order: 3 !important; min-width: 0 !important; width: 100% !important; margin: 0 !important; flex-grow: 1 !important; }
            .q-global-controls > .q-ctrl-btn:nth-child(3) { order: 4 !important; padding: 0 8px !important; height: 32px !important; min-width: 24px !important; flex-shrink: 0; }

            #q-live-toggle {
                order: 5 !important; 
                width: auto !important;
                min-width: 32px !important;
                height: 32px !important;
                padding: 0 6px !important;
                font-size: 0.55rem !important; 
                flex-shrink: 0 !important;
                margin: 0 !important;
            }
        }
    `;
    document.head.appendChild(style);

    const uiContainer = document.createElement('div');
    uiContainer.id = 'q-ui-injected-flag';
    document.body.appendChild(uiContainer);

    const uiWrapper = document.createElement('div');
    
    uiWrapper.innerHTML = `
        <div class="space-bg"></div>
        <div class="star-container" id="stars"></div>
        <div class="nebula-left"></div>
        <div class="nebula-right"></div>
        <div class="dust-layer-global"></div>

        <div class="q-nav-bar">
            <div style="display:flex; width: 100%; justify-content: center; align-items: center;">
                <div class="q-nav-menu" id="q-nav-menu">
                    <button id="q-global-sim-badge" class="q-nav-btn sim-badge" style="display: inline-block; border-color:${authBorder} !important; color:${authColor} !important; background:${authBg} !important;" onclick="window.triggerDomainShift(event)">${authText}</button>
                    <a href="index.html" class="q-nav-btn face-btn vector-link ${faceActive ? 'active' : ''}" onclick="window.location.href=this.href; return false;">THE APERTURE</a>
                    <a href="PHYSIOLOGICAL.html" class="q-nav-btn bio-btn vector-link ${bActive ? 'active' : ''}" onclick="window.location.href=this.href; return false;">PHYSIOLOGICAL</a>
                    <a href="METAPHYSICAL.html" class="q-nav-btn com-btn vector-link ${cActive ? 'active' : ''}" onclick="window.location.href=this.href; return false;">METAPHYSICAL</a>
                    <a href="METEOROLOGICAL.html" class="q-nav-btn env-btn vector-link ${eActive ? 'active' : ''}" onclick="window.location.href=this.href; return false;">METEOROLOGICAL</a>
                    <a href="ASTROPHYSICAL.html" class="q-nav-btn mec-btn vector-link ${mActive ? 'active' : ''}" onclick="window.location.href=this.href; return false;">ASTROPHYSICAL</a>
                    <button class="q-nav-btn omni desktop-only" style="border-color: var(--chrono-amber); color: var(--chrono-amber); display: inline-block;" onclick="if(typeof window.Q_OmniPlanner !== 'undefined') window.Q_OmniPlanner.openPlanner()">[ OMNI-PLANNER ]</button>
                    <button class="q-nav-btn special desktop-only" style="border-color: var(--chrono-amber); color: var(--chrono-amber); display: inline-block;" onclick="if(typeof window.Q_IntegrationHub !== 'undefined') window.Q_IntegrationHub.openHub()">[ DASHBOARD ]</button>
                </div>
            </div>
            <button class="mobile-only-flex" style="background:transparent; border:none; color:var(--theme-main, #00f0ff); font-size:1.5rem; padding:0; margin:0; position:absolute; right:15px; cursor:pointer;" onclick="if(typeof window.Q_IntegrationHub !== 'undefined') window.Q_IntegrationHub.openHub()">☰</button>
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
            <a href="index.html" class="strip-btn face-strip ${faceActive ? 'active' : ''}" onclick="window.location.href=this.href; return false;">
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

        <button id="q-mic-fab" class="mobile-only-flex" onclick="if(window.Q_KairosVoice) window.Q_KairosVoice.toggle()">🎙</button>
        <button id="q-mic-fab-desktop" class="desktop-only" onclick="if(window.Q_KairosVoice) window.Q_KairosVoice.toggle()">🎙</button>

        <div class="corner-panel tl telemetry-node desktop-only">
            <div class="frost-zone"></div>
            <div class="panel-bg"></div>
            <div class="opt-oval" id="opt-tl">OPT</div>
            <div class="panel-data-container" id="quad-tl"></div>
        </div>
        <div class="corner-panel tr telemetry-node desktop-only">
            <div class="frost-zone"></div>
            <div class="panel-bg"></div>
            <div class="opt-oval" id="opt-tr">OPT</div>
            <div class="panel-data-container" id="quad-tr"></div>
        </div>
        <div class="corner-panel bl telemetry-node desktop-only">
            <div class="frost-zone"></div>
            <div class="panel-bg"></div>
            <div class="opt-oval" id="opt-bl">OPT</div>
            <div class="panel-data-container" id="quad-bl"></div>
        </div>
        <div class="corner-panel br telemetry-node desktop-only">
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
                <div style="margin-bottom: 15px;" id="leg-date-wrapper">
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
                <div id="legacy-footer-text" style="font-size:0.5rem; color:var(--starlight); border-top: 1px dashed var(--theme-dim, rgba(0,240,255,0.2)); padding-top: 8px; width: 85%; margin: 0 auto; font-family: 'JetBrains Mono';">STATUS: CONTINUITY ACTIVE</div>
            </div>
        </div>

        <div class="wing-panel wing-r telemetry-node" id="q-wing-right">
            <div class="wing-frost"></div>
            <div class="wing-bg"></div>
            <div class="wing-header">
                <span class="w-head" style="position:static; transform:none;">QUAD OS</span>
            </div>
            
            <div class="wing-data-center">
                <div style="margin-bottom: 4px; pointer-events: none;">
                    <div class="w-lbl">Q COORDINATE</div>
                    <div class="val-lg" id="q-coord-wing" style="margin-top: 2px; color: var(--theme-main, #00f0ff); text-shadow: 0 0 10px var(--theme-dim, rgba(0,240,255,0.2));">--</div>
                </div>
                
                <div id="p-string-node" style="width: 100%; pointer-events: auto; cursor: pointer; padding: 2px 0; border-top: 1px solid rgba(0,240,255,0.1); border-bottom: 1px solid rgba(0,240,255,0.1); margin-bottom: 6px; position:relative;">
                    <div class="rest-view" id="p-rest" style="color:var(--theme-main, #00f0ff); text-shadow:0 0 10px var(--theme-dim, rgba(0,240,255,0.2));">--</div>
                    <div id="p-exp" style="display:none; position:absolute; top:100%; left:0; width:100%; background:rgba(2,6,15,0.95); z-index:50; padding:6px; box-sizing:border-box; border-radius:4px; border: 1px solid rgba(0,240,255,0.2);">--</div>
                </div>

                <div style="display: flex; width: 100%; justify-content: center; align-items: center; gap: 15px; position: relative; margin-top: 5px;">
                    
                    <div style="display: flex; flex-direction: column; gap: 6px; pointer-events: auto; cursor: pointer;" id="deep-time-col">
                        <div id="g-rest" class="rest-view" style="color:var(--theme-main, #00f0ff); text-shadow:0 0 10px var(--theme-dim, rgba(0,240,255,0.2)); text-align: left;">--</div>
                        <div id="s-rest" class="rest-view" style="color:var(--theme-main, #00f0ff); text-shadow:0 0 10px var(--theme-dim, rgba(0,240,255,0.2)); text-align: left;">--</div>
                    </div>

                    <div style="display: flex; flex-direction: column; align-items: center; pointer-events: auto; cursor: pointer;" id="radial-index-wrapper">
                        <div id="radial-index-container" style="position:relative; width: 45px; height: 45px; pointer-events: none;">
                            <svg viewBox="-30 -30 60 60" style="overflow:visible; width:100%; height:100%;">
                                <defs>
                                    <linearGradient id="friction-grad" x1="0%" y1="0%" x2="100%" y2="100%">
                                        <stop offset="0%" stop-color="#ffffff" />
                                        <stop offset="100%" stop-color="var(--theme-main, #00f0ff)" />
                                    </linearGradient>
                                </defs>
                                <circle cx="0" cy="0" r="25" fill="none" stroke="rgba(255,255,255,0.1)" stroke-width="1.5" />
                                <path id="friction-arc" fill="none" stroke="url(#friction-grad)" stroke-width="2" filter="drop-shadow(0 0 4px var(--theme-main, #00f0ff))" />
                                <circle id="node-solar" cx="0" cy="-25" r="3" fill="#ffffff" filter="drop-shadow(0 0 5px #ffffff)" />
                                <circle id="node-sidereal" cx="0" cy="-25" r="3" fill="var(--theme-main, #00f0ff)" filter="drop-shadow(0 0 5px var(--theme-main, #00f0ff))" />
                            </svg>
                        </div>
                        <div class="w-lbl" style="font-size: 0.35rem; margin-top: 4px; color: var(--q-metal);">AXIAL FRICTION</div>
                    </div>

                    <div id="deep-time-overlay" style="display:none; position:absolute; top:-5px; left:0; width:100%; height:calc(100% + 10px); background:rgba(2,6,15,0.95); backdrop-filter:blur(8px); z-index:50; flex-direction:column; justify-content:center; padding-left: 5px; box-sizing:border-box; border-radius:4px; border: 1px solid rgba(0,240,255,0.2);">
                    </div>
                    
                    <div id="radial-overlay" style="display:none; position:absolute; top:-5px; left:0; width:100%; height:calc(100% + 10px); background:rgba(2,6,15,0.95); backdrop-filter:blur(8px); z-index:51; flex-direction:column; justify-content:center; padding: 5px; box-sizing:border-box; border-radius:4px; border: 1px solid rgba(0,240,255,0.2); text-align: left;">
                        <div class="exp-view" style="white-space: normal;">
                            <span style="color:var(--starlight); font-weight:bold;">[AXIAL FRICTION]</span><br>
                            <span style="color:var(--theme-main, #00f0ff); font-size: 0.45rem;">Compounding variance between the 24h Solar Day and the 23h 56m Sidereal rotation.</span>
                        </div>
                    </div>
                </div>
            </div>
            
            <div class="wing-footer">
                <div id="quad-footer-text" style="font-size:0.5rem; color:var(--starlight); border-top: 1px dashed var(--theme-dim, rgba(0,240,255,0.2)); padding-top: 8px; width: 85%; margin: 0 auto; font-family: 'JetBrains Mono';">DUAL-STATE ENGINE</div>
            </div>
        </div>

        <div class="q-global-controls" id="q-universal-controls">
            <button class="q-ctrl-btn" onclick="window.stepScrubber(-1)">&lt;</button>
            <input type="range" min="-365" max="365" step="1" value="0" class="q-scrubber" id="q-global-scrubber" oninput="window.scrubTime(this.value)">
            <button class="q-ctrl-btn" onclick="window.stepScrubber(1)">&gt;</button>
            <button class="q-ctrl-btn" id="q-live-toggle" onclick="window.setLiveClock()">LIVE</button>
        </div>
    `;
    
    while(uiWrapper.firstChild) {
        document.body.appendChild(uiWrapper.firstChild);
    }

    // --- HEX STRING EVENT BINDING ---
    const pNode = document.getElementById('p-string-node');
    const pExp = document.getElementById('p-exp');
    if(pNode && pExp) {
        pNode.addEventListener('mouseenter', () => pExp.style.display = 'block');
        pNode.addEventListener('mouseleave', () => pExp.style.display = 'none');
        pNode.addEventListener('click', () => { pExp.style.display = pExp.style.display === 'none' ? 'block' : 'none'; });
    }

    const deepTimeCol = document.getElementById('deep-time-col');
    const deepTimeOverlay = document.getElementById('deep-time-overlay');
    if(deepTimeCol && deepTimeOverlay) {
        deepTimeCol.addEventListener('mouseenter', () => deepTimeOverlay.style.display = 'flex');
        deepTimeCol.addEventListener('mouseleave', () => deepTimeOverlay.style.display = 'none');
        deepTimeCol.addEventListener('click', () => { deepTimeOverlay.style.display = deepTimeOverlay.style.display === 'none' ? 'flex' : 'none'; });
    }

    const radialWrapper = document.getElementById('radial-index-wrapper');
    const radialOverlay = document.getElementById('radial-overlay');
    if(radialWrapper && radialOverlay) {
        radialWrapper.addEventListener('mouseenter', () => radialOverlay.style.display = 'flex');
        radialWrapper.addEventListener('mouseleave', () => radialOverlay.style.display = 'none');
        radialWrapper.addEventListener('click', () => { radialOverlay.style.display = radialOverlay.style.display === 'none' ? 'flex' : 'none'; });
    }
    
    window.bindMasterTickScrubber();
    window.syncScrubberUI();

    // --- ANCHOR TRANSLATION FILTER ---
    function translateAnchor(name) {
        if (!name) return "";
        const n = name.toUpperCase();
        if (n.includes('ALPHA')) return 'SOUTHERN SOLSTICE';
        if (n.includes('BETA')) return '1ST EQUINOX';
        if (n.includes('GAMMA')) return 'NORTHERN SOLSTICE';
        if (n.includes('DELTA')) return '2ND EQUINOX';
        if (n.includes('EPSILON')) return 'PURGE';
        return name;
    }

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
                let anchorName = (activeBlock && activeBlock.type === 'ANCHOR') ? translateAnchor(activeBlock.name) : "";
                
                let qcStr = `<span style="color:var(--chrono-amber);">QC</span> <span style="color:#fff;">${cCycle}</span> <span style="color:var(--chrono-amber);">Q</span><span style="color:#fff;">${qData.quad}</span> <span style="color:var(--chrono-amber);">S</span><span style="color:#fff;">${qData.sect}</span> <span style="color:var(--chrono-amber);">DEG</span> <span style="color:#fff;">${qData.day}</span>`;
                
                if (anchorName && anchorName !== 'PURGE') {
                    qcStr += ` <span style="color:var(--theme-main); margin-left:4px;">[${anchorName}]</span>`;
                }
                
                ribbonLegDate.innerHTML = qcStr;
            } else {
                ribbonLegDate.innerHTML = `<span style="color:var(--chrono-amber); font-size:0.75rem; font-weight:bold;">${e.detail.legacyDateStr.toUpperCase()}</span>`;
            }
        }

        function formatDualColorWing(str) {
            const letterStyle = "color:var(--starlight); font-family:'Orbitron'; font-size:0.8rem; margin-right:2px;";
            const numStyle = `color:var(--theme-main, #00f0ff); font-size:0.95rem; font-weight:bold;`;
            let out = "";
            let tokens = str.match(/([0-9]+)|([^0-9]+)/g);
            if (tokens) {
                tokens.forEach(tk => { out += `<span style="${/[0-9]/.test(tk) ? numStyle : letterStyle}">${tk}</span>`; });
            }
            return out;
        }

        const legDateEl = document.getElementById('leg-date');
        if (legDateEl && e.detail.legacyDateStr) {
            const monthMap = { "JAN": "JANUARY", "FEB": "FEBRUARY", "MAR": "MARCH", "APR": "APRIL", "MAY": "MAY", "JUN": "JUNE", "JUL": "JULY", "AUG": "AUGUST", "SEP": "SEPTEMBER", "OCT": "OCTOBER", "NOV": "NOVEMBER", "DEC": "DECEMBER" };
            let rawDate = e.detail.legacyDateStr.toUpperCase();
            let parts = rawDate.replace(',', '').split(' ');
            if (parts.length >= 3) {
                let fullMonth = monthMap[parts[0]] || parts[0];
                legDateEl.innerHTML = `
                    <div style="font-size:1.0rem; color:var(--theme-main, #00f0ff); font-weight:bold; text-shadow:0 0 10px var(--theme-dim, rgba(0,240,255,0.2));">${fullMonth} ${parts[1]}</div>
                    <div style="font-size:0.75rem; color:var(--theme-main, #00f0ff); font-weight:bold; opacity:0.8; margin-top:2px;">${parts[2]}</div>
                `;
            } else {
                legDateEl.innerHTML = `<span style="color:var(--theme-main, #00f0ff); font-weight:bold; text-shadow:0 0 10px var(--theme-dim, rgba(0,240,255,0.2));">${rawDate}</span>`;
            }
        }

        const legTimeEl = document.getElementById('leg-time');
        if (legTimeEl) {
            let timeParts = e.detail.legacyTimeStr.match(/([0-9:]+)\s*(.*)/);
            if (timeParts) {
                legTimeEl.innerHTML = `
                    <div style="font-size:0.95rem; color:var(--theme-main, #00f0ff); font-weight:bold; text-shadow:0 0 10px var(--theme-dim, rgba(0,240,255,0.2));">${timeParts[1]}</div>
                    <div style="font-size:0.5rem; color:var(--starlight); font-weight:bold; margin-top:2px; letter-spacing:1px;">${timeParts[2]}</div>
                `;
            } else {
                legTimeEl.innerHTML = formatDualColorWing(e.detail.legacyTimeStr);
            }
        }
        
        let activeBlock = window.getQBlockByTime ? window.getQBlockByTime(e.detail.t) : null;
        const qCoordWing = document.getElementById('q-coord-wing');
        
        if (qCoordWing) {
            let anchorName = (activeBlock && activeBlock.type === 'ANCHOR') ? translateAnchor(activeBlock.name) : "";
            
            let baseCoord = `<span style="color:var(--starlight); font-family:'Orbitron'; font-size:0.5rem; margin-right:1px;">QC</span><span style="color:var(--theme-main, #00f0ff); font-size:0.95rem; font-weight:bold;">${activeBlock ? activeBlock.cycle : 0}</span>` +
                            `<span style="color:var(--starlight); font-family:'Orbitron'; font-size:0.5rem; margin-left:4px; margin-right:1px;">Q</span><span style="color:var(--theme-main, #00f0ff); font-size:0.95rem; font-weight:bold;">${e.detail.qData.quad}</span>` +
                            `<span style="color:var(--starlight); font-family:'Orbitron'; font-size:0.5rem; margin-left:4px; margin-right:1px;">S</span><span style="color:var(--theme-main, #00f0ff); font-size:0.95rem; font-weight:bold;">${e.detail.qData.sect}</span>` +
                            `<span style="color:var(--starlight); font-family:'Orbitron'; font-size:0.5rem; margin-left:4px; margin-right:2px;">DEG</span><span style="color:var(--theme-main, #00f0ff); font-size:0.95rem; font-weight:bold;">${e.detail.qData.day}</span>`;

            if (anchorName && anchorName !== 'PURGE') {
                qCoordWing.innerHTML = `<div style="font-size:0.55rem; color:var(--chrono-amber); font-weight:bold; letter-spacing:1px; margin-bottom:2px;">[ ${anchorName} ]</div>` + baseCoord;
            } else {
                qCoordWing.innerHTML = baseCoord;
            }
        }

        // --- BARYCENTRIC HEX STRING DOM KINETICS ---
        const pRest = document.getElementById('p-rest');
        const pExp = document.getElementById('p-exp');
        if (pRest && pExp && e.detail.qData) {
            const p = e.detail.qData.trueArc || 0;
            pRest.innerHTML = `<span style="color:var(--starlight); font-size:0.5rem;">P:</span> <span style="color:var(--theme-main, #00f0ff);">${p.toFixed(6)}°</span>`;
            pExp.innerHTML = `<div class="exp-view"><div style="color:var(--starlight); margin-bottom: 2px;">[P] PLANETARY ORBIT (TRUE ELLIPSE):</div><div style="color:var(--theme-main, #00f0ff); font-size: 0.6rem;">${p.toFixed(10)}°</div></div>`;
        }

        const gRest = document.getElementById('g-rest');
        const sRest = document.getElementById('s-rest');
        if (gRest && sRest && deepTimeOverlay && e.detail.qData) {
            const g = e.detail.qData.galactic || 0;
            const s = e.detail.qData.stellar || 0;
            gRest.innerHTML = `<span style="color:var(--starlight); font-size:0.5rem;">G:</span> ${Math.floor(g).toString().padStart(3,'0')}°`;
            sRest.innerHTML = `<span style="color:var(--starlight); font-size:0.5rem;">S:</span> ${Math.floor(s).toString().padStart(3,'0')}°`;
            
            deepTimeOverlay.innerHTML = `
                <div class="exp-view">
                    <div style="color:var(--starlight); margin-bottom:4px;">[G] KINEMATIC AZIMUTH (CMB):<br><span style="color:var(--theme-main, #00f0ff); font-size: 0.55rem;">${g.toFixed(10)}°</span></div>
                    <div style="color:var(--starlight);">[S] STELLAR ORBIT (LSR):<br><span style="color:var(--theme-main, #00f0ff); font-size: 0.55rem;">${s.toFixed(10)}°</span></div>
                </div>
            `;
        }

        // --- AXIAL FRICTION KINETICS (RADIAL INDEX) ---
        const solarNode = document.getElementById('node-solar');
        const siderealNode = document.getElementById('node-sidereal');
        const frictionArc = document.getElementById('friction-arc');
        const fGrad = document.getElementById('friction-grad');
        
        if(solarNode && siderealNode && frictionArc && window.ANCHOR_ALPHA_DYNAMIC) {
            const dObj = new Date(e.detail.t);
            const msSinceMidnight = (dObj.getUTCHours() * 3600000) + (dObj.getUTCMinutes() * 60000) + (dObj.getUTCSeconds() * 1000) + dObj.getUTCMilliseconds();
            
            const solarDeg = (msSinceMidnight / 86400000) * 360;

            const elapsedMs = e.detail.t - window.ANCHOR_ALPHA_DYNAMIC;
            const driftDeg = (elapsedMs / 31556925216) * 360; 
            
            let siderealDeg = (solarDeg + driftDeg) % 360;
            if (siderealDeg < 0) siderealDeg += 360;

            const radius = 25;
            function p2c(cx, cy, r, a) {
                const rad = (a - 90) * Math.PI / 180.0;
                return { x: cx + (r * Math.cos(rad)), y: cy + (r * Math.sin(rad)) };
            }

            const solPos = p2c(0, 0, radius, solarDeg);
            const sidPos = p2c(0, 0, radius, siderealDeg);

            solarNode.setAttribute('cx', solPos.x);
            solarNode.setAttribute('cy', solPos.y);
            siderealNode.setAttribute('cx', sidPos.x);
            siderealNode.setAttribute('cy', sidPos.y);

            let diff = siderealDeg - solarDeg;
            if (diff < 0) diff += 360;
            
            const largeArcFlag = diff <= 180 ? "0" : "1";
            
            const arcPath = [
                "M", solPos.x, solPos.y, 
                "A", radius, radius, 0, largeArcFlag, 1, sidPos.x, sidPos.y
            ].join(" ");
            
            frictionArc.setAttribute('d', arcPath);

            if (fGrad) {
                fGrad.setAttribute('x1', (50 + 50 * Math.cos((solarDeg - 90)*Math.PI/180)) + '%');
                fGrad.setAttribute('y1', (50 + 50 * Math.sin((solarDeg - 90)*Math.PI/180)) + '%');
                fGrad.setAttribute('x2', (50 + 50 * Math.cos((siderealDeg - 90)*Math.PI/180)) + '%');
                fGrad.setAttribute('y2', (50 + 50 * Math.sin((siderealDeg - 90)*Math.PI/180)) + '%');
            }
        }

        // --- THE ANTICIPATION ODOMETERS ---
        const legacyFooter = document.getElementById('legacy-footer-text');
        const quadFooter = document.getElementById('quad-footer-text');

        if (legacyFooter && quadFooter && window.ANCHOR_ALPHA_DYNAMIC && e.detail.qData) {
            
            // Quad OS Spatial Horizon
            const p = e.detail.qData.trueArc || 0;
            let nextNodeDeg = Math.floor(p / 90) * 90 + 90;
            let deltaDeg = nextNodeDeg - p;
            let nextNodeName = (nextNodeDeg === 90) ? '1ST EQUINOX' : (nextNodeDeg === 180) ? 'NORTHERN SOLSTICE' : (nextNodeDeg === 270) ? '2ND EQUINOX' : 'SOUTHERN SOLSTICE';
            
            quadFooter.innerHTML = `<span style="color:var(--starlight);">NEXT: ${nextNodeName}</span> <span style="color:var(--theme-main, #00f0ff); font-weight:bold;">[ Δ -${deltaDeg.toFixed(4)}° ]</span>`;

            // Legacy OS Temporal Countdown (Keplerian Sync)
            const remMs = e.detail.nextCelestialEvent - e.detail.t;
            if (remMs > 0) {
                const totalHours = Math.floor(remMs / 3600000);
                const dRem = Math.floor(remMs / 86400000);
                const hRem = Math.floor((remMs % 86400000) / 3600000);
                const mRem = Math.floor((remMs % 3600000) / 60000);
                const sRem = Math.floor((remMs % 60000) / 1000);

                let timeStr = "";
                if (totalHours < 48) {
                    timeStr = totalHours.toString().padStart(2, '0') + ":" + 
                              mRem.toString().padStart(2, '0') + ":" + 
                              sRem.toString().padStart(2, '0');
                } else {
                    timeStr = dRem + "D " + 
                              hRem.toString().padStart(2, '0') + ":" + 
                              mRem.toString().padStart(2, '0') + ":" + 
                              sRem.toString().padStart(2, '0');
                }

                let warnTag = e.detail.isPredictiveEphemeris ? `<span style="color:#ff003c; margin-right:4px;">[PRD]</span>` : '';
                legacyFooter.innerHTML = `${warnTag}<span style="color:var(--starlight);">T-MINUS</span> <span style="color:var(--theme-main, #00f0ff); font-weight:bold;">${timeStr}</span>`;
            } else {
                legacyFooter.innerHTML = `<span style="color:var(--starlight);">STATUS:</span> <span style="color:var(--theme-main, #00f0ff); font-weight:bold;">PULSE ACTIVE</span>`;
            }
        }
    });

    window.dispatchEvent(new Event('q-ui-mounted'));
};

// --- MOBILE IRIS TOGGLE LOGIC ---
window.addEventListener('click', (e) => {
    if (window.innerWidth <= 950 && document.body.classList.contains('q-aperture-home')) {
        const dial = e.target.closest('.q-center-dial');
        const panel = e.target.closest('.corner-panel');
        
        if (dial) {
            if (document.body.classList.contains('mobile-panels-revealed')) {
                document.body.classList.remove('mobile-panels-revealed');
            } else {
                document.body.classList.add('mobile-panels-revealed');
            }
        } else if (!panel && document.body.classList.contains('mobile-panels-revealed')) {
            document.body.classList.remove('mobile-panels-revealed');
        }
    }
});

// Global Tax Day Deselection Interceptor
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

// --- GLOBAL ROUTING INTERCEPTOR ---
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
    
    // CRITICAL FIX 4: Telemetry Viewport injected into safe wrapper flag, dodging index.html purge
    const container = document.getElementById('q-ui-injected-flag') || document.body;
    
    if (isOpen) {
        if (!viewport) { 
            viewport = document.createElement('div'); 
            viewport.id = 'mobile-telemetry-viewport'; 
            container.appendChild(viewport); 
        }
        viewport.style.display = 'flex';
        document.querySelectorAll('.telemetry-node').forEach(node => {
            if (!node.classList.contains('q-control-strip') && !node.classList.contains('q-nav-bar') && !node.classList.contains('wing-panel')) {
                viewport.appendChild(node);
            }
        });
    } else {
        if (viewport) { 
            Array.from(viewport.childNodes).forEach(node => {
                document.body.appendChild(node);
            }); 
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
                let currentDay = Math.floor(daysElapsed);
                let sMax = parseInt(scrubber.max);
                let sMin = parseInt(scrubber.min);
                if (currentDay >= sMax - 90) scrubber.max = currentDay + 365;
                if (currentDay <= sMin + 90) scrubber.min = currentDay - 365;
                scrubber.value = currentDay;
            }
        }
    });
};

window.scrubTime = function(val) {
    if(!window.getSimState || !window.ANCHOR_ALPHA_DYNAMIC) return;
    const targetDays = parseInt(val, 10);
    
    // Get the real-world current time to use as our unbreakable time-of-day anchor
    const liveDate = new Date();
    const liveMsSinceMidnight = (liveDate.getUTCHours() * 3600000) + 
                                (liveDate.getUTCMinutes() * 60000) + 
                                (liveDate.getUTCSeconds() * 1000) + 
                                liveDate.getUTCMilliseconds();
    
    // targetDays is now the absolute offset from the Dynamic Anchor
    const targetMs = window.ANCHOR_ALPHA_DYNAMIC + (targetDays * 86400000);
    const dTarget = new Date(targetMs);
    dTarget.setUTCHours(0, 0, 0, 0);
    
    // Add the real-world time of day back in to freeze the Solar Node in place
    const finalMs = dTarget.getTime() + liveMsSinceMidnight;
    
    window.updateMasterClock(false, finalMs);
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
        let currentDay = Math.floor(daysElapsed);
        let sMax = parseInt(scrubber.max);
        let sMin = parseInt(scrubber.min);
        if (currentDay >= sMax - 90) scrubber.max = currentDay + 365;
        if (currentDay <= sMin + 90) scrubber.min = currentDay - 365;
        scrubber.value = currentDay;
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