const fs = require('fs');
let code = fs.readFileSync('index.html', 'utf8');

code = code.replace(
    "                    if(this.hp <= 0) {\n                        this.targets.forEach(e => e.blocked = false);\n                        this.targets = [];\n                        this.state = 'DEAD';\n                        this.tw.soldiers = this.tw.soldiers.filter(s => s!==this);\n                        return;\n                    }",
    "                    if(this.hp <= 0) {\n                        this.targets.forEach(e => e.blocked = false);\n                        this.targets = [];\n                        this.state = 'DEAD';\n                        return;\n                    }"
);

code = code.replace(
    "                if(this.tw.type === 'archers') {\n                    if(this.hp <= 0) {\n                        this.state = 'DEAD';\n                        this.tw.soldiers = this.tw.soldiers.filter(s => s!==this);\n                        return;\n                    }",
    "                if(this.tw.type === 'archers') {\n                    if(this.hp <= 0) {\n                        this.state = 'DEAD';\n                        return;\n                    }"
);

fs.writeFileSync('index.html', code);
