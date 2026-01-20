const Produit = require('../models/produit.model');
const sequelize = require('../config/db');
const Commende = require('../models/commende.model');


class ProduitServiceClient {
  // -------------------- LISTER TOUS LES PRODUITS --------------------
  static async listerProduitsClient({ statut } = {}) {
    const whereClause = statut ? { statut } : {};
    const produits = await Produit.findAll({ where: whereClause });
    return produits;
  }

   // -------------------- COMMENDER UN PRODUIT --------------------
    static async commanderProduit(commandeData) {
      const transaction = await sequelize.transaction();
      
      try {
        const { idProduit, quantite, nomComplet, telephone, adresse } = commandeData;
        
        // Vérifier si le produit existe et est disponible
        const produit = await Produit.findByPk(idProduit, { transaction });
        
        if (!produit) {
          throw new Error('Produit non trouvé');
        }
        
        if (produit.stock < quantite) {
          throw new Error(`Stock insuffisant. Disponible: ${produit.stock}, Demandé: ${quantite}`);
        }
        
        // Calculer le total
        const total = parseFloat(produit.prix) * quantite;
        
        // Créer la commande
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
        
        // Mettre à jour le stock du produit
        await Produit.update(
          { stock: produit.stock - quantite },
          { where: { id: idProduit }, transaction }
        );
        
        await transaction.commit();
        
        // Récupérer la commande avec les informations du produit
        const commandeComplete = await Commende.findByPk(nouvelleCommande.id, {
          include: [{
            model: Produit,
            as: 'produit',
            attributes: ['id', 'nom', 'prix', 'type', 'description']
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
}

module.exports = ProduitServiceClient;
