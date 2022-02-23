const express = require('express');
const archivosController = require('../controllers/archivosController');
const auth = require('../middleware/auth');
const router = express.Router();


router.post('/',
    auth,
    archivosController.subirArchivo
);

router.delete('/:id',
    archivosController.eliminarArchivo
);

module.exports = router;