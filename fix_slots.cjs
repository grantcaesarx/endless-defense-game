const fs = require('fs');
let code = fs.readFileSync('index.html', 'utf8');

const newResumeLogic = `                    if (opts.defaultMap) {
                        map = JSON.parse(JSON.stringify(defaultMap));
                    } else {`;

code = code.replace(/if \(opts\.defaultMap\) \{[\s\S]*?\} else \{/, newResumeLogic);

const applyPSlots = `            }
            
            if (gameMode === 'DEFAULT') {
                let pSlots = Store.load('pSlots') || [];
                pSlots.forEach(s => {
                    if (map.grid[s.r] && map.grid[s.r][s.c] === 0) { // CELL.EMPTY
                        map.grid[s.r][s.c] = 2; // CELL.SLOT
                    }
                });
            }
            
            // Mark the map with its type so we don't mix them up on resume`;

code = code.replace(/            \}[\s]*\/\/ Mark the map with its type so we don't mix them up on resume/, applyPSlots);

// Fix the tap handler to save to pSlots
const savePSlots = `                        Store.save('resumeMap', map);
                        if(gameMode === 'DEFAULT') {
                            let pSlots = Store.load('pSlots') || [];
                            pSlots.push({r, c});
                            Store.save('pSlots', pSlots);
                        }
                        renderTerrain();`;

code = code.replace(/                        Store\.save\('resumeMap', map\);\s*renderTerrain\(\);/, savePSlots);

fs.writeFileSync('index.html', code);
console.log("Persistent slots fixed");
