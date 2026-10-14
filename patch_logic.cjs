const fs = require('fs');
let code = fs.readFileSync('index.html', 'utf8');

const newFunctions = `
        function generateRoguelikeMap() {
            let m = { grid: [] };
            for(let r=0; r<ROWS; r++) m.grid[r] = new Array(COLS).fill(0);
            let curR = 1, curC = 0;
            m.grid[curR][curC] = 2; // START
            let corners = 0, dir = 'R';
            while(curC < COLS-2 || corners < 5) {
                // If we reach the end but not enough corners, we have to loop back or restart
                if (curC >= COLS-2 && corners < 5) {
                    return generateRoguelikeMap(); // Try again
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
            curC++; m.grid[curR][curC] = 3; // END
            // Guarantee >= 20 slots
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
            if(slots < 20 || corners < 5) return generateRoguelikeMap(); // Safety check
            return m;
        }
        
        function renderDashboard() {
            let html = '';
            for(let k in ITEMS_DB) {
                let it = ITEMS_DB[k];
                let qty = rlInventory[k];
                let active = itemPlacementMode === k ? 'active' : '';
                html += \`<div class="item-card \${active}" onclick="useRlItem('\${k}')">
                    <div class="item-qty">\${qty}</div>
                    <div class="item-title">\${it.icon} \${it.n}</div>
                    <div class="item-desc">\${it.desc}</div>
                    <div class="item-buttons">
                        <button class="btn-buy gold" onclick="event.stopPropagation(); buyRlItem('\${k}', 'gold')">💰 \${it.gold}</button>
                        <button class="btn-buy gem" onclick="event.stopPropagation(); buyRlItem('\${k}', 'gem')">💎 \${it.gem}</button>
                    </div>
                </div>\`;
            }
            document.getElementById('item-tray').innerHTML = html;
            
            let h = heroes[activeHero];
            document.getElementById('dash-hero-name').innerText = activeHero;
            document.getElementById('dash-hero-icon').innerText = activeHero==='archer'?'🏹':(activeHero==='paladin'?'🛡️':'🐉');
            document.getElementById('dash-hero-lvl').innerText = h.level;
            document.getElementById('dash-hero-xp').style.width = (h.xp / (100 * h.level)) * 100 + '%';
        }
        
        function buyRlItem(id, curr) {
            let it = ITEMS_DB[id];
            if(curr === 'gold') {
                if(gold >= it.gold) { gold -= it.gold; rlInventory[id]++; sfx('coin'); } else alert('Not enough Gold!');
            } else {
                if(metaGems >= it.gem) { metaGems -= it.gem; rlInventory[id]++; saveMeta(); sfx('build'); } else alert('Not enough Gems!');
            }
            updateHUD();
        }
        
        function useRlItem(id) {
            if(rlInventory[id] <= 0) return;
            let it = ITEMS_DB[id];
            if(it.type === 'instant') {
                rlInventory[id]--;
                triggerInstantItem(id);
            } else {
                itemPlacementMode = itemPlacementMode === id ? null : id;
            }
            renderDashboard();
        }
        
        function triggerInstantItem(id) {
            if(id === 'heal') {
                hp = Math.min(20, hp + 10); sfx('build');
            } else if(id === 'thunder') {
                sfx('hit'); addShake(20);
                let tgts = enemies.slice(0, 30);
                tgts.forEach(e => {
                    e.takeDmg(200, 'magic');
                    // Chain
                    let close = enemies.find(x => x!==e && dist(x.x, x.y, e.x, e.y) < 100);
                    if(close) { close.takeDmg(200, 'magic'); }
                });
            } else if(id === 'nuke') {
                sfx('hit'); addShake(100);
                // Flash overlay
                let flash = document.createElement('div');
                flash.style.cssText = 'position:fixed;top:0;left:0;width:100%;height:100%;background:white;z-index:9999;pointer-events:none;transition:opacity 2s;';
                document.body.appendChild(flash);
                setTimeout(() => { flash.style.opacity = '0'; setTimeout(()=>flash.remove(), 2000); }, 100);
                enemies = [];
                // Kill summons
                towers.forEach(t => { if(t.type === TOWER.BARRACKS || t.type === 'dragon' || t.type === 'titan' || t.type === 'archers') t.soldiers = []; });
            }
            updateHUD();
        }
        
        function triggerTargetItem(c, r) {
            let id = itemPlacementMode;
            rlInventory[id]--;
            itemPlacementMode = null;
            let x = c * TILE_SIZE + 32, y = r * TILE_SIZE + 32;
            sfx('build');
            
            if(id === 'guards' || id === 'archers' || id === 'titan' || id === 'dragon') {
                // Spawn a dummy tower that holds these units
                let t = new Tower(c, r, TOWER.BARRACKS); 
                t.type = id; 
                t.soldiers = [];
                let count = (id==='guards'||id==='archers') ? 10 : 1;
                for(let i=0; i<count; i++) {
                    let s = new Soldier(t, x, y);
                    if(id==='guards') { s.maxHp=1000; s.hp=1000; s.dmg=100; s.range=30; }
                    if(id==='archers') { s.maxHp=500; s.hp=500; s.dmg=50; s.range=200; s.type='ranged'; }
                    if(id==='titan') { s.maxHp=10000; s.hp=10000; s.dmg=300; s.range=80; s.aoe=true; s.blockCap=99; }
                    if(id==='dragon') { s.maxHp=10000; s.hp=10000; s.dmg=300; s.range=200; s.type='ranged'; } // Blocks flying conceptually
                    t.soldiers.push(s);
                }
                towers.push(t);
            } else if (id === 'warp') {
                enemies.forEach(e => {
                    if(dist(e.x, e.y, x, y) < 300) {
                        e.wp = 0; e.x = waypoints[0].x; e.y = waypoints[0].y;
                    }
                });
            }
            renderDashboard();
        }
        
        function showBoons() {
            paused = true;
            document.getElementById('boon-container').classList.remove('hidden');
            let pool = [...BOONS_DB].sort(()=>Math.random()-0.5).slice(0,3);
            let html = '';
            pool.forEach(b => {
                html += \`<div class="boon-card" onclick="selectBoon('\${b.id}')">
                    <h3 style="color:#facc15">\${b.n}</h3>
                    <p>\${b.desc}</p>
                </div>\`;
            });
            document.getElementById('boon-cards').innerHTML = html;
        }
        
        function selectBoon(id) {
            activeBoons[id] = true;
            document.getElementById('boon-container').classList.add('hidden');
            sfx('build');
            paused = false;
            
            // Apply immediate boons
            if(id === 'tactical_reserves') { gold += 500; metaGems += 1; saveMeta(); updateHUD(); }
            if(id === 'last_stand') { hp = 1; updateHUD(); }
            
            // Start next wave automatically
            if(wave < 10) { startWave(); } else { /* boss */ startWave(); }
        }
`;

code = code.replace('// Input Setup', newFunctions + '\n        // Input Setup');
fs.writeFileSync('index.html', code);
console.log("Injected logic functions");
