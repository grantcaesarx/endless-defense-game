const fs = require('fs');
let code = fs.readFileSync('index.html', 'utf8');

const oldSoldier = `            constructor(tw, x, y, isSkel=false) {
                this.tw = tw; this.x = x; this.y = y; this.isSkel = isSkel;
                let lvl = tw.tier;
                this.maxHp = isSkel ? 80 : (50 + 40*lvl); 
                if(tw.branch==='A') this.maxHp = 250; // Paladin
                
                // Hero Bonus
                if(activeHero === 'paladin' && !isSkel) this.maxHp *= (1 + 0.2*heroes.paladin.level);
                
                this.hp = this.maxHp;
                this.dmg = isSkel ? 10 : (5 + 5*lvl);
                if(tw.branch==='B') this.dmg = 30; // Barbarian
                
                this.target = null; this.state = 'MOVE'; this.revived = false;
                this.bob = rand(0,10);
            }`;

const newSoldier = `            constructor(tw, x, y, isSkel=false) {
                this.tw = tw; this.x = x; this.y = y; this.isSkel = isSkel;
                let lvl = tw.tier || 1;
                this.maxHp = isSkel ? 80 : (50 + 40*lvl); 
                if(tw.branch==='A') this.maxHp = 250; // Paladin
                if(tw.type === 'guards') this.maxHp = 1000;
                if(tw.type === 'archers') this.maxHp = 500;
                if(tw.type === 'titan') this.maxHp = 10000;
                if(tw.type === 'dragon') this.maxHp = 10000;
                
                // Hero Bonus
                if(activeHero === 'paladin' && !isSkel) this.maxHp *= (1 + 0.2*heroes.paladin.level);
                if(activeBoons.barracks_buff) this.maxHp *= 1.5;
                
                this.hp = this.maxHp;
                this.dmg = isSkel ? 10 : (5 + 5*lvl);
                if(tw.branch==='B') this.dmg = 30; // Barbarian
                if(tw.type === 'guards') this.dmg = 100;
                if(tw.type === 'archers') this.dmg = 50;
                if(tw.type === 'titan') this.dmg = 300;
                if(tw.type === 'dragon') this.dmg = 300;
                
                this.type = (tw.type === 'archers' || tw.type === 'dragon') ? 'ranged' : 'melee';
                this.range = this.type === 'ranged' ? 200 : 30;
                
                this.target = null; this.state = 'MOVE'; this.revived = false;
                this.bob = rand(0,10);
                this.frozen = 0;
                this.atkTimer = 0;
            }`;
code = code.replace(oldSoldier, newSoldier);

fs.writeFileSync('index.html', code);
console.log("Patched soldier constructor");
