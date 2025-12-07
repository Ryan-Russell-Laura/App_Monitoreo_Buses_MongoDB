import express from 'express';
import jwt from 'jsonwebtoken';
import Usuario from '../models/Usuario.js';

const router = express.Router(); 

router.post('/register', async (req, res) => {
  try {
    const { nombre, email, password, rol } = req.body;

    const usuarioExistente = await Usuario.findOne({ email });
    if (usuarioExistente) {
      return res.status(400).json({ error: 'El email ya está registrado' });
    }

    const usuario = new Usuario({ nombre, email, password, rol });
    await usuario.save();

    res.status(201).json({ message: 'Usuario registrado exitosamente' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    const usuario = await Usuario.findOne({ email });
    if (!usuario) {
      return res.status(401).json({ error: 'Credenciales inválidas' });
    }

    const validarPassword = await usuario.comparePassword(password);
    if (!validarPassword) {
      return res.status(401).json({ error: 'Credenciales inválidas' });
    }

    const token = jwt.sign(
      { id: usuario._id, email: usuario.email, rol: usuario.rol },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.json({ token, usuario: { id: usuario._id, nombre: usuario.nombre, email: usuario.email, rol: usuario.rol } });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


// Asumo que tu middleware de protección se importa desde auth.js o middleware/auth.js
// Si no lo ves aquí, busca cómo se importa en otras rutas (ej: routes/rutas.js)
// const { protect } = require('../middleware/auth.js'); 

// ... (Aquí debe ir la lógica de login y register que ya tienes)

// 💡 NUEVA FUNCIÓN: Obtener solo usuarios con rol 'Conductor'
const getConductores = async (req, res) => {
    try {
        // Busca usuarios donde el campo 'rol' sea 'Conductor'
        // y selecciona solo el nombre y el ID
        const conductores = await Usuario.find({ rol: 'Conductor' }).select('nombre _id'); 
        res.status(200).json(conductores);
    } catch (error) {
        res.status(500).json({ 
            message: 'Error al obtener conductores', 
            error: error.message 
        });
    }
};

// 💡 NUEVA RUTA: Endpoint protegido para obtener la lista
// Debes importar o definir el middleware 'protect' (asumo que está disponible)
router.get('/conductores', /* middleware 'protect' aquí, */ getConductores); 


// export default router; // (o el export que use tu proyecto)

export default router;
