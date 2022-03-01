const multer = require('multer');
const shortid = require('shortid');
const fs = require('fs');
const Enlace = require('../models/Enlace');

exports.subirArchivo = async (req, res, next) => {
    const configuracionMulter = {
        limits : { fileSize : req.usuario ? 1024 * 1024 * 10 : 1024 * 1024 },
        storage: fileStorage = multer.diskStorage({
            destination: (req, file, cb) => {
                cb(null, __dirname+'/../uploads')
            },
            filename: (req, file, cb) => {

                const extensionArray = file.originalname.split('.');
                const extensionName = extensionArray[ extensionArray.length -1 ];

                //const extension = file.originalname.substring(file.originalname.lastIndexOf('.'), file.originalname.length);
                cb(null, `${shortid.generate()}.${extensionName}`)
            }
        })
    }
    
    const upload = multer(configuracionMulter).single('archivo');
    
    upload( req, res, async (error) => {
        console.log(req.file);
        if(!error) {
            res.json({ archivo: req.file.filename });
        } else {
            console.log(error);
            return next();
        }
    });

}

exports.eliminarArchivo = async (req, res) => {

    try {
        fs.unlinkSync(__dirname + `/../uploads/${req.archivo}`);
        console.log('archivo eliminado');
    } catch (error) {
        console.log(error);
    }

}

//descarga un archivo
exports.descargar = async (req, res, next) => {

    //obtiene el enlace
    
    const enlace = await Enlace.findOne({ nombre: req.params.archivo })
    console.log(enlace)

    const archivoDescarga = __dirname + '/../uploads/' + req.params.archivo;

    res.download(archivoDescarga);
 
    
    const { descargas, nombre } = enlace;
    if(descargas === 1) {
        
        //eliminar el archivo
        req.archivo = nombre;

        //eliminar la entrada de la bd
        await Enlace.findOneAndRemove(enlace.id);

        next();
    } else {
        //restar 1
        enlace.descargas--;
        await enlace.save();


    }
}