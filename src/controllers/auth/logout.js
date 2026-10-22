import mongoose from "mongoose";
import createHttpError from "http-errors";
import { Session } from "../../models/session.js";
import { clearSessionCookies } from "../../utils/session.js";

export const logout = async (req, res, next) => {
  try {
    const { sessionId, refreshToken } = req.cookies ?? {};

    if (
      !sessionId ||
      !refreshToken ||
      !mongoose.isValidObjectId(sessionId)
    ) {
      throw createHttpError(401, "Invalid session");
    }

    const result = await Session.deleteOne({
      _id: sessionId,
      refreshToken,
    });

    if (result.deletedCount === 0) {
      throw createHttpError(401, "Session not found");
    }

    clearSessionCookies(res);

    return res.status(204).end();
  } catch (error) {
    return next(error);
  }
};