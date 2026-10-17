import { Story } from "../../models/Story.js";

export const getOwnStories = async (req, res) => {
  const userId = req.user?._id;

  if (!userId) {
    return res.status(401).json({
      message: "Unauthorized",
    });
  }

  const page = Math.max(1, Number(req.query.page) || 1);
  const limit = Math.max(1, Number(req.query.limit) || 10);
  const skip = (page - 1) * limit;

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
