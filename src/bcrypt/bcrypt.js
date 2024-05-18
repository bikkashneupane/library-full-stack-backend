import bcrypt from "bcrypt";

export const hashPassword = (plainPassword) => {
  return bcrypt.hashSync(plainPassword, +process.env.SALT);
};

export const comparePassword = (plainPass, hashPass) => {
  return bcrypt.compareSync(plainPass, hashPass);
};
