const fs = require('fs');
let code = fs.readFileSync('index.html', 'utf8');

// 1. Fix blockCap in triggerTargetItem
const oldTrigger = `                    if(id==='titan') { s.maxHp=10000; s.hp=10000; s.dmg=300; s.range=80; s.aoe=true; s.blockCap=99; }
                    if(id==='dragon') { s.maxHp=10000; s.hp=10000; s.dmg=300; s.range=200; s.type='ranged'; } // Blocks flying conceptually`;

const newTrigger = `                    if(id==='titan') { s.maxHp=10000; s.hp=10000; s.dmg=300; s.range=80; s.aoe=true; s.blockCap=999; }
                    if(id==='dragon') { s.maxHp=10000; s.hp=10000; s.dmg=300; s.range=200; s.type='ranged'; s.blockCap=999; } // Blocks flying conceptually`;
code = code.replace(oldTrigger, newTrigger);

// 2. Fix canBlockFly in Soldier.update
const oldBlockFly = `                    this.bob += 0.2;
                    let canBlockFly = (this.tw.type === 'dragon');`;

const newBlockFly = `                    this.bob += 0.2;
                    let canBlockFly = true; // Both Titan and Dragon block flying`;
code = code.replace(oldBlockFly, newBlockFly);

fs.writeFileSync('index.html', code);
