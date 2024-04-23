import Joi from "joi";
import { generalRules } from "../../utils/general.validation.rules.js";

export const signUpSchema = {
  body: Joi.object({
    name: Joi.string().required(),
    email: Joi.string().required(),
    password: Joi.string()
      .pattern(new RegExp("^(?=.*[A-Z])(?=.*\\d)[A-Za-z\\d]{7,20}$"))
      .message(
        "Password must be between 7-20 characters, include at least one uppercase letter, and one number."
      )
      .required(),
    phoneNumbers: Joi.array().required(),
    addresses: Joi.array().required(),
  }),
};
