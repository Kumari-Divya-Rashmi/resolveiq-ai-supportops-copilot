import bcrypt from "bcryptjs";
import mongoose from "mongoose";

export const USER_ROLES = ["user", "agent", "admin"];

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      maxlength: 80
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true
    },
    role: {
      type: String,
      enum: USER_ROLES,
      default: "user"
    },
    passwordHash: {
      type: String,
      required: true,
      select: false
    },
    team: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Team",
      default: null
    }
  },
  {
    timestamps: true
  }
);

userSchema.methods.comparePassword = function comparePassword(password) {
  return bcrypt.compare(password, this.passwordHash);
};

userSchema.methods.toSafeObject = function toSafeObject() {
  return {
    id: this._id.toString(),
    name: this.name,
    email: this.email,
    role: this.role,
    team: this.team,
    createdAt: this.createdAt
  };
};

export const User = mongoose.model("User", userSchema);
