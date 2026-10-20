import { Session } from "../../models/session.js";
import { clearSessionCookies } from "../../utils/session.js";

export const logout = async (req, res, next) => {
  try {
    await Session.deleteOne({
      _id: req.cookies.sessionId,
      userId: req.user._id,
      accessToken: req.cookies.accessToken,
    });

    clearSessionCookies(res);

    return res.status(204).end();
  } catch (error) {
    next(error);
  }
};