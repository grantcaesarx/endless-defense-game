const fs = require('fs');
let code = fs.readFileSync('index.html', 'utf8');

const injection = `<button onclick="useItem('dynamite')" id="btn-item-dynamite" class="hidden" style="background:#dc2626; border-color:#991b1b; padding:4px 10px; border-radius:4px; font-weight:bold; border:none; cursor:pointer;">🧨 <span id="hud-dynamite">0</span></button>
                    <button onclick="useItem('freeze')" id="btn-item-freeze" class="hidden" style="background:#3b82f6; border-color:#2563eb; padding:4px 10px; border-radius:4px; font-weight:bold; border:none; cursor:pointer;">❄️ <span id="hud-freeze">0</span></button>
                    <button id="btn-auto-wave"`;

code = code.replace(/<button id="btn-auto-wave"/, injection);
fs.writeFileSync('index.html', code);
console.log("Injected dynamite and freeze buttons");
