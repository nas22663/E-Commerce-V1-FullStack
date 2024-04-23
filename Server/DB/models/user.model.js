import mongoose from "mongoose";
import { systemRoles } from "../../src/utils/system-roles.js";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: Object.values(systemRoles),
      default: systemRoles.USER,
    },
    phoneNumbers: [
      {
        type: String,
        required: true,
      },
    ],
    addresses: [
      {
        type: String,
        required: true,
      },
    ],
    isEmailVerified: {
      type: Boolean,
      default: false,
    },
    isloggedIn: {
      type: Boolean,
      default: false,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    profilePicture: {
      secure_url: { type: String },
      public_id: { type: String, unique: true },
    },
    folderId: { type: String, required: true },
  },
  { timestamps: true }
);

export default mongoose.models.User || mongoose.model("User", userSchema);
