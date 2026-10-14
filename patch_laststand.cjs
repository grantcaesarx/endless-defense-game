const fs = require('fs');
let code = fs.readFileSync('index.html', 'utf8');

const target1 = `if(curT - this.atkTimer > (this.isSkel?60:30)) {`;
const replace1 = `if(curT - this.atkTimer > (this.isSkel?60:30)) {
                        let finalDmg = activeBoons.last_stand ? this.dmg * 2 : this.dmg;
                        this.target.takeDmg(finalDmg, 'phys');
                        if (gameMode === 'ROGUELIKE' && currentElement && currentElement.id === 'Frost' && Math.random() < 0.2) {
                            this.frozen = 60; // 1s stun
                        }`;
code = code.replace(`this.target.takeDmg(this.dmg, 'phys');\nif (gameMode === 'ROGUELIKE' && currentElement && currentElement.id === 'Frost' && Math.random() < 0.2) {\n    this.frozen = 60; // 1s stun\n}`, ``);
code = code.replace(target1, replace1);

const target2 = `projs.push(new Projectile(this.x, this.y, p.x, p.y, s.dmg, tType, s.aoe, p));`;
const replace2 = `let finalDmg = activeBoons.last_stand ? s.dmg * 2 : s.dmg;
                    projs.push(new Projectile(this.x, this.y, p.x, p.y, finalDmg, tType, s.aoe, p));`;
code = code.replace(target2, replace2);

const target3 = `this.hp += amt;`; // Just checking where I can put Enemy regen. 
// Let's insert in Enemy.update
const target4 = `                if(this.stun > 0) { this.stun -= speed; return; }`;
const replace4 = `                if (gameMode === 'ROGUELIKE' && currentElement && currentElement.id === 'Nature' && this.hp < this.maxHp) {
                    this.hp = Math.min(this.maxHp, this.hp + (this.maxHp * 0.02) / 60 * speed);
                }
                if(this.shattered > 0) this.shattered -= speed;
                if(this.stun > 0) { this.stun -= speed; return; }`;
code = code.replace(target4, replace4);

fs.writeFileSync('index.html', code);
console.log("Patched last_stand and nature regen");
