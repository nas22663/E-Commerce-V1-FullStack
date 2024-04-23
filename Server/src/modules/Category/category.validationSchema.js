import Joi from "joi";

// we can remove enum from here and db model to add more categories
export const createCategorySchema = {
  body: Joi.object({
    name: Joi.string().valid("men", "women").required(),
  }),
};
