const fs = require('fs');
let code = fs.readFileSync('index.html', 'utf8');

const oldTap = `        function handleTap(x, y) {
            if(state === 'EDITOR') { handleEdit(x, y); return; }
            if(state !== 'PLAYING') return;`;

const newTap = `        function handleTap(x, y) {
            if(state === 'EDITOR') { handleEdit(x, y); return; }
            if(state !== 'PLAYING') return;
            
            let c = Math.floor(x/TILE_SIZE), r = Math.floor(y/TILE_SIZE);
            if(c<0 || c>=COLS || r<0 || r>=ROWS) return;
            
            if(itemPlacementMode) {
                triggerTargetItem(c, r);
                return;
            }`;
code = code.replace(oldTap, newTap);

fs.writeFileSync('index.html', code);
console.log("Patched tap");
