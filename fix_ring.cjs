const fs = require('fs');
let code = fs.readFileSync('index.html', 'utf8');

const ringFix = `let rect = canvas.getBoundingClientRect();
        let wrapperRect = document.getElementById('game-wrapper').getBoundingClientRect();
        let scaleX = rect.width / CANVAS_W;
        let scaleY = rect.height / CANVAS_H;
        let screenX = (rect.left - wrapperRect.left) + cx * scaleX;
        let screenY = (rect.top - wrapperRect.top) + cy * scaleY;`;

code = code.replace(/let rect = canvas\.getBoundingClientRect\(\);[\s\S]*?let screenY = cy \* scaleY;/, ringFix);

fs.writeFileSync('index.html', code);
console.log("Ring menu positioned correctly");
