import { Story } from "../../models/index.js";

export const getStories = async (req, res, next) => {
  try {
    const { page = 1, limit = 10, category, type } = req.query;

    const pageNumber = Math.max(1, parseInt(page, 10));
    const limitNumber = Math.max(1, parseInt(limit, 10));
    const skip = (pageNumber - 1) * limitNumber;

    const filter = {};
    if (category) {
      filter.category = category;
    }

    const sort = {};
    if (type === "popular") {
      sort.savesCount = -1;
    }
    sort._id = 1;

    const [stories, totalItems] = await Promise.all([
      Story.find(filter).sort(sort).skip(skip).limit(limitNumber),
      Story.countDocuments(filter),
    ]);

    const totalPages = Math.ceil(totalItems / limitNumber) || 0;

    res.status(200).json({
      status: "success",
      code: 200,
      data: {
        stories,
        meta: {
          totalItems,
          itemCount: stories.length,
          itemsPerPage: limitNumber,
          totalPages,
          currentPage: pageNumber,
        },
      },
    });
  } catch (error) {
    next(error);
  }
};
