import express from 'express';
import Ruta from '../models/Ruta.js';
import { verifyToken } from '../middleware/auth.js';

const router = express.Router();

router.get('/', verifyToken, async (req, res) => {
  try {
    const rutas = await Ruta.find();
    res.json(rutas);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/', verifyToken, async (req, res) => {
  try {
    const { nombreRuta, origen, destino, duracionEstimada } = req.body;
    const ruta = new Ruta({ nombreRuta, origen, destino, duracionEstimada });
    await ruta.save();
    res.status(201).json(ruta);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
