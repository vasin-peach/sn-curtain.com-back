import express from "express";
import passport from "passport";
import CryptoJS from "crypto-js";
import keys from "../../../config/keys";
import msg from "../responseMsg";
import User from "../../../models/User";
import LocalStrategy from "passport-local";
import _ from "lodash";

///
// Variable
///
const router = express.Router();

///
// Init passport
///
passport.use(
  new LocalStrategy(function (email, password, done) {
    User.findOne({
        email: email.toLowerCase()
      },
      (err, user) => {
        // check user
        if (err) return done(err);
        if (!user) return done(null, false);
        // check password
        const decryptPass = CryptoJS.AES.decrypt(
          user.password,
          keys.ENCRYPTION_SECRET_64
        ).toString(CryptoJS.enc.Utf8);
        if (password != decryptPass) return done(null, false);

        // true
        return done(null, user);
      }
    );
  })
);

// Local Login
router.post("/login", passport.authenticate("local"), (req, res) => {
  res.status(200).json(msg.isSuccess("autenticate", null));
});

// Local Profile
router.get("/profile", (req, res) => {
  if (req.user) return res.status(200).json(msg.isSuccess(req.user, null));
  else return res.status(404).json(msg.isEmpty(null, null));
});

// Local Register
router.post("/register", (req, res) => {
  // check payload
  if (_.isEmpty(req.body)) return res.status(400).json(msg.badRequest());

  var payload = req.body;

  // encrpty password
  payload.password = CryptoJS.AES.encrypt(
    payload.password,
    keys.ENCRYPTION_SECRET_64
  ).toString();
  // init provider
  payload.provider = "local";

  // check user is already exist
  User.findOne({
      email: payload.email
    },
    (err, data) => {
      if (data) return res.status(409).json(msg.isExist(null, null));

      payload.email = payload.email.toLowerCase();

      // create user
      User.create(payload, (err, data) => {
        if (err) return res.status(400).json(msg.isfail(data, err));
        else {
          return res.status(201).json({
            status: 201,
            message: "user created!",
            err: err,
            data: data
          });
        }
      });
    }
  );
});

module.exports = router;