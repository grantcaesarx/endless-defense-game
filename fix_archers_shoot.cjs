const fs = require('fs');
let code = fs.readFileSync('index.html', 'utf8');

const oldUpdate = `                if(this.hp <= 0) {
                    if(this.tw.branch==='A' && !this.revived && !this.isSkel) {`;

const newUpdate = `                if(this.tw.type === 'archers') {
                    if(this.hp <= 0) {
                        this.state = 'DEAD';
                        this.tw.soldiers = this.tw.soldiers.filter(s => s!==this);
                        return;
                    }
                    this.bob += 0.2;
                    // Find target to shoot
                    let tgt = enemies.find(e => e.hp > 0 && dist(this.x, this.y, e.px, e.py) < this.range);
                    if(tgt) {
                        this.facingLeft = tgt.px < this.x;
                        if(frames % 60 === 0) {
                            projs.push(new Projectile(this.x, this.y-10, tgt, this.dmg, 'arrow', this.tw));
                            sfx('arrow');
                        }
                    } else {
                        // Wander around rally point slightly
                        let ang = (Math.PI*2/this.tw.soldiers.length) * this.tw.soldiers.indexOf(this);
                        let rx = this.tw.rallyX + Math.cos(ang)*40;
                        let ry = this.tw.rallyY + Math.sin(ang)*40;
                        let d = dist(this.x, this.y, rx, ry);
                        if(d > 2) { this.x += (rx-this.x)/d * 2; this.y += (ry-this.y)/d * 2; }
                    }
                    return;
                }

                if(this.hp <= 0) {
                    if(this.tw.branch==='A' && !this.revived && !this.isSkel) {`;

code = code.replace(oldUpdate, newUpdate);
fs.writeFileSync('index.html', code);
console.log("Archers shoot logic fixed");
