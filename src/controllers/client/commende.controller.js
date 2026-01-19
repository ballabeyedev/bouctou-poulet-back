const CommendeServiceClient = require('../../services/client/commende.service');

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
    
    const result = await CommendeServiceClient.commanderProduit({
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

// -------------------- LISTER LES COMMANDES D'UN CLIENT --------------------
exports.listerCommandesClient = async (req, res) => {
  try {
    const { telephone } = req.query;
    
    if (!telephone) {
      return res.status(400).json({
        success: false,
        message: 'Le numéro de téléphone est requis'
      });
    }
    
    const result = await CommendeServiceClient.listerCommandesClient(telephone);
    
    if (result.success) {
      return res.status(200).json({
        success: true,
        data: result.commandes
      });
    } else {
      return res.status(400).json({
        success: false,
        message: result.message
      });
    }
    
  } catch (error) {
    console.error('Erreur dans listerCommandesClient:', error);
    return res.status(500).json({
      success: false,
      message: 'Erreur interne du serveur'
    });
  }
};

// -------------------- METTRE À JOUR LE STATUT D'UNE COMMANDE --------------------
exports.mettreAJourStatutCommande = async (req, res) => {
  try {
    const { id } = req.params;
    const { statut } = req.body;
    
    if (!id || !statut) {
      return res.status(400).json({
        success: false,
        message: 'ID de commande et statut sont requis'
      });
    }
    
    const result = await CommendeServiceClient.mettreAJourStatutCommande(id, statut);
    
    if (result.success) {
      return res.status(200).json({
        success: true,
        message: result.message,
        data: result.commande
      });
    } else {
      return res.status(400).json({
        success: false,
        message: result.message
      });
    }
    
  } catch (error) {
    console.error('Erreur dans mettreAJourStatutCommande:', error);
    return res.status(500).json({
      success: false,
      message: 'Erreur interne du serveur'
    });
  }
};

// -------------------- OBTENIR DÉTAILS D'UNE COMMANDE --------------------
exports.obtenirDetailsCommande = async (req, res) => {
  try {
    const { id } = req.params;
    
    if (!id) {
      return res.status(400).json({
        success: false,
        message: 'ID de commande requis'
      });
    }
    
    const Commende = require('../../models/commende.model');
    const Produit = require('../../models/produit.model');
    
    const commande = await Commende.findByPk(id, {
      include: [{
        model: Produit,
        as: 'produit',
        attributes: ['id', 'nom', 'prix', 'type', 'description', 'image']
      }]
    });
    
    if (!commande) {
      return res.status(404).json({
        success: false,
        message: 'Commande non trouvée'
      });
    }
    
    return res.status(200).json({
      success: true,
      data: commande
    });
    
  } catch (error) {
    console.error('Erreur dans obtenirDetailsCommande:', error);
    return res.status(500).json({
      success: false,
      message: 'Erreur interne du serveur'
    });
  }
};