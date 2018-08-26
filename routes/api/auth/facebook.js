import express from 'express';
import passport from 'passport';
import CryptoJS from 'crypto-js';
import keys from '../../../config/keys';
import msg from '../responseMsg';
import User from '../../../models/User';
import _ from 'lodash';
import {
  doesNotReject
} from 'assert';

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
    callbackURL: keys.FACEBOOK_CALLBACK
  },
  function (accessToken, refreshToken, profile, cb) {
    done(null, profile);
  }))



// Facebook Login
router.get("/login", passport.authenticate('facebook'), (req, res) => {
  res.status(200).json(msg.isSuccess('autenticate', null));
})

// Facebook callback
router.get("/callback", (req, res) => {
  passport.authenticate('facebook', {
    successRedirect: '/auth/facebook/profile',
    failureRedirect: '/'
  })
})

// Local Profile
router.get("/profile", (req, res) => {
  if (req.user) return res.status(200).json(msg.isSuccess(req.user, null));
  else return res.status(404).json(msg.isEmpty(null, null));
})

// Local Register
router.post('/register', (req, res) => {
  // check payload
  if (_.isEmpty(req.body)) return res.status(400).json(msg.badRequest());

  var payload = req.body

  // encrpty password
  payload.password = CryptoJS.AES.encrypt(payload.password, keys.ENCRYPTION_SECRET_64).toString()
  // init strategy
  payload.strategy = 'local';

  // check user is already exist
  User.findOne({
    email: payload.email
  }, (err, data) => {
    if (data) return res.status(409).json(msg.isExist(null, null))

    // create user
    User.create(payload, (err, data) => {
      if (err) return res.status(400).json(msg.isfail(data, err))
      else {
        return res.status(201).json({
          status: 201,
          message: 'user created!',
          err: err,
          data: data
        })
      }
    })
  })
})

module.exports = router;