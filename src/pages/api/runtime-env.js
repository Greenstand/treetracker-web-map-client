import { getRuntimeEnvFromProcess } from 'models/runtimeEnv';

// Escape characters that could break out of the script or a JS string.
function serialize(value) {
  return JSON.stringify(value)
    .replace(/</g, '\\u003c')
    .replace(/\u2028/g, '\\u2028')
    .replace(/\u2029/g, '\\u2029');
}

export default function handler(req, res) {
  if (req.method !== 'GET' && req.method !== 'HEAD') {
    res.setHeader('Allow', 'GET, HEAD');
    res.status(405).end();
    return;
  }
  res.setHeader('Content-Type', 'application/javascript; charset=utf-8');
  res.setHeader('Cache-Control', 'no-store');
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res
    .status(200)
    .send(`window.__RUNTIME_ENV__ = ${serialize(getRuntimeEnvFromProcess())};`);
}
