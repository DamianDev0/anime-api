import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';
import errorHandler from './middlewares/errorHandler.js';
import routerAnimes from './routes/anime-route.js';
import studiosRouter from './routes/studios-route.js';

dotenv.config();
const app = express();
const PORT = process.env.PORT || 4000;

// Definir __dirname en ES Module
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Crear el directorio 'public/uploads' si no existe
const uploadDir = path.join(__dirname, '..', 'public', 'uploads');
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

app.use(express.json());
app.use(cors());

// Middleware para servir archivos estáticos (imágenes subidas)
app.use('/uploads', express.static(path.join(__dirname, '..', 'public', 'uploads')));

// Usar rutas de animes
app.use('/animes', routerAnimes);
app.use('/studios', studiosRouter);

app.use(errorHandler);

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
