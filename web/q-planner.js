// THE QUADRATURE: OMNI-PLANNER & UI ABSTRACTION (ZERO-REDUNDANCY ENGINE)
// Architect: Kelby | Builder: Kairos
// PROTOCOL: Pragmatic Interoperability, Strict Phase Bordering, & Civil Tension Scoring
// REVISION: Phase XV - Static Palette Decoupling (Titanium/Platinum/Cyan)

// --- DATA PERSISTENCE & UTILITIES ---
window.qData = window.qData || JSON.parse(localStorage.getItem('q_planner_data_v2') || '{}');

window.savePlannerData = function() {
    localStorage.setItem('q_planner_data_v2', JSON.stringify(window.qData));
};

window.getDataKey = function(d, h, m) {
    return `${d.getFullYear()}-${(d.getMonth()+1).toString().padStart(2,'0')}-${d.getDate().toString().padStart(2,'0')}-${h.toString().padStart(2,'0')}-${m.toString().padStart(2,'0')}`;
};

window.hasDataInDay = function(date) {
    if (!window.qData) return false;
    for(let h=0; h<24; h++) {
        for(let m=0; m<60; m+=5) {
            let key = window.getDataKey(date, h, m);
            if(window.qData[key] && window.qData[key].text && window.qData[key].text.trim() !== "") return true;
        }
    }
    return false;
};

window.hasDataInBlock = function(cycle, absDeg) {
    if (!window.qData) return false;
    for(let m=0; m<10; m++) {
        let key = `Q-${cycle}-${absDeg}-${m}`;
        if(window.qData[key] && window.qData[key].text && window.qData[key].text.trim() !== "") return true;
    }
    return false;
};

// DUAL-FORMAT TITLE GENERATOR
window.getDualTitle = function(ts, isLegacy) {
    if (isLegacy) {
        const d = new Date(ts);
        const months = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"];
        return `<div class="cal-title-wrapper show-legacy"><div class="title-leg">${months[d.getMonth()]} ${d.getDate()} ${d.getFullYear()}</div></div>`;
    } else {
        const qBlock = window.getQBlockByTime(ts);
        let qStr = "";
        if (qBlock) {
            if (qBlock.isAnchor) {
                qStr = `<span style="color:var(--gold, #F4D068);">QC</span> <span style="color:var(--omni-text);">${qBlock.cycle}</span> <span style="color:var(--gold, #F4D068);">Q</span><span style="color:var(--omni-text);">${qBlock.quad}</span> <span style="color:var(--gold, #F4D068);">S</span><span style="color:var(--omni-text);">${qBlock.sect}</span> <span style="color:var(--gold, #F4D068);">DEG</span> <span style="color:var(--omni-text);">${qBlock.deg}</span> <span style="color:var(--omni-main); margin-left:4px;">[${qBlock.name}]</span>`;
            } else {
                qStr = `<span style="color:var(--gold, #F4D068);">QC</span> <span style="color:var(--omni-text);">${qBlock.cycle}</span> <span style="color:var(--gold, #F4D068);">Q</span><span style="color:var(--omni-text);">${qBlock.quad}</span> <span style="color:var(--gold, #F4D068);">S</span><span style="color:var(--omni-text);">${qBlock.sect}</span> <span style="color:var(--gold, #F4D068);">DEG</span> <span style="color:var(--omni-text);">${qBlock.deg}</span>`;
            }
        } else {
            qStr = "<span style='color:var(--omni-warn);'>Q-SYNC PENDING</span>";
        }
        return `<div class="cal-title-wrapper show-quad"><div class="title-q">${qStr}</div></div>`;
    }
};

// --- UNIVERSAL MODAL ENGINE ---
window.Q_ModalEngine = {
    init: function() {
        if (document.getElementById('q-universal-modal')) return;
        const dom = document.createElement('div');
        dom.className = 'modal-overlay';
        dom.id = 'q-universal-modal';
        dom.onclick = () => this.close();
        dom.innerHTML = `
            <div class="modal-box" onclick="event.stopPropagation()" ontouchstart="event.stopPropagation()">
                <div class="modal-head holo-text" id="q-modal-title">--</div>
                <div class="modal-body" id="q-modal-content"></div>
                <button class="btn-close" id="q-modal-btn" onclick="window.Q_ModalEngine.close()">ACKNOWLEDGE</button>
            </div>
        `;
        document.body.appendChild(dom);
    },
    
    render: function(title, contentHtml, btnText = "ACKNOWLEDGE", onBtnClick = null) {
        if (!document.getElementById('q-universal-modal')) this.init();
        document.getElementById('q-modal-title').innerText = title;
        document.getElementById('q-modal-content').innerHTML = contentHtml;
        const btn = document.getElementById('q-modal-btn');
        btn.innerText = btnText;
        btn.onclick = (e) => { if(onBtnClick) onBtnClick(e); else this.close(); };
        document.getElementById('q-universal-modal').style.display = 'flex';
    },
    close: function() { const modal = document.getElementById('q-universal-modal'); if(modal) modal.style.display = 'none'; }
};

// --- OMNI-PLANNER MODULE ---
window.Q_OmniPlanner = {
    viewState: 'closed',
    plannerMacroMode: 'sect',
    plannerBase: Date.now(),
    selectedDate: null,
    selectedAnchor: null,
    selectedHour: 0,
    selectedHourDur: 3600000,
   showLegacyBase: true,
    showOrbitalBase: false,
    showBiometricBase: false,
    isLegacy: true, // Maintained as a reactive visual indicator for legacy micro-views
    init: function() {
        this.injectCSS(); 
        this.injectDOM(); 
        window.Q_ModalEngine.init(); 

        window.addEventListener('keydown', (e) => {
            if (e.repeat) return;
            if (document.activeElement && (document.activeElement.tagName === 'TEXTAREA' || document.activeElement.tagName === 'INPUT')) return;
            if (e.key === '<' || e.key === ',') { if (this.viewState === 'closed' && window.Q_IntegrationHub) window.Q_IntegrationHub.step(-1); else this.stepDay(-1); }
            if (e.key === '>' || e.key === '.') { if (this.viewState === 'closed' && window.Q_IntegrationHub) window.Q_IntegrationHub.step(1); else this.stepDay(1); }
        });

        const isAperture = window.location.pathname.endsWith('/') || window.location.pathname.endsWith('index.html') || window.location.href.toUpperCase().includes('APERTURE');

        if (!isAperture && sessionStorage.getItem('Q_PLANNER_ACTIVE') === 'true') {
            const savedTime = parseInt(sessionStorage.getItem('Q_PLANNER_TIME'));
            if (savedTime) this.plannerBase = savedTime;
            const savedState = sessionStorage.getItem('Q_PLANNER_STATE');
            if (savedState) this.viewState = savedState;
            const savedMacro = sessionStorage.getItem('Q_PLANNER_MACRO');
            if (savedMacro) this.plannerMacroMode = savedMacro;
            const savedSelected = parseInt(sessionStorage.getItem('Q_PLANNER_SELECTED_DATE'));
            if (savedSelected) this.selectedDate = new Date(savedSelected).getTime();

            this.openPlanner(true); 
        } else if (isAperture) {
            // Cleanse stale memory on home index to prevent forced overlays
            sessionStorage.setItem('Q_PLANNER_ACTIVE', 'false');
            this.viewState = 'closed';
        }
    },

    setViewMode: function(mode) {
        if (mode === 'day') {
            this.viewState = 'day';
        } else {
            this.viewState = 'planner';
            this.plannerMacroMode = mode;
        }
        sessionStorage.setItem('Q_PLANNER_STATE', this.viewState);
        sessionStorage.setItem('Q_PLANNER_MACRO', this.plannerMacroMode);
        this.refreshView();
    },

    stepDay: function(n) {
        if (this.isLegacy) {
            let d = new Date(this.selectedDate);
            d.setDate(d.getDate() + n);
            this.selectedDate = d.getTime();
            this.plannerBase = new Date(d.getFullYear(), d.getMonth(), 1).getTime();
        } else {
            let nextTs = window.stepQBlock(this.selectedDate, n);
            this.selectedDate = nextTs;
            this.plannerBase = nextTs; 
        }
        
        if (!this.isLegacy && this.viewState === 'day') {
            this.viewState = 'day';
        }
        sessionStorage.setItem('Q_PLANNER_TIME', this.plannerBase);
        sessionStorage.setItem('Q_PLANNER_SELECTED_DATE', this.selectedDate);
        this.refreshView();
    },

    stepSector: function(n) {
        if (this.isLegacy) {
            let d = new Date(this.plannerBase);
            d.setMonth(d.getMonth() + n);
            this.plannerBase = d.getTime();
            this.selectedDate = this.plannerBase; 
        } else {
            let nextTs = window.stepQSector(this.plannerBase, n);
            this.plannerBase = nextTs;
            this.selectedDate = nextTs; 
        }
        
        if (!this.isLegacy && this.viewState === 'day') {
            this.viewState = 'day';
        }
        sessionStorage.setItem('Q_PLANNER_TIME', this.plannerBase);
        sessionStorage.setItem('Q_PLANNER_SELECTED_DATE', this.selectedDate);
        this.refreshView();
    },

    calculateCivilTension: function(blocksData) {
        let tensionScore = 0;
        let constraintsCount = 0;
        
        // Predictive Tension Algorithm - Friction Coefficient Array
        const friction_coefficient = {
            'SLEEP / RECOVERY': 50,
            'SLEEP INERTIA': 40,
            'DLMO WIND-DOWN': 40,
            'VENT/RECOVERY': 25,
            'DEEP FLOW': 10
        };
        
        blocksData.forEach(b => {
            if (b.text && (b.text.includes('[FIXED]') || b.text.includes('[CIVIL]'))) {
                constraintsCount++;
                tensionScore += (friction_coefficient[b.bioState] || 10);
            }
        });
        
        let advice = "SCHEDULE ALIGNED. True Ellipse resonance maintained.";
        if (tensionScore >= 75) {
            advice = "SEVERE JAGGEDNESS DETECTED. Fixed Civil Constraints forced into recovery windows. Burnout probability: CRITICAL.";
        } else if (tensionScore > 30) {
            advice = "MODERATE FRICTION. Civil logic overriding biological flow. Shift legacy meetings to Deep Flow sectors.";
        }

        return { score: Math.min(tensionScore, 99), advice: advice, constraints: constraintsCount };
    },

    injectCSS: function() {
        const style = document.createElement('style');
        style.innerHTML = `
            /* STATIC OMNI PALETTE DECOUPLING */
            .q-planner-overlay, .modal-overlay {
                --omni-main: #00f0ff;
                --omni-dim: rgba(0, 240, 255, 0.2);
                --omni-bg: #334155;
                --omni-bg-alpha: rgba(51, 65, 85, 0.95);
                --omni-bg-light: rgba(51, 65, 85, 0.4);
                --omni-text: #E5E4E2;
                --omni-warn: #ff003c;
            }

            .modal-overlay { position: fixed; top: 0; left: 0; width: 100vw; height: 100vh; background: rgba(15, 23, 36, 0.85); backdrop-filter: blur(10px); z-index: 999999; display: none; justify-content: center; align-items: center; }
            .modal-box { background: var(--omni-bg-alpha); border: 1px solid var(--omni-main); border-radius: 8px; padding: 25px; box-shadow: 0 20px 50px rgba(0,0,0,0.9); min-width: 300px; max-width: 90vw; text-align: center; font-family: 'JetBrains Mono'; color: var(--omni-text); pointer-events: auto; }
            .modal-head { font-family: 'Orbitron'; font-size: 1.2rem; font-weight: 900; color: var(--omni-main); margin-bottom: 15px; letter-spacing: 2px; }
            .btn-close { background: var(--omni-bg); border: 1px solid var(--omni-main); color: var(--omni-main); font-family: 'Orbitron'; font-weight: bold; padding: 10px 20px; cursor: pointer; border-radius: 4px; transition: 0.3s; margin-top: 20px; }
            .btn-close:hover { background: var(--omni-main); color: #000; box-shadow: 0 0 15px var(--omni-main); }

            /* PLANNER CSS */
            .q-planner-overlay { position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(15, 23, 36, 0.85); backdrop-filter: blur(10px); z-index: 10005; display: none; justify-content: center; align-items: center; }
            .q-planner-overlay.active { display: flex; }
            .q-planner-box { width: 95vw; height: 90vh; background: rgba(15, 23, 36, 0.98); border: 1px solid var(--omni-bg); border-radius: 12px; overflow: hidden; display: flex; flex-direction: column; box-shadow: 0 20px 50px rgba(0,0,0,0.9); pointer-events: auto; }
            
            .cal-header { display: flex; flex-direction: column; padding: 20px; border-bottom: 1px solid var(--omni-bg); background: var(--omni-bg-light); gap: 15px; }
            
            #cal-title-container { display: flex; justify-content: center; width: 100%; }
            
            .header-controls-row { display: flex; justify-content: center; align-items: center; width: 100%; flex-wrap: wrap; gap: 15px; }
            .step-nav-group { display: flex; justify-content: center; align-items: center; gap: 8px; }
            
            #action-btn-container { display: flex; justify-content: center; align-items: center; gap: 8px; }
            
            .cal-title-wrapper { display: flex; justify-content: center; align-items: center; gap: 20px; font-family: 'Orbitron'; font-size: 1.3rem; font-weight: 900; }
            .title-leg { color: var(--omni-text); letter-spacing: 2px; }
            .title-divider { color: rgba(229, 228, 226, 0.2); font-weight: normal; }
            .title-q { letter-spacing: 2px; }

            .planner-matrix { display: grid; gap: 4px; padding: 20px; flex-grow: 1; overflow-y: auto; }
            
            .q-planner-box *::-webkit-scrollbar { width: 6px; height: 6px; }
            .q-planner-box *::-webkit-scrollbar-track { background: rgba(51, 65, 85, 0.2); border-radius: 4px; }
            .q-planner-box *::-webkit-scrollbar-thumb { background: var(--omni-main); border-radius: 4px; }
            .q-planner-box *::-webkit-scrollbar-thumb:hover { filter: brightness(1.2); }

            .macro-hierarchy-nav { display: flex; gap: 5px; background: var(--omni-bg-light); padding: 4px; border-radius: 6px; border: 1px solid var(--omni-bg); }
            .macro-btn { background: transparent; border: 1px solid var(--omni-bg); color: var(--omni-text); font-family: 'Orbitron'; font-size: 0.65rem; padding: 6px 12px; cursor: pointer; font-weight: bold; border-radius: 4px; transition: 0.3s; }
            .macro-btn:hover { background: var(--omni-bg); color: var(--omni-text); }
            .macro-btn.active { background: var(--omni-main) !important; color: #000 !important; box-shadow: 0 0 10px var(--omni-main); border-color: var(--omni-main); }

            .p-day { background: rgba(51, 65, 85, 0.2); border-radius: 4px; padding: 10px; cursor: pointer; min-height: 80px; transition: all 0.3s; border: 1px solid transparent; display: flex; flex-direction: column; justify-content: flex-start; color: var(--omni-text); }
            .p-day:hover { background: rgba(51, 65, 85, 0.5); border-color: var(--omni-main); }
            .p-day.status-red { border-left: 3px solid var(--omni-warn); }
            
            .p-day.status-today { border: 1px dashed var(--omni-text); box-shadow: inset 0 0 10px rgba(229, 228, 226, 0.1); }
            .p-day.selected { border-color: var(--omni-main) !important; box-shadow: inset 0 0 20px var(--omni-dim) !important; background: rgba(51, 65, 85, 0.6); }
            
            .anchor-block { background: rgba(244, 208, 104, 0.05) !important; border: 1px solid rgba(244, 208, 104, 0.3) !important; display: flex; flex-direction: column; justify-content: center; align-items: center; text-align: center; }
            .anchor-block:hover { background: rgba(244, 208, 104, 0.15) !important; border-color: var(--gold, #F4D068) !important; box-shadow: 0 0 15px rgba(244, 208, 104, 0.2); }
            .anchor-block.selected { border-color: var(--gold, #F4D068) !important; box-shadow: inset 0 0 25px rgba(244, 208, 104, 0.5) !important; }

            .macro-grid-legacy { display: flex; flex-wrap: wrap; gap: 15px; padding: 20px; overflow-y: auto; justify-content: center; }
            .macro-month-box { background: rgba(51, 65, 85, 0.3); border-width: 1px; border-style: solid; border-color: var(--omni-bg); border-radius: 8px; padding: 10px; width: calc(33.333% - 15px); min-width: 250px; box-sizing: border-box; }
            .macro-month-title { font-family: 'Orbitron'; font-size: 0.75rem; margin-bottom: 8px; text-align: center; letter-spacing: 2px; font-weight: bold; border-bottom: 1px solid var(--omni-bg); padding-bottom: 4px; color: var(--omni-text); }
            
            .mini-cal-grid { display: grid; grid-template-columns: repeat(7, 1fr); border-top: 1px solid var(--omni-bg); border-left: 1px solid var(--omni-bg); border-radius: 4px; overflow: hidden; }
            .q-sector-grid { display: grid; border-top: 1px solid var(--omni-bg); border-left: 1px solid var(--omni-bg); border-radius: 4px; overflow: hidden; }
            .mini-day { aspect-ratio: 1; display: flex; justify-content: center; align-items: center; font-family: 'JetBrains Mono'; font-size: 0.55rem; background: rgba(51, 65, 85, 0.2); cursor: pointer; transition: 0.2s; border-right: 1px solid var(--omni-bg); border-bottom: 1px solid var(--omni-bg); color: var(--omni-text); box-sizing: border-box; }
            
            .mini-day:hover { background: rgba(51, 65, 85, 0.6); border-color: var(--omni-main); color: var(--omni-text); }
            .mini-day.selected { border-color: var(--omni-main) !important; background: var(--omni-main); color: #000; font-weight: bold; box-shadow: 0 0 10px var(--omni-main); z-index: 2;}
            .mini-day.status-today { border: 1px dashed var(--omni-text); z-index: 1;}

            .macro-grid-q { display: flex; flex-direction: column; gap: 15px; padding: 20px; overflow-y: auto; }
            .macro-quad-box { background: rgba(51, 65, 85, 0.3); border-width: 1px; border-style: solid; border-color: var(--omni-bg); border-radius: 8px; padding: 15px; box-sizing: border-box; }
            .macro-quad-title { font-family: 'Orbitron'; font-size: 0.85rem; margin-bottom: 10px; text-align: center; letter-spacing: 3px; font-weight: bold; border-bottom: 1px solid var(--omni-bg); padding-bottom: 6px; color: var(--omni-text); }
            
            .nav-btn { background: var(--omni-bg-light); border: 1px solid var(--omni-bg); color: var(--omni-main); padding: 6px 10px; font-family: 'Orbitron'; font-size: 0.65rem; font-weight: bold; cursor: pointer; border-radius: 4px; transition: 0.3s; }
            .nav-btn:hover { border-color: var(--omni-main); box-shadow: 0 0 10px var(--omni-dim); background: var(--omni-bg); }

            .planner-context { background: var(--omni-bg-light); border: 1px solid var(--omni-bg); padding: 15px; margin: 15px 20px 10px 20px; border-radius: 8px; display: flex; flex-direction: column; gap: 6px; align-items: center; text-align: center; }
            
            .back-btn, .close-planner-btn { background: transparent; border: 1px solid var(--omni-text); color: var(--omni-text); padding: 6px 12px; cursor: pointer; font-family: 'Orbitron'; font-size: 0.7rem; border-radius: 4px; transition: 0.3s; font-weight: bold; letter-spacing: 1px; }
            .back-btn:hover { background: var(--omni-bg); }
            .close-planner-btn { border-color: var(--omni-warn); color: var(--omni-warn); }
            .close-planner-btn:hover { background: rgba(255,0,60,0.1); color: var(--omni-text); }
            
            .editor-matrix { display: grid; grid-template-columns: 1fr 1fr; gap: 15px; padding: 20px; overflow-y: auto; }
            .slot-block { padding: 15px; background: var(--omni-bg-light); border-radius: 8px; border: 1px solid var(--omni-bg); transition: 0.3s; }
            .slot-block:focus-within { border-color: var(--omni-main); box-shadow: inset 0 0 10px var(--omni-dim); }
            
            .q-cal-jump { background: var(--omni-bg-light); border: 1px solid var(--omni-bg); color: var(--omni-main); font-family: 'Orbitron'; font-size: 0.65rem; padding: 6px 10px; border-radius: 4px; outline: none; text-align: center; color-scheme: dark; margin-left: 15px; cursor: pointer; transition: 0.3s; }
            .q-cal-jump:focus { border-color: var(--omni-main); }

            .time-block { display: flex; flex-direction: column; justify-content: space-between; padding: 15px 20px; border-bottom: 1px solid var(--omni-bg); font-family: 'JetBrains Mono'; color: var(--omni-text); position: relative; overflow: hidden; transition: 0.3s; z-index: 1; }
            .time-block:hover { background: rgba(51, 65, 85, 0.6); }
            
           /* BIO-WAVE TYPOGRAPHY ABSTRACTION */
            .time-block.flow-state, .time-block.vent-state, .time-block.sleep-state, .time-block.inertia-state, .time-block.dlmo-state { 
                border-left: none; background: transparent; 
            }
            .time-block.flow-state .wave-label { color: var(--env-green, #a7ff83) !important; text-shadow: 0 0 12px rgba(167, 255, 131, 0.6) !important; }
            .time-block.vent-state .wave-label { color: var(--sys-cyan, #00f0ff) !important; text-shadow: 0 0 12px rgba(0, 240, 255, 0.6) !important; }
            .time-block.sleep-state .wave-label { color: var(--bio-purple, #b829ff) !important; text-shadow: 0 0 12px rgba(184, 41, 255, 0.6) !important; }
            .time-block.inertia-state .wave-label { color: var(--chrono-amber, #B97A35) !important; text-shadow: 0 0 12px rgba(185, 122, 53, 0.6) !important; }
            .time-block.dlmo-state .wave-label { color: var(--bio-cobalt, #0055ff) !important; text-shadow: 0 0 12px rgba(0, 85, 255, 0.6) !important; }
            
            .tension-dashboard { background: var(--omni-bg-light); border: 1px dashed var(--omni-warn); border-radius: 6px; padding: 15px; margin: 15px 20px 0 20px; display: flex; justify-content: space-between; align-items: center; }
            .tension-score { font-family: 'Orbitron'; font-size: 1.5rem; font-weight: 900; color: var(--omni-warn); text-shadow: 0 0 15px rgba(255,0,60,0.3); }
            .consultant-advice { font-family: 'JetBrains Mono'; font-size: 0.65rem; color: rgba(229, 228, 226, 0.6); max-width: 60%; line-height: 1.4; }
            
            /* THE CAGE: Visual Friction Mapping */
            .fixed-civil-constraint { border: 2px dashed var(--omni-warn) !important; background: rgba(255,0,60,0.1) !important; box-shadow: inset 0 0 20px rgba(255,0,60,0.2), 0 0 10px rgba(255,0,60,0.4) !important; margin: 4px 10px; border-radius: 4px; position: relative; }
            .fixed-civil-constraint::before { content: ''; position: absolute; inset: 0; background: repeating-linear-gradient(45deg, transparent, transparent 10px, rgba(255,0,60,0.05) 10px, rgba(255,0,60,0.05) 20px); z-index: 0; pointer-events: none; }
            .fixed-civil-constraint > * { position: relative; z-index: 2; }
            
        @media (max-width: 950px) { 
            .planner-matrix { padding: 5px; gap: 2px; } 
            .editor-matrix { grid-template-columns: 1fr; padding: 10px; } 
            
            .p-day { min-height: 50px; padding: 4px; justify-content: center; align-items: center; }
            .p-day > div:first-child { font-size: 0.75rem !important; }
            .p-day > div:last-child { font-size: 0.4rem !important; margin-top: 2px !important; }

            .q-planner-box { width: 100vw; height: 100vh; border-radius: 0; border: none; padding-bottom: 75px; box-sizing: border-box; } 
            
            .cal-header { padding: 60px 10px 15px 10px; gap: 10px; display: flex !important; flex-direction: column; } 
            
            #cal-title-container { order: 1; padding: 0; margin-bottom: 0px; display: flex; justify-content: center; }
            .cal-title-wrapper { font-size: 1.1rem; gap: 8px; flex-wrap: nowrap; justify-content: center; }
            
            .cal-title-wrapper.show-legacy .title-q { display: none; }
            .cal-title-wrapper.show-legacy .title-divider { display: none; }
            .cal-title-wrapper.show-quad .title-leg { display: none; }
            .cal-title-wrapper.show-quad .title-divider { display: none; }

            .macro-hierarchy-nav { order: 2; display: grid !important; grid-template-columns: repeat(4, 1fr); gap: 6px; width: 100%; background: transparent; border: none; padding: 0; }
            .macro-btn { padding: 12px 0; font-size: 0.65rem; background: var(--omni-bg-light); border: 1px solid var(--omni-bg); }

            .step-nav-group { order: 3; display: grid !important; grid-template-columns: repeat(4, 1fr); gap: 6px; width: 100%; justify-content: stretch; }
            .nav-btn { padding: 12px 0; font-size: 0.55rem; margin: 0; text-align: center; white-space: nowrap; }
            
            .header-controls-row { display: contents; } 
            #action-btn-container { order: 4; display: grid !important; grid-template-columns: repeat(auto-fit, minmax(0, 1fr)); gap: 6px; width: 100%; margin: 0; }
            
            .back-btn, .close-planner-btn { padding: 12px 0; font-size: 0.6rem; margin: 0; text-align: center; display: flex; justify-content: center; align-items: center; border-radius: 4px; }

            .q-cal-jump { display: none !important; } 
            .vector-context-mobile-hide { display: none !important; }
            .macro-month-box { width: 100%; min-width: 0; } 
            
           .tension-dashboard { flex-direction: column; text-align: center; gap: 10px; margin: 10px; }
            .consultant-advice { max-width: 100%; }
            .time-block { padding: 10px; }
        }

        /* --- VECTOR HUD QUARANTINE --- */
        body.planner-quad-active .q-nav-bar,
        body.planner-quad-active .q-control-strip,
        body.planner-quad-active #mobile-telemetry-ribbon,
        body.planner-quad-active #q-mic-fab,
        body.planner-quad-active #q-mic-fab-desktop {
            display: none !important;
            opacity: 0 !important;
            pointer-events: none !important;
        }
        `;
        document.head.appendChild(style);
    },

    injectDOM: function() {
        const dom = document.createElement('div');
        dom.className = 'q-planner-overlay';
        dom.id = 'unified-omni-planner';
        
        dom.innerHTML = `
            <div class="q-planner-box" onclick="event.stopPropagation()">
                <div class="cal-header">
                    <div id="cal-title-container">
                        <div id="cal-title"></div>
                    </div>
                    <div class="header-controls-row">
                        <div class="macro-hierarchy-nav">
                            <button class="macro-btn" id="btn-view-day" onclick="window.Q_OmniPlanner.setViewMode('day')">DAY</button>
                            <button class="macro-btn" id="btn-view-sect" onclick="window.Q_OmniPlanner.setViewMode('sect')">SECT</button>
                            <button class="macro-btn" id="btn-view-quad" onclick="window.Q_OmniPlanner.setViewMode('quad')">QUAD</button>
                            <button class="macro-btn" id="btn-view-cycle" onclick="window.Q_OmniPlanner.setViewMode('cycle')">CYCL</button>
                        </div>
                        <div class="step-nav-group">
                            <button class="nav-btn" id="btn-step-sect-back" onclick="window.Q_OmniPlanner.stepSector(-1)">&#171; MONTH</button>
                            <button class="nav-btn" id="btn-step-day-back" onclick="window.Q_OmniPlanner.stepDay(-1)">&#8249; DAY</button>
                            <button class="nav-btn" id="btn-step-day-fwd" onclick="window.Q_OmniPlanner.stepDay(1)">DAY &#8250;</button>
                            <button class="nav-btn" id="btn-step-sect-fwd" onclick="window.Q_OmniPlanner.stepSector(1)">MONTH &#187;</button>
                            <input type="date" class="q-cal-jump" id="planner-jump-input" onchange="window.Q_OmniPlanner.jumpToDate(this.value)">
                        </div>
                        <div id="action-btn-container"></div>
                    </div>
                </div>
                <div id="planner-context-wrapper"></div>
                <div id="planner-body" style="flex-grow:1; display:flex; flex-direction:column; min-height:0; overflow:hidden;"></div>
            </div>
        `;
        document.body.appendChild(dom);
    },

    openPlanner: function(isResume = false) {
        if(!isResume) {
            const state = window.getSimState();
            this.selectedDate = window.ANCHOR_ALPHA_DYNAMIC ? state.simTime : Date.now();
            this.plannerBase = this.selectedDate;
            this.viewState = 'planner';
            this.plannerMacroMode = 'sect';
        }
        
        sessionStorage.setItem('Q_PLANNER_ACTIVE', 'true');
        sessionStorage.setItem('Q_PLANNER_TIME', this.plannerBase);
        sessionStorage.setItem('Q_PLANNER_STATE', this.viewState);
        sessionStorage.setItem('Q_PLANNER_MACRO', this.plannerMacroMode);
        sessionStorage.setItem('Q_PLANNER_SELECTED_DATE', this.selectedDate);
        
        document.getElementById('unified-omni-planner').classList.add('active');
        this.refreshView();
    },

    closePlanner: function() { 
        this.viewState = 'closed';
        sessionStorage.setItem('Q_PLANNER_ACTIVE', 'false');
        document.body.classList.remove('planner-quad-active'); 
        const dom = document.getElementById('unified-omni-planner');
        if (dom) dom.classList.remove('active'); 
    },

    jumpToDate: function(val) {
        if(!val) return;
        const parts = val.split('-');
        const targetMs = new Date(parts[0], parts[1] - 1, parts[2], 12, 0, 0).getTime();
        this.plannerBase = targetMs;
        this.selectedDate = targetMs;
        
        const payload = JSON.stringify({ isLive: false, simTime: targetMs, scrubSpeed: 0 });
        localStorage.setItem('Q_MASTER_CLOCK', payload);
        
        this.viewState = 'planner';
        this.plannerMacroMode = 'sect';
        sessionStorage.setItem('Q_PLANNER_TIME', this.plannerBase);
        sessionStorage.setItem('Q_PLANNER_STATE', this.viewState);
        sessionStorage.setItem('Q_PLANNER_MACRO', this.plannerMacroMode);
        sessionStorage.setItem('Q_PLANNER_SELECTED_DATE', this.selectedDate);
        this.refreshView();
    },

   toggleSubstrate: function(target) {
        if (target === 'legacy') this.showLegacyBase = !this.showLegacyBase;
        if (target === 'orbital') this.showOrbitalBase = !this.showOrbitalBase;
        if (target === 'biometric') this.showBiometricBase = !this.showBiometricBase;

        // Automatically preserve structural logic for standard single-view states
        this.isLegacy = this.showLegacyBase; 
        
        this.plannerBase = this.selectedDate; 
        this.refreshView(); 
    },

    renderContextBanner: function() {
        const wrapper = document.getElementById('planner-context-wrapper');
        if (this.viewState !== 'planner' || !this.selectedDate) {
            wrapper.innerHTML = '';
            return;
        }
        
        const contextDiv = document.createElement('div');
        contextDiv.className = 'planner-context';
        
        let cTitle = ""; let cDesc = "";
        
        if (this.isLegacy) {
            cTitle = ""; cDesc = "";
        } else {
            let activeBlock = window.getQBlockByTime(this.selectedDate);
            if(activeBlock && activeBlock.isAnchor) {
                cTitle = `[ SETTLEMENT NODE: ${activeBlock.name} ]`;
                cDesc = `OPERATIONAL BUFFER. Actively resolving accumulated physical drift. Q-Delta interpolating to 0.0000° across ${(activeBlock.dur / 3600000).toFixed(4)} hours.`;
                contextDiv.style.borderColor = 'var(--gold)';
            } else if (activeBlock) {
                let daysElapsed = (this.selectedDate - window.ANCHOR_ALPHA_DYNAMIC) / window.MS_DAY;
                let oData = window.getOrbitalData(daysElapsed);
                let driftDeg = oData.trueArc - oData.meanArc;
                let driftColor = driftDeg > 0 ? 'var(--omni-warn)' : 'var(--omni-main)';
                let driftState = driftDeg > 0 ? "AHEAD" : "BEHIND";
                cDesc = `<span style="color:var(--gold);">DRIFT:</span> TRUE ELLIPSE ${driftState} <span style="color:${driftColor};">| ${(driftDeg>0?'+':'')}${driftDeg.toFixed(4)}°</span>`;
            }
        }
        
        let htmlStr = '';
        if (cTitle) {
            let titleColor = (!this.isLegacy && cTitle.includes('NODE')) ? 'var(--gold)' : 'var(--omni-main)';
            htmlStr += `<div style="font-family:'Orbitron'; font-size:0.9rem; color:${titleColor}; font-weight:bold; letter-spacing:1px;">${cTitle}</div>`;
        }
        if (cDesc) {
            htmlStr += `<div style="font-family:'JetBrains Mono'; font-size:0.65rem; color:rgba(229, 228, 226, 0.6); line-height: 1.4; margin-bottom:6px;">${cDesc}</div>`;
        }
        
        contextDiv.innerHTML = htmlStr;
        wrapper.innerHTML = '';
        if (cTitle || cDesc) wrapper.appendChild(contextDiv);
    },

    refreshView: function() {
        const jumpInput = document.getElementById('planner-jump-input');
        if (jumpInput && this.selectedDate) {
            const dateObj = new Date(this.selectedDate);
            jumpInput.value = `${dateObj.getFullYear()}-${(dateObj.getMonth()+1).toString().padStart(2,'0')}-${dateObj.getDate().toString().padStart(2,'0')}`;
        }

        const btnBack = document.getElementById('btn-step-sect-back');
        const btnFwd = document.getElementById('btn-step-sect-fwd');
        if (btnBack && btnFwd) {
            btnBack.innerHTML = this.isLegacy ? "&#171; MONTH" : "&#171; SECT";
            btnFwd.innerHTML = this.isLegacy ? "MONTH &#187;" : "SECT &#187;";
        }

        const btnDayBack = document.getElementById('btn-step-day-back');
        const btnDayFwd = document.getElementById('btn-step-day-fwd');
        if (btnDayBack) btnDayBack.innerHTML = this.isLegacy ? "&#8249; DAY" : "&#8249; DEG";
        if (btnDayFwd) btnDayFwd.innerHTML = this.isLegacy ? "DAY &#8250;" : "DEG &#8250;";

        if (!this.isLegacy && this.viewState !== 'closed') {
            document.body.classList.add('planner-quad-active');
        } else {
            document.body.classList.remove('planner-quad-active');
        }

        const labels = {
            day: this.isLegacy ? "DAY" : "DEG",
            sect: this.isLegacy ? "MONTH" : "SECT",
            quad: this.isLegacy ? "QTR" : "QUAD",
            cycle: this.isLegacy ? "YEAR" : "CYCL"
        };

        ['day', 'sect', 'quad', 'cycle'].forEach(mode => {
            const btn = document.getElementById(`btn-view-${mode}`);
            if(btn) {
                btn.innerText = labels[mode];
                if(this.viewState === 'day' || this.viewState === 'hour') {
                    btn.classList.toggle('active', mode === 'day');
                } else {
                    btn.classList.toggle('active', mode === this.plannerMacroMode);
                }
            }
        });

        const body = document.getElementById('planner-body'); 
        const title = document.getElementById('cal-title'); 
        const actionContainer = document.getElementById('action-btn-container');

        body.innerHTML = ''; 
        if (actionContainer) actionContainer.innerHTML = '';

       if (actionContainer) {
            const createToggle = (label, active, clickTarget, activeColor) => {
                const btn = document.createElement('button');
                btn.className = 'back-btn';
                btn.style.color = active ? '#000' : activeColor;
                btn.style.backgroundColor = active ? activeColor : 'transparent';
                btn.style.borderColor = activeColor;
                btn.style.marginRight = '4px';
                btn.innerText = label;
                btn.onclick = () => this.toggleSubstrate(clickTarget);
                return btn;
            };

            const legBtn = createToggle('LEGACY Base', this.showLegacyBase, 'legacy', 'var(--omni-text)');
            const orbBtn = createToggle('ORBITAL Base', this.showOrbitalBase, 'orbital', 'var(--sys-cyan, #00f0ff)');
            const bioBtn = createToggle('BIOMETRIC Base', this.showBiometricBase, 'biometric', 'var(--env-green, #a7ff83)');

            actionContainer.appendChild(legBtn);
            actionContainer.appendChild(orbBtn);
            actionContainer.appendChild(bioBtn);

            // Reconstruct view routing logic conditions based on the truth-table rules
            const activeCount = (this.showLegacyBase?1:0) + (this.showOrbitalBase?1:0) + (this.showBiometricBase?1:0);
            
            // Re-mount the legend strictly when Biometric is running in any view state
            if (this.showBiometricBase) {
                const legend = document.createElement('div');
                legend.style.cssText = 'display:flex; gap:10px; margin-left:15px; align-items:center; font-family:"Orbitron"; font-size:0.55rem; font-weight:bold;';
                legend.innerHTML = `
                    <span style="color:var(--env-green, #a7ff83);">DEEP FLOW</span>
                    <span style="color:var(--sys-cyan, #00f0ff);">VENT/RECOVERY</span>
                    <span style="color:var(--bio-purple, #b829ff);">SLEEP</span>
                    <span style="color:var(--chrono-amber, #B97A35);">INERTIA</span>
                    <span style="color:var(--bio-cobalt, #0055ff);">DLMO</span>
                `;
                actionContainer.appendChild(legend);
            }
            
            if(this.viewState !== 'planner') {
                const hardBackBtn = document.createElement('button');
                hardBackBtn.className = 'back-btn';
                hardBackBtn.innerText = 'BACK';
                hardBackBtn.onclick = () => {
                    if(this.viewState === 'hour') { this.viewState = 'day'; }
                    else if(this.viewState === 'day') { this.viewState = 'planner'; }
                    sessionStorage.setItem('Q_PLANNER_STATE', this.viewState);
                    this.refreshView();
                };
                actionContainer.appendChild(hardBackBtn);
            }
            
            const closeBtn = document.createElement('button');
            closeBtn.className = 'close-planner-btn';
            closeBtn.innerText = 'CLOSE';
            closeBtn.onclick = () => this.closePlanner();
            actionContainer.appendChild(closeBtn);
        }

        this.renderContextBanner();

     // --- TRUTH TABLE ROUTING MATRIX ---
        const L = this.showLegacyBase;
        const O = this.showOrbitalBase;
        const B = this.showBiometricBase;
        
        this.showBioWave = B; // Sync wave state for micro-views

        if (!L && !O && !B) {
            // 000: THE VOID
            title.innerHTML = `<div class="cal-title-wrapper"><div class="title-q" style="color:rgba(229,228,226,0.3);">METROLOGICAL VOID</div></div>`;
            body.innerHTML = `<div style="display:flex; justify-content:center; align-items:center; height:100%; color:rgba(229, 228, 226, 0.2); font-family:'Orbitron'; font-size:1.5rem; letter-spacing:4px; font-weight:bold;">NO SUBSTRATE SELECTED</div>`;
            return;
        }

        if (L && O && B) {
            // 111: UNIFIED MACRO
            this.renderUnified(body, title);
        } else if (L && O && !B) {
            // 110: STRUCTURAL COMPARISON (OPTION B)
            this.renderStructuralComparison(body, title);
        } else if (!L && !O && B) {
            // 001: PURE BIOMETRIC ISOLATION
            this.renderUnified(body, title);
        } else {
            // 100, 010, 101, 011: MICRO-VIEWS
            this.isLegacy = L; 
            
            if(this.viewState === 'planner') { 
                if (this.plannerMacroMode === 'sect') this.renderSector(body, title); 
                else if (this.plannerMacroMode === 'quad') this.renderQuad(body, title);
                else this.renderCycle(body, title);
            } 
            else if(this.viewState === 'day') this.renderDay(body, title); 
            else this.renderHour(body, title); 
        }
    },

    injectHolidays: function(element, date) {
        if (!window.ANCHOR_ALPHA_DYNAMIC || !window.getGlobalHolidays) return;
        
        const year = date.getFullYear();
        const month = date.getMonth();
        const day = date.getDate();
        const utcNoonMs = Date.UTC(year, month, day, 12, 0, 0);
        
        const daysElapsed = (utcNoonMs - window.ANCHOR_ALPHA_DYNAMIC) / window.MS_DAY;
        const o = window.getOrbitalData(daysElapsed);
        const dayArc = o.meanArc;
        
        const allEvents = window.getGlobalHolidays(year);
        const degreesPerDay = 360 / 365.24219;
        
        const matches = allEvents.filter(e => {
            let diff = dayArc - e.coord; 
            if (diff < -180) diff += 360;
            if (diff > 180) diff -= 360;
            
            let durationDeg = (e.durationDays || 1) * degreesPerDay;
            return (diff >= 0 && diff < durationDeg); 
        });

        matches.forEach(match => {
            const tag = document.createElement('div');
            tag.className = 's-tag';
            tag.style.cssText = 'font-size:0.55rem; color:#F4D068; margin-top:6px; font-family:"JetBrains Mono"; font-weight:bold; text-shadow:0 0 5px rgba(0,0,0,0.8);';
            tag.innerText = `${match.glyph || ''} ${match.name.toUpperCase()}`;
            element.appendChild(tag);
        });
    },

    renderSector: function(container, title) {
        const matrix = document.createElement('div'); 
        matrix.className = 'planner-matrix';
        const selectedDateNum = new Date(this.selectedDate).setHours(0,0,0,0);
        const nowMs = Date.now();
        const todayDateNum = new Date(nowMs).setHours(0,0,0,0);

        title.innerHTML = window.getDualTitle(this.selectedDate, this.isLegacy);

        if (this.isLegacy) {
            const baseDate = new Date(this.plannerBase);
            const year = baseDate.getFullYear(); const month = baseDate.getMonth();
            matrix.style.gridTemplateColumns = 'repeat(7, 1fr)';
            const days = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];
            days.forEach(d => { const h = document.createElement('div'); h.style.textAlign = 'center'; h.style.fontSize = '0.65rem'; h.style.color = 'rgba(229, 228, 226, 0.6)'; h.style.fontFamily = 'JetBrains Mono'; h.innerText = window.innerWidth <= 768 ? d[0] : d; matrix.appendChild(h); });

            const firstDay = new Date(year, month, 1); const lastDay = new Date(year, month + 1, 0); const startPad = firstDay.getDay();
            for(let i=0; i<startPad; i++) { matrix.appendChild(document.createElement('div')); }
            for(let i=1; i<=lastDay.getDate(); i++) {
                const d = document.createElement('div'); d.className = 'p-day'; const localTs = new Date(year, month, i).getTime();
                
                if(window.hasDataInDay(new Date(localTs))) d.classList.add('status-red');
                if(new Date(localTs).setHours(0,0,0,0) === todayDateNum) d.classList.add('status-today');
                if(new Date(localTs).setHours(0,0,0,0) === selectedDateNum) d.classList.add('selected');
                
                d.innerHTML = `<div style="font-family:Orbitron; font-weight:bold; color:var(--omni-text); font-size: 1rem;">${i}</div>`;
                
                this.injectHolidays(d, new Date(localTs));

                d.onclick = () => { this.selectedDate = localTs; this.setViewMode('day'); };
                matrix.appendChild(d);
            }
        } else {
            matrix.style.gridTemplateColumns = 'repeat(5, 1fr)'; 
            let activeBlock = window.getQBlockByTime(this.plannerBase);
            if(!activeBlock) return;
            
            let aQuad = activeBlock.quad || 1;
            let aSect = activeBlock.sect || 1;
            let cCycle = activeBlock.cycle;
            
            let gridItems = window.Q_BLOCKS.filter(b => b.quad === aQuad && b.sect === aSect);

            gridItems.forEach(item => {
                const absStart = window.ANCHOR_ALPHA_DYNAMIC + (cCycle * window.Q_YEAR_MS) + item.relStart;
                const d = document.createElement('div');
                const isToday = (nowMs >= absStart && nowMs < absStart + item.dur);
                
                if (item.isAnchor) {
                    d.className = 'p-day anchor-block';
                } else {
                    d.className = 'p-day';
                }
                
                if (isToday) d.classList.add('status-today');
                if (this.selectedDate >= absStart && this.selectedDate < absStart + item.dur) d.classList.add('selected');
                if (window.hasDataInBlock && window.hasDataInBlock(cCycle, item.absDeg)) d.classList.add('status-red');
                
                if (item.isAnchor) {
                     d.innerHTML = `<div style="font-family:Orbitron; font-weight:bold; color:var(--gold, #F4D068); font-size:0.75rem; text-align:center;">${item.name}</div><div style="font-size:0.55rem; color:rgba(229, 228, 226, 0.6); margin-top:4px; font-weight:bold;">DEG ${item.deg}</div>`;
                } else {
                     d.innerHTML = `<div style="font-family:Orbitron; font-weight:bold; color:var(--omni-main); text-align:center;">DEG ${item.deg}</div>`;
                }
                
                this.injectHolidays(d, new Date(absStart));
                
                d.onclick = () => { this.selectedDate = absStart; this.setViewMode('day'); };
                matrix.appendChild(d);
            });
        }
        container.appendChild(matrix);
    },

    renderQuad: function(container, title) {
        const nowMs = Date.now();
        const todayDateNum = new Date(nowMs).setHours(0,0,0,0);
        const selectedDateNum = new Date(this.selectedDate).setHours(0,0,0,0);

        if (this.isLegacy) {
            title.innerHTML = `<div class="cal-title-wrapper show-legacy"><div class="title-leg">LEGACY OS: QUARTER VIEW</div></div>`;
            const baseDate = new Date(this.plannerBase);
            const year = baseDate.getFullYear();
            const currentMonth = baseDate.getMonth();
            const quarterStartMonth = Math.floor(currentMonth / 3) * 3;
            const months = ["JANUARY", "FEBRUARY", "MARCH", "APRIL", "MAY", "JUNE", "JULY", "AUGUST", "SEPTEMBER", "OCTOBER", "NOVEMBER", "DECEMBER"];
            const daysOfWeek = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
            
            const matrix = document.createElement('div');
            matrix.className = 'macro-grid-legacy';
            
            for(let m = quarterStartMonth; m < quarterStartMonth + 3; m++) {
                const monthBox = document.createElement('div');
                monthBox.className = 'macro-month-box';
                monthBox.innerHTML = `<div class="macro-month-title">${months[m]} ${year}</div>`;
                
                const grid = document.createElement('div');
                grid.className = 'mini-cal-grid';
                daysOfWeek.forEach(dayName => {
                    const header = document.createElement('div');
                    header.className = 'mini-day';
                    header.style.fontWeight = 'bold';
                    header.style.pointerEvents = 'none';
                    header.innerText = dayName;
                    grid.appendChild(header);
                });
                
                const firstDay = new Date(year, m, 1); 
                const lastDay = new Date(year, m + 1, 0); 
                const startPad = firstDay.getDay();
                
                for(let i=0; i<startPad; i++) { grid.appendChild(document.createElement('div')); }
                for(let i=1; i<=lastDay.getDate(); i++) {
                    const d = document.createElement('div'); 
                    d.className = 'mini-day'; 
                    d.innerText = i;
                    const localTs = new Date(year, m, i).getTime();
                    if(new Date(localTs).setHours(0,0,0,0) === todayDateNum) d.classList.add('status-today');
                    if(new Date(localTs).setHours(0,0,0,0) === selectedDateNum) d.classList.add('selected');
                    d.onclick = () => { this.selectedDate = localTs; this.setViewMode('day'); };
                    grid.appendChild(d);
                }
                monthBox.appendChild(grid);
                matrix.appendChild(monthBox);
            }
            container.appendChild(matrix);
       } else {
            title.innerHTML = `<div class="cal-title-wrapper show-quad"><div class="title-q"><span style="color:var(--gold, #F4D068);">QUADRATURE:</span> <span style="color:var(--omni-text);">ORBITAL LEDGER</span></div></div>`;
            
            let activeBlock = window.getQBlockByTime(this.plannerBase);
            if(!activeBlock) return;
            let aQuad = activeBlock.quad || 1;
            let cCycle = activeBlock.cycle;
            
            const matrix = document.createElement('div');
            matrix.className = 'macro-grid-q';
            
            const quadBox = document.createElement('div');
            quadBox.className = 'macro-quad-box';
            quadBox.innerHTML = `<div class="macro-quad-title">QUADRANT ${aQuad}</div>`;
            
            const sectorsWrapper = document.createElement('div');
            sectorsWrapper.style.cssText = 'display:flex; flex-wrap:wrap; gap:15px; justify-content:center;';
            
            for(let s = 1; s <= 3; s++) {
                const sectorBox = document.createElement('div');
                sectorBox.className = 'macro-month-box';
                sectorBox.innerHTML = `<div class="macro-month-title">SECTOR ${s}</div>`;
                
                const qGrid = document.createElement('div');
                qGrid.className = 'q-sector-grid';
                qGrid.style.gridTemplateColumns = 'repeat(5, 1fr)';
                
                let dayBlocks = window.Q_BLOCKS.filter(b => b.quad === aQuad && b.sect === s);
                dayBlocks.forEach(item => {
                    const absStart = window.ANCHOR_ALPHA_DYNAMIC + (cCycle * window.Q_YEAR_MS) + item.relStart;
                    const isToday = (nowMs >= absStart && nowMs < absStart + item.dur);
                    const d = document.createElement('div'); 
                    d.className = 'mini-day'; 
                    if (item.isAnchor) {
                        d.style.background = 'rgba(244, 208, 104, 0.2)';
                        d.style.color = '#F4D068';
                        d.innerText = "A";
                    } else {
                        d.innerText = item.deg;
                    }
                    if(isToday) d.classList.add('status-today');
                    if(this.selectedDate >= absStart && this.selectedDate < absStart + item.dur) d.classList.add('selected');
                    d.onclick = () => { this.selectedDate = absStart; this.setViewMode('day'); };
                    qGrid.appendChild(d);
                });
                sectorBox.appendChild(qGrid);
                sectorsWrapper.appendChild(sectorBox);
            }
            quadBox.appendChild(sectorsWrapper);
            matrix.appendChild(quadBox);
            container.appendChild(matrix);
        }
    },

    renderCycle: function(container, title) {
        const nowMs = Date.now();
        const todayDateNum = new Date(nowMs).setHours(0,0,0,0);
        const selectedDateNum = new Date(this.selectedDate).setHours(0,0,0,0);

        if (this.isLegacy) {
            title.innerHTML = `<div class="cal-title-wrapper show-legacy"><div class="title-leg">LEGACY OS: ANNUAL CYCLE</div></div>`;
            const baseDate = new Date(this.plannerBase);
            const year = baseDate.getFullYear();
            const months = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"];
            const daysOfWeek = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
            
            const matrix = document.createElement('div');
            matrix.className = 'macro-grid-legacy';
            
            for(let m = 0; m < 12; m++) {
                const monthBox = document.createElement('div');
                monthBox.className = 'macro-month-box';
                monthBox.innerHTML = `<div class="macro-month-title">${months[m]}</div>`;
                
                const grid = document.createElement('div');
                grid.className = 'mini-cal-grid';
                daysOfWeek.forEach(dayName => {
                    const header = document.createElement('div');
                    header.className = 'mini-day';
                    header.style.fontWeight = 'bold';
                    header.style.pointerEvents = 'none';
                    header.innerText = dayName;
                    grid.appendChild(header);
                });
                
                const firstDay = new Date(year, m, 1); 
                const lastDay = new Date(year, m + 1, 0); 
                const startPad = firstDay.getDay();
                
                for(let i=0; i<startPad; i++) { grid.appendChild(document.createElement('div')); }
                for(let i=1; i<=lastDay.getDate(); i++) {
                    const d = document.createElement('div'); 
                    d.className = 'mini-day'; 
                    d.innerText = i;
                    const localTs = new Date(year, m, i).getTime();
                    if(new Date(localTs).setHours(0,0,0,0) === todayDateNum) d.classList.add('status-today');
                    if(new Date(localTs).setHours(0,0,0,0) === selectedDateNum) d.classList.add('selected');
                    d.onclick = () => { this.selectedDate = localTs; this.setViewMode('day'); };
                    grid.appendChild(d);
                }
                monthBox.appendChild(grid);
                matrix.appendChild(monthBox);
            }
            container.appendChild(matrix);
        } else {
            let activeBlock = window.getQBlockByTime(this.plannerBase);
            if(!activeBlock) return;
            let cCycle = activeBlock.cycle;
            title.innerHTML = `<div class="cal-title-wrapper show-quad"><div class="title-q"><span style="color:var(--gold, #F4D068);">QUADRATURE:</span> <span style="color:var(--omni-text);">CYCLE ${cCycle}</span></div></div>`;
            
            const matrix = document.createElement('div');
            matrix.className = 'macro-grid-q';
            
            for(let q = 1; q <= 4; q++) {
                const quadBox = document.createElement('div');
                quadBox.className = 'macro-quad-box';
                quadBox.innerHTML = `<div class="macro-quad-title">QUADRANT ${q}</div>`;
                
                const sectorsWrapper = document.createElement('div');
                sectorsWrapper.style.cssText = 'display:flex; flex-wrap:wrap; gap:15px; justify-content:center;';
                
                for(let s = 1; s <= 3; s++) {
                    const sectorBox = document.createElement('div');
                    sectorBox.className = 'macro-month-box';
                    sectorBox.innerHTML = `<div class="macro-month-title">SECTOR ${s}</div>`;
                    
                    const qGrid = document.createElement('div');
                    qGrid.className = 'q-sector-grid';
                    qGrid.style.gridTemplateColumns = 'repeat(5, 1fr)';
                    
                    let dayBlocks = window.Q_BLOCKS.filter(b => b.quad === q && b.sect === s);
                    dayBlocks.forEach(item => {
                        const absStart = window.ANCHOR_ALPHA_DYNAMIC + (cCycle * window.Q_YEAR_MS) + item.relStart;
                        const isToday = (nowMs >= absStart && nowMs < absStart + item.dur);
                        const d = document.createElement('div'); 
                        d.className = 'mini-day'; 
                        if (item.isAnchor) {
                            d.style.background = 'rgba(244, 208, 104, 0.2)';
                            d.style.color = '#F4D068';
                            d.innerText = "A";
                        } else {
                            d.innerText = item.deg;
                        }
                        if(isToday) d.classList.add('status-today');
                        if(this.selectedDate >= absStart && this.selectedDate < absStart + item.dur) d.classList.add('selected');
                        d.onclick = () => { this.selectedDate = absStart; this.setViewMode('day'); };
                        qGrid.appendChild(d);
                    });
                    sectorBox.appendChild(qGrid);
                    sectorsWrapper.appendChild(sectorBox);
                }
                quadBox.appendChild(sectorsWrapper);
                matrix.appendChild(quadBox);
            }
            container.appendChild(matrix);
        }
    },
renderStructuralComparison: function(container, title) {
        title.innerHTML = `<div class="cal-title-wrapper show-quad"><div class="title-q"><span style="color:var(--omni-warn);">STRUCTURAL COMPARISON</span> <span style="color:var(--omni-text);">[ L + O METROLOGY ]</span></div></div>`;

        let activeBlock = window.getQBlockByTime(this.plannerBase);
        if(!activeBlock) return;
        let cCycle = activeBlock.cycle;

        const matrix = document.createElement('div');
        matrix.className = 'macro-grid-q';
        matrix.style.flexDirection = 'row';
        matrix.style.flexWrap = 'wrap';
        matrix.style.justifyContent = 'center';

        // High-contrast, low-opacity palette to differentiate the 12 irregular months
        const monthColors = [
            'rgba(255, 0, 60, 0.45)',   // JAN
            'rgba(255, 165, 0, 0.45)',  // FEB
            'rgba(244, 208, 104, 0.45)',// MAR
            'rgba(167, 255, 131, 0.45)',// APR
            'rgba(0, 240, 255, 0.45)',  // MAY
            'rgba(0, 85, 255, 0.45)',   // JUN
            'rgba(184, 41, 255, 0.45)', // JUL
            'rgba(255, 0, 255, 0.45)',  // AUG
            'rgba(255, 105, 180, 0.45)',// SEP
            'rgba(185, 122, 53, 0.45)', // OCT
            'rgba(128, 128, 128, 0.45)',// NOV
            'rgba(255, 255, 255, 0.35)' // DEC
        ];
        
        const monthNames = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"];

        const legend = document.createElement('div');
        legend.style.cssText = 'width: 100%; display: flex; flex-wrap: wrap; justify-content: center; gap: 12px; margin-bottom: 10px; padding: 10px; background: rgba(51, 65, 85, 0.2); border-radius: 8px; border: 1px solid var(--omni-bg);';
        monthNames.forEach((m, i) => {
            legend.innerHTML += `<div style="display:flex; align-items:center; gap:6px; font-family:'JetBrains Mono'; font-size:0.65rem; color:var(--omni-text); font-weight:bold;"><div style="width:12px; height:12px; background:${monthColors[i]}; border-radius:2px; border:1px solid rgba(255,255,255,0.2);"></div>${m}</div>`;
        });
        matrix.appendChild(legend);

        for(let q = 1; q <= 4; q++) {
            for(let s = 1; s <= 3; s++) {
                const sectorBox = document.createElement('div');
                sectorBox.className = 'macro-month-box';
                sectorBox.style.width = 'calc(25% - 15px)'; 
                sectorBox.style.minWidth = '220px';
                sectorBox.innerHTML = `<div class="macro-month-title" style="color:var(--sys-cyan); border-bottom-color:var(--sys-cyan);">Q${q} - SECTOR ${s}</div>`;
                
                const qGrid = document.createElement('div');
                qGrid.className = 'q-sector-grid';
                qGrid.style.gridTemplateColumns = 'repeat(5, 1fr)';
                
                let dayBlocks = window.Q_BLOCKS.filter(b => b.quad === q && b.sect === s);
                dayBlocks.forEach(item => {
                    const absStart = window.ANCHOR_ALPHA_DYNAMIC + (cCycle * window.Q_YEAR_MS) + item.relStart;
                    const blockDate = new Date(absStart);
                    const gMonth = blockDate.getMonth();
                    
                    const d = document.createElement('div'); 
                    d.className = 'mini-day'; 
                    d.style.background = monthColors[gMonth];
                    d.style.color = '#fff';
                    d.style.fontWeight = 'bold';
                    d.style.textShadow = '0 0 6px #000';
                    d.style.borderRight = '1px solid rgba(255,255,255,0.1)';
                    d.style.borderBottom = '1px solid rgba(255,255,255,0.1)';
                    
                    if (item.isAnchor) {
                        d.style.border = '2px solid var(--gold, #F4D068)';
                        d.innerText = "A";
                    } else {
                        d.innerText = item.deg;
                    }
                    
                    if(Date.now() >= absStart && Date.now() < absStart + item.dur) d.classList.add('status-today');
                    if(this.selectedDate >= absStart && this.selectedDate < absStart + item.dur) d.classList.add('selected');
                    d.onclick = () => { this.selectedDate = absStart; this.setViewMode('day'); };
                    
                    qGrid.appendChild(d);
                });
                sectorBox.appendChild(qGrid);
                matrix.appendChild(sectorBox);
            }
        }
        container.appendChild(matrix);
    },   renderDay: function(container, title) {
        title.innerHTML = window.getDualTitle(this.selectedDate, this.isLegacy);
        
        let savedAnchor = localStorage.getItem('q_bio_anchor');
        let anchorMins = (savedAnchor === null || savedAnchor === "") ? 0 : parseInt(savedAnchor); 
        let cycleDuration = parseInt(localStorage.getItem('q_bio_duration')) || 90; 
        let sleepDuration = parseInt(localStorage.getItem('q_sleep_cycle_duration')) || 450;
        let wakingDurationMins = 1440 - sleepDuration;
        let inertiaMins = 45;
        let dlmoMins = 90;

        if (this.isLegacy) {
            const list = document.createElement('div'); 
            list.style.overflowY = "auto"; list.style.flexGrow = "1";
            let dailyBlocksData = [];
            const selectedDateObj = new Date(this.selectedDate);
            
            for(let h=0; h<24; h++) {
                const blockMs = new Date(selectedDateObj.getFullYear(), selectedDateObj.getMonth(), selectedDateObj.getDate(), h, 0, 0).getTime();
                const key = window.getDataKey(selectedDateObj, h, 0);
                const data = window.qData[key] || { text: "" };
                
                let d = new Date(blockMs);
                let currentMinsFromMidnight = (d.getHours() * 60) + d.getMinutes();
                let minsSinceWake = (currentMinsFromMidnight - anchorMins + 1440) % 1440;
                
                let currentBioState;
                if (minsSinceWake >= wakingDurationMins) currentBioState = "SLEEP / RECOVERY";
                else if (minsSinceWake < inertiaMins) currentBioState = "SLEEP INERTIA";
                else if (minsSinceWake >= wakingDurationMins - dlmoMins) currentBioState = "DLMO WIND-DOWN";
                else {
                    let coreMins = minsSinceWake - inertiaMins;
                    let cyclePosFloat = (coreMins % cycleDuration) / cycleDuration;
                    currentBioState = (cyclePosFloat < 0.77) ? "DEEP FLOW" : "VENT/RECOVERY";
                }
                dailyBlocksData.push({ hour: h, text: data.text, bioState: currentBioState, key: key, ms: blockMs });
            }
            
            const tensionData = this.calculateCivilTension(dailyBlocksData);
           const dashboard = document.createElement('div');
            dashboard.innerHTML = `
                <div class="tension-dashboard">
                    <div style="display:flex; flex-direction:column;">
                        <span style="font-family:'Orbitron'; font-size:0.6rem; color:rgba(229, 228, 226, 0.6);">CIVIL TENSION SCORE</span>
                        <span class="tension-score">${tensionData.score}%</span>
                    </div>
                    <div class="consultant-advice">${tensionData.advice}</div>
                </div>
            `;
            list.appendChild(dashboard);

            const matrix = document.createElement('div');
            matrix.className = 'editor-matrix';
            matrix.style.paddingTop = '10px';

           dailyBlocksData.forEach(b => {
                const isCivilConstraint = b.text.includes('[FIXED]') || b.text.includes('[CIVIL]');
                let blockClass = '';
                
                if (this.showBioWave) {
                    if (b.bioState === 'DEEP FLOW') blockClass += ' flow-state';
                    else if (b.bioState === 'SLEEP / RECOVERY') blockClass += ' sleep-state';
                    else if (b.bioState === 'SLEEP INERTIA') blockClass += ' inertia-state';
                    else if (b.bioState === 'DLMO WIND-DOWN') blockClass += ' dlmo-state';
                    else blockClass += ' vent-state';
                }
                
                if (isCivilConstraint) blockClass += ' fixed-civil-constraint';
                
                const block = document.createElement('div');
                block.className = `slot-block time-block ${blockClass}`;
                
                let civilFmt = window.formatLegacyDate(b.ms);
                
                let hasData = b.text.trim() !== "";
                let colorStr = hasData ? 'var(--omni-text)' : 'var(--omni-main)';
                
                let diff = (b.ms - window.ANCHOR_ALPHA_DYNAMIC) / window.MS_DAY;
                let orbital = window.getOrbitalData(diff);
                
                let timeHeaderHtml = `<div style="display:flex; gap: 8px; align-items:baseline;"><span class="time-header wave-label" style="font-size:0.9rem; color:${colorStr}; font-family:'Orbitron'; font-weight:bold; transition: color 0.5s, text-shadow 0.5s; text-shadow:${hasData ? '0 0 8px var(--omni-text)' : 'none'};">${civilFmt.timeStr.split(' ')[0]} LOCAL</span><span style="font-size:0.55rem; color:rgba(229, 228, 226, 0.6); font-weight:bold;">(DEG ${orbital.trueArc.toFixed(2)})</span></div>`;
                
                let badgeHtml = '';
                if (isCivilConstraint) badgeHtml += `<span style="background:var(--omni-warn); color:#000; padding:2px 6px; border-radius:2px; font-size:0.5rem; font-weight:bold; font-family:'Orbitron'; margin-left:5px;">FIXED CIVIL CONSTRAINT</span>`;

                block.innerHTML = `
                    <div style="display:flex; justify-content:space-between; align-items:baseline; margin-bottom: 8px;">
                        ${timeHeaderHtml}
                        <div>${badgeHtml}</div>
                    </div>
                    <div style="font-size:0.6rem; color:rgba(229, 228, 226, 0.6); font-family:'JetBrains Mono'; white-space:nowrap; overflow:hidden; text-overflow:ellipsis; opacity:0.8; position: relative; z-index: 2;">
                        ${b.text ? b.text : ""}
                    </div>
                `;
               block.onclick = () => { 
                    this.selectedHour = b.hour; 
                    this.selectedHourDur = 3600000; 
                    this.viewState = 'hour'; 
                    this.refreshView(); 
                };
                matrix.appendChild(block);
            });
            list.appendChild(matrix);
            container.appendChild(list);
        } else {
            let activeBlock = window.getQBlockByTime(this.selectedDate);
            if (!activeBlock) return;
            let cCycle = activeBlock.cycle;
            let baseMs = window.ANCHOR_ALPHA_DYNAMIC + (cCycle * window.Q_YEAR_MS) + activeBlock.relStart;
            let subDur = activeBlock.dur / 20;
            
            const matrix = document.createElement('div'); 
            matrix.className = 'editor-matrix';

            for(let m=0; m<20; m++) {
                let targetMs = baseMs + (m * subDur);
                const key = `Q-${cCycle}-${activeBlock.absDeg}-${m}`;
                const data = window.qData[key] || { text: "", link: "" };
                
                let d = new Date(targetMs);
                let currentMinsFromMidnight = (d.getHours() * 60) + d.getMinutes();
                let minsSinceWake = (currentMinsFromMidnight - anchorMins + 1440) % 1440;
                
                let currentBioState;
                if (minsSinceWake >= wakingDurationMins) currentBioState = "SLEEP / RECOVERY";
                else if (minsSinceWake < inertiaMins) currentBioState = "SLEEP INERTIA";
                else if (minsSinceWake >= wakingDurationMins - dlmoMins) currentBioState = "DLMO WIND-DOWN";
                else {
                    let coreMins = minsSinceWake - inertiaMins;
                    let cyclePosFloat = (coreMins % cycleDuration) / cycleDuration;
                    currentBioState = (cyclePosFloat < 0.77) ? "DEEP FLOW" : "VENT/RECOVERY";
                }
                
                const isCivilConstraint = data.text.includes('[FIXED]') || data.text.includes('[CIVIL]');
                let blockClass = '';
                
                if (this.showBioWave) {
                    if (currentBioState === 'DEEP FLOW') blockClass += ' flow-state';
                    else if (currentBioState === 'SLEEP / RECOVERY') blockClass += ' sleep-state';
                    else if (currentBioState === 'SLEEP INERTIA') blockClass += ' inertia-state';
                    else if (currentBioState === 'DLMO WIND-DOWN') blockClass += ' dlmo-state';
                    else blockClass += ' vent-state';
                }
                
                if (isCivilConstraint) blockClass += ' fixed-civil-constraint';
                
                const block = document.createElement('div'); 
                block.className = `slot-block time-block ${blockClass}`;
                
                let hasData = data.text.trim() !== "";
                let colorStr = hasData ? 'var(--omni-text)' : 'var(--omni-main)';
                
               let currentFraction = (m * 0.05).toFixed(2).substring(1); // Formats to .00, .05, .10
               let timeHeaderHtml = `<div style="display:flex; gap: 8px; align-items:baseline;"><span class="wave-label" style="font-size:0.9rem; color:${colorStr}; font-family:'Orbitron'; font-weight:bold; transition: color 0.5s, text-shadow 0.5s; text-shadow:${hasData ? '0 0 8px var(--omni-text)' : 'none'};">DEG ${activeBlock.absDeg}${currentFraction}</span><span style="font-size:0.55rem; color:rgba(229, 228, 226, 0.6); font-weight:bold;">(${(subDur/60000).toFixed(1)} MINS)</span></div>`;

                let badgeHtml = '';
                if (isCivilConstraint) badgeHtml += `<span style="background:var(--omni-warn); color:#000; padding:2px 6px; border-radius:2px; font-size:0.5rem; font-weight:bold; font-family:'Orbitron'; margin-left:5px;">FIXED CIVIL CONSTRAINT</span>`;
                
                block.innerHTML = `
                    <div style="display:flex; justify-content:space-between; align-items:baseline; margin-bottom: 8px;">
                        ${timeHeaderHtml}
                        <div>${badgeHtml}</div>
                    </div>
                    <div style="font-size:0.6rem; color:rgba(229, 228, 226, 0.6); font-family:'JetBrains Mono'; white-space:nowrap; overflow:hidden; text-overflow:ellipsis; opacity:0.8; position: relative; z-index: 2;">
                        ${data.text ? data.text : ""}
                    </div>
                `;
                
                if(!window.qData[key]) window.qData[key] = { text: "", link: "" }; 
                
               // OS OVERRIDE: Nearest-Hour Snapping (Orbital to Legacy Floor Routing)
                block.onclick = (e) => {
                    if (this.plannerFormat === 'unified') return; // STRICT MACRO LOCK
                    
                    const snapDate = new Date(targetMs);
                    this.selectedDate = new Date(snapDate.getFullYear(), snapDate.getMonth(), snapDate.getDate()).getTime();
                    this.selectedHour = snapDate.getHours();
                    this.selectedHourDur = 3600000;
                    this.viewState = 'hour';
                    this.refreshView();
                };

                matrix.appendChild(block);
            }
            container.appendChild(matrix);
        }
    },

    renderHour: function(container, title) {
        let baseMs = this.selectedDate;
        let dualTitleHtml = window.getDualTitle(baseMs, this.isLegacy);
        
        title.innerHTML = `${dualTitleHtml} <div style="font-size:0.75rem; color:rgba(229, 228, 226, 0.6); font-family:'Orbitron'; margin-top:6px; text-align:center;">@ LOCAL ${this.selectedHour.toString().padStart(2,'0')}:00</div>`;

        const matrix = document.createElement('div'); matrix.className = 'editor-matrix';
        let totalMins = Math.ceil(this.selectedHourDur / 60000);
        
        let savedAnchor = localStorage.getItem('q_bio_anchor');
        let anchorMins = (savedAnchor === null || savedAnchor === "") ? 0 : parseInt(savedAnchor); 
        let cycleDuration = parseInt(localStorage.getItem('q_bio_duration')) || 90; 
        let sleepDuration = parseInt(localStorage.getItem('q_sleep_cycle_duration')) || 450;
        let wakingDurationMins = 1440 - sleepDuration;

        let inertiaMins = 45;
        let dlmoMins = 90;
        
        for(let m=0; m<totalMins; m+=5) {
            let targetMs = baseMs + (this.selectedHour * 3600000) + (m * 60000);
            const key = window.getDataKey(new Date(targetMs), this.selectedHour, m);
            const data = window.qData[key] || { text: "", link: "" };
            const diff = (targetMs - window.ANCHOR_ALPHA_DYNAMIC) / window.MS_DAY; 
            const orbital = window.getOrbitalData(diff);
            
            let d = new Date(targetMs);
            let currentMinsFromMidnight = (d.getHours() * 60) + d.getMinutes();
            let minsSinceWake = (currentMinsFromMidnight - anchorMins + 1440) % 1440;
            
            let currentBioState;

            if (minsSinceWake >= wakingDurationMins) {
                currentBioState = "SLEEP / RECOVERY";
            } else if (minsSinceWake < inertiaMins) {
                currentBioState = "SLEEP INERTIA";
            } else if (minsSinceWake >= wakingDurationMins - dlmoMins) {
                currentBioState = "DLMO WIND-DOWN";
            } else {
                let coreMins = minsSinceWake - inertiaMins;
                let cyclePosFloat = (coreMins % cycleDuration) / cycleDuration;
                currentBioState = (cyclePosFloat < 0.77) ? "DEEP FLOW" : "VENT/RECOVERY";
            }
            
           const isCivilConstraint = data.text.includes('[FIXED]') || data.text.includes('[CIVIL]');
            let blockClass = '';
            
            if (this.showBioWave) {
                if (currentBioState === 'DEEP FLOW') blockClass += ' flow-state';
                else if (currentBioState === 'SLEEP / RECOVERY') blockClass += ' sleep-state';
                else if (currentBioState === 'SLEEP INERTIA') blockClass += ' inertia-state';
                else if (currentBioState === 'DLMO WIND-DOWN') blockClass += ' dlmo-state';
                else blockClass += ' vent-state';
            }
            
            if (isCivilConstraint) blockClass += ' fixed-civil-constraint';

            const block = document.createElement('div'); 
            block.className = `slot-block time-block ${blockClass}`;
            
            let hasData = data.text.trim() !== "";
            let colorStr = hasData ? 'var(--omni-text)' : 'var(--omni-main)';
            
           let timeHeaderHtml = `<div class="wave-label" style="font-size:0.8rem; color:${colorStr}; font-family:'Orbitron'; font-weight:bold; transition: color 0.5s, text-shadow 0.5s; text-shadow:${hasData ? '0 0 8px var(--omni-text)' : 'none'};">:${m.toString().padStart(2,'0')} LOCAL</div>`;

            block.innerHTML = `
                <div style="display:flex; justify-content:space-between; align-items:baseline; margin-bottom: 8px;">
                    ${timeHeaderHtml}
                    <div style="display:flex; align-items:center; gap:8px;">
                        <div style="font-size:0.5rem; color:rgba(229, 228, 226, 0.6); font-family:'JetBrains Mono';">COORD: ${orbital.trueArc.toFixed(2)}°</div>
                    </div>
                </div>
                <textarea style="width:100%; min-height: 60px; background:transparent; color:${isCivilConstraint ? 'var(--omni-warn)' : 'var(--omni-text)'}; border:none; border-bottom:1px solid var(--omni-bg); margin-top: 8px; font-family:'JetBrains Mono'; resize:vertical; outline:none; position:relative; z-index:2;" placeholder="Enter quadrature intent or [FIXED] civil event..." oninput="window.qData['${key}'].text=this.value; window.savePlannerData();">${data.text}</textarea>`;
            
           if(!window.qData[key]) window.qData[key] = { text: "", link: "" }; 
            matrix.appendChild(block);
        }
        container.appendChild(matrix);
    },

  renderUnified: function(container, title) {
        // 1. ZOOM MECHANICS (TRACK SCALING)
        let dayCount = 365;
        let trackWidth = 12000;
        let startOffsetMs = window.ANCHOR_ALPHA_DYNAMIC;

        if (this.viewState === 'day' || this.viewState === 'hour' || this.plannerMacroMode === 'day') {
            dayCount = 7;
            trackWidth = 3000;
            startOffsetMs = this.selectedDate - (3 * window.MS_DAY); // Center the selected day
            title.innerHTML = `<div class="cal-title-wrapper show-quad"><div class="title-q"><span style="color:var(--omni-text);">THE UNIFIED MATRIX</span> <span style="color:var(--gold, #F4D068);">[ MICRO-TIMELINE : 7 DAYS ]</span></div></div>`;
        } else if (this.plannerMacroMode === 'sect') {
            dayCount = 30;
            trackWidth = 6000;
            startOffsetMs = this.plannerBase;
            title.innerHTML = `<div class="cal-title-wrapper show-quad"><div class="title-q"><span style="color:var(--omni-text);">THE UNIFIED MATRIX</span> <span style="color:var(--gold, #F4D068);">[ SUB-MACRO : 30 DAYS ]</span></div></div>`;
        } else if (this.plannerMacroMode === 'quad') {
            dayCount = 90;
            trackWidth = 9000;
            startOffsetMs = this.plannerBase;
            title.innerHTML = `<div class="cal-title-wrapper show-quad"><div class="title-q"><span style="color:var(--omni-text);">THE UNIFIED MATRIX</span> <span style="color:var(--gold, #F4D068);">[ MACRO-TIMELINE : 90 DAYS ]</span></div></div>`;
        } else {
            let activeBlock = window.getQBlockByTime(this.plannerBase);
            let cCycle = activeBlock ? activeBlock.cycle : 0;
            startOffsetMs = window.ANCHOR_ALPHA_DYNAMIC + (cCycle * window.Q_YEAR_MS);
            title.innerHTML = `<div class="cal-title-wrapper show-quad"><div class="title-q"><span style="color:var(--omni-text);">THE UNIFIED MATRIX</span> <span style="color:var(--gold, #F4D068);">[ ABSOLUTE TIMELINE : 365 DAYS ]</span></div></div>`;
        }

        const wrapper = document.createElement('div');
        wrapper.style.cssText = 'width:100%; height:100%; overflow-x:auto; overflow-y:hidden; position:relative; background:var(--omni-bg); padding-top:40px;';

        const track = document.createElement('div');
        track.style.cssText = `width:${trackWidth}px; height:80%; position:relative; margin:auto; background:#0f1724; display:flex; align-items:center; box-shadow: 0 0 20px rgba(0,0,0,0.8);`; 

        // 2. ORBITAL LAYER (HORIZONTAL EoT SHIFT)
        const orbitalLayer = document.createElement('div');
        orbitalLayer.style.cssText = 'position:absolute; width:100%; height:100%; top:0; left:0; display:flex; pointer-events:none;';
        if (!this.showOrbitalBase) orbitalLayer.style.display = 'none';

        const lat = window.Q_STATE?.location?.lat || 27.97;
        for (let i = 0; i < dayCount; i++) {
            let targetMs = startOffsetMs + (i * window.MS_DAY);
            let dObj = new Date(targetMs);
            let dayOfYear = Math.floor((targetMs - new Date(dObj.getFullYear(), 0, 0).getTime()) / window.MS_DAY);

            let B = (360 / 365) * (dayOfYear - 81) * Math.PI / 180;
            let eotMins = 9.87 * Math.sin(2 * B) - 7.53 * Math.cos(B) - 1.5 * Math.sin(B);
            let solarNoonDec = 12 - (eotMins / 60); // Shift noon away from 12:00 based on EoT

            let delta = 23.44 * Math.sin((360 / 365) * (dayOfYear - 80) * Math.PI / 180);
            let tanLat = Math.tan(lat * Math.PI / 180);
            let tanDelta = Math.tan(delta * Math.PI / 180);
            let cosOmega = -tanLat * tanDelta;
            if(cosOmega > 1) cosOmega = 1; if(cosOmega < -1) cosOmega = -1;
            let omega = Math.acos(cosOmega) * 180 / Math.PI;
            
            let daylightHours = (2 * omega) / 15;
            let halfLight = daylightHours / 2;

            let sunrisePct = ((solarNoonDec - halfLight) / 24) * 100;
            let sunsetPct = ((solarNoonDec + halfLight) / 24) * 100;

            let slice = document.createElement('div');
            // Horizontal left-to-right gradient representing dawn, true noon drift, and dusk
            slice.style.cssText = `flex-grow:1; height:80px; margin-top:auto; margin-bottom:auto; background:linear-gradient(to right, rgba(0,0,0,0.95) 0%, rgba(0,0,0,0.95) ${sunrisePct}%, var(--sys-cyan) ${sunrisePct}%, var(--sys-cyan) ${sunsetPct}%, rgba(0,0,0,0.95) ${sunsetPct}%, rgba(0,0,0,0.95) 100%); opacity:0.6;`;
            orbitalLayer.appendChild(slice);
        }

        // 3. LEGACY LAYER (GREGORIAN HASHES)
        const legacyLayer = document.createElement('div');
        legacyLayer.style.cssText = 'position:absolute; width:100%; height:100%; top:0; pointer-events:none;';
        if (!this.showLegacyBase) legacyLayer.style.display = 'none';
        
        const dayLetters = ["S", "M", "T", "W", "T", "F", "S"];
        const monthNames = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"];

        for (let i = 0; i < dayCount; i++) {
            let targetMs = startOffsetMs + (i * window.MS_DAY);
            let dObj = new Date(targetMs);
            let xPos = (i / dayCount) * 100;
            
            let isEndOfMonth = (dObj.getDate() === new Date(dObj.getFullYear(), dObj.getMonth() + 1, 0).getDate());
            
            let hash = document.createElement('div');
            hash.style.cssText = `position:absolute; left:${xPos}%; height:${isEndOfMonth ? '30%' : '15%'}; top:${isEndOfMonth ? '35%' : '42.5%'}; width:${isEndOfMonth ? '2px' : '1px'}; background:${isEndOfMonth ? 'var(--omni-warn)' : 'rgba(229, 228, 226, 0.4)'}; z-index:1;`;
            legacyLayer.appendChild(hash);
            
            let letter = document.createElement('div');
            letter.style.cssText = `position:absolute; left:calc(${xPos}% + 4px); top:60%; font-size:0.5rem; color:rgba(229, 228, 226, 0.4); font-family:'JetBrains Mono';`;
            letter.innerText = dayLetters[dObj.getDay()];
            legacyLayer.appendChild(letter);
            
            // Render month label at mid-month, or on the first day if zoomed in heavily
            if (dObj.getDate() === 15 || (dayCount <= 7 && dObj.getDay() === 3)) {
                let mLabel = document.createElement('div');
                mLabel.style.cssText = `position:absolute; left:${xPos}%; top:25%; font-size:1rem; font-weight:bold; color:var(--omni-text); font-family:'Orbitron'; transform:translateX(-50%); text-shadow:0 0 5px #000;`;
                mLabel.innerText = monthNames[dObj.getMonth()] + " " + dObj.getDate();
                legacyLayer.appendChild(mLabel);
            }
        }

        // 4. BIOMETRIC LAYER (DIURNAL ENVELOPE)
        const bioLayer = document.createElement('div');
        bioLayer.style.cssText = 'position:absolute; width:100%; height:100%; top:0; pointer-events:none; z-index:2;';
        if (!this.showBiometricBase) bioLayer.style.display = 'none';
        
        let savedAnchor = localStorage.getItem('q_bio_anchor');
        let anchorMins = (savedAnchor === null || savedAnchor === "") ? 420 : parseInt(savedAnchor);
        let sleepDuration = parseInt(localStorage.getItem('q_sleep_cycle_duration')) || 450;
        let wakeDuration = 1440 - sleepDuration;

        const waveSvg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
        waveSvg.setAttribute("width", "100%");
        waveSvg.setAttribute("height", "100%");
        waveSvg.style.position = "absolute";
        
        let pathData = "M 0 50 ";
        // Step density tied to zoom level for maximum geometric fidelity
        let step = trackWidth >= 9000 ? 5 : 2; 

        for(let x = 0; x <= trackWidth; x += step) {
            let pct = x / trackWidth;
            let targetMs = startOffsetMs + (pct * dayCount * window.MS_DAY);
            let dObj = new Date(targetMs);
            
            let hoursFloat = dObj.getHours() + (dObj.getMinutes() / 60) + (dObj.getSeconds() / 3600);
            let minsFloat = hoursFloat * 60;
            let minsSinceWake = (minsFloat - anchorMins + 1440) % 1440;
            let y;
            
            if (minsSinceWake >= wakeDuration) {
                // True Sleep Phase: Deep, isolated recovery trough
                let sleepProgress = (minsSinceWake - wakeDuration) / sleepDuration;
                y = 65 + (Math.sin(sleepProgress * Math.PI) * 20); 
            } else {
                // True Waking Phase: Smooth diurnal apex arching across daylight
                let wakeProgress = minsSinceWake / wakeDuration;
                y = 45 - (Math.sin(wakeProgress * Math.PI) * 15); 
            }
            
            pathData += `L ${x} ${y} `;
        }
        
        const wavePath = document.createElementNS("http://www.w3.org/2000/svg", "path");
        wavePath.setAttribute("d", pathData);
        wavePath.setAttribute("stroke", "var(--env-green, #a7ff83)");
        wavePath.setAttribute("stroke-width", "2");
        wavePath.setAttribute("fill", "none");
        wavePath.style.filter = "drop-shadow(0px 0px 8px rgba(167, 255, 131, 0.8))";
        
        waveSvg.appendChild(wavePath);
        bioLayer.appendChild(waveSvg);

        track.appendChild(orbitalLayer);
        track.appendChild(legacyLayer);
        track.appendChild(bioLayer);
        wrapper.appendChild(track);
        container.appendChild(wrapper);
    }
};
// --- SYSTEM MOUNT ---
window.addEventListener('DOMContentLoaded', () => {
    if (window.Q_OmniPlanner && typeof window.Q_OmniPlanner.init === 'function') {
        window.Q_OmniPlanner.init();
    }
});
