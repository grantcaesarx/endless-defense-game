const fs = require('fs');
let code = fs.readFileSync('index.html', 'utf8');

const target1 = `if(this.type === 'archer') projs.push(new Projectile(this.x, this.y-10, tgt, this.dmg, 'arrow', {tier:1}));`;
const replace1 = `let finalDmg = activeBoons.last_stand ? this.dmg * 2 : this.dmg;
                        if(this.type === 'archer') projs.push(new Projectile(this.x, this.y-10, tgt, finalDmg, 'arrow', {tier:1}));`;
code = code.replace(target1, replace1);

const target2 = `enemies.forEach(e => { if(dist(e.px, e.py, tgt.px, tgt.py) < 60) e.takeDmg(this.dmg, 'magic'); });`;
const replace2 = `enemies.forEach(e => { if(dist(e.px, e.py, tgt.px, tgt.py) < 60) e.takeDmg(finalDmg, 'magic'); });`;
code = code.replace(target2, replace2);

const target3 = `tgt.takeDmg(this.dmg, 'phys');`;
const replace3 = `tgt.takeDmg(finalDmg, 'phys');`;
code = code.replace(target3, replace3);

fs.writeFileSync('index.html', code);
console.log("Patched hero damage");
