const fs = require('fs');
let code = fs.readFileSync('index.html', 'utf8');

const oldHp = `                c.fillStyle = '#000'; c.fillRect(this.x-8, y-14, 16, 4);
                c.fillStyle = '#22c55e'; c.fillRect(this.x-7, y-13, 14*Math.max(0, this.hp/this.maxHp), 2);`;

const newHp = `                let hpOffset = (this.tw.type === 'titan' || this.tw.type === 'dragon') ? -25 : -14;
                let hpWidth = (this.tw.type === 'titan' || this.tw.type === 'dragon') ? 32 : 16;
                c.fillStyle = '#000'; c.fillRect(this.x - hpWidth/2, y + hpOffset, hpWidth, 4);
                c.fillStyle = '#22c55e'; c.fillRect(this.x - hpWidth/2 + 1, y + hpOffset + 1, (hpWidth-2)*Math.max(0, this.hp/this.maxHp), 2);`;

code = code.replace(oldHp, newHp);
fs.writeFileSync('index.html', code);
