import mongoose from 'mongoose';

// Esquema para la sala
const roomSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    name: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

// Modelo para la sala
export const Room = mongoose.model('Rooms', roomSchema);
