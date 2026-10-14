const fs = require('fs');
let code = fs.readFileSync('index.html', 'utf8');

const oldLogic = `                // NOTE: We used to compare savedMap.isDefault === opts.defaultMap, but previously the field didn't exist.
                // We will treat it loosely: if opts.defaultMap is true and savedMap.isDefault isn't false, we accept it.
                if(savedMap && (opts.defaultMap ? savedMap.isDefault !== false : savedMap.isDefault === false)) {
                    map = savedMap;
                } else {
                    // Fallback if there is a mismatch or corrupt data
                    map = (!opts.defaultMap && m) ? m : JSON.parse(JSON.stringify(defaultMap));
                }`;

const newLogic = `                if (savedMap) {
                    if (opts.defaultMap) {
                        // Endless Mode: we want the default map, but we want to keep the player's placed slots.
                        // We rebuild it from defaultMap to guarantee the visual path is restored.
                        map = JSON.parse(JSON.stringify(defaultMap));
                        // Restore only the slots from the saved map
                        for (let r = 0; r < ROWS; r++) {
                            for (let c = 0; c < COLS; c++) {
                                if (savedMap.grid && savedMap.grid[r] && savedMap.grid[r][c] === 4) { // CELL.SLOT = 4
                                    // Only place slot if it was empty in the default map
                                    if (map.grid[r][c] === 0) { // CELL.EMPTY = 0
                                        map.grid[r][c] = 4;
                                    }
                                }
                            }
                        }
                    } else {
                        // Custom map mode: just load the saved custom map
                        map = savedMap;
                    }
                } else {
                    map = (!opts.defaultMap && m) ? m : JSON.parse(JSON.stringify(defaultMap));
                }`;

code = code.replace(oldLogic, newLogic);
fs.writeFileSync('index.html', code);
console.log("Patched!");
