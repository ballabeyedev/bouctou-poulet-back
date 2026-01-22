const ProduitServiceClient = require('../services/listeproduitclient.service');

// -------------------- LISTER LES PRODUITS --------------------
// -------------------- LISTER LES PRODUITS CLIENT --------------------
exports.listerProduitsClient = async (req, res) => {
  try {
    const produits = await Produit.find();

    const produitsAvecImage = produits.map(produit => ({
      ...produit.toObject(),
      image: produit.image ? `/uploads/${produit.image}` : null
    }));

    return res.status(200).json({
      produits: produitsAvecImage
    });
  } catch (error) {
    console.error('Erreur liste produits client:', error);
    return res.status(500).json({
      message: 'Erreur serveur',
      erreur: error.message
    });
  }
};


// -------------------- LISTER TOUTES LES COMMANDES --------------------
exports.listerToutesLesCommendes = async (req, res) => {
  try {
    const { statut } = req.query; // optionnel : ?statut=en_attente

    const result = await ProduitServiceClient.listerToutesLesCommendes({ statut });

    if (!result.success) {
      return res.status(500).json({
        success: false,
        message: result.message
      });
    }

    return res.status(200).json({
      success: true,
      data: result.data
    });

  } catch (error) {
    console.error('Erreur liste commandes:', error);
    return res.status(500).json({
      success: false,
      message: 'Erreur serveur lors de la récupération des commandes',
      erreur: error.message
    });
  }
};

// -------------------- COMMANDER UN PRODUIT --------------------
exports.commenderProduitsClient = async (req, res) => {
  try {
    const { idProduit, quantite, nomComplet, telephone, adresse } = req.body;

    if (!idProduit || !quantite || !nomComplet || !telephone || !adresse) {
      return res.status(400).json({
        success: false,
        message: 'Tous les champs sont obligatoires: idProduit, quantite, nomComplet, telephone, adresse'
      });
    }

    if (quantite <= 0 || !Number.isInteger(quantite)) {
      return res.status(400).json({
        success: false,
        message: 'La quantité doit être un nombre entier positif'
      });
    }

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
    }

    return res.status(400).json({
      success: false,
      message: result.message
    });

  } catch (error) {
    console.error('Erreur dans commenderProduitsClient:', error);
    return res.status(500).json({
      success: false,
      message: 'Erreur interne du serveur',
      error: error.message
    });
  }
};
