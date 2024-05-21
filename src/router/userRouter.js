import { addNewUser, getUserByEmail } from "../db/model/user/UserModel.js";
import { comparePassword, hashPassword } from "../util/bcrypt.js";
import { signAccessJWT, signRefreshJWT } from "../util/jwt.js";

import { auth } from "../middlewares/auth.js";
import express from "express";
import { newUserValidation } from "../middlewares/joiValidation.js";

const router = express.Router();

// ========================= public controllers=====================================
//create new user
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

//login user
router.post("/login", async (req, res, next) => {
  try {
    const { email, password } = req.body;
    console.log(email + "destructure");

    if (!email.includes("@") || !password) {
      throw new Error("Invalid login details");
    }

    //find user by email
    const user = await getUserByEmail(email);

    if (user?._id) {
      //verify password
      const isPassMatched = comparePassword(password, user.password);

      return isPassMatched
        ? res.json({
            status: "success",
            message: "User Authenticated",
            tokens: {
              accessJWT: signAccessJWT({ email }),
              refreshJWT: signRefreshJWT({ email }),
            },
          })
        : res.json({
            status: "error",
            message: "Invalid Login Detail",
          });
    }
    res.json({
      status: "error",
      message: "Email not found",
    });
  } catch (error) {
    next(error);
  }
});

// ========================private controllers======================================
router.get("/", auth, async (req, res, next) => {
  try {
    req.userInfo.refreshJWT = undefined;
    res.json({
      status: "success",
      message: "User authenticated",
      user: req.userInfo,
    });
  } catch (error) {
    next(error);
  }
});

export default router;
