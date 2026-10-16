export const loginUser = async (req, res) => {
  const { email, password } = req.body;
  const findUser = await User.findOne({ email });
  if (!findUser) {
    throw createHttpError(401, "Invalid credentials");
  }
  const isPasswordCorrect = await bcrypt.compare(password, findUser.password);
  if (!isPasswordCorrect) {
    throw createHttpError(401, "Invalid credentials");
  }
  await Session.deleteOne({
    userId: findUser._id,
  });
  const session = await createSession(findUser._id);
  setSessionCookies(res, session);
  res.status(200).json(findUser);
};
