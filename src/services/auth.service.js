const Utilisateur = require('../models/utilisateur.model');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { jwtConfig, bcryptConfig } = require('../config/security');
const sequelize = require('../config/db');

class AuthService {

  // -------------------- INSCRIPTION --------------------
  static async register({
    nom,
    prenom,
    email,
    mot_de_passe,
    adresse,
    telephone,
    photoProfil,
    role = 'Client'
  }) {
    const t = await sequelize.transaction();
    try {
      const exist = await Utilisateur.findOne({ where: { email }, transaction: t });
      if (exist) {
        await t.rollback();
        return { error: 'Cet utilisateur existe déjà.' };
      }

      const hashedPassword = await bcrypt.hash(mot_de_passe, bcryptConfig.saltRounds);

      const utilisateur = await Utilisateur.create({
        nom,
        prenom,
        email,
        mot_de_passe: hashedPassword,
        adresse,
        telephone,
        photoProfil,
        role
      }, { transaction: t });

      await t.commit();

      return { utilisateur };
    } catch (err) {
      await t.rollback();
      throw err;
    }
  }

  // -------------------- CONNEXION --------------------
  static async login({ identifiant, mot_de_passe }) {
    const isEmail = /\S+@\S+\.\S+/.test(identifiant);
    const utilisateur = await Utilisateur.findOne({
      where: isEmail ? { email: identifiant } : { telephone: identifiant },
    });

    if (!utilisateur) return { error: 'Email ou numéro ou mot de passe incorrect' };
    if (utilisateur.statut !== 'actif') return { error: `Compte ${utilisateur.statut}` };

    const valid = await bcrypt.compare(mot_de_passe, utilisateur.mot_de_passe);
    if (!valid) return { error: 'Mot de passe incorrect' };

    const token = jwt.sign({
      id: utilisateur.id,
      nom: utilisateur.nom,
      prenom: utilisateur.prenom,
      email: utilisateur.email,
      adresse: utilisateur.adresse,
      telephone: utilisateur.telephone,
      photoProfil: utilisateur.photoProfil,
      carte_identite_national_num: utilisateur.carte_identite_national_num,
      role: utilisateur.role
    }, jwtConfig.secret, { expiresIn: jwtConfig.expiresIn });

    return { token, utilisateur };
  }

}

module.exports = AuthService;
