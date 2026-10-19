import { User } from "../../models/User.js";

export const getCurrentUser = async (req, res, next) => {
  try {
    
    const userId = req.user?._id || req.user?.id;

    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const user = await User.findById(userId).select("-password -sessionSecret");

    if (!user) {
      return res.status(404).json({ message: "Такий користувач відсутній" });
    }

    return res.status(200).json(user);
  } catch (error) {
    return next(error);
  }
};