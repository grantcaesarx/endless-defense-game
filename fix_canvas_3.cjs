const fs = require('fs');
let code = fs.readFileSync('index.html', 'utf8');

// The #battlefield needs flex: 1 1 auto; and no max-height to just use the available space minus dashboard.
code = code.replace(/#battlefield \{ flex: 1 1 auto; width: 100%; position: relative; display: flex; justify-content: center; align-items: center; background: #1a1a1a; max-height: calc\(100vh - 150px\); overflow: hidden; \}/, '#battlefield { flex: 1 1 auto; width: 100%; position: relative; display: flex; justify-content: center; align-items: center; background: #1a1a1a; overflow: hidden; }');

fs.writeFileSync('index.html', code);
