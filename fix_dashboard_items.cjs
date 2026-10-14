const fs = require('fs');
let code = fs.readFileSync('index.html', 'utf8');

const oldItemHTML = `                html += \`<div class="item-card \${active}" onclick="useRlItem('\${k}')" style="display:flex; flex-direction:column; justify-content:flex-start; align-items:center; padding: 8px;">
                    <div class="item-qty" style="top:-5px; right:-5px; font-size:12px;">\${qty}</div>
                    <div style="display:flex; align-items:center; gap:4px; margin-bottom:4px;">
                        <span style="font-size:16px;">\${it.icon}</span>
                        <span style="font-size:12px; font-weight:bold;">\${it.n}</span>
                    </div>
                    <div style="font-size:10px; color:#94a3b8; text-align:center; line-height:1.2; margin-bottom:auto;">\${it.desc}</div>
                    <div style="display:flex; gap:4px; width:100%; justify-content:space-between; margin-top:6px;">
                        <button class="btn-buy gold" onclick="event.stopPropagation(); buyRlItem('\${k}', 'gold')" style="flex:1; padding:4px 0; font-size:10px; border-radius:4px;">💰 \${it.gold}</button>
                        <button class="btn-buy gem" onclick="event.stopPropagation(); buyRlItem('\${k}', 'gem')" style="flex:1; padding:4px 0; font-size:10px; border-radius:4px; background:#2563eb; color:white;">💎 \${it.gem}</button>
                    </div>
                </div>\`;`;

const newItemHTML = `                html += \`<div class="item-card \${active}" onclick="useRlItem('\${k}')" style="display:flex; flex-direction:column; justify-content:center; align-items:center; padding: 4px 6px;">
                    <div class="item-qty" style="top:-5px; right:-5px; font-size:11px;">\${qty}</div>
                    <div style="display:flex; align-items:center; gap:4px; margin-bottom:2px;">
                        <span style="font-size:14px;">\${it.icon}</span>
                        <span style="font-size:11px; font-weight:bold;">\${it.n}</span>
                    </div>
                    <div style="font-size:9px; color:#94a3b8; text-align:center; line-height:1.1; margin-bottom:2px;">\${it.desc}</div>
                    <div style="display:flex; gap:4px; width:100%; justify-content:space-between; margin-top:auto;">
                        <button class="btn-buy gold" onclick="event.stopPropagation(); buyRlItem('\${k}', 'gold')" style="flex:1; padding:2px 0; font-size:10px; border-radius:4px;">💰 \${it.gold}</button>
                        <button class="btn-buy gem" onclick="event.stopPropagation(); buyRlItem('\${k}', 'gem')" style="flex:1; padding:2px 0; font-size:10px; border-radius:4px; background:#2563eb; color:white;">💎 \${it.gem}</button>
                    </div>
                </div>\`;`;

code = code.replace(oldItemHTML, newItemHTML);
fs.writeFileSync('index.html', code);
