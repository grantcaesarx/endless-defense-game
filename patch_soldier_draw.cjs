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
                
                // Knight sprite using vectors
                c.fillStyle = '#f8fafc'; // Silver armor
                c.beginPath(); c.arc(0, -5, 8, 0, Math.PI*2); c.fill(); // Head
                c.fillStyle = '#0f172a';
                c.fillRect(-6, -8, 12, 3); // Visor slit
                
                c.fillStyle = '#3b82f6'; // Blue cape/tabard
                c.fillRect(-8, 0, 16, 12);
                c.fillStyle = '#e2e8f0'; // Shoulders
                c.beginPath(); c.arc(-8, 2, 4, 0, Math.PI*2); c.fill();
                c.beginPath(); c.arc(8, 2, 4, 0, Math.PI*2); c.fill();
                
                // Sword
                c.fillStyle = '#94a3b8';
                c.fillRect(8, -2, 3, 16);
                c.fillStyle = '#475569';
                c.fillRect(5, 10, 9, 2); // Crossguard
                
                // Shield
                c.fillStyle = '#1e3a8a';
                c.beginPath(); c.moveTo(-10, -2); c.lineTo(-2, -2); c.lineTo(-2, 8); c.lineTo(-6, 12); c.lineTo(-10, 8); c.fill();
                c.strokeStyle = '#fbbf24'; c.lineWidth = 1; c.stroke();
                
                c.restore();
                
                // HP Bar
                c.fillStyle = '#000'; c.fillRect(x - 10, y - this.r - 8, 20, 4);
                c.fillStyle = '#22c55e'; c.fillRect(x - 10, y - this.r - 8, 20 * (this.hp/this.maxHp), 4);
            }
`;

code = code.replace(/draw\(c\) \{[\s\S]*?c\.fillRect\(x - 10, y - this\.r - 8, 20 \* \(this\.hp\/this\.maxHp\), 4\);\n            \}/, newSoldierDraw.trim());
fs.writeFileSync('index.html', code);
console.log("Patched Soldier draw");
