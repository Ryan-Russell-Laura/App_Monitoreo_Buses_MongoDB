import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const usuarioSchema = new mongoose.Schema(
  {
    nombre: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: true,
    },
    rol: {
      type: String,
      enum: ['Admin', 'Programador', 'Conductor'],
      default: 'Conductor',
    },
  },
  { timestamps: true }
);

usuarioSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

usuarioSchema.methods.comparePassword = async function (passwordIngresada) {
  return bcrypt.compare(passwordIngresada, this.password);
};

export default mongoose.model('Usuario', usuarioSchema);
