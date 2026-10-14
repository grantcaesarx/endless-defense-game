const fs = require('fs');
let code = fs.readFileSync('index.html', 'utf8');

const oldEnemy = `        class Enemy {
            constructor(type, mHp, spd, rw, r, col) {
                this.type = type; this.maxHp = mHp; this.hp = mHp;
                this.spd = spd + wave*0.02; this.reward = rw; this.r = r; this.col = col;
                this.fly = type === ENEMY.FLYING; this.heavy = type === ENEMY.HEAVY || type === ENEMY.BOSS;
                
                this.armor = this.heavy ? 50 : (this.fly ? 10 : 0);
                this.magicRes = type === ENEMY.MAGIC ? 70 : 0;
                if(type === ENEMY.BOSS) { this.armor = 60; this.magicRes = 40; }
                
                this.pIdx = 0; this.x = waypoints[0].x; this.y = waypoints[0].y;
                this.ox = rand(-12,12); this.oy = rand(-12,12);
                this.blocked = false; this.poison = 0; this.stun = 0;
                this.bob = rand(0, Math.PI*2);
                
                this.hitTimer = 0;
                this.facingLeft = false;
            }`;

const newEnemy = `        class Enemy {
            constructor(type, mHp, spd, rw, r, col) {
                this.type = type; this.maxHp = mHp; this.hp = mHp;
                this.spd = spd + wave*0.02; this.reward = rw; this.r = r; this.col = col;
                this.fly = type === ENEMY.FLYING; this.heavy = type === ENEMY.HEAVY || type === ENEMY.BOSS;
                
                this.armor = this.heavy ? 50 : (this.fly ? 10 : 0);
                this.magicRes = type === ENEMY.MAGIC ? 70 : 0;
                if(type === ENEMY.BOSS) { this.armor = 60; this.magicRes = 40; }
                
                if (gameMode === 'ROGUELIKE' && currentElement) {
                    this.col = currentElement.col;
                    if (currentElement.id === 'Nature') this.maxHp *= 1.2;
                    if (currentElement.id === 'Earth') this.armor = 60;
                    if (currentElement.id === 'Arcane') this.magicRes = 50;
                    if (currentElement.id === 'Frost') this.spd *= 0.9;
                }
                
                if (activeBoons.global_frost) this.spd *= 0.85;
                this.hp = this.maxHp;
                
                this.pIdx = 0; this.x = waypoints[0].x; this.y = waypoints[0].y;
                this.ox = rand(-12,12); this.oy = rand(-12,12);
                this.blocked = false; this.poison = 0; this.stun = 0; this.shattered = 0;
                this.bob = rand(0, Math.PI*2);
                
                this.hitTimer = 0;
                this.facingLeft = false;
            }`;
code = code.replace(oldEnemy, newEnemy);

const oldTakeDmg = `            takeDmg(amt, type, source='norm') {
                if(this.hp <= 0) return;
                let isCrit = false;
                if(type === 'phys') amt *= (100 - this.armor)/100;
                else if(type === 'magic') amt *= (100 - this.magicRes)/100;
                if(source === 'headshot') { amt = this.maxHp*10; isCrit = true; }`;

const newTakeDmg = `            takeDmg(amt, type, source='norm') {
                if(this.hp <= 0) return;
                let isCrit = false;
                
                if (activeBoons.lethal_snipe && Math.random() < 0.05 && source !== 'poison') {
                    amt *= 3;
                    type = 'true';
                    isCrit = true;
                }
                
                if(activeBoons.mage_shatter && type === 'magic') {
                    this.shattered = 240; // 4 seconds
                }
                
                let curArmor = this.shattered > 0 ? this.armor * 0.8 : this.armor;
                if (gameMode === 'ROGUELIKE' && currentElement && currentElement.id === 'Earth') curArmor = 60;
                
                if(type === 'phys') amt *= (100 - curArmor)/100;
                else if(type === 'magic') amt *= (100 - this.magicRes)/100;
                if(source === 'headshot') { amt = this.maxHp*10; isCrit = true; }`;
code = code.replace(oldTakeDmg, newTakeDmg);

const oldDie = `            die() {
                if(this.pIdx >= waypoints.length) return; 
                gold += this.reward * (waveData.swarm ? 2 : 1);`;

const newDie = `            die() {
                if(this.pIdx >= waypoints.length) return; 
                gold += this.reward * (waveData.swarm ? 2 : 1) + (activeBoons.midas_touch ? 2 : 0);
                if (gameMode === 'ROGUELIKE' && currentElement && currentElement.id === 'Fire') {
                    // Explode
                    let closeT = towers.filter(t => t.type === TOWER.BARRACKS || t.type === 'guards' || t.type === 'titan');
                    closeT.forEach(t => {
                        t.soldiers.forEach(s => {
                            if(dist(s.x, s.y, this.px, this.py) < 60) s.hp -= 20;
                        });
                    });
                }`;
code = code.replace(oldDie, newDie);

fs.writeFileSync('index.html', code);
console.log("Patched enemy");
