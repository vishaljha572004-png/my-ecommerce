const AppError = require("../errors/AppError");

// Usage: router.post("/register", validate(schema), controller)
const validate = (schema) => (req, res, next) => {
  const { error } = schema.validate(req.body, {
    abortEarly: false,   // saari errors ek saath dikhao
    stripUnknown: true,  // extra fields remove karo
  });

  if (error) {
    const message = error.details.map((d) => d.message).join(", ");
    return next(new AppError(message, 400));
  }

  next();
};

module.exports = validate;
