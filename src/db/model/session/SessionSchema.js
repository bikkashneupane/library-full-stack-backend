import mongoose, { mongo } from "mongoose";

const sessionSchema = new mongoose.Schema(
  {
    token: {
      type: String,
      required: true,
    },
    associate: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

const SessionSchemaa = mongoose.model("Session", sessionSchema);

export const insertToken = (obj) => {
  return SessionSchemaa(obj).save();
};

export const findToken = (token) => {
  return SessionSchemaa.findOne({ token });
};
