import { authService } from "../services";

export const login = async (req, res, next) => {
  const { email, password } = req.body;
  try {
    const userData = await authService.login(email, password);
    return res
      .status(200)
      .cookie("refreshToken", userData.refreshToken, {
        maxAge: 30 * 24 * 60 * 60 * 1000,
        httpOnly: true,
      })
      .json({ message: "success", user: userData });
  } catch (err) {
    next(err);
  }
};
