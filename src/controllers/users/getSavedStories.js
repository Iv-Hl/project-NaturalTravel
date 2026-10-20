import createHttpError from "http-errors";
import { Story } from "../../models/index.js";

export const getSavedStories = async (req, res) => {
  if (!req.user) {
    throw createHttpError(401, "Authentication required");
  }

  const page = req.query.page === undefined ? 1 : Number(req.query.page);

  if (!Number.isInteger(page) || page < 1) {
    throw createHttpError(400, "Page must be a positive integer");
  }

  const limit = req.query.limit === undefined ? 6 : Number(req.query.limit);

  if (!Number.isInteger(limit) || limit < 1 || limit > 50) {
    throw createHttpError(400, "Limit must be an integer from 1 to 50");
  }

  const savedArticles = req.user.savedArticles ?? [];

  const totalItems = savedArticles.length;
  const totalPages = Math.ceil(totalItems / limit);

  const startIndex = (page - 1) * limit;
  const pageIds = savedArticles.slice(startIndex, startIndex + limit);

  const foundStories = pageIds.length
    ? await Story.find({ _id: { $in: pageIds } }).lean()
    : [];

  const storiesById = new Map(
    foundStories.map((story) => [String(story._id), story]),
  );

  const stories = pageIds
    .map((id) => storiesById.get(String(id)))
    .filter(Boolean);

  res.status(200).json({
    stories,
    pagination: {
      page,
      limit,
      totalItems,
      totalPages,
    },
  });
};
