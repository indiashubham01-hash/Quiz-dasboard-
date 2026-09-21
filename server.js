/**
 * Acharya Institutes - Team 1 EVS Quiz-01 Server
 * Multi-device synchronization server for 60 students (Section D)
 * Built with pure Node.js (zero dependencies)
 */

const http = require('http');
const fs = require('fs');
const path = require('path');
const os = require('os');

const PORT = process.env.PORT || 8085;
const DATA_FILE = path.join(__dirname, 'attempts.json');
const CLASS_CAPACITY = 60;

// Resolve Local Network IP (Wi-Fi / Ethernet)
function getLocalNetworkIp() {
  const nets = os.networkInterfaces();
  for (const name of Object.keys(nets)) {
    for (const net of nets[name]) {
      const familyV4Value = typeof net.family === 'string' ? 'IPv4' : 4;
      if (net.family === familyV4Value && !net.internal) {
        return net.address;
      }
    }
  }
  return 'localhost';
}

const LOCAL_IP = getLocalNetworkIp();

// MIME Types Map
const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.pdf': 'application/pdf',
  '.csv': 'text/csv; charset=utf-8'
};

// Storage Helpers
function getStoredAttempts() {
  try {
    if (fs.existsSync(DATA_FILE)) {
      const content = fs.readFileSync(DATA_FILE, 'utf8');
      return JSON.parse(content || '[]');
    }
  } catch (err) {
    console.error('[Storage Error] Failed to read attempts.json:', err.message);
  }
  return [];
}

function saveAttemptsList(list) {
  try {
    fs.writeFileSync(DATA_FILE, JSON.stringify(list, null, 2), 'utf8');
    return true;
  } catch (err) {
    console.error('[Storage Error] Failed to write attempts.json:', err.message);
    return false;
  }
}

// Request Handler
const server = http.createServer((req, res) => {
  // CORS Headers for cross-device requests
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.writeHead(204);
    res.end();
    return;
  }

  const url = new URL(req.url, `http://${req.headers.host || 'localhost'}`);
  const pathname = url.pathname;

  // -------------------------------------------------------------
  // API ENDPOINTS
  // -------------------------------------------------------------

  // 1. GET /api/info - Live server connection & capacity info
  if (req.method === 'GET' && pathname === '/api/info') {
    const list = getStoredAttempts();
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({
      status: 'online',
      cohort: 'Section D',
      capacity: CLASS_CAPACITY,
      totalAttempts: list.length,
      remaining: Math.max(0, CLASS_CAPACITY - list.length),
      turnoutPercentage: Math.min(100, Math.round((list.length / CLASS_CAPACITY) * 100)),
      localIp: LOCAL_IP,
      port: PORT,
      joinUrl: `http://${LOCAL_IP}:${PORT}`
    }));
    return;
  }

  // 2. GET /api/attempts - Retrieve all submissions
  if (req.method === 'GET' && pathname === '/api/attempts') {
    const list = getStoredAttempts();
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(list));
    return;
  }

  // 3. POST /api/submit - Receive student attempt from individual phone
  if (req.method === 'POST' && pathname === '/api/submit') {
    let body = '';
    req.on('data', chunk => {
      body += chunk;
      // Safety limit: 1MB
      if (body.length > 1e6) {
        req.destroy();
      }
    });

    req.on('end', () => {
      try {
        const attempt = JSON.parse(body);
        if (!attempt || !attempt.usn || !attempt.studentName) {
          res.writeHead(400, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ error: 'Missing required student particulars (name, usn)' }));
          return;
        }

        const list = getStoredAttempts();

        // Check if USN already exists (update if existing, append if new)
        const existingIdx = list.findIndex(item => item.usn.toUpperCase() === attempt.usn.toUpperCase());
        if (existingIdx >= 0) {
          list[existingIdx] = { ...attempt, updatedAt: new Date().toLocaleString() };
        } else {
          list.unshift(attempt);
        }

        saveAttemptsList(list);

        console.log(`[Submission ${list.length}/${CLASS_CAPACITY}] ${attempt.studentName} (${attempt.usn}) - Score: ${attempt.score}/15 - ${attempt.speedPoints} pts`);

        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({
          success: true,
          totalSubmitted: list.length,
          capacity: CLASS_CAPACITY,
          remaining: Math.max(0, CLASS_CAPACITY - list.length),
          message: `Attempt successfully recorded for ${attempt.studentName} (${attempt.usn})`
        }));
      } catch (err) {
        console.error('[Submit Error]:', err.message);
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Invalid JSON payload' }));
      }
    });
    return;
  }

  // 4. DELETE /api/attempts - Clear all records (Host only)
  if (req.method === 'DELETE' && pathname === '/api/attempts') {
    saveAttemptsList([]);
    console.log('[Host Action] Session attempts database cleared.');
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ success: true, count: 0, message: 'All attempts cleared.' }));
    return;
  }

  // -------------------------------------------------------------
  // STATIC FILE SERVING
  // -------------------------------------------------------------
  let filePath = path.join(__dirname, pathname === '/' ? 'index.html' : pathname);

  // Security check: ensure path stays within project directory
  if (!filePath.startsWith(__dirname)) {
    res.writeHead(403);
    res.end('Forbidden');
    return;
  }

  fs.stat(filePath, (err, stats) => {
    if (err || !stats.isFile()) {
      res.writeHead(404, { 'Content-Type': 'text/plain' });
      res.end('404 Not Found');
      return;
    }

    const ext = path.extname(filePath).toLowerCase();
    const contentType = MIME_TYPES[ext] || 'application/octet-stream';

    res.writeHead(200, {
      'Content-Type': contentType,
      'Cache-Control': 'no-cache, no-store, must-revalidate'
    });

    const stream = fs.createReadStream(filePath);
    stream.pipe(res);
  });
});

server.listen(PORT, '0.0.0.0', () => {
  console.log(`
========================================================================
  ACHARYA INSTITUTES • TEAM 1 • EVS QUIZ - 01 PORTAL
  COHORT: SECTION D (TARGET: ${CLASS_CAPACITY} MEMBERS CONCURRENT)
========================================================================
  Local Host URL:    http://localhost:${PORT}
  Classroom Wi-Fi:   http://${LOCAL_IP}:${PORT}

  >> Share this Classroom Wi-Fi URL so all 60 students can take the
     quiz simultaneously on their mobile smartphones!
  >> Submissions automatically sync live to your Host Dashboard.
========================================================================
  `);
});
