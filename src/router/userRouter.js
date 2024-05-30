import { addNewUser, getUserByEmail } from "../db/model/user/UserModel.js";
import { auth, jwtAuth } from "../middlewares/auth.js";
import { comparePassword, hashPassword } from "../util/bcrypt.js";
import { signAccessJWT, signRefreshJWT } from "../util/jwt.js";

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

// ========================public controllers======================================
//login user
router.post("/login", async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email.includes("@") || !password) {
      throw new Error("Invalid login details");
    }

    //find user by email
    const user = await getUserByEmail(email);

    if (user?._id) {
      //verify password
      const isPassMatched = comparePassword(password, user.password);

      if (isPassMatched) {
        return res.json({
          status: "success",
          message: "User Authenticated",
          tokens: {
            accessJWT: signAccessJWT({ email }),
            refreshJWT: signRefreshJWT({ email }),
          },
        });
      }
    }
    res.json({
      status: "error",
      message: "Invalid Login Details",
    });
  } catch (error) {
    next(error);
  }
});

// ========================private controllers======================================
// return user profile
router.get("/", auth, (req, res, next) => {
  try {
    req.userInfo.refreshJWT = undefined;
    // req.userInfo.__v = undefined;
    res.json({
      status: "success",
      message: "User Profile",
      user: req.userInfo,
    });
  } catch (error) {
    next(error);
  }
});

// return new accessJWT
router.get("/renew-accessjwt", jwtAuth, (req, res, next) => {
  try {
    const { email } = req.userInfo;
    const accessJWT = signAccessJWT({ email });
    res.json({ accessJWT });
  } catch (error) {
    next(error);
  }
});

export default router;
