const fs = require('fs');
let code = fs.readFileSync('index.html', 'utf8');

const newHeroDraw = `
            draw(c) {
                if(this.state === 'DEAD') return;
                let x = this.px, y = this.py;
                
                let tick = frames * 0.1;
                let isMoving = dist(this.x, this.y, this.tgtX, this.tgtY) > 5;
                let bob = isMoving ? Math.abs(Math.sin(tick*1.5))*3 : 0;
                
                // Shadow
                drawShadow(c, x, y+10, 12, 6);
                
                c.save();
                c.translate(x, y - bob);
                if(this.facingLeft) c.scale(-1, 1);

                if(this.sel) {
                    c.beginPath(); c.ellipse(0, 10 + bob, 16, 8, 0, 0, Math.PI*2);
                    c.strokeStyle = '#3b82f6'; c.lineWidth = 2; c.stroke();
                }

                if(this.type === 'archer') {
                    // Archer Sprite
                    c.fillStyle = '#166534'; // Green cloak
                    c.fillRect(-8, 0, 16, 14);
                    c.fillStyle = '#fcd34d'; // Head
                    c.beginPath(); c.arc(0, -6, 8, 0, Math.PI*2); c.fill();
                    c.fillStyle = '#14532d'; // Hood
                    c.beginPath(); c.arc(0, -6, 8, Math.PI, 0); c.fill();
                    c.fillStyle = '#b45309'; // Bow
                    c.beginPath(); c.arc(10, 4, 10, -Math.PI/4, Math.PI/4); c.stroke();
                } else if(this.type === 'paladin') {
                    // Paladin Sprite
                    c.fillStyle = '#e2e8f0'; // Silver armor
                    c.fillRect(-10, 0, 20, 16);
                    c.beginPath(); c.arc(0, -6, 9, 0, Math.PI*2); c.fill();
                    c.fillStyle = '#fbbf24'; // Gold trim
                    c.fillRect(-10, 12, 20, 4);
                    c.fillStyle = '#991b1b'; // Red plume
                    c.fillRect(-2, -18, 4, 6);
                    c.fillStyle = '#cbd5e1'; // Big hammer
                    c.fillRect(10, -10, 8, 14);
                    c.fillStyle = '#78350f';
                    c.fillRect(12, 4, 4, 16);
                } else if(this.type === 'dragon') {
                    // Dragon Sprite
                    bob = Math.sin(tick*2)*4; // Always flying
                    c.translate(0, -bob); // Double bob for flight
                    
                    c.fillStyle = '#b91c1c'; // Red scales
                    c.beginPath(); c.ellipse(0, 0, 14, 10, 0, 0, Math.PI*2); c.fill(); // Body
                    c.beginPath(); c.arc(12, -8, 8, 0, Math.PI*2); c.fill(); // Head
                    
                    // Wings
                    let wingBob = Math.sin(tick*3) * 15;
                    c.fillStyle = '#7f1d1d';
                    c.beginPath(); c.moveTo(-5, -5); c.lineTo(-20, -20 - wingBob); c.lineTo(-25, 0 - wingBob/2); c.fill();
                    
                    c.fillStyle = '#fef08a'; // Eye
                    c.fillRect(14, -10, 2, 2);
                }

                c.restore();
                
                // HP Bar
                c.fillStyle = '#000'; c.fillRect(x - 12, y - 20, 24, 4);
                c.fillStyle = '#22c55e'; c.fillRect(x - 12, y - 20, 24 * (this.hp/this.maxHp), 4);
            }
`;

code = code.replace(/draw\(c\) \{[\s\S]*?c\.fillRect\(x - 12, y - 20, 24 \* \(this\.hp\/this\.maxHp\), 4\);\n            \}/, newHeroDraw.trim());
fs.writeFileSync('index.html', code);
console.log("Patched Hero draw");
