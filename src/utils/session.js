const isProduction = process.env.NODE_ENV === "production";

const cookieOptions = {
  httpOnly: true,
  secure: isProduction,
  sameSite: "lax",
  path: "/",
};

export const setSessionCookies = (res, session) => {
  res.cookie("sessionId", session._id.toString(), {
    ...cookieOptions,
    maxAge: session.refreshTokenValidUntil.getTime() - Date.now(),
  });

  res.cookie("accessToken", session.accessToken, {
    ...cookieOptions,
    maxAge: session.accessTokenValidUntil.getTime() - Date.now(),
  });

  res.cookie("refreshToken", session.refreshToken, {
    ...cookieOptions,
    maxAge: session.refreshTokenValidUntil.getTime() - Date.now(),
  });
};

export const clearSessionCookies = (res) => {
  res.clearCookie("sessionId", cookieOptions);
  res.clearCookie("accessToken", cookieOptions);
  res.clearCookie("refreshToken", cookieOptions);
};
