import createHttpError from "http-errors";
import { Session } from "../../models/session.js";
import { createSession } from "../../services/index.js";
import { setSessionCookies, clearSessionCookies } from "../../utils/index.js";

export const refreshUserSession = async (req, res) => {
  const { sessionId, refreshToken } = req.cookies ?? {};

  if (!sessionId || !refreshToken) {
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

  await Session.deleteOne({ _id: session._id });

  const newSession = await createSession(session.userId);

  setSessionCookies(res, newSession);

  return res.status(200).json({
    message: "Session refreshed",
  });
};
