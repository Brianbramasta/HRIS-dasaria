// server.js
import jsonServer from 'json-server';

const server = jsonServer.create();
const router = jsonServer.router('db.json');
const middlewares = jsonServer.defaults();

server.use(middlewares);

// Middleware untuk membungkus response ke dalam { data: ... }
server.use((req, res, next) => {
  const originalSend = res.send;
  res.send = function (body) {
    try {
      const data = JSON.parse(body);
      const wrapped = { data };
      body = JSON.stringify(wrapped);
    } catch (err) {}
    originalSend.call(this, body);
  };
  next();
});

// 👉 Tambahkan prefix '/api' di sini
server.use('/api', router);

const PORT = 3001;
server.listen(PORT, () => {
  console.log(`🚀 JSON Server running on port ${PORT}`);
  console.log(`📡 Endpoint base URL: http://localhost:${PORT}/api`);
});
