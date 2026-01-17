const Produit = require('../models/produit.model');
const sequelize = require('../config/db');

class ProduitServiceClient {
  // -------------------- LISTER TOUS LES PRODUITS --------------------
  static async listerProduitsClient({ statut } = {}) {
    const whereClause = statut ? { statut } : {};
    const produits = await Produit.findAll({ where: whereClause });
    return produits;
  }
}

module.exports = ProduitServiceClient;
