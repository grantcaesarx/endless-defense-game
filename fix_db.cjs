const fs = require('fs');
let code = fs.readFileSync('index.html', 'utf8');

const newGlobals = `
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
        };
`;

if (!code.includes('const ELEMENTS_DB')) {
    code = code.replace(/(let gold = 300.*?;)/, "$1\n" + newGlobals);
}

fs.writeFileSync('index.html', code);
console.log("Injected DBs");
