import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  savedStories: {
    type: [mongoose.Schema.Types.ObjectId],
    ref: "Story",
    default: [],
  }
}, {
  collection: "users",
  autoCreate: false,
  autoIndex: false,
});

export const User = mongoose.model("User", userSchema);
