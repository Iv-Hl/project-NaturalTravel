import crypto from "node:crypto";
import mongoose from "mongoose";
import createHttpError from "http-errors";
import { Session } from "../../models/session.js";
import { FIFTEEN_MINUTES, ONE_DAY } from "../../constants/index.js";
import { setSessionCookies, clearSessionCookies } from "../../utils/index.js";

export const refreshUserSession = async (req, res) => {
  const { sessionId, refreshToken } = req.cookies ?? {};

  if (!sessionId || !refreshToken || !mongoose.isValidObjectId(sessionId)) {
    clearSessionCookies(res);
    throw createHttpError(401, "Session not found");
  }

  const session = await Session.findOne({
    _id: sessionId,
    refreshToken,
  });

  if (!session) {
    throw createHttpError(401, "Session not found");
  }

  if (session.refreshTokenValidUntil <= new Date()) {
    await Session.deleteOne({ _id: session._id });
    clearSessionCookies(res);

    throw createHttpError(401, "Session token expired");
  }

  const now = Date.now();
  const newSession = await Session.findOneAndUpdate(
    {
      _id: session._id,
      refreshToken,
      refreshTokenValidUntil: { $gt: new Date(now) },
    },
    {
      $set: {
        accessToken: crypto.randomBytes(32).toString("hex"),
        refreshToken: crypto.randomBytes(32).toString("hex"),
        accessTokenValidUntil: new Date(now + FIFTEEN_MINUTES),
        refreshTokenValidUntil: new Date(now + ONE_DAY),
      },
    },
    { new: true, runValidators: true },
  );

  if (!newSession) {
    throw createHttpError(401, "Session not found");
  }

  setSessionCookies(res, newSession);

  return res.status(200).json({
    message: "Session refreshed",
  });
};
