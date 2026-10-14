const fs = require('fs');
let code = fs.readFileSync('index.html', 'utf8');

const injection = `<script>
  (function() {
    let originalFetch = window.fetch;
    Object.defineProperty(window, 'fetch', {
      get: function() { return originalFetch; },
      set: function(val) { originalFetch = val; },
      configurable: true,
      enumerable: true
    });
  })();
</script>
`;

code = code.replace(/<script>.*?window\.addEventListener\('error'.*?<\/script>\s*/s, '');
code = code.replace('<head>', '<head>\n    ' + injection);
fs.writeFileSync('index.html', code);
console.log("Injected getter/setter polyfill fix.");
