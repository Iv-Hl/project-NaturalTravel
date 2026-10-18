import { Story } from "../../models/index.js";

export const getStories = async (req, res, next) => {
  try {
    const { page = 1, limit = 10, category, type } = req.query;

    const pageNumber = parseInt(page, 10);
    const limitNumber = parseInt(limit, 10);

    if (
      isNaN(pageNumber) ||
      pageNumber < 1 ||
      isNaN(limitNumber) ||
      limitNumber < 1
    ) {
      return res.status(400).json({
        status: "error",
        code: 400,
        message: "Bad Request: Invalid page or limit parameters.",
      });
    }

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

    // Перевірка на випадок, коли запитують неіснуючу сторінку
    if (pageNumber > totalPages && totalItems > 0) {
      return res.status(400).json({
        status: "error",
        code: 400,
        message: "Bad Request: Page number exceeds total pages.",
      });
    }

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
