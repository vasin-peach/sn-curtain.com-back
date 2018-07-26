import express from 'express';
import passport from 'passport';
import User from '../../models/User';
import keys from '../../config/keys';
const FacebookStrategy = require('passport-facebook').Strategy;
const router = express.Router();

passport.use(new FacebookStrategy({
  clientID: keys.FACEBOOK_CLIENT,
  clientSecret: keys.FACEBOOK_SECRET,
  callbackURL: keys.FACEBOOK_CALLBACK
}, (accessToken, refreshToken, profile, done) => {
  console.log(profile);
  done(null, profile)
}))



/*
  ROUTES
*/

router.get('/', (req, res) => res.send('auth api.'))
router.get('/facebook', passport.authenticate('facebook'))
router.get('/facebook/callback', passport.authenticate('facebook', {
  successRedirect: '/auth/profile',
  failureRedirect: '/auth/error'
}))

router.get('/profile', (req, res) => {
  console.log(req.user)
  res.json(req.user)
})

router.get('/error', (req, res) => {
  console.log(req.user)
  res.send('error naja');
})

module.exports = router;