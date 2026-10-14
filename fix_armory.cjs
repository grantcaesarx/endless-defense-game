const fs = require('fs');
let code = fs.readFileSync('index.html', 'utf8');

// 1. Update armory modal HTML to be dynamic
const oldArmory = `<div class="item-grid">
                    <div class="item-card">
                        <div style="font-size:2rem;">🧨</div>
                        <h3>Dynamite</h3>
                        <div style="color:#aaa; font-size:0.8rem; margin-bottom:10px;">AoE Nuke</div>
                        <div>Owned: <span id="item-dynamite-count">0</span></div>
                        <button onclick="buyItem('dynamite')" style="margin-top:10px; padding:8px 15px; font-size:1rem; width:100%;" class="btn-yellow">Buy (2 💎)</button>
                    </div>
                    <div class="item-card">
                        <div style="font-size:2rem;">❄️</div>
                        <h3>Frost Glass</h3>
                        <div style="color:#aaa; font-size:0.8rem; margin-bottom:10px;">Freeze All</div>
                        <div>Owned: <span id="item-freeze-count">0</span></div>
                        <button onclick="buyItem('freeze')" style="margin-top:10px; padding:8px 15px; font-size:1rem; width:100%;" class="btn-yellow">Buy (3 💎)</button>
                    </div>
                </div>`;

code = code.replace(oldArmory, '<div class="item-grid" id="armory-item-grid"></div>');

// 2. Add renderArmory function and modify openArmory
const renderArmoryLogic = `
        function renderArmory() {
            let html = '';
            for(let k in ITEMS_DB) {
                let it = ITEMS_DB[k];
                let qty = rlInventory[k] || 0;
                html += \`<div class="item-card" style="border-color: #3b82f6;">
                    <div style="font-size:2rem; text-align:center;">\${it.icon}</div>
                    <h3 style="text-align:center; margin: 5px 0;">\${it.n}</h3>
                    <div style="color:#aaa; font-size:0.8rem; margin-bottom:10px; text-align:center; height: 32px;">\${it.desc}</div>
                    <div style="text-align:center; font-weight:bold;">Owned: <span style="color:#22c55e;">\${qty}</span></div>
                    <button onclick="buyRlItem('\${k}', 'gem')" style="margin-top:10px; padding:8px 15px; font-size:1rem; width:100%;" class="btn-yellow">Buy (\${it.gem} 💎)</button>
                </div>\`;
            }
            document.getElementById('armory-item-grid').innerHTML = html;
        }
        function openArmory() { 
            document.getElementById('ui-armory').classList.remove('hidden'); 
            loadMeta(); 
            renderArmory();
        }
`;

code = code.replace(/function openArmory\(\) \{ [^\}]+\}/, renderArmoryLogic);

// 3. Make buyRlItem re-render armory if open
const newBuyRlItem = `function buyRlItem(id, curr) {
            let it = ITEMS_DB[id];
            if(curr === 'gold') {
                if(gold >= it.gold) { gold -= it.gold; rlInventory[id]++; Store.save('rlInventory', rlInventory); sfx('coin'); } else alert('Not enough Gold!');
            } else {
                if(metaGems >= it.gem) { metaGems -= it.gem; rlInventory[id]++; Store.save('rlInventory', rlInventory); saveMeta(); sfx('build'); } else alert('Not enough Gems!');
            }
            updateHUD();
            renderDashboard();
            if(!document.getElementById('ui-armory').classList.contains('hidden')) {
                renderArmory();
            }
        }`;

code = code.replace(/function buyRlItem\(id, curr\) \{[\s\S]*?updateHUD\(\);\s*\}/, newBuyRlItem);

// 4. Remove old hud-bar items (dynamite, freeze)
code = code.replace(/<button onclick="useItem\('dynamite'\)"[^>]+>.*?<\/button>/, '');
code = code.replace(/<button onclick="useItem\('freeze'\)"[^>]+>.*?<\/button>/, '');

// Also remove them from updateHUD
code = code.replace(/if\(items\.dynamite > 0\) \{ [^\}]+\} else document\.getElementById\('btn-item-dynamite'\)\.classList\.add\('hidden'\);/, '');
code = code.replace(/if\(items\.freeze > 0\) \{ [^\}]+\} else document\.getElementById\('btn-item-freeze'\)\.classList\.add\('hidden'\);/, '');

fs.writeFileSync('index.html', code);
console.log("Armory updated with new items");
