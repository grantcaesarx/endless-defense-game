const fs = require('fs');
let code = fs.readFileSync('index.html', 'utf8');
code = code.replace(`hp = Math.min(20, hp + 10);`, `let maxH = activeBoons.last_stand ? 1 : 20; hp = Math.min(maxH, hp + 10);`);
fs.writeFileSync('index.html', code);
