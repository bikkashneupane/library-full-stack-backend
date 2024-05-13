import { compareSync } from "bcrypt";
import express from "express";
import { hashPassword } from "../bcrypt/bcrypt.js";
import { addNewUser, getUserByEmail } from "../db/model/user/UserModel.js";

const userRouter = express.Router();

userRouter.post("/signup", async (req, res) => {
  try {
    const { password, ...rest } = req.body;
    const encrptedPass = hashPassword(password);

    const user = await addNewUser({ ...rest, password: encrptedPass });
    user?._id
      ? res.json({
          status: "success",
          message: "New User Added",
        })
      : res.json({
          status: "error",
          message: "Request Failed, try again",
        });
  } catch (error) {
    console.log(error);
    res.json({
      status: "error",
      message: error.messge,
    });
  }
});

userRouter.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await getUserByEmail(email);
    console.log(user);

    if (!user?._id && compareSync(password, user.password) === "false") {
      res.json({
        status: "error",
        message: "Request Failed, try again",
      });
    }

    user.password = undefined;
    res.json({
      status: "success",
      message: "New User Added",
      user,
    });
  } catch (error) {
    res.json({
      status: "error",
      message: error.messge,
    });
  }
});

export default userRouter;
