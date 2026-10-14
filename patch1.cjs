const fs = require('fs');
let code = fs.readFileSync('index.html', 'utf8');

// Globals
code = code.replace(
    /let resumedWave = null;/,
    "let resumedWave = null;\n        let scenery = [];"
);

// Particle class
code = code.replace(
    /class Particle \{[\s\S]*?update\(\) \{[\s\S]*?draw\(c\) \{[\s\S]*?\}\n        \}\n/m,
    `class Particle {
            constructor(x, y, col, speed, dur, r=3) {
                this.x = x; this.y = y; this.col = col; this.r = r;
                let a = rand(0, Math.PI*2); this.vx = Math.cos(a)*speed; this.vy = Math.sin(a)*speed;
                this.life = dur; this.maxL = dur;
                this.g = 0;
            }
            update() { this.x+=this.vx; this.y+=this.vy; this.vy+=this.g; this.vx*=0.92; if(this.g===0) this.vy*=0.92; else this.vy*=0.98; this.life--; }
            draw(c) { c.globalAlpha = Math.max(0, this.life/this.maxL); c.fillStyle = this.col; c.beginPath(); c.arc(this.x, this.y, this.r, 0, Math.PI*2); c.fill(); c.globalAlpha = 1; }
        }
`
);

fs.writeFileSync('index.html', code);
