import express from 'express';
import passport from 'passport';
import User from '../../models/User';
import keys from '../../config/keys';
const FacebookStrategy = require('passport-facebook').Strategy;
const GoogleStrategy = require('passport-google').Strategy;
const router = express.Router();


passport.serializeUser((user, done) => { // store data in session
  done(null, user);
})
passport.deserializeUser(function (obj, done) { // get data from session
  done(null, obj)
})

// Init facebook strategy
passport.use(new FacebookStrategy({
  clientID: keys.FACEBOOK_CLIENT,
  clientSecret: keys.FACEBOOK_SECRET,
  callbackURL: keys.FACEBOOK_CALLBACK
}, (accessToken, refreshToken, profile, done) => {
  console.log(profile);
  done(null, profile);
}))

// Init google strategy
passport.use(new GoogleStrategy({
  clientID: keys.GOOGLE_CLIENT,
  clientSecret: keys.GOOGLE_SECRET,
  callbackURL: keys.GOOGLE_CALLBACK
}, (accessToken, refreshToken, profile, done) => {
  console.log(profile);
  done(null, profile);
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

router.get('/google', passport.authenticate('google'))
router.get('/google/callback', passport.authenticate('facebook', {
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