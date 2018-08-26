import express from 'express';
import passport from 'passport';
import keys from '../../../config/keys';
import msg from '../responseMsg';

///
// Router
///
import localRouter from './local';
import facebookRouter from './facebook';
import googleRouter from './google';

///
// Variable
///
const router = express.Router();
passport.serializeUser(function (user, done) {
  done(null, user)
})
passport.deserializeUser(function (user, done) {
  done(null, user);
});



///
// Route
///

// Default
router.get("/", (req, res) => {
  return res.json(msg.isSuccess('auth api', null));
})
router.post("/", (req, res) => {
  return res.json(msg.isSuccess('auth api', null));
})
// Profile
router.get("/profile", (req, res) => {
  if (req.user) return res.status(200).json(msg.isSuccess(req.user, null));
  else return res.status(404).json(msg.isEmpty(null, null));
});
// Logout
router.get("/logout", (req, res) => {
  req.logout();
  res.redirect(keys.FRONTEND_URI + '/login');
})


router.use('/local', localRouter);
router.use('/facebook', facebookRouter);
router.use('/google', googleRouter);


module.exports = router;