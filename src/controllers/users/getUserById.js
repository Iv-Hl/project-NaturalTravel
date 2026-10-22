import mongoose from "mongoose";
import { User } from "../../models/User.js";
import { Story } from "../../models/Story.js";
import createHttpError from "http-errors";
import { parsePositiveInteger } from "../../utils/pagination.js";

const NOT_FOUND_MESSAGE = "Такий користувач відсутній";

export const getUserById = async (req, res, next) => {
  try {
    const { userId } = req.params;

    if (!mongoose.isValidObjectId(userId)) {
      throw createHttpError(400, "Invalid user ID");
    }

    const userObjectId = new mongoose.Types.ObjectId(userId);

    const user = await User.collection.findOne(
      { _id: userObjectId },
      {
        projection: {
          _id: 1,
          name: 1,
          avatarUrl: 1,
          articlesAmount: 1,
        },
      },
    );

    if (!user) {
      return res.status(404).json({
        message: NOT_FOUND_MESSAGE,
      });
    }

    const page = parsePositiveInteger(req.query.page, {
      name: "page",
      defaultValue: 1,
    });
    const perPage = parsePositiveInteger(req.query.perPage, {
      name: "perPage",
      defaultValue: 6,
      max: 20,
    });

    const skip = (page - 1) * perPage;
    if (!Number.isSafeInteger(skip)) {
      throw createHttpError(400, "Pagination is out of range");
    }

    const filter = { ownerId: userObjectId };

    const [stories, totalItems] = await Promise.all([
      Story.collection
        .find(filter, {
          projection: {
            _id: 1,
            img: 1,
            title: 1,
            article: 1,
            category: 1,
            rate: 1,
            ownerId: 1,
            date: 1,
          },
        })
        .sort({ date: -1, _id: -1 })
        .skip(skip)
        .limit(perPage)
        .toArray(),

      Story.collection.countDocuments(filter),
    ]);

    const totalPages = Math.ceil(totalItems / perPage);

    return res.status(200).json({
      user,
      stories,
      pagination: {
        page,
        perPage,
        totalItems,
        totalPages,
        hasNextPage: page < totalPages,
      },
    });
  } catch (error) {
    return next(error);
  }
};
