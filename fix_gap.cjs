const fs = require('fs');
let code = fs.readFileSync('index.html', 'utf8');

// Fix menu top gap
code = code.replace(/justify-content: flex-start; padding-top: 15vh;/, 'justify-content: center;');

// Fix battlefield and canvas sizing
// Remove max-height: 80vh from battlefield to let it naturally size to the canvas
code = code.replace(/max-height:80vh;/, '');
// Ensure canvas fits the battlefield perfectly
code = code.replace(/max-height: calc\(100% - 75px\);/, '');

fs.writeFileSync('index.html', code);
console.log("Gaps fixed");
