const _ = require('lodash');
const express = require("express");
const router = express.Router();
const msg = require('../responseMsg');
const CryptoJS = require('crypto-js');
const keys = require('../../../config/keys');
const moment = require('moment');

// Import Model
const Discount = require('../../../models/Discount');
import {
  authPermission
} from '../auth/auth.func';

///--
// ROUTES
///--

// find discount code
router.get("/id/:code", (req, res) => {

  var code = req.params.code;
  var discountList = [];
  Discount.find({}, (err, data) => {

    // create list of discount
    data.map((data) => {
      discountList.push({
        code: CryptoJS.AES.decrypt(data.code, keys.ENCRYPTION_SECRET_64).toString(CryptoJS.enc.Utf8),
        discount: data.discount,
        expired: data.expired,
        infinity: data.infinity,
        quantity: data.quantity,
        owner: data.owner
      });
    });

    // check code is exist
    var checkUser = req.session.passport.user.email
    var exist = discountList.filter((data) => {
      let checkExpired = moment().isBetween(data.expired.expiredStart, data.expired.expiredEnd);
      return (data.code == code) && (!data.expired.expired || checkExpired) && (data.infinity || data.quantity > 0) && (data.owner ? checkUser == data.owner : true);
    });

    // response
    if (_.isEmpty(exist)) return res.status(404).json(msg.isEmpty(null, null));
    else {
      return res.json(msg.isSuccess({
        code: code,
        discount: exist[0].discount
      }, null));
    }
  });
});


// get all
router.get("/all", async (req, res) => { // *** only admin

  // ! Validate
  const authPermissionLevel = await authPermission(req).then((result) => result, (err) => [true, err]);
  if (authPermissionLevel[0]) return res.status(400).json(msg.badRequest(null, authPermissionLevel[1]))
  if (authPermissionLevel <= 2) return res.status(401).json(msg.unAccess('invalid access level'));

  Discount.find({}, (err, data) => {
    return err ? res.status(400).json(msg.isfail(data, err)) : res.status(200).json(msg.isSuccess(data, err))
  });
});

// create
router.post("/create", async (req, res) => { // *** don't forgot to add middleware admin when production

  // ! Validate
  const authPermissionLevel = await authPermission(req).then((result) => result, (err) => [true, err]);
  if (authPermissionLevel[0]) return res.status(400).json(msg.badRequest(null, authPermissionLevel[1]))
  if (authPermissionLevel <= 2) return res.status(401).json(msg.unAccess('invalid access level'));


  // check payload is not empty
  if (_.isEmpty(req.body.payload)) return res.status(400).json(msg.badRequest('bad param, payload is empty.'));
  if (!req.body.payload.code) return res.status(400).json(msg.badRequest('bad param, payload code is empty.'));

  var payload = req.body.payload

  // encrpty code
  payload.code = CryptoJS.AES.encrypt(payload.code, keys.ENCRYPTION_SECRET_64).toString()

  // create discount
  Discount.create(payload, (err, data) => {
    if (err) return res.status(400).json(msg.isfail(data, err))
    else {
      return res.status(201).json({
        status: 201,
        message: 'discount created!',
        err: err,
        data: data
      })
    }
  })
})




///--
// EXPORTS
///--
module.exports = router;