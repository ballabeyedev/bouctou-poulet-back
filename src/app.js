const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const path = require('path');
const { corsConfig, rateLimitConfig } = require('./config/security');

const app = express();

// ========================
// MIDDLEWARES GLOBAUX
// ========================
app.use(helmet());
app.use(cors(corsConfig)); // ✅ suffit largement
app.use(express.json({ limit: '5mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(rateLimit(rateLimitConfig));

// ========================
// STATIC FILES
// ========================
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// ========================
// DEBUG DEV (mettre AVANT les routes pour voir les logs)
// ========================
app.use((req, res, next) => {
  console.log(`➡️ ${req.method} ${req.originalUrl}`);
  console.log('BODY :', req.body);
  next();
});

// ========================
// ROUTES
// ========================
app.use('/bouctou_poulet/auth', require('./routes/auth.route'));
app.use('/bouctou_poulet/admin', require('./routes/admin/produit/produit.route'));
app.use('/bouctou_poulet/client', require('./routes/listeproduitclient.route'));


module.exports = app;