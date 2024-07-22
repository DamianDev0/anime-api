import { Router } from "express";
import { promises as fs } from 'fs';
import { fileURLToPath } from "url";
import path from 'path';


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const studioFilePath = path.join(__dirname, '../../server/data.json')


const studiosRouter = Router();

const readStudio = async () => {
    try {

        const data = await fs.readFile(studioFilePath, 'utf8');
        return JSON.parse(data);
    }
    catch (error) {
        console.error('Error reading studios:', error);
    }
}

const writeStudio = async (studio) => {
    try {
        await fs.writeFile(studioFilePath, JSON.stringify(studio), 'utf8');
    }
    catch (error) {
        console.error('Error writing studios:', error);
    }
}

// routes

// route post request

studiosRouter.post('/' , async (req, res) => {
    try{
        const data = await readStudio()
        const newStudio = {
            id: data.studios.length + 1,
            name: req.body.name,
            description: req.body.description,
            
        }

        data.studios.push(newStudio)
        writeStudio(data)
        res.status(201).json({ message: 'Studio created successfully', studio: newStudio });

    }
    catch(error){
        res.status(500).json({ message: 'Internal Server Error' });
    }
})

studiosRouter.get('/', async (req, res) => {
    try {
        const data = await readStudio();
        const studios = data.studios;
        const animes = data.animes;

        const result = studios.map(studio => {

            const studioAnimes = animes.filter(anime => anime.studioId === studio.id);

            const animeTitles = studioAnimes.map(anime => anime.title).join(', ');

            return {
                ...studio,
                animeTitles: animeTitles 
            };
        });

        res.json(result);
    } catch (err) {
        console.error('Error retrieving studios and animes:', err);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});



export default studiosRouter