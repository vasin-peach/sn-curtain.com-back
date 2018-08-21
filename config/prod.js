// Production config
module.exports = {
  MONGO_URI: process.env.MONGO_URI,
  MONGO_USER: process.env.MONGO_USER,
  MONGO_PASS: process.env.MONGO_PASS,
  MONGO_DB: 'sn-curtain',
  SESSION_SECRET: process.env.SESSION_SECRET,
  FACEBOOK_SECRET: process.env.FACEBOOK_SECRET_ID,
  FACEBOOK_CLIENT: process.env.FACEBOOK_CLIENT_ID,
  FACEBOOK_CALLBACK: process.env.FACEBOOK_CALLBACK_PROD,
  GOOGLE_SECRET: process.env.GOOGLE_SECRET_ID,
  GOOGLE_CLIENT: process.env.GOOGLE_CLIENT_ID,
  GOOGLE_CALLBACK: process.env.GOOGLE_CALLBACK_PROD,
  FRONTEND_URI: process.env.FRONTEND_URI,
  COOKIE_SECRET: process.env.COOKIE_SECRET,
  ENCRYPTION_SECRET_32: process.env.ENCRYPTION_SECRET_32,
  ENCRYPTION_SECRET_64: process.env.ENCRYPTION_SECRET_64,
};