const fs = require('fs');
let code = fs.readFileSync('index.html', 'utf8');

// Remove the injected script block
code = code.replace(/<script>\s*try \{\s*const originalFetch = window\.fetch;\s*delete window\.fetch;\s*window\.fetch = originalFetch;\s*\} catch\(e\) \{\}\s*<\/script>/, '');

fs.writeFileSync('index.html', code);
console.log("Removed broken fetch fix");
