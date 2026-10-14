const fs = require('fs');
let code = fs.readFileSync('index.html', 'utf8');
code = code.replace(`towers.forEach(t => { if(t.type === TOWER.BARRACKS || t.type === 'dragon' || t.type === 'titan' || t.type === 'archers') t.soldiers = []; });`, `towers.forEach(t => { if(t.type === TOWER.BARRACKS || t.type === 'dragon' || t.type === 'titan' || t.type === 'archers' || t.type === 'guards') t.soldiers = []; });`);
fs.writeFileSync('index.html', code);
