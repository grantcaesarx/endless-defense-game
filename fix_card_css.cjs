const fs = require('fs');
let code = fs.readFileSync('index.html', 'utf8');

// The gap between cards needs to be smaller
code = code.replace(/\.dashboard-tray \{ flex: 1; height: 100%; display: flex; overflow-x: auto; overflow-y: hidden; padding-left: 10px; gap: 8px; align-items: stretch; padding-bottom: 5px; scrollbar-width: thin; \}/, '.dashboard-tray { flex: 1; height: 100%; display: flex; overflow-x: auto; overflow-y: hidden; padding-left: 8px; gap: 8px; align-items: stretch; padding-bottom: 5px; scrollbar-width: thin; }');

// Make dashboard height smaller
code = code.replace(/#dashboard \{ flex: 0 0 130px;/, '#dashboard { flex: 0 0 110px;');

// Reduce card min width
code = code.replace(/\.item-card \{ background: #334155; border-radius: 8px; min-width: 140px; max-width: 160px; height: 100%; justify-content: center; display: flex; flex-direction: column; padding: 10px; position: relative; box-sizing: border-box; cursor: pointer; border: 2px solid transparent; \}/, '.item-card { background: #334155; border-radius: 8px; min-width: 125px; max-width: 145px; height: 100%; justify-content: flex-start; display: flex; flex-direction: column; padding: 8px; position: relative; box-sizing: border-box; cursor: pointer; border: 2px solid transparent; }');

fs.writeFileSync('index.html', code);
