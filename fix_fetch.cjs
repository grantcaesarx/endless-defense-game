const fs = require('fs');
let code = fs.readFileSync('index.html', 'utf8');

const injection = `<script>
  if (typeof window !== 'undefined' && window.fetch) {
    try {
      Object.defineProperty(window, 'fetch', {
        value: window.fetch,
        writable: true,
        configurable: true,
        enumerable: true
      });
    } catch(e) {}
  }
</script>
`;
code = code.replace('<head>', '<head>\n    ' + injection);
fs.writeFileSync('index.html', code);
console.log("Injected fetch polyfill fix.");
