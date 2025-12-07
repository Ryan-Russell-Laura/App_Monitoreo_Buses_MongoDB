import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { connectDB } from './config/database.js';
import authRoutes from './routes/auth.js';
import busesRoutes from './routes/buses.js';
import rutasRoutes from './routes/rutas.js';
import viajeDiarioRoutes from './routes/viajeDiario.js';

dotenv.config();

const app = express();

connectDB();

// INICIO DEL CAMBIO CRÍTICO DE CORS
// 1. Define los orígenes permitidos
const allowedOrigins = [
    'http://localhost:5173', // Para desarrollo local
    'https://app-monitoreo-buses-frontend.netlify.app/' // <<-- ¡PEGA AQUÍ TU URL DE NETLIFY!
];

// 2. Aplica la configuración de CORS
app.use(cors({
    origin: allowedOrigins,
    credentials: true, // Esto es CRUCIAL si manejas tokens de autorización
}));
// FIN DEL CAMBIO CRÍTICO DE CORS

app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/buses', busesRoutes);
app.use('/api/rutas', rutasRoutes);
app.use('/api/viajes-diarios', viajeDiarioRoutes);

app.get('/api/health', (req, res) => {
  res.json({ status: 'API running' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
