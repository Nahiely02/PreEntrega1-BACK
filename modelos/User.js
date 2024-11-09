const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  first_name: { type: String, required: true },
  last_name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  age: { type: Number, required: true },
  password: { type: String, required: true },
  cart: { type: mongoose.Schema.Types.ObjectId, ref: 'Cart' },  // Referencia a un carrito
  role: { type: String, default: 'user' },  // Valor por defecto
});

// Middleware para encriptar la contraseña
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = bcrypt.hashSync(this.password, 10);
  next();
});

// Método para comparar la contraseña
userSchema.methods.comparePassword = function (password) {
  return bcrypt.compareSync(password, this.password);
};

module.exports = mongoose.model('User', userSchema);
