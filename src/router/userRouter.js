import { addNewUser } from "../db/model/user/UserModel.js";
import express from "express";
import { hashPassword } from "../bcrypt/bcrypt.js";
import { newUserValidation } from "../middlewares/joiValidation.js";

const router = express.Router();

router.post("/signup", newUserValidation, async (req, res, next) => {
  try {
    req.body.password = hashPassword(req.body.password);
    const user = await addNewUser(req.body);
    user?._id
      ? res.json({
          status: "success",
          message: "New User Added",
        })
      : res.json({
          status: "error",
          message: "Could not resolve request, try again",
        });
  } catch (error) {
    if (error.message.includes("E11000 duplicate key")) {
      error.message =
        "Another user alreay have this email, change your email and try again";
      error.status = 200;
    }
    next(error);
  }
});

router.post("/login", (req, res, next) => {
  try {
  } catch (error) {
    next(error);
  }
});

export default router;
