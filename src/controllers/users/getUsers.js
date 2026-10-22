//src/controllers/users/getUsers.js
import createHttpError from "http-errors";
import { User } from "../../models/User.js";

export const getUsers = async (_req, res, next) => {
  try {
    const { page = 1, limit = 12 } = _req.query;
    const skip = (page - 1) * limit;
    if (!Number.isSafeInteger(skip)) {
      throw createHttpError(400, "Pagination is out of range");
    }
    const usersQuery = User.find({}).select([
      "name",
      "avatarUrl",
      "articlesAmount",
    ]);

    const [totalUsers, users] = await Promise.all([
      usersQuery.clone().countDocuments(),
      usersQuery.skip(skip).limit(limit),
    ]);

    const totalPages = Math.ceil(totalUsers / limit);
    res.status(200).json({
      page,
      limit,
      totalUsers,
      totalPages,
      users,
    });
  } catch (error) {
    next(error);
  }
};
