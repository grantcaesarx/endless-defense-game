const fs = require('fs');
let code = fs.readFileSync('index.html', 'utf8');

// Replace the CSS
code = code.replace(
  '#boss-hp-container { position: absolute; bottom: 20px; left: 50%; transform: translateX(-50%); width: 60%; max-width: 400px; background: rgba(17,17,17,0.85); border: 3px solid #555; border-radius: 10px; padding: 3px; z-index: 20; box-shadow: 0 5px 15px rgba(0,0,0,0.8); transition: opacity 0.3s; pointer-events: none; }',
  '#boss-hp-container { position: absolute; top: 80px; left: 50%; transform: translateX(-50%); width: 60%; max-width: 400px; background: rgba(17,17,17,0.85); border: 3px solid #555; border-radius: 10px; padding: 3px; z-index: 20; box-shadow: 0 5px 15px rgba(0,0,0,0.8); transition: opacity 0.3s; pointer-events: none; }'
);

// Replace the inline style so there's no conflict, just rely on CSS
code = code.replace(
  '<div id="boss-hp-container" class="hidden" style="position:absolute; top:80px; left:50%; transform:translateX(-50%); width:60%; z-index:30;">',
  '<div id="boss-hp-container" class="hidden">'
);

fs.writeFileSync('index.html', code);
