export const validateAnswer = (req, res, next) => {
  if (!req.body.content || req.body.content.length > 300 || !req.params.id) {
    return res.status(400).json({
      "Bad Request": "Missing or invalid request data.",
    });
  }
  next();
};
