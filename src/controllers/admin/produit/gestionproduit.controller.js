const ProduitService = require('../../../services/admin/produit/gestionproduit.service');

// -------------------- AJOUTER UN PRODUIT --------------------
exports.ajouterProduit = async (req, res) => {
  const { nom, type, prix, stock, description } = req.body;
  const image = req.file ? '/uploads/' + req.file.filename : null;

  try {
    const { produit, error } = await ProduitService.ajouterProduit({
      nom, type, prix, stock, description, image
    });

    if (error) return res.status(400).json({ message: error });

    return res.status(201).json({
      message: 'Produit ajouté avec succès',
      produit
    });
  } catch (err) {
    console.error('Erreur ajout produit:', err);
    return res.status(500).json({
      message: 'Erreur serveur lors de l’ajout du produit',
      erreur: err.message
    });
  }
};

// -------------------- MODIFIER UN PRODUIT --------------------
exports.modifierProduit = async (req, res) => {
  const { id } = req.params;
  const { nom, type, prix, stock, description } = req.body;
  const image = req.file ? '/uploads/' + req.file.filename : null;

  try {
    const { produit, error } = await ProduitService.modifierProduit(id, {
      nom, type, prix, stock, description, image
    });

    if (error) return res.status(404).json({ message: error });

    return res.status(200).json({
      message: 'Produit modifié avec succès',
      produit
    });
  } catch (err) {
    console.error('Erreur modification produit:', err);
    return res.status(500).json({
      message: 'Erreur serveur lors de la modification du produit',
      erreur: err.message
    });
  }
};

// -------------------- SUPPRIMER UN PRODUIT --------------------
exports.supprimerProduit = async (req, res) => {
  const { id } = req.params;

  try {
    const { message, error } = await ProduitService.supprimerProduit(id);

    if (error) return res.status(404).json({ message: error });

    return res.status(200).json({ message });
  } catch (err) {
    console.error('Erreur suppression produit:', err);
    return res.status(500).json({
      message: 'Erreur serveur lors de la suppression du produit',
      erreur: err.message
    });
  }
};

// -------------------- CHANGER LE STATUT --------------------
exports.changerStatut = async (req, res) => {
  const { id } = req.params;
  const { statut } = req.body;

  try {
    const { produit, error } = await ProduitService.changerStatut(id, statut);

    if (error) return res.status(400).json({ message: error });

    return res.status(200).json({
      message: `Statut du produit mis à jour: ${statut}`,
      produit
    });
  } catch (err) {
    console.error('Erreur changement statut produit:', err);
    return res.status(500).json({
      message: 'Erreur serveur lors du changement de statut',
      erreur: err.message
    });
  }
};

// -------------------- LISTER LES PRODUITS --------------------
exports.listerProduits = async (req, res) => {
  const { statut } = req.query; // optionnel : ?statut=actif

  try {
    const produits = await ProduitService.listerProduits({ statut });
    return res.status(200).json(produits);
  } catch (err) {
    console.error('Erreur liste produits:', err);
    return res.status(500).json({
      message: 'Erreur serveur lors de la récupération des produits',
      erreur: err.message
    });
  }
};

// -------------------- TROUVER UN PRODUIT PAR ID --------------------
exports.getProduitById = async (req, res) => {
  const { id } = req.params;

  try {
    const produit = await ProduitService.getProduitById(id);

    if (produit.error) return res.status(404).json({ message: produit.error });

    return res.status(200).json(produit);
  } catch (err) {
    console.error('Erreur récupération produit:', err);
    return res.status(500).json({
      message: 'Erreur serveur lors de la récupération du produit',
      erreur: err.message
    });
  }
};
