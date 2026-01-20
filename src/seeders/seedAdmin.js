const bcrypt = require('bcryptjs');
const User = require('../models/utilisateur.model');

async function seedAdmin() {
  try {
    // 🔍 Vérifier si un admin existe déjà
    const adminExiste = await User.findOne({
      where: { role: 'Admin' }
    });

    if (adminExiste) {
      console.log('ℹ️ Admin déjà existant, seed ignoré');
      return;
    }

    // 🔐 Hash du mot de passe
    const passwordHash = await bcrypt.hash('Toure@223', 10);

    // 👤 Création de l'admin
    await User.create({
      nom: 'TOURE',
      prenom: 'Oumar',
      email: 'ot218053@gmail.com',
      mot_de_passe: passwordHash,
      adresse: 'Mali, Bamako',
      telephone: '+22391178664',
      role: 'Admin',
      statut: 'actif'
    });

    console.log('✅ Compte ADMIN créé avec succès');

  } catch (error) {
    console.error('❌ Erreur lors de la création de l’admin :', error);
  }
}

module.exports = seedAdmin;
