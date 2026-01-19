const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller');
const upload = require('../middlewares/upload.middleware');
const auth = require('../middlewares/auth.middleware');
const commendeClientController = require('../controllers/client/commende.controller');

router.post('/register', upload.single('photoProfil'), authController.inscriptionUser);
router.post('/login', authController.login);


// Commander un produit
router.post(
  '/commander-produit-client',
  commendeClientController.commenderProduitsClient
);

module.exports = router;
