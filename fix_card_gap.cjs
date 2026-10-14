const fs = require('fs');
let code = fs.readFileSync('index.html', 'utf8');

// The gap between cards needs to be smaller
code = code.replace(/\.dashboard-tray \{ flex: 1; height: 100%; display: flex; overflow-x: auto; overflow-y: hidden; padding-left: 15px; gap: 15px; align-items: stretch; padding-bottom: 5px; scrollbar-width: thin; \}/, '.dashboard-tray { flex: 1; height: 100%; display: flex; overflow-x: auto; overflow-y: hidden; padding-left: 10px; gap: 8px; align-items: stretch; padding-bottom: 5px; scrollbar-width: thin; }');

fs.writeFileSync('index.html', code);
