//src/controllers/users/getUsers.js
import { User } from "../../models/User.js";

export const getUsers = async (_req, res, next) => {
  try {
    const { page = 1, limit = 12 } = _req.query;
    const skip = (page - 1) * limit;
    const usersQuery = User.find({});

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
