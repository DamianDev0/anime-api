import { Router } from 'express';
import path from 'path';
import multer from 'multer';
import fs from 'fs';

// Definir __dirname en ES Module
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const router = Router();

// Configurar almacenamiento con multer
const storage = multer.diskStorage({
    destination: path.join(__dirname, '../public/uploads'),
    filename: (req, file, cb) => {
        cb(null, file.originalname);
    }
});

const uploadImage = multer({
    storage,
    limits: { fileSize: 1000000 } // Límite de tamaño de archivo: 1MB
}).single('image');

// Ruta para renderizar el formulario de subida
router.get('/images/upload', (req, res) => {
    res.render('index'); // Asegúrate de tener una vista 'index' configurada si usas un motor de plantillas
});

// Ruta para manejar la subida de imágenes
router.post('/images/upload', (req, res) => {
    uploadImage(req, res, (err) => {
        if (err) {
            return res.status(400).send(err.message);
        }
        console.log(req.file);
        res.send('uploaded');
    });
});

export default router;
