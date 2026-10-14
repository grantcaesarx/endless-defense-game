const fs = require('fs');
let code = fs.readFileSync('index.html', 'utf8');

// 1. Remove the rogue second canvas inside ui-game
code = code.replace(/<canvas id="gameCanvas" width="1024" height="768"><\/canvas>/g, '');

// 2. We need to put the first canvas back, but wrap it in #battlefield and put the screens over it.
// Wait, rather than trying to parse all the screens, let's just make `ui-game` transparent and not contain `#battlefield`.
// Currently ui-game contains `#battlefield` and `#dashboard`.
// Let's rip `#battlefield` out of `ui-game`.

code = code.replace(/<div id="ui-game" class="screen hidden pointer-events-auto">\s*<div id="battlefield">/, '<div id="ui-game" class="screen hidden pointer-events-auto" style="background:transparent; pointer-events:none;">');
code = code.replace(/<\/div>\s*<div id="dashboard">/, '</div></div><div id="dashboard">');

// Now, what about the FIRST canvas at line 119? We want to put it inside a battlefield container that wraps it and ALL screens.
code = code.replace(/<div id="game-wrapper">\s*<!-- Main Menu -->/, '<div id="game-wrapper"><canvas id="gameCanvas" width="1024" height="768"></canvas><!-- Main Menu -->');
// Wait, the first canvas is ALREADY at line 119: `<div id="game-wrapper">\n        <!-- Main Menu -->` NO wait:
// 118:    <div id="game-wrapper">
// 119:        <!-- Main Menu -->

code = code.replace(/<div id="game-wrapper">/, `<div id="game-wrapper">
    <div id="battlefield" style="position:relative; width:100%; aspect-ratio:4/3; max-height:80vh; display:flex; justify-content:center; align-items:center; background:#1a1a1a;">
        <canvas id="gameCanvas" width="1024" height="768"></canvas>`);
        
// Close the battlefield div before dashboard
code = code.replace(/<div id="dashboard">/, `</div><!-- end battlefield -->\n        <div id="dashboard">`);

// 3. Fix CSS for screen
code = code.replace(/\.screen:not\(\.hidden\) \{ position: relative !important; width: 100%; flex: 1 0 auto; min-height: 100vh; \}/, '');
code = code.replace(/\.screen \{ position: absolute; inset: 0; display: flex; flex-direction: column; z-index: 10; transition: opacity 0\.3s; \}/, '.screen { position: absolute; top: 0; left: 0; right: 0; bottom: 0; display: flex; flex-direction: column; z-index: 10; transition: opacity 0.3s; pointer-events: none; } .screen > * { pointer-events: auto; }');

// Make sure ui-main-menu has a background so it covers the canvas
code = code.replace(/#ui-main-menu \{ background: rgba\(0,0,0,0\.85\);/, '#ui-main-menu { background: rgba(0,0,0,0.85); position: absolute; inset: 0; width: 100%; height: 100%;');

// Make dashboard flex
code = code.replace(/#dashboard \{ flex: 1 0 auto;/, '#dashboard { flex: 1 0 auto; display: none;');

fs.writeFileSync('index.html', code);
console.log("Layout restructured");
