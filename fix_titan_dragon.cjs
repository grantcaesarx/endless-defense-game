const fs = require('fs');
let code = fs.readFileSync('index.html', 'utf8');

const oldUpdate = `            update() {
                if(this.hp <= 0) {`;

const newUpdate = `            update() {
                if(this.tw.type === 'titan' || this.tw.type === 'dragon') {
                    if(!this.targets) this.targets = [];
                    
                    // Filter dead or out of range
                    this.targets = this.targets.filter(e => {
                        if(e.hp <= 0 || dist(this.x, this.y, e.px, e.py) > this.range) {
                            e.blocked = false; return false;
                        }
                        return true;
                    });
                    
                    if(this.hp <= 0) {
                        this.targets.forEach(e => e.blocked = false);
                        this.targets = [];
                        this.state = 'DEAD';
                        this.tw.soldiers = this.tw.soldiers.filter(s => s!==this);
                        return;
                    }
                    
                    this.bob += 0.2;
                    let canBlockFly = (this.tw.type === 'dragon');
                    
                    for(let e of enemies) {
                        if(this.targets.length >= (this.blockCap || 99)) break;
                        if((!e.fly || canBlockFly) && !e.blocked && dist(this.x, this.y, e.px, e.py) < this.range) {
                            e.blocked = true;
                            this.targets.push(e);
                        }
                    }
                    
                    if(this.targets.length > 0) {
                        this.state = 'COMBAT';
                        if(frames % 60 === 0) {
                            this.targets.forEach(e => e.takeDmg(this.dmg, 'phys'));
                            sfx('hit');
                            if(this.tw.type === 'titan') addShake(5);
                            parts.push(new Particle(this.x, this.y-10, this.tw.type === 'titan' ? '#fbbf24' : '#ef4444', 5, 20));
                            
                            let dmgTaken = (5 + wave) * this.targets.length;
                            this.hp -= dmgTaken;
                            texts.push(new FloatingText(this.x, this.y-15, \`-\${dmgTaken}\`, '#fca5a5', 12, 30));
                        }
                    } else {
                        this.state = 'IDLE';
                    }
                    return;
                }

                if(this.hp <= 0) {`;

code = code.replace(oldUpdate, newUpdate);

fs.writeFileSync('index.html', code);
console.log("Titan/Dragon block fix applied");
