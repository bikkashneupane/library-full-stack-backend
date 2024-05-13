import bcrypt from "bcrypt";

export const hashPassword = (plainPassword) => {
  console.log(process.env.SALT);
  return bcrypt.hashSync(plainPassword, 5);
};

export const comparePassword = (plainPass, hashPass) => {
  return bcrypt.compareSync(plainPass, hashPass);
};
