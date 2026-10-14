const fs = require('fs');
let code = fs.readFileSync('index.html', 'utf8');

code = code.replace(
    /\.screen \{ position: absolute; inset: 0; display: flex; flex-direction: column; z-index: 10; transition: opacity 0\.3s; \}/,
    `.screen { position: absolute; inset: 0; display: flex; flex-direction: column; z-index: 10; transition: opacity 0.3s; }
        .screen:not(.hidden) { position: relative !important; width: 100%; flex: 1 0 auto; min-height: 100vh; }`
);

fs.writeFileSync('index.html', code);
console.log("Fixed screen position");
