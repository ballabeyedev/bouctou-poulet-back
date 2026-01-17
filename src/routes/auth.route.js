const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller');
const upload = require('../middlewares/upload.middleware');
const auth = require('../middlewares/auth.middleware');

router.post('/register', upload.single('photoProfil'), authController.inscriptionUser);
router.post('/login', authController.login);

module.exports = router;
