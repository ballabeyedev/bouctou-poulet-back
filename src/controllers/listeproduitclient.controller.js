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