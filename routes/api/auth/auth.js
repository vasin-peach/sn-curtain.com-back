import express from 'express';
import localRouter from './local';
import facebookRouter from './facebook';
import passport from 'passport';
import keys from '../../../config/keys';
import msg from '../responseMsg';

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
  return res.json(msg.isSuccess(null, 'Auth api.'));
})
router.post("/", (req, res) => {
  return res.json(msg.isSuccess(null, 'Auth api.'));
})
// Facebook Logout
router.get("/logout", (req, res) => {
  req.logout();
  res.redirect(keys.FRONTEND_URI + '/login');
})


router.use('/local', localRouter);
router.use('/facebook', facebookRouter);


module.exports = router;