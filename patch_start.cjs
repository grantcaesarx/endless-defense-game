const fs = require('fs');
let code = fs.readFileSync('index.html', 'utf8');

const oldStart = `        function startGame(opts) {
            let m = Store.load('map');`;

const newStart = `        function startGame(opts) {
            let m = Store.load('map');
            if(opts.mode === 'ROGUELIKE') {
                gameMode = 'ROGUELIKE';
                map = generateRoguelikeMap();
                let elIdx = Math.floor(Math.random() * ELEMENTS_DB.length);
                currentElement = ELEMENTS_DB[elIdx];
                activeBoons = {};
                rlInventory = { heal: 0, thunder: 0, guards: 0, archers: 0, titan: 0, dragon: 0, warp: 0, nuke: 0 };
                document.getElementById('element-display').classList.remove('hidden');
                document.getElementById('element-display').innerText = \`[\${currentElement.n}]\`;
                document.getElementById('element-display').style.color = currentElement.col;
                document.getElementById('element-display').style.borderColor = currentElement.col;
            } else {
                gameMode = opts.defaultMap ? 'DEFAULT' : 'CUSTOM';
                document.getElementById('element-display').classList.add('hidden');
            }`;
code = code.replace(oldStart, newStart);

const oldInit = `            map = (!opts.defaultMap && m) ? m : JSON.parse(JSON.stringify(defaultMap));`;
const newInit = `            if(gameMode !== 'ROGUELIKE') {
                map = (!opts.defaultMap && m) ? m : JSON.parse(JSON.stringify(defaultMap));
            }`;
code = code.replace(oldInit, newInit);

const oldFallback = `            if(!st || !en) {
                map = JSON.parse(JSON.stringify(defaultMap));
                for(let r=0; r<ROWS; r++) for(let c=0; c<COLS; c++) {
                    if(map.grid[r][c]===CELL.START) st={x:c,y:r};
                    if(map.grid[r][c]===CELL.END) en={x:c,y:r};
                }
            }`;
const newFallback = `            if(!st || !en) {
                if(gameMode === 'ROGUELIKE') map = generateRoguelikeMap();
                else map = JSON.parse(JSON.stringify(defaultMap));
                for(let r=0; r<ROWS; r++) for(let c=0; c<COLS; c++) {
                    if(map.grid[r][c]===CELL.START) st={x:c,y:r};
                    if(map.grid[r][c]===CELL.END) en={x:c,y:r};
                }
            }`;
code = code.replace(oldFallback, newFallback);

const oldResume = `            if(opts.resume) {`;
const newResume = `            if(gameMode === 'ROGUELIKE') {
                wave = 1;
                resumedWave = null;
                gold = 500;
                availableSlots = 0;
            } else if(opts.resume) {`;
code = code.replace(oldResume, newResume);

const oldDashboard = `            renderTerrain(); state = 'PLAYING'; updateHUD();`;
const newDashboard = `            renderTerrain(); state = 'PLAYING'; updateHUD(); if(gameMode === 'ROGUELIKE') { renderDashboard(); document.getElementById('dashboard').style.display = 'flex'; document.getElementById('btn-add-slot').style.display='none'; } else { document.getElementById('dashboard').style.display = 'none'; document.getElementById('btn-add-slot').style.display=''; }`;
code = code.replace(oldDashboard, newDashboard);

fs.writeFileSync('index.html', code);
console.log("Patched start");
