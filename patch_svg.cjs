const fs = require('fs');
let code = fs.readFileSync('index.html', 'utf8');

// We will inject the SVGs right after globals
const svgCode = `
        const createSVG = (w, h, content) => {
            const img = new Image();
            const svgStr = \`<svg xmlns="http://www.w3.org/2000/svg" width="\${w}" height="\${h}" viewBox="0 0 \${w} \${h}">\${content}</svg>\`;
            img.src = 'data:image/svg+xml;utf8,' + encodeURIComponent(svgStr);
            return img;
        };

        const SVGS = {
            goblin: createSVG(60, 60, \`
                <defs>
                    <linearGradient id="gobSkin" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#84b846"/><stop offset="100%" stop-color="#4d6b28"/></linearGradient>
                    <linearGradient id="gobHat" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#69463d"/><stop offset="100%" stop-color="#3b2722"/></linearGradient>
                </defs>
                <g transform="translate(30, 45)">
                    <!-- Ears -->
                    <path d="M-10,-20 L-22,-28 L-10,-10 Z" fill="url(#gobSkin)" stroke="#222" stroke-width="2" stroke-linejoin="round"/>
                    <path d="M10,-20 L22,-28 L10,-10 Z" fill="url(#gobSkin)" stroke="#222" stroke-width="2" stroke-linejoin="round"/>
                    <!-- Apron/Vest -->
                    <rect x="-10" y="-12" width="20" height="15" fill="#5c4033" stroke="#222" stroke-width="2" rx="2"/>
                    <rect x="-12" y="-2" width="24" height="4" fill="#3e2723" stroke="#222" stroke-width="2"/>
                    <!-- Body/Head -->
                    <circle cx="0" cy="-18" r="14" fill="url(#gobSkin)" stroke="#222" stroke-width="2"/>
                    <!-- Eyes -->
                    <circle cx="-5" cy="-20" r="2" fill="#222"/><circle cx="5" cy="-20" r="2" fill="#222"/>
                    <!-- Hat -->
                    <path d="M-15,-26 L0,-42 L15,-26 Z" fill="url(#gobHat)" stroke="#222" stroke-width="2" stroke-linejoin="round"/>
                    <!-- Dagger -->
                    <g transform="translate(15, -5)">
                        <path d="M0,0 L20,-8 L0,8 Z" fill="#ccc" stroke="#222" stroke-width="1.5" stroke-linejoin="round"/>
                        <rect x="-3" y="-3" width="6" height="12" fill="#4e342e" stroke="#222" stroke-width="1.5"/>
                    </g>
                </g>
            \`),
            orc: createSVG(80, 80, \`
                <defs>
                    <linearGradient id="orcSkin" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#627a2e"/><stop offset="100%" stop-color="#323f18"/></linearGradient>
                    <linearGradient id="orcArmor" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#6b7280"/><stop offset="100%" stop-color="#374151"/></linearGradient>
                    <linearGradient id="orcHelm" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#4b5563"/><stop offset="100%" stop-color="#1f2937"/></linearGradient>
                </defs>
                <g transform="translate(40, 60)">
                    <!-- Body -->
                    <circle cx="0" cy="-20" r="18" fill="url(#orcSkin)" stroke="#222" stroke-width="2.5"/>
                    <!-- Armor -->
                    <rect x="-18" y="-12" width="36" height="15" fill="url(#orcArmor)" stroke="#222" stroke-width="2.5" rx="3"/>
                    <!-- Shield (Left hand, front) -->
                    <g transform="translate(-15, -10)">
                        <rect x="-6" y="-15" width="12" height="35" fill="#5c4033" stroke="#222" stroke-width="2" rx="2"/>
                        <rect x="-8" y="-10" width="16" height="6" fill="#9ca3af" stroke="#222" stroke-width="2"/>
                        <rect x="-8" y="10" width="16" height="6" fill="#9ca3af" stroke="#222" stroke-width="2"/>
                    </g>
                    <!-- Helmet -->
                    <path d="M-18,-24 A18 18 0 0 1 18,-24 L18,-18 L-18,-18 Z" fill="url(#orcHelm)" stroke="#222" stroke-width="2.5"/>
                    <!-- Horns -->
                    <path d="M-12,-28 L-22,-45 L-5,-30 Z" fill="#d1d5db" stroke="#222" stroke-width="2" stroke-linejoin="round"/>
                    <path d="M12,-28 L22,-45 L5,-30 Z" fill="#d1d5db" stroke="#222" stroke-width="2" stroke-linejoin="round"/>
                    <!-- Eyes -->
                    <circle cx="-6" cy="-14" r="2" fill="#ef4444"/><circle cx="6" cy="-14" r="2" fill="#ef4444"/>
                    <!-- Hammer (Right hand) -->
                    <g transform="translate(18, -10)">
                        <rect x="-2" y="-20" width="6" height="30" fill="#4e342e" stroke="#222" stroke-width="2"/>
                        <rect x="-12" y="-25" width="26" height="14" fill="url(#orcArmor)" stroke="#222" stroke-width="2.5" rx="2"/>
                    </g>
                </g>
            \`),
            gargoyle: createSVG(80, 80, \`
                <defs>
                    <linearGradient id="garSkin" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#55517a"/><stop offset="100%" stop-color="#2a283d"/></linearGradient>
                    <linearGradient id="garWing" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#3c395c"/><stop offset="100%" stop-color="#191826"/></linearGradient>
                </defs>
                <g transform="translate(40, 45)">
                    <!-- Wings -->
                    <path d="M-8,0 L-35,-25 L-20,15 Z" fill="url(#garWing)" stroke="#222" stroke-width="2" stroke-linejoin="round"/>
                    <path d="M8,0 L35,-25 L20,15 Z" fill="url(#garWing)" stroke="#222" stroke-width="2" stroke-linejoin="round"/>
                    <!-- Body -->
                    <circle cx="0" cy="0" r="14" fill="url(#garSkin)" stroke="#222" stroke-width="2"/>
                    <!-- Ears/Horns -->
                    <path d="M-10,-10 L-20,-18 L-5,-13 Z" fill="url(#garSkin)" stroke="#222" stroke-width="2" stroke-linejoin="round"/>
                    <path d="M10,-10 L20,-18 L5,-13 Z" fill="url(#garSkin)" stroke="#222" stroke-width="2" stroke-linejoin="round"/>
                    <!-- Eye -->
                    <circle cx="0" cy="-2" r="4" fill="#ef4444" stroke="#222" stroke-width="1.5"/>
                    <circle cx="0" cy="-2" r="1.5" fill="#fff"/>
                </g>
            \`),
            necro: createSVG(70, 70, \`
                <defs>
                    <linearGradient id="necCloak" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#6b21a8"/><stop offset="100%" stop-color="#3b0764"/></linearGradient>
                    <radialGradient id="necGlow" cx="0.5" cy="0.5" r="0.5"><stop offset="0%" stop-color="#10b981" stop-opacity="0.8"/><stop offset="100%" stop-color="#10b981" stop-opacity="0"/></radialGradient>
                </defs>
                <g transform="translate(35, 55)">
                    <!-- Fog Base -->
                    <ellipse cx="0" cy="5" rx="18" ry="8" fill="#111827" opacity="0.8"/>
                    <!-- Cloak -->
                    <path d="M-16,10 L0,-25 L16,10 Z" fill="url(#necCloak)" stroke="#222" stroke-width="2" stroke-linejoin="round"/>
                    <!-- Hood -->
                    <circle cx="0" cy="-12" r="10" fill="#000" stroke="#222" stroke-width="2"/>
                    <!-- Eyes -->
                    <circle cx="-4" cy="-12" r="2" fill="#3b82f6"/><circle cx="4" cy="-12" r="2" fill="#3b82f6"/>
                    <!-- Staff -->
                    <rect x="12" y="-20" width="4" height="35" fill="#4e342e" stroke="#222" stroke-width="1.5"/>
                    <circle cx="14" cy="-22" r="10" fill="url(#necGlow)"/>
                    <circle cx="14" cy="-22" r="5" fill="#10b981" stroke="#222" stroke-width="1"/>
                </g>
            \`),
            boss: createSVG(120, 120, \`
                <defs>
                    <linearGradient id="bossRock" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#4b5563"/><stop offset="100%" stop-color="#1f2937"/></linearGradient>
                    <linearGradient id="bossLava" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#fef08a"/><stop offset="50%" stop-color="#ef4444"/><stop offset="100%" stop-color="#7f1d1d"/></linearGradient>
                </defs>
                <g transform="translate(60, 90)">
                    <!-- Core Body -->
                    <circle cx="0" cy="-30" r="35" fill="url(#bossRock)" stroke="#222" stroke-width="3"/>
                    <!-- Lava Cracks -->
                    <path d="M-15,-40 L0,-25 L-10,-5 M10,-20 L25,0" stroke="url(#bossLava)" stroke-width="4" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
                    <!-- Shoulders -->
                    <circle cx="-28" cy="-45" r="16" fill="url(#bossRock)" stroke="#222" stroke-width="3"/>
                    <circle cx="28" cy="-45" r="16" fill="url(#bossRock)" stroke="#222" stroke-width="3"/>
                    <!-- Chains -->
                    <path d="M-28,-45 Q0,-10 28,-45" stroke="#9ca3af" stroke-width="5" stroke-dasharray="8 4" fill="none" stroke-linecap="round"/>
                    <!-- Head -->
                    <rect x="-10" y="-60" width="20" height="25" fill="#111827" stroke="#222" stroke-width="3" rx="4"/>
                    <!-- Eye -->
                    <rect x="-4" y="-52" width="8" height="6" fill="#fef08a" stroke="#ef4444" stroke-width="2"/>
                </g>
            \`),
            slot: createSVG(64, 64, \`
                <defs>
                    <linearGradient id="slotBase" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#6b7280"/><stop offset="100%" stop-color="#374151"/></linearGradient>
                </defs>
                <g transform="translate(32, 32)">
                    <circle cx="0" cy="4" r="26" fill="#1f2937" opacity="0.4"/>
                    <!-- Octagon base -->
                    <polygon points="10,-24 24,-10 24,10 10,24 -10,24 -24,10 -24,-10 -10,-24" fill="#4a4e54" stroke="#222" stroke-width="2"/>
                    <!-- Octagon top -->
                    <polygon points="9,-22 22,-9 22,9 9,22 -9,22 -22,9 -22,-9 -9,-22" fill="url(#slotBase)" stroke="#9ca3af" stroke-width="1.5"/>
                    <path d="M-8,-8 L8,8 M-8,8 L8,-8" stroke="rgba(218, 165, 32, 0.6)" stroke-width="3" stroke-linecap="round"/>
                    <circle cx="0" cy="0" r="12" stroke="rgba(218, 165, 32, 0.6)" stroke-width="3" fill="none"/>
                </g>
            \`),
            archerTower: createSVG(60, 80, \`
                <defs>
                    <linearGradient id="atWood" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#a16207"/><stop offset="100%" stop-color="#713f12"/></linearGradient>
                    <linearGradient id="atRoof" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#3b82f6"/><stop offset="100%" stop-color="#1e3a8a"/></linearGradient>
                </defs>
                <g transform="translate(30, 75)">
                    <!-- Base shadow -->
                    <ellipse cx="0" cy="0" rx="20" ry="8" fill="#111" opacity="0.5"/>
                    <!-- Base stone -->
                    <rect x="-20" y="-25" width="40" height="25" fill="#4b5563" stroke="#222" stroke-width="2" rx="2"/>
                    <rect x="-18" y="-22" width="36" height="20" fill="#6b7280" stroke="#4b5563" stroke-width="1"/>
                    <!-- Wood structure -->
                    <rect x="-16" y="-50" width="32" height="25" fill="url(#atWood)" stroke="#222" stroke-width="2"/>
                    <path d="M-10,-50 L-15,-25 M10,-50 L15,-25 M-16,-38 L16,-38" stroke="#4a2608" stroke-width="2"/>
                    <!-- Roof -->
                    <path d="M-22,-50 L0,-70 L22,-50 Z" fill="url(#atRoof)" stroke="#222" stroke-width="2" stroke-linejoin="round"/>
                </g>
            \`),
            mageTower: createSVG(60, 80, \`
                <defs>
                    <linearGradient id="mtStone" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#6b7280"/><stop offset="100%" stop-color="#374151"/></linearGradient>
                    <linearGradient id="mtRoof" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#a855f7"/><stop offset="100%" stop-color="#581c87"/></linearGradient>
                </defs>
                <g transform="translate(30, 75)">
                    <!-- Base shadow -->
                    <ellipse cx="0" cy="0" rx="20" ry="8" fill="#111" opacity="0.5"/>
                    <!-- Base stone -->
                    <path d="M-22,-20 L-18,0 L18,0 L22,-20 Z" fill="url(#mtStone)" stroke="#222" stroke-width="2" stroke-linejoin="round"/>
                    <!-- Pillar -->
                    <rect x="-14" y="-55" width="28" height="35" fill="url(#mtStone)" stroke="#222" stroke-width="2"/>
                    <!-- Roof -->
                    <path d="M-20,-55 L0,-75 L20,-55 Z" fill="url(#mtRoof)" stroke="#222" stroke-width="2" stroke-linejoin="round"/>
                    <circle cx="0" cy="-75" r="4" fill="#facc15" stroke="#222" stroke-width="1.5"/>
                </g>
            \`),
            cannonTower: createSVG(60, 80, \`
                <defs>
                    <linearGradient id="ctStone" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#4b5563"/><stop offset="100%" stop-color="#1f2937"/></linearGradient>
                    <linearGradient id="ctMetal" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#9ca3af"/><stop offset="100%" stop-color="#374151"/></linearGradient>
                </defs>
                <g transform="translate(30, 75)">
                    <!-- Base shadow -->
                    <ellipse cx="0" cy="0" rx="20" ry="8" fill="#111" opacity="0.5"/>
                    <!-- Base stone -->
                    <rect x="-22" y="-30" width="44" height="30" fill="url(#ctStone)" stroke="#222" stroke-width="2" rx="3"/>
                    <circle cx="0" cy="-15" r="8" fill="#111" stroke="#222" stroke-width="1"/>
                    <!-- Mount -->
                    <path d="M-12,-30 L-10,-45 L10,-45 L12,-30 Z" fill="#6b7280" stroke="#222" stroke-width="2" stroke-linejoin="round"/>
                    <!-- Cannon Barrel -->
                    <rect x="0" y="-55" width="24" height="12" fill="url(#ctMetal)" stroke="#222" stroke-width="2" rx="2" transform="rotate(-15, 0, -49)"/>
                    <circle cx="0" cy="-49" r="6" fill="#111827" stroke="#222" stroke-width="2"/>
                </g>
            \`),
            barracksTower: createSVG(60, 80, \`
                <defs>
                    <linearGradient id="btBase" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#d1d5db"/><stop offset="100%" stop-color="#6b7280"/></linearGradient>
                    <linearGradient id="btRoof" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#ef4444"/><stop offset="100%" stop-color="#991b1b"/></linearGradient>
                </defs>
                <g transform="translate(30, 75)">
                    <!-- Base shadow -->
                    <ellipse cx="0" cy="0" rx="22" ry="9" fill="#111" opacity="0.5"/>
                    <!-- Keep -->
                    <rect x="-20" y="-45" width="40" height="45" fill="url(#btBase)" stroke="#222" stroke-width="2" rx="2"/>
                    <rect x="-6" y="-15" width="12" height="15" fill="#111" stroke="#222" stroke-width="1.5" rx="4 4 0 0"/> <!-- Door -->
                    <!-- Battlements -->
                    <path d="M-22,-45 L-22,-55 L-14,-55 L-14,-45 L-6,-45 L-6,-55 L6,-55 L6,-45 L14,-45 L14,-55 L22,-55 L22,-45 Z" fill="url(#btRoof)" stroke="#222" stroke-width="2" stroke-linejoin="round"/>
                </g>
            \`)
        };
`;

code = code.replace(/let scenery = \[\];/, 'let scenery = [];\n' + svgCode);
fs.writeFileSync('index.html', code);
console.log("SVGS injected.");
