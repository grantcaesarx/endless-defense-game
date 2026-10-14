const fs = require('fs');
let code = fs.readFileSync('index.html', 'utf8');

const oldTowerUpdate = `            update() {
                if(this.anim > 0) this.anim--;
                if(this.type === TOWER.BARRACKS) {
                    if(frames % 240 === 0 && !this.branch) { // Basic respawn
                        let d = this.soldiers.find(s => s.state==='DEAD' && !s.isSkel);`;

const newTowerUpdate = `            update() {
                if(this.anim > 0) this.anim--;
                if(this.type === TOWER.BARRACKS || this.type === 'guards' || this.type === 'archers' || this.type === 'titan' || this.type === 'dragon') {
                    if(frames % 240 === 0 && !this.branch) { // Basic respawn
                        let d = this.soldiers.find(s => s.state==='DEAD' && !s.isSkel);`;

code = code.replace(oldTowerUpdate, newTowerUpdate);
fs.writeFileSync('index.html', code);
console.log("Tower update fixed for dummy towers");
