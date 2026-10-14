const fs = require('fs');
let code = fs.readFileSync('index.html', 'utf8');

const injection = `<script>
  window.addEventListener('error', function(e) {
    if (e.message && e.message.includes('fetch of #<Window>')) {
      e.preventDefault(); // hide from console
    }
  });
</script>
`;
code = code.replace('<head>', '<head>\n    ' + injection);
fs.writeFileSync('index.html', code);
console.log("Injected error hider");
