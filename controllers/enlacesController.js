const Enlaces = require('../models/Enlace');
const shortid = require('shortid');
const bcrypt = require('bcrypt');
const { validationResult } = require('express-validator');


exports.nuevoEnlace = async (req, res, next) => {
    //revisar si hay errores

    const errores = validationResult(req);
    if(!errores.isEmpty()){
        return res.status(400).json({ errores: errores.array() });
    }

    //crear un obj de enlace
    const { nombre_original } = req.body;
    
    const enlace = new Enlaces();
    enlace.url = shortid.generate();
    enlace.nombre = shortid.generate();
    enlace.nombre_original = nombre_original;
    
    //si el usuario esta autenticado
    if (req.usuario) {
        const { password, descargas } = req.body;
        //asignar a enlace el numero de descargas
        if (descargas) {
            enlace.descargas = descargas;
        }

        //asignar un password
        if (password) {
            const salt = await bcrypt.genSalt(10);
            enlace.password = await bcrypt.hash( password, salt );
        }

        //asignar el autor
        enlace.autor = req.usuario.id
    }
    
    //almacenar en la BD
    try {
        await enlace.save();
        res.json({ msg:  `${enlace.url}`});
        next();
    } catch (error) {
        console.log(error);
    }
}

//obtener el enlace
exports.obtenerEnlace = async (req, res, next) => {

    const { url } = req.params;

    //verificar si existe el enlace

    const enlace = await Enlaces.findOne({ url });

    if(!enlace) {
        res.status(404).json({ msg: 'Ese enlace no existe' });
        return next();
    }

    //si el enlace existe
    res.json({ archivo: enlace.nombre });

    //Si las descargas son iguales  1 - borrar la entrada y el archivo

    const { descargas, nombre } = enlace;
    if(descargas === 1) {
        
        //eliminar el archivo
        req.archivo = nombre;

        //eliminar la entrada de la bd
        await Enlaces.findOneAndRemove(req.params.url);

        next();
    } else {
        //restar 1
        enlace.descargas--;
        await enlace.save();


    }

    //si las descargas son > a 1 - restar 1

}