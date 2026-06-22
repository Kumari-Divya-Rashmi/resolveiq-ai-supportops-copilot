import { User } from "../models/User.js";
import { sendSuccess } from "../utils/apiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { AppError } from "../utils/AppError.js";

export const listUsers = asyncHandler(async (req, res) => {
  const query = {};

  if (req.query.role) {
    query.role = req.query.role;
  }

  if (req.query.q) {
    query.$or = [
      { name: { $regex: req.query.q, $options: "i" } },
      { email: { $regex: req.query.q, $options: "i" } }
    ];
  }

  const users = await User.find(query)
    .select("name email role team createdAt")
    .populate("team", "name")
    .sort({ createdAt: -1 });

  return sendSuccess(res, { users }, "Users fetched");
});

export const updateUserRole = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);

  if (!user) {
    throw new AppError("User not found", 404);
  }

  user.role = req.body.role;

  if (req.body.team !== undefined) {
    user.team = req.body.team || null;
  }

  await user.save();

  const updatedUser = await User.findById(user._id)
    .select("name email role team createdAt")
    .populate("team", "name");

  return sendSuccess(res, { user: updatedUser }, "User updated");
});