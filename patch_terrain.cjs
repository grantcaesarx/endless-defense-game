const fs = require('fs');
let code = fs.readFileSync('index.html', 'utf8');

const newTerrain = `
        function renderTerrain() {
            bgCtx.fillStyle = '#466a2b';
            bgCtx.fillRect(0,0,CANVAS_W,CANVAS_H);
            
            // Noise patches for grass
            for(let i=0; i<400; i++) {
                bgCtx.fillStyle = Math.random()>0.5 ? '#3d5e24' : '#4f7830';
                bgCtx.beginPath();
                bgCtx.arc(rand(0,CANVAS_W), rand(0,CANVAS_H), rand(3,12), 0, Math.PI*2);
                bgCtx.fill();
            }

            bgCtx.lineCap = 'round';
            bgCtx.lineJoin = 'round';
            
            // Helper to draw connected paths
            function drawAllPaths(ctx, offset = 0) {
                ctx.beginPath();
                for(let r=0; r<ROWS; r++) {
                    for(let c=0; c<COLS; c++) {
                        let v = map.grid[r][c];
                        if(v === CELL.PATH || v === CELL.START || v === CELL.END) {
                            let cx = c*TILE_SIZE+32, cy = r*TILE_SIZE+32;
                            // Right
                            if(c<COLS-1 && [CELL.PATH, CELL.START, CELL.END].includes(map.grid[r][c+1])) {
                                ctx.moveTo(cx, cy + offset); ctx.lineTo(cx + TILE_SIZE, cy + offset);
                            }
                            // Down
                            if(r<ROWS-1 && [CELL.PATH, CELL.START, CELL.END].includes(map.grid[r+1][c])) {
                                ctx.moveTo(cx + offset, cy); ctx.lineTo(cx + offset, cy + TILE_SIZE);
                            }
                        }
                    }
                }
                ctx.stroke();
            }

            // Base dirt
            bgCtx.lineWidth = 44;
            bgCtx.strokeStyle = '#a68a56'; // Darker edge
            drawAllPaths(bgCtx);

            bgCtx.lineWidth = 36;
            bgCtx.strokeStyle = '#c7a972'; // Lighter center
            drawAllPaths(bgCtx);

            // Ruts
            bgCtx.lineWidth = 4;
            bgCtx.strokeStyle = 'rgba(0,0,0,0.15)';
            drawAllPaths(bgCtx, -8);
            drawAllPaths(bgCtx, 8);

            // Edges (mud and stones)
            for(let r=0; r<ROWS; r++) {
                for(let c=0; c<COLS; c++) {
                    let v = map.grid[r][c];
                    if(v===CELL.PATH || v===CELL.START || v===CELL.END) {
                        let cx = c*TILE_SIZE+32, cy = r*TILE_SIZE+32;
                        for(let i=0; i<8; i++) {
                            let ang = rand(0, Math.PI*2);
                            let dist = rand(18, 26);
                            bgCtx.fillStyle = rand(0,1)>0.5 ? '#4a3f2d' : '#3d5e24';
                            bgCtx.beginPath(); bgCtx.arc(cx + Math.cos(ang)*dist, cy + Math.sin(ang)*dist, rand(2,4), 0, Math.PI*2); bgCtx.fill();
                        }
                    }
                }
            }
            
            // Slots & Start/End via SVGs
            for(let r=0; r<ROWS; r++) {
                for(let c=0; c<COLS; c++) {
                    let cx = c*TILE_SIZE+32, cy = r*TILE_SIZE+32;
                    if(map.grid[r][c] === CELL.SLOT) {
                        if(SVGS.slot && SVGS.slot.complete) bgCtx.drawImage(SVGS.slot, cx - SVGS.slot.width/2, cy - SVGS.slot.height/2);
                    } else if(map.grid[r][c] === CELL.START) {
                        if(SVGS.start && SVGS.start.complete) bgCtx.drawImage(SVGS.start, cx - SVGS.start.width/2, cy - SVGS.start.height/2);
                    } else if(map.grid[r][c] === CELL.END) {
                        if(SVGS.end && SVGS.end.complete) bgCtx.drawImage(SVGS.end, cx - SVGS.end.width/2, cy - SVGS.end.height/2);
                    }
                }
            }
        }
`;

code = code.replace(/function renderTerrain\(\) \{[\s\S]*?\}\n        \}\n/m, newTerrain.trim() + "\n");
fs.writeFileSync('index.html', code);
console.log("Patched renderTerrain");
