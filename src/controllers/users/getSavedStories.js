import createHttpError from "http-errors";
import { Story } from "../../models/index.js";

export const getSavedStories = async (req, res) => {
  if (!req.user) {
    throw createHttpError(401, "Authentication required");
  }

  const page = Math.max(1, Number.parseInt(req.query.page, 10) || 1);

  const limit = Math.min(
    50,
    Math.max(1, Number.parseInt(req.query.limit, 10) || 6),
  );

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
