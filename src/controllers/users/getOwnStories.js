import createHttpError from "http-errors";
import { Story } from "../../models/Story.js";
import { parsePositiveInteger } from "../../utils/pagination.js";

export const getOwnStories = async (req, res) => {
  const userId = req.user?._id;

  if (!userId) {
    return res.status(401).json({
      message: "Unauthorized",
    });
  }

  const page = parsePositiveInteger(req.query.page, {
    name: "page",
    defaultValue: 1,
  });
  const limit = parsePositiveInteger(req.query.limit, {
    name: "limit",
    defaultValue: 10,
    max: 50,
  });
  const skip = (page - 1) * limit;

  if (!Number.isSafeInteger(skip)) {
    throw createHttpError(400, "Pagination is out of range");
  }

  const filter = { ownerId: userId };

  const [stories, total] = await Promise.all([
    Story.find(filter)
      .sort({ date: -1, _id: -1 })
      .skip(skip)
      .limit(limit)
      .lean(),
    Story.countDocuments(filter),
  ]);

  res.status(200).json({
    stories,
    total,
    page,
    limit,
    totalPages: Math.ceil(total / limit),
  });
};
