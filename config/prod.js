// Production config
module.exports = {
  MONGO_URI: process.env.MONGO_URI,
  MONGO_USER: process.env.MONGO_USER,
  MONGO_PASS: process.env.MONGO_PASS,
  MONGO_DB: 'sn-curtain',
  SESSION_SECRET: process.env.SESSION_SECRET,
  FACEBOOK_SECRET: process.env.FACEBOOK_SECRET_ID,
  FACEBOOK_CLIENT: process.env.FACEBOOK_CLIENT_ID,
  FACEBOOK_CALLBACK: process.env.FACEBOOK_CALLBACK_PROD
};