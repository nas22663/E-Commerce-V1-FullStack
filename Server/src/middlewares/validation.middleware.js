const reqKeys = ["body", "params", "query", "headers"];

export const validationMiddleware = (schema) => {
  return (req, res, next) => {
    let validationErrorsArray = [];

    // Validate only the parts of the request specified in the schema
    for (const key of reqKeys) {
      if (schema[key]) {
        const validationResult = schema[key].validate(req[key], {
          abortEarly: false,
        });
        if (validationResult.error) {
          validationErrorsArray.push(...validationResult.error.details);
        }
      }
    }

    // If there are validation errors, return them in the response
    if (validationErrorsArray.length > 0) {
      return res.status(400).json({
        err_msg: "Validation errors in your request",
        errors: validationErrorsArray.map((ele) => ele.message),
      });
    }

    next(); // proceed to next middleware if validation is successful
  };
};
