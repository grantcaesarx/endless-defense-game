const fs = require('fs');
let code = fs.readFileSync('index.html', 'utf8');

const oldWaveEnd = `                } else if(enemies.length === 0) {
                    wave++; 
                    if (resumedWave !== null) resumedWave = null; // Reset resumedWave flag so next wave is normal
                    let hs = Store.load('hs') || 0; if(wave > hs) Store.save('hs', wave);
                    if(wave > 20 && wave % 10 === 1) availableSlots++;
                    metaGold += wave * 2; saveMeta();
                    waveData.on = false; waveData.t = 300; // 5 sec prep
                    updateHUD();
                }`;

const newWaveEnd = `                } else if(enemies.length === 0) {
                    wave++; 
                    if (resumedWave !== null) resumedWave = null;
                    if (gameMode === 'ROGUELIKE') {
                        waveData.on = false; waveData.t = 300;
                        metaGold += wave * 2; saveMeta();
                        updateHUD();
                        if (wave > 10) {
                            alert("YOU WON THE EXPEDITION!");
                            backToMenu();
                        } else {
                            showBoons(); // Pauses and shows boons
                        }
                    } else {
                        let hs = Store.load('hs') || 0; if(wave > hs) Store.save('hs', wave);
                        if(wave > 20 && wave % 10 === 1) availableSlots++;
                        metaGold += wave * 2; saveMeta();
                        waveData.on = false; waveData.t = 300; // 5 sec prep
                        updateHUD();
                    }
                }`;
code = code.replace(oldWaveEnd, newWaveEnd);

fs.writeFileSync('index.html', code);
console.log("Patched wave");
