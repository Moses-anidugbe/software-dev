function validateId(req, res, next) {
  const id = Number(req.params.id);

  if (Number.isNaN(id)) {
    return res.status(400).json({
      message: "ID must be a number.",
    });
  }

  req.params.id = id;

  next();
}

module.exports = validateId;
