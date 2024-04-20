import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    email: {
      type: String,
      required: true,
      unique: true,
      maxlength: 150,
    },
    password: {
      type: String,
      required: true,
      maxlength: 150,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    }
});

// Crea el modelo de usuario utilizando el esquema definido
export const User = mongoose.model('Users', userSchema);
