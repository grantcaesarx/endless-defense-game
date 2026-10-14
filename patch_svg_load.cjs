const fs = require('fs');
let code = fs.readFileSync('index.html', 'utf8');

const fixSVG = `
        const createSVG = (w, h, content) => {
            const img = new Image();
            const svgStr = \`<svg xmlns="http://www.w3.org/2000/svg" width="\${w}" height="\${h}" viewBox="0 0 \${w} \${h}">\${content}</svg>\`;
            img.src = 'data:image/svg+xml;utf8,' + encodeURIComponent(svgStr);
            img.onload = () => { if(typeof renderTerrain === 'function') renderTerrain(); };
            return img;
        };
`;

code = code.replace(/const createSVG = [\s\S]*?return img;\n        \};\n/m, fixSVG);
fs.writeFileSync('index.html', code);
console.log("Patched createSVG with onload");
