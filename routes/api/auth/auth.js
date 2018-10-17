import express from 'express';
import passport from 'passport';
import keys from '../../../config/keys';
import _ from 'lodash';
import msg from '../responseMsg';

///
// Model
///
import User from '../../../models/User';

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
// Logout
router.get("/logout", (req, res) => {
  req.logout();
  res.redirect(req.cookies.redirect ? keys.FRONTEND_URI + req.cookies.redirect : keys.FRONTEND_URI + '/login');
})
// Get User Profile
router.get("/profile", (req, res) => {
  if (req.user) return res.status(200).json(msg.isSuccess(req.user, null));
  else return res.status(404).json(msg.isEmpty(null, null));
});
// Update User Profile
router.post('/profile/update', (req, res) => {
  const payload = req.body
  if (_.isEmpty(payload) || !req.user) return res.status(400).json(msg.badRequest(null, null))

  // check request is coming by own data
  if (req.user.permission.value < 3) {
    if ((req.user.email != payload.email || req.user.provider != payload.provider)) return res.status(400).json(msg.badRequest('User does not match.', null))
  }

  User.findOneAndUpdate({
    $and: [{
        "email": payload.email
      },
      {
        "provider": payload.provider
      }
    ]
  }, {
    $set: payload.data
  }, (err, data) => {
    if (err) return res.status(400).json(msg.isfail(data, err))
    else {
      User.find({
        email: payload.email,
        provider: payload.provider
      }, (err, data) => {
        if (err) return res.status(400).json(msg.isfail(data, err))
        req.session.passport.user = data[0];
        return res.status(200).json({
          status: 201,
          message: 'Updated!',
          err: err,
          data: data,
        })
      })

    }
  })
})

// Update User Address
router.post('/profile/address/update', (req, res) => {

  // declear payload, user
  const payload = {
    address: req.body
  };
  const user_id = req.session.passport.user._id;

  // check payload is not empty & user must found in session
  if (_.isEmpty(payload)) return res.status(400).json(msg.badRequest(null, 'payload empty.'));
  if (!user_id) return res.status(400).json(msg.badRequest(null, 'user is empty.'));

  // update user address
  User.findOneAndUpdate({
    _id: user_id
  }, payload, {
    upsert: true
  }, (err, data) => {
    if (err) return res.status(400).json(msg.isfail(data, err));
    console.log(data);
  })
})


router.use('/local', localRouter);
router.use('/facebook', facebookRouter);
router.use('/google', googleRouter);


module.exports = router;