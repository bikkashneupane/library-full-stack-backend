import { findToken } from "../db/model/session/SessionSchema.js";
import { getUserByEmail } from "../db/model/user/UserModel.js";
import { verifyAccessJWT } from "../util/jwt.js";

export const auth = async (req, res, next) => {
  try {
    // 1. receive jwt via authorization header
    const { authorization } = req.headers;

    // 2. verify jwt is valid (not expired, secretkey) by decoding jwt
    const decoded = verifyAccessJWT(authorization);

    // 3. Check if the token exist in the DB, session table
    if (decoded?.email) {
      // 4. If yes-> Extract email from the decoded jwt obj

      const tokenObj = await findToken(authorization);

      if (tokenObj?._id) {
        // 5. Get user by email
        const user = await getUserByEmail(decoded.email);

        // 6. If user exist, they are now authorised
        if (user?._id) {
          user.password = undefined;
          req.userInfo = user;

          return next();
        }
      }
    }

    console.log(decoded);
    const error = {
      status: 403,
      message: decoded,
    };
    next(error);
  } catch (error) {
    next(error);
  }
};

export const isAdmin = (req, res, next) => {
  console.log(req.userInfo, "checkingggggg");
  req.userInfo.role === "admin"
    ? next()
    : next({
        status: 403,
        message: "Unauthoroised user, Access Denied",
      });
};

export const jwtAuth = async (req, res, next) => {
  try {
    // 1. receive jwt via authorization header
    const { authorization } = req.headers;

    // 2. verify jwt is valid (not expired, secretkey) by decoding jwt
    const decoded = verifyAccessJWT(authorization);

    // 3. Check if the token exist in the DB, session table
    if (decoded?.email) {
      // 4.  Extract email from the decoded jwt obj

      // 5. get user by email
      const user = await getUserByEmail(decoded.email);

      // 6. If user exist, they are now authorized
      if (user?._id && user.refreshJWT === authorization) {
        user.password = undefined;
        req.userInfo = user;

        return next();
      }
    }

    const error = {
      status: 403,
      message: decoded,
    };
    next(error);
  } catch (error) {
    next(error);
  }
};

//How middleware works
/** if first middleware returns an object, it goes to global error handler
 * else goes to next middleware and so on
 */
