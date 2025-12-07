import mongoose from 'mongoose';

const rutaSchema = new mongoose.Schema(
  {
    nombreRuta: {
      type: String,
      required: true,
    },
    origen: {
      type: String,
      required: true,
    },
    destino: {
      type: String,
      required: true,
    },
    duracionEstimada: {
      type: Number,
      required: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model('Ruta', rutaSchema);
