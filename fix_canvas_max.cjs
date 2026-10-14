const fs = require('fs');
let code = fs.readFileSync('index.html', 'utf8');

// The canvas needs aspect ratio constraint in css now
code = code.replace(/canvas \{ max-width: 100%; max-height: 100%; object-fit: contain; display: block; image-rendering: pixelated; cursor: crosshair; touch-action: none; \}/, 'canvas { max-width: 100%; max-height: 100%; aspect-ratio: 4/3; object-fit: contain; display: block; image-rendering: pixelated; cursor: crosshair; touch-action: none; margin: auto; }');

fs.writeFileSync('index.html', code);
