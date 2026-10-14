const fs = require('fs');
let code = fs.readFileSync('index.html', 'utf8');

code = code.replace(/document\.getElementById\('item-dynamite-count'\)\.innerText = items\.dynamite;\s*/, '');
code = code.replace(/document\.getElementById\('item-freeze-count'\)\.innerText = items\.freeze;\s*/, '');

fs.writeFileSync('index.html', code);
console.log("Dynamite text error fixed");
