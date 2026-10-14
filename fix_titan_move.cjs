const fs = require('fs');
let code = fs.readFileSync('index.html', 'utf8');

const oldCode = `                        if(frames % 60 === 0) {
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
                }`;

const newCode = `                        if(frames % 60 === 0) {
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
                        let rx = this.tw.rallyX;
                        let ry = this.tw.rallyY;
                        let d = dist(this.x, this.y, rx, ry);
                        if(d > 2) { this.x += (rx-this.x)/d * 2; this.y += (ry-this.y)/d * 2; }
                    }
                    return;
                }`;

code = code.replace(oldCode, newCode);
fs.writeFileSync('index.html', code);
