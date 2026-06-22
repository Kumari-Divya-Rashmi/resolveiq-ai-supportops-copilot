import mongoose from "mongoose";

const teamSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      trim: true
    },
    categoriesHandled: [
      {
        type: String,
        required: true,
        trim: true
      }
    ],
    agents: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
      }
    ]
  },
  {
    timestamps: true
  }
);

export const Team = mongoose.model("Team", teamSchema);
