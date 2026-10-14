const fs = require('fs');
let code = fs.readFileSync('index.html', 'utf8');

const uiGameRegex = /<div id="ui-game" class="screen hidden pointer-events-none">[\s\S]*?<\/div>\s*<\/div>/;
const newUiGame = `<div id="ui-game" class="screen hidden pointer-events-none">
        <div id="battlefield">
            <div id="hud-bar" style="position: absolute; top:0; left:0; width:100%; background: rgba(0,0,0,0.8); color: white; padding: 10px 15px; display: flex; justify-content: space-between; z-index: 20; box-sizing: border-box; font-size: 18px;">
                <div>❤️ <span id="hud-hp">20</span>/20 &nbsp; 💰 <span id="hud-gold">350</span> &nbsp; 💎 <span id="hud-meta-gems">0</span> &nbsp; <span id="wave-text">🌊 Wave <span id="hud-wave">1</span></span></div>
                <div style="display: flex; gap: 10px; align-items: center;">
                    <button id="btn-auto-wave" onclick="toggleAuto()" style="padding: 4px 10px; border-radius:4px; border:none; cursor:pointer; font-weight:bold;">🤖 AUTO SWARM: OFF</button>
                    <button id="btn-swarm" class="hidden" onclick="triggerSwarm()" style="background:#ef4444; color:white; border:none; padding:4px 10px; border-radius:4px; cursor:pointer; font-weight:bold;">🔥 SWARM NOW</button>
                    <button id="btn-next-wave" onclick="startWave()" style="background:#22c55e; color:white; border:none; padding:4px 10px; border-radius:4px; cursor:pointer; font-weight:bold;">▶️ START WAVE</button>
                    <div style="background: rgba(255,255,255,0.2); padding: 4px 10px; border-radius: 4px; font-weight: bold; cursor: pointer;" onclick="toggleSpeed()">⏩ <span id="hud-speed">1x</span></div>
                    <button onclick="togglePause()" style="background:none; border:none; color:white; font-size:22px; cursor:pointer;">⏸️</button>
                    <button onclick="backToMenu()" style="background:#dc2626; color:white; border:none; padding:4px 10px; border-radius:4px; cursor:pointer; font-weight:bold;">EXIT</button>
                </div>
            </div>
            <div id="element-display" class="element-banner hidden"></div>
            <canvas id="gameCanvas" width="1024" height="768"></canvas>
            
            <!-- Boss HP Overlay -->
            <div id="boss-hp-container" class="hidden" style="position:absolute; top:80px; left:50%; transform:translateX(-50%); width:60%; z-index:30;">
                <div id="boss-name" style="text-align:center; color:#f87171; font-weight:bold; font-size:24px; text-shadow:0 2px 4px #000; margin-bottom:5px;">WAVE 10 BOSS</div>
                <div style="width:100%; height:20px; background:#111; border:3px solid #444; border-radius:10px; overflow:hidden;">
                    <div id="boss-hp-bar" style="width:100%; height:100%; background:linear-gradient(90deg, #dc2626, #f87171); transition:width 0.2s;"></div>
                </div>
            </div>
            
            <div id="ring-menu"></div>
            <button id="btn-add-slot" onclick="toggleAddSlot()" style="position: absolute; bottom: 20px; left: 20px; z-index: 10; padding: 10px 20px; font-size: 16px; border-radius: 8px; border: none; background: #8b5cf6; color: white; cursor: pointer; font-weight: bold; box-shadow: 0 4px 6px rgba(0,0,0,0.3); display: none;">🏗️ ADD SLOT</button>
            <div id="boon-container" class="boon-overlay hidden">
                <h1 style="color: #facc15; text-shadow: 0 2px 4px rgba(0,0,0,0.5); font-size: 36px; margin: 0;">CHOOSE A BOON</h1>
                <p style="color: #cbd5e1; font-size: 18px; margin-top: 10px;">End of wave rewards for your expedition.</p>
                <div id="boon-cards" class="boon-cards"></div>
            </div>
        </div>
        <div id="dashboard">
            <div class="dashboard-left">
                <div style="font-size: 48px; margin-bottom: 5px;" id="dash-hero-icon">🏹</div>
                <div style="font-weight: bold; font-size: 18px; color: #facc15;" id="dash-hero-name">Archer</div>
                <div style="font-size: 14px; color: #cbd5e1; margin-bottom: 10px;">Level <span id="dash-hero-lvl">1</span></div>
                <div style="width: 100%; height: 8px; background: #0f172a; border-radius: 4px; overflow: hidden; margin-bottom: 10px;">
                    <div id="dash-hero-xp" style="height: 100%; background: #3b82f6; width: 0%;"></div>
                </div>
            </div>
            <div class="dashboard-tray" id="item-tray"></div>
        </div>
    </div>`;

if (uiGameRegex.test(code)) {
    code = code.replace(uiGameRegex, newUiGame);
    fs.writeFileSync('index.html', code);
    console.log("Injected UI game");
} else {
    console.log("Failed to match uiGameRegex");
}
