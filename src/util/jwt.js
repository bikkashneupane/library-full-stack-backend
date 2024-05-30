import JWT from "jsonwebtoken";
import { insertToken } from "../db/model/session/SessionSchema.js";
import { updateUser } from "../db/model/user/UserModel.js";

// 1. create access jwt
export const signAccessJWT = (payload) => {
  //   return JWT.sign(payload, process.env.ACCESSS_JWT_SECRET);
  const token = JWT.sign(payload, process.env.ACCESSS_JWT_SECRET, {
    expiresIn: "1m",
  });

  insertToken({ token });
  return token;
};

// 2. verify access jwt
export const verifyAccessJWT = (token) => {
  try {
    return JWT.verify(token, process.env.ACCESSS_JWT_SECRET); //returns object
  } catch (error) {
    console.log(error, " verigydfghjkl", error.message);
    return error.message === "jwt expired" ? "jwt expired" : "Invalid Token";
  }
};

//================================================================================

// 1.  create refresh jwt
// email is destructured from payload
export const signRefreshJWT = ({ email }) => {
  // return JWT.sign(payload, process.env.REFRESH);
  const refreshJWT = JWT.sign({ email }, process.env.REFRESH_JWT_SECRET, {
    expiresIn: "30d",
  });
  updateUser({ email }, { refreshJWT });
  return refreshJWT;
};

// 2. verify refresh jwt
export const verifyRefreshJWT = (token) => {
  try {
    return JWT.verify(token, process.env.REFRESH_JWT_SECRET);
  } catch (error) {
    return "Invalid Token";
  }
};
