export const validateCreateQuestion = (req, res, next) => {
  if (!req.body.title || !req.body.description || !req.body.category) {
    return res.status(400).json({
      "Bad Request": "Missing or invalid request data",
    });
  }
  next();
};

export const validateEditQuestion = (req, res, next) => {
  if (
    !req.body.title ||
    !req.body.description ||
    !req.body.category ||
    !req.params.id
  ) {
    return res.status(400).json({
      "Bad Request": "Missing or invalid request data",
    });
  }
  next();
};
