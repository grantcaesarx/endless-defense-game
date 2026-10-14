const fs = require('fs');
let code = fs.readFileSync('index.html', 'utf8');

// #ui-game has min-height: 100vh. Make sure it's actually height: 100vh so flex works correctly
code = code.replace(/#ui-game \{ display: flex; flex-direction: column; min-height: 100vh; width: 100%; background: #000; overflow: visible; position: absolute; inset: 0; \}/, '#ui-game { display: flex; flex-direction: column; height: 100vh; width: 100%; background: #000; overflow: hidden; position: absolute; inset: 0; }');

// Make dashboard flex: 0 0 150px
code = code.replace(/#dashboard \{ flex: 0 0 auto; display: none; width: 100%; min-height: 140px; height: 150px; background: #1e293b; border-top: 4px solid #0f172a; display: flex; padding: 10px; box-sizing: border-box; color: white; user-select: none; flex-wrap: wrap; overflow: hidden; \}/, '#dashboard { flex: 0 0 130px; display: none; width: 100%; background: #1e293b; border-top: 4px solid #0f172a; display: flex; padding: 10px; box-sizing: border-box; color: white; user-select: none; flex-wrap: nowrap; overflow: hidden; }');

fs.writeFileSync('index.html', code);
