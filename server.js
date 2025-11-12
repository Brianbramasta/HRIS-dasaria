// server.js
import jsonServer from 'json-server';
import jwt from 'jsonwebtoken';
import multer from 'multer';
import path from 'path';
import fs from 'fs';

const server = jsonServer.create();
const router = jsonServer.router('db.json');
const middlewares = jsonServer.defaults();
const db = router.db; // lowdb instance

server.use(middlewares);
server.use(jsonServer.bodyParser);

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

// Auth configuration
const JWT_SECRET = process.env.JWT_SECRET || 'supersecret_jwt_key';
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || 'supersecret_refresh_key';
const ACCESS_TOKEN_EXPIRES_IN = '1h';
const REFRESH_TOKEN_EXPIRES_IN = '7d';

function signAccessToken(user) {
  return jwt.sign(
    { sub: user.id, email: user.email, role: user.role },
    JWT_SECRET,
    { expiresIn: ACCESS_TOKEN_EXPIRES_IN }
  );
}

function signRefreshToken(user) {
  return jwt.sign(
    { sub: user.id, email: user.email, role: user.role },
    JWT_REFRESH_SECRET,
    { expiresIn: REFRESH_TOKEN_EXPIRES_IN }
  );
}

function authMiddleware(req, res, next) {
  const authHeader = req.headers.authorization || req.headers.Authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).send(JSON.stringify({ message: 'Unauthorized' }));
  }
  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded; // { sub, email, role }
    next();
  } catch (err) {
    return res.status(401).send(JSON.stringify({ message: 'Invalid token' }));
  }
}

// Auth routes
server.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body || {};
  if (!email || !password) {
    return res.status(400).send(JSON.stringify({ message: 'Email and password are required' }));
  }

  const user = db.get('users').find({ email }).value();
  if (!user) {
    return res.status(404).send(JSON.stringify({ message: 'User not found' }));
  }

  // Plaintext password check (for demo/json-server)
  if (user.password !== password) {
    return res.status(401).send(JSON.stringify({ message: 'Invalid email or password' }));
  }

  if (user.isActive === false) {
    return res.status(403).send(JSON.stringify({ message: 'User is not active' }));
  }

  const accessToken = signAccessToken(user);
  const refreshToken = signRefreshToken(user);

  const { password: _, ...safeUser } = user;
  return res.status(200).send(JSON.stringify({ accessToken, refreshToken, user: safeUser }));
});

server.get('/api/auth/me', authMiddleware, (req, res) => {
  const user = db.get('users').find({ id: req.user.sub }).value();
  if (!user) {
    return res.status(404).send(JSON.stringify({ message: 'User not found' }));
  }
  const { password: _, ...safeUser } = user;
  return res.status(200).send(JSON.stringify({ user: safeUser }));
});

server.post('/api/auth/refresh', (req, res) => {
  const { refreshToken } = req.body || {};
  if (!refreshToken) {
    return res.status(400).send(JSON.stringify({ message: 'Refresh token is required' }));
  }
  try {
    const decoded = jwt.verify(refreshToken, JWT_REFRESH_SECRET);
    const user = db.get('users').find({ id: decoded.sub }).value();
    if (!user) {
      return res.status(404).send(JSON.stringify({ message: 'User not found' }));
    }
    const newAccessToken = signAccessToken(user);
    return res.status(200).send(JSON.stringify({ accessToken: newAccessToken }));
  } catch (err) {
    return res.status(401).send(JSON.stringify({ message: 'Invalid refresh token' }));
  }
});

server.post('/api/auth/logout', (req, res) => {
  // Stateless JWT: nothing to do server-side
  return res.status(200).send(JSON.stringify({ message: 'Logged out' }));
});

// ===== File Upload (local storage) =====
// Ensure documents directory exists
const documentsDir = path.resolve('src/documents');
if (!fs.existsSync(documentsDir)) {
  fs.mkdirSync(documentsDir, { recursive: true });
}

// Serve static files so frontend can preview via returned path
server.use('/documents', jsonServer.defaults({ static: documentsDir }));

// Configure multer storage
const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, documentsDir);
  },
  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname);
    const base = path.basename(file.originalname, ext);
    const safeBase = base.replace(/[^a-zA-Z0-9-_]/g, '_');
    const unique = `${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`;
    cb(null, `${unique}${ext}`);
  },
});
const upload = multer({ storage });

// Upload endpoint: returns { fileName, filePath, size }
server.post('/api/upload', upload.single('file'), (req, res) => {
  if (!req.file) {
    return res.status(400).send(JSON.stringify({ message: 'No file uploaded' }));
  }
  const fileName = req.file.filename;
  const filePath = `/src/documents/${fileName}`; // public URL served by static middleware
  const size = req.file.size;
  return res.status(200).send(JSON.stringify({ fileName, filePath, size }));
});

// 👉 Tambahkan prefix '/api' di sini untuk resource endpoints
server.use('/api', router);

const PORT = 3001;
server.listen(PORT, () => {
  console.log(`🚀 JSON Server running on port ${PORT}`);
  console.log(`📡 Endpoint base URL: http://localhost:${PORT}/api`);
});
