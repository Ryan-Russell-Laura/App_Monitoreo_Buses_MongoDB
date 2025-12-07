import mongoose from 'mongoose';

const busSchema = new mongoose.Schema(
  {
    placa: {
      type: String,
      required: true,
      unique: true,
      uppercase: true,
    },
    modelo: {
      type: String,
      required: true,
    },
    capacidad: {
      type: Number,
      required: true,
    },
    mantenimiento: {
      type: Date,
    },
  },
  { timestamps: true }
);

export default mongoose.model('Bus', busSchema);
