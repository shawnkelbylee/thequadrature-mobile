// THE QUADRATURE: OMNI-PLANNER & UI ABSTRACTION (ZERO-REDUNDANCY ENGINE)
// Architect: Kelby | Builder: Kairos
// PROTOCOL: Pragmatic Interoperability, Strict Phase Bordering, & Civil Tension Scoring
// REVISION: Phase XIX - Fluid Biological Gradient Mapping

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

// --- DYNAMIC BIOLOGICAL GRADIENT CALCULATORS ---
window.getMinsSinceWake = function(ts, anchorMins) {
    let d = new Date(ts);
    let currentMinsFromMidnight = (d.getHours() * 60) + d.getMinutes();
    return (currentMinsFromMidnight - anchorMins + 1440) % 1440;
};

window.getBioPhase = function(minsSinceWake, wakingDurationMins, inertiaMins, dlmoMins, cycleDuration) {
    if (minsSinceWake >= wakingDurationMins) return { name: "SLEEP / RECOVERY", color: "var(--bio-purple, #b829ff)", opColor: "rgba(184, 41, 255, 0.15)" };
    if (minsSinceWake < inertiaMins) return { name: "SLEEP INERTIA", color: "var(--chrono-amber, #B97A35)", opColor: "rgba(185, 122, 53, 0.15)" };
    if (minsSinceWake >= wakingDurationMins - dlmoMins) return { name: "DLMO WIND-DOWN", color: "var(--bio-cobalt, #0055ff)", opColor: "rgba(0, 85, 255, 0.15)" };
    
    let coreMins = minsSinceWake - inertiaMins;
    let cyclePosFloat = (coreMins % cycleDuration) / cycleDuration;
    if (cyclePosFloat < 0.77) return { name: "DEEP FLOW", color: "var(--env-green, #a7ff83)", opColor: "rgba(167, 255, 131, 0.15)" };
    return { name: "VENT/RECOVERY", color: "var(--sys-cyan, #00f0ff)", opColor: "rgba(0, 240, 255, 0.15)" };
};

window.getBlockStyleInfo = function(startMs, endMs, anchorMins, wakingDurationMins, inertiaMins, dlmoMins, cycleDuration, hasData) {
    let startState = window.getBioPhase(window.getMinsSinceWake(startMs, anchorMins), wakingDurationMins, inertiaMins, dlmoMins, cycleDuration);
    let endState = window.getBioPhase(window.getMinsSinceWake(endMs, anchorMins), wakingDurationMins, inertiaMins, dlmoMins, cycleDuration);

    let bgStyle = '';
    let textStyle = '';
    let filterStyle = hasData ? `filter: drop-shadow(0 0 8px var(--omni-text));` : `filter: drop-shadow(0 0 8px ${startState.opColor});`;

    if (startState.name === endState.name) {
        bgStyle = `background: ${startState.opColor}; border-left: 3px solid ${startState.color};`;
        textStyle = `color: ${startState.color}; ${filterStyle}`;
        return { bgStyle, textStyle, startStateName: startState.name };
    }

    let shiftPct = 0.5;
    let totalMins = (endMs - startMs) / 60000;
    for (let i = 1; i <= totalMins; i++) {
        let sampleMs = startMs + (i * 60000);
        let sampleState = window.getBioPhase(window.getMinsSinceWake(sampleMs, anchorMins), wakingDurationMins, inertiaMins, dlmoMins, cycleDuration);
        if (sampleState.name !== startState.name) {
            shiftPct = i / totalMins;
            break;
        }
    }

    let pctStr = (shiftPct * 100).toFixed(1) + "%";
    bgStyle = `background: linear-gradient(to right, ${startState.opColor} 0%, ${startState.opColor} ${pctStr}, ${endState.opColor} ${pctStr}, ${endState.opColor} 100%); border-left: 3px solid transparent; border-image: linear-gradient(to bottom, ${startState.color} ${pctStr}, ${endState.color} ${pctStr}) 1 100%;`;
    textStyle = `background: linear-gradient(to right, ${startState.color} 0%, ${startState.color} ${pctStr}, ${endState.color} ${pctStr}, ${endState.color} 100%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; ${filterStyle}`;

    return { bgStyle, textStyle, startStateName: startState.name };
};

// DUAL-FORMAT TITLE GENERATOR
window.getDualTitle = function(ts, isLegacy) {
    if (isLegacy) {
        const d = new Date(ts);
        const months = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"];
        return `<div class="cal-title-wrapper show-legacy"><div class="title-leg">${months[d.getMonth()]} ${d.getDate()} ${d.getFullYear()}</div></div>`;
    } else {
        const qBlock = window.getQBlockByTime ? window.getQBlockByTime(ts) : null;
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
    isLegacy: true, 
    civilDistortionActive: false,
    
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
        if (document.getElementById('q-planner-css')) return;
        const style = document.createElement('style');
        style.id = 'q-planner-css';
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

            .time-block { display: flex; flex-direction: column; justify-content: space-between; padding: 15px 20px; border-bottom: 1px solid var(--omni-bg); font-family: 'JetBrains Mono'; color: var(--omni-text); position: relative; overflow: hidden; transition: 0.3s; z-index: 1; border-left: 3px solid transparent; }
            .time-block:hover { filter: brightness(1.2); }
            
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
            const state = window.getSimState ? window.getSimState() : { simTime: Date.now() };
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
            let activeBlock = window.getQBlockByTime ? window.getQBlockByTime(this.selectedDate) : null;
            if(activeBlock && activeBlock.isAnchor) {
                cTitle = `[ SETTLEMENT NODE: ${activeBlock.name} ]`;
                cDesc = `OPERATIONAL BUFFER. Actively resolving accumulated physical drift. Q-Delta interpolating to 0.0000° across ${(activeBlock.dur / 3600000).toFixed(4)} hours.`;
                contextDiv.style.borderColor = 'var(--gold)';
            } else if (activeBlock) {
                let daysElapsed = (this.selectedDate - window.ANCHOR_ALPHA_DYNAMIC) / window.MS_DAY;
                let oData = window.getOrbitalData ? window.getOrbitalData(daysElapsed) : { trueArc: 0, meanArc: 0 };
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

        // --- DEFINE TRUTH TABLE CONSTANTS EARLY ---
        const L = this.showLegacyBase;
        const O = this.showOrbitalBase;
        const B = this.showBiometricBase;
        const isUnified = (L && O && B) || (!L && !O && B);
        
        this.showBioWave = B; 

        // Dynamic State-Aware Labeling
        const labels = isUnified ? {
            day: "ZOOM: 3D",
            sect: "ZOOM: 7D",
            quad: "ZOOM: 14D",
            cycle: "ZOOM: 30D"
        } : {
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
            const orbBtn = createToggle('ORBITAL Base', this.showOrbitalBase, 'orbital', 'var(--gold, #F4D068)');
            const bioBtn = createToggle('BIOMETRIC Base', this.showBiometricBase, 'biometric', 'var(--env-green, #a7ff83)');

            actionContainer.appendChild(legBtn);
            actionContainer.appendChild(orbBtn);
            actionContainer.appendChild(bioBtn);
            if (this.showBiometricBase) {
                const distBtn = document.createElement('button');
                distBtn.className = 'back-btn';
                distBtn.style.color = this.civilDistortionActive ? 'var(--omni-warn)' : 'rgba(229, 228, 226, 0.6)';
                distBtn.style.borderColor = this.civilDistortionActive ? 'var(--omni-warn)' : 'rgba(229, 228, 226, 0.6)';
                distBtn.style.marginLeft = '10px';
                distBtn.innerText = this.civilDistortionActive ? '[ DISTORTION: ON ]' : '[ DISTORTION: OFF ]';
                distBtn.onclick = () => {
                    this.civilDistortionActive = !this.civilDistortionActive;
                    this.refreshView();
                };
                actionContainer.appendChild(distBtn);
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
        if (!L && !O && !B) {
            title.innerHTML = `<div class="cal-title-wrapper"><div class="title-q" style="color:rgba(229,228,226,0.3);">METROLOGICAL VOID</div></div>`;
            body.innerHTML = `<div style="display:flex; justify-content:center; align-items:center; height:100%; color:rgba(229, 228, 226, 0.2); font-family:'Orbitron'; font-size:1.5rem; letter-spacing:4px; font-weight:bold;">NO SUBSTRATE SELECTED</div>`;
            return;
        }

        if (L && O && B) {
            this.renderUnified(body, title);
        } else if (L && O && !B) {
            this.renderStructuralComparison(body, title);
        } else if (!L && !O && B) {
            this.renderUnified(body, title);
        } else {
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
        const o = window.getOrbitalData ? window.getOrbitalData(daysElapsed) : { meanArc: 0 };
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
            let activeBlock = window.getQBlockByTime ? window.getQBlockByTime(this.plannerBase) : null;
            if(!activeBlock) return;
            
            let aQuad = activeBlock.quad || 1;
            let aSect = activeBlock.sect || 1;
            let cCycle = activeBlock.cycle;
            
            let baseMs = window.ANCHOR_ALPHA_DYNAMIC + (cCycle * window.TROPICAL_YEAR_MS);
            let sectorDuration = window.TROPICAL_YEAR_MS / 12;
            let sectorStart = baseMs + ((aQuad - 1) * 3 * sectorDuration) + ((aSect - 1) * sectorDuration);

            // Step through the sector in 1-degree increments
            for (let d = 0; d < 30; d++) {
                let absDeg = ((aQuad - 1) * 90) + ((aSect - 1) * 30) + d;
                let targetTs = sectorStart + (d * (window.TROPICAL_YEAR_MS / 360));
                
                const dEl = document.createElement('div');
                dEl.className = 'p-day';
                
                let isToday = (Date.now() >= targetTs && Date.now() < targetTs + (window.TROPICAL_YEAR_MS / 360));
                if (isToday) dEl.classList.add('status-today');
                if (this.selectedDate >= targetTs && this.selectedDate < targetTs + (window.TROPICAL_YEAR_MS / 360)) dEl.classList.add('selected');
                
                dEl.innerHTML = `<div style="font-family:Orbitron; font-weight:bold; color:var(--omni-main); text-align:center;">DEG ${absDeg}</div>`;
                dEl.onclick = () => { this.selectedDate = targetTs; this.setViewMode('day'); };
                matrix.appendChild(dEl);
            }
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
            
            let activeBlock = window.getQBlockByTime ? window.getQBlockByTime(this.plannerBase) : null;
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
                
                let baseMs = window.ANCHOR_ALPHA_DYNAMIC + (cCycle * window.TROPICAL_YEAR_MS);
                let sectorDuration = window.TROPICAL_YEAR_MS / 12;
                let sectorStart = baseMs + ((aQuad - 1) * 3 * sectorDuration) + ((s - 1) * sectorDuration);
                
                for(let d=0; d<30; d++) {
                    let absDeg = ((aQuad - 1) * 90) + ((s - 1) * 30) + d;
                    let absStart = sectorStart + (d * (window.TROPICAL_YEAR_MS / 360));
                    let dur = window.TROPICAL_YEAR_MS / 360;
                    
                    const isToday = (nowMs >= absStart && nowMs < absStart + dur);
                    const dEl = document.createElement('div'); 
                    dEl.className = 'mini-day'; 
                    
                    if (absDeg % 90 === 0) {
                        dEl.style.background = 'rgba(244, 208, 104, 0.2)';
                        dEl.style.color = '#F4D068';
                        dEl.innerText = "A";
                    } else {
                        dEl.innerText = d + 1;
                    }
                    if(isToday) dEl.classList.add('status-today');
                    if(this.selectedDate >= absStart && this.selectedDate < absStart + dur) dEl.classList.add('selected');
                    dEl.onclick = () => { this.selectedDate = absStart; this.setViewMode('day'); };
                    qGrid.appendChild(dEl);
                }

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
            let activeBlock = window.getQBlockByTime ? window.getQBlockByTime(this.plannerBase) : null;
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
                    
                    let baseMs = window.ANCHOR_ALPHA_DYNAMIC + (cCycle * window.TROPICAL_YEAR_MS);
                    let sectorDuration = window.TROPICAL_YEAR_MS / 12;
                    let sectorStart = baseMs + ((q - 1) * 3 * sectorDuration) + ((s - 1) * sectorDuration);
                    
                    for(let d=0; d<30; d++) {
                        let absDeg = ((q - 1) * 90) + ((s - 1) * 30) + d;
                        let absStart = sectorStart + (d * (window.TROPICAL_YEAR_MS / 360));
                        let dur = window.TROPICAL_YEAR_MS / 360;
                        
                        const isToday = (nowMs >= absStart && nowMs < absStart + dur);
                        const dEl = document.createElement('div'); 
                        dEl.className = 'mini-day'; 
                        
                        if (absDeg % 90 === 0) {
                            dEl.style.background = 'rgba(244, 208, 104, 0.2)';
                            dEl.style.color = '#F4D068';
                            dEl.innerText = "A";
                        } else {
                            dEl.innerText = d + 1;
                        }
                        if(isToday) dEl.classList.add('status-today');
                        if(this.selectedDate >= absStart && this.selectedDate < absStart + dur) dEl.classList.add('selected');
                        dEl.onclick = () => { this.selectedDate = absStart; this.setViewMode('day'); };
                        qGrid.appendChild(dEl);
                    }

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

        let activeBlock = window.getQBlockByTime ? window.getQBlockByTime(this.plannerBase) : null;
        if(!activeBlock) return;
        let cCycle = activeBlock.cycle;

        const matrix = document.createElement('div');
        matrix.className = 'macro-grid-q';
        matrix.style.flexDirection = 'row';
        matrix.style.flexWrap = 'wrap';
        matrix.style.justifyContent = 'center';

        const monthColors = [
            'rgba(255, 0, 60, 0.45)',   
            'rgba(255, 165, 0, 0.45)',  
            'rgba(244, 208, 104, 0.45)',
            'rgba(167, 255, 131, 0.45)',
            'rgba(0, 240, 255, 0.45)',  
            'rgba(0, 85, 255, 0.45)',   
            'rgba(184, 41, 255, 0.45)', 
            'rgba(255, 0, 255, 0.45)',  
            'rgba(255, 105, 180, 0.45)',
            'rgba(185, 122, 53, 0.45)', 
            'rgba(128, 128, 128, 0.45)',
            'rgba(255, 255, 255, 0.35)' 
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
                
                let baseMs = window.ANCHOR_ALPHA_DYNAMIC + (cCycle * window.TROPICAL_YEAR_MS);
                let sectorDuration = window.TROPICAL_YEAR_MS / 12;
                let sectorStart = baseMs + ((q - 1) * 3 * sectorDuration) + ((s - 1) * sectorDuration);
                
                for(let d=0; d<30; d++) {
                    let absDeg = ((q - 1) * 90) + ((s - 1) * 30) + d;
                    let absStart = sectorStart + (d * (window.TROPICAL_YEAR_MS / 360));
                    let dur = window.TROPICAL_YEAR_MS / 360;
                    const blockDate = new Date(absStart);
                    const gMonth = blockDate.getMonth();
                    
                    const dEl = document.createElement('div'); 
                    dEl.className = 'mini-day'; 
                    dEl.style.background = monthColors[gMonth];
                    dEl.style.color = '#fff';
                    dEl.style.fontWeight = 'bold';
                    dEl.style.textShadow = '0 0 6px #000';
                    dEl.style.borderRight = '1px solid rgba(255,255,255,0.1)';
                    dEl.style.borderBottom = '1px solid rgba(255,255,255,0.1)';
                    
                    if (absDeg % 90 === 0) {
                        dEl.style.border = '2px solid var(--gold, #F4D068)';
                        dEl.innerText = "A";
                    } else {
                        dEl.innerText = d + 1;
                    }
                    
                    if(Date.now() >= absStart && Date.now() < absStart + dur) dEl.classList.add('status-today');
                    if(this.selectedDate >= absStart && this.selectedDate < absStart + dur) dEl.classList.add('selected');
                    dEl.onclick = () => { this.selectedDate = absStart; this.setViewMode('day'); };
                    
                    qGrid.appendChild(dEl);
                }

                sectorBox.appendChild(qGrid);
                matrix.appendChild(sectorBox);
            }
        }
        container.appendChild(matrix);
    },   
    
    renderDay: function(container, title) {
        title.innerHTML = window.getDualTitle(this.selectedDate, this.isLegacy);
       if (this.showBiometricBase) {
            const bioLegend = document.createElement('div');
            bioLegend.style.cssText = 'display:flex; gap:10px; margin: 10px; justify-content:center; align-items:center; font-family:"Orbitron"; font-size:0.55rem; font-weight:bold;';
            bioLegend.innerHTML = `
                <span style="color:var(--env-green, #a7ff83);">DEEP FLOW</span>
                <span style="color:var(--sys-cyan, #00f0ff);">VENT/REC</span>
                <span style="color:var(--bio-purple, #b829ff);">SLEEP</span>
                <span style="color:var(--chrono-amber, #B97A35);">INERTIA</span>
                <span style="color:var(--bio-cobalt, #0055ff);">DLMO</span>
            `;
            container.appendChild(bioLegend);
        } 
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
                
                let styleInfo = { startStateName: "UNKNOWN" };
                if (this.showBioWave) {
                    styleInfo = window.getBlockStyleInfo(blockMs, blockMs + 3600000, anchorMins, wakingDurationMins, inertiaMins, dlmoMins, cycleDuration, data.text.trim() !== "");
                }
                
                dailyBlocksData.push({ hour: h, text: data.text, bioState: styleInfo.startStateName, key: key, ms: blockMs });
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
                let customStyle = '';
                let textStyle = '';
                
                if (this.showBioWave) {
                    let styleInfo = window.getBlockStyleInfo(b.ms, b.ms + 3600000, anchorMins, wakingDurationMins, inertiaMins, dlmoMins, cycleDuration, b.text.trim() !== "");
                    customStyle = styleInfo.bgStyle;
                    textStyle = styleInfo.textStyle;
                } else {
                    let hasData = b.text.trim() !== "";
                    let colorStr = hasData ? 'var(--omni-text)' : 'var(--omni-main)';
                    textStyle = `color: ${colorStr}; text-shadow: ${hasData ? '0 0 8px var(--omni-text)' : 'none'};`;
                }
                
                if (isCivilConstraint) blockClass += ' fixed-civil-constraint';
                
                const block = document.createElement('div');
                block.className = `slot-block time-block ${blockClass}`;
                if (customStyle) block.style.cssText += customStyle;
                
                let civilFmt = window.formatLegacyDate ? window.formatLegacyDate(b.ms) : { timeStr: new Date(b.ms).toLocaleTimeString() };
                
                let diff = (b.ms - window.ANCHOR_ALPHA_DYNAMIC) / window.MS_DAY;
                let orbital = window.getOrbitalData ? window.getOrbitalData(diff) : { trueArc: 0 };
                
                let timeHeaderHtml = `<div style="display:flex; gap: 8px; align-items:baseline;"><span class="time-header wave-label" style="font-size:0.9rem; font-family:'Orbitron'; font-weight:bold; transition: color 0.5s, text-shadow 0.5s; ${textStyle}">${civilFmt.timeStr.split(' ')[0]} LOCAL</span><span style="font-size:0.55rem; color:rgba(229, 228, 226, 0.6); font-weight:bold;">(DEG ${orbital.trueArc.toFixed(2)})</span></div>`;
                
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
            let activeBlock = window.getQBlockByTime ? window.getQBlockByTime(this.selectedDate) : null;
            if (!activeBlock) return;
            let cCycle = activeBlock.cycle;
            
            // Continuous spatial base calculation
            let absDeg = activeBlock.absDeg;
            let relStart = absDeg * (window.TROPICAL_YEAR_MS / 360);
            let baseMs = window.ANCHOR_ALPHA_DYNAMIC + (cCycle * window.TROPICAL_YEAR_MS) + relStart;
            let subDur = (window.TROPICAL_YEAR_MS / 360) / 20; // 0.05 degree increments
            
            const matrix = document.createElement('div'); 
            matrix.className = 'editor-matrix';

            for(let m=0; m<20; m++) {
                let targetMs = baseMs + (m * subDur);
                const key = `Q-${cCycle}-${absDeg}-${m}`;
                const data = window.qData[key] || { text: "", link: "" };
                
                const isCivilConstraint = data.text.includes('[FIXED]') || data.text.includes('[CIVIL]');
                let blockClass = '';
                let customStyle = '';
                let textStyle = '';
                
                if (this.showBioWave) {
                    let styleInfo = window.getBlockStyleInfo(targetMs, targetMs + subDur, anchorMins, wakingDurationMins, inertiaMins, dlmoMins, cycleDuration, data.text.trim() !== "");
                    customStyle = styleInfo.bgStyle;
                    textStyle = styleInfo.textStyle;
                } else {
                    let hasData = data.text.trim() !== "";
                    let colorStr = hasData ? 'var(--omni-text)' : 'var(--omni-main)';
                    textStyle = `color: ${colorStr}; text-shadow: ${hasData ? '0 0 8px var(--omni-text)' : 'none'};`;
                }
                
                if (isCivilConstraint) blockClass += ' fixed-civil-constraint';
                
                const block = document.createElement('div'); 
                block.className = `slot-block time-block ${blockClass}`;
                if (customStyle) block.style.cssText += customStyle;
                
               let currentFraction = (m * 0.05).toFixed(2).substring(1); 
               let timeHeaderHtml = `<div style="display:flex; gap: 8px; align-items:baseline;"><span class="wave-label" style="font-size:0.9rem; font-family:'Orbitron'; font-weight:bold; transition: color 0.5s, text-shadow 0.5s; ${textStyle}">DEG ${absDeg}${currentFraction}</span><span style="font-size:0.55rem; color:rgba(229, 228, 226, 0.6); font-weight:bold;">(${(subDur/60000).toFixed(1)} MINS)</span></div>`;

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
                
                block.onclick = (e) => {
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
            const orbital = window.getOrbitalData ? window.getOrbitalData(diff) : { trueArc: 0 };
            
           const isCivilConstraint = data.text.includes('[FIXED]') || data.text.includes('[CIVIL]');
            let blockClass = '';
            let customStyle = '';
            let textStyle = '';
            
            if (this.showBioWave) {
                let styleInfo = window.getBlockStyleInfo(targetMs, targetMs + 300000, anchorMins, wakingDurationMins, inertiaMins, dlmoMins, cycleDuration, data.text.trim() !== "");
                customStyle = styleInfo.bgStyle;
                textStyle = styleInfo.textStyle;
            } else {
                let hasData = data.text.trim() !== "";
                let colorStr = hasData ? 'var(--omni-text)' : 'var(--omni-main)';
                textStyle = `color: ${colorStr}; text-shadow: ${hasData ? '0 0 8px var(--omni-text)' : 'none'};`;
            }
            
            if (isCivilConstraint) blockClass += ' fixed-civil-constraint';

            const block = document.createElement('div'); 
            block.className = `slot-block time-block ${blockClass}`;
            if (customStyle) block.style.cssText += customStyle;
            
           let timeHeaderHtml = `<div class="wave-label" style="font-size:0.8rem; font-family:'Orbitron'; font-weight:bold; transition: color 0.5s, text-shadow 0.5s; ${textStyle}">:${m.toString().padStart(2,'0')} LOCAL</div>`;

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
        // --- ABSOLUTE METROLOGICAL ZOOM LOGIC ---
        let dayCount = 7; // Default 7 Absolute Pulses
        if (this.plannerMacroMode === 'sect') dayCount = 7;
        if (this.plannerMacroMode === 'quad') dayCount = 14;
        if (this.plannerMacroMode === 'cycle') dayCount = 30;
        if (this.viewState === 'day' || this.viewState === 'hour' || this.plannerMacroMode === 'day') dayCount = 3;

        let titleStr = `ZOOM: ${dayCount} PULSES`;
        title.innerHTML = `<div class="cal-title-wrapper show-quad"><div class="title-q"><span style="color:var(--omni-text);">THE RESONANCE MATRIX</span> <span style="color:var(--gold, #F4D068);">[ ${titleStr} ]</span></div></div>`;

        // Absolute T=0 Anchor (Dec 21, 2025 15:03:00 UTC)
        let alphaAnchor = window.ANCHOR_ALPHA_DYNAMIC || new Date("2025-12-21T15:03:00Z").getTime();
        let currentViewMs = this.plannerBase;

        // Calculate the absolute pulse index (P001, P002, etc.)
        let elapsedMs = currentViewMs - alphaAnchor;
        let pulseIndex = Math.floor(elapsedMs / 86400000);

        // Center the physical timeline on the active pulse
        let startPulse = pulseIndex - Math.floor(dayCount / 2);
        let startMs = alphaAnchor + (startPulse * 86400000);
        let endMs = startMs + (dayCount * 86400000);
        const msRange = endMs - startMs; // MOVED TO TOP

        // --- 100% STRICT VIEWPORT CONTAINER (NO OVERFLOW) ---
        const wrapper = document.createElement('div');
        wrapper.style.cssText = 'width:100%; height:100%; position:relative; background:var(--omni-bg); overflow:hidden; padding: 20px 0; border: 1px solid var(--omni-bg); border-radius: 8px; box-shadow: inset 0 0 30px rgba(0,0,0,0.5);';

        const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
        svg.setAttribute("width", "100%");
        svg.setAttribute("height", "100%");
        svg.setAttribute("viewBox", `0 0 1000 100`);
        svg.setAttribute("preserveAspectRatio", "none");
        
        const defs = document.createElementNS("http://www.w3.org/2000/svg", "defs");
        const grad = document.createElementNS("http://www.w3.org/2000/svg", "linearGradient");
        grad.setAttribute("id", "bioGradient");
        grad.setAttribute("gradientUnits", "userSpaceOnUse");
        grad.setAttribute("x1", "0");
        grad.setAttribute("x2", ((86400000 / msRange) * 1000).toString()); // One absolute day width
        grad.setAttribute("y1", "0");
        grad.setAttribute("y2", "0");
        grad.setAttribute("spreadMethod", "repeat");
        
        grad.innerHTML = `
            <stop offset="0%" stop-color="var(--env-green, #a7ff83)" />
            <stop offset="40%" stop-color="var(--sys-cyan, #00f0ff)" />
            <stop offset="60%" stop-color="var(--bio-cobalt, #0055ff)" />
            <stop offset="70%" stop-color="var(--bio-purple, #b829ff)" />
            <stop offset="95%" stop-color="var(--chrono-amber, #B97A35)" />
            <stop offset="100%" stop-color="var(--env-green, #a7ff83)" />
        `;
        defs.appendChild(grad);
        svg.appendChild(defs);

        // Y=0 Axis (The Continuous Temporal Thread)
        const axis = document.createElementNS("http://www.w3.org/2000/svg", "line");
        axis.setAttribute("x1", "0"); axis.setAttribute("y1", "50");
        axis.setAttribute("x2", "1000"); axis.setAttribute("y2", "50");
        axis.setAttribute("stroke", "rgba(229, 228, 226, 0.4)");
        axis.setAttribute("stroke-width", "0.5");
        svg.appendChild(axis);

        // 1. Dynamic Civil Cage & 2. DST Tension Zones
        let d = new Date(startMs);
        let dayCounter = 1;
        d.setHours(0, 0, 0, 0); // Geolocation-aware local midnight
        if (d.getTime() < startMs) d.setDate(d.getDate() + 1);

        while (d.getTime() <= endMs) {
            let hashMs = d.getTime();
            let xPos = ((hashMs - startMs) / msRange) * 1000;

           let hash = document.createElementNS("http://www.w3.org/2000/svg", "line");
            hash.setAttribute("x1", xPos); hash.setAttribute("y1", "35");
            hash.setAttribute("x2", xPos); hash.setAttribute("y2", "65");
            hash.setAttribute("stroke", "black");
            hash.setAttribute("stroke-width", "1.5");
            svg.appendChild(hash);

            let label = document.createElementNS("http://www.w3.org/2000/svg", "text");
            label.setAttribute("x", xPos + 2); label.setAttribute("y", "42");
            label.setAttribute("fill", "black");
            label.setAttribute("font-size", "8");
            label.setAttribute("font-family", "Orbitron");
            label.textContent = `D${dayCounter++}`;
            svg.appendChild(label);

            let nextDay = new Date(d);
            nextDay.setDate(nextDay.getDate() + 1);
            let nextHashMs = nextDay.getTime();
            let dayDurationMs = nextHashMs - hashMs;

            if (dayDurationMs !== 86400000 && nextHashMs <= endMs) {
                let tensionWidth = Math.abs(dayDurationMs - 86400000) / msRange * 1000;
                let tensionX = xPos;
                
                // Band: Slightly larger than hash marks (Hash is 35-65, Band is 30-70)
                let rect = document.createElementNS("http://www.w3.org/2000/svg", "rect");
                rect.setAttribute("x", tensionX); rect.setAttribute("y", "30");
                rect.setAttribute("width", tensionWidth); rect.setAttribute("height", "40");
                rect.setAttribute("fill", dayDurationMs < 86400000 ? "rgba(255, 0, 60, 0.3)" : "rgba(255, 0, 60, 0.5)");
                svg.appendChild(rect);

                // DST Label
                let label = document.createElementNS("http://www.w3.org/2000/svg", "text");
            label.setAttribute("x", xPos);
            label.setAttribute("y", "32");
            label.setAttribute("fill", "black");
            label.setAttribute("font-size", "8");
            label.setAttribute("font-family", "Orbitron");
            label.setAttribute("text-anchor", "middle");
            label.textContent = `D${dayCounter++}`;
            svg.appendChild(label);
            }
            d = nextDay;
        }

        const resolution = 1000;

        // Lock static timezone offset to prevent mid-wave browser DST bleed
        const baseTzOffsetMs = new Date(startMs).getTimezoneOffset() * 60000;

        let pathOrbital = "M 0 50 ";
        let pathPhoto = "M 0 50 ";
        let pathBio = "";

        let savedAnchor = parseInt(localStorage.getItem('q_bio_anchor')) || 420;
        let sleepDuration = parseInt(localStorage.getItem('q_sleep_cycle_duration')) || 450;
        let wakeDuration = 1440 - sleepDuration;

        // 3. Biological Event Horizon
        let userInitMs = parseInt(localStorage.getItem('q_init_ms')) || alphaAnchor;
        let bioPathStarted = false;

        for(let i=0; i<=resolution; i++) {
            let pct = i / resolution;
            let pointMs = startMs + (pct * msRange);
            let x = pct * 1000;

            let daysSinceSolstice = (pointMs - alphaAnchor) / 86400000;

            // Extract absolute continuous diurnal phase (bypassing native Date object drift)
            let localPointMs = pointMs - baseTzOffsetMs;
            let localDec = (((localPointMs % 86400000) + 86400000) % 86400000) / 3600000;

            // 1. Fluid Degree Wave (Gold)
            let meanArc = (daysSinceSolstice / 365.24219) * 360;
            let M = (meanArc - 14) * Math.PI / 180;
            let trueArc = meanArc + (1.914 * Math.sin(M));
            let orbitalY = 50 - (Math.sin(trueArc * Math.PI * 2) * 15);
            pathOrbital += `L ${x} ${orbitalY} `;

            // 2. Photoperiod Wave (Cyan)
            let dayOfYear = daysSinceSolstice + 355;
            let B = (360 / 365) * (dayOfYear - 81) * Math.PI / 180;
            let eotMins = 9.87 * Math.sin(2 * B) - 7.53 * Math.cos(B) - 1.5 * Math.sin(B);
            let solarNoonDec = 12 - (eotMins / 60);
            let timeFromNoon = localDec - solarNoonDec;
            let photoY = 50 - (Math.cos((timeFromNoon / 24) * Math.PI * 2) * 35);
            pathPhoto += `L ${x} ${photoY} `;

           // 3. Biological Diurnal Envelope (Continuous Phase vs. Modulo Fracture)
            if (pointMs >= userInitMs) {
                let bioY = 50;
                
                if (this.civilDistortionActive) {
                    // FORCED CAGE: Jagged derivative, piecewise fracture, crushed amplitude
                    let minsFloat = localDec * 60;
                    let minsSinceWake = (minsFloat - savedAnchor + 1440) % 1440;
                    let tensionScalar = 0.3; // Amplitude crushed by 70%
                    
                    if (minsSinceWake >= wakeDuration) {
                        let sleepProgress = (minsSinceWake - wakeDuration) / sleepDuration;
                        bioY = 50 + (Math.sin(sleepProgress * Math.PI) * (25 * tensionScalar));
                    } else {
                        let wakeProgress = minsSinceWake / wakeDuration;
                        bioY = 50 - (Math.sin(wakeProgress * Math.PI) * (25 * tensionScalar));
                    }
                } else {
                    // FREE WAVE: Smooth, uninterrupted kinetic phase
                    let physicalMinsSinceInit = (pointMs - userInitMs) / 60000;
                    let tTotal = wakeDuration + sleepDuration; 
                    let phase = (physicalMinsSinceInit % tTotal) / tTotal;
                    bioY = 50 - (Math.sin(phase * Math.PI * 2) * 25);
                }

                if (!bioPathStarted) {
                    pathBio += `M ${x} ${bioY} `;
                    bioPathStarted = true;
                } else {
                    pathBio += `L ${x} ${bioY} `;
                }
            }
        }

        const addPath = (pathData, color, width, dash = "") => {
            if (!pathData) return; // Prevent render block if bio wave is totally clipped
            let p = document.createElementNS("http://www.w3.org/2000/svg", "path");
            p.setAttribute("d", pathData);
            p.setAttribute("stroke", color);
            p.setAttribute("stroke-width", width);
            p.setAttribute("fill", "none");
            if (dash) p.setAttribute("stroke-dasharray", dash);
            p.style.filter = `drop-shadow(0px 0px 4px ${color})`;
            svg.appendChild(p);
        };

        if (this.showOrbitalBase) addPath(pathOrbital, "var(--gold, #F4D068)", "0.8");
        if (this.showBiometricBase) addPath(pathBio, "url(#bioGradient)", "1.5");
        if (this.showLegacyBase) addPath(pathPhoto, "var(--sys-cyan, #00f0ff)", "1");

        const waveKey = document.createElement('div');
        waveKey.style.cssText = 'position:absolute; bottom:15px; left:15px; display:flex; gap:12px; align-items:center; font-family:"Orbitron"; font-size:0.55rem; font-weight:bold; z-index:100;';
        waveKey.innerHTML = `
            <span style="color:rgba(229, 228, 226, 0.6); cursor:help;" title="CIVIL GRID: The continuous uninterrupted count of 365 static 24-hour days.">— CIVIL GRID</span>
            <span style="color:var(--sys-cyan, #00f0ff); cursor:help;" title="PHOTOPERIOD: Shifting duration of sunlight. Above axis: Daylight. Below axis: Nighttime.">~ PHOTOPERIOD</span>
            <span style="color:var(--env-green, #a7ff83); cursor:help;" title="BIOLOGICAL: User-calibrated circadian cycle via 5 biometric phases.">~ BIOLOGICAL</span>
            <span style="color:var(--gold, #F4D068); cursor:help;" title="FLUID DEGREE: Time to cross 1 degree of orbital path. Intersects at 1 spatial degree intervals.">~ FLUID DEGREE</span>
        `;
        wrapper.appendChild(waveKey);
        wrapper.appendChild(svg);
        container.appendChild(wrapper);
    }
};

// --- SYSTEM MOUNT ---
window.addEventListener('DOMContentLoaded', () => {
    if (window.Q_OmniPlanner && typeof window.Q_OmniPlanner.init === 'function') {
        window.Q_OmniPlanner.init();
    }
});