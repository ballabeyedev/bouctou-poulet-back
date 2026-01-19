const express = require('express');
const router = express.Router();
const commendeClientController = require('../../controllers/client/commende.controller');

// -------------------- ROUTES POUR LES CLIENTS --------------------

// Commander un produit
router.post(
  '/commander-produit-client',
  commendeClientController.commenderProduitsClient
);

// Lister les commandes d'un client par téléphone
router.get(
  '/liste-commandes-client',
  commendeClientController.listerCommandesClient
);

// Obtenir les détails d'une commande spécifique
router.get(
  '/details-commande/:id',
  commendeClientController.obtenirDetailsCommande
);

// -------------------- ROUTES POUR L'ADMIN (optionnel) --------------------

// Mettre à jour le statut d'une commande
router.put(
  '/mettre-a-jour-statut/:id',
  commendeClientController.mettreAJourStatutCommande
);

module.exports = router;