import createHttpError from "http-errors";
import mongoose from "mongoose";

import { Story } from "../../models/story.js";
import { Category } from "../../models/Category.js";
import { uploadImage } from "../../utils/cloudinary.js";

export const createStory = async (req, res, next) => {
  try {
    const { title, article, category } = req.body;

    // Перевіряємо обов'язкові поля
    if (
      typeof title !== "string" ||
      typeof article !== "string" ||
      typeof category !== "string" ||
      !title.trim() ||
      !article.trim() ||
      !category.trim() ||
      !req.file
    ) {
      throw createHttpError(
        400,
        "Title, article, category and image are required",
      );
    }

    const normalizedTitle = title.trim();
    const normalizedArticle = article.trim();

    // Перевіряємо довжину назви
    if (normalizedTitle.length < 2 || normalizedTitle.length > 40) {
      throw createHttpError(400, "Title must be between 2 and 40 characters");
    }

    // Перевіряємо довжину тексту
    if (normalizedArticle.length < 12 || normalizedArticle.length > 3000) {
      throw createHttpError(
        400,
        "Article must be between 12 and 3000 characters",
      );
    }

    // Перевіряємо формат ID категорії
    if (!mongoose.isValidObjectId(category)) {
      throw createHttpError(400, "Invalid category ID");
    }

    // Перевіряємо, чи існує категорія в MongoDB
    const existingCategory = await Category.findById(category);

    if (!existingCategory) {
      throw createHttpError(400, "Category not found");
    }

    // Завантажуємо зображення в Cloudinary
    const img = await uploadImage(req.file.buffer);

    // Створюємо історію з автором із сесії
    const story = await Story.create({
      title: normalizedTitle,
      article: normalizedArticle,
      category: existingCategory._id,
      img,
      owner: req.user._id,
    });

    return res.status(201).json(story);
  } catch (error) {
    return next(error);
  }
};
