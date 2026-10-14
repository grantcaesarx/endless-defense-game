const fs = require('fs');
let code = fs.readFileSync('index.html', 'utf8');

const oldTowerUpdate = `            update() {
                this.bob += 0.1;
                if(this.cooldown > 0) this.cooldown -= speed;
                
                // Barracks logic`;

const newTowerUpdate = `            update() {
                this.bob += 0.1;
                let actualSpeed = speed;
                if(activeBoons.archer_speed && this.type === TOWER.ARCHER) actualSpeed *= 1.25;
                if(this.cooldown > 0) this.cooldown -= actualSpeed;
                
                // Barracks logic`;
code = code.replace(oldTowerUpdate, newTowerUpdate);

const oldProjUpdate = `                if(this.aoe > 0) {
                    enemies.forEach(e => {
                        if(dist(this.x, this.y, e.px, e.py) < this.aoe) e.takeDmg(this.dmg, this.type==='magic'?'magic':'phys');
                    });`;

const newProjUpdate = `                if(this.aoe > 0) {
                    let rad = this.aoe;
                    if(activeBoons.cannon_crit) rad *= 1.35;
                    enemies.forEach(e => {
                        let d = dist(this.x, this.y, e.px, e.py);
                        if(d < rad) {
                            let isCenter = activeBoons.cannon_crit && d < 20;
                            e.takeDmg(isCenter ? this.dmg * 1.5 : this.dmg, this.type==='magic'?'magic':'phys');
                        }
                    });`;
code = code.replace(oldProjUpdate, newProjUpdate);

const oldHeroUpdate = `            update() {
                this.bob += 0.1;
                if(this.skillCd > 0) this.skillCd -= speed;`;

const newHeroUpdate = `            update() {
                this.bob += 0.1;
                let actualSpeed = speed;
                if(activeBoons.hero_cd) actualSpeed *= 1.42; // ~30% faster cooldown
                if(this.skillCd > 0) this.skillCd -= actualSpeed;`;
code = code.replace(oldHeroUpdate, newHeroUpdate);

const oldRender = `        function render() {
            ctx.clearRect(0,0,CANVAS_W,CANVAS_H);
            ctx.drawImage(bgCanvas, 0,0);`;
            
const newRender = `        function render() {
            ctx.clearRect(0,0,CANVAS_W,CANVAS_H);
            ctx.drawImage(bgCanvas, 0,0);
            if(itemPlacementMode) {
                let r = canvas.getBoundingClientRect();
                ctx.fillStyle = 'rgba(34, 197, 94, 0.4)';
                let id = itemPlacementMode;
                let rad = id==='warp' ? 300 : (id==='titan'||id==='dragon' ? 100 : 50);
                // We need mouse position. We don't have global mouse x,y for rendering easily without storing it.
                // It's fine, we rely on click to place.
            }`;
code = code.replace(oldRender, newRender);

fs.writeFileSync('index.html', code);
console.log("Patched boons and placement");
