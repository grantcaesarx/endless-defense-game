const fs = require('fs');
let code = fs.readFileSync('index.html', 'utf8');

const dashLogic = `            renderTerrain(); state = 'PLAYING'; updateHUD(); 
            renderDashboard(); 
            document.getElementById('dashboard').style.display = 'flex';
            if (gameMode === 'ROGUELIKE') { 
                document.getElementById('btn-add-slot').style.display = 'none'; 
            } else { 
                document.getElementById('btn-add-slot').style.display = ''; 
            }`;

code = code.replace(/renderTerrain\(\);\s*state = 'PLAYING';\s*updateHUD\(\);\s*if\(gameMode === 'ROGUELIKE'\)[\s\S]*?\} else \{[\s\S]*?\}/, dashLogic);

// Also we should ensure rlInventory is reset when not resuming, or at least keep it if we want it to be session-based?
// The prompt says it's in-game currency (gold) or out-game currency (gems). So it's probably bought on demand. Resetting to 0 on a fresh game is fine.
// Wait, if it's a fresh endless game, we should reset it.
const resetInv = `                Store.remove('resumeMap'); // Force clear saved map for fresh runs
                rlInventory = { heal: 0, thunder: 0, guards: 0, archers: 0, titan: 0, dragon: 0, warp: 0, nuke: 0 };`;
code = code.replace(/Store\.remove\('resumeMap'\); \/\/ Force clear saved map for fresh runs/, resetInv);

fs.writeFileSync('index.html', code);
console.log("Dashboard visible everywhere");
