import { Category } from "../../models/Category.js";

export const getCategories = async (_req, res, next) => {
  try {
    const categories = await Category.find().
      select("_id category").
      lean();
    
    const result = categories.map(function (item) {
      return {
        id: item._id.toString(),
        category: item.category,
      };
    });

    return res.status(200).json(result);
  } catch (error) {
    return next(
      new Error("Помилка при отриманні категорій.",
        { cause: error }
      )
    );
  }
};
