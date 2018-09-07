function admin_MW(req, res, next) {
  console.log('MiddleWare')
  next();
}

module.exports = {
  admin_MW
}