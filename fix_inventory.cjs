const fs = require('fs');
let code = fs.readFileSync('index.html', 'utf8');

// 1. Initial declaration: let rlInventory = Store.load('rlInventory') || { ... }
code = code.replace(/let rlInventory = \{ heal: 0, thunder: 0, guards: 0, archers: 0, titan: 0, dragon: 0, warp: 0, nuke: 0 \};/, `let rlInventory = Store.load('rlInventory') || { heal: 0, thunder: 0, guards: 0, archers: 0, titan: 0, dragon: 0, warp: 0, nuke: 0 };`);

// 2. Remove resets of rlInventory in startGame
code = code.replace(/rlInventory = \{ heal: 0, thunder: 0, guards: 0, archers: 0, titan: 0, dragon: 0, warp: 0, nuke: 0 \};/g, `// rlInventory persists across runs`);

// 3. Save rlInventory whenever it changes
code = code.replace(/rlInventory\[id\]\+\+;/g, `rlInventory[id]++; Store.save('rlInventory', rlInventory);`);
code = code.replace(/rlInventory\[id\]--;/g, `rlInventory[id]--; Store.save('rlInventory', rlInventory);`);

fs.writeFileSync('index.html', code);
console.log("Inventory persistence fixed");
