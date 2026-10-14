const fs = require('fs');
let code = fs.readFileSync('index.html', 'utf8');

const oldTap = `        function handleTap(x, y) {
            if(state === 'EDITOR') { handleEdit(x, y); return; }
            if(state === 'GAMEOVER') { backToMenu(); return; }
            if(state !== 'PLAYING') return;`;

const newTap = `        function handleTap(x, y) {
            if(state === 'EDITOR') { handleEdit(x, y); return; }
            if(state === 'GAMEOVER') { backToMenu(); return; }
            if(state !== 'PLAYING') return;
            
            let cc = Math.floor(x/TILE_SIZE), rr = Math.floor(y/TILE_SIZE);
            if (itemPlacementMode && cc>=0 && cc<COLS && rr>=0 && rr<ROWS) {
                triggerTargetItem(cc, rr);
                return;
            }`;
code = code.replace(oldTap, newTap);

fs.writeFileSync('index.html', code);
console.log("Patched tap properly");
