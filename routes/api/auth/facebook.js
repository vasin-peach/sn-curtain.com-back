import express from 'express';
import passport from 'passport';
import keys from '../../../config/keys';
import msg from '../responseMsg';
import User from '../../../models/User';
import _ from 'lodash';

///
// Variable
///
const router = express.Router();
const FacebookStrategy = require('passport-facebook').Strategy;

///
// Init passport
///
passport.use(new FacebookStrategy({
  clientID: keys.FACEBOOK_CLIENT,
  clientSecret: keys.FACEBOOK_SECRET,
  callbackURL: keys.FACEBOOK_CALLBACK,
  profileFields: ['id', 'birthday', 'displayName', 'picture.type(large)', 'email'],
  passReqToCallback: true
}, (req, token, refreshToken, profile, done) => {
  User.findOne({
    $and: [{
        email: profile.emails[0].value,
      },
      {
        provider: 'facebook'
      }
    ]
  }, (err, user) => {
    if (err) return done(err) // error
    if (!user) { // create user
      var payload = {
        uid: profile.id,
        name: profile.displayName,
        email: profile.emails[0].value,
        provider: 'facebook'
      }
      User.create(payload, (err, user) => {
        if (err) return done(err) // error
        return done(null, profile);
      })
    } else return done(err, user); // return user profile
  })
}))



// Facebook Login
router.get("/login", passport.authenticate('facebook', {
  scope: ['public_profile', 'user_birthday', 'email']
}), (req, res) => {
  res.status(200).json(msg.isSuccess('autenticate', null));
})

// Facebook callback
router.get('/callback', passport.authenticate('facebook'), (req, res) => {
  res.redirect(keys.FRONTEND_URI + '/login');
});

module.exports = router;