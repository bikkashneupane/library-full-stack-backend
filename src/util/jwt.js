import JWT from "jsonwebtoken";
import { insertToken } from "../db/model/session/SessionSchema.js";
import { updateUser } from "../db/model/user/UserModel.js";

// create access jwt
export const signAccessJWT = (payload) => {
  //   return JWT.sign(payload, process.env.ACCESSS_JWT_SECRET);
  const token = JWT.sign(payload, process.env.ACCESSS_JWT_SECRET, {
    expiresIn: "15m",
  });
  insertToken({ token });

  return token;
};

// verify access jwt

// create refresh jwt
export const signRefreshJWT = (payload) => {
  //   return JWT.sign(payload, process.env.REFRESH);
  const refreshJWT = JWT.sign(payload, process.env.REFRESH_JWT_SECRET, {
    expiresIn: "30d",
  });
  updateUser(payload, { refreshJWT });
  return refreshJWT;
};

// verify refresh jwt
