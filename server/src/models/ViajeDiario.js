import mongoose from 'mongoose';

const horarioSchema = new mongoose.Schema(
  {
    salidaProgramada: {
      type: Date,
      required: true,
    },
    salidaReal: {
      type: Date,
    },
    llegadaProgramada: {
      type: Date,
      required: true,
    },
    llegadaReal: {
      type: Date,
    },
  },
  { _id: false }
);

const monitoreoCombustibleSchema = new mongoose.Schema(
  {
    nivelInicial: {
      type: Number,
      required: true,
    },
    nivelFinal: {
      type: Number,
    },
    consumo: {
      type: Number,
    },
  },
  { _id: false }
);

const viajeDiarioSchema = new mongoose.Schema(
  {
    rutaId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Ruta',
      required: true,
    },
    busId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Bus',
      required: true,
    },
    conductorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Usuario',
      required: true,
    },
    horario: {
      type: horarioSchema,
      required: true,
    },
    monitoreoCombustible: {
      type: monitoreoCombustibleSchema,
      required: true,
    },
    estado: {
      type: String,
      enum: ['Programado', 'En Curso', 'Completado', 'Cancelado'],
      default: 'Programado',
    },
    observaciones: {
      type: String,
    },
  },
  { timestamps: true }
);

export default mongoose.model('ViajeDiario', viajeDiarioSchema);
