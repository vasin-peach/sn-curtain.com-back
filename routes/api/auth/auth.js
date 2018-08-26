import express from 'express';
import localRouter from './local';
import facebookRouter from './facebook';
import passport from 'passport';
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


router.use('/local', localRouter);
router.use('/facebook', facebookRouter);


module.exports = router;