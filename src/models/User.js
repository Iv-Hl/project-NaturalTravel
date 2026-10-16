import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      maxlength: 32,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      maxlength: 64,
    },
    password: {
      type: String,
      required: true,
      select: false,
    },
    avatar: {
      type: String,
      default: "https://ac.go it.global/fullstack/react/default-avatar.jpg",
    },
  },
  {
    timestamps: true,
    versionKey: false,
    collection: "users",
    autoCreate: false,
    autoIndex: false,
  },
);

export const User = mongoose.model("User", userSchema);
