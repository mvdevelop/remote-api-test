
// models/User.js
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
      maxlength: 80,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      match: [/.+\@.+\..+/, 'Invalid email format'],
    },
    password: {
      type: String,
      required: true,
      minlength: 6,
      select: true, // 🔒 não retorna por padrão em consultas (melhor segurança)
    },
    refreshToken: {
      type: String,
      select: false, // 🔒 evita vazar em respostas de API
    },
  },
  { timestamps: true }
);

// ✅ opcional: método utilitário (caso queira chamar user.comparePassword)
userSchema.methods.comparePassword = async function (candidatePassword, bcrypt) {
  return await bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model('User', userSchema);
