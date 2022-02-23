const express = require('express');
const authController = require('../controllers/authController');
const { check } = require('express-validator');
const auth = require('../middleware/auth');

const router = express.Router();

router.post('/',
    [
        check('email', 'Agrega un email válido').isEmail(),
        check('password', 'El password no puede ir vacio').not().isEmpty()
    ],
    authController.autenticarUsuario
);

router.get('/',
    auth,
    authController.usuarioAutenticado
)

module.exports = router;