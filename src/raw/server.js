// src/raw/server.js — replace the entire file
const http = require('http');

const PORT = process.env.PORT || 3000;

// ─── Helpers ────────────────────────────────────────────────────────────────

function sendJSON(res, statusCode, data) {
  res.setHeader('Content-Type', 'application/json');
  res.writeHead(statusCode);
  res.end(JSON.stringify(data));
}

function sendError(res, statusCode, message) {
  sendJSON(res, statusCode, { error: message });
}

// ─── Route matching ──────────────────────────────────────────────────────────

// Parse path params: pattern "/users/:id", path "/users/42" → { id: "42" }
function matchRoute(pattern, pathname) {
  const patternParts = pattern.split('/');
  const pathParts = pathname.split('/');

  if (patternParts.length !== pathParts.length) return null;

  const params = {};
  for (let i = 0; i < patternParts.length; i++) {
    if (patternParts[i].startsWith(':')) {
      // This segment is a param — capture it
      params[patternParts[i].slice(1)] = pathParts[i];
    } else if (patternParts[i] !== pathParts[i]) {
      // Static segment doesn't match
      return null;
    }
  }
  return params; // { id: "42" } or {} for routes with no params
}

// ─── Handlers ────────────────────────────────────────────────────────────────

function handleHealth(req, res, params, query) {
  sendJSON(res, 200, { status: 'ok', uptime: process.uptime() });
}

function handleEcho(req, res, params, query, body) {
  // Echo back whatever was sent — useful for debugging clients
  sendJSON(res, 200, {
    method: req.method,
    path: new URL(req.url, 'http://localhost').pathname,
    query: Object.fromEntries(query),
    body: body,
    headers: req.headers
  });
}

function handleGetUser(req, res, params, query) {
  // Hardcoded data for now — Week 2 replaces this with a real DB query
  const users = {
    '1': { id: '1', name: 'Bhavesh Tank', email: 'bhavesh@example.com' },
    '2': { id: '2', name: 'Jane Doe', email: 'jane@example.com' },
  };

  const user = users[params.id];
  if (!user) {
    return sendError(res, 404, `User with id ${params.id} not found`);
  }
  sendJSON(res, 200, user);
}

function handleListUsers(req, res, params, query) {
  // query.limit and query.offset — pagination skeleton
  const limit = parseInt(query.get('limit') || '10', 10);
  const offset = parseInt(query.get('offset') || '0', 10);

  sendJSON(res, 200, {
    users: [
      { id: '1', name: 'Bhavesh Tank' },
      { id: '2', name: 'Jane Doe' }
    ],
    pagination: { limit, offset, total: 2 }
  });
}

// ─── Route table ─────────────────────────────────────────────────────────────

// Each route: [METHOD, pattern, handler]
const routes = [
  ['GET',  '/health',      handleHealth],
  ['POST', '/echo',        handleEcho],
  ['GET',  '/users',       handleListUsers],
  ['GET',  '/users/:id',   handleGetUser],
];

// ─── Request dispatcher ───────────────────────────────────────────────────────

function dispatch(req, res, body) {
  const url = new URL(req.url, 'http://localhost');
  const pathname = url.pathname;
  const query = url.searchParams;

  for (const [method, pattern, handler] of routes) {
    if (req.method !== method) continue;

    const params = matchRoute(pattern, pathname);
    if (params === null) continue;

    // Found a matching route — call the handler
    handler(req, res, params, query, body);
    return;
  }

  // No route matched
  sendError(res, 404, `Cannot ${req.method} ${pathname}`);
}

// ─── Server ───────────────────────────────────────────────────────────────────

const server = http.createServer((req, res) => {
  console.log(`→ ${req.method} ${req.url}`);
  // Body parsing happens in Day 4 — pass null for now
  dispatch(req, res, null);
});

server.listen(PORT, () => {
  console.log(`Raw server on http://localhost:${PORT}`);
});

// Test every route:
// curl -i http://localhost:3000/health
// curl -i http://localhost:3000/users
// curl -i http://localhost:3000/users/1
// curl -i http://localhost:3000/users/999     # should 404
// curl -i http://localhost:3000/users?limit=5 # pagination
// curl -i -X POST http://localhost:3000/echo
// curl -i http://localhost:3000/nonexistent   # should 404 with message