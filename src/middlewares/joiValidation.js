import Joi from "joi";

const STR = Joi.string();
const STR_REQUIRED = Joi.string().required();
const STR_ALLOW = Joi.string().allow("", null);

const NUMBER = Joi.string();
const NUMBER_REQUIRED = Joi.number().required();

const EMAIL = STR.email({
  minDomainSegments: 2,
});

const JoiValidator = (req, res, next, schema) => {
  try {
    const { error } = schema.validate(req.body);
    error
      ? res.json({
          status: "error",
          message: error.message,
        })
      : next();
  } catch (error) {
    next(error);
  }
};

export const newUserValidation = (req, res, next) => {
  const schema = Joi.object({
    firstName: STR_REQUIRED,
    lastName: STR_REQUIRED,
    phone: STR_ALLOW,
    email: EMAIL,
    password: STR_REQUIRED,
  });

  return JoiValidator(req, res, next, schema);
};

export const newBookValidation = (req, res, next) => {
  const schema = Joi.object({
    title: STR_REQUIRED,
    author: STR_REQUIRED,
    isbn: STR_REQUIRED,
    thumbnail: STR_REQUIRED,
    publishedYear: NUMBER_REQUIRED,
    description: STR_REQUIRED,
  });

  return JoiValidator(req, res, next, schema);
};

export const editBookValidation = (req, res, next) => {
  const schema = Joi.object({
    title: STR_REQUIRED,
    author: STR_REQUIRED,
    isbn: STR_REQUIRED,
    thumbnail: STR_REQUIRED,
    publishedYear: NUMBER_REQUIRED,
    description: STR_REQUIRED,
  });

  return JoiValidator(req, res, next, schema);
};
