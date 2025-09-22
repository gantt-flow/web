import express from 'express';
import { search } from '../controllers/search.controller.js';
import auth from '../middleware/authMiddleware.js';

const router = express.Router();

// La ruta será /search?query=término_de_busqueda
router.get('/', auth, search);

export default router;