import mongoose from "mongoose";

const profileSchema = new mongoose.Schema({
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    name: {
      type: String,
      required: true,
      maxlength: 150
    },
    lastname: {
      type: String,
      maxlength: 150
    },
    phone: {
      type: String,
      maxlength: 150
    },
    nickname: {
      type: String,
      required: true,
      maxlength: 150
    },
    glb: {
      type: String,
      maxlength: 20
    },
    createdAt: {
      type: Date,
      default: Date.now
    },
});


export const Profile = mongoose.model('Profiles', profileSchema);
