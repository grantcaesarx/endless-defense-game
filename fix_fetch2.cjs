const fs = require('fs');
let code = fs.readFileSync('index.html', 'utf8');

const injection = `<script>
  try {
    const originalFetch = window.fetch;
    delete window.fetch;
    window.fetch = originalFetch;
  } catch(e) {}
</script>`;

code = code.replace(/<script>[\s\S]*?Object\.defineProperty[\s\S]*?<\/script>/, injection);
fs.writeFileSync('index.html', code);
console.log("Injected delete fetch polyfill fix.");
