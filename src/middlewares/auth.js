import { decode } from "jsonwebtoken";
import { findToken } from "../db/model/session/SessionSchema.js";
import { getUserByEmail } from "../db/model/user/UserModel.js";
import { verifyAccessJWT } from "../util/jwt.js";

export const auth = async (req, res, next) => {
  console.log("Auth check: " + req.body);
  try {
    // 1. receive jwt via authorization header
    const { authorization } = req.headers;

    // 2. verify jwt is valid (not expired, secretkey) by decoding jwt
    const decoded = verifyAccessJWT(authorization);

    if (decoded?.email) {
      // 3. Check if the token exist in the DB, session table
      const tokenObj = await findToken(authorization);

      if (tokenObj?._id) {
        // 4. Extract email from the decoded jwt obj
        // 5. Get user by email
        const user = await getUserByEmail(decoded.email);

        if (user?._id) {
          // 6. If user exist, they are now authorised
          user.password = undefined;
          req.userInfo = user;

          return next();
        }
      }
    }

    const error = {
      status: 403,
      message: "Unauthorized",
    };

    next(error);
  } catch (error) {
    next(error);
  }
};
