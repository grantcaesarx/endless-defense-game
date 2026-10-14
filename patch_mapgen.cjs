const fs = require('fs');
let code = fs.readFileSync('index.html', 'utf8');

const target = `        function generateRoguelikeMap() {
            let m = { grid: [] };`;
            
const replace = `        function generateRoguelikeMap() {
            while (true) {
                let m = { grid: [] };
                for(let r=0; r<ROWS; r++) m.grid[r] = new Array(COLS).fill(0);
                let curR = 1, curC = 0;
                m.grid[curR][curC] = 2; // START
                let corners = 0, dir = 'R';
                let failed = false;
                while(curC < COLS-2 || corners < 5) {
                    if (curC >= COLS-2 && corners < 5) {
                        failed = true; break;
                    }
                    let len = Math.floor(Math.random() * 3) + 2;
                    if(dir === 'R') {
                        for(let i=0; i<len && curC < COLS-2; i++) { curC++; m.grid[curR][curC] = 1; }
                        dir = Math.random() > 0.5 ? 'D' : 'U'; corners++;
                    } else if(dir === 'D') {
                        for(let i=0; i<len && curR < ROWS-2; i++) { curR++; m.grid[curR][curC] = 1; }
                        dir = 'R'; corners++;
                    } else if(dir === 'U') {
                        for(let i=0; i<len && curR > 1; i++) { curR--; m.grid[curR][curC] = 1; }
                        dir = 'R'; corners++;
                    }
                }
                if (failed) continue;
                curC++; m.grid[curR][curC] = 3; // END
                let slots = 0;
                for(let i=0; i<1000 && slots < 25; i++) {
                    let r = Math.floor(Math.random()*(ROWS-2))+1;
                    let c = Math.floor(Math.random()*(COLS-2))+1;
                    if(m.grid[r][c] === 0) {
                        let hasPath = false;
                        for(let dr=-1; dr<=1; dr++) for(let dc=-1; dc<=1; dc++) {
                            if(m.grid[r+dr] && m.grid[r+dr][c+dc] === 1) hasPath = true;
                        }
                        if(hasPath) { m.grid[r][c] = 4; slots++; }
                    }
                }
                if(slots >= 20 && corners >= 5) return m;
            }
        }`;

code = code.replace(/function generateRoguelikeMap\(\) \{[\s\S]*?return m;\s*\}/, replace);

fs.writeFileSync('index.html', code);
console.log("Patched map gen while loop");
