const fs = require('fs');
let code = fs.readFileSync('index.html', 'utf8');

const oldDraw = `                } else {
                    c.fillStyle = '#3b82f6'; c.beginPath(); c.arc(this.x, y, 6, 0, Math.PI*2); c.fill();
                    c.fillStyle = '#9ca3af'; c.fillRect(this.x+4, y-4, 8, 2); // Sword
                }`;

const newDraw = `                } else if (this.tw.type === 'titan') {
                    c.fillStyle = '#78716c'; c.fillRect(this.x-15, y-20, 30, 40); // Big stone body
                    c.fillStyle = '#fbbf24'; c.fillRect(this.x-10, y-15, 20, 10); // Gold head
                } else if (this.tw.type === 'dragon') {
                    c.fillStyle = '#10b981'; c.fillRect(this.x-20, y-10, 40, 20); // Big green dragon
                    c.fillStyle = '#047857'; c.beginPath(); c.moveTo(this.x-20, y-10); c.lineTo(this.x-30, y-30); c.lineTo(this.x-10, y-10); c.fill(); // Left wing
                    c.beginPath(); c.moveTo(this.x+20, y-10); c.lineTo(this.x+30, y-30); c.lineTo(this.x+10, y-10); c.fill(); // Right wing
                } else if (this.tw.type === 'guards') {
                    c.fillStyle = '#475569'; c.fillRect(this.x-6, y-10, 12, 18);
                    c.fillStyle = '#cbd5e1'; c.fillRect(this.x-7, y-12, 14, 4); // Helmet
                    c.fillStyle = '#e2e8f0'; c.fillRect(this.x-10, y-4, 4, 14); // Big shield
                } else if (this.tw.type === 'archers') {
                    c.fillStyle = '#16a34a'; c.fillRect(this.x-5, y-8, 10, 16);
                    c.fillStyle = '#22c55e'; c.beginPath(); c.arc(this.x, y-10, 5, 0, Math.PI*2); c.fill(); // Hood
                    c.strokeStyle = '#b45309'; c.lineWidth = 2; c.beginPath(); c.arc(this.x+5, y, 6, -Math.PI/2, Math.PI/2); c.stroke(); // Bow
                } else {
                    c.fillStyle = '#3b82f6'; c.beginPath(); c.arc(this.x, y, 6, 0, Math.PI*2); c.fill();
                    c.fillStyle = '#9ca3af'; c.fillRect(this.x+4, y-4, 8, 2); // Sword
                }`;

code = code.replace(oldDraw, newDraw);
fs.writeFileSync('index.html', code);
console.log("Draw functions added");
