// Production config
module.exports = {
  MONGO_URI: process.env.MONGO_URI,
  MONGO_USER: process.env.MONGO_USER,
  MONGO_PASS: process.env.MONGO_PASS,
  MONGO_DB: 'sn-curtain',
  SESSION_SECRET: process.env.SESSION_SECRET,
  FACEBOOK_SECRET: process.env.FACEBOOK_SECRET,
  FACEBOOK_CLIENT: process.env.FACEBOOK_CLIENT,
  FACEBOOK_CALLBACK: process.env.FACEBOOK_CALLBACK,
  GOOGLE_SECRET: process.env.GOOGLE_SECRET,
  GOOGLE_CLIENT: process.env.GOOGLE_CLIENT,
  GOOGLE_CALLBACK: process.env.GOOGLE_CALLBACK,
  FRONTEND_URI: process.env.FRONTEND_URI,
  COOKIE_SECRET: process.env.COOKIE_SECRET,
  ENCRYPTION_SECRET_32: process.env.ENCRYPTION_SECRET_32,
  ENCRYPTION_SECRET_64: process.env.ENCRYPTION_SECRET_64,
  PORT: process.env.PORT || 3000,
}
