const express = require('express');
const router = express.Router();
const produitController = require('../../../controllers/admin/produit/gestionproduit.controller');
const upload = require('../../../middlewares/upload.middleware');
const auth = require('../../../middlewares/auth.middleware'); // si tu veux protéger certaines routes

// Ajouter un produit (avec image)
router.post(
  '/ajouter-produit',
  auth,
  upload.single('image'),
  produitController.ajouterProduit
);

// Modifier un produit (avec image)
router.put(
  '/modifier-produit/:id',
  auth, 
  upload.single('image'),
  produitController.modifierProduit
);

// Supprimer un produit
router.delete(
  '/supprimer-produit/:id',
  auth, 
  produitController.supprimerProduit
);

// Changer le statut (actif/inactif)
router.patch(
  '/statut-produit/:id',
  auth, 
  produitController.changerStatut
);

// Lister les produits (optionnel filtre par statut)
router.get(
  '/liste-produit',
  auth,
  produitController.listerProduits
);

// Obtenir un produit par ID
router.get(
  'produit/:id',
  produitController.getProduitById
);

module.exports = router;
