// src/raw/server.js
const http = require('http');

const PORT = process.env.PORT || 3000;

const server = http.createServer((req, res) => {
  // req.url is the full path including query string: "/users/42?tab=profile"
  // req.method is uppercase: "GET", "POST", "DELETE"
  // req.headers is a plain object, all keys lowercased

  console.log(`${req.method} ${req.url}`);

  // Every response needs Content-Type so the client knows how to parse the body
  res.setHeader('Content-Type', 'application/json');

  // Send a response — status code + body
  res.writeHead(200);
  res.end(JSON.stringify({
    message: 'TaskFlow API',
    method: req.method,
    url: req.url,
    timestamp: new Date().toISOString()
  }));
});

server.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

// node src/raw/server.js
// Test it:
// curl -i http://localhost:3000/anything
// curl -i -X POST http://localhost:3000/users
// curl -i -X DELETE http://localhost:3000/users/42