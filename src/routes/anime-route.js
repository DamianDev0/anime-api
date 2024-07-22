import { Router } from 'express';
import { promises as fs } from 'fs';
import { fileURLToPath } from 'url';
import path from 'path';
import multer from 'multer';

// Definir __dirname en ES Module
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const animesFilePath = path.join(__dirname, '../../server/data.json');

// Configuración de multer para almacenar archivos en 'public/uploads'
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, path.join(__dirname, '..', 'public', 'uploads')); // Guardar en 'public/uploads'
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
    }
});
const upload = multer({ storage });

const animesRouter = Router();

const readAnimes = async () => {
    try {
        const animes = await fs.readFile(animesFilePath, 'utf8');
        return JSON.parse(animes);
    } catch (err) {
        console.error('Error reading animes:', err);
        throw err; // Lanzar el error para manejarlo en el middleware de error
    }
};

const writeAnimes = async (animes) => {
    try {
        await fs.writeFile(animesFilePath, JSON.stringify(animes, null, 2), 'utf8');
    } catch (err) {
        console.error('Error writing animes:', err);
        throw err; // Lanzar el error para manejarlo en el middleware de error
    }
};

// Ruta para crear un nuevo anime con archivo opcional
animesRouter.post('/', upload.single('image'), async (req, res) => {
    try {
        const data = await readAnimes();
        if (!data.animes) data.animes = []; // Asegúrate de que `data.animes` exista

        const newAnime = {
            id: data.animes.length + 1,
            title: req.body.title,
            genre: req.body.genre,
            description: req.body.description,
            image: req.file ? `/uploads/${path.basename(req.file.path)}` : null // Guardar la ruta del archivo si se ha subido
        };

        data.animes.push(newAnime);
        await writeAnimes(data);
        res.status(201).json({ message: 'Anime created successfully', anime: newAnime });
    } catch (err) {
        res.status(500).json({ message: 'Internal Server Error' });
    }
});

// Ruta para actualizar un anime con archivo opcional
animesRouter.put('/:id', upload.single('image'), async (req, res) => {
    try {
        const data = await readAnimes();
        if (!data.animes) data.animes = []; // Asegúrate de que `data.animes` exista

        const animeIndex = data.animes.findIndex(anime => anime.id === parseInt(req.params.id, 10));

        if (animeIndex === -1) {
            return res.status(404).json({ message: 'Anime not found' });
        }

        const updateAnime = {
            ...data.animes[animeIndex],
            title: req.body.title || data.animes[animeIndex].title,
            genre: req.body.genre || data.animes[animeIndex].genre,
            description: req.body.description || data.animes[animeIndex].description,
            image: req.file ? `/uploads/${path.basename(req.file.path)}` : data.animes[animeIndex].image // Actualizar la ruta del archivo si se ha subido
        };

        data.animes[animeIndex] = updateAnime;
        await writeAnimes(data);
        res.json({ message: 'Anime updated successfully', anime: updateAnime });
    } catch (err) {
        res.status(500).json({ message: 'Internal Server Error' });
    }
});

// Ruta para obtener todos los animes
animesRouter.get('/', async (req, res) => {
    try {
        const data = await readAnimes();
        res.json(data.animes);
    } catch (err) {
        res.status(500).json({ message: 'Internal Server Error' });
    }
});

// Ruta para obtener un anime por ID
animesRouter.get('/:id', async (req, res) => {
    try {
        const data = await readAnimes();

        const findAnime = data.animes.find(anime => anime.id === parseInt(req.params.id, 10));

        if (!findAnime) {
            return res.status(404).json({ message: 'Anime not found' });
        }
        res.json({ message: 'Anime found', anime: findAnime });
    } catch (err) {
        res.status(500).json({ message: 'Internal Server Error' });
    }
});

export default animesRouter;
