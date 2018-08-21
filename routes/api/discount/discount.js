const _ = require('lodash');
const express = require("express");
const router = express.Router();
const msg = require('../responseMsg');
const CryptoJS = require('crypto-js');
const keys = require('../../../config/keys');

// Import Model
const Discount = require('../../../models/Discount');

///--
// ROUTES
///--

// find discount code
router.get("/id/:code", (req, res) => {
  var code = req.params.code;
  var discountList = []
  Discount.find({}, (err, data) => {

    // create list of discount
    data.map((data) => {
      discountList.push({
        code: CryptoJS.AES.decrypt(data.code, keys.ENCRYPTION_SECRET_64).toString(CryptoJS.enc.Utf8),
        discount: data.discount,
        expired: data.expired,
        infinity: data.infinity,
        quantity: data.quantity
      })
    })

    // check code is exist
    var exist = discountList.filter((data) => {
      return data.code == code
    })

    // response
    if (_.isEmpty(exist)) return res.status(404).json(msg.isEmpty(null, null))
    else {
      return res.json(msg.isSuccess({
        code: code,
        discount: exist[0].discount
      }, null))
    }

  })
})


// get all
router.get("/all", (req, res) => { // *** only admin
  Discount.find({}, (err, data) => {
    return err ? res.status(400).json(msg.isfail(data, err)) : res.status(200).json(msg.isSuccess(data, err))
  })
})

// create
router.post("/create", (req, res) => { // *** don't forgot to add middleware admin when production
  // check payload is not empty
  if (_.isEmpty(req.body.payload)) return res.status(400).json(msg.badRequest());
  if (!req.body.payload.code) return res.status(400).json(msg.badRequest());

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