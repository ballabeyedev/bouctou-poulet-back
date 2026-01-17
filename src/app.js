const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const path = require('path');
const { corsConfig, rateLimitConfig } = require('./config/security');

const app = express();

// Middlewares globaux
app.use(helmet());
app.use(cors(corsConfig));
app.use(express.json({ limit: '5mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(rateLimit(rateLimitConfig));


// Routes
const authRoutes = require('./routes/auth.route');
const produitRoutes = require('./routes/admin/produit/produit.route');
const listeProduitClientRoutes = require('./routes/listeproduitclient.route');


// Serveur fichiers statiques pour les uploads
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Définition des routes
app.use('/bouctou_poulet/auth', authRoutes);
app.use('/bouctou_poulet/admin', produitRoutes);
app.use('/bouctou_poulet/client', listeProduitClientRoutes);

module.exports = app;
