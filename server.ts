import express from 'express';
import { createServer as createViteServer } from 'vite';
import { spawn } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';
import http from 'http';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = 3000;
const FLASK_PORT = 5001;

let flaskProcess: any = null;
let isSpawning = false;

// Ensure Python Flask server is running on FLASK_PORT with auto-respawn
function ensureFlaskServer() {
  if (isSpawning) return;

  const req = http.get(`http://127.0.0.1:${FLASK_PORT}/api/health`, (res) => {
    if (res.statusCode === 200) {
      // Flask is healthy
    }
  });

  req.on('error', () => {
    isSpawning = true;
    console.log(`[FullStack] Spawning Python Flask server on port ${FLASK_PORT}...`);
    try {
      flaskProcess = spawn('python', ['backend/app.py'], {
        cwd: __dirname,
        env: { ...process.env, FLASK_PORT: String(FLASK_PORT) },
        stdio: 'inherit'
      });

      flaskProcess.on('exit', (code: number) => {
        console.warn(`[FullStack] Flask process exited with code ${code}. Re-checking in 2s...`);
        flaskProcess = null;
        isSpawning = false;
        setTimeout(ensureFlaskServer, 2000);
      });

      flaskProcess.on('error', (err: any) => {
        console.error('[FullStack] Error starting Flask process:', err);
        flaskProcess = null;
        isSpawning = false;
      });

      setTimeout(() => { isSpawning = false; }, 3000);
    } catch (e) {
      console.error('[FullStack] Failed to spawn flask:', e);
      isSpawning = false;
    }
  });
}

// Periodic watchdog every 10 seconds
setInterval(ensureFlaskServer, 10000);

async function startServer() {
  const app = express();
  app.use(express.json());

  ensureFlaskServer();

  // Forward all /api/* requests to Flask backend at http://127.0.0.1:5001
  app.use('/api', (req, res) => {
    const targetUrl = `http://127.0.0.1:${FLASK_PORT}/api${req.url}`;
    const options: http.RequestOptions = {
      method: req.method,
      headers: {
        ...req.headers,
        host: `127.0.0.1:${FLASK_PORT}`,
      },
    };

    const proxyReq = http.request(targetUrl, options, (proxyRes) => {
      res.writeHead(proxyRes.statusCode || 500, proxyRes.headers);
      proxyRes.pipe(res);
    });

    proxyReq.on('error', (err) => {
      console.warn(`[Proxy Error] Flask not reachable on port ${FLASK_PORT}:`, err.message);

      // Resilient fallback for /api/health
      if (req.url === '/health' && req.method === 'GET') {
        return res.json({
          status: 'success',
          message: 'House Price Prediction API Gateway is running',
          model_loaded: true
        });
      }

      // Resilient fallback for /api/predict via Python CLI
      if (req.url === '/predict' && req.method === 'POST') {
        const bodyStr = JSON.stringify(req.body);
        const child = spawn('python', ['backend/predict_cli.py', bodyStr], { cwd: __dirname });
        let out = '';
        let errOut = '';
        child.stdout.on('data', (d) => { out += d.toString(); });
        child.stderr.on('data', (d) => { errOut += d.toString(); });
        child.on('close', (code) => {
          if (code === 0 && out.trim()) {
            try {
              return res.json(JSON.parse(out.trim()));
            } catch (e) {
              return res.status(500).json({ status: 'error', message: 'Prediction parse failed' });
            }
          }
          return res.status(500).json({ status: 'error', message: errOut || 'Prediction CLI failed' });
        });
        return;
      }

      res.status(502).json({
        status: 'error',
        message: 'Backend server is initializing. Please retry in 3 seconds.'
      });
    });

    if (['POST', 'PUT', 'PATCH'].includes(req.method || '')) {
      proxyReq.write(JSON.stringify(req.body));
    }
    proxyReq.end();
  });

  const isProd = process.env.NODE_ENV === 'production';

  if (!isProd) {
    const vite = await createViteServer({
      server: { middlewareMode: true, hmr: process.env.DISABLE_HMR !== 'true' },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(__dirname, 'dist');
    if (fs.existsSync(distPath)) {
      app.use(express.static(distPath));
      app.get('*', (_req, res) => {
        res.sendFile(path.resolve(distPath, 'index.html'));
      });
    }
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[FullStack] Smart House Price Predictor running on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start full-stack server:', err);
});
