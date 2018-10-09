const express = require("express");
const _ = require("lodash");
const msg = require("../responseMsg");
const keys = require('../../../config/keys');
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

  // Omise.charges.create({
  //   'description': 'Charge for order ID: 888',
  //   'amount': '100000', // 1,000 Baht
  //   'currency': 'thb',
  //   'capture': true,
  //   'card': req.body.id
  // }, function (err, resp) {
  //   if (!err) console.log(resp);
  //   else throw (err);
  // });

  Omise.customers.create({
    description: 'John Doe (id: 30)',
    email: 'john.doe@example.com',
    card: req.body.id
  }, function (error, customer) {
    console.log(error, customer);
  });

  return res.status(200).json(msg.isSuccess('Payment Api - /create', null));
})

module.exports = router;