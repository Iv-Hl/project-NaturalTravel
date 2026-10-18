import mongoose from "mongoose";

const storySchema = new mongoose.Schema(
  {},
  {
    collection: "articles",
    autoCreate: false,
    autoIndex: false,
  },
);

export const Story =
  mongoose.models.Story || mongoose.model("Story", storySchema);
