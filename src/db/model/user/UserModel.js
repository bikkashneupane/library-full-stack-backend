import UserSchema from "./UserSchema.js";

//add new user
export const addNewUser = (userObj) => {
  return UserSchema(userObj).save();
};

//get user
export const getUserByEmail = (email) => {
  return UserSchema.findOne({ email });
};
