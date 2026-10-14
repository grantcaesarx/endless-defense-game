const fs = require('fs');
let code = fs.readFileSync('index.html', 'utf8');

const newTowerDraw = `
            draw(c) {
                if(this.type === 'lightning' || this.type === 'beam') return; // Handled instantly or in tower

                let x = this.x, y = this.y;
                let t = this.tier;
                let bob = this.anim > 0 ? Math.sin(this.anim)*2 : 0;
                
                c.save();
                c.translate(x, y + bob);
                
                let img = null;
                if(this.type === TOWER.ARCHER) img = SVGS.archerTower;
                else if(this.type === TOWER.MAGE) img = SVGS.mageTower;
                else if(this.type === TOWER.CANNON) img = SVGS.cannonTower;
                else if(this.type === TOWER.BARRACKS) img = SVGS.barracksTower;

                if (img && img.complete) {
                    // Slightly scale based on tier (t)
                    let scale = 1 + (t-1)*0.1;
                    c.scale(scale, scale);
                    c.drawImage(img, -img.width / 2, -img.height + 25); // Offset to ground
                }
                
                c.restore();

                // Draw Soldiers for barracks
                this.soldiers.forEach(s => s.draw(c));
            }
`;

code = code.replace(/draw\(c\) \{\n                if\(this\.type === 'lightning' \|\| this\.type === 'beam'\) return; \/\/ Handled instantly or in tower[\s\S]*?this\.soldiers\.forEach\(s => s\.draw\(c\)\);\n            \}/, newTowerDraw.trim());
fs.writeFileSync('index.html', code);
console.log("Patched Tower draw");
