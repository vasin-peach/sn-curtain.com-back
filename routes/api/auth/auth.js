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
import {
  checkPermission
} from './auth.func';

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
  res.redirect(req.session.redirect ? `${keys.FRONTEND_URI}/${req.session.redirect}` : `${keys.FRONTEND_URI}/login`);
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
});

// Upload User Image Profile
router.get('/profile/image', (req, res) => {
  // Imports the Google Cloud client library
  const {
    Storage
  } = require('@google-cloud/storage');

  // Your Google Cloud Platform project ID
  const projectId = 'sn-curtain-1532605297836';

  // Creates a client
  const storage = new Storage({
    projectId: projectId,
  });

  // The name for the new bucket
  const bucketName = 'sn-curtain-test';

  // Creates the new bucket
  storage
    .createBucket(bucketName)
    .then(() => {
      console.log(`Bucket ${bucketName} created.`);
      return res.status(200).json('success');
    })
    .catch(err => {
      console.error('ERROR:', err);
      return res.status(400).json({
        err: err
      });
    });
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

  // update user address in database
  User.findOneAndUpdate({
    _id: user_id
  }, payload, {
    upsert: true
  }, (err, data) => {
    // check update is error
    if (err) return res.status(400).json(msg.isfail(data, err));

    // return update data
    return res.status(200).json(msg.isSuccess(data, null));
  });

  // update user address in session
  req.session.passport.user.address = req.body;
});


router.use('/local', localRouter);
router.use('/facebook', facebookRouter);
router.use('/google', googleRouter);


module.exports = router;