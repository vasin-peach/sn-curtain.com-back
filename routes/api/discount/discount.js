const _ = require('lodash');
const express = require("express");
const router = express.Router();
const mongoose = require('mongoose');
const msg = require('../responseMsg');
const CryptoJS = require('crypto-js');
const keys = require('../../../config/keys');
const moment = require('moment');
const isEmpty = require('lodash.isempty');

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

  // get raw data
  let rawResult = await Discount.find({}).sort({
    updated_at: -1
  });

  // rawResult is empty return 400
  if (isEmpty(rawResult)) return res.status(400).json(msg.isfail(null, 'not found'));

  // decrpyt discount code
  rawResult.map((item, index) => {
    rawResult[index].code = CryptoJS.AES.decrypt(item.code, keys.ENCRYPTION_SECRET_64).toString(CryptoJS.enc.Utf8)
  });

  // success
  return res.status(200).json(msg.isSuccess(rawResult, null));
});

// ! DELETE
router.post("/delete", async (req, res) => {

  // * Validate
  const authPermissionLevel = await authPermission(req).then((result) => result, (err) => [true, err]);
  if (authPermissionLevel[0]) return res.status(400).json(msg.badRequest(null, authPermissionLevel[1]))
  if (authPermissionLevel <= 2) return res.status(401).json(msg.unAccess('invalid access level'));
  if (!req.body || isEmpty(req.body)) return res.status(400).json(msg.badRequest(null, 'payload is empty'));

  const id = req.body.id;

  Discount.findOneAndDelete({
    _id: id
  }, (err, data) => {
    if (err) return res.status(400).json(msg.isfail(data, err));
    else {
      return res.status(200).json(msg.isSuccess(data, err));
    }
  })
})

// ! UPDATE
router.post("/update", async (req, res) => {

  // * Validate
  const authPermissionLevel = await authPermission(req).then((result) => result, (err) => [true, err]);
  if (authPermissionLevel[0]) return res.status(400).json(msg.badRequest(null, authPermissionLevel[1]))
  if (authPermissionLevel <= 2) return res.status(401).json(msg.unAccess('invalid access level'));
  if (!req.body || isEmpty(req.body)) return res.status(400).json(msg.badRequest(null, 'payload is empty'));

  let payload = req.body;
  const id = req.body._id;


  // * Get list of code
  const rawCode = await Discount.find({})
  const decryptCode = await rawCode.filter(x => x._id != id).map(item => CryptoJS.AES.decrypt(item.code, keys.ENCRYPTION_SECRET_64).toString(CryptoJS.enc.Utf8))


  // * Check if update code is same as code in database
  if (decryptCode.includes(payload.code)) return res.status(400).json(msg.badRequest(null, 'code is exist'))

  // * Encrypt update code
  payload.code = CryptoJS.AES.encrypt(payload.code, keys.ENCRYPTION_SECRET_64).toString();

  if (!payload._id) payload._id = mongoose.Types.ObjectId();
  if (payload.owner == "" || payload.owner == " " || payload.owner == null) payload.owner = null

  // * Update and return
  Discount.findOneAndUpdate({
    _id: id || payload._id
  }, payload, {
    upsert: true,
    new: true,
    setDefaultsOnInsert: true
  }, (err, data) => {
    if (err) return res.status(400).json(msg.isfail(data, err));
    else {
      data.code = CryptoJS.AES.decrypt(data.code, keys.ENCRYPTION_SECRET_64).toString(CryptoJS.enc.Utf8)
      return res.status(200).json(msg.isSuccess(data, err));
    }
  });
}); //// end `update` block

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