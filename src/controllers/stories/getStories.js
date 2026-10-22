import { Story } from "../../models/index.js";
import mongoose from "mongoose";
import createHttpError from "http-errors";

export const getStories = async (req, res, next) => {
  try {
    const { page = 1, limit = 10, category, type } = req.query;

    const pageNumber = Number(page);
    const limitNumber = Number(limit);

    if (
      isNaN(pageNumber) ||
      !Number.isInteger(pageNumber) ||
      pageNumber < 1 ||
      isNaN(limitNumber) ||
      !Number.isInteger(limitNumber) ||
      limitNumber < 1 ||
      limitNumber > 100
    ) {
      return res.status(400).json({
        status: "error",
        code: 400,
        message: "Bad Request: Invalid page or limit parameters.",
      });
    }

    const skip = (pageNumber - 1) * limitNumber;

    if (!Number.isSafeInteger(skip)) {
      throw createHttpError(400, "Pagination is out of range");
    }

    const filter = {};
    if (category) {
      if (!mongoose.isValidObjectId(category)) {
        throw createHttpError(400, "Invalid category ID");
      }

      filter.category = new mongoose.Types.ObjectId(category);
    }

    const sort = {};
    if (type === "popular") {
      sort.rate = -1;
    }
    sort._id = 1;

    const [stories, totalItems] = await Promise.all([
      Story.find(filter)
        .populate("ownerId", "name")
        .sort(sort)
        .skip(skip)
        .limit(limitNumber),
      Story.countDocuments(filter),
    ]);

    const totalPages = Math.ceil(totalItems / limitNumber) || 0;

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
