// THE QUADRATURE: METAPHYSICAL VECTOR ENGINE
// Architect: Kelby | Engineer: Kairos
// STATUS: Phase IV UI Engine. Decoupled Logic & Math Engine.
// REVISION: Critical DOM Targeting Fix. Hollow Shell IDs (tl/tr/bl/br) correctly mapped.

window.Q_REGISTRY = {
    REL_DB: {
        jud: [
            { name: "Purim", coord: 75.0, type: 'node-jud', glyph: '✡' },
            { name: "Passover", coord: 115.5, type: 'node-jud', glyph: '✡' }, 
            { name: "Shavuot", coord: 165.0, type: 'node-jud', glyph: '✡' },
            { name: "Rosh Hashanah", coord: 270.2, type: 'node-jud', glyph: '✡' }, 
            { name: "Yom Kippur", coord: 279.5, type: 'node-jud', glyph: '✡' },
            { name: "Sukkot", coord: 285.0, type: 'node-jud', glyph: '✡' },
            { name: "Hanukkah", coord: 350.0, type: 'node-jud', glyph: '✡' }
        ],
        chr: [
            { name: "Christmas", coord: 4.1, type: 'node-chr', glyph: '✝' },
            { name: "Epiphany", coord: 16.0, type: 'node-chr', glyph: '✝' },
            { name: "Ash Wednesday", coord: 65.0, type: 'node-chr', glyph: '✝' },
            { name: "Palm Sunday", coord: 98.0, type: 'node-chr', glyph: '✝' },
            { name: "Good Friday", coord: 103.0, type: 'node-chr', glyph: '✝' },
            { name: "Easter", coord: 105.2, type: 'node-chr', glyph: '✝' }, 
            { name: "Pentecost", coord: 154.5, type: 'node-chr', glyph: '✝' },
            { name: "All Saints Day", coord: 311.0, type: 'node-chr', glyph: '✝' },
            { name: "Advent Begins", coord: 335.0, type: 'node-chr', glyph: '✝' }
        ],
        hin: [
            { name: "Maha Shivaratri", coord: 70.0, type: 'node-hin', glyph: 'ॐ' },
            { name: "Holi", coord: 105.8, type: 'node-hin', glyph: 'ॐ' },
            { name: "Navaratri", coord: 255.0, type: 'node-hin', glyph: 'ॐ' },
            { name: "Diwali", coord: 310.4, type: 'node-hin', glyph: 'ॐ' },
            { name: "Krishna Janmashtami", coord: 340.0, type: 'node-hin', glyph: 'ॐ' }
        ],
        bud: [
            { name: "Mahayana New Year", coord: 30.0, type: 'node-bud', glyph: '☸' },
            { name: "Vesak", coord: 135.5, type: 'node-bud', glyph: '☸' }, 
            { name: "Asalha Puja", coord: 195.0, type: 'node-bud', glyph: '☸' },
            { name: "Bodhi Day", coord: 345.2, type: 'node-bud', glyph: '☸' }
        ],
        tao: [
            { name: "Dongzhi", coord: 0.0, type: 'node-tao', glyph: '☯' },
            { name: "Chinese New Year", coord: 45.0, type: 'node-tao', glyph: '☯' },
            { name: "Lantern Festival", coord: 60.0, type: 'node-tao', glyph: '☯' },
            { name: "Qingming", coord: 105.0, type: 'node-tao', glyph: '☯' },
            { name: "Dragon Boat", coord: 170.0, type: 'node-tao', glyph: '☯' },
            { name: "Mid-Autumn", coord: 265.0, type: 'node-tao', glyph: '☯' }
        ],
        civ: [
            { name: "New Year's Day", coord: 10.0, type: 'node-civ', glyph: '★' }, 
            { name: "MLK Jr. Day", coord: 25.0, type: 'node-civ', glyph: '★' },
            { name: "Presidents' Day", coord: 58.0, type: 'node-civ', glyph: '★' },
            { name: "Memorial Day", coord: 158.0, type: 'node-civ', glyph: '★' },
            { name: "Juneteenth", coord: 179.0, type: 'node-civ', glyph: '★' },
            { name: "Independence Day", coord: 194.5, type: 'node-civ', glyph: '★' }, 
            { name: "Labor Day", coord: 252.0, type: 'node-civ', glyph: '★' },
            { name: "Indigenous Peoples' Day", coord: 290.0, type: 'node-civ', glyph: '★' },
            { name: "Veterans Day", coord: 320.0, type: 'node-civ', glyph: '★' },
            { name: "Thanksgiving", coord: 338.0, type: 'node-civ', glyph: '★' }
        ],
        hol: [
            { name: "New Year's Eve", coord: 9.0, type: 'node-hol', glyph: '🎈' },
            { name: "Groundhog Day", coord: 42.0, type: 'node-hol', glyph: '🎈' },
            { name: "Valentine's Day", coord: 54.0, type: 'node-hol', glyph: '🎈' },
            { name: "St. Patrick's Day", coord: 85.0, type: 'node-hol', glyph: '🎈' },
            { name: "April Fools' Day", coord: 100.0, type: 'node-hol', glyph: '🎈' },
            { name: "Earth Day", coord: 121.0, type: 'node-hol', glyph: '🎈' },
            { name: "Cinco de Mayo", coord: 133.0, type: 'node-hol', glyph: '🎈' },
            { name: "Mother's Day", coord: 140.0, type: 'node-hol', glyph: '🎈' },
            { name: "Father's Day", coord: 175.0, type: 'node-hol', glyph: '🎈' },
            { name: "Halloween", coord: 310.0, type: 'node-hol', glyph: '🎈' }
        ]
    },
    ANCHORS: [
        { name: "Alpha Anchor", coord: 0, type: 'node-anc', glyph: '◓', event: 'SOUTHERN SOLSTICE' },
        { name: "Beta Anchor", coord: 90, type: 'node-anc', glyph: '◐', event: '1ST EQUINOX' },
        { name: "Gamma Anchor", coord: 180, type: 'node-anc', glyph: '◒', event: 'NORTHERN SOLSTICE' },
        { name: "Delta Anchor", coord: 270, type: 'node-anc', glyph: '◑', event: '2ND EQUINOX' }
    ],
    SOLAR_TERMS: Array.from({length: 24}).map((_,i) => ({ name: `Jiéqì ${i+1}`, start: i*15, theme: "Resonance" }))
};

let currentMode = 'zod'; 
let activeTermName = "";
let currentRenderedYear = -1;

let activeFaiths = ['jud', 'isl', 'chr', 'hin', 'bud', 'tao'];
let activeCivil = true;
let activeIntrospection = true;
let activeZodiac = localStorage.getItem('q_zodiac_visible') !== 'false';

let activeHolidays = true;
let activeAnchors = true;
let activeSys = true;

let ISL_DB = [];
let SYS_DB = [ { name: "Tax Day (US)", coord: 113.4, type: 'node-sys', glyph: '$' } ];

window.injectVectorData = function() {
    const optTL = document.getElementById('opt-tl');
    if (optTL) { optTL.onclick = (e) => { e.stopPropagation(); window.openOptions(e, 'rel'); }; optTL.style.color = 'var(--gold-bright)'; }

    const optTR = document.getElementById('opt-tr');
    if (optTR) { optTR.onclick = (e) => { e.stopPropagation(); window.openOptions(e, 'zod'); }; optTR.style.color = 'var(--gold-bright)'; }

    const optBL = document.getElementById('opt-bl');
    if (optBL) { optBL.onclick = (e) => { e.stopPropagation(); window.openOptions(e, 'civ'); }; optBL.style.color = 'var(--gold-bright)'; }

    const optBR = document.getElementById('opt-br');
    if (optBR) { optBR.onclick = (e) => { e.stopPropagation(); window.openOptions(e, 'int'); }; optBR.style.color = 'var(--gold-bright)'; }

    const quadTL = document.getElementById('quad-tl');
    if (quadTL) {
        quadTL.innerHTML = `
            <div id="wrapper-rel" class="panel-data-wrapper" onclick="setMode('rel')">
                <div class="v-head">RELIGIOUS OVERLAY</div>
                <div class="t-row"><span>SUB-SET:</span> <span id="rel-active" class="val-sm">MULTI-FAITH</span></div>
                <div class="t-row"><span>NEXT:</span> <span id="rel-next" class="val-sm">--</span></div>
            </div>
        `;
    }

    const quadTR = document.getElementById('quad-tr');
    if (quadTR) {
        quadTR.innerHTML = `
            <div id="wrapper-zod" class="panel-data-wrapper" onclick="setMode('zod')">
                <div class="v-head">ZODIACAL TRANSIT</div>
                <div class="t-row"><span>HOUSE:</span> <span id="zod-house" class="val-sm">--</span></div>
                <div class="t-row"><span>PHASE:</span> <span id="zod-phase" class="val-sm">--</span></div>
            </div>
        `;
    }

    const quadBL = document.getElementById('quad-bl');
    if (quadBL) {
        quadBL.innerHTML = `
            <div id="wrapper-civ" class="panel-data-wrapper" onclick="setMode('civ')">
                <div class="v-head">CIVIL ANCHOR</div>
                <div class="t-row"><span>LOCALE:</span> <span id="civ-active" class="val-sm">US (STATIC)</span></div>
                <div class="t-row"><span>NEXT:</span> <span id="civ-next" class="val-sm">--</span></div>
            </div>
        `;
    }

    const quadBR = document.getElementById('quad-br');
    if (quadBR) {
        quadBR.innerHTML = `
            <div id="wrapper-int" class="panel-data-wrapper" onclick="setMode('int')">
                <div class="v-head">INTROSPECTION</div>
                <div class="t-row"><span>JIÉQÌ:</span> <span id="int-term" class="val-sm">--</span></div>
                <div class="t-row"><span>GROWTH ARC:</span> <span id="int-pct" class="val-sm">--%</span></div>
            </div>
        `;
    }
    
    setMode(currentMode);
};

function initLocalHUD() {
    const checkExist = setInterval(function() {
        if (document.getElementById('quad-tl')) {
            clearInterval(checkExist);
            if (window.injectVectorData) window.injectVectorData();
        }
    }, 50);
    setTimeout(() => clearInterval(checkExist), 5000);
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initLocalHUD);
} else {
    initLocalHUD();
}

function setMode(mode) {
    currentMode = mode;
    document.querySelectorAll('.panel-data-wrapper').forEach(el => {
        const head = el.querySelector('.v-head');
        if(head) {
            head.style.color = 'var(--brass)';
            head.style.textShadow = 'none';
        }
    });
    const activeEl = document.getElementById(`wrapper-${mode}`);
    if(activeEl) {
        const head = activeEl.querySelector('.v-head');
        if(head) {
            head.style.color = 'var(--gold-bright)';
            head.style.textShadow = '0 0 10px var(--gold-bright)';
        }
    }
}

function toggleVisibility(type, btn) {
    if(type === 'hol') { activeHolidays = !activeHolidays; btn.classList.toggle('active', activeHolidays); }
    if(type === 'anc') { activeAnchors = !activeAnchors; btn.classList.toggle('active', activeAnchors); }
    if(type === 'sys') { activeSys = !activeSys; btn.classList.toggle('active', activeSys); }
    renderDynamicRing();
}

function recalculateDynamicHolidays(year) {
    if (!window.ANCHOR_ALPHA_DYNAMIC) return;
    const yearDiff = year - 2026;
    const shiftDays = yearDiff * -10.87; 
    
    const ramadanTime = new Date(Date.UTC(2026, 1, 18, 12, 0, 0)).getTime() + (shiftDays * window.MS_DAY);
    const fitrTime = new Date(Date.UTC(2026, 2, 20, 12, 0, 0)).getTime() + (shiftDays * window.MS_DAY);
    const adhaTime = new Date(Date.UTC(2026, 4, 27, 12, 0, 0)).getTime() + (shiftDays * window.MS_DAY);

    ISL_DB = [
        { name: "Ramadan Begins", time: ramadanTime, type: 'node-isl', glyph: '☪' },
        { name: "Eid al-Fitr", time: fitrTime, type: 'node-isl', glyph: '☪' },
        { name: "Eid al-Adha", time: adhaTime, type: 'node-isl', glyph: '☪' }
    ];

    ISL_DB.forEach(ev => {
        if (window.getOrbitalData) {
            let diff = ev.time - window.ANCHOR_ALPHA_DYNAMIC;
            let days = diff / window.MS_DAY;
            ev.coord = window.getOrbitalData(days).meanArc;
        }
    });
}

function applyFanning(nodes) {
    let isMobile = window.innerWidth <= 768;
    let windowSize = isMobile ? 5.0 : 3.5; 
    let list = nodes.map(n => ({...n, renderCoord: n.coord}));
    list.sort((a,b) => a.coord - b.coord);
    
    let clusters = []; let currentCluster = [];
    for(let i=0; i<list.length; i++) {
        if(currentCluster.length === 0) currentCluster.push(list[i]);
        else {
            let diff = list[i].coord - currentCluster[currentCluster.length-1].coord;
            if(diff < windowSize) currentCluster.push(list[i]);
            else { clusters.push(currentCluster); currentCluster = [list[i]]; }
        }
    }
    if(currentCluster.length > 0) clusters.push(currentCluster);

    let result = [];
    clusters.forEach(c => {
        if(c.length > 1 && isMobile) {
            result.push({
                isCluster: true,
                coord: c[0].coord,
                renderCoord: c[0].coord,
                events: c,
                type: 'node-cluster',
                glyph: c.length,
                name: 'CONCURRENT EVENTS'
            });
        } else if (c.length > 1) {
            let sines = 0, cosines = 0;
            c.forEach(n => { sines += Math.sin(n.coord * Math.PI / 180); cosines += Math.cos(n.coord * Math.PI / 180); });
            let avgRad = Math.atan2(sines / c.length, cosines / c.length);
            let avgDeg = (avgRad * 180 / Math.PI + 360) % 360;
            
            let startAngle = avgDeg - ((c.length - 1) * windowSize / 2);
            c.forEach((n, idx) => { 
                n.renderCoord = (startAngle + (idx * windowSize) + 360) % 360; 
                result.push(n);
            });
        } else {
            let n = c[0];
            n.renderCoord = n.coord;
            result.push(n);
        }
    });
    return result;
}

window.TEMP_CLUSTER_EVENTS = [];
function openClusterModal(clusterEvent) {
    window.TEMP_CLUSTER_EVENTS = clusterEvent.events;
    let html = `<div style="font-size:0.65rem; color:var(--platinum); margin-bottom:15px; text-align:center; line-height: 1.4;">Multiple observances detected within a tightly bound orbital arc. Select a specific node to view telemetry.</div>`;
    html += `<div style="display:flex; flex-direction:column; gap:8px; max-height: 50vh; overflow-y: auto;">`;
    
    clusterEvent.events.forEach((ev, i) => {
        let colorStr = ev.type.includes('jud') ? 'var(--gold-bright)' : ev.type.includes('chr') ? 'var(--copper)' : ev.type.includes('isl') ? 'var(--platinum)' : ev.type.includes('sys') ? '#00f0ff' : ev.type.includes('hol') ? '#ff66b2' : '#fff';
        html += `<button style="background:rgba(0,0,0,0.6); border:1px solid ${colorStr}; color:${colorStr}; font-family:'Orbitron'; font-size:0.7rem; padding:12px; border-radius:4px; display:flex; justify-content:space-between; cursor:pointer;" onclick="window.Q_ModalEngine.close(); setTimeout(() => window.openNodeModal(window.TEMP_CLUSTER_EVENTS[${i}]), 300)">
            <span>${ev.glyph || ''} ${ev.name.toUpperCase()}</span>
            <span style="font-family:'JetBrains Mono'; opacity:0.8;">${ev.coord.toFixed(1)}°</span>
        </button>`;
    });
    
    html += `</div>`;
    window.Q_ModalEngine.render(`CONCURRENT OBSERVANCES`, html, 'CLOSE');
}

window.openNodeModal = function(eventObj) {
    if(!window.ANCHOR_ALPHA_DYNAMIC) return;
    currentNodeFocus = eventObj.name;
    currentOptTarget = 'node';

    let pTime;
    if (eventObj.time) { pTime = eventObj.time; }
    else {
        const pDays = (eventObj.coord / 360) * 365.24219;
        pTime = window.ANCHOR_ALPHA_DYNAMIC + (pDays * window.MS_DAY);
    }

    const formatted = window.formatLegacyDate(pTime);
    let nData = { quad: '--', sect: '--', day: '--' };
    if (window.getOrbitalData) {
        nData = window.getOrbitalData((pTime - window.ANCHOR_ALPHA_DYNAMIC) / window.MS_DAY);
    }

    let descType = "Metaphysical integration point.";
    if(eventObj.type.includes('jud')) descType = "Hebrew structural anchor.";
    if(eventObj.type.includes('isl')) descType = "Islamic metadata marker.";
    if(eventObj.type.includes('chr')) descType = "Christian transit event.";
    if(eventObj.type.includes('civ')) descType = "Static Civil observance matrix.";
    if(eventObj.type.includes('hin') || eventObj.type.includes('bud') || eventObj.type.includes('tao')) descType = "Eastern Traditional alignment node.";
    if(eventObj.type.includes('hol')) descType = "Societal Holiday resonance marker.";
    if(eventObj.type.includes('anc')) descType = "Quadrature Physics cardinal anchor.";
    if(eventObj.type.includes('sys')) descType = "Systematic Civil/Financial checkpoint.";

    const savedNote = localStorage.getItem('q_note_' + eventObj.name) || "";

    const html = `
        <div style="font-size:0.65rem; color:var(--platinum); border-bottom:1px solid rgba(255,215,0,0.3); padding-bottom:10px; margin-bottom:10px; line-height:1.4;">
            PRINCIPLE: ${descType}
        </div>
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-bottom: 10px;">
            <div style="display: flex; flex-direction: column;">
                <span style="font-size: 0.5rem; color: rgba(255,255,255,0.5); font-family: 'Orbitron'; letter-spacing: 1px;">Q COORDINATE</span>
                <span style="color: var(--gold-bright); font-size: 0.85rem; font-weight: bold; text-shadow: 0 0 8px var(--gold-dim);">Q${nData.quad} S${nData.sect} DAY ${nData.day}</span>
            </div>
            <div style="display: flex; flex-direction: column;">
                <span style="font-size: 0.5rem; color: rgba(255,255,255,0.5); font-family: 'Orbitron'; letter-spacing: 1px;">MEAN CIRCLE</span>
                <span style="color: var(--gold-bright); font-size: 0.85rem; font-weight: bold; text-shadow: 0 0 8px var(--gold-dim);">${eventObj.coord.toFixed(3)}°</span>
            </div>
            <div style="display: flex; flex-direction: column;">
                <span style="font-size: 0.5rem; color: rgba(255,255,255,0.5); font-family: 'Orbitron'; letter-spacing: 1px;">LEGACY DATE</span>
                <span style="color: #fff; font-size: 0.75rem; font-weight: bold;">${formatted.dateStr}</span>
            </div>
        </div>
        <div style="color:var(--platinum); font-size:0.65rem; margin-bottom:5px; border-top: 1px dashed rgba(255,215,0,0.3); padding-top: 10px;">PLANNER NOTES:</div>
        <textarea id="node-text" class="modal-textarea" placeholder="Add planner notes/references for ${eventObj.name}...">${savedNote}</textarea>
        <div style="font-size:0.5rem; color:var(--platinum); margin-top:2px; text-align:center;">NOTES ARE SYNCED TO THE OMNI-PLANNER</div>
    `;
    if (window.Q_ModalEngine) {
        window.Q_ModalEngine.render(eventObj.name.toUpperCase(), html, 'SAVE & CLOSE', saveOptions);
    }
};

function renderNodes(renderedList, parentLayer, radius) {
    renderedList.forEach((event) => {
        let node = document.createElement('div');
        node.className = `event-node ${event.type}`; 
        node.dataset.coord = event.coord; 
        if(event.glyph) node.innerHTML = event.isCluster ? `<span style="font-size:0.65rem; color:#000; font-family:'JetBrains Mono';">+${event.glyph}</span>` : event.glyph;
        
        let angle = (event.renderCoord - 90) * (Math.PI / 180); 
        let x = 50 + radius * Math.cos(angle); let y = 50 + radius * Math.sin(angle);
        node.style.left = `${x}%`; node.style.top = `${y}%`;
        
        if (event.isCluster) {
            node.onclick = (e) => { e.stopPropagation(); openClusterModal(event); };
        } else {
            node.onclick = (e) => { e.stopPropagation(); window.openNodeModal(event); };
        }
        
        let label = document.createElement('div'); label.className = 'event-label'; label.innerText = event.name.toUpperCase();
        let lx = 50 + (radius + 8) * Math.cos(angle); let ly = 50 + (radius + 8) * Math.sin(angle);
        label.style.left = `calc(${lx}% - 60px)`; label.style.top = `calc(${ly}% - 10px)`;
        parentLayer.appendChild(node); parentLayer.appendChild(label);
    });
}

function renderDynamicRing() {
    if(!window.ANCHOR_ALPHA_DYNAMIC || !window.Q_REGISTRY) return; 
    const nodeLayer = document.getElementById('node-layer');
    if(!nodeLayer) return;
    nodeLayer.innerHTML = ''; 
    
    if (activeZodiac) {
        for(let i = 0; i < 12; i++) {
            let wrap = document.createElement('div'); wrap.className = 'cusp-wrapper'; wrap.style.transform = `rotate(${i * 30 - 90}deg)`;
            let line = document.createElement('div'); line.className = 'cusp-line';
            wrap.appendChild(line); nodeLayer.appendChild(wrap);
        }

        const signs = ['\u2651\uFE0E','\u2652\uFE0E','\u2653\uFE0E','\u2648\uFE0E','\u2649\uFE0E','\u264A\uFE0E','\u264B\uFE0E','\u264C\uFE0E','\u264D\uFE0E','\u264E\uFE0E','\u264F\uFE0E','\u2650\uFE0E'];
        const signNames = ['CAPRICORN','AQUARIUS','PISCES','ARIES','TAURUS','GEMINI','CANCER','LEO','VIRGO','LIBRA','SCORPIO','SAGITTARIUS'];
        
        const savedAnchor = localStorage.getItem('q_natal_anchor') || 'NONE';
        
        signs.forEach((sign, i) => {
            let el = document.createElement('div'); el.className = 'zodiac-glyph'; el.innerText = sign;
            if (savedAnchor === signNames[i]) { el.classList.add('natal-active'); }
            
            let centerArc = i * 30 + 15; let angle = (centerArc - 90) * (Math.PI / 180); 
            let x = 50 + 27.5 * Math.cos(angle); let y = 50 + 27.5 * Math.sin(angle);
            el.style.left = `${x}%`; el.style.top = `${y}%`; el.style.transform = `rotate(${centerArc}deg)`;
            el.onclick = (e) => { e.stopPropagation(); window.openZodiacModal(signNames[i], i); };
            nodeLayer.appendChild(el);
        });
    }

    const savedDob = (window.Q_STATE && window.Q_STATE.metaphysical_layer && window.Q_STATE.metaphysical_layer.dob) ? window.Q_STATE.metaphysical_layer.dob : localStorage.getItem('q_dob');
    
    if(savedDob) {
        const dobParts = savedDob.split('-');
        let y = parseInt(dobParts[0]); let m = parseInt(dobParts[1]) - 1; let d = parseInt(dobParts[2]);
        const dobTimeMs = Date.UTC(y, m, d, 0, 0); let diff = dobTimeMs - window.ANCHOR_ALPHA_DYNAMIC;
        let pArc = (((diff / window.MS_DAY) / 365.24219) * 360) % 360;
        if (pArc < 0) pArc += 360;
        
        let oNode = document.createElement('div'); oNode.className = 'origin-node';
        oNode.title = "NATAL ANCHOR (PERSONAL ARC)"; oNode.style.pointerEvents = "auto"; oNode.style.cursor = "help";
        let oAngle = (pArc - 90) * (Math.PI / 180); let oX = 50 + 27.5 * Math.cos(oAngle); let oY = 50 + 27.5 * Math.sin(oAngle);
        oNode.style.left = `${oX}%`; oNode.style.top = `${oY}%`; oNode.style.transform = `rotate(${pArc}deg)`;
        nodeLayer.appendChild(oNode);
    }

    let outerDb = [];
    activeFaiths.forEach(f => { 
        if (f === 'isl') outerDb = outerDb.concat(ISL_DB);
        else if(window.Q_REGISTRY.REL_DB[f]) outerDb = outerDb.concat(window.Q_REGISTRY.REL_DB[f]); 
    });
    
    if (activeCivil && window.Q_REGISTRY.REL_DB['civ']) {
        outerDb = outerDb.concat(window.Q_REGISTRY.REL_DB['civ']);
    }
    if (activeHolidays && window.Q_REGISTRY.REL_DB['hol']) {
        outerDb = outerDb.concat(window.Q_REGISTRY.REL_DB['hol']);
    }
    if (activeSys) outerDb = outerDb.concat(SYS_DB);
    
    if (outerDb.length > 0) {
        let fannedOuter = applyFanning(outerDb);
        renderNodes(fannedOuter, nodeLayer, 42.5);
    }
    
    if (activeAnchors) {
        let visibleAnchors = window.Q_REGISTRY.ANCHORS.filter(p => p.renderUI !== false);
        let fannedAnchors = applyFanning(visibleAnchors);
        renderNodes(fannedAnchors, nodeLayer, 35);
    }

    if (activeIntrospection && window.Q_REGISTRY.SOLAR_TERMS) {
        window.Q_REGISTRY.SOLAR_TERMS.forEach(term => {
            let el = document.createElement('div'); el.className = 'term-marker';
            let angle = (term.start - 90) * (Math.PI / 180); let x = 50 + 35 * Math.cos(angle); let y = 50 + 35 * Math.sin(angle);
            el.style.left = `${x}%`; el.style.top = `${y}%`; el.style.transform = `rotate(${term.start}deg)`;
            nodeLayer.appendChild(el);
        });
    }
}

function getNextEvent(currentArc, dbArray) {
    let next = dbArray.find(e => e.coord > currentArc);
    if(!next && dbArray.length > 0) next = dbArray[0]; 
    return next;
}

window.openOptions = function(e, target) {
    if(e) e.stopPropagation(); currentOptTarget = target;
    let title = ""; let html = "";
    
    if(target === 'rel') {
        title = "RELIGIOUS OVERLAY MULTI-SELECT";
        html = `
            <div style="display:flex; flex-direction:column; gap:8px;">
                <label class="chk-row" style="font-family:'JetBrains Mono'; font-size:0.75rem; color:var(--platinum);"><input type="checkbox" value="jud" id="chk-jud" ${activeFaiths.includes('jud')?'checked':''} style="accent-color:var(--gold-bright);"> HEBREW (JUD) - ✡</label>
                <label class="chk-row" style="font-family:'JetBrains Mono'; font-size:0.75rem; color:var(--platinum);"><input type="checkbox" value="isl" id="chk-isl" ${activeFaiths.includes('isl')?'checked':''} style="accent-color:var(--gold-bright);"> ISLAMIC (HIJRI) - ☪</label>
                <label class="chk-row" style="font-family:'JetBrains Mono'; font-size:0.75rem; color:var(--platinum);"><input type="checkbox" value="chr" id="chk-chr" ${activeFaiths.includes('chr')?'checked':''} style="accent-color:var(--gold-bright);"> CHRISTIAN (LITURGICAL) - ✝</label>
                <label class="chk-row" style="font-family:'JetBrains Mono'; font-size:0.75rem; color:var(--platinum);"><input type="checkbox" value="hin" id="chk-hin" ${activeFaiths.includes('hin')?'checked':''} style="accent-color:var(--gold-bright);"> HINDU (LUNISOLAR) - ॐ</label>
                <label class="chk-row" style="font-family:'JetBrains Mono'; font-size:0.75rem; color:var(--platinum);"><input type="checkbox" value="bud" id="chk-bud" ${activeFaiths.includes('bud')?'checked':''} style="accent-color:var(--gold-bright);"> BUDDHISM - ☸</label>
                <label class="chk-row" style="font-family:'JetBrains Mono'; font-size:0.75rem; color:var(--platinum);"><input type="checkbox" value="tao" id="chk-tao" ${activeFaiths.includes('tao')?'checked':''} style="accent-color:var(--gold-bright);"> TAOISM/ZEN - ☯</label>
            </div>`;
    } else if(target === 'zod') {
        title = "ZODIACAL CONFIGURATION";
        
        const savedAnchor = localStorage.getItem('q_natal_anchor') || 'NONE';
        
        let ephStatus = 'STANDBY';
        if (window.Q_Plugin_Zodiacal && window.Q_Plugin_Zodiacal.engineState === 'ACTIVE') {
            ephStatus = 'ACTIVE (PLUGIN)';
        }

        html = `
            <label class="chk-row" style="margin-bottom:10px; border-bottom:1px solid rgba(255,215,0,0.2); padding-bottom:10px; font-family:'JetBrains Mono'; font-size:0.75rem; color:var(--platinum);"><input type="checkbox" id="chk-show-zod" ${activeZodiac ? 'checked' : ''} style="accent-color:var(--gold-bright);"> DISPLAY ZODIACAL RING</label>
            <label style="font-size:0.6rem; color:rgba(255,255,255,0.6); font-family:'Orbitron';">CALCULATION BASE:</label>
            <select class="modal-input"><option>TROPICAL (SEASONAL)</option><option>SIDEREAL (ASTRONOMICAL)</option></select>
            <label style="font-size:0.6rem; color:rgba(255,255,255,0.6); margin-top:5px; font-family:'Orbitron';">NATAL ANCHOR (BIRTH SIGN):</label>
            <select id="natal-select" class="modal-input">
                <option value="NONE" ${savedAnchor==='NONE'?'selected':''}>-- SELECT --</option>
                <option value="ARIES" ${savedAnchor==='ARIES'?'selected':''}>ARIES</option><option value="TAURUS" ${savedAnchor==='TAURUS'?'selected':''}>TAURUS</option><option value="GEMINI" ${savedAnchor==='GEMINI'?'selected':''}>GEMINI</option>
                <option value="CANCER" ${savedAnchor==='CANCER'?'selected':''}>CANCER</option><option value="LEO" ${savedAnchor==='LEO'?'selected':''}>LEO</option><option value="VIRGO" ${savedAnchor==='VIRGO'?'selected':''}>VIRGO</option>
                <option value="LIBRA" ${savedAnchor==='LIBRA'?'selected':''}>LIBRA</option><option value="SCORPIO" ${savedAnchor==='SCORPIO'?'selected':''}>SCORPIO</option><option value="SAGITTARIUS" ${savedAnchor==='SAGITTARIUS'?'selected':''}>SAGITTARIUS</option>
                <option value="CAPRICORN" ${savedAnchor==='CAPRICORN'?'selected':''}>CAPRICORN</option><option value="AQUARIUS" ${savedAnchor==='AQUARIUS'?'selected':''}>AQUARIUS</option><option value="PISCES" ${savedAnchor==='PISCES'?'selected':''}>PISCES</option>
            </select>
            <div style="font-size:0.5rem; color:var(--platinum); margin-top:5px; text-align:center;">UPDATE VIA PHYSIOLOGICAL VECTOR CALIBRATION FOR FULL SYNC</div>
            <div style="font-size:0.5rem; color:var(--gold-bright); margin-top:10px; text-align:center; padding-top:5px; border-top:1px dashed var(--gold-dim);" id="eph-api-status">EPHEMERIS API: ${ephStatus} (PHASE V)</div>`;
    } else if(target === 'civ') {
        title = "CIVIL ANCHOR LOCALE"; 
        html = `<label style="font-size:0.6rem; color:rgba(255,255,255,0.6); font-family:'Orbitron';">ORIGIN MATRIX:</label>
        <select class="modal-input"><option>US (STATIC)</option><option>GLOBAL (UN)</option><option>GEOLOCATION (AUTO)</option></select>
        <div style="margin-top:15px; border-top:1px dashed var(--copper); padding-top:10px;">
            <label style="font-size:0.6rem; color:rgba(255,255,255,0.6); display:block; margin-bottom:8px; text-align:center;">NODE VISIBILITY TOGGLES</label>
            <div style="display:flex; justify-content:space-around;">
                <button class="opt-btn ${activeHolidays ? 'active' : ''}" onclick="toggleVisibility('hol', this)" id="btn-hol">HOLIDAYS</button>
                <button class="opt-btn ${activeAnchors ? 'active' : ''}" onclick="toggleVisibility('anc', this)" id="btn-anc">ANCHORS</button>
                <button class="opt-btn ${activeSys ? 'active' : ''}" onclick="toggleVisibility('sys', this)" id="btn-sys">SYS MARKS</button>
            </div>
        </div>`;
    } else if(target === 'int') {
        title = `PRO USER DIARY`;
        const savedData = localStorage.getItem('q_journal_' + activeTermName) || ""; 
        const activeTheme = window.Q_REGISTRY.SOLAR_TERMS.find(t => t.name === activeTermName)?.theme || "";
        html = `<div style="color:var(--gold-bright); font-size:0.7rem; font-family:'Orbitron';">TERM: ${activeTermName.toUpperCase()}</div>
        <div style="color:rgba(255,255,255,0.6); font-size:0.6rem; font-family:'JetBrains Mono'; margin-bottom:10px;">THEME: ${activeTheme}</div>
        <textarea id="journal-text" class="modal-textarea" placeholder="Record introspection diary entry...">${savedData}</textarea>
        <div style="font-size:0.5rem; color:var(--platinum); margin-top:5px; text-align:center;">ENTRIES SYNC TO OMNI-PLANNER AS [DIARY]</div>`;
    }
    if (window.Q_ModalEngine) {
        window.Q_ModalEngine.render(title, html, 'SAVE & CLOSE', saveOptions);
    }
};

window.openZodiacModal = function(clickedSign, clickedIndex) {
    const savedAnchor = localStorage.getItem('q_natal_anchor') || 'NONE';
    let relationshipHtml = "";
    
    if (savedAnchor !== 'NONE') {
        const signNames = ['CAPRICORN','AQUARIUS','PISCES','ARIES','TAURUS','GEMINI','CANCER','LEO','VIRGO','LIBRA','SCORPIO','SAGITTARIUS'];
        let natalIndex = signNames.indexOf(savedAnchor);
        
        let currentGlobalIndex = Math.floor(window.CURRENT_TRUE_ARC / 30);
        let diff = Math.abs(currentGlobalIndex - natalIndex);
        if (diff > 6) diff = 12 - diff; 
        
        let aspect = ""; let aspectDesc = "";
        if (diff === 0) { aspect = "CONJUNCTION (0°)"; aspectDesc = "Intense amplification of base energy. Rebirth cycle."; }
        else if (diff === 1) { aspect = "SEMI-SEXTILE (30°)"; aspectDesc = "Subtle shift. Gathering resources and integration."; }
        else if (diff === 2) { aspect = "SEXTILE (60°)"; aspectDesc = "Harmonic flow. Favorable conditions for growth."; }
        else if (diff === 3) { aspect = "SQUARE (90°)"; aspectDesc = "Friction and tension. Requires structural adjustment."; }
        else if (diff === 4) { aspect = "TRINE (120°)"; aspectDesc = "High resonance. Natural alignment and ease."; }
        else if (diff === 5) { aspect = "QUINCUNX (150°)"; aspectDesc = "Asymmetrical adjustment. Requires conscious adaptation."; }
        else if (diff === 6) { aspect = "OPPOSITION (180°)"; aspectDesc = "Maximum polarity. Culmination, reflection, and balance."; }
        
        relationshipHtml = `
            <div style="font-size:0.6rem; color:var(--platinum); margin-top:5px;">NATAL ANCHOR: <span style="color:var(--gold-bright);">${savedAnchor}</span></div>
            <div style="font-size:0.6rem; color:var(--platinum); margin-top:5px;">GEOMETRIC ASPECT: <span style="color:var(--gold-bright); text-shadow: 0 0 10px var(--gold-dim);">${aspect}</span></div>
            <div style="font-size:0.7rem; color:var(--starlight); margin-top:15px; line-height:1.5; border-top:1px dashed rgba(255,215,0,0.3); padding-top:15px; text-align:center;">
                ${aspectDesc}
            </div>
        `;
    } else {
        relationshipHtml = `<div style="font-size:0.6rem; color:var(--warn-orange); margin-top:10px; text-align:center; padding:10px;">NO NATAL ANCHOR DETECTED.<br>CALIBRATE VIA PHYSIOLOGICAL VECTOR.</div>`;
    }
    
    const html = `
        <div style="font-size:0.65rem; color:var(--platinum); border-bottom:1px solid rgba(255,215,0,0.3); padding-bottom:10px; margin-bottom:10px; text-align:center;">
            Astrological Transit Node
        </div>
        ${relationshipHtml}
    `;
    if (window.Q_ModalEngine) {
        window.Q_ModalEngine.render(`TRANSIT: ${clickedSign}`, html, 'ACKNOWLEDGE');
    }
};

function syncToPlanner(absoluteTimeMs, prefix, content) {
    if(!window.ANCHOR_ALPHA_DYNAMIC || !absoluteTimeMs) return; 
    const pDate = new Date(absoluteTimeMs);
    const y = pDate.getFullYear();
    const mo = (pDate.getMonth()+1).toString().padStart(2,'0');
    const d = pDate.getDate().toString().padStart(2,'0');
    
    const key = `${y}-${mo}-${d}-12-00`; 

    if (window.loadPlannerData) window.loadPlannerData();
    if(!window.qData) window.qData = {};
    if(!window.qData[key]) window.qData[key] = { text: "", link: "" };

    if(content.trim() !== "") {
        window.qData[key].text = `[${prefix}] ${content}`;
    } else {
        if (window.qData[key].text.startsWith(`[${prefix}]`)) {
            window.qData[key].text = "";
        }
    }
    if (window.savePlannerData) window.savePlannerData();
    window.dispatchEvent(new Event('storage'));
}

function saveOptions() {
    if(currentOptTarget === 'rel') {
        activeFaiths = [];
        ['jud','isl','chr','hin','bud','tao'].forEach(f => { 
            const chk = document.getElementById('chk-'+f);
            if(chk && chk.checked) activeFaiths.push(f); 
        });
        const relActive = document.getElementById('rel-active');
        if (relActive) relActive.innerText = activeFaiths.length > 1 ? "MULTI-FAITH" : (activeFaiths[0] ? activeFaiths[0].toUpperCase() : "NONE");
        renderDynamicRing();
    } else if (currentOptTarget === 'zod') {
        const chkShowZod = document.getElementById('chk-show-zod');
        if (chkShowZod) {
            activeZodiac = chkShowZod.checked;
            localStorage.setItem('q_zodiac_visible', activeZodiac);
        }
        
        const natalSelect = document.getElementById('natal-select');
        if (natalSelect) {
            const natal = natalSelect.value;
            localStorage.setItem('q_natal_anchor', natal);
            if (window.Q_UpdateState) window.Q_UpdateState('metaphysical_layer', 'natal_anchor', natal);
        }
        
        renderDynamicRing();
    } else if(currentOptTarget === 'int') {
        const jTextEl = document.getElementById('journal-text');
        if (jTextEl) {
            const jText = jTextEl.value;
            localStorage.setItem('q_journal_' + activeTermName, jText);
            
            if (window.getSimState) {
                const state = window.getSimState();
                const activeTimeMs = state.isLive ? Date.now() : state.simTime;
                syncToPlanner(activeTimeMs, "DIARY", jText);
            }
        }
    } else if(currentOptTarget === 'node') {
        const nTextEl = document.getElementById('node-text');
        if (nTextEl) {
            const nText = nTextEl.value;
            localStorage.setItem('q_note_' + currentNodeFocus, nText);
            let combinedDb = [];
            ['jud','chr','hin','bud','tao'].forEach(f => { if(window.Q_REGISTRY.REL_DB[f]) combinedDb = combinedDb.concat(window.Q_REGISTRY.REL_DB[f]); });
            
            let globalCiv = [];
            if (window.Q_REGISTRY.REL_DB['civ']) {
                globalCiv = globalCiv.concat(window.Q_REGISTRY.REL_DB['civ']);
            }
            if (window.Q_REGISTRY.REL_DB['hol']) {
                globalCiv = globalCiv.concat(window.Q_REGISTRY.REL_DB['hol']);
            }
            
            combinedDb = combinedDb.concat(ISL_DB, globalCiv, SYS_DB);
            const ev = combinedDb.find(e => e.name === currentNodeFocus);
            if(ev) {
                let absoluteTimeMs = ev.time;
                if (!absoluteTimeMs) {
                    const currentDays = (Date.now() - window.ANCHOR_ALPHA_DYNAMIC) / window.MS_DAY;
                    const cycleBaseDays = Math.floor(currentDays / 365.24219) * 365.24219;
                    const evDays = cycleBaseDays + (ev.coord / (360 / 365.24219));
                    absoluteTimeMs = window.ANCHOR_ALPHA_DYNAMIC + (evDays * window.MS_DAY);
                }
                syncToPlanner(absoluteTimeMs, ev.name.toUpperCase(), nText);
            }
        }
    }
    if (window.Q_ModalEngine) window.Q_ModalEngine.close();
}

window.addEventListener('q-tick', (e) => {
    const { t, isLive, activeTime, daysElapsed, qData } = e.detail;
    
    if (activeTime.getUTCFullYear() !== currentRenderedYear || document.getElementById('node-layer').children.length === 0) {
        currentRenderedYear = activeTime.getUTCFullYear();
        recalculateDynamicHolidays(currentRenderedYear);
        renderDynamicRing();
    }
    
    window.CURRENT_TRUE_ARC = qData.trueArc;
    
    const trueArc = qData.trueArc;
    const continuousMeanDeg = daysElapsed * (360 / 365.24219);
    const transitArm = document.getElementById('transit-arm');
    if (transitArm) {
        transitArm.style.transform = `rotate(${continuousMeanDeg + qData.delta}deg)`;
    }
    
    document.querySelectorAll('.event-node').forEach(node => {
        let nodeDeg = parseFloat(node.dataset.coord); 
        let dist = Math.abs(nodeDeg - trueArc); 
        if (dist > 180) dist = 360 - dist; 
        if (dist < 5.0) { node.classList.add('flare'); } else { node.classList.remove('flare'); }
    });

    let combinedRel = []; 
    activeFaiths.forEach(f => { 
        if(f === 'isl') combinedRel = combinedRel.concat(ISL_DB);
        else if(window.Q_REGISTRY.REL_DB[f]) combinedRel = combinedRel.concat(window.Q_REGISTRY.REL_DB[f]); 
    }); 
    combinedRel.sort((a,b)=>a.coord-b.coord);
    
    let nextRel = getNextEvent(trueArc, combinedRel);
    const relNextEl = document.getElementById('rel-next');
    if (relNextEl) {
        relNextEl.innerText = nextRel ? `${nextRel.name.substring(0,8).toUpperCase()}.. (${nextRel.coord.toFixed(1)}°)` : "--";
    }

    const zodiacNames = ["CAPRICORN", "AQUARIUS", "PISCES", "ARIES", "TAURUS", "GEMINI", "CANCER", "LEO", "VIRGO", "LIBRA", "SCORPIO", "SAGITTARIUS"];
    const savedAnchor = localStorage.getItem('q_natal_anchor') || 'NONE';
    
    const zodHouseEl = document.getElementById('zod-house');
    if (zodHouseEl) zodHouseEl.innerText = savedAnchor !== 'NONE' ? savedAnchor : "UNASSIGNED";
    
    const zodPhaseEl = document.getElementById('zod-phase');
    if (savedAnchor !== 'NONE') {
        let natalIndex = zodiacNames.indexOf(savedAnchor);
        let currentIndex = Math.floor(trueArc / 30);
        let diff = Math.abs(currentIndex - natalIndex);
        if (diff > 6) diff = 12 - diff; 
        
        let aspect = "";
        if (diff === 0) aspect = "CONJUNCTION (0°)";
        else if (diff === 1) aspect = "SEMI-SEXTILE (30°)";
        else if (diff === 2) aspect = "SEXTILE (60°)";
        else if (diff === 3) aspect = "SQUARE (90°)";
        else if (diff === 4) aspect = "TRINE (120°)";
        else if (diff === 5) aspect = "QUINCUNX (150°)";
        else if (diff === 6) aspect = "OPPOSITION (180°)";
        if (zodPhaseEl) zodPhaseEl.innerText = aspect;
    } else {
        if (zodPhaseEl) zodPhaseEl.innerText = "PENDING CALIBRATION";
    }

    let globalCiv = [];
    if (window.Q_REGISTRY.REL_DB['civ']) {
        globalCiv = globalCiv.concat(window.Q_REGISTRY.REL_DB['civ']);
    }

    let nextCiv = getNextEvent(trueArc, globalCiv.concat(SYS_DB));
    const civNextEl = document.getElementById('civ-next');
    if (civNextEl) {
        civNextEl.innerText = nextCiv ? `${nextCiv.name.substring(0,10).toUpperCase()}.. (${nextCiv.coord.toFixed(1)}°)` : "--";
    }

    if (window.Q_REGISTRY.SOLAR_TERMS) {
        const termIndex = Math.floor(trueArc / 15); 
        const activeTerm = window.Q_REGISTRY.SOLAR_TERMS[termIndex]; 
        if (activeTerm) {
            activeTermName = activeTerm.name; 
            const termProgress = ((trueArc - activeTerm.start) / 15) * 100;
            const intTermEl = document.getElementById('int-term');
            const intPctEl = document.getElementById('int-pct');
            if (intTermEl) intTermEl.innerText = activeTermName.substring(0,10).toUpperCase(); 
            if (intPctEl) intPctEl.innerText = `${termProgress.toFixed(1)}% REALIZED`;
        }
    }
});