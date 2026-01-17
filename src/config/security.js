require('dotenv').config();

/**
 * =========================
 * JWT
 * =========================
 */
const jwtConfig = {
  secret: process.env.JWT_SECRET || 'dev_secret',
  expiresIn: process.env.JWT_EXPIRES_IN || '1h',
  refreshSecret: process.env.JWT_REFRESH_SECRET || 'dev_refresh_secret',
  refreshExpiresIn: '7d',
};

/**
 * =========================
 * BCRYPT
 * =========================
 */
const bcryptConfig = {
  saltRounds: 12,
};

/**
 * =========================
 * RATE LIMIT (DEV)
 * =========================
 * ⚠️ Souple en développement
 */
const rateLimitConfig = {
  windowMs: 15 * 60 * 1000,
  max: 1000, // LARGE en dev
  standardHeaders: true,
  legacyHeaders: false,
};

/**
 * =========================
 * CORS (DEV SAFE)
 * =========================
 */
const allowedOrigins = process.env.CORS_ORIGIN
  ? process.env.CORS_ORIGIN.split(',')
  : ['http://localhost:5173'];

const corsConfig = {
  origin: (origin, callback) => {
    // Autorise Postman, curl, serveur
    if (!origin) return callback(null, true);

    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    }

    console.log('❌ CORS bloqué pour :', origin);
    return callback(null, false); // DEV → pas d’erreur bloquante
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
};

/**
 * =========================
 * COOKIES
 * =========================
 */
const cookieConfig = {
  httpOnly: true,
  secure: false, // DEV
  sameSite: 'lax',
};

/**
 * =========================
 * UPLOAD
 * =========================
 */
const uploadConfig = {
  maxFileSize: 5 * 1024 * 1024,
  allowedMimeTypes: [
    'application/pdf',
    'image/png',
    'image/jpeg',
    'image/webp',
  ],
};

/**
 * =========================
 * CRYPTO
 * =========================
 */
const cryptoConfig = {
  hashAlgorithm: 'sha256',
  encoding: 'hex',
};

module.exports = {
  jwtConfig,
  bcryptConfig,
  rateLimitConfig,
  corsConfig,
  cookieConfig,
  uploadConfig,
  cryptoConfig,
};
