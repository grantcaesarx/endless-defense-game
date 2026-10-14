const fs = require('fs');
let code = fs.readFileSync('index.html', 'utf8');

code = code.replace(/#ui-main-menu \{ [^\}]+\}/, '#ui-main-menu { background: rgba(0,0,0,0.85); position: absolute; inset: 0; width: 100%; height: 100%; align-items: center; justify-content: flex-start; padding-top: 15vh; gap: 20px; z-index: 50; box-sizing: border-box; overflow-y: auto; }');

fs.writeFileSync('index.html', code);
console.log("Menu fixed");
