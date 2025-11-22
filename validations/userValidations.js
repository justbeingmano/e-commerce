import Joi from 'joi';

const validationR = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string()
    .min(6)
    .pattern(/[A-Z]/)
    .required(),
  name: Joi.string().required(),
  phonenumber: Joi.string()
    .min(10)
    .max(11)
    .required()
});

const validationLogin = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string()
    .min(6)
    .pattern(/[A-Z]/)
    .required()
});

export { validationLogin, validationR };
