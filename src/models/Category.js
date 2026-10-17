import mongoose from "mongoose";

const categorySchema = new mongoose.Schema({
  category: {
    type: String,
    required: true,
  }
},
{
  collection: "categories",
  autoCreate: false,
  autoIndex: false,
});

export const Category = mongoose.model("Category", categorySchema);
