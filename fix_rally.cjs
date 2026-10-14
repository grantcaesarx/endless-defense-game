const fs = require('fs');
let code = fs.readFileSync('index.html', 'utf8');

const oldRally = `                    if(!this.target && !this.isSkel) {
                        let idx = this.tw.soldiers.indexOf(this);
                        let rx = this.tw.rallyX + (idx===0?-15:(idx===1?15:0));
                        let ry = this.tw.rallyY + (idx===2?-15:10);
                        let d = dist(this.x, this.y, rx, ry);
                        if(d > 2) { this.x += (rx-this.x)/d * 2; this.y += (ry-this.y)/d * 2; }
                    }`;

const newRally = `                    if(!this.target && !this.isSkel) {
                        let idx = this.tw.soldiers.indexOf(this);
                        let rx, ry;
                        if(this.tw.type === 'guards' || this.tw.type === 'archers') {
                            // Spread out 10 units nicely
                            let ang = (Math.PI*2/this.tw.soldiers.length) * idx;
                            let rad = this.tw.type === 'archers' ? 40 : 25;
                            rx = this.tw.rallyX + Math.cos(ang)*rad;
                            ry = this.tw.rallyY + Math.sin(ang)*rad;
                        } else {
                            rx = this.tw.rallyX + (idx===0?-15:(idx===1?15:0));
                            ry = this.tw.rallyY + (idx===2?-15:10);
                        }
                        let d = dist(this.x, this.y, rx, ry);
                        if(d > 2) { this.x += (rx-this.x)/d * 2; this.y += (ry-this.y)/d * 2; }
                    }`;

code = code.replace(oldRally, newRally);
fs.writeFileSync('index.html', code);
