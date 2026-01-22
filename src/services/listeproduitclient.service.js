const Produit = require('../models/produit.model');
const sequelize = require('../config/db');
const Commende = require('../models/commende.model');


class ProduitServiceClient {
  // -------------------- LISTER TOUS LES PRODUITS --------------------
  static async listerProduitsClient({ statut } = {}) {
    const whereClause = statut ? { statut } : {};

    const produits = await Produit.findAll({ where: whereClause });

    return produits.map(produit => ({
      ...produit.toJSON(),
      image: produit.image ? `/uploads/${produit.image}` : null
    }));
}


// -------------------- COMMENDER UN PRODUIT --------------------
static async commanderProduit(commandeData) {
  const transaction = await sequelize.transaction();

  try {
    const { idProduit, quantite, nomComplet, telephone, adresse } = commandeData;

    // 🔍 Vérifier le produit
    const produit = await Produit.findByPk(idProduit, { transaction });

    if (!produit) {
      throw new Error('Produit non trouvé');
    }

    if (produit.stock < quantite) {
      throw new Error(`Stock insuffisant. Disponible: ${produit.stock}`);
    }

    // 💰 Calcul du total
    const total = parseFloat(produit.prix) * quantite;

    // 🧾 Créer la commande
    const nouvelleCommande = await Commende.create({
      idProduit,
      quantite,
      total,
      nomComplet,
      telephone,
      adresse,
      statut: 'en_attente',
      dateCommande: new Date()
    }, { transaction });

    // 🔽 DIMINUER LE STOCK EN BASE (SAFE)
    await produit.decrement(
      { stock: quantite },
      { transaction }
    );

    // ✅ Valider la transaction
    await transaction.commit();

    // 📦 Retourner la commande avec produit
    const commandeComplete = await Commende.findByPk(nouvelleCommande.id, {
      include: [{
        model: Produit,
        as: 'produit',
        attributes: ['id', 'nom', 'prix', 'type', 'description', 'stock']
      }]
    });

    return {
      success: true,
      message: 'Commande créée avec succès',
      commande: commandeComplete
    };

  } catch (error) {
    await transaction.rollback();
    console.error('Erreur lors de la commande:', error);

    return {
      success: false,
      message: error.message || 'Erreur lors de la création de la commande'
    };
  }
}


// -------------------- AFFICHER TOUTES LES COMMANDES --------------------
static async listerToutesLesCommendes({ statut } = {}) {
  try {
    const whereClause = statut ? { statut } : {};

    const commandes = await Commende.findAll({
      where: whereClause,

      // ❌ ne pas mettre attributes ici
      // 👉 toutes les colonnes seront retournées automatiquement

      include: [
        {
          model: Produit,
          as: 'produit',
          attributes: ['id', 'nom', 'prix', 'type', 'description']
        }
      ],

      order: [['dateCommande', 'DESC']]
    });

    return {
      success: true,
      data: commandes
    };

  } catch (error) {
    console.error('Erreur lors de la récupération des commandes:', error);
    return {
      success: false,
      message: 'Erreur lors de la récupération des commandes'
    };
  }
}


}

module.exports = ProduitServiceClient;
