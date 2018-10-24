const express = require("express");
const _ = require("lodash");
const msg = require("../responseMsg");
const CryptoJS = require('crypto-js');
const keys = require('../../../config/keys');
const Discount = require('../../../models/Discount');
const moment = require('moment');
const Omise = require('omise')({
  'secretKey': 'skey_test_5diatzuu1tsmcften6a',
  'omiseVersion': '2015-09-10'
});


// Declear Varaible
const router = express.Router();

// Route
router.get("/", (req, res) => {
  return res.status(200).json(msg.isSuccess('Payment Api - Healty!', null));
});

router.post("/charge", (req, res) => {

  // declear list of payload
  const product = JSON.parse(req.body.product);
  const discountCode = JSON.parse(req.body.discount);
  const delivery = JSON.parse(req.body.delivery);
  const card = req.body.card;
  const card_token = req.body.card_token


  // declear list of price
  var discountPrice = 0;
  var deliveryPrice = delivery;

  // Get Price
  var productPrice = product.reduce((sum, item) => {
    return sum + item.buyOption * item.amount;
  }, 0);

  // Get Description
  var description = product.reduce((sum, item) => {
    console.log(item);
  });


  // Get Discount
  if (discountCode || discountCode == "" || discountCode == " ") {

    var discountList = [];

    // get discount price by code
    Discount.find({}, (err, data) => {

      // create list of discount
      data.map((data) => {
        discountList.push({
          code: CryptoJS.AES.decrypt(data.code, keys.ENCRYPTION_SECRET_64).toString(CryptoJS.enc.Utf8),
          discount: data.discount,
          expired: data.expired,
          infinity: data.infinity,
          quantity: data.quantity
        });
      });


      // check code is exist
      var exist = discountList.filter((data) => {
        var checkExpired = moment().isBetween(data.expired.expiredStart, data.expired.expiredEnd);
        return (data.code == discountCode) && (!data.expired.expired || checkExpired) && (data.infinity || data.quantity > 0);
      });


      // if exist get discount amount
      if (!_.isEmpty(exist)) {
        // get amount from discount type
        if (exist[0].discount.percent) {
          discountPrice = Math.floor((exist[0].discount.percent * parseFloat(productPrice)) / 100);
        } else if (exist[0].discount.amount) {
          discountPrice = Math.floor(exist[0].discount.amount);
        }
      }


      // Sum price
      productPrice = (productPrice + deliveryPrice) - discountPrice;
      productPrice = productPrice <= 0 ? 0 : productPrice;
      productPrice = String(productPrice) + "00";


      // create charges
      Omise.charges.create({
        description: 'John Doe (id: 30)',
        amount: productPrice,
        currency: 'thb',
        capture: true,
        card: card_token
      }, function (error, customer) {
        if (error) return res.status(400).json(msg.isfail(null, error));
        return res.status(200).json(msg.isSuccess(customer, null));
      }, error => {
        return res.status(400).json(msg.isfail(null, error));
      });


    });
  }
});

module.exports = router;