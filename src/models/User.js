import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {},
  {
    collection: "users",
    autoCreate: false,
    autoIndex: false,
  },
);

export const User = mongoose.model("User", userSchema);
