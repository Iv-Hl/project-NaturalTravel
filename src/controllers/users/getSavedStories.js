import createHttpError from "http-errors";
import { Story } from "../../models/index.js";
import { parsePositiveInteger } from "../../utils/pagination.js";

export const getSavedStories = async (req, res) => {
  if (!req.user) {
    throw createHttpError(401, "Authentication required");
  }

  const page = parsePositiveInteger(req.query.page, {
    name: "page",
    defaultValue: 1,
  });
  const limit = parsePositiveInteger(req.query.limit, {
    name: "limit",
    defaultValue: 6,
    max: 50,
  });

  const savedArticles = [
    ...new Set((req.user.savedArticles ?? []).map((id) => String(id))),
  ];
  const existingIds = savedArticles.length
    ? await Story.distinct("_id", { _id: { $in: savedArticles } }).exec()
    : [];
  const existingIdSet = new Set(existingIds.map((id) => String(id)));
  const validSavedArticles = savedArticles.filter((id) => existingIdSet.has(id));

  const totalItems = validSavedArticles.length;
  const totalPages = Math.ceil(totalItems / limit);

  const startIndex = (page - 1) * limit;
  if (!Number.isSafeInteger(startIndex)) {
    throw createHttpError(400, "Pagination is out of range");
  }
  const pageIds = validSavedArticles.slice(startIndex, startIndex + limit);

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
