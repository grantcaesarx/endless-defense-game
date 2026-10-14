const fs = require('fs');
let code = fs.readFileSync('index.html', 'utf8');

// 1. Fix generateRoguelikeMap
code = code.replace(/m\.grid\[curR\]\[curC\] = 2; \/\/ START/g, 'm.grid[curR][curC] = 3; // START');
code = code.replace(/m\.grid\[curR\]\[curC\] = 3; \/\/ END/g, 'm.grid[curR][curC] = 4; // END');
code = code.replace(/if\(hasPath\) \{ m\.grid\[r\]\[c\] = 4; slots\+\+; \}/g, 'if(hasPath) { m.grid[r][c] = 2; slots++; }');

// 2. Fix the dangling old UI code (remove lines between `</div>` after new ui-game and `<script>`)
const danglingRegex = /<div id="ui-game"[\s\S]*?<\/div>\s*<\/div>\s*<\/div>(\s*<div style="display:flex; gap:10px;">[\s\S]*?<!-- Context \/ Ring Menu -->\s*<div id="ring-menu"><\/div>\s*<\/div>\s*<\/div>)/;
const match = code.match(danglingRegex);
if(match && match[1]) {
    code = code.replace(match[1], '');
} else {
    console.log("Could not find dangling UI block. Falling back to targeted replace.");
    code = code.replace(/<div style="display:flex; gap:10px;">[\s\S]*?<!-- Context \/ Ring Menu -->\s*<div id="ring-menu"><\/div>\s*<\/div>\s*<\/div>/, '');
}

// 3. Inject btn-extract-gold back into the new UI
code = code.replace(
    /<button id="btn-auto-wave"/,
    `<button id="btn-extract-gold" onclick="extractGold()" style="background:#eab308; color:white; border:none; padding:4px 10px; border-radius:4px; cursor:pointer; font-weight:bold;">💰 EXTRACT (0/3000)</button>
                    <button id="btn-auto-wave"`
);

// 4. Fix scrolling and responsiveness
// Allow body to scroll
code = code.replace(
    /body, html \{ margin: 0; padding: 0; width: 100%; height: 100%; background: #000; color: #fff; font-family: 'Segoe UI', Tahoma, sans-serif; overflow: hidden; touch-action: none; user-select: none; -webkit-user-select: none; display: flex; align-items: center; justify-content: center; \}/,
    `body, html { margin: 0; padding: 0; width: 100%; min-height: 100%; background: #000; color: #fff; font-family: 'Segoe UI', Tahoma, sans-serif; overflow-y: auto; overflow-x: hidden; touch-action: auto; user-select: none; -webkit-user-select: none; display: flex; align-items: flex-start; justify-content: center; }`
);

// Make game wrapper scrollable if needed
code = code.replace(
    /#game-wrapper \{ position: relative; width: 100vw; height: 75vw; max-width: 1024px; max-height: 768px; background: #000; box-shadow: 0 0 30px rgba\(0,0,0,1\); overflow: hidden; display: flex; justify-content: center; align-items: flex-end; \}/,
    `#game-wrapper { position: relative; width: 100%; min-height: 100vh; max-width: 1024px; background: #000; box-shadow: 0 0 30px rgba(0,0,0,1); overflow: visible; display: flex; flex-direction: column; align-items: center; justify-content: flex-start; }`
);

// Remove the min-aspect-ratio lock
code = code.replace(/@media \(min-aspect-ratio: 4\/3\) \{ #game-wrapper \{ width: 133\.33vh; height: 100vh; \} \}/,
    `@media (min-aspect-ratio: 4/3) { #game-wrapper { width: 100%; min-height: 100vh; } }`
);

// Fix #ui-game to fill wrapper
code = code.replace(
    /#ui-game \{ display: flex; flex-direction: column; height: 100vh; width: 100vw; background: #000; overflow: hidden; \}/,
    `#ui-game { display: flex; flex-direction: column; min-height: 100vh; width: 100%; background: #000; overflow: visible; position: absolute; inset: 0; }`
);

// Ensure battlefield flex is fixed so it doesn't squish canvas
code = code.replace(
    /#battlefield \{ flex: 0\.72; width: 100%; position: relative; display: flex; justify-content: center; align-items: center; background: #1a1a1a; \}/,
    `#battlefield { flex: 0 0 auto; width: 100%; height: auto; aspect-ratio: 4/3; position: relative; display: flex; justify-content: center; align-items: center; background: #1a1a1a; max-height: 75vh; }`
);

// Make dashboard take remaining space
code = code.replace(
    /#dashboard \{ flex: 0\.28; width: 100%; background: #1e293b; border-top: 4px solid #0f172a; display: flex; padding: 10px; box-sizing: border-box; color: white; user-select: none; \}/,
    `#dashboard { flex: 1 0 auto; width: 100%; min-height: 250px; background: #1e293b; border-top: 4px solid #0f172a; display: flex; padding: 10px; box-sizing: border-box; color: white; user-select: none; flex-wrap: wrap; }`
);

fs.writeFileSync('index.html', code);
console.log("Fixes applied");
