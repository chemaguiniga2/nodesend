const express = require('express');
const authController = require('../controllers/authController');
const { check } = require('express-validator');

const router = express.Router();

router.post('/',
    authController.autenticarUsuario
);

router.get('/',
    authController.usuarioAutenticado
)

module.exports = router;