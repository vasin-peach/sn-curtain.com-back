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
const GoogleStrategy = require('passport-google-oauth20').Strategy;

///
// Init passport
///
passport.use(new GoogleStrategy({
    clientID: keys.GOOGLE_CLIENT,
    clientSecret: keys.GOOGLE_SECRET,
    callbackURL: keys.GOOGLE_CALLBACK
  },
  function (accessToken, refreshToken, profile, done) {
    User.findOne({
      $and: [{
          email: profile.emails[0].value,
        },
        {
          provider: 'google'
        }
      ]
    }, (err, user) => {
      if (err) return done(err) // error
      if (!user) { // create user
        var payload = {
          uid: profile.id,
          name: profile._json.displayName,
          email: profile.emails[0].value,
          provider: 'google',
          permission: {
            name: 'customer',
            value: 1
          },
          photo: profile._json.image.url,
          gender: profile._json.gender
        }
        User.create(payload, (err, user) => {
          if (err) return done(err) // error
          return done(null, user);
        })
      } else return done(err, user); // return user profile
    })
  }
));


// Facebook Login
router.get("/login", passport.authenticate('google', {
  scope: ['email', 'profile']
}), (req, res) => {
  res.status(200).json(msg.isSuccess('autenticate', null));
})

// Facebook callback
router.get('/callback', passport.authenticate('google'), (req, res) => {
  res.redirect(keys.FRONTEND_URI + '/profile');
});

module.exports = router;