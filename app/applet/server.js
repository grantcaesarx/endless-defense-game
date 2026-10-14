import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(express.static(__dirname));

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// Support PORT env var from Cloud Run / hosting environment and --port CLI argument
let port = process.env.PORT || 3000;
const portArgIdx = process.argv.indexOf('--port');
if (portArgIdx !== -1 && process.argv[portArgIdx + 1]) {
  port = process.argv[portArgIdx + 1];
}

app.listen(port, '0.0.0.0', () => {
  console.log(`Server running on port ${port}`);
});
