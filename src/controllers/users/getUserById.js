import mongoose from "mongoose";
import { User } from "../../models/User.js";
import { Story } from "../../models/Story.js";

const NOT_FOUND_MESSAGE = "Такий користувач відсутній";

const parsePositiveInteger = (value, fallback) => {
  const number = Number.parseInt(value, 10);

  return Number.isInteger(number) && number > 0 ? number : fallback;
};

export const getUserById = async (req, res, next) => {
  try {
    const { userId } = req.params;

    if (!mongoose.isValidObjectId(userId)) {
      return res.status(404).json({
        message: NOT_FOUND_MESSAGE,
      });
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

    const page = parsePositiveInteger(req.query.page, 1);
    const perPage = Math.min(parsePositiveInteger(req.query.perPage, 6), 20);

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
        .skip((page - 1) * perPage)
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
