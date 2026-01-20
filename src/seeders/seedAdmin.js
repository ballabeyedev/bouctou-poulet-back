const bcrypt = require('bcryptjs');
const User = require('../models/utilisateur.model');

async function seedAdmin() {
  try {
    const adminEmail = 'ot218053@gmail.com';

    // 🔍 Vérifier si l'admin existe déjà PAR EMAIL
    const adminExiste = await User.findOne({
      where: { email: adminEmail }
    });

    if (adminExiste) {
      console.log('ℹ️ Admin déjà existant (email trouvé), seed ignoré');
      return;
    }

    // 🔐 Hash du mot de passe
    const passwordHash = await bcrypt.hash('Toure@223', 10);

    // 👤 Création de l'admin
    await User.create({
      nom: 'TOURE',
      prenom: 'Oumar',
      email: adminEmail,
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
