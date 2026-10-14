const fs = require('fs');
let code = fs.readFileSync('index.html', 'utf8');

// The layout was item-qty -> item-title -> item-desc -> item-buttons.
// Let's modify renderDashboard to format it tighter and better centered
const oldRender = `                html += \`<div class="item-card \${active}" onclick="useRlItem('\${k}')">
                    <div class="item-qty">\${qty}</div>
                    <div class="item-title">\${it.icon} \${it.n}</div>
                    <div class="item-desc">\${it.desc}</div>
                    <div class="item-buttons">
                        <button class="btn-buy gold" onclick="event.stopPropagation(); buyRlItem('\${k}', 'gold')">💰 \${it.gold}</button>
                        <button class="btn-buy gem" onclick="event.stopPropagation(); buyRlItem('\${k}', 'gem')">💎 \${it.gem}</button>
                    </div>
                </div>\`;`;

const newRender = `                html += \`<div class="item-card \${active}" onclick="useRlItem('\${k}')" style="display:flex; flex-direction:column; justify-content:center; align-items:center; padding: 10px;">
                    <div class="item-qty">\${qty}</div>
                    <div style="font-size:20px; margin-bottom:2px;">\${it.icon}</div>
                    <div style="font-size:13px; font-weight:bold; margin-bottom:2px;">\${it.n}</div>
                    <div style="font-size:11px; color:#cbd5e1; text-align:center; margin-bottom:8px;">\${it.desc}</div>
                    <div style="display:flex; gap:6px; width:100%; justify-content:space-between; margin-top:auto;">
                        <button class="btn-buy gold" onclick="event.stopPropagation(); buyRlItem('\${k}', 'gold')" style="flex:1; padding:4px; font-size:11px;">💰 \${it.gold}</button>
                        <button class="btn-buy gem" onclick="event.stopPropagation(); buyRlItem('\${k}', 'gem')" style="flex:1; padding:4px; font-size:11px;">💎 \${it.gem}</button>
                    </div>
                </div>\`;`;

code = code.replace(oldRender, newRender);

fs.writeFileSync('index.html', code);
console.log("Dashboard rendering optimized");
