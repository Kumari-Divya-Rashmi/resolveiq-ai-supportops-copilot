import { loginUser, registerUser } from "../services/authService.js";
import { sendSuccess, sendCreated } from "../utils/apiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const register = asyncHandler(async (req, res) => {
  const result = await registerUser(req.body);
  return sendCreated(res, result, "Account created");
});

export const login = asyncHandler(async (req, res) => {
  const result = await loginUser(req.body);
  return sendSuccess(res, result, "Signed in");
});

export const me = asyncHandler(async (req, res) => {
  return sendSuccess(res, { user: req.user.toSafeObject() }, "Current user");
});
