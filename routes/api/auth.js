import express from 'express';
import passport from 'passport';
import User from '../../models/User';
import keys from '../../config/keys';

const FacebookStrategy = require('passport-facebook').Strategy;
const GoogleStrategy = require('passport-google-oauth').OAuthStrategy;
const router = express.Router();

passport.serializeUser(function (user, done) {
  done(null, user);
})
passport.deserializeUser(function (obj, done) {
  done(null, obj)
})


// Init facebook strategy
passport.use(new FacebookStrategy({
  clientID: keys.FACEBOOK_CLIENT,
  clientSecret: keys.FACEBOOK_SECRET,
  callbackURL: keys.FACEBOOK_CALLBACK,
  profileFields: ['id', 'emails', 'name', 'picture', 'short_name']
}, (accessToken, refreshToken, profile, done) => {
  done(null, profile);
}))


// // Init google strategy
// passport.use(new GoogleStrategy({
//   consumerKey: keys.GOOGLE_CLIENT,
//   consumerSecret: keys.GOOGLE_SECRET,
//   callbackURL: keys.GOOGLE_CALLBACK
// }, (accessToken, refreshToken, profile, done) => {
//   console.log(profile);
//   done(null, profile);
// }))


/*
  ROUTES
*/

router.get('/', (req, res) => res.send('auth api.'))
router.get('/facebook', passport.authenticate('facebook'))
router.get('/facebook/callback', passport.authenticate('facebook', {
  successRedirect: '/auth/profile',
  failureRedirect: '/auth/error'
}))

// router.get('/google', passport.authenticate('google'))
// router.get('/google/callback', passport.authenticate('google', {
//   successRedirect: '/auth/profile',
//   failureRedirect: '/auth/error'
// }))

router.get('/profile', (req, res) => {
  res.status(200).json({
    status: 200,
    message: 'Logged in',
    data: req.user,
    error: null
  })
})

router.get('/error', (req, res) => {
  res.status(401).json({
    status: 400,
    message: 'Unauthorized',
    data: null,
    error: req.body
  })
})

router.get('/logout', (req, res) => {
  req.logout();
  res.redirect('https://sn-curtain.com');
})

module.exports = router;