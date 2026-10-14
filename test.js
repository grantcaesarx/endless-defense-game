    
        // ==========================================
        // 1. CONSTANTS & CONFIGURATION
        // ==========================================
        const TILE_SIZE = 64, COLS = 16, ROWS = 12;
        const CANVAS_W = COLS * TILE_SIZE, CANVAS_H = ROWS * TILE_SIZE;
        const CELL = { EMPTY: 0, PATH: 1, SLOT: 2, START: 3, END: 4 };
        const TOWER = { ARCHER: 1, MAGE: 2, CANNON: 3, BARRACKS: 4 };
        const ENEMY = { LIGHT: 1, HEAVY: 2, MAGIC: 3, FLYING: 4, BOSS: 5 };
        
        // Base Stats (Tier 1)
        const TOWER_STATS = {
            [TOWER.ARCHER]: { n: 'Archer', cost: 70, col: '#facc15', r: 160, cd: 30, dmg: 10, type: 'phys' },
            [TOWER.MAGE]:   { n: 'Mage', cost: 100, col: '#a855f7', r: 180, cd: 60, dmg: 35, type: 'magic' },
            [TOWER.CANNON]: { n: 'Cannon', cost: 130, col: '#9ca3af', r: 140, cd: 100, dmg: 45, type: 'aoe' },
            [TOWER.BARRACKS]:{ n: 'Barracks', cost: 100, col: '#ea580c', r: 120, cd: 0, dmg: 0, type: 'barracks' }
        };

        // Branching Data (Tier 4)
        const BRANCHES = {
            [TOWER.ARCHER]: {
                A: { n: 'Ranger', cost: 250, desc: 'Poison DOT (Dmg x1.5, Fast)', r: 220, cd: 20, dmg: 25, type: 'phys' },
                B: { n: 'Musketeer', cost: 280, desc: 'Sniper (Dmg x6, Range+)', r: 250, cd: 80, dmg: 120, type: 'phys' }
            },
            [TOWER.MAGE]: {
                A: { n: 'Death Ray', cost: 300, desc: 'Laser (Low Dmg, Ultra Fast)', r: 200, cd: 5, dmg: 2, type: 'magic' }, // Beam hits every 5 frames
                B: { n: 'Necromancer', cost: 280, desc: 'Summon Skeletons (Block)', r: 180, cd: 50, dmg: 60, type: 'magic' }
            },
            [TOWER.CANNON]: {
                A: { n: 'Missile', cost: 350, desc: 'Global Range, High CD', r: 2000, cd: 150, dmg: 150, type: 'aoe' },
                B: { n: 'Tesla', cost: 320, desc: 'Stun Lightning (Dmg x1.5)', r: 160, cd: 70, dmg: 80, type: 'magic' }
            },
            [TOWER.BARRACKS]: {
                A: { n: 'Paladin', cost: 250, desc: 'Heavy Armor (HP x5)', r: 120, type: 'barracks' },
                B: { n: 'Barbarian', cost: 220, desc: 'High Dmg Throw (Dmg x6)', r: 120, type: 'barracks' }
            }
        };

        const defaultMap = {
            grid: [
                [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
                [0,0,0,0,2,0,0,2,0,0,0,0,0,0,0,0],
                [3,1,1,1,1,1,1,1,1,1,1,0,0,0,0,0],
                [0,0,2,0,0,2,0,0,0,0,1,2,0,0,0,0],
                [0,0,0,0,0,0,1,1,1,1,1,0,0,0,0,0],
                [0,0,0,0,0,2,1,2,0,0,0,0,2,0,0,0],
                [0,0,0,0,0,0,1,0,0,2,1,1,1,1,4,0],
                [0,0,0,1,1,1,1,0,0,0,1,2,0,0,0,0],
                [0,0,2,1,2,0,0,0,0,0,1,0,0,0,0,0],
                [0,0,0,1,1,1,1,1,1,1,1,0,0,0,0,0],
                [0,0,0,0,0,2,0,0,2,0,0,0,0,0,0,0],
                [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]
            ]
        };

        // ==========================================
        // 2. STORAGE & AUDIO
        // ==========================================
        const Store = {
            save(k,v) { try { localStorage.setItem('krv_'+k, JSON.stringify(v)); } catch(e){} },
            load(k) { try { let v = localStorage.getItem('krv_'+k); if(v) return JSON.parse(v); } catch(e){} return null; }
        };

        const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        let soundOn = Store.load('snd') !== false;

        function sfx(type, pitchVar = 0.2) {
            if(!soundOn) return;
            if(audioCtx.state === 'suspended') audioCtx.resume();
            let osc = audioCtx.createOscillator(), gain = audioCtx.createGain();
            osc.connect(gain); gain.connect(audioCtx.destination);
            let t = audioCtx.currentTime;
            let p = 1 + (Math.random() - 0.5) * pitchVar;
            
            if(type === 'arrow') {
                osc.type = 'triangle'; osc.frequency.setValueAtTime(600*p, t); osc.frequency.exponentialRampToValueAtTime(800*p, t+0.05);
                gain.gain.setValueAtTime(0.05, t); gain.gain.exponentialRampToValueAtTime(0.001, t+0.05);
                osc.start(t); osc.stop(t+0.05);
            } else if(type === 'gun') {
                osc.type = 'square'; osc.frequency.setValueAtTime(150*p, t); osc.frequency.exponentialRampToValueAtTime(50*p, t+0.15);
                gain.gain.setValueAtTime(0.2, t); gain.gain.exponentialRampToValueAtTime(0.001, t+0.15);
                osc.start(t); osc.stop(t+0.15);
            } else if(type === 'magic') {
                osc.type = 'sine'; osc.frequency.setValueAtTime(400*p, t); osc.frequency.linearRampToValueAtTime(900*p, t+0.2);
                gain.gain.setValueAtTime(0.08, t); gain.gain.linearRampToValueAtTime(0.001, t+0.2);
                osc.start(t); osc.stop(t+0.2);
            } else if(type === 'cannon') {
                osc.type = 'sawtooth'; osc.frequency.setValueAtTime(100*p, t); osc.frequency.exponentialRampToValueAtTime(40*p, t+0.3);
                gain.gain.setValueAtTime(0.3, t); gain.gain.exponentialRampToValueAtTime(0.001, t+0.3);
                osc.start(t); osc.stop(t+0.3);
            } else if(type === 'hit') {
                osc.type = 'square'; osc.frequency.setValueAtTime(200*p, t); osc.frequency.exponentialRampToValueAtTime(100*p, t+0.1);
                gain.gain.setValueAtTime(0.05, t); gain.gain.exponentialRampToValueAtTime(0.001, t+0.1);
                osc.start(t); osc.stop(t+0.1);
            } else if(type === 'coin') {
                osc.type = 'sine'; osc.frequency.setValueAtTime(1200*p, t); osc.frequency.setValueAtTime(1600*p, t+0.05);
                gain.gain.setValueAtTime(0.05, t); gain.gain.linearRampToValueAtTime(0, t+0.15);
                osc.start(t); osc.stop(t+0.15);
            } else if(type === 'tesla') {
                osc.type = 'sawtooth'; osc.frequency.setValueAtTime(800*p, t); osc.frequency.linearRampToValueAtTime(200*p, t+0.2);
                gain.gain.setValueAtTime(0.1, t); gain.gain.linearRampToValueAtTime(0.001, t+0.2);
                osc.start(t); osc.stop(t+0.2);
            }
        }

        function toggleSound() {
            soundOn = !soundOn; Store.save('snd', soundOn);
            document.getElementById('btn-sound').innerText = soundOn ? '🔊 SOUND: ON' : '🔇 SOUND: OFF';
        }

        // ==========================================
        // 3. ENGINE STATE & GLOBALS
        // ==========================================
        let canvas, ctx, bgCanvas, bgCtx;
        let state = 'MENU', map = null, waypoints = [];
        let enemies = [], towers = [], projs = [], parts = [], texts = [], decals = [];
        let gold = 300, hp = 20, wave = 1, frames = 0, speed = 1, paused = false, autoSwarm = false;
        let screenShake = 0;
        let selCell = null, rallyTower = null;
        let availableSlots = 0, addSlotMode = false;
        let metaGold = 0, metaGems = 0, extractedGold = 0;
        let items = { dynamite: 0, freeze: 0, midas: 0 };
        let heroes = { archer: { unlocked: true, level: 1, xp: 0 }, paladin: { unlocked: false, level: 1, xp: 0 }, dragon: { unlocked: false, level: 1, xp: 0 } };
        let activeHero = 'archer';
        let heroUnit = null;
        let waveData = { on: false, t: 180, toSpawn: 0, spawnT: 0, spawned: 0, swarm: false, swarmT: 0 };
        let resumedWave = null;
        let scenery = [];
        let brush = CELL.PATH, drawing = false;

        // Utilities
        const dist = (x1,y1,x2,y2) => Math.hypot(x2-x1, y2-y1);
        const rand = (min, max) => Math.random() * (max - min) + min;
        const addShake = (v) => { screenShake = Math.max(screenShake, v); };

        // ==========================================
        // 4. PROCEDURAL GRAPHICS (OFFSCREEN TERRAIN)
        // ==========================================
        function drawShadow(c, x, y, rx, ry, alpha=0.3) {
            c.fillStyle = `rgba(0,0,0,${alpha})`; c.beginPath(); c.ellipse(x, y, rx, ry, 0, 0, Math.PI*2); c.fill();
        }

        
        function renderTerrain() {
            bgCtx.fillStyle = '#466a2b';
            bgCtx.fillRect(0,0,CANVAS_W,CANVAS_H);
            
            // Noise patches for grass
            for(let i=0; i<400; i++) {
                bgCtx.fillStyle = Math.random()>0.5 ? '#3d5e24' : '#4f7830';
                bgCtx.beginPath();
                bgCtx.arc(rand(0,CANVAS_W), rand(0,CANVAS_H), rand(3,12), 0, Math.PI*2);
                bgCtx.fill();
            }

            bgCtx.lineCap = 'round';
            bgCtx.lineJoin = 'round';
            
            // Helper to draw connected paths
            function drawAllPaths(ctx, offset = 0) {
                ctx.beginPath();
                for(let r=0; r<ROWS; r++) {
                    for(let c=0; c<COLS; c++) {
                        let v = map.grid[r][c];
                        if(v === CELL.PATH || v === CELL.START || v === CELL.END) {
                            let cx = c*TILE_SIZE+32, cy = r*TILE_SIZE+32;
                            // Right
                            if(c<COLS-1 && [CELL.PATH, CELL.START, CELL.END].includes(map.grid[r][c+1])) {
                                ctx.moveTo(cx, cy + offset); ctx.lineTo(cx + TILE_SIZE, cy + offset);
                            }
                            // Down
                            if(r<ROWS-1 && [CELL.PATH, CELL.START, CELL.END].includes(map.grid[r+1][c])) {
                                ctx.moveTo(cx + offset, cy); ctx.lineTo(cx + offset, cy + TILE_SIZE);
                            }
                        }
                    }
                }
                ctx.stroke();
            }

            // Base dirt
            bgCtx.lineWidth = 44;
            bgCtx.strokeStyle = '#a68a56'; // Darker edge
            drawAllPaths(bgCtx);

            bgCtx.lineWidth = 36;
            bgCtx.strokeStyle = '#c7a972'; // Lighter center
            drawAllPaths(bgCtx);

            // Ruts
            bgCtx.lineWidth = 4;
            bgCtx.strokeStyle = 'rgba(0,0,0,0.15)';
            drawAllPaths(bgCtx, -8);
            drawAllPaths(bgCtx, 8);

            // Edges (mud and stones)
            for(let r=0; r<ROWS; r++) {
                for(let c=0; c<COLS; c++) {
                    let v = map.grid[r][c];
                    if(v===CELL.PATH || v===CELL.START || v===CELL.END) {
                        let cx = c*TILE_SIZE+32, cy = r*TILE_SIZE+32;
                        for(let i=0; i<8; i++) {
                            let ang = rand(0, Math.PI*2);
                            let dist = rand(18, 26);
                            bgCtx.fillStyle = rand(0,1)>0.5 ? '#4a3f2d' : '#3d5e24';
                            bgCtx.beginPath(); bgCtx.arc(cx + Math.cos(ang)*dist, cy + Math.sin(ang)*dist, rand(2,4), 0, Math.PI*2); bgCtx.fill();
                        }
                    }
                }
            }
            
            // Octagon helper
            function drawOctagon(ctx, x, y, radius) {
                ctx.beginPath();
                for(let i=0; i<8; i++) {
                    let a = i * Math.PI/4 + Math.PI/8;
                    ctx.lineTo(x + Math.cos(a)*radius, y + Math.sin(a)*radius);
                }
                ctx.closePath();
                ctx.fill();
                ctx.stroke();
            }

            // Slots & Start/End
            for(let r=0; r<ROWS; r++) {
                for(let c=0; c<COLS; c++) {
                    if(map.grid[r][c] === CELL.SLOT) {
                        let cx = c*TILE_SIZE+32, cy = r*TILE_SIZE+32;
                        // Shadow
                        bgCtx.fillStyle = 'rgba(0,0,0,0.4)'; bgCtx.strokeStyle='transparent';
                        drawOctagon(bgCtx, cx+5, cy+8, 24);
                        // Base
                        bgCtx.fillStyle = '#4a4e54'; bgCtx.strokeStyle='transparent';
                        drawOctagon(bgCtx, cx, cy+4, 24);
                        // Top
                        bgCtx.fillStyle = '#6b7280'; bgCtx.strokeStyle = '#9ca3af'; bgCtx.lineWidth = 1;
                        drawOctagon(bgCtx, cx, cy, 22);
                    } else if(map.grid[r][c] === CELL.START) {
                        let cx = c*TILE_SIZE+32, cy = r*TILE_SIZE+32;
                        bgCtx.fillStyle = '#1e3a8a'; bgCtx.beginPath(); bgCtx.arc(cx, cy, 20, 0, Math.PI*2); bgCtx.fill();
                    } else if(map.grid[r][c] === CELL.END) {
                        let cx = c*TILE_SIZE+32, cy = r*TILE_SIZE+32;
                        bgCtx.fillStyle = '#7f1d1d'; bgCtx.beginPath(); bgCtx.arc(cx, cy, 20, 0, Math.PI*2); bgCtx.fill();
                    }
                }
            }
        }

        // ==========================================
        // 5. CLASSES (ENTITIES)
        // ==========================================
        class FloatingText {
            constructor(x, y, txt, col, size=16, dur=40) {
                this.x = x; this.y = y; this.txt = txt; this.col = col; this.size = size;
                this.life = dur; this.maxL = dur; this.vy = -1;
            }
            update() { this.y += this.vy; this.life--; }
            draw(c) {
                c.globalAlpha = this.life/this.maxL;
                c.fillStyle = this.col; c.font = `bold ${this.size}px sans-serif`; c.textAlign = 'center';
                c.shadowColor = '#000'; c.shadowBlur = 4;
                c.fillText(this.txt, this.x, this.y);
                c.shadowBlur = 0; c.globalAlpha = 1;
            }
        }

        class HeroUnit {
            constructor(type, lvl) {
                this.type = type;
                this.lvl = lvl;
                this.x = CANVAS_W/2; this.y = CANVAS_H/2;
                if(waypoints.length > 0) { this.x = waypoints[waypoints.length-1].x; this.y = waypoints[waypoints.length-1].y; }
                this.px = this.x; this.py = this.y;
                this.tgtX = this.x; this.tgtY = this.y;
                this.maxHp = (type==='paladin'? 1000 : 500) * (1 + 0.2*lvl); this.hp = this.maxHp;
                this.dmg = (type==='archer' ? 40 : (type==='dragon' ? 60 : 30)) * (1 + 0.15*lvl);
                this.range = type==='archer' ? 160 : (type==='dragon' ? 120 : 60);
                this.spd = type==='dragon' ? 2.5 : 1.5;
                this.state = 'IDLE';
                this.cd = type==='archer' ? 30 : 60;
                this.cdTimer = 0;
                this.deadTimer = 0;
                this.sel = false;
            }
            update() {
                if(this.state === 'DEAD') {
                    this.deadTimer--;
                    if(this.deadTimer <= 0) { this.hp = this.maxHp; this.state = 'IDLE'; this.x = waypoints[waypoints.length-1].x; this.y = waypoints[waypoints.length-1].y; }
                    return;
                }
                if(this.hp <= 0) { this.state = 'DEAD'; this.deadTimer = 900; return; } // 15 seconds dead

                if(dist(this.x, this.y, this.tgtX, this.tgtY) > 5) {
                    let ang = Math.atan2(this.tgtY - this.y, this.tgtX - this.x);
                    this.x += Math.cos(ang) * this.spd; this.y += Math.sin(ang) * this.spd;
                    this.px = this.x; this.py = this.y;
                }

                this.cdTimer--;
                if(this.cdTimer <= 0) {
                    let targets = enemies.filter(e => dist(this.x, this.y, e.px, e.py) <= this.range && e.hp > 0 && (!e.fly || this.type !== 'paladin'));
                    if(targets.length > 0) {
                        let tgt = targets[0];
                        if(this.type === 'archer') projs.push(new Projectile(this.x, this.y-10, tgt, this.dmg, 'arrow', {tier:1}));
                        else if(this.type === 'dragon') { parts.push(new Particle(tgt.px, tgt.py, '#ef4444', 5, 30)); enemies.forEach(e => { if(dist(e.px, e.py, tgt.px, tgt.py) < 60) e.takeDmg(this.dmg, 'magic'); }); }
                        else { tgt.takeDmg(this.dmg, 'phys'); tgt.stun = 15; parts.push(new Particle(tgt.px, tgt.py, '#fff', 5, 10)); }
                        this.cdTimer = this.cd; sfx('hit');
                    }
                }
            }
            draw(ctx) {
                if(this.state === 'DEAD') {
                    ctx.fillStyle = '#ef4444'; ctx.font = '12px sans-serif'; ctx.fillText("Reviving...", this.x-20, this.y-10);
                    ctx.fillRect(this.x-15, this.y+5, 30 * (1 - this.deadTimer/900), 4);
                    return;
                }
                drawShadow(ctx, this.x, this.y+10, 15, 8, 0.3);
                
                ctx.fillStyle = 'rgba(20, 20, 20, 0.8)';
                ctx.beginPath(); ctx.arc(this.x, this.y-2, 16, 0, Math.PI*2); ctx.fill();
                ctx.strokeStyle = '#facc15'; ctx.lineWidth = 2; ctx.stroke();
                
                ctx.font = '24px sans-serif';
                let icon = this.type==='archer'?'🏹':(this.type==='dragon'?'🐉':'🛡️');
                ctx.fillText(icon, this.x-12, this.y+6);
                
                ctx.fillStyle = '#000'; ctx.fillRect(this.x-15, this.y-25, 30, 4);
                ctx.fillStyle = '#22c55e'; ctx.fillRect(this.x-14, this.y-24, 28 * Math.max(0, this.hp/this.maxHp), 2);
                
                if(this.sel) {
                    ctx.strokeStyle = '#3b82f6'; ctx.lineWidth = 2;
                    ctx.beginPath(); ctx.arc(this.x, this.y, this.range, 0, Math.PI*2); ctx.stroke();
                    ctx.beginPath(); ctx.arc(this.x, this.y, 18, 0, Math.PI*2); ctx.stroke();
                }
            }
        }

        class Particle {
            constructor(x, y, col, speed, dur, r=3) {
                this.x = x; this.y = y; this.col = col; this.r = r;
                let a = rand(0, Math.PI*2); this.vx = Math.cos(a)*speed; this.vy = Math.sin(a)*speed;
                this.life = dur; this.maxL = dur;
                this.g = 0;
            }
            update() { this.x+=this.vx; this.y+=this.vy; this.vy+=this.g; this.vx*=0.92; if(this.g===0) this.vy*=0.92; else this.vy*=0.98; this.life--; }
            draw(c) { c.globalAlpha = Math.max(0, this.life/this.maxL); c.fillStyle = this.col; c.beginPath(); c.arc(this.x, this.y, this.r, 0, Math.PI*2); c.fill(); c.globalAlpha = 1; }
        }

        class Decal {
            constructor(x, y, type, dur=150) {
                this.x = x; this.y = y; this.type = type; this.life = dur; this.maxL = dur;
            }
            update() { 
                this.life--; 
                // Fire pool damage tick
                if(this.type === 'fire' && frames%15===0) {
                    enemies.forEach(e => { if(!e.fly && dist(e.px,e.py,this.x,this.y)<40) e.takeDmg(10, 'magic'); });
                }
            }
            draw(c) {
                c.globalAlpha = this.type==='fire' ? 1 : this.life/this.maxL;
                if(this.type === 'crater') {
                    c.fillStyle = '#222'; c.beginPath(); c.ellipse(this.x, this.y, 20, 10, 0, 0, Math.PI*2); c.fill();
                    c.fillStyle = '#111'; c.beginPath(); c.ellipse(this.x, this.y+2, 16, 8, 0, 0, Math.PI*2); c.fill();
                } else if(this.type === 'fire') {
                    c.fillStyle = (frames%10<5) ? 'rgba(239, 68, 68, 0.6)' : 'rgba(249, 115, 22, 0.6)';
                    c.beginPath(); c.ellipse(this.x, this.y, 35, 20, 0, 0, Math.PI*2); c.fill();
                    if(Math.random()<0.3) parts.push(new Particle(this.x+rand(-20,20), this.y+rand(-10,10), '#facc15', 1, 20, 2));
                }
                c.globalAlpha = 1;
            }
        }

        
        class Enemy {
            constructor(type, mHp, spd, rw, r, col) {
                this.type = type; this.maxHp = mHp; this.hp = mHp;
                this.spd = spd + wave*0.02; this.reward = rw; this.r = r; this.col = col;
                this.fly = type === ENEMY.FLYING; this.heavy = type === ENEMY.HEAVY || type === ENEMY.BOSS;
                
                this.armor = this.heavy ? 50 : (this.fly ? 10 : 0);
                this.magicRes = type === ENEMY.MAGIC ? 70 : 0;
                if(type === ENEMY.BOSS) { this.armor = 60; this.magicRes = 40; }
                
                this.pIdx = 0; this.x = waypoints[0].x; this.y = waypoints[0].y;
                this.ox = rand(-12,12); this.oy = rand(-12,12);
                this.blocked = false; this.poison = 0; this.stun = 0;
                this.bob = rand(0, Math.PI*2);
                
                this.hitTimer = 0;
                this.facingLeft = false;
            }
            get px() { return this.x + (this.fly ? 0 : this.ox); }
            get py() { return this.y + (this.fly ? 0 : this.oy); }

            takeDmg(amt, type, source='norm') {
                if(this.hp <= 0) return;
                let isCrit = false;
                if(type === 'phys') amt *= (100 - this.armor)/100;
                else if(type === 'magic') amt *= (100 - this.magicRes)/100;
                if(source === 'headshot') { amt = this.maxHp*10; isCrit = true; } 
                
                this.hp -= amt;
                this.hitTimer = 5;
                if(amt > 0) sfx('hit', 0.5);
                
                if(source === 'poison') texts.push(new FloatingText(this.px, this.py-20, Math.ceil(amt), '#22c55e', 12, 20));
                else if(isCrit) texts.push(new FloatingText(this.px, this.py-25, 'CRIT!', '#facc15', 20, 30));
                else if(amt > this.maxHp*0.1) texts.push(new FloatingText(this.px, this.py-15, Math.ceil(amt), type==='magic'?'#a855f7':'#fff', 14, 20));
                
                for(let i=0; i<(isCrit?10:3); i++) {
                    let p = new Particle(this.px, this.py-10, type==='magic'?'#d8b4fe':'#ef4444', 3, 20);
                    p.g = 0.2; parts.push(p);
                }

                if(this.hp <= 0) this.die();
            }

            die() {
                if(this.pIdx >= waypoints.length) return; 
                gold += this.reward * (waveData.swarm ? 2 : 1);
                sfx('coin', 0.2);
                texts.push(new FloatingText(this.px, this.py-10, `+${this.reward*(waveData.swarm?2:1)}`, '#fde047', 16, 40));
                if(this.type === ENEMY.BOSS) {
                    metaGems += 1; metaGold += 50; saveMeta();
                    texts.push(new FloatingText(this.px, this.py-30, "+1 💎", '#60a5fa', 20, 60));
                }
                
                // Juicy Death Particles
                let pCol = '#fff';
                if(this.type===ENEMY.LIGHT) pCol='#6b9338';
                if(this.type===ENEMY.HEAVY) pCol='#64748b';
                if(this.type===ENEMY.FLYING) pCol='#3d3b59';
                if(this.type===ENEMY.MAGIC) pCol='#10b981';
                if(this.type===ENEMY.BOSS) pCol='#b91c1c';
                
                for(let i=0; i<10; i++) {
                    let p = new Particle(this.px, this.py, pCol, rand(2,5), rand(30,50), rand(3,6));
                    p.g = 0.15; // Gravity
                    parts.push(p);
                }
                
                let necros = towers.filter(t => t.branch === 'B' && t.type === TOWER.MAGE && dist(t.x, t.y, this.px, this.py) <= t.range);
                if(necros.length > 0 && !this.fly && this.type !== ENEMY.BOSS) {
                    let n = necros[0];
                    if(n.soldiers.length < 3) n.soldiers.push(new Soldier(n, this.px, this.py, true));
                }
                if(this.type === ENEMY.BOSS) document.getElementById('boss-hp-container').classList.add('hidden');
            }

            update() {
                if(this.hitTimer > 0) this.hitTimer--;
                if(this.stun > 0) { this.stun--; return; }
                if(this.poison > 0 && frames % 30 === 0) { this.takeDmg(this.maxHp * 0.02, 'true', 'poison'); this.poison--; }
                
                if(this.type === ENEMY.HEAVY && frames % 30 === 0 && !this.blocked) {
                    let p = new Particle(this.px, this.py+15, '#78716c', 1, 15, 2);
                    p.g = 0; parts.push(p);
                }
                if(this.type === ENEMY.BOSS && frames % 40 === 0 && !this.blocked) {
                    addShake(1);
                }
                
                this.bob += (this.fly ? 0.3 : 0.2);
                if(this.blocked) return;

                let tp = waypoints[this.pIdx], dx = tp.x - this.x, dy = tp.y - this.y, d = Math.hypot(dx, dy);
                if(dx < 0) this.facingLeft = true;
                else if(dx > 0) this.facingLeft = false;

                if(d < this.spd) {
                    this.x = tp.x; this.y = tp.y; this.pIdx++;
                    if(this.pIdx >= waypoints.length) {
                        hp -= (this.type===ENEMY.BOSS ? 10 : (this.heavy ? 2 : 1));
                        sfx('hit', 0);
                        this.hp = 0; texts.push(new FloatingText(this.px, this.py, `-HP`, '#ef4444', 24, 60));
                    }
                } else {
                    this.x += (dx/d)*this.spd; this.y += (dy/d)*this.spd;
                }
                
                if(this.type === ENEMY.BOSS) {
                    let hpb = document.getElementById('boss-hp-bar');
                    hpb.style.width = Math.max(0, (this.hp/this.maxHp)*100) + '%';
                }
            }

            draw(c) {
                let x = this.px, y = this.py;
                let tick = this.bob;
                
                // Flying Shadow
                if(this.fly) {
                    c.fillStyle = 'rgba(0,0,0,0.4)';
                    c.beginPath(); c.ellipse(x, y + 15, 12 + Math.sin(tick)*2, 6, 0, 0, Math.PI*2); c.fill();
                    y -= 15 + Math.sin(tick)*3;
                } else {
                    drawShadow(c, x, y+this.r, this.r, this.r/2);
                }
                
                c.save();
                c.translate(x, y);
                if(this.facingLeft) c.scale(-1, 1);
                
                if(this.hitTimer > 0) c.filter = 'brightness(300%)';
                
                if(this.type === ENEMY.LIGHT) { // Goblin
                    let bobY = Math.abs(Math.sin(tick*1.5)) * 4;
                    c.translate(0, -bobY);
                    c.fillStyle = '#6b9338'; c.beginPath(); c.arc(0, 0, 10, 0, Math.PI*2); c.fill(); // Body
                    // Ears
                    c.beginPath(); c.moveTo(-5, -5); c.lineTo(-15, -10); c.lineTo(-8, 0); c.fill();
                    c.beginPath(); c.moveTo(5, -5); c.lineTo(15, -10); c.lineTo(8, 0); c.fill();
                    // Vest & Belt
                    c.fillStyle = '#5c4033'; c.fillRect(-8, 0, 16, 12);
                    c.fillStyle = '#3e2723'; c.fillRect(-9, 8, 18, 3);
                    // Hat
                    c.fillStyle = '#4e342e'; c.beginPath(); c.moveTo(-10, -8); c.lineTo(0, -20); c.lineTo(10, -8); c.fill();
                    // Dagger
                    c.save(); c.translate(10, 5); c.rotate(Math.sin(tick)*0.5);
                    c.fillStyle = '#ccc'; c.beginPath(); c.moveTo(0,0); c.lineTo(15, -5); c.lineTo(0, 5); c.fill();
                    c.fillStyle = '#4e342e'; c.fillRect(-2, -2, 4, 8);
                    c.restore();
                    
                } else if (this.type === ENEMY.HEAVY) { // Orc
                    let bobA = Math.sin(tick) * 0.2;
                    c.rotate(bobA);
                    c.fillStyle = '#4a5d23'; c.beginPath(); c.arc(0, 0, 16, 0, Math.PI*2); c.fill(); // Body
                    // Helmet
                    c.fillStyle = '#374151'; c.beginPath(); c.arc(0, -4, 17, Math.PI, 0); c.fill();
                    c.fillStyle = '#d1d5db'; c.beginPath(); c.moveTo(-10, -10); c.lineTo(-18, -25); c.lineTo(-5, -15); c.fill();
                    c.beginPath(); c.moveTo(10, -10); c.lineTo(18, -25); c.lineTo(5, -15); c.fill();
                    // Armor
                    c.fillStyle = '#4b5563'; c.fillRect(-16, -2, 32, 10);
                    // Shield (Left hand, front)
                    c.fillStyle = '#5c4033'; c.fillRect(8, -10, 8, 26);
                    c.fillStyle = '#9ca3af'; c.fillRect(6, -8, 12, 4); c.fillRect(6, 10, 12, 4);
                    // Hammer (Right hand)
                    c.save(); c.translate(-10, 10); c.rotate(Math.sin(tick)*0.3);
                    c.fillStyle = '#4e342e'; c.fillRect(-15, -2, 20, 4);
                    c.fillStyle = '#6b7280'; c.fillRect(-20, -8, 10, 16);
                    c.restore();
                    
                } else if (this.type === ENEMY.FLYING) { // Gargoyle
                    let flap = Math.sin(tick*1.5);
                    // Wings
                    c.fillStyle = '#2d2b42';
                    c.save(); c.scale(1, flap);
                    c.beginPath(); c.moveTo(-5, 0); c.lineTo(-25, -20); c.lineTo(-15, 10); c.fill();
                    c.beginPath(); c.moveTo(5, 0); c.lineTo(25, -20); c.lineTo(15, 10); c.fill();
                    c.restore();
                    // Body
                    c.fillStyle = '#3d3b59'; c.beginPath(); c.arc(0, 0, 12, 0, Math.PI*2); c.fill();
                    // Eye
                    c.fillStyle = '#ef4444'; c.beginPath(); c.arc(8, -2, 3, 0, Math.PI*2); c.fill();
                    
                } else if (this.type === ENEMY.MAGIC) { // Necromancer
                    // Fog base
                    c.fillStyle = '#111827'; c.beginPath(); c.arc(0, 5, 14, 0, Math.PI*2); c.fill();
                    c.globalAlpha = 0.5; c.beginPath(); c.arc(0, 12, 16 + Math.sin(tick)*2, 0, Math.PI*2); c.fill(); c.globalAlpha = 1;
                    // Cloak
                    c.fillStyle = '#4c1d95'; c.beginPath(); c.moveTo(-12, 10); c.lineTo(0, -15); c.lineTo(12, 10); c.fill();
                    // Hood
                    c.fillStyle = '#000'; c.beginPath(); c.arc(0, -5, 8, 0, Math.PI*2); c.fill();
                    // Eyes
                    c.fillStyle = '#3b82f6'; c.beginPath(); c.arc(4, -5, 1.5, 0, Math.PI*2); c.fill();
                    // Staff
                    c.fillStyle = '#4e342e'; c.fillRect(12, -10, 3, 25);
                    // Orb
                    let orbPulse = 1 + Math.sin(tick*2)*0.2;
                    c.fillStyle = '#10b981'; c.beginPath(); c.arc(13.5, -12, 5 * orbPulse, 0, Math.PI*2); c.fill();
                    c.fillStyle = 'rgba(16, 185, 129, 0.4)'; c.beginPath(); c.arc(13.5, -12, 10 * orbPulse, 0, Math.PI*2); c.fill();
                    
                } else if (this.type === ENEMY.BOSS) { // Golem
                    let bobA = Math.sin(tick)*0.1;
                    c.translate(0, Math.abs(Math.sin(tick))*2);
                    c.rotate(bobA);
                    // Body base
                    c.fillStyle = '#374151'; c.beginPath(); c.arc(0, 0, 28, 0, Math.PI*2); c.fill();
                    // Lava cracks
                    c.strokeStyle = '#dc2626'; c.lineWidth = 3;
                    c.beginPath(); c.moveTo(-10, -10); c.lineTo(0, 0); c.lineTo(-5, 15); c.stroke();
                    c.beginPath(); c.moveTo(10, -5); c.lineTo(15, 10); c.stroke();
                    // Shoulders / Gear
                    c.fillStyle = '#4b5563'; c.beginPath(); c.arc(-15, -15, 12, 0, Math.PI*2); c.fill();
                    c.fillStyle = '#4b5563'; c.beginPath(); c.arc(15, -15, 12, 0, Math.PI*2); c.fill();
                    // Chains
                    c.strokeStyle = '#9ca3af'; c.lineWidth = 4;
                    c.beginPath(); c.moveTo(-15, -15); c.lineTo(15, 10); c.stroke();
                    // Head
                    c.fillStyle = '#1f2937'; c.fillRect(8, -10, 12, 16);
                    c.fillStyle = '#fef08a'; c.fillRect(16, -6, 4, 4); // Eye
                }
                
                c.restore();
                
                // Status effects on top
                if(this.stun > 0) {
                    c.save(); c.translate(x, y - this.r - 10); c.rotate(frames*0.2);
                    c.fillStyle = '#facc15'; c.fillRect(-10, -2, 20, 4); c.fillRect(-2, -10, 4, 20);
                    c.restore();
                }
                if(this.poison > 0) {
                    c.fillStyle = 'rgba(34, 197, 94, 0.6)'; c.beginPath(); c.arc(x, y - this.r, 6 + Math.sin(frames*0.3)*2, 0, Math.PI*2); c.fill();
                    if(frames%10===0) { let p = new Particle(x, y-this.r, '#22c55e', 0, 15, 3); p.g = -0.05; parts.push(p); }
                }
            }
        }

        class Soldier {
            constructor(tw, x, y, isSkel=false) {
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
            }
            update() {
                if(this.hp <= 0) {
                    if(this.tw.branch==='A' && !this.revived && !this.isSkel) {
                        this.hp = this.maxHp * 0.5; this.revived = true;
                        texts.push(new FloatingText(this.x, this.y-20, 'REVIVE', '#facc15', 14));
                        return;
                    }
                    this.state = 'DEAD';
                    if(this.target) { this.target.blocked = false; this.target = null; }
                    if(this.isSkel) this.tw.soldiers = this.tw.soldiers.filter(s => s!==this);
                    return;
                }
                this.bob += 0.2;

                if(this.target) {
                    if(this.target.hp <= 0 || dist(this.x, this.y, this.target.px, this.target.py) > 80) {
                        this.target.blocked = false; this.target = null; this.state = 'MOVE';
                    } else {
                        if(frames % 60 === 0) {
                            if(this.tw.branch === 'B' && !this.isSkel) {
                                // Cleave
                                enemies.forEach(e => { if(!e.fly && dist(this.x,this.y,e.px,e.py)<40) e.takeDmg(this.dmg, 'phys'); });
                                this.hp = Math.min(this.maxHp, this.hp + this.dmg*0.3); // Lifesteal
                                parts.push(new Particle(this.x, this.y, '#ef4444', 3, 10)); // slash visual
                            } else {
                                this.target.takeDmg(this.dmg, 'phys');
                                parts.push(new Particle((this.x+this.target.px)/2, (this.y+this.target.py)/2, '#fff', 3, 10));
                            }
                            let dmgTaken = 5 + wave;
                            this.hp -= dmgTaken; // Take enemy dmg
                            texts.push(new FloatingText(this.x, this.y-15, `-${dmgTaken}`, '#fca5a5', 12, 30));
                            sfx('hit');
                        }
                    }
                } else {
                    for(let e of enemies) {
                        if(!e.fly && !e.blocked && dist(this.x, this.y, e.px, e.py) < 70) {
                            this.target = e; e.blocked = true; this.state = 'COMBAT';
                            this.x = e.px + rand(-10,10); this.y = e.py + rand(-10,10); break;
                        }
                    }
                    if(!this.target && !this.isSkel) {
                        let idx = this.tw.soldiers.indexOf(this);
                        let rx = this.tw.rallyX + (idx===0?-15:(idx===1?15:0));
                        let ry = this.tw.rallyY + (idx===2?-15:10);
                        let d = dist(this.x, this.y, rx, ry);
                        if(d > 2) { this.x += (rx-this.x)/d * 2; this.y += (ry-this.y)/d * 2; }
                    } else if(this.isSkel) {
                        // Skeleton idle wander
                        if(frames%100===0) { this.tx = this.tw.x+rand(-50,50); this.ty = this.tw.y+rand(-50,50); }
                        if(this.tx) {
                            let d = dist(this.x, this.y, this.tx, this.ty);
                            if(d > 2) { this.x += (this.tx-this.x)/d; this.y += (this.ty-this.y)/d; }
                        }
                    }
                }
            }
            draw(c) {
                if(this.state === 'DEAD') return;
                let y = this.y + (this.state==='MOVE'?Math.abs(Math.sin(this.bob))*4:0);
                drawShadow(c, this.x, y+8, 8, 4);
                
                if(this.isSkel) {
                    c.fillStyle = '#e5e7eb'; c.fillRect(this.x-4, y-8, 8, 16); c.fillStyle = '#111'; c.fillRect(this.x-2, y-6, 2, 2); c.fillRect(this.x+2, y-6, 2, 2);
                } else if(this.tw.branch === 'A') { // Paladin
                    c.fillStyle = '#f8fafc'; c.fillRect(this.x-6, y-10, 12, 18);
                    c.fillStyle = '#fbbf24'; c.fillRect(this.x-7, y-12, 14, 4); // Helmet
                    c.fillStyle = '#60a5fa'; c.beginPath(); c.arc(this.x-8, y, 6, 0, Math.PI*2); c.fill(); // Shield
                } else if(this.tw.branch === 'B') { // Barbarian
                    c.fillStyle = '#d97706'; c.fillRect(this.x-5, y-8, 10, 16);
                    c.fillStyle = '#ef4444'; c.fillRect(this.x-5, y-8, 10, 4); // Warpaint
                    c.fillStyle = '#9ca3af'; c.fillRect(this.x+5, y-4, 8, 2); c.fillRect(this.x-13, y-4, 8, 2); // Dual axes
                } else {
                    c.fillStyle = '#3b82f6'; c.beginPath(); c.arc(this.x, y, 6, 0, Math.PI*2); c.fill();
                    c.fillStyle = '#9ca3af'; c.fillRect(this.x+4, y-4, 8, 2); // Sword
                }
                
                c.fillStyle = '#000'; c.fillRect(this.x-8, y-14, 16, 4);
                c.fillStyle = '#22c55e'; c.fillRect(this.x-7, y-13, 14*Math.max(0, this.hp/this.maxHp), 2);
            }
        }

        class Projectile {
            constructor(x, y, tgt, dmg, type, tw) {
                this.x = x; this.y = y; this.tgt = tgt; this.dmg = dmg; this.type = type; this.tw = tw;
                this.spd = (type==='aoe'||type==='missile') ? 6 : 12;
                this.active = true; this.tx = tgt.px; this.ty = tgt.py;
                if(type === 'missile') this.ty -= 100; // Arcing
            }
            update() {
                if(!this.active) return;
                if(this.tgt && this.tgt.hp > 0 && this.type !== 'aoe') { this.tx = this.tgt.px; this.ty = this.tgt.py; }
                let dx = this.tx - this.x, dy = this.ty - this.y, d = Math.hypot(dx, dy);
                if(d < this.spd) this.hit();
                else { this.x += (dx/d)*this.spd; this.y += (dy/d)*this.spd; }
                
                if(this.type === 'missile') parts.push(new Particle(this.x, this.y, '#f97316', 0, 10, 2));
            }
            hit() {
                this.active = false;
                if(this.type === 'aoe' || this.type === 'missile') {
                    sfx('cannon');
                    decals.push(new Decal(this.tx, this.ty, this.type==='missile'?'fire':'crater', this.type==='missile'?200:100));
                    for(let i=0; i<15; i++) parts.push(new Particle(this.tx, this.ty, '#fb923c', 4, 30));
                    let rad = this.type==='missile'?80:50;
                    enemies.forEach(e => { if(!e.fly && dist(e.px,e.py,this.tx,this.ty)<rad) e.takeDmg(this.dmg, 'phys'); });
                } else if(this.type === 'lightning') { // Tesla
                    sfx('tesla');
                    this.tgt.takeDmg(this.dmg, 'magic');
                    if(Math.random()<0.2) this.tgt.stun = 30;
                    // Draw flash
                    ctx.strokeStyle='#fff'; ctx.lineWidth=3; ctx.beginPath(); ctx.moveTo(this.tw.x, this.tw.y-30); ctx.lineTo(this.tgt.px, this.tgt.py); ctx.stroke();
                    // Chain
                    let chained = 0, last = this.tgt;
                    for(let e of enemies) {
                        if(e !== this.tgt && dist(last.px, last.py, e.px, e.py) < 100 && chained < 3) {
                            e.takeDmg(this.dmg*0.5, 'magic');
                            if(Math.random()<0.2) e.stun = 30;
                            ctx.beginPath(); ctx.moveTo(last.px, last.py); ctx.lineTo(e.px, e.py); ctx.stroke();
                            last = e; chained++;
                        }
                    }
                } else {
                    let source = 'norm';
                    if(this.tw.branch === 'B' && this.tw.type === TOWER.ARCHER) { // Musketeer Headshot
                        if(Math.random() < 0.1) source = 'headshot';
                        // Shotgun splash
                        enemies.forEach(e => { if(e!==this.tgt && dist(e.px,e.py,this.tx,this.ty)<30) e.takeDmg(this.dmg*0.3, 'phys'); });
                    }
                    if(this.tgt && this.tgt.hp>0) {
                        this.tgt.takeDmg(this.dmg, this.type, source);
                        if(this.tw.branch === 'A' && this.tw.type === TOWER.ARCHER) this.tgt.poison = 150; // Ranger Poison
                    }
                }
            }
            draw(c) {
                if(this.type === 'lightning' || this.type === 'beam') return; // Handled instantly or in tower
                c.fillStyle = this.type==='magic'?'#a855f7':(this.type==='aoe'?'#111':(this.type==='missile'?'#ef4444':'#facc15'));
                c.beginPath(); 
                if(this.type==='missile') c.fillRect(this.x-3, this.y-8, 6, 16);
                else c.arc(this.x, this.y, this.type==='aoe'?6:3, 0, Math.PI*2); 
                c.fill();
            }
        }

        class Tower {
            constructor(c, r, type) {
                this.c = c; this.r = r; this.type = type;
                this.x = c*TILE_SIZE + 32; this.y = r*TILE_SIZE + 32;
                this.tier = 1; this.branch = null; this.spent = TOWER_STATS[type].cost;
                this.range = TOWER_STATS[type].r; this.cd = TOWER_STATS[type].cd; this.dmg = TOWER_STATS[type].dmg;
                
                // Hero Bonuses
                if(activeHero === 'archer' && type === TOWER.ARCHER) this.dmg *= (1 + 0.1*heroes.archer.level);
                if(activeHero === 'dragon' && type === TOWER.MAGE) this.dmg *= (1 + 0.15*heroes.dragon.level);
                
                this.cdTimer = 0; this.anim = 0;
                
                // Mage Beam state
                this.beamTgt = null; this.beamDmg = 0;
                
                if(type === TOWER.BARRACKS) {
                    this.rallyX = this.x; this.rallyY = this.y;
                    let minD = Infinity;
                    for(let i=0; i<ROWS; i++) for(let j=0; j<COLS; j++) {
                        if(map.grid[i][j]===CELL.PATH) {
                            let px = j*TILE_SIZE+32, py = i*TILE_SIZE+32, d = dist(px,py,this.x,this.y);
                            if(d<minD) { minD=d; this.rallyX=px; this.rallyY=py; }
                        }
                    }
                    this.soldiers = [new Soldier(this,this.x,this.y), new Soldier(this,this.x,this.y), new Soldier(this,this.x,this.y)];
                } else this.soldiers = [];
            }

            upgrade(branch = null) {
                if(this.tier >= 4) return;
                if(this.tier === 3 && !branch) return; // Must pick branch
                let cost = this.tier < 3 ? Math.floor(TOWER_STATS[this.type].cost * (this.tier+1) * 0.8) : BRANCHES[this.type][branch].cost;
                if(gold >= cost) {
                    gold -= cost; this.spent += cost; this.tier++; sfx('coin');
                    for(let i=0; i<20; i++) parts.push(new Particle(this.x, this.y-20, '#facc15', 3, 30));
                    
                    if(branch) {
                        this.branch = branch; let s = BRANCHES[this.type][branch];
                        this.range = s.r; this.cd = s.cd || this.cd; this.dmg = s.dmg || this.dmg;
                    } else {
                        this.range += 10; this.dmg = Math.floor(this.dmg * 1.5);
                    }
                    
                    if(this.type === TOWER.BARRACKS && !this.branch) {
                        this.soldiers.forEach(s => { s.maxHp = 50+40*this.tier; s.hp = s.maxHp; s.dmg = 5+5*this.tier; s.state='MOVE'; });
                    } else if(this.type === TOWER.BARRACKS && this.branch) {
                        this.soldiers = []; // Respawn branch specific
                        for(let i=0; i<3; i++) this.soldiers.push(new Soldier(this, this.x, this.y));
                    }
                    return true;
                }
                return false;
            }

            update() {
                if(this.anim > 0) this.anim--;
                if(this.type === TOWER.BARRACKS) {
                    if(frames % 240 === 0 && !this.branch) { // Basic respawn
                        let d = this.soldiers.find(s => s.state==='DEAD' && !s.isSkel);
                        if(d) { d.hp = d.maxHp; d.state='MOVE'; d.x=this.x; d.y=this.y; }
                    } else if(frames % 120 === 0 && this.branch) { // Faster respawn for T4
                        let d = this.soldiers.find(s => s.state==='DEAD' && !s.isSkel);
                        if(d) { d.hp = d.maxHp; d.state='MOVE'; d.x=this.x; d.y=this.y; d.revived=false; }
                    }
                    this.soldiers.forEach(s => s.update());
                } else {
                    if(this.cdTimer > 0) this.cdTimer--;
                    
                    // Death Ray logic
                    if(this.branch === 'A' && this.type === TOWER.MAGE) {
                        if(this.beamTgt && (this.beamTgt.hp<=0 || dist(this.x, this.y, this.beamTgt.px, this.beamTgt.py)>this.range)) {
                            this.beamTgt = null; this.beamDmg = this.dmg; // Reset
                        }
                        if(!this.beamTgt) {
                            this.beamTgt = enemies.find(e => dist(this.x, this.y, e.px, e.py) <= this.range);
                            this.beamDmg = this.dmg;
                        }
                        if(this.beamTgt && frames%5===0) {
                            sfx('magic', 2);
                            this.beamTgt.takeDmg(this.beamDmg, 'magic');
                            this.beamDmg *= 1.1; // Ramp up!
                            this.anim = 5;
                        }
                        return;
                    }

                    if(this.cdTimer <= 0) {
                        let tgt = null, maxP = -1;
                        for(let e of enemies) {
                            if((this.type === TOWER.CANNON && !this.branch && e.fly)) continue; // Basic cannon can't hit flying
                            if(dist(this.x, this.y, e.px, e.py) <= this.range) {
                                let p = e.pIdx + (1-dist(e.x,e.y,waypoints[e.pIdx]?.x,waypoints[e.pIdx]?.y)/64);
                                if(p > maxP) { maxP=p; tgt=e; }
                            }
                        }
                        if(tgt) {
                            this.anim = 15;
                            let pType = this.type===TOWER.ARCHER?'phys':(this.type===TOWER.MAGE?'magic':'aoe');
                            if(this.branch === 'A' && this.type === TOWER.CANNON) pType = 'missile';
                            if(this.branch === 'B' && this.type === TOWER.CANNON) pType = 'lightning';
                            
                            sfx(this.type===TOWER.ARCHER?(this.branch==='B'?'gun':'arrow'):(this.type===TOWER.MAGE?'magic':'cannon'));
                            
                            let p = new Projectile(this.x, this.y-25, tgt, this.dmg, pType, this);
                            projs.push(p);
                            if(pType === 'lightning') { p.hit(); projs.pop(); } // Instahit
                            this.cdTimer = this.cd;
                        }
                    }
                }
            }

            draw(c) {
                let x = this.x, y = this.y, t = this.tier;
                drawShadow(c, x, y+20, 20, 10);
                
                // Base
                c.fillStyle = '#4b5563'; c.fillRect(x-20, y-10-t*5, 40, 20+t*5);
                c.fillStyle = '#374151'; c.fillRect(x-18, y-10-t*5, 36, 20+t*5); // Inner brick
                
                // Tower Specifics
                if(this.type === TOWER.ARCHER) {
                    // Wood structure
                    c.fillStyle = '#8b5a2b'; c.fillRect(x-15, y-20-t*8, 30, 20);
                    if(this.branch === 'A') { // Ranger (Leafy)
                        c.fillStyle = '#15803d'; c.beginPath(); c.moveTo(x, y-40-t*8); c.lineTo(x-20, y-20-t*8); c.lineTo(x+20, y-20-t*8); c.fill();
                        // Ranger figure
                        c.fillStyle = '#16a34a'; c.fillRect(x-5, y-30-t*8, 10, 10); // Hood
                    } else if(this.branch === 'B') { // Musketeer
                        c.fillStyle = '#444'; c.fillRect(x-15, y-25-t*8, 30, 5); // Steel rim
                        c.fillStyle = '#dc2626'; c.fillRect(x-4, y-30-t*8, 8, 8); // Red coat
                        if(this.anim>0) { c.fillStyle='#fff'; c.beginPath(); c.arc(x+(x<CANVAS_W/2?15:-15), y-30-t*8, 10, 0, Math.PI*2); c.fill(); } // Muzzle flash
                    } else {
                        c.fillStyle = '#991b1b'; c.beginPath(); c.moveTo(x, y-30-t*8); c.lineTo(x-18, y-20-t*8); c.lineTo(x+18, y-20-t*8); c.fill();
                        c.fillStyle = '#eab308'; c.fillRect(x-4, y-26-t*8, 8, 8); // Bowman
                    }
                } else if(this.type === TOWER.MAGE) {
                    if(this.branch === 'B') { // Necro
                        c.fillStyle = '#1e1b4b'; c.fillRect(x-15, y-25-t*8, 30, 25);
                        c.fillStyle = '#8b5cf6'; c.beginPath(); c.arc(x, y-30-t*8, 8, 0, Math.PI*2); c.fill();
                    } else {
                        c.fillStyle = '#111827'; c.beginPath(); c.moveTo(x-20, y-10-t*5); c.lineTo(x-15, y-30-t*8); c.lineTo(x+15, y-30-t*8); c.lineTo(x+20, y-10-t*5); c.fill();
                        // Crystal
                        let cy = y-35-t*8 + Math.sin(frames/10)*3;
                        c.fillStyle = this.branch==='A' ? '#ef4444' : '#a855f7';
                        c.beginPath(); c.moveTo(x, cy-10); c.lineTo(x-6, cy); c.lineTo(x, cy+10); c.lineTo(x+6, cy); c.fill();
                        c.shadowColor = c.fillStyle; c.shadowBlur = 15; c.fill(); c.shadowBlur = 0;
                        
                        // Death Ray Beam
                        if(this.branch === 'A' && this.beamTgt) {
                            c.strokeStyle = `rgba(239, 68, 68, ${0.5 + Math.random()*0.5})`; c.lineWidth = 3 + Math.random()*4;
                            c.beginPath(); c.moveTo(x, cy); c.lineTo(this.beamTgt.px, this.beamTgt.py); c.stroke();
                        }
                    }
                } else if(this.type === TOWER.CANNON) {
                    c.fillStyle = '#1f2937'; c.beginPath(); c.arc(x, y-15-t*5, 18, 0, Math.PI*2); c.fill();
                    if(this.branch === 'A') { // Missile
                        c.fillStyle = '#374151'; c.fillRect(x-10, y-30-t*5, 20, 15); // Radar
                        if(this.anim>0) { c.fillStyle='#f97316'; c.beginPath(); c.arc(x, y-30-t*5, 15, 0, Math.PI*2); c.fill(); }
                    } else if(this.branch === 'B') { // Tesla
                        c.fillStyle = '#7dd3fc'; c.fillRect(x-2, y-35-t*5, 4, 20); // Coil
                        c.beginPath(); c.arc(x, y-35-t*5, 6, 0, Math.PI*2); c.fill();
                        if(frames%10<5) { c.strokeStyle='#fff'; c.beginPath(); c.moveTo(x, y-35-t*5); c.lineTo(x+rand(-10,10), y-45-t*5); c.stroke(); }
                    } else { // Basic Cannon Barrel (Recoil)
                        c.fillStyle = '#000';
                        c.save(); c.translate(x, y-15-t*5); 
                        let ang = projs.length && projs[projs.length-1].tw===this ? Math.atan2(projs[projs.length-1].ty - y, projs[projs.length-1].tx - x) : -Math.PI/2;
                        c.rotate(ang);
                        let reco = this.anim>0 ? -5 : 0;
                        c.fillRect(reco, -6, 20, 12);
                        if(this.anim>10) { c.fillStyle='#f97316'; c.beginPath(); c.arc(20+reco, 0, 10, 0, Math.PI*2); c.fill(); }
                        c.restore();
                    }
                } else if(this.type === TOWER.BARRACKS) {
                    c.fillStyle = '#78350f'; c.fillRect(x-18, y-20-t*5, 36, 10); // Roof
                    c.fillStyle = '#ef4444'; c.fillRect(x-5, y-30-t*5, 10, 10); // Flag
                    // Rally Point Marker if selected
                    if(selCell && selCell.c === this.c && selCell.r === this.r) {
                        c.fillStyle = 'rgba(59, 130, 246, 0.5)'; c.beginPath(); c.arc(this.rallyX, this.rallyY, 15, 0, Math.PI*2); c.fill();
                        c.strokeStyle = '#fff'; c.beginPath(); c.moveTo(this.rallyX-5, this.rallyY); c.lineTo(this.rallyX+5, this.rallyY); c.moveTo(this.rallyX, this.rallyY-5); c.lineTo(this.rallyX, this.rallyY+5); c.stroke();
                    }
                    this.soldiers.forEach(s => s.draw(c));
                }

                // Tier indicator dots
                c.fillStyle = '#fff';
                for(let i=0; i<t; i++) { c.beginPath(); c.arc(x - (t*4)/2 + i*5 + 2, y + 10, 2, 0, Math.PI*2); c.fill(); }
            }
        }

        // ==========================================
        // 6. GAME LOGIC & LOOP
        // ==========================================
        function spawnEnemy() {
            let type = ENEMY.LIGHT, r = Math.random();
            if(wave > 2 && r < 0.35) type = ENEMY.HEAVY;
            if(wave > 3 && r > 0.7) type = ENEMY.MAGIC;
            if(wave > 4 && r > 0.4 && r < 0.6) type = ENEMY.FLYING;
            if(wave % 5 === 0 && waveData.spawned === waveData.toSpawn - 1) type = ENEMY.BOSS; // Boss is always last in mod 5 waves

            let baseHp = 40, spd = 1.0, rw = 5 + Math.floor(wave*0.5), rad = 14, col = '#84cc16';
            if(type === ENEMY.HEAVY) { baseHp*=2.5; spd*=0.7; col='#475569'; rad=18; rw*=1.5; }
            else if(type === ENEMY.MAGIC) { baseHp*=1.2; spd*=0.9; col='#c084fc'; rw*=1.2; }
            else if(type === ENEMY.FLYING) { baseHp*=0.7; spd*=1.3; col='#94a3b8'; rad=12; }
            else if(type === ENEMY.BOSS) { baseHp*=20; spd*=0.45; col='#7f1d1d'; rad=28; rw*=20; document.getElementById('boss-hp-container').classList.remove('hidden'); document.getElementById('boss-name').innerText = `WAVE ${wave} BOSS`; addShake(30); }
            
            rw = Math.floor(rw);
            let mobHp = baseHp * Math.pow(1.15, wave - 1);
            if(wave <= 3) mobHp *= 0.6; // Weaken early waves
            else if(wave === resumedWave) mobHp *= 0.3; // Much weaker enemies on first resume wave
            enemies.push(new Enemy(type, mobHp, spd, rw, rad, col));
        }

        function startWave() {
            waveData.on = true; waveData.swarm = false;
            waveData.toSpawn = 10 + wave * 3;
            if(wave <= 3) waveData.toSpawn = Math.floor(waveData.toSpawn * 0.6); // Fewer enemies early
            else if(wave === resumedWave) waveData.toSpawn = Math.floor(waveData.toSpawn * 0.3); // Easier first wave on resume
            waveData.spawned = 0; waveData.spawnT = 0;
            updateHUD();
        }

        function forceNextWave() {
            if(!waveData.on) {
                let bonus = Math.floor(waveData.t / 30);
                if(bonus > 0) { gold += bonus; texts.push(new FloatingText(CANVAS_W/2, 150, `+${bonus} EARLY BONUS`, '#facc15', 24, 60)); }
                startWave();
            }
        }
        
        function callSwarm() {
            if(waveData.on && !waveData.swarm) {
                waveData.swarm = true; waveData.swarmT = 300; // 5 seconds of 60fps
                texts.push(new FloatingText(CANVAS_W/2, 200, 'SWARM INCOMING!', '#dc2626', 30, 60));
                document.getElementById('btn-swarm').classList.add('hidden');
                sfx('cannon', 0.5);
            }
        }

        function updateGame() {
            if(screenShake > 0) screenShake--;
            
            // Swarm Logic
            if(waveData.swarm) { waveData.swarmT--; if(waveData.swarmT<=0) waveData.swarm = false; }

            if(!waveData.on) {
                if(autoSwarm && waveData.t > 0) {
                    waveData.t = 0; startWave(); callSwarm();
                } else {
                    waveData.t--;
                    if(waveData.t <= 0) startWave();
                }
            } else {
                if(waveData.spawned < waveData.toSpawn) {
                    waveData.spawnT--;
                    if(waveData.spawnT <= 0) {
                        spawnEnemy(); waveData.spawned++;
                        waveData.spawnT = Math.max(10, 60 - wave) / (waveData.swarm ? 3 : 1);
                    }
                } else if(enemies.length === 0) {
                    wave++; 
                    if (resumedWave !== null) resumedWave = null; // Reset resumedWave flag so next wave is normal
                    let hs = Store.load('hs') || 0; if(wave > hs) Store.save('hs', wave);
                    if(wave > 20 && wave % 10 === 1) availableSlots++;
                    metaGold += wave * 2; saveMeta();
                    waveData.on = false; waveData.t = 300; // 5 sec prep
                    updateHUD();
                }
            }

            towers.forEach(t => t.update());
            if(heroUnit) heroUnit.update();
            for(let i=enemies.length-1; i>=0; i--) { enemies[i].update(); if(enemies[i].hp<=0) enemies.splice(i,1); }
            for(let i=projs.length-1; i>=0; i--) { projs[i].update(); if(!projs[i].active) projs.splice(i,1); }
            for(let i=parts.length-1; i>=0; i--) { parts[i].update(); if(parts[i].life<=0) parts.splice(i,1); }
            for(let i=texts.length-1; i>=0; i--) { texts[i].update(); if(texts[i].life<=0) texts.splice(i,1); }
            for(let i=decals.length-1; i>=0; i--) { decals[i].update(); if(decals[i].life<=0) decals.splice(i,1); }
            
            if(hp <= 0 && state !== 'GAMEOVER') {
                state = 'GAMEOVER'; let hs = Store.load('hs') || 0; if(wave > hs) Store.save('hs', wave);
                document.getElementById('ring-menu').innerHTML = ''; document.getElementById('boss-hp-container').classList.add('hidden');
            }
            if(frames % 10 === 0) updateHUD();
        }

        function drawGame() {
            ctx.clearRect(0,0,CANVAS_W,CANVAS_H);
            if(state === 'MENU') return;
            
            ctx.save();
            if(screenShake > 0) ctx.translate(rand(-screenShake,screenShake), rand(-screenShake,screenShake));
            
            if(map) ctx.drawImage(bgCanvas, 0, 0); // Render static background
            
            if(state === 'PLAYING' || state === 'GAMEOVER') {
                scenery.forEach(s => {
                    if(s.type === 1) {
                        let bob = Math.sin(frames*0.05 + s.seed)*1.5;
                        ctx.fillStyle = '#2c4a16'; ctx.beginPath(); ctx.arc(s.x, s.y, 14, 0, Math.PI*2); ctx.fill();
                        ctx.fillStyle = '#3a5e1e'; ctx.beginPath(); ctx.arc(s.x-6, s.y-6 - bob, 10, 0, Math.PI*2); ctx.fill();
                        ctx.beginPath(); ctx.arc(s.x+6, s.y-4 - bob, 9, 0, Math.PI*2); ctx.fill();
                    } else if(s.type === 2) {
                        ctx.fillStyle = '#4a4e54'; ctx.beginPath(); ctx.arc(s.x, s.y, 8, 0, Math.PI*2); ctx.fill();
                        ctx.fillStyle = '#a8b39b'; ctx.beginPath(); ctx.arc(s.x-2, s.y-2, 4, 0, Math.PI*2); ctx.fill();
                    } else {
                        ctx.fillStyle = '#fff';
                        for(let i=0; i<4; i++) { ctx.beginPath(); ctx.arc(s.x + Math.cos(i*Math.PI/2)*4, s.y + Math.sin(i*Math.PI/2)*4, 2.5, 0, Math.PI*2); ctx.fill(); }
                        ctx.fillStyle = '#facc15'; ctx.beginPath(); ctx.arc(s.x, s.y, 2, 0, Math.PI*2); ctx.fill();
                    }
                });
                
                // Draw slot runes
                for(let r=0; r<ROWS; r++) {
                    for(let c=0; c<COLS; c++) {
                        if(map.grid[r][c] === CELL.SLOT && !towers.find(t=>t.c===c && t.r===r)) {
                            let cx = c*TILE_SIZE+32, cy = r*TILE_SIZE+32;
                            ctx.strokeStyle = `rgba(218, 165, 32, ${0.3 + Math.sin(frames*0.05)*0.2})`;
                            ctx.lineWidth = 2;
                            ctx.beginPath(); ctx.arc(cx, cy, 10, 0, Math.PI*2); ctx.stroke();
                            ctx.beginPath(); ctx.moveTo(cx-4, cy-4); ctx.lineTo(cx+4, cy+4); ctx.moveTo(cx+4, cy-4); ctx.lineTo(cx-4, cy+4); ctx.stroke();
                        }
                    }
                }

                decals.forEach(d => d.draw(ctx));
                // Sort entities by Y for pseudo-3D depth
                let ents = [...towers, ...enemies];
                if(heroUnit) ents.push(heroUnit);
                ents.sort((a,b) => (a.py||a.y) - (b.py||b.y));
                ents.forEach(e => e.draw(ctx));
                
                projs.forEach(p => p.draw(ctx));
                parts.forEach(p => p.draw(ctx));
                texts.forEach(t => t.draw(ctx));

                // Selection Highlight & Range
                if(selCell) {
                    let cx = selCell.c*TILE_SIZE, cy = selCell.r*TILE_SIZE;
                    ctx.strokeStyle = 'rgba(250, 204, 21, 0.8)'; ctx.lineWidth = 3; ctx.strokeRect(cx, cy, TILE_SIZE, TILE_SIZE);
                    let t = towers.find(tw => tw.c===selCell.c && tw.r===selCell.r);
                    if(t) { ctx.fillStyle='rgba(255,255,255,0.1)'; ctx.strokeStyle='rgba(255,255,255,0.3)'; ctx.beginPath(); ctx.arc(t.x, t.y, t.range, 0, Math.PI*2); ctx.fill(); ctx.stroke(); }
                }
                
                if(rallyTower) {
                    ctx.fillStyle = 'rgba(59,130,246,0.2)'; ctx.fillRect(0,0,CANVAS_W,CANVAS_H);
                    ctx.fillStyle = '#fff'; ctx.font = 'bold 30px sans-serif'; ctx.textAlign = 'center'; ctx.fillText("CLICK PATH TO SET RALLY POINT", CANVAS_W/2, 60);
                }

                if(state === 'GAMEOVER') {
                    ctx.fillStyle = 'rgba(0,0,0,0.8)'; ctx.fillRect(0,0,CANVAS_W,CANVAS_H);
                    ctx.fillStyle = '#ef4444'; ctx.font = 'bold 80px sans-serif'; ctx.textAlign = 'center'; ctx.fillText("KINGDOM FALLEN", CANVAS_W/2, CANVAS_H/2 - 20);
                    ctx.fillStyle = '#fff'; ctx.font = '30px sans-serif'; ctx.fillText(`Survive until Wave ${wave}`, CANVAS_W/2, CANVAS_H/2 + 40);
                    ctx.fillText("Click anywhere to return", CANVAS_W/2, CANVAS_H/2 + 100);
                }
            } else if(state === 'EDITOR') {
                ctx.fillStyle = 'rgba(255,255,255,0.1)';
                for(let r=0; r<ROWS; r++) for(let c=0; c<COLS; c++) ctx.strokeRect(c*TILE_SIZE, r*TILE_SIZE, TILE_SIZE, TILE_SIZE);
            }
            
            ctx.restore();
        }

        let lastT = 0;
        function loop(t) {
            requestAnimationFrame(loop);
            let dt = t - lastT; if(dt < 16) return; lastT = t;
            if(state === 'PLAYING' && !paused) {
                for(let s=0; s<speed; s++) { updateGame(); frames++; }
            }
            drawGame();
        }

        // ==========================================
        // 7. UI & INTERACTION
        // ==========================================
        function extractGold() {
            if(gold >= 400 && extractedGold < 3000) {
                gold -= 400;
                let amt = Math.min(200, 3000 - extractedGold);
                extractedGold += amt;
                metaGold += amt;
                saveMeta(); loadMeta(); updateHUD();
                sfx('coin');
                texts.push(new FloatingText(CANVAS_W/2, 100, `+${amt} META GOLD`, '#facc15', 30, 60));
            }
        }

        function updateHUD() {
            document.getElementById('hud-hp').innerText = hp;
            document.getElementById('hud-gold').innerText = Math.floor(gold);
            document.getElementById('hud-wave').innerText = wave;
            document.getElementById('btn-extract-gold').innerText = `💰 EXTRACT (${extractedGold}/3000)`;
            
            let btnSlot = document.getElementById('btn-add-slot');
            if(availableSlots > 0 || addSlotMode) {
                btnSlot.style.display = 'block';
                btnSlot.innerText = addSlotMode ? '🔲 CANCEL PLACEMENT' : `🏗️ ADD SLOT (${availableSlots})`;
                btnSlot.style.background = addSlotMode ? '#dc2626' : '#8b5cf6';
            } else {
                btnSlot.style.display = 'none';
            }
            
            if(items.dynamite > 0) { document.getElementById('btn-item-dynamite').classList.remove('hidden'); document.getElementById('hud-dynamite').innerText = items.dynamite; } else document.getElementById('btn-item-dynamite').classList.add('hidden');
            if(items.freeze > 0) { document.getElementById('btn-item-freeze').classList.remove('hidden'); document.getElementById('hud-freeze').innerText = items.freeze; } else document.getElementById('btn-item-freeze').classList.add('hidden');
            
            let btnNext = document.getElementById('btn-next-wave');
            let btnSwarm = document.getElementById('btn-swarm');
            if(waveData.on || enemies.length > 0) {
                btnNext.classList.add('hidden');
                if(waveData.on && !waveData.swarm && !autoSwarm) btnSwarm.classList.remove('hidden');
                else btnSwarm.classList.add('hidden');
            } else {
                if(!autoSwarm) {
                    btnNext.classList.remove('hidden'); btnSwarm.classList.add('hidden');
                    btnNext.innerText = `⚠️ NEXT WAVE (${Math.ceil(waveData.t/60)}s)`;
                } else {
                    btnNext.classList.add('hidden'); btnSwarm.classList.add('hidden');
                }
            }
        }

        function updateWaypoints() {
            let st = null, en = null;
            for(let r=0; r<ROWS; r++) for(let c=0; c<COLS; c++) {
                if(map.grid[r][c]===CELL.START) st={x:c,y:r};
                if(map.grid[r][c]===CELL.END) en={x:c,y:r};
            }
            if(!st || !en) { waypoints = []; return; }
            let q = [st], cameFrom = {}; cameFrom[`${st.x},${st.y}`] = null;
            while(q.length>0) {
                let cur = q.shift(); if(cur.x===en.x && cur.y===en.y) break;
                [{x:cur.x+1,y:cur.y},{x:cur.x-1,y:cur.y},{x:cur.x,y:cur.y+1},{x:cur.x,y:cur.y-1}].forEach(n => {
                    if(n.x>=0 && n.x<COLS && n.y>=0 && n.y<ROWS && [CELL.PATH,CELL.START,CELL.END].includes(map.grid[n.y][n.x]) && !cameFrom.hasOwnProperty(`${n.x},${n.y}`)) {
                        cameFrom[`${n.x},${n.y}`] = cur; q.push(n);
                    }
                });
            }
            waypoints = []; let curr = en;
            while(curr) { waypoints.push({x:curr.x*TILE_SIZE+32, y:curr.y*TILE_SIZE+32}); curr=cameFrom[`${curr.x},${curr.y}`]; }
            waypoints.reverse();
        }

        function startGame(opts) {
            let m = Store.load('map');
            map = (!opts.defaultMap && m) ? m : JSON.parse(JSON.stringify(defaultMap));
            
            let st = null, en = null;
            for(let r=0; r<ROWS; r++) for(let c=0; c<COLS; c++) {
                if(map.grid[r][c]===CELL.START) st={x:c,y:r};
                if(map.grid[r][c]===CELL.END) en={x:c,y:r};
            }
            updateWaypoints();
            scenery = [];
            for(let r=0; r<ROWS; r++) {
                for(let c=0; c<COLS; c++) {
                    if(map.grid[r][c] === CELL.EMPTY) {
                        if(Math.random() < 0.25) {
                            scenery.push({
                                x: c*TILE_SIZE + rand(10, 54),
                                y: r*TILE_SIZE + rand(10, 54),
                                type: Math.floor(rand(1, 4)),
                                seed: rand(0, 100)
                            });
                        }
                    }
                }
            }


            enemies=[]; towers=[]; projs=[]; parts=[]; texts=[]; decals=[];
            heroUnit = new HeroUnit(activeHero, heroes[activeHero].level);
            
            if(opts.resume) {
                let hs = Store.load('hs') || 1;
                wave = hs;
                resumedWave = wave;
                gold = wave > 1 ? 12000 : 350;
                availableSlots = Math.max(0, Math.floor((wave - 11) / 10));
                let savedMap = Store.load('resumeMap');
                if(savedMap) map = savedMap;
            } else {
                wave = 1;
                resumedWave = null;
                gold = 350;
                availableSlots = 0;
            }
            hp = 20; frames = 0; speed = 1; paused = false; autoSwarm = false; extractedGold = 0;
            Store.save('resumeMap', map);
            let btnAuto = document.getElementById('btn-auto-wave');
            if(btnAuto) { btnAuto.innerText = '🤖 AUTO SWARM: OFF'; btnAuto.style.background = ''; btnAuto.style.color = ''; }
            selCell = null; rallyTower = null; waveData = { on:false, t:180, toSpawn:0, spawnT:0, spawned:0, swarm:false, swarmT:0 };
            
            document.getElementById('ui-main-menu').classList.add('hidden');
            document.getElementById('ui-editor').classList.add('hidden');
            document.getElementById('ui-game').classList.remove('hidden');
            document.getElementById('ring-menu').innerHTML = '';
            document.getElementById('hud-speed').innerText = '1x';
            document.getElementById('boss-hp-container').classList.add('hidden');
            
            renderTerrain(); state = 'PLAYING'; updateHUD();
        }

        // Ring Menu Logic
        function closeRing() { document.getElementById('ring-menu').innerHTML = ''; selCell = null; }
        
        function actionBuild(c, r, type) {
            let s = TOWER_STATS[type];
            if(gold >= s.cost) { gold-=s.cost; towers.push(new Tower(c,r,type)); sfx('build'); closeRing(); updateHUD(); }
        }
        
        function actionUpg(t, branch) {
            if(t.upgrade(branch)) { closeRing(); updateHUD(); }
        }
        
        function actionSell(t) {
            gold += Math.floor(t.spent * 0.7);
            towers = towers.filter(x => x!==t);
            if(t.type===TOWER.BARRACKS) t.soldiers.forEach(s => { if(s.target) s.target.blocked=false; });
            sfx('coin'); closeRing(); updateHUD();
        }

        function createRingBtn(icon, cost, desc, ang, onclick, isSell=false, isRally=false) {
            let btn = document.createElement('button'); btn.className = `ring-btn ${isSell?'sell':(isRally?'rally':'')}`;
            btn.innerHTML = `${icon}<br><span class="cost">${cost?'$'+cost:''}</span><span class="desc">${desc}</span>`;
            let r = 70; btn.style.transform = `translate(calc(-50% + ${Math.cos(ang)*r}px), calc(-50% + ${Math.sin(ang)*r}px))`;
            btn.onclick = onclick;
            if(cost && !isSell && gold < cost) btn.classList.add('disabled');
            return btn;
        }

        function openRing(c, r, tw) {
            let rm = document.getElementById('ring-menu'); rm.innerHTML = '';
            rm.style.left = (c*TILE_SIZE + 32)/CANVAS_W*100 + '%'; rm.style.top = (r*TILE_SIZE + 32)/CANVAS_H*100 + '%';
            
            if(!tw) {
                let types = [TOWER.ARCHER, TOWER.MAGE, TOWER.CANNON, TOWER.BARRACKS];
                let icons = ['🏹','🔮','💣','🛡️'];
                types.forEach((type, i) => {
                    let ang = -Math.PI/2 + (Math.PI*2/4)*i;
                    rm.appendChild(createRingBtn(icons[i], TOWER_STATS[type].cost, TOWER_STATS[type].n, ang, () => actionBuild(c,r,type)));
                });
            } else {
                rm.appendChild(createRingBtn('💵', Math.floor(tw.spent*0.7), 'SELL', Math.PI/2, () => actionSell(tw), true));
                
                if(tw.type === TOWER.BARRACKS) {
                    rm.appendChild(createRingBtn('🚩', null, 'RALLY', Math.PI/2 + Math.PI*2/3, () => { rallyTower=tw; rm.innerHTML=''; }, false, true));
                }

                if(tw.tier < 3) {
                    let cst = Math.floor(TOWER_STATS[tw.type].cost * (tw.tier+1) * 0.8);
                    rm.appendChild(createRingBtn('⬆️', cst, 'UPGRADE', -Math.PI/2, () => actionUpg(tw)));
                } else if(tw.tier === 3) {
                    let bA = BRANCHES[tw.type].A, bB = BRANCHES[tw.type].B;
                    rm.appendChild(createRingBtn(bA.n, bA.cost, bA.desc, -Math.PI/4 - 0.2, () => actionUpg(tw, 'A')));
                    rm.appendChild(createRingBtn(bB.n, bB.cost, bB.desc, -Math.PI/2 - 0.6, () => actionUpg(tw, 'B')));
                }
            }
        }

        function handleTap(x, y) {
            if(state === 'EDITOR') { handleEdit(x, y); return; }
            if(state === 'GAMEOVER') { backToMenu(); return; }
            if(state !== 'PLAYING') return;
            
            if(heroUnit) {
                if(dist(x, y, heroUnit.x, heroUnit.y) < 30) {
                    heroUnit.sel = !heroUnit.sel;
                    if(heroUnit.sel) { selCell = null; rallyTower = null; closeRing(); sfx('click'); return; }
                } else if(heroUnit.sel) {
                    heroUnit.tgtX = x; heroUnit.tgtY = y;
                    heroUnit.sel = false;
                    parts.push(new Particle(x, y, '#3b82f6', 5, 20));
                    sfx('click'); return;
                }
            }
            
            let c = Math.floor(x/TILE_SIZE), r = Math.floor(y/TILE_SIZE);
            if(c>=0 && c<COLS && r>=0 && r<ROWS) {
                if(addSlotMode) {
                    if(map.grid[r][c] === CELL.EMPTY) {
                        map.grid[r][c] = CELL.SLOT;
                        availableSlots--;
                        addSlotMode = false;
                        Store.save('resumeMap', map);
                        renderTerrain();
                        updateHUD();
                        sfx('build');
                    }
                    return;
                }
                if(rallyTower) {
                    if([CELL.PATH,CELL.START,CELL.END].includes(map.grid[r][c])) {
                        rallyTower.rallyX = c*TILE_SIZE+32; rallyTower.rallyY = r*TILE_SIZE+32;
                        rallyTower.soldiers.forEach(s => { s.state='MOVE'; if(s.target){s.target.blocked=false; s.target=null;} });
                        rallyTower = null; sfx('build');
                    }
                    return;
                }
                
                if(map.grid[r][c] === CELL.SLOT) {
                    if(selCell && selCell.c===c && selCell.r===r) { closeRing(); return; } // Toggle off
                    selCell = {c, r};
                    openRing(c, r, towers.find(t => t.c===c && t.r===r));
                } else closeRing();
            }
        }

        // Editor
        function openEditor() {
            map = Store.load('map') || JSON.parse(JSON.stringify(defaultMap));
            document.getElementById('ui-main-menu').classList.add('hidden');
            document.getElementById('ui-editor').classList.remove('hidden');
            bgCtx.clearRect(0,0,CANVAS_W,CANVAS_H); state = 'EDITOR'; renderTerrain();
        }
        function editorSetBrush(b, btn) { brush = b; document.querySelectorAll('.editor-bar button').forEach(x=>x.classList.remove('brush-active')); btn.classList.add('brush-active'); }
        function handleEdit(x, y) {
            let c = Math.floor(x/TILE_SIZE), r = Math.floor(y/TILE_SIZE);
            if(c>=0 && c<COLS && r>=0 && r<ROWS) {
                if(brush===CELL.START || brush===CELL.END) {
                    for(let i=0;i<ROWS;i++) for(let j=0;j<COLS;j++) if(map.grid[i][j]===brush) map.grid[i][j]=CELL.EMPTY;
                }
                map.grid[r][c] = brush; 
                if([CELL.EMPTY, CELL.PATH, CELL.START, CELL.END].includes(brush)) updateWaypoints();
                renderTerrain();
            }
        }
        function saveAndPlayCustom() {
            let s=0, e=0; for(let i=0;i<ROWS;i++) for(let j=0;j<COLS;j++){ if(map.grid[i][j]===CELL.START) s++; if(map.grid[i][j]===CELL.END) e++; }
            if(s!==1 || e!==1) { alert("Must have EXACTLY ONE Start (🔵) and ONE Base (🔴)"); return; }
            Store.save('map', map); startGame({ defaultMap: false, resume: false });
        }

        function backToMenu() {
            ['ui-editor', 'ui-game', 'boss-hp-container'].forEach(id => document.getElementById(id).classList.add('hidden'));
            document.getElementById('ui-main-menu').classList.remove('hidden');
            document.getElementById('high-score-display').innerText = Store.load('hs') || 0;
            state = 'MENU'; closeRing();
        }

        function toggleSpeed() { speed = speed===1?2:1; document.getElementById('hud-speed').innerText = speed+'x'; }
        function togglePause() { paused = !paused; }
        
        function toggleAddSlot() {
            if(availableSlots > 0 || addSlotMode) {
                addSlotMode = !addSlotMode;
                updateHUD();
            }
        }
        
        function useItem(item) {
            if(items[item] > 0) {
                items[item]--;
                saveMeta();
                if(item === 'dynamite') {
                    enemies.forEach(e => e.takeDmg(1000, 'true', 'headshot'));
                    sfx('hit'); addShake(50);
                } else if(item === 'freeze') {
                    enemies.forEach(e => e.stun = 300); // 5 sec stun
                    sfx('build');
                }
                updateHUD();
            }
        }
        
        function toggleAuto() {
            autoSwarm = !autoSwarm;
            let btn = document.getElementById('btn-auto-wave');
            if(autoSwarm) {
                btn.innerText = '🤖 AUTO SWARM: ON';
                btn.style.background = '#eab308';
                btn.style.color = '#000';
            } else {
                btn.innerText = '🤖 AUTO SWARM: OFF';
                btn.style.background = '';
                btn.style.color = '';
            }
        }

        function saveMeta() {
            Store.save('metaGold', metaGold);
            Store.save('metaGems', metaGems);
            Store.save('items', items);
            Store.save('heroes', heroes);
            Store.save('activeHero', activeHero);
        }
        
        function loadMeta() {
            metaGold = Store.load('metaGold') || 0;
            metaGems = Store.load('metaGems') || 0;
            items = Store.load('items') || { dynamite: 0, freeze: 0, midas: 0 };
            heroes = Store.load('heroes') || { archer: { unlocked: true, level: 1, xp: 0 }, paladin: { unlocked: false, level: 1, xp: 0 }, dragon: { unlocked: false, level: 1, xp: 0 } };
            activeHero = Store.load('activeHero') || 'archer';
            
            document.getElementById('meta-gold-display').innerText = metaGold;
            document.getElementById('meta-gems-display').innerText = metaGems;
            document.getElementById('resume-wave-display').innerText = Store.load('hs') || 1;
            
            ['archer', 'paladin', 'dragon'].forEach(h => {
                let el = document.getElementById('hero-'+h);
                if(heroes[h].unlocked) {
                    el.classList.remove('locked');
                    let btn = document.getElementById('hero-'+h+'-btn');
                    if(btn) btn.style.display = 'none';
                    let lvlTxt = document.getElementById('hero-'+h+'-lvl');
                    if(lvlTxt) { lvlTxt.classList.remove('hidden'); lvlTxt.innerText = 'LVL ' + heroes[h].level; }
                }
                el.classList.remove('active');
            });
            document.getElementById('hero-'+activeHero).classList.add('active');
            document.getElementById('hero-active-name').innerText = activeHero;
            let ah = heroes[activeHero];
            document.getElementById('hero-active-lvl').innerText = ah.level;
            document.getElementById('hero-upgrade-cost').innerText = Math.floor(100 * Math.pow(1.5, ah.level-1));
            
            document.getElementById('item-dynamite-count').innerText = items.dynamite;
            document.getElementById('item-freeze-count').innerText = items.freeze;
        }

        function openHeroHall() { document.getElementById('ui-hero-hall').classList.remove('hidden'); loadMeta(); }
        function openArmory() { document.getElementById('ui-armory').classList.remove('hidden'); loadMeta(); }
        
        function selectHero(h) {
            if(heroes[h].unlocked) { activeHero = h; saveMeta(); loadMeta(); }
        }
        function upgradeHero() {
            let ah = heroes[activeHero];
            let cost = Math.floor(100 * Math.pow(1.5, ah.level-1));
            if(metaGold >= cost) {
                metaGold -= cost; ah.level++; saveMeta(); loadMeta(); sfx('build');
            } else alert('Not enough gold!');
        }
        function buyHero(h) {
            let cost = h==='paladin'?500:20;
            let isGem = h==='dragon';
            if((isGem && metaGems >= cost) || (!isGem && metaGold >= cost)) {
                if(isGem) metaGems -= cost; else metaGold -= cost;
                heroes[h].unlocked = true; activeHero = h;
                saveMeta(); loadMeta(); sfx('build');
            } else {
                alert("Not enough resources!");
            }
        }
        function buyItem(it) {
            let cost = it==='dynamite'?2:3;
            if(metaGems >= cost) {
                metaGems -= cost; items[it]++;
                saveMeta(); loadMeta(); sfx('build');
            } else alert("Not enough gems!");
        }

        // Input Setup
        window.onload = () => {
            loadMeta();
            canvas = document.getElementById('gameCanvas'); ctx = canvas.getContext('2d');
            bgCanvas = document.createElement('canvas'); bgCanvas.width=CANVAS_W; bgCanvas.height=CANVAS_H; bgCtx = bgCanvas.getContext('2d');
            
            let getPos = (e) => {
                let r = canvas.getBoundingClientRect();
                return { x: (e.clientX - r.left)*(CANVAS_W/r.width), y: (e.clientY - r.top)*(CANVAS_H/r.height) }; // using precise ratio for both
            };
            
            canvas.addEventListener('pointerdown', (e) => { if(e.button!==0 && e.pointerType==='mouse') return; drawing=true; let p=getPos(e); handleTap(p.x, p.y); });
            canvas.addEventListener('pointermove', (e) => { if(state==='EDITOR' && drawing) { let p=getPos(e); handleEdit(p.x, p.y); } });
            window.addEventListener('pointerup', () => drawing=false);
            
            document.getElementById('high-score-display').innerText = Store.load('hs') || 0;
            requestAnimationFrame(loop);
        };
    
