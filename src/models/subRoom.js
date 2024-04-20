import mongoose from 'mongoose';

// Esquema para la subsala
const subRoomSchema = new mongoose.Schema({
    roomId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Room',
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

// Modelo para la subsala
export const SubRoom = mongoose.model('SubRooms', subRoomSchema);
