const fs = require('fs');
let code = fs.readFileSync('index.html', 'utf8');

const heroSVGs = `
            soldier: createSVG(40, 40, \`
                <g transform="translate(20, 25)">
                    <!-- Shield -->
                    <path d="M-12,-10 L-4,-10 L-4,5 L-8,10 L-12,5 Z" fill="#1e3a8a" stroke="#fbbf24" stroke-width="1.5"/>
                    <!-- Body -->
                    <rect x="-6" y="-5" width="12" height="15" fill="#3b82f6" stroke="#222" stroke-width="1.5" rx="2"/>
                    <!-- Shoulders -->
                    <circle cx="-6" cy="-2" r="4" fill="#e2e8f0" stroke="#222" stroke-width="1"/>
                    <circle cx="6" cy="-2" r="4" fill="#e2e8f0" stroke="#222" stroke-width="1"/>
                    <!-- Head -->
                    <circle cx="0" cy="-12" r="7" fill="#f8fafc" stroke="#222" stroke-width="1.5"/>
                    <rect x="-4" y="-14" width="8" height="3" fill="#0f172a"/>
                    <!-- Sword -->
                    <rect x="8" y="-15" width="3" height="18" fill="#cbd5e1" stroke="#222" stroke-width="1"/>
                    <rect x="5" y="-2" width="9" height="2" fill="#475569"/>
                </g>\`),
            heroArcher: createSVG(50, 50, \`
                <g transform="translate(25, 30)">
                    <rect x="-8" y="-5" width="16" height="15" fill="#166534" stroke="#222" stroke-width="1.5" rx="3"/>
                    <!-- Bow -->
                    <path d="M12,12 A15 15 0 0 0 12,-12" fill="none" stroke="#b45309" stroke-width="2.5" stroke-linecap="round"/>
                    <path d="M12,12 L12,-12" stroke="#fff" stroke-width="0.5"/>
                    <!-- Head & Hood -->
                    <circle cx="0" cy="-12" r="8" fill="#fcd34d" stroke="#222" stroke-width="1.5"/>
                    <path d="M-9,-12 A9 9 0 0 1 9,-12 L0,-24 Z" fill="#14532d" stroke="#222" stroke-width="1.5" stroke-linejoin="round"/>
                </g>\`),
            heroPaladin: createSVG(60, 60, \`
                <g transform="translate(30, 35)">
                    <!-- Body Armor -->
                    <rect x="-12" y="-5" width="24" height="20" fill="#e2e8f0" stroke="#222" stroke-width="2" rx="3"/>
                    <rect x="-12" y="10" width="24" height="5" fill="#fbbf24" stroke="#222" stroke-width="1.5"/>
                    <!-- Hammer -->
                    <rect x="15" y="-20" width="12" height="18" fill="#cbd5e1" stroke="#222" stroke-width="2" rx="1"/>
                    <rect x="19" y="-2" width="4" height="22" fill="#78350f" stroke="#222" stroke-width="1.5"/>
                    <!-- Head & Plume -->
                    <circle cx="0" cy="-14" r="10" fill="#f8fafc" stroke="#222" stroke-width="2"/>
                    <rect x="-6" y="-16" width="12" height="4" fill="#0f172a"/>
                    <path d="M-3,-24 L-5,-32 L5,-32 L3,-24 Z" fill="#991b1b" stroke="#222" stroke-width="1.5" stroke-linejoin="round"/>
                </g>\`),
            heroDragon: createSVG(70, 70, \`
                <g transform="translate(35, 35)">
                    <!-- Wings (Back) -->
                    <path d="M0,0 L-25,-25 L-30,-5 Z" fill="#7f1d1d" stroke="#222" stroke-width="2" stroke-linejoin="round"/>
                    <!-- Body -->
                    <ellipse cx="0" cy="5" rx="16" ry="12" fill="#b91c1c" stroke="#222" stroke-width="2"/>
                    <!-- Tail -->
                    <path d="M-15,5 Q-30,10 -25,25 Q-15,20 -10,15" fill="#b91c1c" stroke="#222" stroke-width="2"/>
                    <!-- Head -->
                    <circle cx="16" cy="-8" r="10" fill="#b91c1c" stroke="#222" stroke-width="2"/>
                    <rect x="20" y="-12" width="3" height="3" fill="#fef08a"/>
                    <!-- Horns -->
                    <path d="M10,-15 L5,-25 L15,-17 Z" fill="#fcd34d" stroke="#222" stroke-width="1.5" stroke-linejoin="round"/>
                </g>\`)
`;

code = code.replace(/end: createSVG\(64, 64, `[\s\S]*?`\)/, match => match + ",\n" + heroSVGs);
fs.writeFileSync('index.html', code);
console.log("Added Hero SVGs");
