const express = require('express');
const usuarioController = require('../controllers/usuarioController');
const { check } = require('express-validator');

const router = express.Router();

router.post('/',
    [
        check('nombre', 'El nombre es obligatorio').not().isEmpty(),
        check('email', 'El email no es valido').isEmail(),
        check('password', 'El password debe ser de al menos 6 caracteres').isLength({min: 6})
    ],
    usuarioController.nuevoUsuario
);

module.exports = router;