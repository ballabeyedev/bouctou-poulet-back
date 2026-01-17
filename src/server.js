require('dotenv').config();
const sequelize = require('./config/db');
const app = require('./app');

(async () => {
  try {
    await sequelize.sync(); // ⚠️ PAS alter en prod
    console.log('✅ Base de données synchronisée');

    const PORT = process.env.PORT || 3000;
    app.listen(PORT, '0.0.0.0', () => {
      console.log(`🚀 Serveur démarré sur le port ${PORT}`);
    });
  } catch (error) {
    console.error('❌ Erreur serveur :', error);
  }
})();
