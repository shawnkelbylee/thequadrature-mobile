// THE QUADRATURE: PERSONAL UI MATRIX & DOMAIN ROUTER
// Architect: Kelby | Engineer: Kairos
// STATUS: Phase V. Domain Shift Protocol & Universal Auth Patch Applied.

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
    
    const pathStr = window.location.pathname.toUpperCase();
    const filename = pathStr.split('/').pop() || "INDEX.HTML";
    
    const faceActive = filename.includes("INDEX");
    const bActive = filename.includes("BIOVECHUD");
    const cActive = filename.includes("COMVECHUD");
    const eActive = filename.includes("ENVVECHUD");
    const mActive = filename.includes("MECVECHUD");
    
    if (faceActive) document.body.classList.add('q-chrono-face');
    else document.body.classList.add('q-vector-hud');
    
    let headerText = "PERSONAL QUAD";
    if (bActive) headerText = "BIOLOGICAL VECTOR";
    else if (cActive) headerText = "COMMUNAL VECTOR";
    else if (eActive) headerText = "ENVIRONMENTAL VECTOR";
    else if (mActive) headerText = "MECHANICAL VECTOR";

    // --- DOMAIN SHIFT & AUTH LOGIC ---
    let authState = localStorage.getItem('Q_SOVEREIGN_AUTH') === 'true' ? 'ACTIVE' : 'STANDBY';
    let authUser = localStorage.getItem('Q_SOVEREIGN_USER') || 'GUEST';
    
    // Master Override
    let isMaster = (authUser.toUpperCase() === 'KELBY' || authUser.includes('MASTER'));
    if (isMaster && authState === 'ACTIVE') {
        localStorage.setItem('Q_ENTITLEMENTS', '["PERSONAL", "COMMERCIAL"]');
    }

    let authBg = 'transparent';
    let authColor = '#888888';
    let authBorder = '#888888';
    let authText = '[ UNAUTHENTICATED ]';

    if (authState === 'ACTIVE') {
        authBg = '#F4D068'; // Personal Gold
        authColor = '#000000';
        authBorder = '#F4D068';
        authText = '[ IN THE QUAD ]';
    }

    const style = document.createElement('style');
    style.innerHTML = `
        /* IRONCLAD VIEWPORT RECOVERY */
        html, body { 
            position: fixed !important; top: 0px !important; left: 0px !important; right: 0px !important; bottom: 0px !important; 
            width: 100vw !important; height: var(--app-height, 100vh) !important; 
            margin: 0px !important; padding: 0px !important; 
            overflow: hidden !important; touch-action: none !important; overscroll-behavior: none !important; transform: none !important; 
            background-color: #080604; 
        }
        #mobile-telemetry-btn { display: none !important; pointer-events: none !important; }

        :root { 
            --wing-w: 240px; --mod-w: 320px; --dial-size: 60vh; --wing-offset: calc((var(--dial-size) / 2) + 4vw); 
            --theme-color: #F4D068;
            --theme-dim: rgba(244, 208, 104, 0.15);
            --center-gap-x: 36vh; --corner-gap-y: 21vh; --corner-gap-x: 32vh;
            --panel-w: 460px; --panel-h: 170px;
        }
        
        .global-header {
            position: absolute; top: 4vh; left: 0; width: 100vw;
            display: flex; justify-content: center; align-items: center; text-align: center;
            font-family: 'JetBrains Mono', monospace; font-weight: 900; font-size: 2.5rem; letter-spacing: 12px; padding-left: 12px;
            color: var(--theme-color); z-index: 50; pointer-events: none;
            text-transform: uppercase;
            text-shadow: 0 0 10px var(--theme-dim);
        }

        .panel-bg, .wing-bg { display: none !important; }
        
        .corner-panel { position: absolute; width: var(--panel-w); height: var(--panel-h); z-index: 20; cursor: pointer; transition: transform 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275); }
        .corner-panel:hover { transform: translate(var(--tx-hover), var(--ty-hover)) scale(1.02); }

        .frost-zone { position: absolute; inset: 6px 12px; background: rgba(5, 5, 5, 0.85); backdrop-filter: blur(12px); border-radius: 4px; border: 1px solid rgba(244, 208, 104, 0.2); z-index: -2; transition: 0.3s ease; box-shadow: inset 0 0 20px rgba(0,0,0,0.8); }
        .corner-panel:hover .frost-zone { border-color: var(--theme-color); box-shadow: 0 0 15px var(--theme-dim), inset 0 0 20px rgba(0,0,0,0.8); }

        .tl { bottom: calc(50% + var(--corner-gap-y)); right: calc(50% + var(--corner-gap-x)); --tx-hover: -2px; --ty-hover: -2px;}
        .tr { bottom: calc(50% + var(--corner-gap-y)); left: calc(50% + var(--corner-gap-x)); --tx-hover: 2px; --ty-hover: -2px;}
        .bl { top: calc(50% + var(--corner-gap-y)); right: calc(50% + var(--corner-gap-x)); --tx-hover: -2px; --ty-hover: 2px;}
        .br { top: calc(50% + var(--corner-gap-y)); left: calc(50% + var(--corner-gap-x)); --tx-hover: 2px; --ty-hover: 2px;}

        .panel-data-container {
            height: 100%; width: 100%; display: flex; flex-direction: column; align-items: stretch; justify-content: center; text-align: left;
            position: relative; z-index: 2; box-sizing: border-box; padding: 20px 30px;
        }

        .opt-oval { position: absolute; font-family: 'JetBrains Mono'; font-size: 0.55rem; font-weight: 700; letter-spacing: 1px; display: flex; justify-content: center; align-items: center; cursor: pointer; z-index: 30; transition: 0.3s; top: 15px; right: 25px; color: #888; }
        .opt-oval:hover { color: var(--theme-color); text-shadow: 0 0 8px var(--theme-color); }

        .wing-panel { position: absolute; width: 240px; height: 250px; z-index: 15; box-sizing: border-box; top: 50%; transform: translateY(-50%); text-align: center; }
        .wing-frost { position: absolute; inset: 12px; background: rgba(10, 10, 10, 0.9); border: 1px solid rgba(244, 208, 104, 0.2); backdrop-filter: blur(14px); border-radius: 4px; z-index: -2; box-shadow: 0 10px 30px rgba(0,0,0,0.8); }

        .wing-l { right: calc(50% + var(--center-gap-x)); }
        .wing-r { left: calc(50% + var(--center-gap-x)); }
        
        .wing-header { position: absolute; top: 25px; left: 0; width: 100%; z-index: 10; display: flex; justify-content: center; }
        .wing-data-center { display: flex; flex-direction: column; justify-content: center; align-items: center; text-align: center; height: 100%; width: 100%; padding: 40px 0; box-sizing: border-box; position: relative; z-index: 10; }
        .wing-footer { position: absolute; bottom: 20px; left: 0; width: 100%; z-index: 10; display: flex; justify-content: center; }

        .w-head { font-family: 'JetBrains Mono'; font-weight: 700; font-size: 0.85rem; letter-spacing: 3px; color: var(--theme-color); border-bottom: 1px solid rgba(244, 208, 104, 0.3); padding-bottom: 4px; display: inline-block; z-index: 20; text-align: center; }
        .w-lbl { font-family: 'JetBrains Mono'; font-size: 0.55rem; color: #aaa; letter-spacing: 1px; text-transform: uppercase; margin-bottom: 2px; z-index: 20; text-align: center; }
        .val-lg { font-family: 'Orbitron'; font-size: 1.2rem; font-weight: 700; letter-spacing: 1px; white-space: nowrap; color: #fff; z-index: 20; text-align: center; }
        .fmt-toggle { font-family: 'JetBrains Mono'; font-weight: bold; font-size: 0.5rem; color: var(--theme-color); cursor: pointer; border: 1px solid rgba(244, 208, 104, 0.4); padding: 2px 8px; border-radius: 2px; background: rgba(0,0,0,0.6); pointer-events: auto; transition: 0.3s; white-space: nowrap; text-align: center; }
        .fmt-toggle:hover { background: var(--theme-color); color: #000; }

        /* --- NAVBAR --- */
        .q-nav-bar { 
            position: fixed !important; display: flex !important; visibility: visible !important; opacity: 1 !important;
            bottom: 2.5vh; left: 50%; transform: translateX(-50%); width: max-content; padding: 0 20px; border: 1px solid rgba(244, 208, 104, 0.3); border-radius: 4px; box-shadow: 0 10px 30px rgba(0,0,0,0.9);
            height: 45px; background: rgba(10, 10, 10, 0.95); justify-content: center; align-items: center; box-sizing: border-box; z-index: 100000; font-family: 'Orbitron'; pointer-events: auto !important; 
        }
        
        .q-nav-menu { display: flex; align-items: center; gap: 0.8vw; pointer-events: auto !important; width: 100%; justify-content: center; }
        .q-nav-btn { background: transparent; border: 1px solid rgba(244, 208, 104, 0.3); color: #aaa; padding: 6px 12px; border-radius: 2px; font-family: 'Orbitron'; font-size: 0.6rem; font-weight: bold; cursor: pointer; transition: 0.3s; letter-spacing: 1px; text-decoration: none; display: inline-block; text-align: center; pointer-events: auto !important; white-space: nowrap; }
        .q-nav-btn:hover { border-color: var(--theme-color); color: var(--theme-color); }
        
        .q-nav-btn.sim-badge { border-color: ${authBorder} !important; color: ${authColor} !important; background: ${authBg} !important; cursor: pointer !important; }
        
        .q-nav-btn.face-btn.active, .q-nav-btn.bio-btn.active, .q-nav-btn.com-btn.active, .q-nav-btn.env-btn.active, .q-nav-btn.mec-btn.active { 
            border-color: var(--theme-color) !important; color: var(--theme-color) !important; background: rgba(244, 208, 104, 0.1) !important; box-shadow: none !important;
        }

        #q-mic-fab-desktop { position: fixed; bottom: 20px; right: 20px; width: 50px; height: 50px; border-radius: 4px; background: rgba(0,0,0,0.8); border: 1px solid rgba(244, 208, 104, 0.4); color: var(--theme-color); display: flex; justify-content: center; align-items: center; z-index: 100000; box-shadow: 0 5px 15px rgba(0,0,0,0.9); cursor: pointer; font-size: 1.2rem; transition: all 0.3s ease; pointer-events: auto !important; }
        #q-mic-fab-desktop:hover { background: var(--theme-color); color: #000; }
        
        .q-global-controls { position: fixed; bottom: calc(2.5vh + 60px); left: 50%; transform: translateX(-50%); z-index: 9995; display: flex; align-items: center; gap: 12px; background: rgba(10, 10, 10, 0.95); backdrop-filter: blur(20px); border-radius: 4px; padding: 10px 25px; justify-content: space-between; box-shadow: 0 10px 40px rgba(0,0,0,0.9); border: 1px solid rgba(244, 208, 104, 0.3); pointer-events: auto; }
        .q-ctrl-btn { background: transparent; border: 1px solid rgba(244, 208, 104, 0.3); color: #aaa; padding: 8px 14px; cursor: pointer; font-family: 'Orbitron'; font-size: 0.65rem; font-weight: 700; border-radius: 2px; transition: 0.3s; letter-spacing: 1px; white-space: nowrap; pointer-events: auto; }
        .q-ctrl-btn:hover { background: var(--theme-color); color: #000; }
        .q-ctrl-btn.active { background: var(--theme-color); color: #000; border-color: var(--theme-color); }
        .q-scrubber { flex-grow: 1; min-width: 250px; accent-color: var(--theme-color); cursor: pointer; height: 2px; -webkit-appearance: none; margin: 0 10px; background: #333; pointer-events: auto; }
        .q-scrubber::-webkit-slider-thumb { -webkit-appearance: none; height: 16px; width: 8px; background: var(--theme-color); cursor: grab; pointer-events: auto; border-radius: 1px; }

        .desktop-only { display: flex !important; }
        .mobile-only-flex { display: none !important; }

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
                background: #080604 !important; border: none !important; border-bottom: 1px solid rgba(244, 208, 104, 0.2) !important; box-shadow: none !important; pointer-events: auto !important; 
            }
            .q-nav-menu .vector-link { display: none !important; } 
            
            #q-global-sim-badge { font-size: 0.45rem !important; padding: 4px 8px !important; margin-left: 0 !important; white-space: nowrap; flex-shrink: 0; position: relative; z-index: 100000; pointer-events: auto !important; }
            
            .q-nav-menu { position: static; flex-direction: row; overflow-x: auto; white-space: nowrap; background: transparent; box-shadow: none; transform: none; width: auto; border: none; gap: 5px; justify-content: flex-start; }
            
            .q-center-dial { margin-top: -3vh !important; }
            
            #mobile-telemetry-ribbon { display: flex !important; position: fixed; top: 50px !important; left: 0px !important; height: 45px !important; width: 100vw !important; background: #080604; border-bottom: 1px solid rgba(244, 208, 104, 0.2); z-index: 99998 !important; justify-content: space-between; align-items: center; padding: 0 10px !important; box-sizing: border-box; }
            #ribbon-leg-date { white-space: nowrap; font-size: 0.6rem !important; color: #fff !important; }
            #ribbon-leg { white-space: nowrap; font-size: 0.65rem !important; color: var(--theme-color) !important; }

            #mobile-telemetry-viewport { display: none; position: fixed !important; top: 95px !important; bottom: 65px !important; height: auto !important; left: 0; width: 100vw; background: rgba(5,5,5,0.95); z-index: 99900; overflow-y: scroll !important; overflow-x: hidden !important; flex-direction: column; align-items: center; justify-content: flex-start; padding-top: 15px !important; padding-bottom: 20px !important; box-sizing: border-box !important; gap: 15px; pointer-events: auto !important; }
            #mobile-telemetry-viewport .telemetry-node { display: flex !important; position: relative !important; width: 95vw !important; max-width: 360px !important; height: auto !important; margin: 0 !important; transform: none !important; }
            #mobile-telemetry-viewport .wing-panel { display: none !important; }
            
            #mobile-telemetry-viewport .corner-panel { min-height: 120px !important; padding: 20px !important; }
            #mobile-telemetry-viewport .frost-zone { inset: 0 !important; border: 1px solid rgba(244, 208, 104, 0.2) !important; }
            #mobile-telemetry-viewport .panel-data-container { padding: 0 !important; margin-top: 10px !important; align-items: center !important; text-align: center !important; }
            #mobile-telemetry-viewport .opt-oval { top: 15px !important; right: 15px !important; }
            
            body.telemetry-open .q-center-dial { display: none !important; }
            
            .q-global-controls { display: flex !important; width: 95vw !important; padding: 6px 8px !important; bottom: calc(2.5vh + 65px) !important; background: #080604 !important; border: 1px solid rgba(244, 208, 104, 0.3) !important; } 
            
            #q-mic-fab { position: static !important; width: 32px !important; height: 32px !important; border-radius: 4px !important; font-size: 1rem !important; order: 1 !important; flex-shrink: 0 !important; background: rgba(0,0,0,0.8); border: 1px solid rgba(244, 208, 104, 0.4); color: var(--theme-color); display: flex; justify-content: center; align-items: center; cursor: pointer; pointer-events: auto !important; }
            #q-mic-fab.listening { background: var(--theme-color); color: #000; }
        }
    `;
    document.head.appendChild(style);

    const uiContainer = document.createElement('div');
    uiContainer.id = 'q-ui-injected-flag';

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
        <div class="global-header desktop-only">${headerText}</div>

        <div class="q-nav-bar">
            <div style="display:flex; width: 100%; justify-content: center; align-items: center;">
                <div class="q-nav-menu" id="q-nav-menu">
                    <a href="../aperture/index.html" class="q-nav-btn desktop-only" ontouchstart="window.location.href=this.href; event.preventDefault();">APERTURE</a>
                    <button id="q-global-sim-badge" class="q-nav-btn sim-badge" onclick="window.triggerDomainShift(event)">${authText}</button>
                    <a href="./index.html" class="q-nav-btn face-btn vector-link ${faceActive ? 'active' : ''}" ontouchstart="window.location.href=this.href; event.preventDefault();">CHRONO-FACE</a>
                    <a href="./BIOVECHUD.html" class="q-nav-btn bio-btn vector-link ${bActive ? 'active' : ''}" ontouchstart="window.location.href=this.href; event.preventDefault();">BIO (Q1)</a>
                    <a href="./COMVECHUD.html" class="q-nav-btn com-btn vector-link ${cActive ? 'active' : ''}" ontouchstart="window.location.href=this.href; event.preventDefault();">COM (Q2)</a>
                    <a href="./ENVVECHUD.html" class="q-nav-btn env-btn vector-link ${eActive ? 'active' : ''}" ontouchstart="window.location.href=this.href; event.preventDefault();">ENV (Q3)</a>
                    <a href="./MECVECHUD.html" class="q-nav-btn mec-btn vector-link ${mActive ? 'active' : ''}" ontouchstart="window.location.href=this.href; event.preventDefault();">MEC (Q4)</a>
                    <button class="q-nav-btn omni desktop-only" onclick="if(typeof window.Q_OmniPlanner !== 'undefined') window.Q_OmniPlanner.openPlanner()">[ OMNI-PLANNER ]</button>
                    <button class="q-nav-btn special desktop-only" onclick="if(typeof window.Q_IntegrationHub !== 'undefined') window.Q_IntegrationHub.openHub()">[ DASHBOARD ]</button>
                </div>
            </div>
            <button class="mobile-only-flex" style="background:transparent; border:none; color:var(--theme-color); font-size:1.5rem; padding:0; margin:0; position:absolute; right:15px; cursor:pointer;" onclick="if(typeof window.Q_IntegrationHub !== 'undefined') window.Q_IntegrationHub.openHub()">☰</button>
        </div>

        ${panelsHTML}

        <div class="wing-panel wing-l telemetry-node desktop-only" id="q-wing-left">
            <div class="wing-frost"></div>
            <div class="wing-header"><span class="w-head">CIVIL</span></div>
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
            <div class="wing-footer"><div style="font-size:0.5rem; color:#888; border-top: 1px solid rgba(244, 208, 104, 0.3); padding-top: 8px; width: 85%; margin: 0 auto;">SYSTEM STATE: NOMINAL</div></div>
        </div>

        <div class="wing-panel wing-r telemetry-node desktop-only" id="q-wing-right">
            <div class="wing-frost"></div>
            <div class="wing-header"><span class="w-head">QUAD</span></div>
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
            <div class="wing-footer"><div style="font-size:0.5rem; color:#888; border-top: 1px solid rgba(244, 208, 104, 0.3); padding-top: 8px; width: 85%; margin: 0 auto;">DUAL-STATE SYNCED</div></div>
        </div>

        <div id="mobile-telemetry-ribbon" class="mobile-only-flex">
            <div style="display:flex; align-items:center; gap: 10px;">
                <button id="q-mic-fab" onclick="if(window.Q_AgentLayer) window.Q_AgentLayer.toggleVoice()">🎤</button>
                <div id="ribbon-leg-date" style="font-family:'JetBrains Mono'; font-weight:bold; letter-spacing:1px;">--</div>
            </div>
            <div style="display:flex; align-items:center; gap: 8px;">
                <div id="ribbon-fmt" class="fmt-toggle" onclick="window.toggleTimeFmt()">UTC</div>
                <div id="ribbon-leg" style="font-family:'Orbitron'; font-weight:bold; letter-spacing:1px;">--</div>
            </div>
        </div>

        <div class="q-global-controls" id="q-universal-controls">
            <button class="q-ctrl-btn" onclick="window.stepScrubber(-1)">&lt;</button>
            <input type="range" min="0" max="365" step="1" value="0" class="q-scrubber" id="q-global-scrubber" oninput="window.scrubTime(this.value)">
            <button class="q-ctrl-btn" onclick="window.stepScrubber(1)">&gt;</button>
            <button class="q-ctrl-btn" id="q-live-toggle" onclick="window.setLiveClock()">LIVE</button>
        </div>
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
            ribbonLeg.innerHTML = e.detail.legacyTimeStr;
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

// --- DOMAIN SHIFT PROTOCOL (PERSONAL) ---
window.triggerDomainShift = function(e) {
    if(e) e.preventDefault();
    let authState = localStorage.getItem('Q_SOVEREIGN_AUTH') === 'true' ? 'ACTIVE' : 'STANDBY';
    
    if(authState !== 'ACTIVE') {
        if(window.Q_Auth) window.Q_Auth.triggerOAuth();
        else alert("OAuth Service Unavailable. Boot from Aperture Gateway.");
        return;
    }

    let rawEnt = localStorage.getItem('Q_ENTITLEMENTS');
    let entitlements = [];
    try { entitlements = JSON.parse(rawEnt) || []; } catch(err) {}

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
                <button onclick="window.Q_ModalEngine.close()" style="padding: 15px; background: rgba(0,0,0,0.8); border: 1px solid #F4D068; color: #F4D068; font-family: 'Orbitron'; font-size: 0.9rem; cursor: pointer; border-radius: 4px; box-shadow: 0 0 15px rgba(244,208,104,0.4);">
                    REMAIN IN PERSONAL MATRIX
                </button>
                <button onclick="window.location.href='../commercial/index.html'" style="padding: 15px; background: rgba(0,0,0,0.8); border: 1px solid #ffffff; color: #ffffff; font-family: 'Orbitron'; font-size: 0.9rem; cursor: pointer; border-radius: 4px; box-shadow: 0 0 15px rgba(255,255,255,0.2);">
                    SWITCH TO ENTERPRISE LEDGER
                </button>
            </div>
        `;
        if(window.Q_ModalEngine) window.Q_ModalEngine.render('DOMAIN SHIFT PROTOCOL', html);
        else alert("Routing Module Unavailable.");
    } else {
        if(window.Q_Auth) window.Q_Auth.triggerOAuth(); 
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
});