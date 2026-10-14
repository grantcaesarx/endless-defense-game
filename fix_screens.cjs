const fs = require('fs');
let code = fs.readFileSync('index.html', 'utf8');

// 1. Find battlefield start
const bfStart = code.indexOf('<div id="battlefield"');
// Find canvas end
const canvasEnd = code.indexOf('</canvas>', bfStart) + 9;

// The screens are everything after canvasEnd up to </div><!-- end battlefield -->
const bfEnd = code.indexOf('</div><!-- end battlefield -->');

const screensCode = code.substring(canvasEnd, bfEnd);

// Remove screens from battlefield
code = code.substring(0, canvasEnd) + code.substring(bfEnd);

// Insert screens after dashboard
const dashboardEnd = code.indexOf('</div>', code.indexOf('<div id="dashboard"')) + 6;
// Wait, dashboard contains other divs, so `indexOf('</div>')` is wrong!
// Let's just insert them before `<script>`
code = code.replace(/<script>/, screensCode + '\n    <script>');

fs.writeFileSync('index.html', code);
console.log("Screens moved to game-wrapper level");
