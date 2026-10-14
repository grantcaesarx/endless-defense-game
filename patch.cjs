const fs = require('fs');
let code = fs.readFileSync('index.html', 'utf8');

// 1. Menu button
const menuBtnStr = `<button onclick="startGame({ defaultMap: true, resume: true })" class="btn-yellow">🔄 RESUME FROM WAVE <span id="resume-wave-display">1</span></button>`;
const newMenuBtn = menuBtnStr + `\n            <button onclick="startGame({ mode: 'ROGUELIKE' })" class="btn-red" style="background:#b91c1c;">🔥 START ROGUELIKE EXPEDITION</button>`;
code = code.replace(menuBtnStr, newMenuBtn);

// 2. CSS
const cssInsert = `
        #ui-game { display: flex; flex-direction: column; height: 100vh; width: 100vw; background: #000; overflow: hidden; }
        #battlefield { flex: 0.72; width: 100%; position: relative; display: flex; justify-content: center; align-items: center; background: #1a1a1a; }
        #battlefield canvas { max-height: 100%; max-width: 100%; object-fit: contain; box-shadow: 0 10px 25px rgba(0,0,0,0.5); }
        #dashboard { flex: 0.28; width: 100%; background: #1e293b; border-top: 4px solid #0f172a; display: flex; padding: 10px; box-sizing: border-box; color: white; user-select: none; }
        .dashboard-left { width: 220px; border-right: 2px solid #334155; padding-right: 15px; display: flex; flex-direction: column; justify-content: center; align-items: center; }
        .dashboard-tray { flex: 1; display: flex; overflow-x: auto; padding-left: 15px; gap: 15px; align-items: center; }
        .item-card { background: #334155; border-radius: 8px; min-width: 180px; max-width: 200px; height: 100%; display: flex; flex-direction: column; padding: 10px; position: relative; box-sizing: border-box; cursor: pointer; border: 2px solid transparent; }
        .item-card:hover { border-color: #3b82f6; }
        .item-card.active { border-color: #22c55e; background: #166534; }
        .item-qty { position: absolute; top: 5px; right: 5px; background: #dc2626; padding: 2px 8px; border-radius: 12px; font-weight: bold; font-size: 14px; box-shadow: 0 2px 4px rgba(0,0,0,0.5); }
        .item-title { font-size: 15px; font-weight: bold; margin-bottom: 4px; text-align: center; }
        .item-desc { font-size: 12px; color: #cbd5e1; text-align: center; flex: 1; }
        .item-buttons { display: flex; justify-content: space-between; margin-top: auto; gap: 6px; }
        .btn-buy { flex: 1; background: #475569; border: none; padding: 6px; border-radius: 4px; cursor: pointer; font-size: 12px; display: flex; align-items: center; justify-content: center; gap: 4px; font-weight: bold; }
        .btn-buy:hover { background: #64748b; }
        .btn-buy.gold { color: #facc15; }
        .btn-buy.gem { color: #38bdf8; }
        .boon-overlay { position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.85); z-index: 1000; display: flex; flex-direction: column; align-items: center; justify-content: center; }
        .boon-cards { display: flex; gap: 20px; margin-top: 30px; }
        .boon-card { background: #1e293b; border: 2px solid #64748b; border-radius: 12px; padding: 20px; width: 280px; text-align: center; cursor: pointer; transition: transform 0.2s, border-color 0.2s; color: white; display: flex; flex-direction: column; gap: 10px; }
        .boon-card:hover { transform: translateY(-10px); border-color: #facc15; }
        .element-banner { position: absolute; top: 50px; left: 50%; transform: translateX(-50%); background: rgba(0,0,0,0.8); padding: 8px 20px; border-radius: 20px; color: white; font-weight: bold; font-size: 20px; border: 2px solid white; z-index: 50; pointer-events: none; }
`;
code = code.replace('</style>', cssInsert + '\n    </style>');

// 3. UI
// Replace ui-game block
const uiGameRegex = /<div id="ui-game" class="hidden">[\s\S]*?<\/div>\s*<\/div>/;
const newUiGame = `<div id="ui-game" class="hidden">
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
code = code.replace(uiGameRegex, newUiGame);

// Add global states
const globalsRegex = /let speed = 1;/;
const newGlobals = `let speed = 1;
        let gameMode = 'DEFAULT'; // 'DEFAULT', 'CUSTOM', 'ROGUELIKE'
        let currentElement = null;
        let rlInventory = { heal: 0, thunder: 0, guards: 0, archers: 0, titan: 0, dragon: 0, warp: 0, nuke: 0 };
        let itemPlacementMode = null;
        let activeBoons = {};
        
        const ELEMENTS_DB = [
            { id: 'Frost', col: '#3b82f6', n: 'Frost (Ice)', desc: '25% Slow Resist' },
            { id: 'Fire', col: '#ef4444', n: 'Fire (Lava)', desc: 'Immune to burn, explodes on death' },
            { id: 'Arcane', col: '#a855f7', n: 'Arcane (Magic)', desc: '50% Magic Resist, Fast' },
            { id: 'Nature', col: '#22c55e', n: 'Nature (Thorns)', desc: 'Regens 2% HP/sec' },
            { id: 'Earth', col: '#78350f', n: 'Earth (Stone)', desc: '60% Phys Armor, Slow' },
            { id: 'Orc', col: '#166534', n: 'Orc Horde', desc: 'Balanced Stats' }
        ];
        
        const BOONS_DB = [
            { id: 'archer_speed', n: '箭术精通', desc: '所有射手塔攻击速度提升 25%' },
            { id: 'mage_shatter', n: '奥术裂解', desc: '魔法塔命中敌人时额外粉碎其 20% 物理护甲，持续 4 秒' },
            { id: 'cannon_crit', n: '高爆引信', desc: '火炮塔爆炸范围增加 35%，对中心目标造成 1.5 倍暴击' },
            { id: 'barracks_buff', n: '钢铁壁垒', desc: '兵营士兵与拦截单位生命值提升 50%，复活时间减半' },
            { id: 'midas_touch', n: '点金律法', desc: '击杀任何敌人额外获得 +2 局内金币' },
            { id: 'hero_cd', n: '过载充能', desc: '英雄技能冷却时间缩短 30%' },
            { id: 'global_frost', n: '全域冰霜', desc: '全场所有敌人的基础移动速度永久降低 15%' },
            { id: 'lethal_snipe', n: '致命狙击', desc: '所有防御塔获得 5% 几率造成 3 倍真实伤害' },
            { id: 'tactical_reserves', n: '战术储备', desc: '立即获得 500 局内金币与 1 颗宝石' },
            { id: 'last_stand', n: '破釜沉舟', desc: '基地生命上限降为 1 点，但全场所有防御塔造成的伤害直接翻倍' }
        ];
        
        const ITEMS_DB = {
            heal: { n: '王室急救补给', desc: '基地恢复+10HP', gold: 500, gem: 1, type: 'instant', icon: '❤️' },
            thunder: { n: '全屏雷霆风暴', desc: '全场雷击连锁伤害', gold: 1000, gem: 2, type: 'instant', icon: '⚡' },
            guards: { n: '重装铁卫方阵', desc: '空降10名重兵阻挡', gold: 1000, gem: 2, type: 'target', icon: '🛡️' },
            archers: { n: '精灵禁卫射手', desc: '部署10名高伤射手', gold: 1000, gem: 2, type: 'target', icon: '🏹' },
            titan: { n: '泰坦远古巨人', desc: '1万血AOE巨石拦截', gold: 1500, gem: 2, type: 'target', icon: '🗿' },
            dragon: { n: '苍穹风暴飞龙', desc: '天空巨龙喷吐压制', gold: 1500, gem: 2, type: 'target', icon: '🐉' },
            warp: { n: '时空折跃门', desc: '将范围敌人传回起点', gold: 1000, gem: 2, type: 'target', icon: '🌀' },
            nuke: { n: '战术氢弹打击', desc: '抹除场上所有生物', gold: 3000, gem: 4, type: 'instant', icon: '☢️' }
        };`;
code = code.replace(globalsRegex, newGlobals);

fs.writeFileSync('index.html', code);
console.log('Done patching basic structure');
