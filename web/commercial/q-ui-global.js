// THE QUADRATURE: COMMERCIAL UI MATRIX & ENTERPRISE RENDERER
// Architect: Kelby | Engineer: Kairos
// STATUS: Phase V Enterprise Bifurcation. Mobile Scrubber & Mic HUD brackets restored.

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
    
    // --- STRICT FULL-FILENAME ROUTING (Zero Collision) ---
    const pathStr = window.location.pathname.toUpperCase();
    const filename = pathStr.split('/').pop() || "INDEX.HTML";
    
    const bActive = filename.includes("COMBIOVECHUD");
    const eActive = filename.includes("COMENVVECHUD");
    const mActive = filename.includes("COMMECVECHUD");
    const cActive = filename.includes("COMCOMVECHUD");
    const faceActive = filename.includes("INDEX");
    
    if (faceActive) document.body.classList.add('q-chrono-face');
    else document.body.classList.add('q-vector-hud');
    
    // Strict Monochrome Corporate Aesthetic
    let headerText = "COMMERCIAL QUAD";
    let accentColor = "#ffffff"; // Forced White

    if (bActive) headerText = "WORKFORCE RESONANCE";
    else if (eActive) headerText = "MACRO-INFRASTRUCTURE";
    else if (mActive) headerText = "YIELD METROLOGY";
    else if (cActive) headerText = "LOGISTICS & LEDGER";

    const authState = localStorage.getItem('Q_SOVEREIGN_AUTH') === 'true' ? 'ACTIVE' : 'STANDBY';
    const authBg = authState === 'ACTIVE' ? '#ffffff' : 'transparent';
    const authColor = authState === 'ACTIVE' ? '#000000' : '#888888';
    const authBorder = authState === 'ACTIVE' ? '#ffffff' : '#888888';
    const authText = authState === 'ACTIVE' ? '[ SECURE TENANT ]' : '[ UNAUTHENTICATED ]';

    const style = document.createElement('style');
    style.innerHTML = `
        /* IRONCLAD VIEWPORT RECOVERY */
        html, body { 
            position: fixed !important; top: 0px !important; left: 0px !important; right: 0px !important; bottom: 0px !important; 
            width: 100vw !important; height: var(--app-height, 100vh) !important; 
            margin: 0px !important; padding: 0px !important; 
            overflow: hidden !important; touch-action: none !important; overscroll-behavior: none !important; transform: none !important; 
            background-color: #030303; 
        }
        #mobile-telemetry-btn { display: none !important; pointer-events: none !important; }

        :root { 
            --wing-w: 240px; --mod-w: 320px; --dial-size: 60vh; --wing-offset: calc((var(--dial-size) / 2) + 4vw); 
            --white-pure: #ffffff; 
            --starlight: rgba(255, 255, 255, 0.5); --platinum: #cccccc; 
            --q-metal: #888888;
            --center-gap-x: 36vh; 
            --corner-gap-y: 21vh; 
            --corner-gap-x: 32vh;
            --panel-w: 460px;
            --panel-h: 170px;
        }
        
        .global-header {
            position: absolute; top: 4vh; left: 0; width: 100vw;
            display: flex; justify-content: center; align-items: center; text-align: center;
            font-family: 'JetBrains Mono', monospace; font-weight: 900; font-size: 2.5rem; letter-spacing: 12px; padding-left: 12px;
            color: ${accentColor}; z-index: 50; pointer-events: none;
            text-transform: uppercase;
            text-shadow: 0 0 10px rgba(255,255,255,0.1);
        }

        /* DYNAMIC PCB NETWORK INFRASTRUCTURE */
        .pcb-grid {
            position: fixed; inset: 0; z-index: 0;
            background-color: #030303;
            background-image: 
                linear-gradient(rgba(255,255,255,0.04) 1px, transparent 1px),
                linear-gradient(90deg, rgba(255,255,255,0.04) 1px, transparent 1px);
            background-size: 50px 50px;
        }
        
        .pcb-svg {
            position: fixed; top: 0; left: 0; width: 100vw; height: 100vh;
            z-index: 1; pointer-events: none; opacity: 0.85;
        }

        /* STRICT CORPORATE BORDERS - IMAGE FRAMES PURGED */
        .panel-bg, .wing-bg { display: none !important; }
        
        .corner-panel { position: absolute; width: var(--panel-w); height: var(--panel-h); z-index: 20; cursor: pointer; transition: transform 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275); }
        .corner-panel:hover { transform: translate(var(--tx-hover), var(--ty-hover)) scale(1.02); }

        .frost-zone { position: absolute; inset: 6px 12px; background: rgba(5, 5, 5, 0.85); backdrop-filter: blur(12px); border-radius: 4px; border: 1px solid #333; z-index: -2; transition: 0.3s ease; box-shadow: inset 0 0 20px rgba(0,0,0,0.8); }
        .corner-panel:hover .frost-zone { border-color: ${accentColor}; box-shadow: 0 0 15px rgba(255,255,255,0.05), inset 0 0 20px rgba(0,0,0,0.8); }

        .tl { bottom: calc(50% + var(--corner-gap-y)); right: calc(50% + var(--corner-gap-x)); --tx-hover: -2px; --ty-hover: -2px;}
        .tr { bottom: calc(50% + var(--corner-gap-y)); left: calc(50% + var(--corner-gap-x)); --tx-hover: 2px; --ty-hover: -2px;}
        .bl { top: calc(50% + var(--corner-gap-y)); right: calc(50% + var(--corner-gap-x)); --tx-hover: -2px; --ty-hover: 2px;}
        .br { top: calc(50% + var(--corner-gap-y)); left: calc(50% + var(--corner-gap-x)); --tx-hover: 2px; --ty-hover: 2px;}

        .panel-label { display: none; }

        .panel-data-container {
            height: 100%; width: 100%; display: flex; flex-direction: column; align-items: stretch; justify-content: center; text-align: left;
            position: relative; z-index: 2; box-sizing: border-box; padding: 20px 30px;
        }

        .opt-oval { position: absolute; font-family: 'JetBrains Mono'; font-size: 0.55rem; font-weight: 700; letter-spacing: 1px; display: flex; justify-content: center; align-items: center; cursor: pointer; z-index: 30; transition: 0.3s; top: 15px; right: 25px; color: #888; }
        .opt-oval:hover { color: ${accentColor}; text-shadow: 0 0 8px ${accentColor}; }

        /* CORPORATE OS WING PANELS */
        .wing-panel { position: absolute; width: 240px; height: 250px; z-index: 15; box-sizing: border-box; top: 50%; transform: translateY(-50%); text-align: center; }
        .wing-frost { position: absolute; inset: 12px; background: rgba(10, 10, 10, 0.9); border: 1px solid #333; backdrop-filter: blur(14px); border-radius: 4px; z-index: -2; box-shadow: 0 10px 30px rgba(0,0,0,0.8); }

        .wing-l { right: calc(50% + var(--center-gap-x)); }
        .wing-r { left: calc(50% + var(--center-gap-x)); }
        
        .wing-header { position: absolute; top: 25px; left: 0; width: 100%; z-index: 10; display: flex; justify-content: center; }
        .wing-data-center { display: flex; flex-direction: column; justify-content: center; align-items: center; text-align: center; height: 100%; width: 100%; padding: 40px 0; box-sizing: border-box; position: relative; z-index: 10; }
        .wing-footer { position: absolute; bottom: 20px; left: 0; width: 100%; z-index: 10; display: flex; justify-content: center; }

        .w-head { font-family: 'JetBrains Mono'; font-weight: 700; font-size: 0.85rem; letter-spacing: 3px; color: #888; border-bottom: 1px solid #333; padding-bottom: 4px; display: inline-block; z-index: 20; text-align: center; }
        .w-lbl { font-family: 'JetBrains Mono'; font-size: 0.55rem; color: #666; letter-spacing: 1px; text-transform: uppercase; margin-bottom: 2px; z-index: 20; text-align: center; }
        .val-lg { font-family: 'Orbitron'; font-size: 1.2rem; font-weight: 700; letter-spacing: 1px; white-space: nowrap; color: #fff; z-index: 20; text-align: center; }
        .fmt-toggle { font-family: 'JetBrains Mono'; font-weight: bold; font-size: 0.5rem; color: #ccc; cursor: pointer; border: 1px solid #555; padding: 2px 8px; border-radius: 2px; background: #111; pointer-events: auto; transition: 0.3s; white-space: nowrap; text-align: center; }
        .fmt-toggle:hover { background: #fff; color: #000; border-color: #fff; }

        /* --- NAVBAR (Monochrome Active States) --- */
        .q-nav-bar { 
            position: fixed !important; 
            display: flex !important;
            visibility: visible !important;
            opacity: 1 !important;
            bottom: 2.5vh; left: 50%; transform: translateX(-50%); width: max-content; padding: 0 20px; border: 1px solid #333; border-radius: 4px; box-shadow: 0 10px 30px rgba(0,0,0,0.9);
            height: 45px; background: rgba(10, 10, 10, 0.95); 
            justify-content: center; align-items: center; box-sizing: border-box; z-index: 100000; font-family: 'Orbitron'; pointer-events: auto !important; 
        }
        
        .q-nav-menu { display: flex; align-items: center; gap: 0.8vw; pointer-events: auto !important; width: 100%; justify-content: center; }
        .q-nav-btn { background: transparent; border: 1px solid #333; color: #888; padding: 6px 12px; border-radius: 2px; font-family: 'Orbitron'; font-size: 0.6rem; font-weight: bold; cursor: pointer; transition: 0.3s; letter-spacing: 1px; text-decoration: none; display: inline-block; text-align: center; pointer-events: auto !important; white-space: nowrap; }
        .q-nav-btn:hover { border-color: #fff; color: #fff; }
        
        .q-nav-btn.sim-badge { border-color: ${authBorder} !important; color: ${authColor} !important; background: ${authBg} !important; }
        
        /* Force strictly white for all active vector states */
        .q-nav-btn.face-btn.active,
        .q-nav-btn.bio-btn.active,
        .q-nav-btn.com-btn.active,
        .q-nav-btn.env-btn.active,
        .q-nav-btn.mec-btn.active { 
            border-color: #fff !important; color: #fff !important; background: rgba(255,255,255,0.1) !important; box-shadow: none !important;
        }

        #q-mic-fab-desktop { position: fixed; bottom: 20px; right: 20px; width: 50px; height: 50px; border-radius: 4px; background: #0a0a0a; border: 1px solid #555; color: #fff; display: flex; justify-content: center; align-items: center; z-index: 100000; box-shadow: 0 5px 15px rgba(0,0,0,0.9); cursor: pointer; font-size: 1.2rem; transition: all 0.3s ease; pointer-events: auto !important; }
        #q-mic-fab-desktop:hover { background: #fff; color: #000; }
        
        .q-global-controls { position: fixed; bottom: calc(2.5vh + 60px); left: 50%; transform: translateX(-50%); z-index: 9995; display: flex; align-items: center; gap: 12px; background: rgba(10, 10, 10, 0.95); backdrop-filter: blur(20px); border-radius: 4px; padding: 10px 25px; justify-content: space-between; box-shadow: 0 10px 40px rgba(0,0,0,0.9); border: 1px solid #333; pointer-events: auto; }
        .q-ctrl-btn { background: transparent; border: 1px solid #555; color: #ccc; padding: 8px 14px; cursor: pointer; font-family: 'Orbitron'; font-size: 0.65rem; font-weight: 700; border-radius: 2px; transition: 0.3s; letter-spacing: 1px; white-space: nowrap; pointer-events: auto; }
        .q-ctrl-btn:hover { background: #fff; color: #000; }
        .q-ctrl-btn.active { background: #fff; color: #000; border-color: #fff; }
        .q-scrubber { flex-grow: 1; min-width: 250px; accent-color: #fff; cursor: pointer; height: 2px; -webkit-appearance: none; margin: 0 10px; background: #333; pointer-events: auto; }
        .q-scrubber::-webkit-slider-thumb { -webkit-appearance: none; height: 16px; width: 8px; background: #fff; cursor: grab; pointer-events: auto; border-radius: 1px; }

        .desktop-only { display: flex !important; }
        .mobile-only-flex { display: none !important; }

        /* --- MOBILE VIEWPORT & HUD OVERRIDES --- */
        @media (max-width: 950px) {
            :root { --dial-size: min(48vh, 85vw) !important; } 
            .desktop-only { display: none !important; }
            .mobile-only-flex { display: flex !important; }
            
            body:not(.telemetry-open) .telemetry-node { display: none !important; visibility: hidden !important; }
            body:not(.telemetry-open) .wing-panel { display: none !important; }
            body:not(.telemetry-open) .corner-panel { display: none !important; }
            
            .q-nav-bar { 
                top: 0px !important; margin-top: 0px !important; left: 0px !important; padding: 0 10px !important; 
                height: 50px !important; width: 100vw !important; transform: none !important; border-radius: 0 !important; 
                background: #050505 !important; border: none !important; border-bottom: 1px solid #333 !important; box-shadow: none !important; pointer-events: auto !important; 
            }
            .q-nav-menu .vector-link { display: none !important; } 
            
            #q-global-sim-badge { font-size: 0.45rem !important; padding: 4px 8px !important; margin-left: 0 !important; white-space: nowrap; flex-shrink: 0; position: relative; z-index: 100000; pointer-events: auto !important; }
            
            .q-nav-menu { position: static; flex-direction: row; overflow-x: auto; white-space: nowrap; background: transparent; box-shadow: none; transform: none; width: auto; border: none; gap: 5px; justify-content: flex-start; }
            
            .q-center-dial { margin-top: -3vh !important; }
            
            .q-control-strip { position: fixed; bottom: 0 !important; left: 0; width: 100%; background: #0a0a0a; border-top: 1px solid #333; display: flex; justify-content: space-around; align-items: center; z-index: 100000; height: 65px !important; box-shadow: 0 -10px 30px rgba(0,0,0,0.9); pointer-events: auto !important; }
            .strip-btn { background: transparent; border: none; color: #888; display: flex; flex-direction: column; align-items: center; gap: 4px; cursor: pointer; text-decoration: none; padding: 5px; pointer-events: auto !important; }
            
            /* Monochrome Mobile Control Strip */
            .strip-btn.face-strip.active svg,
            .strip-btn.bio-strip.active svg,
            .strip-btn.com-strip.active svg,
            .strip-btn.env-strip.active svg,
            .strip-btn.mec-strip.active svg { color: #fff !important; filter: drop-shadow(0 0 8px rgba(255,255,255,0.3)) !important; }
            
            .strip-btn.face-strip.active .strip-lbl,
            .strip-btn.bio-strip.active .strip-lbl,
            .strip-btn.com-strip.active .strip-lbl,
            .strip-btn.env-strip.active .strip-lbl,
            .strip-btn.mec-strip.active .strip-lbl { color: #fff !important; }

            .strip-lbl { font-family: 'Orbitron'; font-size: 0.4rem; font-weight: 900; letter-spacing: 1px; color: #666; transition: 0.3s; }
            
            #mobile-telemetry-ribbon { display: flex !important; position: fixed; top: 50px !important; left: 0px !important; height: 45px !important; width: 100vw !important; background: #0a0a0a; border-bottom: 1px solid #333; z-index: 99998 !important; justify-content: space-between; align-items: center; padding: 0 10px !important; box-sizing: border-box; }
            #ribbon-leg-date { white-space: nowrap; font-size: 0.6rem !important; }
            #ribbon-leg { white-space: nowrap; font-size: 0.65rem !important; color: #fff !important; }

            #mobile-telemetry-viewport { display: none; position: fixed !important; top: 95px !important; bottom: 65px !important; height: auto !important; left: 0; width: 100vw; background: rgba(5,5,5,0.95); z-index: 99900; overflow-y: scroll !important; overflow-x: hidden !important; flex-direction: column; align-items: center; justify-content: flex-start; padding-top: 15px !important; padding-bottom: 20px !important; box-sizing: border-box !important; gap: 15px; pointer-events: auto !important; }
            #mobile-telemetry-viewport .telemetry-node { display: flex !important; position: relative !important; width: 95vw !important; max-width: 360px !important; height: auto !important; margin: 0 !important; transform: none !important; }
            #mobile-telemetry-viewport .wing-panel { display: none !important; }
            
            #mobile-telemetry-viewport .corner-panel { min-height: 120px !important; padding: 20px !important; }
            #mobile-telemetry-viewport .frost-zone { inset: 0 !important; border: 1px solid #333 !important; }
            #mobile-telemetry-viewport .panel-data-container { padding: 0 !important; margin-top: 10px !important; align-items: center !important; text-align: center !important; }
            #mobile-telemetry-viewport .opt-oval { top: 15px !important; right: 15px !important; }
            
            body.telemetry-open .q-center-dial { display: none !important; }
            
            /* --- RESTORED MOBILE FLEX BRACKETING --- */
            .q-global-controls { 
                display: flex !important; 
                align-items: center !important; 
                justify-content: space-between !important;
                width: 95vw !important; 
                box-sizing: border-box !important; 
                padding: 6px 8px !important; 
                gap: 4px !important;
                bottom: calc(2.5vh + 65px) !important;
                background: #0a0a0a !important; 
                border: 1px solid #333 !important; 
            } 
            
            #q-mic-fab { 
                position: static !important; 
                transform: none !important;
                width: 32px !important; 
                height: 32px !important; 
                border-radius: 4px !important; 
                font-size: 1rem !important; 
                order: 1 !important; 
                flex-shrink: 0 !important;
                background: #111; 
                border: 1px solid #555; 
                color: #fff; 
                display: flex; justify-content: center; align-items: center; 
                cursor: pointer; pointer-events: auto !important; 
            }
            #q-mic-fab.listening { background: #fff; color: #000; }
            
            /* The < button */
            .q-global-controls > .q-ctrl-btn:nth-child(1) { order: 2 !important; padding: 0 8px !important; height: 32px !important; min-width: 24px !important; flex-shrink: 0; }
            
            .q-scrubber { 
                order: 3 !important; 
                min-width: 0 !important; 
                width: 100% !important; 
                margin: 0 !important; 
                flex-grow: 1 !important;
            }
            
            /* The > button */
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

    // Global injection of the 4 OPT panels ONLY on faceActive to prevent collision
    let panelsHTML = "";
    if (faceActive) {
        panelsHTML = `
            <div class="corner-panel tl telemetry-node desktop-only">
                <div class="frost-zone"></div>
                <div class="opt-oval" onclick="if(window.openSlotRoutingModal) window.openSlotRoutingModal('BIO')">OPT</div>
                <div class="panel-data-container" id="quad-BIO"></div>
            </div>
            <div class="corner-panel tr telemetry-node desktop-only">
                <div class="frost-zone"></div>
                <div class="opt-oval" onclick="if(window.openSlotRoutingModal) window.openSlotRoutingModal('COM')">OPT</div>
                <div class="panel-data-container" id="quad-COM"></div>
            </div>
            <div class="corner-panel bl telemetry-node desktop-only">
                <div class="frost-zone"></div>
                <div class="opt-oval" onclick="if(window.openSlotRoutingModal) window.openSlotRoutingModal('ENV')">OPT</div>
                <div class="panel-data-container" id="quad-ENV"></div>
            </div>
            <div class="corner-panel br telemetry-node desktop-only">
                <div class="frost-zone"></div>
                <div class="opt-oval" onclick="if(window.openSlotRoutingModal) window.openSlotRoutingModal('MEC')">OPT</div>
                <div class="panel-data-container" id="quad-MEC"></div>
            </div>
        `;
    }

    uiContainer.innerHTML = `
        <div class="pcb-grid"></div>
        
        <svg class="pcb-svg" viewBox="0 0 1000 1000" preserveAspectRatio="xMidYMid slice">
            <g class="base-traces" fill="none" stroke="#333333" stroke-width="2">
                <path d="M 400 470 L 300 470" />
                <path d="M 400 490 L 300 490" />
                <path d="M 400 510 L 300 510" />
                <path d="M 400 530 L 300 530" />
                <path d="M 600 470 L 700 470" />
                <path d="M 600 490 L 700 490" />
                <path d="M 600 510 L 700 510" />
                <path d="M 600 530 L 700 530" />
                
                <path d="M 200 470 L 170 470 L 170 300" />
                <path d="M 200 490 L 185 490 L 185 300" />
                <path d="M 200 510 L 185 510 L 185 700" />
                <path d="M 200 530 L 170 530 L 170 700" />

                <path d="M 800 470 L 830 470 L 830 300" />
                <path d="M 800 490 L 815 490 L 815 300" />
                <path d="M 800 510 L 815 510 L 815 700" />
                <path d="M 800 530 L 830 530 L 830 700" />

                <path d="M 100 200 L -50 200" />
                <path d="M 100 220 L 70 220 L 70 280 L -50 280" />
                <path d="M 100 240 L 40 240 L 40 360 L -50 360" />

                <path d="M 100 800 L -50 800" />
                <path d="M 100 780 L 70 780 L 70 720 L -50 720" />
                <path d="M 100 760 L 40 760 L 40 640 L -50 640" />

                <path d="M 900 200 L 1050 200" />
                <path d="M 900 220 L 930 220 L 930 280 L 1050 280" />
                <path d="M 900 240 L 960 240 L 960 360 L 1050 360" />

                <path d="M 900 800 L 1050 800" />
                <path d="M 900 780 L 930 780 L 930 720 L 1050 720" />
                <path d="M 900 760 L 960 760 L 960 640 L 1050 640" />
            </g>
        </svg>

        <div class="global-header desktop-only">${headerText}</div>

        <div class="q-nav-bar">
            <div style="display:flex; width: 100%; justify-content: center; align-items: center;">
                <div class="q-nav-menu" id="q-nav-menu">
                    <a href="../aperture/index.html" class="q-nav-btn aperture-btn" style="border-color: #ffffff; color: #ffffff;" onclick="window.location.href=this.href; return false;">APERTURE</a>
                    <button id="q-global-sim-badge" class="q-nav-btn sim-badge" style="border-color:${authBorder} !important; color:${authColor} !important; background:${authBg} !important;" onclick="window.triggerDomainShift(event)">${authText}</button>
                    <a href="./index.html" class="q-nav-btn face-btn vector-link ${faceActive ? 'active' : ''}" ontouchstart="window.location.href=this.href; event.preventDefault();">CHRONO-FACE</a>
                    <a href="./COMBIOVECHUD.html" class="q-nav-btn bio-btn vector-link ${bActive ? 'active' : ''}" ontouchstart="window.location.href=this.href; event.preventDefault();">WORKFORCE</a>
                    <a href="./COMCOMVECHUD.html" class="q-nav-btn com-btn vector-link ${cActive ? 'active' : ''}" ontouchstart="window.location.href=this.href; event.preventDefault();">LEDGER</a>
                    <a href="./COMENVVECHUD.html" class="q-nav-btn env-btn vector-link ${eActive ? 'active' : ''}" ontouchstart="window.location.href=this.href; event.preventDefault();">INFRA</a>
                    <a href="./COMMECVECHUD.html" class="q-nav-btn mec-btn vector-link ${mActive ? 'active' : ''}" ontouchstart="window.location.href=this.href; event.preventDefault();">YIELD</a>
                    <button class="q-nav-btn omni desktop-only" onclick="if(typeof window.Q_OmniPlanner !== 'undefined') window.Q_OmniPlanner.openPlanner()">[ OMNI-PLANNER ]</button>
                    <button class="q-nav-btn special desktop-only" onclick="if(typeof window.Q_IntegrationHub !== 'undefined') window.Q_IntegrationHub.openHub()">[ DASHBOARD ]</button>
                </div>
            </div>
            <button class="mobile-only-flex" style="background:transparent; border:none; color:#fff; font-size:1.5rem; padding:0; margin:0; position:absolute; right:15px; cursor:pointer;" onclick="if(typeof window.Q_IntegrationHub !== 'undefined') window.Q_IntegrationHub.openHub()">☰</button>
        </div>

        <div id="mobile-telemetry-ribbon" class="mobile-only-flex">
            <span id="ribbon-leg-date" style="font-family:'JetBrains Mono'; font-size:0.65rem; color:var(--starlight); font-weight:bold; letter-spacing:1px; white-space:nowrap;">--</span>
            <div style="display:flex; align-items:center; gap: 4px;">
                <span class="val-gold" id="ribbon-leg" style="color:#ffffff; font-family:'JetBrains Mono'; font-size:0.65rem; font-weight:bold; margin-top:2px; white-space:nowrap;">--</span>
                <div class="fmt-toggle" onclick="window.toggleTimeFmt('ribbon-fmt')" id="ribbon-fmt" style="border-color:#555; color:#ccc; padding:2px 6px; font-size:0.5rem; pointer-events:auto; position:relative; z-index:100000; white-space:nowrap;">UTC</div>
            </div>
        </div>

        <div class="q-control-strip mobile-only-flex">
            <button class="strip-btn" onclick="if(typeof window.toggleTelemetry === 'function') window.toggleTelemetry()">
                <svg id="tele-icon" viewBox="0 0 24 24" width="22" height="22" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" fill="none"><path d="M18 20V10M12 20V4M6 20v-6"/></svg>
                <span class="strip-lbl">DATA</span>
            </button>
            <a href="./COMBIOVECHUD.html" class="strip-btn bio-strip ${bActive ? 'active' : ''}" onclick="window.location.href=this.href; return false;">
                <svg viewBox="0 0 24 24" width="22" height="22" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" fill="none"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/></svg>
                <span class="strip-lbl">WORK</span>
            </a>
            <a href="./COMCOMVECHUD.html" class="strip-btn com-strip ${cActive ? 'active' : ''}" onclick="window.location.href=this.href; return false;">
                <svg viewBox="0 0 24 24" width="22" height="22" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" fill="none"><circle cx="12" cy="5" r="3"/><line x1="12" y1="8" x2="12" y2="16"/><circle cx="6" cy="20" r="3"/><circle cx="18" cy="20" r="3"/><line x1="12" y1="16" x2="6" y2="17"/><line x1="12" y1="16" x2="18" y2="17"/></svg>
                <span class="strip-lbl">LDGR</span>
            </a>
            <a href="./index.html" class="strip-btn face-strip ${faceActive ? 'active' : ''}" onclick="window.location.href=this.href; return false;">
                <svg viewBox="0 0 24 24" width="22" height="22" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" fill="none"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/></svg>
                <span class="strip-lbl">FACE</span>
            </a>
            <a href="./COMENVVECHUD.html" class="strip-btn env-strip ${eActive ? 'active' : ''}" onclick="window.location.href=this.href; return false;">
                <svg viewBox="0 0 24 24" width="22" height="22" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" fill="none"><path d="M2 22h20L12 2z"/></svg>
                <span class="strip-lbl">INFR</span>
            </a>
            <a href="./COMMECVECHUD.html" class="strip-btn mec-strip ${mActive ? 'active' : ''}" onclick="window.location.href=this.href; return false;">
                <svg viewBox="0 0 24 24" width="22" height="22" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" fill="none"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>
                <span class="strip-lbl">YLD</span>
            </a>
            <button class="strip-btn" onclick="if(typeof window.Q_OmniPlanner !== 'undefined') window.Q_OmniPlanner.openPlanner()">
                <svg viewBox="0 0 24 24" width="22" height="22" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" fill="none"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><line x1="3" y1="9" x2="21" y2="9"/><line x1="9" y1="21" x2="9" y2="9"/></svg>
                <span class="strip-lbl">PLAN</span>
            </button>
        </div>

        ${panelsHTML}

        <div class="wing-panel wing-l telemetry-node desktop-only" id="q-wing-left">
            <div class="wing-frost"></div>
            <div class="wing-header">
                <span class="w-head">CIVIL</span>
            </div>
            <div class="wing-data-center">
                <div style="margin-bottom: 15px;">
                    <div class="w-lbl">DATE</div>
                    <div class="val-lg" id="leg-date" style="color: #fff;">--</div>
                </div>
                <div>
                    <div style="display:flex; align-items:center; justify-content:center; gap: 5px;">
                        <div class="w-lbl" style="margin:0;">TIME</div>
                        <div class="fmt-toggle" onclick="window.toggleTimeFmt('fmt-btn')" id="fmt-btn">UTC</div>
                    </div>
                    <div class="val-lg" id="leg-time" style="color: #fff;">--</div>
                </div>
            </div>
            <div class="wing-footer">
                <div style="font-size:0.5rem; color:#666; border-top: 1px solid #333; padding-top: 8px; width: 85%; margin: 0 auto;">ENTERPRISE STATE: ACTIVE</div>
            </div>
        </div>

        <div class="wing-panel wing-r telemetry-node desktop-only" id="q-wing-right">
            <div class="wing-frost"></div>
            <div class="wing-header">
                <span class="w-head">QUAD</span>
            </div>
            <div class="wing-data-center">
                <div style="margin-bottom: 15px;">
                    <div class="w-lbl">Q COORDINATE</div>
                    <div class="val-lg" id="q-coord-wing" style="margin-top: 4px; color: #fff;">--</div>
                </div>
                <div style="display:flex; width: 100%; justify-content: space-around;">
                    <div style="display:flex; flex-direction:column; align-items:center;">
                        <div class="w-lbl">MEAN (CIVIL)</div>
                        <div id="mean-deg" style="font-family:'JetBrains Mono'; font-size:0.9rem; font-weight:700; color:#fff; margin-top: 4px;">--</div>
                    </div>
                    <div style="display:flex; flex-direction:column; align-items:center;">
                        <div class="w-lbl">TRUE (ORBIT)</div>
                        <div id="true-deg" style="font-family:'JetBrains Mono'; font-size:0.9rem; font-weight:700; color:#fff; margin-top: 4px;">--</div>
                    </div>
                </div>
            </div>
            <div class="wing-footer">
                <div style="font-size:0.5rem; color:#666; border-top: 1px solid #333; padding-top: 8px; width: 85%; margin: 0 auto;">DUAL-STATE SYNCED</div>
            </div>
        </div>

        <div class="q-global-controls" id="q-universal-controls">
            <button class="q-ctrl-btn" onclick="window.stepScrubber(-1)">&lt;</button>
            <input type="range" min="0" max="365" step="1" value="0" class="q-scrubber" id="q-global-scrubber" oninput="window.scrubTime(this.value)">
            <button class="q-ctrl-btn" onclick="window.stepScrubber(1)">&gt;</button>
            <button class="q-ctrl-btn" id="q-live-toggle" onclick="window.setLiveClock()">LIVE</button>
            
            <button id="q-mic-fab" class="mobile-only-flex" onclick="if(window.Q_KairosVoice) window.Q_KairosVoice.toggle()">🎙</button>
        </div>
        
        <button id="q-mic-fab-desktop" class="desktop-only" onclick="if(window.Q_KairosVoice) window.Q_KairosVoice.toggle()">🎙</button>
    `;
    
    const refNode = document.body.firstChild;
    while (uiContainer.firstChild) document.body.insertBefore(uiContainer.firstChild, refNode);

    window.bindMasterTickScrubber();
    window.syncScrubberUI();

    window.addEventListener('q-tick', (e) => {
        const ribbonLeg = document.getElementById('ribbon-leg');
        const ribbonLegDate = document.getElementById('ribbon-leg-date');
        const ribbonFmt = document.getElementById('ribbon-fmt');
        
        if (ribbonLeg && ribbonLegDate) {
            // Strip Z and LCL for mobile visual balance
            let cleanTimeStr = e.detail.legacyTimeStr.replace(/Z|LCL/gi, '').trim();
            ribbonLeg.innerHTML = cleanTimeStr;
            if (ribbonFmt) ribbonFmt.innerText = localStorage.getItem('Q_TIME_FMT') || 'UTC_24';
            ribbonLegDate.innerHTML = e.detail.legacyDateStr.toUpperCase();
        }

        const legDateEl = document.getElementById('leg-date');
        if (legDateEl) legDateEl.innerHTML = `<span>${e.detail.legacyDateStr.toUpperCase()}</span>`;

        const legTimeEl = document.getElementById('leg-time');
        if (legTimeEl) legTimeEl.innerHTML = e.detail.legacyTimeStr;
        
        const meanDegEl = document.getElementById('mean-deg');
        if (meanDegEl) meanDegEl.innerText = e.detail.qData.meanArc.toFixed(4) + "°";
        
        const trueDegEl = document.getElementById('true-deg');
        if (trueDegEl) trueDegEl.innerText = e.detail.qData.trueArc.toFixed(4) + "°"; 

        let activeBlock = window.getQBlockByTime ? window.getQBlockByTime(e.detail.t) : null;
        const qCoordWing = document.getElementById('q-coord-wing');
        
        if (qCoordWing) {
            if (activeBlock && activeBlock.type === 'PYLON') {
                qCoordWing.innerHTML = `<span style="font-size:0.9rem;">${activeBlock.name}</span>`;
            } else {
                qCoordWing.innerHTML = `<span style="color:#888; font-size:0.8rem;">QC</span><span style="font-size:1.1rem;">${activeBlock ? activeBlock.cycle : 0}</span> ` +
                                       `<span style="color:#888; font-size:0.8rem; margin-left:6px;">Q</span><span style="font-size:1.1rem;">${e.detail.qData.quad}</span> ` +
                                       `<span style="color:#888; font-size:0.8rem; margin-left:6px;">S</span><span style="font-size:1.1rem;">${e.detail.qData.sect}</span> ` +
                                       `<span style="color:#888; font-size:0.8rem; margin-left:6px;">D</span><span style="font-size:1.1rem;">${e.detail.qData.day}</span>`;
            }
        }
    });
};

// --- DOMAIN SHIFT PROTOCOL (COMMERCIAL) ---
window.triggerDomainShift = function(e) {
    if(e && typeof e.preventDefault === 'function') e.preventDefault();
    let authState = localStorage.getItem('Q_SOVEREIGN_AUTH') === 'true' ? 'ACTIVE' : 'STANDBY';
    
    if(authState !== 'ACTIVE') {
        if(window.Q_Auth && typeof window.Q_Auth.triggerOAuth === 'function') window.Q_Auth.triggerOAuth();
        else alert("OAuth Service Unavailable. Boot from Aperture Gateway.");
        return;
    }

    let rawEnt = localStorage.getItem('Q_ENTITLEMENTS');
    let entitlements = [];
    try { entitlements = JSON.parse(rawEnt) || []; } catch(err) {}

    let authEmail = "";
    let authUser = (localStorage.getItem('Q_SOVEREIGN_USER') || '').toUpperCase();

    // --- THE SUPABASE SCANNER ---
    for (let i = 0; i < localStorage.length; i++) {
        let key = localStorage.key(i);
        if (key && key.startsWith('sb-') && (key.endsWith('-auth-token') || key.includes('auth'))) {
            try {
                let sessionData = JSON.parse(localStorage.getItem(key));
                if (sessionData && sessionData.user && sessionData.user.email) {
                    authEmail = sessionData.user.email.toUpperCase();
                }
            } catch(err) {}
        }
    }

    let isLocalEnv = (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1' || window.location.protocol === 'file:');
    
    if (isLocalEnv || authUser.includes('KELBY') || authUser.includes('SHAWN') || authEmail.includes('SHAWNKELBYLEE@GMAIL.COM') || authEmail.includes('KELBY') || localStorage.getItem('Q_ARCHITECT_MODE') === 'TRUE') {
        if (!entitlements.includes("PERSONAL")) entitlements.push("PERSONAL");
        if (!entitlements.includes("COMMERCIAL")) entitlements.push("COMMERCIAL");
        if (!entitlements.includes("ENTERPRISE")) entitlements.push("ENTERPRISE");
        localStorage.setItem('Q_ENTITLEMENTS', JSON.stringify(entitlements));
    }

    if(entitlements.includes("PERSONAL") && entitlements.includes("COMMERCIAL")) {
        const html = `
            <div style="font-family:'JetBrains Mono'; font-size:0.7rem; color:#aaa; margin-bottom: 15px; text-align:center;">
                Dual entitlements detected. Select operating domain.
            </div>
            <div style="display:flex; flex-direction:column; gap:10px;">
                <button onclick="window.location.href='../personal/index.html'" style="padding: 15px; background: rgba(0,0,0,0.8); border: 1px solid #F4D068; color: #F4D068; font-family: 'Orbitron'; font-size: 0.9rem; cursor: pointer; border-radius: 4px; box-shadow: 0 0 15px rgba(244,208,104,0.4);">
                    SWITCH TO PERSONAL MATRIX
                </button>
                <button onclick="if(window.Q_ModalEngine) window.Q_ModalEngine.close()" style="padding: 15px; background: rgba(0,0,0,0.8); border: 1px solid #ffffff; color: #ffffff; font-family: 'Orbitron'; font-size: 0.9rem; cursor: pointer; border-radius: 4px; box-shadow: 0 0 15px rgba(255,255,255,0.2);">
                    REMAIN IN ENTERPRISE LEDGER
                </button>
            </div>
        `;
        if(window.Q_ModalEngine) window.Q_ModalEngine.render('DOMAIN SHIFT PROTOCOL', html);
        else alert("Routing Module Unavailable.");
    } else {
        if(window.Q_Auth && typeof window.Q_Auth.triggerOAuth === 'function') window.Q_Auth.triggerOAuth(); 
    }
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

window.openQuadrantAssignmentModal = function(quadrantId) {
    const html = `
        <div style="display:flex; flex-direction:column; gap:12px;">
            <div style="font-size:0.65rem; color:#aaa; font-family:'JetBrains Mono'; text-align:center;">
                Assign macro-telemetry pool to this enterprise sector.
            </div>
            <select id="quad-pool-select" style="background: #111; border: 1px solid #555; color: #fff; padding: 12px; font-family: 'Orbitron'; font-size: 0.75rem; border-radius: 4px; outline: none; width: 100%;">
                <option value="BIO">WORKFORCE RESONANCE</option>
                <option value="COM">LOGISTICS & LEDGER</option>
                <option value="ENV">MACRO-INFRASTRUCTURE</option>
                <option value="MEC">YIELD METROLOGY</option>
            </select>
        </div>
    `;
    
    if (window.Q_ModalEngine) {
        window.Q_ModalEngine.render('ENTERPRISE ROUTING', html, 'LOCK ASSIGNMENT', () => {
            const selected = document.getElementById('quad-pool-select').value;
            localStorage.setItem('Q_FACE_QUAD_' + quadrantId, selected);
            if (typeof window.refreshChronoFace === 'function') window.refreshChronoFace();
            window.Q_ModalEngine.close();
        });
    }
};

window.initCommercialDials = function(containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;
    
    const pathStr = window.location.pathname.toUpperCase();
    const filename = pathStr.split('/').pop() || "INDEX.HTML";
    
    const bActive = filename.includes("COMBIOVECHUD");
    const eActive = filename.includes("COMENVVECHUD");
    const mActive = filename.includes("COMMECVECHUD");
    const cActive = filename.includes("COMCOMVECHUD");
    const faceActive = filename.includes("INDEX");

    container.innerHTML = '';
    const svgNS = "http://www.w3.org/2000/svg";
    const svg = document.createElementNS(svgNS, "svg");
    svg.setAttribute("width", "100%");
    svg.setAttribute("height", "100%");
    svg.setAttribute("viewBox", "0 0 400 400");
    
    if (faceActive) {
        svg.innerHTML = `
            <circle cx="200" cy="200" r="180" fill="none" stroke="#333" stroke-width="2"/>
            <circle cx="200" cy="200" r="160" fill="none" stroke="#111" stroke-width="10"/>
            <g id="chrono-ticks"></g>
            <line id="hand-hour" x1="200" y1="200" x2="200" y2="120" stroke="#888" stroke-width="6" stroke-linecap="round"/>
            <line id="hand-minute" x1="200" y1="200" x2="200" y2="60" stroke="#ffffff" stroke-width="4" stroke-linecap="round"/>
            <line id="hand-second" x1="200" y1="200" x2="200" y2="40" stroke="#555" stroke-width="2" stroke-linecap="round"/>
            <circle cx="200" cy="200" r="8" fill="#ffffff"/>
        `;
        container.appendChild(svg);

        const ticks = document.getElementById('chrono-ticks');
        for(let i=0; i<60; i++) {
            const isHour = i % 5 === 0;
            const angle = (i * 6 - 90) * Math.PI / 180;
            const rInner = isHour ? 160 : 165;
            const rOuter = 175;
            const x1 = 200 + rInner * Math.cos(angle);
            const y1 = 200 + rInner * Math.sin(angle);
            const x2 = 200 + rOuter * Math.cos(angle);
            const y2 = 200 + rOuter * Math.sin(angle);
            const line = document.createElementNS(svgNS, "line");
            line.setAttribute("x1", x1); line.setAttribute("y1", y1); line.setAttribute("x2", x2); line.setAttribute("y2", y2);
            line.setAttribute("stroke", isHour ? "#ffffff" : "#333");
            line.setAttribute("stroke-width", isHour ? "3" : "1");
            ticks.appendChild(line);
        }

        window.addEventListener('q-tick', (e) => {
            const d = new Date(); 
            const h = d.getHours();
            const m = d.getMinutes();
            const s = d.getSeconds();
            
            const hourAngle = ((h % 12) + m/60) * 30 - 90;
            const minAngle = (m + s/60) * 6 - 90;
            const secAngle = s * 6 - 90;

            document.getElementById('hand-hour').setAttribute("transform", `rotate(${hourAngle} 200 200)`);
            document.getElementById('hand-minute').setAttribute("transform", `rotate(${minAngle} 200 200)`);
            if(document.getElementById('hand-second')) document.getElementById('hand-second').setAttribute("transform", `rotate(${secAngle} 200 200)`);
        });

    } else if (mActive) {
        svg.innerHTML = `
            <rect x="40" y="40" width="320" height="320" fill="none" stroke="#333" stroke-width="1"/>
            <path id="yield-line-1" d="" fill="none" stroke="#ffffff" stroke-width="3"/>
            <path id="yield-line-2" d="" fill="none" stroke="#555" stroke-width="2" stroke-dasharray="5"/>
            <text x="200" y="380" fill="#888" font-family="Orbitron" font-size="12" text-anchor="middle">KEPLERIAN SMEAR / FIAT LOSS</text>
        `;
        container.appendChild(svg);
        
        window.addEventListener('q-tick', (e) => {
            let pts1 = "M40,200 "; let pts2 = "M40,200 ";
            const delta = e.detail.qData.delta;
            for(let i=1; i<=10; i++) {
                pts1 += `L${40 + i*32},${200 - (Math.sin(e.detail.t/1000 + i)*20 + delta*10)} `;
                pts2 += `L${40 + i*32},${200 - (Math.cos(e.detail.t/1500 + i)*15)} `;
            }
            document.getElementById('yield-line-1').setAttribute("d", pts1);
            document.getElementById('yield-line-2').setAttribute("d", pts2);
        });

    } else if (bActive) {
        svg.innerHTML = `
            <circle cx="200" cy="200" r="150" fill="none" stroke="#333" stroke-width="2"/>
            <path id="bio-arc-1" d="" fill="none" stroke="#ffffff" stroke-width="20" stroke-linecap="round"/>
            <path id="bio-arc-2" d="" fill="none" stroke="#555" stroke-width="15" stroke-linecap="round"/>
            <text x="200" y="200" fill="#fff" font-family="Orbitron" font-size="24" text-anchor="middle" id="bio-txt">92%</text>
            <text x="200" y="225" fill="#888" font-family="JetBrains Mono" font-size="10" text-anchor="middle">FLOW ALIGNMENT</text>
        `;
        container.appendChild(svg);

        window.addEventListener('q-tick', (e) => {
            const arc1End = 90 + (Math.sin(e.detail.t/2000)*30);
            const a1x = 200 + 130 * Math.cos(arc1End * Math.PI/180);
            const a1y = 200 + 130 * Math.sin(arc1End * Math.PI/180);
            document.getElementById('bio-arc-1').setAttribute("d", `M70,200 A130,130 0 0,1 ${a1x},${a1y}`);
            
            const arc2End = 180 + (Math.cos(e.detail.t/2500)*20);
            const a2x = 200 + 100 * Math.cos(arc2End * Math.PI/180);
            const a2y = 200 + 100 * Math.sin(arc2End * Math.PI/180);
            document.getElementById('bio-arc-2').setAttribute("d", `M100,200 A100,100 0 0,1 ${a2x},${a2y}`);
            document.getElementById('bio-txt').innerText = Math.floor(85 + (Math.sin(e.detail.t/1000)*10)) + "%";
        });

    } else if (eActive) {
        svg.innerHTML = `
            <circle cx="200" cy="200" r="160" fill="none" stroke="#222" stroke-width="15"/>
            <circle cx="200" cy="200" r="130" fill="none" stroke="#222" stroke-width="15"/>
            <path id="env-ring-1" d="" fill="none" stroke="#ffffff" stroke-width="15" stroke-linecap="round"/>
            <path id="env-ring-2" d="" fill="none" stroke="#888" stroke-width="15" stroke-linecap="round"/>
            <text x="200" y="200" fill="#fff" font-family="Orbitron" font-size="18" text-anchor="middle">BASELOAD</text>
        `;
        container.appendChild(svg);
        
        window.addEventListener('q-tick', (e) => {
            const v1 = 180 + (e.detail.qData.trueArc % 180);
            const x1 = 200 + 160 * Math.cos((v1-90) * Math.PI/180);
            const y1 = 200 + 160 * Math.sin((v1-90) * Math.PI/180);
            document.getElementById('env-ring-1').setAttribute("d", `M200,40 A160,160 0 ${v1>180?1:0},1 ${x1},${y1}`);
            
            const v2 = 90 + Math.abs(e.detail.qData.delta * 20);
            const x2 = 200 + 130 * Math.cos((v2-90) * Math.PI/180);
            const y2 = 200 + 130 * Math.sin((v2-90) * Math.PI/180);
            document.getElementById('env-ring-2').setAttribute("d", `M200,70 A130,130 0 0,1 ${x2},${y2}`);
        });

    } else if (cActive) {
        svg.innerHTML = `
            <rect x="50" y="50" width="150" height="150" fill="none" stroke="#333" stroke-width="2"/>
            <rect x="200" y="50" width="150" height="150" fill="none" stroke="#333" stroke-width="2"/>
            <rect x="50" y="200" width="150" height="150" fill="none" stroke="#333" stroke-width="2"/>
            <rect x="200" y="200" width="150" height="150" fill="none" stroke="#333" stroke-width="2"/>
            <rect id="com-active-quad" x="50" y="50" width="150" height="150" fill="#ffffff" opacity="0.2"/>
            <text x="200" y="200" fill="#fff" font-family="Orbitron" font-size="14" text-anchor="middle" alignment-baseline="middle">90+1 LEDGER</text>
        `;
        container.appendChild(svg);
        
        window.addEventListener('q-tick', (e) => {
            const q = e.detail.qData.quad;
            const active = document.getElementById('com-active-quad');
            if (q === 1) { active.setAttribute("x", "200"); active.setAttribute("y", "50"); }
            if (q === 2) { active.setAttribute("x", "200"); active.setAttribute("y", "200"); }
            if (q === 3) { active.setAttribute("x", "50"); active.setAttribute("y", "200"); }
            if (q === 4) { active.setAttribute("x", "50"); active.setAttribute("y", "50"); }
        });
    }
};

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
    if(!window.getSimState || !window.PYLON_ALPHA_DYNAMIC) return;
    const saved = window.getSimState();
    const baseTime = saved.isLive ? Date.now() : saved.simTime;
    const currentDays = (baseTime - window.PYLON_ALPHA_DYNAMIC) / window.MS_DAY;
    const cycleBaseDays = Math.floor(currentDays / 365.24219) * 365.24219;
    const discreteDays = parseInt(val, 10);
    
    const targetMs = window.PYLON_ALPHA_DYNAMIC + ((cycleBaseDays + discreteDays) * window.MS_DAY);
    const d = new Date(targetMs);
    d.setUTCHours(12, 0, 0, 0);
    
    window.updateMasterClock(false, d.getTime());
};

window.stepScrubber = function(n) {
    if(!window.getSimState) return;
    const saved = window.getSimState();
    const baseTime = saved.isLive ? Date.now() : saved.simTime;
    const targetMs = baseTime + (n * window.MS_DAY);
    window.updateMasterClock(false, targetMs);
};

window.setLiveClock = function() {
    window.updateMasterClock(true, Date.now());
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
    
    if(scrubber && state.isLive === false && window.PYLON_ALPHA_DYNAMIC) {
        let daysElapsed = (state.simTime - window.PYLON_ALPHA_DYNAMIC) / window.MS_DAY;
        let cycleDay = Math.floor(daysElapsed % 365.24219);
        if (cycleDay < 0) cycleDay += 365;
        scrubber.value = cycleDay;
    }
};

window.addEventListener('DOMContentLoaded', () => {
    window.injectUniversalUI();
    window.initCommercialDials('q-center-dial'); 
    
    // Explicit DOM relocation for the mobile microphone
    if (window.innerWidth <= 950) {
        const micFab = document.getElementById('q-mic-fab');
        const controlsPanel = document.getElementById('q-universal-controls');
        if (micFab && controlsPanel) {
            controlsPanel.appendChild(micFab);
        }
    }
});