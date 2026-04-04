// THE QUADRATURE: OMNI-PLANNER & UI ABSTRACTION (ZERO-REDUNDANCY ENGINE)
// Architect: Kelby | Builder: Kairos
// PROTOCOL: Pragmatic Interoperability, Strict Phase Bordering, & Civil Tension Scoring

// --- DUAL-STATE ASYMMETRICAL GEAR ENGINE ---

// Initialize Absolute Block Array (365 Total Blocks per Cycle)
(function initQBlocks() {
    window.Q_BLOCK_DEFS = [];
    window.Q_BLOCK_DEFS.push({ type: 'PYLON', name: 'ALPHA PYLON', dur: window.Q_GEAR_CONSTANTS.ALPHA, quad: 1, sect: 1 });
    
    function buildDays(q, s) {
        for(let d=1; d<=30; d++) window.Q_BLOCK_DEFS.push({ type: 'DAY', quad: q, sect: s, day: d, dur: 86400000 });
    }
    
    buildDays(1, 1); buildDays(1, 2); buildDays(1, 3);
    window.Q_BLOCK_DEFS.push({ type: 'PYLON', name: 'BETA PYLON', dur: window.Q_GEAR_CONSTANTS.BETA, quad: 1, sect: 3 });
    
    buildDays(2, 1); buildDays(2, 2); buildDays(2, 3);
    window.Q_BLOCK_DEFS.push({ type: 'PYLON', name: 'GAMMA PYLON', dur: window.Q_GEAR_CONSTANTS.GAMMA, quad: 2, sect: 3 });
    
    buildDays(3, 1); buildDays(3, 2); buildDays(3, 3);
    window.Q_BLOCK_DEFS.push({ type: 'PYLON', name: 'DELTA PYLON', dur: window.Q_GEAR_CONSTANTS.DELTA, quad: 3, sect: 3 });
    
    buildDays(4, 1); buildDays(4, 2); buildDays(4, 3);
    window.Q_BLOCK_DEFS.push({ type: 'PYLON', name: 'EPSILON PYLON', dur: window.Q_GEAR_CONSTANTS.EPSILON, quad: 4, sect: 3 });
    
    window.Q_BLOCKS = [];
    let acc = 0;
    window.Q_BLOCK_DEFS.forEach((b, i) => {
        window.Q_BLOCKS.push({ ...b, relStart: acc, blockIndex: i });
        acc += b.dur;
    });

    window.Q_YEAR_MS = acc;
})();

window.getQBlockByTime = function(ts) {
    if(!window.PYLON_ALPHA_DYNAMIC) return null;
    let diff = ts - window.PYLON_ALPHA_DYNAMIC;
    let cycleIdx = Math.floor(diff / window.Q_YEAR_MS);
    let rem = diff % window.Q_YEAR_MS;
    if(rem < 0) { rem += window.Q_YEAR_MS; cycleIdx -= 1; }
    
    for(let i=0; i<window.Q_BLOCKS.length; i++) {
        let b = window.Q_BLOCKS[i];
        if(rem >= b.relStart && rem < b.relStart + b.dur) {
            return { ...b, cycle: cycleIdx, absoluteStart: window.PYLON_ALPHA_DYNAMIC + (cycleIdx * window.Q_YEAR_MS) + b.relStart };
        }
    }
    return null;
};

window.stepQBlock = function(ts, n) {
    let current = window.getQBlockByTime(ts);
    if(!current) return ts;
    let targetIdx = current.blockIndex + n;
    let targetCycle = current.cycle;
    
    while(targetIdx >= window.Q_BLOCKS.length) { targetIdx -= window.Q_BLOCKS.length; targetCycle += 1; }
    while(targetIdx < 0) { targetIdx += window.Q_BLOCKS.length; targetCycle -= 1; }
    
    return window.PYLON_ALPHA_DYNAMIC + (targetCycle * window.Q_YEAR_MS) + window.Q_BLOCKS[targetIdx].relStart;
};

window.stepQSector = function(ts, n) {
    let current = window.getQBlockByTime(ts);
    if(!current) return ts;
    let cIdx = current.blockIndex;
    let cCycle = current.cycle;
    let steps = Math.abs(n);
    let dir = n > 0 ? 1 : -1;
    
    for(let i=0; i<steps; i++) {
        do {
            cIdx += dir;
            if(cIdx >= window.Q_BLOCKS.length) { cIdx -= window.Q_BLOCKS.length; cCycle++; }
            if(cIdx < 0) { cIdx += window.Q_BLOCKS.length; cCycle--; }
        } while (window.Q_BLOCKS[cIdx].type === 'DAY' && window.Q_BLOCKS[cIdx].day !== 1);
    }
    return window.PYLON_ALPHA_DYNAMIC + (cCycle * window.Q_YEAR_MS) + window.Q_BLOCKS[cIdx].relStart;
};

// DUAL-FORMAT TITLE GENERATOR
window.getDualTitle = function(ts, isLegacy) {
    const d = new Date(ts);
    const months = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"];
    const legacyStr = `${months[d.getMonth()]} ${d.getDate()} ${d.getFullYear()}`;
    
    const qBlock = window.getQBlockByTime(ts);
    let qStr = "";
    if (qBlock) {
        if (qBlock.type === 'PYLON') {
            qStr = `<span style="color:var(--gold, #F4D068);">QC</span> <span style="color:#fff;">${qBlock.cycle}</span> <span style="color:var(--gold, #F4D068);">${qBlock.name}</span>`;
        } else {
            qStr = `<span style="color:var(--gold, #F4D068);">QC</span> <span style="color:#fff;">${qBlock.cycle}</span> <span style="color:var(--gold, #F4D068);">Q</span><span style="color:#fff;">${qBlock.quad}</span> <span style="color:var(--gold, #F4D068);">S</span><span style="color:#fff;">${qBlock.sect}</span> <span style="color:var(--gold, #F4D068);">DAY</span> <span style="color:#fff;">${qBlock.day}</span>`;
        }
    } else {
        qStr = "<span style='color:var(--theme-main, #ff003c);'>Q-SYNC PENDING</span>";
    }
    
    const wrapperClass = isLegacy ? 'show-legacy' : 'show-quad';
    return `
        <div class="cal-title-wrapper ${wrapperClass}">
            <div class="title-leg">${legacyStr}</div>
            <div class="title-divider">|</div>
            <div class="title-q">${qStr}</div>
        </div>
    `;
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
    selectedPylon: null,
    selectedHour: 0,
    selectedHourDur: 3600000,
    isLegacy: true,

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

        if (sessionStorage.getItem('Q_PLANNER_ACTIVE') === 'true') {
            const savedTime = parseInt(sessionStorage.getItem('Q_PLANNER_TIME'));
            if (savedTime) this.plannerBase = savedTime;
            const savedState = sessionStorage.getItem('Q_PLANNER_STATE');
            if (savedState) this.viewState = savedState;
            const savedMacro = sessionStorage.getItem('Q_PLANNER_MACRO');
            if (savedMacro) this.plannerMacroMode = savedMacro;
            const savedSelected = parseInt(sessionStorage.getItem('Q_PLANNER_SELECTED_DATE'));
            if (savedSelected) this.selectedDate = new Date(savedSelected).getTime();

            this.openPlanner(true); 
        }
    },

    setViewMode: function(mode) {
        if (mode === 'day') {
            let activeBlock = window.getQBlockByTime(this.selectedDate);
            if (!this.isLegacy && activeBlock && activeBlock.type === 'PYLON') {
                this.selectedPylon = { name: activeBlock.name, startMs: this.selectedDate, dur: activeBlock.dur };
                this.viewState = 'pylon';
            } else {
                this.viewState = 'day';
            }
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
        
        if (!this.isLegacy && (this.viewState === 'day' || this.viewState === 'pylon')) {
            let activeBlock = window.getQBlockByTime(this.selectedDate);
            if (activeBlock.type === 'PYLON') {
                this.selectedPylon = { name: activeBlock.name, startMs: this.selectedDate, dur: activeBlock.dur };
                this.viewState = 'pylon';
            } else {
                this.viewState = 'day';
            }
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
        
        if (!this.isLegacy && (this.viewState === 'day' || this.viewState === 'pylon')) {
            this.viewState = 'day';
        }
        sessionStorage.setItem('Q_PLANNER_TIME', this.plannerBase);
        sessionStorage.setItem('Q_PLANNER_SELECTED_DATE', this.selectedDate);
        this.refreshView();
    },

    calculateCivilTension: function(blocksData) {
        let tensionScore = 0;
        let constraintsCount = 0;
        
        blocksData.forEach(b => {
            if (b.text && (b.text.includes('[FIXED]') || b.text.includes('[CIVIL]'))) {
                constraintsCount++;
                if (b.bioState === 'VENT/RECOVERY') {
                    tensionScore += 25; 
                } else {
                    tensionScore += 10; 
                }
            }
        });
        
        let advice = "SCHEDULE ALIGNED. True Ellipse resonance maintained.";
        if (tensionScore > 75) {
            advice = "SEVERE JAGGEDNESS DETECTED. You have forced Fixed Civil Constraints into Vent/Recovery windows. Burnout probability: HIGH. Resonance Re-alignment strongly advised.";
        } else if (tensionScore > 30) {
            advice = "MODERATE FRICTION. Civil logic is overriding biological flow. Consider shifting non-essential legacy meetings to Bio-Green sectors.";
        }

        return { score: Math.min(tensionScore, 99), advice: advice, constraints: constraintsCount };
    },

    injectCSS: function() {
        const style = document.createElement('style');
        style.innerHTML = `
            .q-planner-overlay { position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.85); backdrop-filter: blur(10px); z-index: 10005; display: none; justify-content: center; align-items: center; }
            .q-planner-overlay.active { display: flex; }
            .q-planner-box { width: 95vw; height: 90vh; background: rgba(5, 5, 10, 0.95); border: 1px solid var(--theme-main, #ff003c); border-radius: 12px; overflow: hidden; display: flex; flex-direction: column; box-shadow: 0 20px 50px rgba(0,0,0,0.9); pointer-events: auto; }
            
            /* Desktop Header Flow */
            .cal-header { display: flex; flex-direction: column; padding: 20px; border-bottom: 1px solid rgba(255,255,255,0.1); background: rgba(0,0,0,0.6); gap: 15px; }
            
            #cal-title-container { display: flex; justify-content: center; width: 100%; }
            .header-controls-row { display: flex; justify-content: space-between; align-items: center; width: 100%; flex-wrap: wrap; gap: 10px; }
            
            .step-nav-group { display: flex; justify-content: center; align-items: center; gap: 8px; }
            #action-btn-container { display: flex; justify-content: center; align-items: center; gap: 8px; }
            
            .cal-title-wrapper { display: flex; justify-content: center; align-items: center; gap: 20px; font-family: 'Orbitron'; font-size: 1.3rem; font-weight: 900; }
            .title-leg { color: #fff; letter-spacing: 2px; }
            .title-divider { color: rgba(255,255,255,0.2); font-weight: normal; }
            .title-q { letter-spacing: 2px; }

            .planner-matrix { display: grid; gap: 4px; padding: 20px; flex-grow: 1; overflow-y: auto; }
            
            /* Custom Scrollbar assigned to active theme */
            .q-planner-box *::-webkit-scrollbar { width: 6px; height: 6px; }
            .q-planner-box *::-webkit-scrollbar-track { background: rgba(0,0,0,0.2); border-radius: 4px; }
            .q-planner-box *::-webkit-scrollbar-thumb { background: var(--theme-main, #ff003c); border-radius: 4px; }
            .q-planner-box *::-webkit-scrollbar-thumb:hover { filter: brightness(1.2); }

            .macro-hierarchy-nav { display: flex; gap: 5px; background: rgba(0,0,0,0.6); padding: 4px; border-radius: 6px; border: 1px solid rgba(255,255,255,0.1); }
            .macro-btn { background: transparent; border: none; color: var(--platinum); font-family: 'Orbitron'; font-size: 0.65rem; padding: 6px 12px; cursor: pointer; font-weight: bold; border-radius: 4px; transition: 0.3s; }
            .macro-btn:hover { background: rgba(255,255,255,0.1); color: #fff; }
            .macro-btn.active { background: var(--theme-main, #ff003c) !important; color: #000 !important; box-shadow: 0 0 10px var(--theme-main, #ff003c); }

            .p-day { background: rgba(255,255,255,0.03); border-radius: 4px; padding: 10px; cursor: pointer; min-height: 80px; transition: all 0.3s; border: 1px solid transparent; display: flex; flex-direction: column; justify-content: flex-start; }
            .p-day:hover { background: rgba(255,255,255,0.08); border-color: var(--theme-main, #ff003c); }
            .p-day.status-red { border-left: 3px solid #ff3333; }
            
            .p-day.status-today { border: 1px dashed rgba(255,255,255,0.4); box-shadow: inset 0 0 10px rgba(255,255,255,0.05); }
            .p-day.selected { border-color: var(--theme-main, #ff003c) !important; box-shadow: inset 0 0 20px rgba(255, 0, 60, 0.4) !important; background: rgba(255,255,255,0.05); }
            
            .pylon-block { background: rgba(244, 208, 104, 0.05) !important; border: 1px solid rgba(244, 208, 104, 0.3) !important; display: flex; flex-direction: column; justify-content: center; align-items: center; text-align: center; }
            .pylon-block:hover { background: rgba(244, 208, 104, 0.15) !important; border-color: var(--gold, #F4D068) !important; box-shadow: 0 0 15px rgba(244, 208, 104, 0.2); }
            .pylon-block.selected { border-color: var(--gold, #F4D068) !important; box-shadow: inset 0 0 25px rgba(244, 208, 104, 0.5) !important; }

            .macro-grid-legacy { display: flex; flex-wrap: wrap; gap: 15px; padding: 20px; overflow-y: auto; justify-content: center; }
            .macro-month-box { background: rgba(0,0,0,0.4); border-width: 1px; border-style: solid; border-radius: 8px; padding: 10px; width: calc(33.333% - 15px); min-width: 250px; box-sizing: border-box; }
            .macro-month-title { font-family: 'Orbitron'; font-size: 0.75rem; margin-bottom: 8px; text-align: center; letter-spacing: 2px; font-weight: bold; border-bottom: 1px solid rgba(255,255,255,0.1); padding-bottom: 4px; }
            
            /* TRUE CALENDAR GRID BORDERS */
            .mini-cal-grid { display: grid; grid-template-columns: repeat(7, 1fr); border-top: 1px solid rgba(255,255,255,0.08); border-left: 1px solid rgba(255,255,255,0.08); border-radius: 4px; overflow: hidden; }
            .q-sector-grid { display: grid; grid-template-columns: repeat(6, 1fr); border-top: 1px solid rgba(255,255,255,0.08); border-left: 1px solid rgba(255,255,255,0.08); border-radius: 4px; overflow: hidden; }
            .mini-day { aspect-ratio: 1; display: flex; justify-content: center; align-items: center; font-family: 'JetBrains Mono'; font-size: 0.55rem; background: rgba(0,0,0,0.2); cursor: pointer; transition: 0.2s; border-right: 1px solid rgba(255,255,255,0.08); border-bottom: 1px solid rgba(255,255,255,0.08); color: #fff; box-sizing: border-box; }
            
            .mini-day:hover { background: rgba(255,255,255,0.1); border-color: var(--theme-main, #ff003c); }
            .mini-day.selected { border-color: var(--theme-main, #ff003c) !important; background: var(--theme-main, #ff003c); color: #000; font-weight: bold; box-shadow: 0 0 10px var(--theme-main, #ff003c); z-index: 2;}
            .mini-day.status-today { border: 1px dashed #fff; z-index: 1;}

            .macro-grid-q { display: flex; flex-direction: column; gap: 15px; padding: 20px; overflow-y: auto; }
            .macro-quad-box { background: rgba(0,0,0,0.4); border-width: 1px; border-style: solid; border-radius: 8px; padding: 15px; box-sizing: border-box; }
            .macro-quad-title { font-family: 'Orbitron'; font-size: 0.85rem; margin-bottom: 10px; text-align: center; letter-spacing: 3px; font-weight: bold; border-bottom: 1px solid var(--theme-dim); padding-bottom: 6px; }
            
            .macro-pylon-bar { width: 100%; background: rgba(244, 208, 104, 0.1); border: 1px solid var(--gold, #F4D068); color: var(--gold, #F4D068); text-align: center; padding: 10px; margin: 10px 0; font-family: 'Orbitron'; font-size: 0.75rem; font-weight: bold; letter-spacing: 4px; border-radius: 4px; cursor: pointer; transition: 0.3s; box-shadow: inset 0 0 15px rgba(244, 208, 104, 0.1); }
            .macro-pylon-bar:hover { background: rgba(244, 208, 104, 0.2); box-shadow: inset 0 0 20px rgba(244, 208, 104, 0.4); }
            .macro-pylon-bar.selected { background: var(--gold, #F4D068); color: #000; box-shadow: 0 0 20px var(--gold, #F4D068); border-color: var(--gold, #F4D068) !important; }

            .nav-btn { background: rgba(0,0,0,0.6); border: 1px solid rgba(255,255,255,0.2); color: var(--theme-main, #ff003c); padding: 6px 10px; font-family: 'Orbitron'; font-size: 0.65rem; font-weight: bold; cursor: pointer; border-radius: 4px; transition: 0.3s; }
            .nav-btn:hover { border-color: var(--theme-main, #ff003c); box-shadow: 0 0 10px rgba(255, 0, 60, 0.2); }

            .planner-context { background: rgba(0,0,0,0.5); border: 1px solid var(--theme-dim); padding: 15px; margin: 15px 20px 10px 20px; border-radius: 8px; display: flex; flex-direction: column; gap: 6px; align-items: center; text-align: center; }
            
            .back-btn, .close-planner-btn { background: transparent; border: 1px solid #fff; color: #fff; padding: 6px 12px; cursor: pointer; font-family: 'Orbitron'; font-size: 0.7rem; border-radius: 4px; transition: 0.3s; font-weight: bold; letter-spacing: 1px; }
            .back-btn:hover, .close-planner-btn:hover { background: rgba(255,255,255,0.1); }
            .close-planner-btn { border-color: #ff3333; color: #ff3333; }
            .close-planner-btn:hover { background: rgba(255,51,51,0.1); color: #fff; }
            
            .editor-matrix { display: grid; grid-template-columns: 1fr 1fr; gap: 15px; padding: 20px; overflow-y: auto; }
            .slot-block { padding: 15px; background: rgba(0,0,0,0.4); border-radius: 8px; border: 1px solid rgba(255,255,255,0.1); transition: 0.3s; }
            .slot-block:focus-within { border-color: var(--theme-main, #ff003c); box-shadow: inset 0 0 10px rgba(255, 0, 60, 0.15); }
            
            .q-cal-jump { background: rgba(0,0,0,0.6); border: 1px solid rgba(255,255,255,0.2); color: var(--theme-main, #ff003c); font-family: 'Orbitron'; font-size: 0.65rem; padding: 6px 10px; border-radius: 4px; outline: none; text-align: center; color-scheme: dark; margin-left: 15px; cursor: pointer; transition: 0.3s; }

            /* --- PREDICTIVE PHASE BORDERING & TENSION SCORING --- */
            .time-block { display: flex; flex-direction: column; justify-content: space-between; padding: 15px 20px; border-bottom: 1px solid rgba(255,255,255,0.05); font-family: 'JetBrains Mono'; color: #fff; position: relative; overflow: hidden; transition: 0.3s; }
            .time-block:hover { background: rgba(255,255,255,0.05); }
            .time-block.flow-state { border-left: 4px solid var(--env-green, #a7ff83); background: rgba(167, 255, 131, 0.05); }
            .time-block.vent-state { border-left: 4px solid var(--sys-cyan, #00f0ff); background: rgba(0, 240, 255, 0.05); }
            
            .tension-dashboard { background: rgba(0,0,0,0.6); border: 1px dashed var(--magenta-glow, #ff003c); border-radius: 6px; padding: 15px; margin: 15px 20px 0 20px; display: flex; justify-content: space-between; align-items: center; }
            .tension-score { font-family: 'Orbitron'; font-size: 1.5rem; font-weight: 900; color: var(--magenta-glow, #ff003c); text-shadow: 0 0 15px var(--magenta-dim, rgba(255,0,60,0.3)); }
            .consultant-advice { font-family: 'JetBrains Mono'; font-size: 0.65rem; color: #aaa; max-width: 60%; line-height: 1.4; }
            
            .fixed-civil-constraint { border: 1px solid var(--magenta-glow, #ff003c) !important; background: rgba(255,0,60,0.08) !important; box-shadow: inset 0 0 15px rgba(255,0,60,0.15); margin: 4px 10px; border-radius: 4px; }
            
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
            .macro-btn { padding: 12px 0; font-size: 0.65rem; background: rgba(0,0,0,0.6); border: 1px solid rgba(255,255,255,0.1); }

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
                            <button class="nav-btn" onclick="window.Q_OmniPlanner.stepDay(-1)">&#8249; DAY</button>
                            <button class="nav-btn" onclick="window.Q_OmniPlanner.stepDay(1)">DAY &#8250;</button>
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
            this.selectedDate = window.PYLON_ALPHA_DYNAMIC ? state.simTime : Date.now();
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
        document.getElementById('unified-omni-planner').classList.remove('active'); 
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

    toggleFormat: function() { 
        this.isLegacy = !this.isLegacy; 
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
            if(activeBlock.type === 'PYLON') {
                cTitle = `[ GEAR ENGAGED: ${activeBlock.name} ]`;
                cDesc = `SETTLEMENT NODE: "CELESTIAL DAY". Actively resolving accumulated physical drift. Q-Delta interpolating to 0.0000° across ${(activeBlock.dur / 3600000).toFixed(4)} hours.`;
                contextDiv.style.borderColor = 'var(--gold)';
            } else {
                let daysElapsed = (this.selectedDate - window.PYLON_ALPHA_DYNAMIC) / window.MS_DAY;
                let oData = window.getOrbitalData(daysElapsed);
                let driftDeg = oData.trueArc - oData.meanArc;
                let driftColor = driftDeg > 0 ? '#ff003c' : '#00f0ff';
                let driftState = driftDeg > 0 ? "AHEAD" : "BEHIND";
                cDesc = `<span style="color:var(--gold);">DRIFT:</span> TRUE ELLIPSE ${driftState} <span style="color:${driftColor};">| ${(driftDeg>0?'+':'')}${driftDeg.toFixed(4)}°</span>`;
            }
        }
        
        let htmlStr = '';
        if (cTitle) {
            let titleColor = (!this.isLegacy && cTitle.includes('GEAR')) ? 'var(--gold)' : 'var(--theme-main)';
            htmlStr += `<div style="font-family:'Orbitron'; font-size:0.9rem; color:${titleColor}; font-weight:bold; letter-spacing:1px;">${cTitle}</div>`;
        }
        if (cDesc) {
            htmlStr += `<div style="font-family:'JetBrains Mono'; font-size:0.65rem; color:#aaa; line-height: 1.4; margin-bottom:6px;">${cDesc}</div>`;
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

        if (!this.isLegacy && this.viewState !== 'closed') {
            document.body.classList.add('planner-quad-active');
        } else {
            document.body.classList.remove('planner-quad-active');
        }

        ['day', 'sect', 'quad', 'cycle'].forEach(mode => {
            const btn = document.getElementById(`btn-view-${mode}`);
            if(btn) {
                if(this.viewState === 'day' || this.viewState === 'pylon' || this.viewState === 'hour' || this.viewState === 'pylon-hour') {
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

        const fmtBtn = document.createElement('button'); 
        fmtBtn.className = 'back-btn'; 
        fmtBtn.innerText = this.isLegacy ? "QUAD" : "LEGACY";
        fmtBtn.onclick = () => this.toggleFormat(); 

        if (actionContainer) {
            actionContainer.appendChild(fmtBtn);
            
            if(this.viewState !== 'planner') {
                const hardBackBtn = document.createElement('button');
                hardBackBtn.className = 'back-btn';
                hardBackBtn.innerText = 'BACK';
                hardBackBtn.onclick = () => {
                    if(this.viewState === 'hour' || this.viewState === 'pylon-hour') { this.viewState = this.viewState === 'hour' ? 'day' : 'pylon'; }
                    else if(this.viewState === 'day' || this.viewState === 'pylon') { this.viewState = 'planner'; }
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

        if(this.viewState === 'planner') { 
            if (this.plannerMacroMode === 'sect') this.renderSector(body, title); 
            else if (this.plannerMacroMode === 'quad') this.renderQuad(body, title);
            else this.renderCycle(body, title);
        } 
        else if(this.viewState === 'day') this.renderDay(body, title); 
        else if (this.viewState === 'pylon') this.renderPylon(body, title); 
        else this.renderHour(body, title); 
    },

    injectHolidays: function(element, date) {
        if (!window.PYLON_ALPHA_DYNAMIC || !window.getGlobalHolidays) return;
        const year = date.getUTCFullYear();
        const daysElapsed = (date.getTime() - window.PYLON_ALPHA_DYNAMIC) / window.MS_DAY;
        const o = window.getOrbitalData(daysElapsed);
        const dayArc = o.meanArc;
        
        const allEvents = window.getGlobalHolidays(year);
        const degreesPerDay = 360 / 365.24219;
        
        // STRICT PHASE BORDERING: Exact Multi-Day Span Injection
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
            days.forEach(d => { const h = document.createElement('div'); h.style.textAlign = 'center'; h.style.fontSize = '0.65rem'; h.style.color = '#aaa'; h.style.fontFamily = 'JetBrains Mono'; h.innerText = window.innerWidth <= 768 ? d[0] : d; matrix.appendChild(h); });

            const firstDay = new Date(year, month, 1); const lastDay = new Date(year, month + 1, 0); const startPad = firstDay.getDay();
            for(let i=0; i<startPad; i++) { matrix.appendChild(document.createElement('div')); }
            for(let i=1; i<=lastDay.getDate(); i++) {
                const d = document.createElement('div'); d.className = 'p-day'; const localTs = new Date(year, month, i).getTime();
                
                if(window.hasDataInDay(new Date(localTs))) d.classList.add('status-red');
                if(new Date(localTs).setHours(0,0,0,0) === todayDateNum) d.classList.add('status-today');
                if(new Date(localTs).setHours(0,0,0,0) === selectedDateNum) d.classList.add('selected');
                
                d.innerHTML = `<div style="font-family:Orbitron; font-weight:bold; color:#fff; font-size: 1rem;">${i}</div>`;
                this.injectHolidays(d, new Date(localTs));

                d.onclick = () => { this.selectedDate = localTs; this.setViewMode('day'); };
                matrix.appendChild(d);
            }
        } else {
            matrix.style.gridTemplateColumns = 'repeat(6, 1fr)'; 
            let activeBlock = window.getQBlockByTime(this.plannerBase);
            if(!activeBlock) return;
            
            let aQuad = activeBlock.quad || 1;
            let aSect = activeBlock.sect || 1;
            let cCycle = activeBlock.cycle;
            let d1Index = window.Q_BLOCKS.findIndex(b => b.type === 'DAY' && b.quad === aQuad && b.sect === aSect && b.day === 1);
            
            let gridItems = [];
            if (aQuad === 1 && aSect === 1 && d1Index > 0 && window.Q_BLOCKS[d1Index - 1].type === 'PYLON') {
                gridItems.push(window.Q_BLOCKS[d1Index - 1]);
            }
            for(let i=0; i<30; i++) gridItems.push(window.Q_BLOCKS[d1Index + i]);
            
            let lastDayIdx = d1Index + 29;
            if (aSect === 3 && lastDayIdx + 1 < window.Q_BLOCKS.length && window.Q_BLOCKS[lastDayIdx + 1].type === 'PYLON') {
                gridItems.push(window.Q_BLOCKS[lastDayIdx + 1]);
            }

            gridItems.forEach(item => {
                const absStart = window.PYLON_ALPHA_DYNAMIC + (cCycle * window.Q_YEAR_MS) + item.relStart;
                const d = document.createElement('div');
                const isToday = (nowMs >= absStart && nowMs < absStart + item.dur);
                
                if (item.type === 'PYLON') {
                    d.className = 'p-day pylon-block';
                    if (isToday) d.classList.add('status-today');
                    if (this.selectedDate >= absStart && this.selectedDate < absStart + item.dur) d.classList.add('selected');
                    d.innerHTML = `<div style="font-family:Orbitron; font-weight:bold; color:var(--gold, #F4D068); font-size:0.75rem;">${item.name}</div><div style="font-size:0.5rem; color:#aaa; margin-top:4px;">CELESTIAL DAY</div>`;
                } else {
                    d.className = 'p-day';
                    if (isToday) d.classList.add('status-today');
                    if (this.selectedDate >= absStart && this.selectedDate < absStart + item.dur) d.classList.add('selected');
                    if (window.hasDataInDay(new Date(absStart))) d.classList.add('status-red');
                    d.innerHTML = `<div style="font-family:Orbitron; font-weight:bold; color:var(--theme-main, #ff003c);">DAY ${item.day}</div>`;
                    this.injectHolidays(d, new Date(absStart));
                }
                
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

        title.innerHTML = `<div class="cal-title-wrapper ${this.isLegacy ? 'show-legacy' : 'show-quad'}"><div class="title-leg">LEGACY OS: QUARTER VIEW</div><div class="title-divider">|</div><div class="title-q"><span style="color:var(--gold, #F4D068);">QUADRATURE:</span> <span style="color:#fff;">QUADRANT VIEW</span></div></div>`;
        
        if (this.isLegacy) {
            const baseDate = new Date(this.plannerBase);
            const year = baseDate.getFullYear();
            const currentMonth = baseDate.getMonth();
            const quarterStartMonth = Math.floor(currentMonth / 3) * 3;
            const months = ["JANUARY", "FEBRUARY", "MARCH", "APRIL", "MAY", "JUNE", "JULY", "AUGUST", "SEPTEMBER", "OCTOBER", "NOVEMBER", "DECEMBER"];
            const mColors = ['#00f0ff', '#0ea5e9', '#38bdf8', '#a7ff83', '#4ade80', '#22c55e', '#F4D068', '#fbbf24', '#f59e0b', '#ff003c', '#f43f5e', '#e11d48'];
            const daysOfWeek = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
            
            const matrix = document.createElement('div');
            matrix.className = 'macro-grid-legacy';
            
            for(let m = quarterStartMonth; m < quarterStartMonth + 3; m++) {
                const monthBox = document.createElement('div');
                monthBox.className = 'macro-month-box';
                monthBox.style.borderColor = mColors[m];
                monthBox.innerHTML = `<div class="macro-month-title" style="color:${mColors[m]}">${months[m]} ${year}</div>`;
                
                const grid = document.createElement('div');
                grid.className = 'mini-cal-grid';
                daysOfWeek.forEach(dayName => {
                    const header = document.createElement('div');
                    header.className = 'mini-day';
                    header.style.color = mColors[m];
                    header.style.background = 'rgba(0,0,0,0.4)';
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
            let aQuad = activeBlock.quad || 1;
            let cCycle = activeBlock.cycle;
            const qColors = ['', '#00f0ff', '#a7ff83', '#F4D068', '#ff003c'];
            
            const matrix = document.createElement('div');
            matrix.className = 'macro-grid-q';
            
            const quadBox = document.createElement('div');
            quadBox.className = 'macro-quad-box';
            quadBox.style.borderColor = qColors[aQuad];
            quadBox.innerHTML = `<div class="macro-quad-title" style="color:${qColors[aQuad]}">QUADRANT ${aQuad}</div>`;
            
            let d1Index = window.Q_BLOCKS.findIndex(b => b.type === 'DAY' && b.quad === aQuad && b.sect === 1 && b.day === 1);
            
            if (aQuad === 1 && d1Index > 0 && window.Q_BLOCKS[d1Index - 1].type === 'PYLON') {
                const item = window.Q_BLOCKS[d1Index - 1];
                const absStart = window.PYLON_ALPHA_DYNAMIC + (cCycle * window.Q_YEAR_MS) + item.relStart;
                const pb = document.createElement('div');
                pb.className = 'macro-pylon-bar';
                if (this.selectedDate >= absStart && this.selectedDate < absStart + item.dur) pb.classList.add('selected');
                pb.innerText = `${item.name} // CELESTIAL DAY // Q-DELTA RESET`;
                pb.onclick = () => { this.selectedDate = absStart; this.setViewMode('day'); };
                quadBox.appendChild(pb);
            }
            
            const sectorsWrapper = document.createElement('div');
            sectorsWrapper.style.cssText = 'display:flex; flex-wrap:wrap; gap:15px; justify-content:center;';
            
            for(let s = 1; s <= 3; s++) {
                const sectorBox = document.createElement('div');
                sectorBox.className = 'macro-month-box';
                sectorBox.style.borderColor = qColors[aQuad];
                sectorBox.innerHTML = `<div class="macro-month-title" style="color:${qColors[aQuad]}">SECTOR ${s}</div>`;
                
                const qGrid = document.createElement('div');
                qGrid.className = 'q-sector-grid';
                for(let d=1; d<=6; d++) {
                    const header = document.createElement('div');
                    header.className = 'mini-day';
                    header.style.color = qColors[aQuad];
                    header.style.background = 'rgba(0,0,0,0.4)';
                    header.style.pointerEvents = 'none';
                    header.style.fontWeight = 'bold';
                    header.innerText = 'DAY ' + d;
                    qGrid.appendChild(header);
                }
                
                let dayBlocks = window.Q_BLOCKS.filter(b => b.type === 'DAY' && b.quad === aQuad && b.sect === s);
                dayBlocks.forEach(item => {
                    const absStart = window.PYLON_ALPHA_DYNAMIC + (cCycle * window.Q_YEAR_MS) + item.relStart;
                    const isToday = (nowMs >= absStart && nowMs < absStart + item.dur);
                    const d = document.createElement('div'); 
                    d.className = 'mini-day'; 
                    d.innerText = item.day;
                    if(isToday) d.classList.add('status-today');
                    if(this.selectedDate >= absStart && this.selectedDate < absStart + item.dur) d.classList.add('selected');
                    d.onclick = () => { this.selectedDate = absStart; this.setViewMode('day'); };
                    qGrid.appendChild(d);
                });
                sectorBox.appendChild(qGrid);
                sectorsWrapper.appendChild(sectorBox);
            }
            quadBox.appendChild(sectorsWrapper);
            
            let lastDayIdx = window.Q_BLOCKS.findIndex(b => b.type === 'DAY' && b.quad === aQuad && b.sect === 3 && b.day === 30);
            if (lastDayIdx + 1 < window.Q_BLOCKS.length && window.Q_BLOCKS[lastDayIdx + 1].type === 'PYLON') {
                const item = window.Q_BLOCKS[lastDayIdx + 1];
                const absStart = window.PYLON_ALPHA_DYNAMIC + (cCycle * window.Q_YEAR_MS) + item.relStart;
                const pb = document.createElement('div');
                pb.className = 'macro-pylon-bar';
                if (this.selectedDate >= absStart && this.selectedDate < absStart + item.dur) pb.classList.add('selected');
                pb.innerText = `${item.name} // CELESTIAL DAY // Q-DELTA RESET`;
                pb.onclick = () => { this.selectedDate = absStart; this.setViewMode('day'); };
                quadBox.appendChild(pb);
            }
            
            matrix.appendChild(quadBox);
            container.appendChild(matrix);
        }
    },

    renderCycle: function(container, title) {
        const nowMs = Date.now();
        const todayDateNum = new Date(nowMs).setHours(0,0,0,0);
        const selectedDateNum = new Date(this.selectedDate).setHours(0,0,0,0);

        if (this.isLegacy) {
            title.innerHTML = `<div class="cal-title-wrapper ${this.isLegacy ? 'show-legacy' : 'show-quad'}"><div class="title-leg">LEGACY OS: ANNUAL CYCLE</div><div class="title-divider">|</div><div class="title-q"><span style="color:var(--gold, #F4D068);">QUADRATURE:</span> <span style="color:#fff;">ANNUAL CYCLE</span></div></div>`;
            const baseDate = new Date(this.plannerBase);
            const year = baseDate.getFullYear();
            const months = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"];
            const mColors = ['#00f0ff', '#0ea5e9', '#38bdf8', '#a7ff83', '#4ade80', '#22c55e', '#F4D068', '#fbbf24', '#f59e0b', '#ff003c', '#f43f5e', '#e11d48'];
            const daysOfWeek = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
            
            const matrix = document.createElement('div');
            matrix.className = 'macro-grid-legacy';
            
            for(let m = 0; m < 12; m++) {
                const monthBox = document.createElement('div');
                monthBox.className = 'macro-month-box';
                monthBox.style.borderColor = mColors[m];
                monthBox.innerHTML = `<div class="macro-month-title" style="color:${mColors[m]}">${months[m]}</div>`;
                
                const grid = document.createElement('div');
                grid.className = 'mini-cal-grid';
                daysOfWeek.forEach(dayName => {
                    const header = document.createElement('div');
                    header.className = 'mini-day';
                    header.style.color = mColors[m];
                    header.style.background = 'rgba(0,0,0,0.4)';
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
            title.innerHTML = `<div class="cal-title-wrapper ${this.isLegacy ? 'show-legacy' : 'show-quad'}"><div class="title-leg">LEGACY OS: ANNUAL CYCLE</div><div class="title-divider">|</div><div class="title-q"><span style="color:var(--gold, #F4D068);">QUADRATURE:</span> <span style="color:#fff;">CYCLE ${cCycle}</span></div></div>`;
            const qColors = ['', '#00f0ff', '#a7ff83', '#F4D068', '#ff003c'];
            
            const matrix = document.createElement('div');
            matrix.className = 'macro-grid-q';
            
            for(let q = 1; q <= 4; q++) {
                const quadBox = document.createElement('div');
                quadBox.className = 'macro-quad-box';
                quadBox.style.borderColor = qColors[q];
                quadBox.innerHTML = `<div class="macro-quad-title" style="color:${qColors[q]}">QUADRANT ${q}</div>`;
                
                let d1Index = window.Q_BLOCKS.findIndex(b => b.type === 'DAY' && b.quad === q && b.sect === 1 && b.day === 1);
                
                if (q === 1 && d1Index > 0 && window.Q_BLOCKS[d1Index - 1].type === 'PYLON') {
                    const item = window.Q_BLOCKS[d1Index - 1];
                    const absStart = window.PYLON_ALPHA_DYNAMIC + (cCycle * window.Q_YEAR_MS) + item.relStart;
                    const pb = document.createElement('div');
                    pb.className = 'macro-pylon-bar';
                    if (this.selectedDate >= absStart && this.selectedDate < absStart + item.dur) pb.classList.add('selected');
                    pb.innerText = `${item.name} // CELESTIAL DAY // Q-DELTA RESET`;
                    pb.onclick = () => { this.selectedDate = absStart; this.setViewMode('day'); };
                    quadBox.appendChild(pb);
                }
                
                const sectorsWrapper = document.createElement('div');
                sectorsWrapper.style.cssText = 'display:flex; flex-wrap:wrap; gap:15px; justify-content:center;';
                
                for(let s = 1; s <= 3; s++) {
                    const sectorBox = document.createElement('div');
                    sectorBox.className = 'macro-month-box';
                    sectorBox.style.borderColor = qColors[q];
                    sectorBox.innerHTML = `<div class="macro-month-title" style="color:${qColors[q]}">SECTOR ${s}</div>`;
                    
                    const qGrid = document.createElement('div');
                    qGrid.className = 'q-sector-grid';
                    for(let d=1; d<=6; d++) {
                        const header = document.createElement('div');
                        header.className = 'mini-day';
                        header.style.color = qColors[q];
                        header.style.background = 'rgba(0,0,0,0.4)';
                        header.style.pointerEvents = 'none';
                        header.style.fontWeight = 'bold';
                        header.innerText = 'DAY ' + d;
                        qGrid.appendChild(header);
                    }
                    
                    let dayBlocks = window.Q_BLOCKS.filter(b => b.type === 'DAY' && b.quad === q && b.sect === s);
                    dayBlocks.forEach(item => {
                        const absStart = window.PYLON_ALPHA_DYNAMIC + (cCycle * window.Q_YEAR_MS) + item.relStart;
                        const isToday = (nowMs >= absStart && nowMs < absStart + item.dur);
                        const d = document.createElement('div'); 
                        d.className = 'mini-day'; 
                        d.innerText = item.day;
                        if(isToday) d.classList.add('status-today');
                        if(this.selectedDate >= absStart && this.selectedDate < absStart + item.dur) d.classList.add('selected');
                        d.onclick = () => { this.selectedDate = absStart; this.setViewMode('day'); };
                        qGrid.appendChild(d);
                    });
                    sectorBox.appendChild(qGrid);
                    sectorsWrapper.appendChild(sectorBox);
                }
                quadBox.appendChild(sectorsWrapper);
                
                let lastDayIdx = window.Q_BLOCKS.findIndex(b => b.type === 'DAY' && b.quad === q && b.sect === 3 && b.day === 30);
                if (lastDayIdx + 1 < window.Q_BLOCKS.length && window.Q_BLOCKS[lastDayIdx + 1].type === 'PYLON') {
                    const item = window.Q_BLOCKS[lastDayIdx + 1];
                    const absStart = window.PYLON_ALPHA_DYNAMIC + (cCycle * window.Q_YEAR_MS) + item.relStart;
                    const pb = document.createElement('div');
                    pb.className = 'macro-pylon-bar';
                    if (this.selectedDate >= absStart && this.selectedDate < absStart + item.dur) pb.classList.add('selected');
                    pb.innerText = `${item.name} // CELESTIAL DAY // Q-DELTA RESET`;
                    pb.onclick = () => { this.selectedDate = absStart; this.setViewMode('day'); };
                    quadBox.appendChild(pb);
                }
                matrix.appendChild(quadBox);
            }
            container.appendChild(matrix);
        }
    },

    renderDay: function(container, title) {
        title.innerHTML = window.getDualTitle(this.selectedDate, this.isLegacy);
        const list = document.createElement('div'); 
        list.style.overflowY = "auto"; list.style.flexGrow = "1";

        let dailyBlocksData = [];
        let savedAnchor = localStorage.getItem('q_bio_anchor');
        let anchorMins = (savedAnchor === null || savedAnchor === "") ? 0 : parseInt(savedAnchor); 
        let cycleDuration = parseInt(localStorage.getItem('q_bio_duration')) || 90; 
        
        const selectedDateObj = new Date(this.selectedDate);
        
        for(let h=0; h<24; h++) {
            const blockMs = new Date(selectedDateObj.getFullYear(), selectedDateObj.getMonth(), selectedDateObj.getDate(), h, 0, 0).getTime();
            const key = window.getDataKey(selectedDateObj, h, 0);
            const data = window.qData[key] || { text: "" };
            
            let activeMs = ((blockMs % 86400000) - (anchorMins * 60000) + 86400000) % 86400000;
            let cyclePosFloat = (activeMs % (cycleDuration * 60000)) / (cycleDuration * 60000);
            let currentBioState = (cyclePosFloat >= 0.22 && cyclePosFloat < 0.77) ? "DEEP FLOW" : "VENT/RECOVERY";
            
            dailyBlocksData.push({ hour: h, text: data.text, bioState: currentBioState, key: key, ms: blockMs });
        }
        
        const tensionData = this.calculateCivilTension(dailyBlocksData);
        
        const dashboard = document.createElement('div');
        dashboard.innerHTML = `
            <div class="tension-dashboard">
                <div style="display:flex; flex-direction:column;">
                    <span style="font-family:'Orbitron'; font-size:0.6rem; color:#aaa;">CIVIL TENSION SCORE</span>
                    <span class="tension-score">${tensionData.score}%</span>
                </div>
                <div class="consultant-advice">${tensionData.advice}</div>
            </div>
        `;
        list.appendChild(dashboard);

        dailyBlocksData.forEach(b => {
            const isCivilConstraint = b.text.includes('[FIXED]') || b.text.includes('[CIVIL]');
            let blockClass = b.bioState === 'DEEP FLOW' ? 'flow-state' : 'vent-state';
            if (isCivilConstraint) blockClass += ' fixed-civil-constraint';
            
            const block = document.createElement('div');
            block.className = `time-block ${blockClass}`;
            
            let timeHeaderHtml = "";
            if (this.isLegacy) {
                let civilFmt = window.formatLegacyDate(b.ms);
                timeHeaderHtml = `<div class="time-header" style="font-size:0.9rem; color:var(--theme-main, #00f0ff); font-family:'Orbitron'; font-weight:bold;">${civilFmt.timeStr.split(' ')[0]} LOCAL</div>`;
            } else {
                let civilFmt = window.formatLegacyDate(b.ms);
                timeHeaderHtml = `<div class="time-header" style="display:flex; gap: 8px; align-items:baseline;"><span style="font-size:0.9rem; color:var(--theme-main, #00f0ff); font-family:'Orbitron'; font-weight:bold;">Q:${b.hour.toString().padStart(2,'0')}</span><span style="font-size:0.55rem; color:#aaa; font-weight:bold;">(${civilFmt.timeStr.split(' ')[0]})</span></div>`;
            }
            
            let badgeHtml = b.bioState === 'DEEP FLOW' 
                ? `<span style="color:var(--env-green, #a7ff83); font-size:0.5rem; font-weight:bold; font-family:'Orbitron';">DEEP FLOW</span>` 
                : `<span style="color:var(--sys-cyan, #00f0ff); font-size:0.5rem; font-weight:bold; font-family:'Orbitron';">VENT / RECOVERY</span>`;

            if (isCivilConstraint) {
                badgeHtml += ` <span style="background:var(--magenta-glow, #ff003c); color:#000; padding:2px 6px; border-radius:2px; font-size:0.5rem; font-weight:bold; font-family:'Orbitron'; margin-left:5px;">FIXED CIVIL CONSTRAINT</span>`;
            }

            block.innerHTML = `
                <div style="display:flex; justify-content:space-between; align-items:baseline; margin-bottom: 8px;">
                    ${timeHeaderHtml}
                    <div>${badgeHtml}</div>
                </div>
                <div style="font-size:0.6rem; color:#aaa; font-family:'JetBrains Mono'; white-space:nowrap; overflow:hidden; text-overflow:ellipsis; opacity:0.8;">
                    ${b.text ? b.text : "..."}
                </div>
            `;
            
            block.onclick = () => { 
                this.selectedHour = b.hour; 
                this.selectedHourDur = 3600000; 
                this.viewState = 'hour'; 
                this.refreshView(); 
            };
            
            list.appendChild(block);
        });

        container.appendChild(list);
    },

    renderPylon: function(container, title) {
        let dualTitleHtml = window.getDualTitle(this.selectedPylon.startMs, this.isLegacy);
        title.innerHTML = dualTitleHtml;
        
        let totalHours = Math.ceil(this.selectedPylon.dur / 3600000);
        const list = document.createElement('div'); list.style.overflowY = "auto"; list.style.flexGrow = "1";
        
        for(let h=0; h<totalHours; h++) {
            const row = document.createElement('div'); 
            row.style.padding = "15px 20px"; row.style.borderBottom = "1px solid rgba(255,255,255,0.05)"; 
            row.style.cursor = "pointer"; row.style.fontFamily = "JetBrains Mono"; row.style.color = "#fff"; 
            
            let isFractional = (h === totalHours - 1) && (this.selectedPylon.dur % 3600000 !== 0);
            let minSpan = isFractional ? Math.round((this.selectedPylon.dur % 3600000) / 60000) : 60;
            
            row.innerHTML = `
                <div style="display:flex; justify-content:space-between; align-items:center;">
                    <span style="color:var(--gold, #F4D068); font-weight:bold; font-family:'Orbitron';">GEAR HOUR ${h.toString().padStart(2,'0')}</span>
                    <span style="color:#aaa; font-size:0.6rem;">[ SPAN: ${minSpan} MINS ]</span>
                </div>
            `;
            row.onclick = () => { 
                this.selectedHour = h; 
                this.selectedHourDur = isFractional ? (this.selectedPylon.dur % 3600000) : 3600000;
                this.viewState = 'pylon-hour'; 
                this.refreshView(); 
            }; 
            list.appendChild(row);
        }
        container.appendChild(list);
    },

    renderHour: function(container, title) {
        const isPylon = (this.viewState === 'pylon-hour');
        let baseMs = isPylon ? this.selectedPylon.startMs : this.selectedDate;
        let dualTitleHtml = window.getDualTitle(baseMs, this.isLegacy);
        
        if (isPylon) {
            title.innerHTML = `${dualTitleHtml} <div style="font-size:0.75rem; color:var(--gold, #F4D068); font-family:'Orbitron'; margin-top:6px; text-align:center;">@ HR ${this.selectedHour.toString().padStart(2,'0')}</div>`;
        } else {
            title.innerHTML = `${dualTitleHtml} <div style="font-size:0.75rem; color:#aaa; font-family:'Orbitron'; margin-top:6px; text-align:center;">@ ${this.isLegacy ? 'LOCAL' : 'Q-HR'} ${this.selectedHour.toString().padStart(2,'0')}${this.isLegacy ? ':00' : ''}</div>`;
        }

        const matrix = document.createElement('div'); matrix.className = 'editor-matrix';
        let totalMins = Math.ceil(this.selectedHourDur / 60000);
        
        let savedAnchor = localStorage.getItem('q_bio_anchor');
        let anchorMins = (savedAnchor === null || savedAnchor === "") ? 0 : parseInt(savedAnchor); 
        let cycleDuration = parseInt(localStorage.getItem('q_bio_duration')) || 90; 
        
        for(let m=0; m<totalMins; m+=5) {
            let targetMs = baseMs + (this.selectedHour * 3600000) + (m * 60000);
            const key = window.getDataKey(new Date(targetMs), this.selectedHour, m);
            const data = window.qData[key] || { text: "", link: "" };
            const diff = (targetMs - window.PYLON_ALPHA_DYNAMIC) / window.MS_DAY; 
            const orbital = window.getOrbitalData(diff);
            
            let activeMs = ((targetMs % 86400000) - (anchorMins * 60000) + 86400000) % 86400000;
            let cyclePosFloat = (activeMs % (cycleDuration * 60000)) / (cycleDuration * 60000);
            let currentBioState = (cyclePosFloat >= 0.22 && cyclePosFloat < 0.77) ? "DEEP FLOW" : "VENT/RECOVERY";
            
            const isCivilConstraint = data.text.includes('[FIXED]') || data.text.includes('[CIVIL]');
            let blockClass = currentBioState === 'DEEP FLOW' ? 'flow-state' : 'vent-state';
            if (isCivilConstraint) blockClass += ' fixed-civil-constraint';
            
            const block = document.createElement('div'); 
            block.className = `slot-block time-block ${blockClass}`;
            
            let timeHeaderHtml = "";
            if (isPylon) {
                timeHeaderHtml = `<div style="font-size:0.8rem; color:var(--gold, #F4D068); font-family:'Orbitron'; font-weight:bold;">GEAR MIN:${m.toString().padStart(2,'0')}</div>`;
            } else if (this.isLegacy) {
                timeHeaderHtml = `<div style="font-size:0.8rem; color:var(--theme-main, #ff003c); font-family:'Orbitron'; font-weight:bold;">:${m.toString().padStart(2,'0')} LOCAL</div>`;
            } else {
                let civilFmt = window.formatLegacyDate(targetMs);
                timeHeaderHtml = `<div style="display:flex; gap: 8px; align-items:baseline;"><span style="font-size:0.8rem; color:var(--theme-main, #ff003c); font-family:'Orbitron'; font-weight:bold;">Q:${m.toString().padStart(2,'0')}</span><span style="font-size:0.55rem; color:#aaa; font-weight:bold;">(${civilFmt.timeStr.split(' ')[0]})</span></div>`;
            }

            block.innerHTML = `
                <div style="display:flex; justify-content:space-between; align-items:baseline; margin-bottom: 8px;">
                    ${timeHeaderHtml}
                    <div style="font-size:0.5rem; color:#aaa; font-family:'JetBrains Mono';">COORD: ${orbital.trueArc.toFixed(2)}°</div>
                </div>
                <textarea style="width:100%; min-height: 60px; background:transparent; color:#fff; border:none; border-bottom:1px solid rgba(255,255,255,0.2); margin-top: 8px; font-family:'JetBrains Mono'; resize:vertical; outline:none;" placeholder="Enter quadrature intent or [FIXED] civil event..." oninput="window.qData['${key}'].text=this.value; window.savePlannerData();">${data.text}</textarea>`;
            
            if(!window.qData[key]) window.qData[key] = { text: "", link: "" }; 
            matrix.appendChild(block);
        }
        container.appendChild(matrix);
    }
};

window.addEventListener('DOMContentLoaded', () => window.Q_OmniPlanner.init());