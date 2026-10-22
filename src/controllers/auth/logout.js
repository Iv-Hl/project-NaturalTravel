import mongoose from "mongoose";
import { Session } from "../../models/session.js";
import { clearSessionCookies } from "../../utils/session.js";

export const logout = async (req, res, next) => {
  try {
    const { sessionId, refreshToken } = req.cookies ?? {};

    if (sessionId && refreshToken && mongoose.isValidObjectId(sessionId)) {
      await Session.deleteOne({
        _id: sessionId,
        refreshToken,
      });
    }

    clearSessionCookies(res);

    return res.status(204).end();
  } catch (error) {
    return next(error);
  }
};
