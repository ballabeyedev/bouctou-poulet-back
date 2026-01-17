const Produit = require('../../../models/produit.model');
const sequelize = require('../../../config/db');

class ProduitService {

  // -------------------- AJOUTER UN PRODUIT --------------------
  static async ajouterProduit({ nom, type, prix, stock, description, image }) {
    const t = await sequelize.transaction();
    try {
      const produit = await Produit.create(
        { nom, type, prix, stock, description, image },
        { transaction: t }
      );
      await t.commit();
      return { produit };
    } catch (err) {
      await t.rollback();
      throw err;
    }
  }

  // -------------------- MODIFIER UN PRODUIT --------------------
  static async modifierProduit(id, { nom, type, prix, stock, description, image }) {
    const t = await sequelize.transaction();
    try {
      const produit = await Produit.findByPk(id, { transaction: t });
      if (!produit) return { error: 'Produit introuvable' };

      await produit.update({ nom, type, prix, stock, description, image }, { transaction: t });
      await t.commit();
      return { produit };
    } catch (err) {
      await t.rollback();
      throw err;
    }
  }

  // -------------------- SUPPRIMER UN PRODUIT --------------------
  static async supprimerProduit(id) {
    const t = await sequelize.transaction();
    try {
      const produit = await Produit.findByPk(id, { transaction: t });
      if (!produit) return { error: 'Produit introuvable' };

      await produit.destroy({ transaction: t });
      await t.commit();
      return { message: 'Produit supprimé avec succès' };
    } catch (err) {
      await t.rollback();
      throw err;
    }
  }

  // -------------------- CHANGER LE STATUT (ACTIF / INACTIF) --------------------
  static async changerStatut(id, statut) {
    if (!['actif', 'inactif'].includes(statut)) return { error: 'Statut invalide' };

    const t = await sequelize.transaction();
    try {
      const produit = await Produit.findByPk(id, { transaction: t });
      if (!produit) return { error: 'Produit introuvable' };

      await produit.update({ statut }, { transaction: t });
      await t.commit();
      return { produit };
    } catch (err) {
      await t.rollback();
      throw err;
    }
  }

  // -------------------- LISTER TOUS LES PRODUITS --------------------
  static async listerProduits({ statut } = {}) {
    const whereClause = statut ? { statut } : {};
    const produits = await Produit.findAll({ where: whereClause });
    return produits;
  }

  // -------------------- TROUVER UN PRODUIT PAR ID --------------------
  static async getProduitById(id) {
    const produit = await Produit.findByPk(id);
    if (!produit) return { error: 'Produit introuvable' };
    return produit;
  }
}

module.exports = ProduitService;
