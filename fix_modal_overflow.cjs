const fs = require('fs');
let code = fs.readFileSync('index.html', 'utf8');

code = code.replace(/\.modal \{[^\}]+\}/, '.modal { position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); background: #1f2937; border: 4px solid #374151; border-radius: 12px; padding: 30px; display: flex; flex-direction: column; gap: 20px; z-index: 200; box-shadow: 0 20px 40px rgba(0,0,0,0.8); min-width: 400px; max-height: 90vh; overflow-y: auto; color: white; pointer-events: auto; }');
code = code.replace(/\.item-grid \{[^\}]+\}/, '.item-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); gap: 15px; }');

fs.writeFileSync('index.html', code);
