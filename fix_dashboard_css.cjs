const fs = require('fs');
let code = fs.readFileSync('index.html', 'utf8');

// Shrink dashboard height
code = code.replace(/#dashboard \{[^\}]+\}/, '#dashboard { flex: 0 0 auto; display: none; width: 100%; min-height: 140px; height: 150px; background: #1e293b; border-top: 4px solid #0f172a; display: flex; padding: 10px; box-sizing: border-box; color: white; user-select: none; flex-wrap: wrap; overflow: hidden; }');

// Adjust item card to be more compact
code = code.replace(/\.item-card \{ background: #334155; border-radius: 8px; min-width: 180px; max-width: 200px; height: 100%;/, '.item-card { background: #334155; border-radius: 8px; min-width: 150px; max-width: 170px; height: 100%; justify-content: center;');

// Make desc take less space, center everything
code = code.replace(/\.item-desc \{ font-size: 12px; color: #cbd5e1; text-align: center; flex: 1; \}/, '.item-desc { font-size: 11px; color: #cbd5e1; text-align: center; margin-bottom: 8px; }');
code = code.replace(/\.item-title \{ font-size: 15px; font-weight: bold; margin-bottom: 4px; text-align: center; \}/, '.item-title { font-size: 14px; font-weight: bold; margin-bottom: 4px; text-align: center; margin-top: auto; }');

// Make dashboard tray hide scrollbar but still scrollable
code = code.replace(/\.dashboard-tray \{ flex: 1; display: flex; overflow-x: auto; padding-left: 15px; gap: 15px; align-items: center; \}/, '.dashboard-tray { flex: 1; display: flex; overflow-x: auto; overflow-y: hidden; padding-left: 15px; gap: 15px; align-items: center; padding-bottom: 5px; scrollbar-width: thin; }');

fs.writeFileSync('index.html', code);
console.log("Dashboard UI optimized");
