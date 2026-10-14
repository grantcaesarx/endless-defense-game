const fs = require('fs');
let code = fs.readFileSync('index.html', 'utf8');

code = code.replace(/canvas \{[^\}]+\}/, 'canvas { width: 100%; height: 100%; display: block; image-rendering: pixelated; cursor: crosshair; touch-action: none; }');
code = code.replace(/#battlefield canvas \{[^\}]+\}/, '');

fs.writeFileSync('index.html', code);
console.log("Canvas CSS fixed");
