import express from 'express';
import ViajeDiario from '../models/ViajeDiario.js';
import { verifyToken } from '../middleware/auth.js';

const router = express.Router();

router.post('/', verifyToken, async (req, res) => {
  try {
    const { rutaId, busId, conductorId, horario, monitoreoCombustible, estado, observaciones } = req.body;
    const viaje = new ViajeDiario({
      rutaId,
      busId,
      conductorId,
      horario,
      monitoreoCombustible,
      estado,
      observaciones,
    });
    await viaje.save();
    await viaje.populate(['rutaId', 'busId', 'conductorId']);
    res.status(201).json(viaje);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/', verifyToken, async (req, res) => {
  try {
    const viajes = await ViajeDiario.find()
      .populate('rutaId')
      .populate('busId')
      .populate('conductorId', 'nombre email rol');
    res.json(viajes);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/:id', verifyToken, async (req, res) => {
  try {
    const viaje = await ViajeDiario.findById(req.params.id)
      .populate('rutaId')
      .populate('busId')
      .populate('conductorId', 'nombre email rol');
    if (!viaje) {
      return res.status(404).json({ error: 'Viaje no encontrado' });
    }
    res.json(viaje);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.put('/:id', verifyToken, async (req, res) => {
  try {
    const { rutaId, busId, conductorId, horario, monitoreoCombustible, estado, observaciones } = req.body;
    const viaje = await ViajeDiario.findByIdAndUpdate(
      req.params.id,
      { rutaId, busId, conductorId, horario, monitoreoCombustible, estado, observaciones },
      { new: true }
    )
      .populate('rutaId')
      .populate('busId')
      .populate('conductorId', 'nombre email rol');
    if (!viaje) {
      return res.status(404).json({ error: 'Viaje no encontrado' });
    }
    res.json(viaje);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.delete('/:id', verifyToken, async (req, res) => {
  try {
    const viaje = await ViajeDiario.findByIdAndDelete(req.params.id);
    if (!viaje) {
      return res.status(404).json({ error: 'Viaje no encontrado' });
    }
    res.json({ message: 'Viaje eliminado exitosamente' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
