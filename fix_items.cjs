const fs = require('fs');
let code = fs.readFileSync('index.html', 'utf8');

// 1. Add dynamite and freeze to ITEMS_DB
const oldItemsDb = `        const ITEMS_DB = {
            heal: { n: '王室急救补给', desc: '基地恢复+10HP', gold: 500, gem: 1, type: 'instant', icon: '❤️' },`;
const newItemsDb = `        const ITEMS_DB = {
            dynamite: { n: '高爆裂地炸药', desc: '200范围1000伤害', gold: 1000, gem: 2, type: 'target', icon: '🧨' },
            freeze: { n: '绝对零度冰霜', desc: '300范围冻结10秒', gold: 1500, gem: 3, type: 'target', icon: '❄️' },
            heal: { n: '王室急救补给', desc: '基地恢复+10HP', gold: 500, gem: 1, type: 'instant', icon: '❤️' },`;
code = code.replace(oldItemsDb, newItemsDb);

// 2. Add them to rlInventory default
code = code.replace(/let rlInventory = Store\.load\('rlInventory'\) \|\| \{ heal: 0, thunder: 0, guards: 0, archers: 0, titan: 0, dragon: 0, warp: 0, nuke: 0 \};/, "let rlInventory = Store.load('rlInventory') || { dynamite: 0, freeze: 0, heal: 0, thunder: 0, guards: 0, archers: 0, titan: 0, dragon: 0, warp: 0, nuke: 0 };");
// Also replace the reset in startGame
code = code.replace(/rlInventory = \{ heal: 0, thunder: 0, guards: 0, archers: 0, titan: 0, dragon: 0, warp: 0, nuke: 0 \};/g, "rlInventory = { dynamite: 0, freeze: 0, heal: 0, thunder: 0, guards: 0, archers: 0, titan: 0, dragon: 0, warp: 0, nuke: 0 };");

// 3. Add to triggerTargetItem
const triggerTargetStr = `                enemies.forEach(e => {
                    if(dist(e.x, e.y, x, y) < 300) {
                        e.wp = 0; e.x = waypoints[0].x; e.y = waypoints[0].y;
                    }
                });
            }`;

const newTriggerTargetStr = `                enemies.forEach(e => {
                    if(dist(e.x, e.y, x, y) < 300) {
                        e.wp = 0; e.x = waypoints[0].x; e.y = waypoints[0].y;
                    }
                });
            } else if (id === 'dynamite') {
                addShake(30);
                parts.push(new Particle(x, y, '#ef4444', 30, 40));
                enemies.forEach(e => {
                    if(dist(e.x, e.y, x, y) <= 200) e.takeDmg(1000, 'magic');
                });
            } else if (id === 'freeze') {
                addShake(10);
                parts.push(new Particle(x, y, '#93c5fd', 50, 40));
                enemies.forEach(e => {
                    if(dist(e.x, e.y, x, y) <= 300) {
                        e.freeze = 600; // 10 seconds (60 fps * 10)
                    }
                });
            }`;

code = code.replace(triggerTargetStr, newTriggerTargetStr);

// 4. Update renderArmory to have two buttons (Meta Gold and Gem)
const oldArmoryBtn = `<button onclick="buyRlItem('\${k}', 'gem')" style="margin-top:10px; padding:8px 15px; font-size:1rem; width:100%;" class="btn-yellow">Buy (\${it.gem} 💎)</button>`;
const newArmoryBtn = `<div style="display:flex; gap: 5px; margin-top:10px;">
                        <button onclick="buyRlItem('\${k}', 'metagold')" style="padding:6px; font-size:0.9rem; flex:1;" class="btn-yellow">\${it.gold} 💰</button>
                        <button onclick="buyRlItem('\${k}', 'gem')" style="padding:6px; font-size:0.9rem; flex:1;" class="btn-yellow">\${it.gem} 💎</button>
                    </div>`;
code = code.replace(oldArmoryBtn, newArmoryBtn);

// 5. Update buyRlItem to handle 'metagold'
const oldBuyRlItem = `        function buyRlItem(id, curr) {
            let it = ITEMS_DB[id];
            if(curr === 'gold') {
                if(gold >= it.gold) { gold -= it.gold; rlInventory[id]++; Store.save('rlInventory', rlInventory); sfx('coin'); } else alert('Not enough Gold!');
            } else {
                if(metaGems >= it.gem) { metaGems -= it.gem; rlInventory[id]++; Store.save('rlInventory', rlInventory); saveMeta(); sfx('build'); } else alert('Not enough Gems!');
            }`;

const newBuyRlItem = `        function buyRlItem(id, curr) {
            let it = ITEMS_DB[id];
            // Make sure the property exists on old saves
            if(rlInventory[id] === undefined) rlInventory[id] = 0;
            
            if(curr === 'gold') {
                if(gold >= it.gold) { gold -= it.gold; rlInventory[id]++; Store.save('rlInventory', rlInventory); sfx('coin'); } else alert('Not enough In-Game Gold!');
            } else if(curr === 'metagold') {
                if(metaGold >= it.gold) { metaGold -= it.gold; rlInventory[id]++; Store.save('rlInventory', rlInventory); saveMeta(); sfx('coin'); } else alert('Not enough Meta Gold!');
            } else {
                if(metaGems >= it.gem) { metaGems -= it.gem; rlInventory[id]++; Store.save('rlInventory', rlInventory); saveMeta(); sfx('build'); } else alert('Not enough Gems!');
            }`;
code = code.replace(oldBuyRlItem, newBuyRlItem);

fs.writeFileSync('index.html', code);
console.log("Dynamite and Freeze added, dual buying options added");
