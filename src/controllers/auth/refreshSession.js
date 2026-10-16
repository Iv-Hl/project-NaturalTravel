export const refreshUserSession = async (req, res) => {
  const { sessionId, refreshToken } = req.cookies;
  const session = await Session.findOne({
    _id: sessionId,
    refreshToken,
  });
  if (!session) {
    throw createHttpError(401, "Session not found");
  }
  if (session.refreshTokenValidUntil < new Date()) {
    await Session.deleteOne({ _id: session._id });

    res.clearCookie("sessionId");
    res.clearCookie("accessToken");
    res.clearCookie("refreshToken");

    throw createHttpError(401, "Session token expired");
  }
  await Session.deleteOne({
    _id: session._id,
  });
  const newSession = await createSession(session.userId);
  setSessionCookies(res, newSession);
  res.status(200).json({
    message: "Session refreshed",
  });
};
