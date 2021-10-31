import { userService } from "../domain/useCases";
import { authService } from "../authenticate";

import { omit } from "../utils";

const login = async (
  req: { body: { email: string; password: string; userId?: string } },
  res: any,
  next: (arg0?: undefined) => void
) => {
  try {
    const { email, password } = req.body;
    const userData = omit(await userService.login(email, password), "password");
    const tokens = await authService.login(email, userData.id);
    return res
      .status(200)
      .cookie("refreshToken", tokens.refreshToken, {
        maxAge: 30 * 24 * 60 * 60 * 1000,
        httpOnly: true,
      })
      .json({
        message: "success",
        user: userData,
        accessToken: tokens.accessToken,
      });
  } catch (err) {
    next(err);
  }
};

const register = async (
  req: { body: { email: any; password: any } },
  res: any,
  next: any
) => {
  try {
    const { email, password } = req.body;
    const { id } = await userService.signin(email, password);
    const { refreshToken, accessToken } = await authService.signin(email, id);
    return res
      .status(200)
      .cookie("refreshToken", refreshToken, {
        maxAge: 30 * 24 * 60 * 60 * 1000,
        httpOnly: true,
      })
      .json({
        message: "success",
        user: userData,
        accessToken: tokens.accessToken,
      });
  } catch (err) {}
};

export default {
  login,
  register,
};
