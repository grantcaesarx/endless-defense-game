const fs = require('fs');
let code = fs.readFileSync('index.html', 'utf8');

code = code.replace(/<canvas id="gameCanvas"[^>]*><\/canvas>/g, '');
code = code.replace(/<div id="battlefield"[^>]*>/, '$&\n        <canvas id="gameCanvas" width="1024" height="768"></canvas>');

fs.writeFileSync('index.html', code);
console.log("Canvas deduplicated");
