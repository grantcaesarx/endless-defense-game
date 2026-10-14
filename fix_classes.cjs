const fs = require('fs');
let index = fs.readFileSync('index.html', 'utf8');
let restore = fs.readFileSync('restore_classes.js', 'utf8');

// restore_classes.js ends with `class Soldier {`, we don't want to duplicate `class Soldier {`.
// Let's strip the last line if it matches `class Soldier {`.
let lines = restore.split('\n');
if(lines[lines.length - 1].trim() === '') lines.pop();
if(lines[lines.length - 1].includes('class Soldier')) lines.pop();
restore = lines.join('\n') + '\n';

let newIndex = index.replace(/class FloatingText \{[\s\S]*?(?=class Soldier \{)/, restore);
fs.writeFileSync('index.html', newIndex);
console.log("Restored missing classes!");
