const ProduitServiceClient = require('../services/listeproduitclient.service');

// -------------------- LISTER LES PRODUITS --------------------
exports.listerProduitsClient = async (req, res) => {
  const { statut } = req.query; // optionnel : ?statut=actif

  try {
    const produits = await ProduitServiceClient.listerProduitsClient({ statut });
    return res.status(200).json(produits);
  } catch (err) {
    console.error('Erreur liste produits:', err);
    return res.status(500).json({
      message: 'Erreur serveur lors de la récupération des produits',
      erreur: err.message
    });
  }
};

// -------------------- COMMENDER UN PRODUIT --------------------
exports.commenderProduitsClient = async (req, res) => {
  try {
    const { idProduit, quantite, nomComplet, telephone, adresse } = req.body;
    
    // Validation des données requises
    if (!idProduit || !quantite || !nomComplet || !telephone || !adresse) {
      return res.status(400).json({
        success: false,
        message: 'Tous les champs sont obligatoires: idProduit, quantite, nomComplet, telephone, adresse'
      });
    }
    
    // Validation de la quantité
    if (quantite <= 0 || !Number.isInteger(quantite)) {
      return res.status(400).json({
        success: false,
        message: 'La quantité doit être un nombre entier positif'
      });
    }
    
    // Validation du téléphone
    const phoneRegex = /^(\+223|0)[0-9]{8}$/;
    if (!phoneRegex.test(telephone.replace(/\s/g, ''))) {
      return res.status(400).json({
        success: false,
        message: 'Numéro de téléphone malien invalide. Format: +223XXXXXXXX ou 0XXXXXXXX'
      });
    }
    
    const result = await ProduitServiceClient.commanderProduit({
      idProduit,
      quantite,
      nomComplet,
      telephone,
      adresse
    });
    
    if (result.success) {
      return res.status(201).json({
        success: true,
        message: 'Commande créée avec succès',
        data: result.commande
      });
    } else {
      return res.status(400).json({
        success: false,
        message: result.message
      });
    }
    
  } catch (error) {
    console.error('Erreur dans commenderProduitsClient:', error);
    return res.status(500).json({
      success: false,
      message: 'Erreur interne du serveur',
      error: error.message
    });
  }
};