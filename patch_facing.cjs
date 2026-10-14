const fs = require('fs');
let code = fs.readFileSync('index.html', 'utf8');

// For Enemy
code = code.replace(/this\.x \+= \(dx\/d\)\*this\.spd; this\.y \+= \(dy\/d\)\*this\.spd;/, "this.x += (dx/d)*this.spd; this.y += (dy/d)*this.spd; this.facingLeft = dx < 0;");

// For HeroUnit
code = code.replace(/this\.x \+= Math\.cos\(ang\) \* this\.spd; this\.y \+= Math\.sin\(ang\) \* this\.spd;/, "let vx = Math.cos(ang) * this.spd; this.x += vx; this.y += Math.sin(ang) * this.spd; this.facingLeft = vx < 0;");

// For Soldier (return to tower or move to rally or move to enemy)
// We'll just patch any movement assignment.
code = code.replace(/let ang = Math\.atan2\(dy, dx\);\n                    this\.x \+= Math\.cos\(ang\)\*1\.5; this\.y \+= Math\.sin\(ang\)\*1\.5;/g, "let ang = Math.atan2(dy, dx); let vx = Math.cos(ang)*1.5; this.x += vx; this.y += Math.sin(ang)*1.5; this.facingLeft = vx < 0;");
code = code.replace(/let ang = Math\.atan2\(dy, dx\);\n                        this\.x \+= Math\.cos\(ang\)\*1\.5; this\.y \+= Math\.sin\(ang\)\*1\.5;/g, "let ang = Math.atan2(dy, dx); let vx = Math.cos(ang)*1.5; this.x += vx; this.y += Math.sin(ang)*1.5; this.facingLeft = vx < 0;");

fs.writeFileSync('index.html', code);
console.log("Patched facingLeft");
