import mongoose from "mongoose";

const storySchema = new mongoose.Schema(
  {
    img: {
      type: String,
      required: true,
    },
    title: {
      type: String,
      required: true,
      minlength: 2,
      maxlength: 40,
    },
    article: {
      type: String,
      required: true,
      minlength: 12,
      maxlength: 3000,
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },
    rate: {
      type: Number,
      default: 0,
      min: 0,
    },
    ownerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    date: {
      type: String,
      required: true,
      match: /^\d{4}-\d{2}-\d{2}$/,
    },
  },
  {
    collection: "articles",
    autoCreate: false,
    autoIndex: false,
    versionKey: false,
  },
);

export const Story =
  mongoose.models.Story || mongoose.model("Story", storySchema);