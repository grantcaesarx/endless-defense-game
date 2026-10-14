const fs = require('fs');
let code = fs.readFileSync('index.html', 'utf8');

const target1 = `if(t.type === ENEMY.FLYING || t.hp<=0) { this.target = null; continue; }`;
const replacement1 = `if((t.type === ENEMY.FLYING && this.tw.type !== 'dragon') || t.hp<=0) { this.target = null; continue; }`;
code = code.replace(target1, replacement1);

const target2 = `this.target.takeDmg(this.dmg, 'phys');`;
const replacement2 = `this.target.takeDmg(this.dmg, 'phys');
if (gameMode === 'ROGUELIKE' && currentElement && currentElement.id === 'Frost' && Math.random() < 0.2) {
    this.frozen = 60; // 1s stun
}`;
code = code.replace(target2, replacement2);

fs.writeFileSync('index.html', code);
console.log("Patched soldier combat logic");
