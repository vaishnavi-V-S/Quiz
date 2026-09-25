// Dependency-free static server: `node server.js`
const http = require('http');
const fs = require('fs');
const path = require('path');
const root = __dirname;
const types = { '.html':'text/html; charset=utf-8', '.css':'text/css; charset=utf-8', '.js':'text/javascript; charset=utf-8', '.json':'application/json; charset=utf-8', '.png':'image/png', '.svg':'image/svg+xml' };
http.createServer((req, res) => {
  let pathname;
  try { pathname = decodeURIComponent(new URL(req.url, 'http://localhost').pathname); } catch { res.writeHead(400).end('Bad request'); return; }
  const candidate = path.resolve(root, `.${pathname}`);
  if (!candidate.startsWith(root + path.sep) && candidate !== root) { res.writeHead(403).end('Forbidden'); return; }
  if (!fs.existsSync(candidate) || !fs.statSync(candidate).isFile()) {
    if (path.extname(pathname)) { res.writeHead(404).end('Not found'); return; }
  }
  const file = fs.existsSync(candidate) && fs.statSync(candidate).isFile() ? candidate : path.join(root, 'index.html');
  fs.readFile(file, (err, data) => { if (err) { res.writeHead(404).end('Not found'); return; } res.writeHead(200, { 'Content-Type': types[path.extname(file)] || 'application/octet-stream' }); res.end(data); });
}).listen(process.env.PORT || 3000, () => console.log(`Quiz portal: http://localhost:${process.env.PORT || 3000}`));
