const fs = require('fs');
let code = fs.readFileSync('index.html', 'utf8');

// The #battlefield needs flex: 1 1 0; and height: 0; 
code = code.replace(/#battlefield \{ flex: 1 1 auto; width: 100%; position: relative; display: flex; justify-content: center; align-items: center; background: #1a1a1a; overflow: hidden; \}/, '#battlefield { flex: 1 1 0; height: 0; width: 100%; position: relative; display: flex; justify-content: center; align-items: center; background: #1a1a1a; overflow: hidden; }');

// Make dashboard tray fill height fully
code = code.replace(/\.dashboard-tray \{ flex: 1; display: flex; overflow-x: auto; overflow-y: hidden; padding-left: 15px; gap: 15px; align-items: center; padding-bottom: 5px; scrollbar-width: thin; \}/, '.dashboard-tray { flex: 1; height: 100%; display: flex; overflow-x: auto; overflow-y: hidden; padding-left: 15px; gap: 15px; align-items: stretch; padding-bottom: 5px; scrollbar-width: thin; }');

// Make card more horizontal centered
code = code.replace(/\.item-card \{ background: #334155; border-radius: 8px; min-width: 150px; max-width: 170px; height: 100%; justify-content: center; display: flex; flex-direction: column; padding: 10px; position: relative; box-sizing: border-box; cursor: pointer; border: 2px solid transparent; \}/, '.item-card { background: #334155; border-radius: 8px; min-width: 140px; max-width: 160px; height: 100%; justify-content: center; display: flex; flex-direction: column; padding: 10px; position: relative; box-sizing: border-box; cursor: pointer; border: 2px solid transparent; }');

fs.writeFileSync('index.html', code);
