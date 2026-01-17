const express = require('express');
const router = express.Router();
const listeproduitClientController = require('../controllers/listeproduitclient.controller');

// Lister les produits (optionnel filtre par statut)
router.get(
  '/liste-produit-client',
  listeproduitClientController.listerProduitsClient
);


module.exports = router;
