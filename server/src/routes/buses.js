import express from 'express';
import Bus from '../models/Bus.js';
import { verifyToken } from '../middleware/auth.js';

const router = express.Router();

router.get('/', verifyToken, async (req, res) => {
  try {
    const buses = await Bus.find();
    res.json(buses);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/', verifyToken, async (req, res) => {
  try {
    const { placa, modelo, capacidad, mantenimiento } = req.body;
    const bus = new Bus({ placa, modelo, capacidad, mantenimiento });
    await bus.save();
    res.status(201).json(bus);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
