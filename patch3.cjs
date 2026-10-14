const fs = require('fs');
let code = fs.readFileSync('index.html', 'utf8');

let drawMatch = code.match(/if\(state === 'PLAYING' \|\| state === 'GAMEOVER'\) \{/);
if(drawMatch) {
    code = code.replace(
        drawMatch[0],
        drawMatch[0] + `
                scenery.forEach(s => {
                    if(s.type === 1) {
                        let bob = Math.sin(frames*0.05 + s.seed)*1.5;
                        ctx.fillStyle = '#2c4a16'; ctx.beginPath(); ctx.arc(s.x, s.y, 14, 0, Math.PI*2); ctx.fill();
                        ctx.fillStyle = '#3a5e1e'; ctx.beginPath(); ctx.arc(s.x-6, s.y-6 - bob, 10, 0, Math.PI*2); ctx.fill();
                        ctx.beginPath(); ctx.arc(s.x+6, s.y-4 - bob, 9, 0, Math.PI*2); ctx.fill();
                    } else if(s.type === 2) {
                        ctx.fillStyle = '#4a4e54'; ctx.beginPath(); ctx.arc(s.x, s.y, 8, 0, Math.PI*2); ctx.fill();
                        ctx.fillStyle = '#a8b39b'; ctx.beginPath(); ctx.arc(s.x-2, s.y-2, 4, 0, Math.PI*2); ctx.fill();
                    } else {
                        ctx.fillStyle = '#fff';
                        for(let i=0; i<4; i++) { ctx.beginPath(); ctx.arc(s.x + Math.cos(i*Math.PI/2)*4, s.y + Math.sin(i*Math.PI/2)*4, 2.5, 0, Math.PI*2); ctx.fill(); }
                        ctx.fillStyle = '#facc15'; ctx.beginPath(); ctx.arc(s.x, s.y, 2, 0, Math.PI*2); ctx.fill();
                    }
                });
                
                // Draw slot runes
                for(let r=0; r<ROWS; r++) {
                    for(let c=0; c<COLS; c++) {
                        if(map.grid[r][c] === CELL.SLOT && !towers.find(t=>t.c===c && t.r===r)) {
                            let cx = c*TILE_SIZE+32, cy = r*TILE_SIZE+32;
                            ctx.strokeStyle = \`rgba(218, 165, 32, \${0.3 + Math.sin(frames*0.05)*0.2})\`;
                            ctx.lineWidth = 2;
                            ctx.beginPath(); ctx.arc(cx, cy, 10, 0, Math.PI*2); ctx.stroke();
                            ctx.beginPath(); ctx.moveTo(cx-4, cy-4); ctx.lineTo(cx+4, cy+4); ctx.moveTo(cx+4, cy-4); ctx.lineTo(cx-4, cy+4); ctx.stroke();
                        }
                    }
                }
`
    );
    fs.writeFileSync('index.html', code);
    console.log("Patched drawGame");
} else {
    console.log("Could not find drawGame match");
}
