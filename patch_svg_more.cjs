const fs = require('fs');
let code = fs.readFileSync('index.html', 'utf8');

const moreSVGs = `
            start: createSVG(64, 64, \`
                <g transform="translate(32, 32)">
                    <circle cx="0" cy="5" r="28" fill="#111" opacity="0.5"/>
                    <circle cx="0" cy="0" r="26" fill="#1e3a8a" stroke="#222" stroke-width="2"/>
                    <path d="M-15,-5 L0,15 L15,-5" stroke="#93c5fd" stroke-width="4" stroke-linecap="round" fill="none"/>
                    <path d="M0,-15 L0,10" stroke="#93c5fd" stroke-width="4" stroke-linecap="round" fill="none"/>
                </g>\`),
            end: createSVG(64, 64, \`
                <g transform="translate(32, 32)">
                    <circle cx="0" cy="5" r="28" fill="#111" opacity="0.5"/>
                    <circle cx="0" cy="0" r="26" fill="#7f1d1d" stroke="#222" stroke-width="2"/>
                    <circle cx="0" cy="0" r="14" fill="#b91c1c" stroke="#fca5a5" stroke-width="3"/>
                    <path d="M-8,-8 L8,8 M-8,8 L8,-8" stroke="#fca5a5" stroke-width="4" stroke-linecap="round"/>
                </g>\`)
`;

code = code.replace(/slot: createSVG\(64, 64, `[\s\S]*?`\)/, match => match + ",\n" + moreSVGs);
fs.writeFileSync('index.html', code);
console.log("Added start/end SVGs");
