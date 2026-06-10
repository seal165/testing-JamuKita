/**
 * Generic validation middleware
 * Can validate body, query, and params
 */
export const validate = (schemas) => {
  return (req, res, next) => {
    const errors = [];

    // Validate body
    if (schemas.body) {
      const { error } = schemas.body.validate(req.body, { abortEarly: false });
      if (error) {
        errors.push(...error.details.map((e) => e.message));
      }
    }

    // Validate query
    if (schemas.query) {
      const { error, value } = schemas.query.validate(req.query, { abortEarly: false });
      if (error) {
        errors.push(...error.details.map((e) => e.message));
      } else {
        Object.assign(req.query, value);
      }
    }

    // Validate params
    if (schemas.params) {
      const { error } = schemas.params.validate(req.params, { abortEarly: false });
      if (error) {
        errors.push(...error.details.map((e) => e.message));
      }
    }

    if (errors.length > 0) {
      return res.status(400).json({
        success: false,
        message: "Validasi gagal",
        errors: errors,
      });
    }

    next();
  };
};

// Legacy exports for backward compatibility
export const validateBody = (schema) => validate({ body: schema });
export const validateQuery = (schema) => validate({ query: schema });
export const validateParams = (schema) => validate({ params: schema });
