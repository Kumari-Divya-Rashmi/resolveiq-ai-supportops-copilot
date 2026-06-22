import { AppError } from "../utils/AppError.js";

export function requireRole(...roles) {
  return (req, _res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      throw new AppError("You do not have permission to access this resource", 403);
    }

    next();
  };
}
