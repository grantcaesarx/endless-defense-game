const fs = require('fs');
let code = fs.readFileSync('index.html', 'utf8');

// Ensure battlefield has flex: 1 1 auto to take up remaining space if needed
code = code.replace(/#battlefield \{ flex: 0 0 auto; width: 100%; height: auto; aspect-ratio: 4\/3; position: relative; display: flex; justify-content: center; align-items: center; background: #1a1a1a; max-height: 75vh; \}/, '#battlefield { flex: 1 1 auto; width: 100%; position: relative; display: flex; justify-content: center; align-items: center; background: #1a1a1a; max-height: calc(100vh - 150px); overflow: hidden; }');

// Make canvas max-height 100% and max-width 100% and aspect ratio preserved
code = code.replace(/canvas \{ width: 100%; height: 100%; display: block; image-rendering: pixelated; cursor: crosshair; touch-action: none; \}/, 'canvas { max-width: 100%; max-height: 100%; object-fit: contain; display: block; image-rendering: pixelated; cursor: crosshair; touch-action: none; }');

fs.writeFileSync('index.html', code);
