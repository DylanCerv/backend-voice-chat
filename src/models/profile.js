import mongoose from "mongoose";

const profileSchema = new mongoose.Schema({
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    username: {
      type: String,
      required: true,
      maxlength: 150
    },
    glb: {
      type: String,
      required: true,
      maxlength: 20
    },
    createdAt: {
      type: Date,
      default: Date.now
    },
});


export const Profile = mongoose.model('Profiles', profileSchema);
