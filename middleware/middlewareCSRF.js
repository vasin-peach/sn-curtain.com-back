module.exports = (err, req, res, next) => {
  if (err.code !== 'EBADCSRFTOKEN') return next(err);

  // handle CSRF token errors here
  res.status(403).json({
    status: 403,
    message: 'Forbidden',
    error: 'Invalid CSRF',
    data: null
  });
}