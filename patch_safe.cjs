const fs = require('fs');
let code = fs.readFileSync('index.html', 'utf8');

const newEnemyDraw = `
            draw(c) {
                let x = this.px, y = this.py;
                let tick = this.bob;
                
                // Shadow
                if(this.fly) {
                    c.fillStyle = 'rgba(0,0,0,0.4)';
                    c.beginPath(); c.ellipse(x, y + 15, 12 + Math.sin(tick)*2, 6, 0, 0, Math.PI*2); c.fill();
                    y -= 15 + Math.sin(tick)*3;
                } else {
                    drawShadow(c, x, y+this.r, this.r, this.r/2);
                }
                
                c.save();
                c.translate(x, y);
                if(this.facingLeft) c.scale(-1, 1);
                
                if(this.hitTimer > 0) c.filter = 'brightness(300%)';
                
                let img = null;
                let bobY = 0;
                
                if (this.type === ENEMY.LIGHT) {
                    img = SVGS.goblin;
                    bobY = Math.abs(Math.sin(tick * 1.5)) * 4;
                } else if (this.type === ENEMY.HEAVY) {
                    img = SVGS.orc;
                    c.rotate(Math.sin(tick) * 0.2);
                } else if (this.type === ENEMY.FLYING) {
                    img = SVGS.gargoyle;
                    let flap = Math.sin(tick * 1.5);
                    // Gargoyle has internal wings, but the body can bounce slightly
                    bobY = Math.sin(tick) * 2;
                } else if (this.type === ENEMY.MAGIC) {
                    img = SVGS.necro;
                    bobY = Math.sin(tick) * 3;
                } else if (this.type === ENEMY.BOSS) {
                    img = SVGS.boss;
                    bobY = Math.abs(Math.sin(tick)) * 2;
                    c.rotate(Math.sin(tick) * 0.1);
                }

                if (img && img.complete) {
                    c.translate(0, -bobY);
                    c.drawImage(img, -img.width / 2, -img.height / 2);
                }
                
                c.restore();
                
                // Status effects on top
                if(this.stun > 0) {
                    c.save(); c.translate(x, y - this.r - 10); c.rotate(frames*0.2);
                    c.fillStyle = '#facc15'; c.fillRect(-10, -2, 20, 4); c.fillRect(-2, -10, 4, 20);
                    c.restore();
                }
                if(this.poison > 0) {
                    c.fillStyle = 'rgba(34, 197, 94, 0.6)'; c.beginPath(); c.arc(x, y - this.r, 6 + Math.sin(frames*0.3)*2, 0, Math.PI*2); c.fill();
                    if(frames%10===0) { let p = new Particle(x, y-this.r, '#22c55e', 0, 15, 3); p.g = -0.05; parts.push(p); }
                }
            }
`;

const newHeroDraw = `
            draw(c) {
                if(this.state === 'DEAD') return;
                let x = this.px, y = this.py;
                
                let tick = frames * 0.1;
                let isMoving = dist(this.x, this.y, this.tgtX, this.tgtY) > 5;
                let bob = isMoving ? Math.abs(Math.sin(tick*1.5))*3 : 0;
                
                if (this.type === 'dragon') bob = Math.sin(tick*2)*4;
                
                // Shadow
                drawShadow(c, x, y+10, 12, 6);
                
                c.save();
                c.translate(x, y - bob);
                if(this.facingLeft) c.scale(-1, 1);

                if(this.sel) {
                    c.beginPath(); c.ellipse(0, 10 + bob, 16, 8, 0, 0, Math.PI*2);
                    c.strokeStyle = '#3b82f6'; c.lineWidth = 2; c.stroke();
                }

                let img = null;
                if (this.type === 'archer') img = SVGS.heroArcher;
                else if (this.type === 'paladin') img = SVGS.heroPaladin;
                else if (this.type === 'dragon') img = SVGS.heroDragon;

                if (img && img.complete) {
                    c.drawImage(img, -img.width/2, -img.height/2 - 5);
                }

                c.restore();
                
                // HP Bar
                c.fillStyle = '#000'; c.fillRect(x - 12, y - 20, 24, 4);
                c.fillStyle = '#22c55e'; c.fillRect(x - 12, y - 20, 24 * (this.hp/this.maxHp), 4);
            }
`;

// Extract class blocks and replace only their draw methods
function replaceDrawMethod(source, className, newDraw) {
    let re = new RegExp("class " + className + " \\{[\\\\s\\\\S]*?(?=\\n\\\\s*class )");
    let match = source.match(re);
    if(!match) {
        // Try matching until end of file or next class
        re = new RegExp("class " + className + " \\{[\\\\s\\\\S]*");
        match = source.match(re);
        if(!match) return source;
    }
    
    let classBody = match[0];
    let classBodyReplaced = classBody.replace(/draw\\(c\\) \\{[\\s\\S]*?\\n\\s*\\}/, newDraw.trim());
    return source.replace(classBody, classBodyReplaced);
}

code = replaceDrawMethod(code, "Enemy", newEnemyDraw);
code = replaceDrawMethod(code, "HeroUnit", newHeroDraw);

fs.writeFileSync('index.html', code);
console.log("Patched correctly!");
