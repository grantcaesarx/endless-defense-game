const fs = require('fs');
let code = fs.readFileSync('index.html', 'utf8');

let sgMatch = code.match(/function startGame\(opts\) \{[\s\S]*?updateWaypoints\(\);/);
if(sgMatch) {
    code = code.replace(
        sgMatch[0],
        sgMatch[0] + `
            scenery = [];
            for(let r=0; r<ROWS; r++) {
                for(let c=0; c<COLS; c++) {
                    if(map.grid[r][c] === CELL.EMPTY) {
                        if(Math.random() < 0.25) {
                            scenery.push({
                                x: c*TILE_SIZE + rand(10, 54),
                                y: r*TILE_SIZE + rand(10, 54),
                                type: Math.floor(rand(1, 4)),
                                seed: rand(0, 100)
                            });
                        }
                    }
                }
            }
`
    );
    fs.writeFileSync('index.html', code);
    console.log("Patched startGame");
} else {
    console.log("Could not find startGame match");
}
