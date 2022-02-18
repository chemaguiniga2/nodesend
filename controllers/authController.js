const Usuario = require('../models/Usuario');

exports.autenticarUsuario = async(req, res, next) => {
    //revisar si hay errores

    //buscar el usuario para ver si esta registrado
    const { email } = req.body;
    const usuario = await Usuario.findOne({ email });
    console.log(usuario);

    if(!usuario) { 
        res.status(401).json({ msg: 'El usuario no existe' });
        return next();
    }

    //verificar el password y autenticar el usuario

}

exports.usuarioAutenticado = (req, res) => {

}