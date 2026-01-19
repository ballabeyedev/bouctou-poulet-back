const Commende = require('../../models/commende.model');
const Produit = require('../../models/produit.model');
const sequelize = require('../../config/db');

class CommendeServiceClient {
  // -------------------- COMMENDER UN PRODUIT --------------------
  async commanderProduit(commandeData) {
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
  
  // -------------------- LISTER LES COMMANDES D'UN CLIENT --------------------
  async listerCommandesClient(telephone) {
    try {
      const commandes = await Commende.findAll({
        where: { telephone },
        include: [{
          model: Produit,
          as: 'produit',
          attributes: ['id', 'nom', 'prix', 'type']
        }],
        order: [['createdAt', 'DESC']]
      });
      
      return {
        success: true,
        commandes
      };
    } catch (error) {
      console.error('Erreur lors de la récupération des commandes:', error);
      return {
        success: false,
        message: 'Erreur lors de la récupération des commandes'
      };
    }
  }
  
  // -------------------- METTRE À JOUR LE STATUT D'UNE COMMANDE --------------------
  async mettreAJourStatutCommande(idCommande, nouveauStatut) {
    try {
      const commande = await Commende.findByPk(idCommande);
      
      if (!commande) {
        return {
          success: false,
          message: 'Commande non trouvée'
        };
      }
      
      const statutsValides = ['en_attente', 'confirmee', 'livree', 'annulee'];
      if (!statutsValides.includes(nouveauStatut)) {
        return {
          success: false,
          message: 'Statut invalide'
        };
      }
      
      // Si la commande est annulée, remettre le stock
      if (nouveauStatut === 'annulee' && commande.statut !== 'annulee') {
        const produit = await Produit.findByPk(commande.idProduit);
        if (produit) {
          await Produit.update(
            { stock: produit.stock + commande.quantite },
            { where: { id: commande.idProduit } }
          );
        }
      }
      
      await commande.update({ statut: nouveauStatut });
      
      return {
        success: true,
        message: 'Statut de la commande mis à jour',
        commande
      };
    } catch (error) {
      console.error('Erreur lors de la mise à jour du statut:', error);
      return {
        success: false,
        message: 'Erreur lors de la mise à jour du statut'
      };
    }
  }
}

module.exports = new CommendeServiceClient();