const fs = require('fs');
let code = fs.readFileSync('index.html', 'utf8');

const newSoldierDraw = `
            draw(c) {
                let x = this.px, y = this.py;
                if(this.state === 'DEAD') return;
                
                let tick = frames * 0.1;
                let bob = (this.state === 'MOVING' || this.state === 'MOVING_TO_RALLY') ? Math.abs(Math.sin(tick*1.5))*2 : 0;
                
                drawShadow(c, x, y+this.r, this.r, this.r/2);
                
                c.save();
                c.translate(x, y - bob);
                if(this.facingLeft) c.scale(-1, 1);
                
                if (SVGS.soldier && SVGS.soldier.complete) {
                    c.drawImage(SVGS.soldier, -SVGS.soldier.width/2, -SVGS.soldier.height/2 - 5);
                }
                
                c.restore();
                
                // HP Bar
                c.fillStyle = '#000'; c.fillRect(x - 10, y - this.r - 8, 20, 4);
                c.fillStyle = '#22c55e'; c.fillRect(x - 10, y - this.r - 8, 20 * (this.hp/this.maxHp), 4);
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

code = code.replace(/draw\(c\) \{[\s\S]*?c\.fillRect\(x - 10, y - this\.r - 8, 20 \* \(this\.hp\/this\.maxHp\), 4\);\n            \}/, newSoldierDraw.trim());
code = code.replace(/draw\(c\) \{[\s\S]*?c\.fillRect\(x - 12, y - 20, 24 \* \(this\.hp\/this\.maxHp\), 4\);\n            \}/, newHeroDraw.trim());

fs.writeFileSync('index.html', code);
console.log("Patched Soldier/Hero with SVG");
