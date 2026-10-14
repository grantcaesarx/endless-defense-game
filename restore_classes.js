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

