const fs = require('fs');
let code = fs.readFileSync('index.html', 'utf8');

const oldSpawn = `        function spawnEnemy() {
            let type = ENEMY.LIGHT, r = Math.random();
            if(wave > 2 && r < 0.35) type = ENEMY.HEAVY;
            if(wave > 3 && r > 0.7) type = ENEMY.MAGIC;
            if(wave > 4 && r > 0.4 && r < 0.6) type = ENEMY.FLYING;
            if(wave % 5 === 0 && waveData.spawned === waveData.toSpawn - 1) type = ENEMY.BOSS; // Boss is always last in mod 5 waves
            let baseHp = 40, spd = 1.0, rw = 5 + Math.floor(wave*0.5), rad = 14, col = '#84cc16';
            if(type === ENEMY.HEAVY) { baseHp*=2.5; spd*=0.7; col='#475569'; rad=18; rw*=1.5; }
            else if(type === ENEMY.MAGIC) { baseHp*=1.2; spd*=0.9; col='#c084fc'; rw*=1.2; }
            else if(type === ENEMY.FLYING) { baseHp*=0.7; spd*=1.3; col='#94a3b8'; rad=12; }
            else if(type === ENEMY.BOSS) { baseHp*=20; spd*=0.45; col='#7f1d1d'; rad=28; rw*=20; document.getElementById('boss-hp-container').classList.remove('hidden'); document.getElementById('boss-name').innerText = \`WAVE \${wave} BOSS\`; addShake(30); }
            
            rw = Math.floor(rw);
            let mobHp = baseHp * Math.pow(1.15, wave - 1);
            if(wave <= 3) mobHp *= 0.6; // Weaken early waves
            else if(wave === resumedWave) mobHp *= 0.3; // Much weaker enemies on first resume wave
            enemies.push(new Enemy(type, mobHp, spd, rw, rad, col));
        }`;

const newSpawn = `        function spawnEnemy() {
            let type = ENEMY.LIGHT, r = Math.random();
            if(wave > 2 && r < 0.35) type = ENEMY.HEAVY;
            if(wave > 3 && r > 0.7) type = ENEMY.MAGIC;
            if(wave > 4 && r > 0.4 && r < 0.6) type = ENEMY.FLYING;
            if (gameMode === 'ROGUELIKE' && wave === 10 && waveData.spawned === waveData.toSpawn - 1) type = ENEMY.BOSS;
            else if (gameMode !== 'ROGUELIKE' && wave % 5 === 0 && waveData.spawned === waveData.toSpawn - 1) type = ENEMY.BOSS;
            
            let baseHp = 40, spd = 1.0, rw = 5 + Math.floor(wave*0.5), rad = 14, col = '#84cc16';
            if(type === ENEMY.HEAVY) { baseHp*=2.5; spd*=0.7; col='#475569'; rad=18; rw*=1.5; }
            else if(type === ENEMY.MAGIC) { baseHp*=1.2; spd*=0.9; col='#c084fc'; rw*=1.2; }
            else if(type === ENEMY.FLYING) { baseHp*=0.7; spd*=1.3; col='#94a3b8'; rad=12; }
            else if(type === ENEMY.BOSS) { baseHp*=20; spd*=0.45; col='#7f1d1d'; rad=28; rw*=20; document.getElementById('boss-hp-container').classList.remove('hidden'); document.getElementById('boss-name').innerText = gameMode === 'ROGUELIKE' ? \`\${currentElement.id.toUpperCase()} LORD\` : \`WAVE \${wave} BOSS\`; addShake(30); }
            
            rw = Math.floor(rw);
            let mobHp = baseHp * Math.pow(1.15, wave - 1);
            if(wave <= 3) mobHp *= 0.6; // Weaken early waves
            else if(wave === resumedWave) mobHp *= 0.3; // Much weaker enemies on first resume wave
            
            if (gameMode === 'ROGUELIKE') { mobHp *= 1.2; } // Roguelike is harder
            
            enemies.push(new Enemy(type, mobHp, spd, rw, rad, col));
        }`;
code = code.replace(oldSpawn, newSpawn);

fs.writeFileSync('index.html', code);
console.log("Patched spawnEnemy");
