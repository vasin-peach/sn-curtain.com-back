const express = require("express");
const _ = require("lodash");
const msg = require("../responseMsg");
const CryptoJS = require("crypto-js");
const keys = require("../../../config/keys");
const Discount = require("../../../models/Discount");
const Delivery = require("../../../models/Delivery");
const moment = require("moment");
const Omise = require("omise")({
  secretKey: "skey_test_5diatzuu1tsmcften6a",
  omiseVersion: "2015-09-10"
});

// Declear Varaible
const router = express.Router();

import {
  createOrder
} from './order';

// Route
router.get("/", (req, res) => {
  return res.status(200).json(msg.isSuccess("Payment Api - Healty!", null));
});

router.post("/charge", (req, res) => {
  // declear list of payload
  const email = req.body.email + ", ";
  const product = JSON.parse(req.body.product);
  const discountCode = JSON.parse(req.body.discount || 0);
  const delivery = JSON.parse(req.body.delivery || 0);
  const card = req.body.card;
  const card_token = req.body.card_token;
  const payment = req.body.payment;

  // declear list of price
  var discountPrice = 0;
  var deliveryPrice = delivery;

  // Get Price
  var productPrice = product.reduce((sum, item) => {
    return sum + item.buyOption * item.amount;
  }, 0);

  // Duplicate productPrice
  const productPrice_temp = productPrice

  // Create Description
  var description = product.reduce((sum, item) => {
    return (
      sum + item.data.name + " (" + item.buyOption + "฿)[" + item.amount + "]. "
    );
  }, email);

  // Get Discount
  if (discountCode || discountCode == "" || discountCode == " ") {
    var discountList = [];

    // get discount price by code
    Discount.find({}, (err, data) => {
      // create list of discount
      data.map(data => {
        discountList.push({
          code: CryptoJS.AES.decrypt(
            data.code,
            keys.ENCRYPTION_SECRET_64
          ).toString(CryptoJS.enc.Utf8),
          discount: data.discount,
          expired: data.expired,
          infinity: data.infinity,
          quantity: data.quantity
        });
      });

      // check code is exist
      var exist = discountList.filter(data => {
        var checkExpired = moment().isBetween(
          data.expired.expiredStart,
          data.expired.expiredEnd
        );
        return (
          data.code == discountCode &&
          (!data.expired.expired || checkExpired) &&
          (data.infinity || data.quantity > 0)
        );
      });

      // if exist get discount amount
      if (!_.isEmpty(exist)) {
        // get amount from discount type
        if (exist[0].discount.percent) {
          var discountType = 'percent'
          var discountPercent = exist[0].discount.percent;
          discountPrice = Math.floor(
            (exist[0].discount.percent * parseFloat(productPrice)) / 100
          );
        } else if (exist[0].discount.amount) {
          var discountType = 'amount'
          discountPrice = Math.floor(exist[0].discount.amount);
        }
      }

      // Sum price
      productPrice = productPrice + deliveryPrice - discountPrice;
      productPrice = productPrice <= 0 ? 20 : productPrice;
      productPrice = String(productPrice) + "00";

      // create charges
      Omise.charges.create({
          description: description,
          amount: productPrice,
          currency: "thb",
          capture: true,
          card: card_token
        },
        function (error, customer) {
          if (error) return res.status(400).json(msg.isfail(null, error));

          // change product format
          const product_new = product.map(item => {
            return {
              product_id: item.data._id,
              amount: item.amount,
              option: item.buyOption,
              data: item.data
            }
          });

          // create pricing format
          const pricing_new = {
            product_price: productPrice_temp,
            discount_price: discountPrice,
            delivery_price: deliveryPrice,
            summary_price: productPrice
          }

          // create discount format
          const discount_new = {
            discount_code: discountCode || null,
            discount_type: discountType || null,
            discount_percent: discountPercent || null,
            discount_amount: discountPrice || null
          }

          // create delivery format
          const delivery_new = {
            delivery_type: 0,
            delivery_amount: delivery,
            delivery_status: 'กำลังดำเนินการ',
            delivery_description: payment.house_no + " " +
              payment.village_no + " " +
              payment.amphoe + " " +
              payment.district + " " +
              payment.road + " " +
              payment.province + " " +
              payment.zip + " "
          }

          // create payment format
          const payment_new = {
            payment_type: 'credit',
            payment_evidence: customer.transaction,
            customer_name: payment.first_name + " " + payment.last_name
          }

          // declear payload to order
          const payload = {
            order_name: email,
            order_description: description,
            product: product_new,
            pricing: pricing_new,
            discount: discount_new,
            delivery: delivery_new,
            payment: payment_new,
            user_id: req.session.passport.user._id || null,
            tel: payment.tel,
            order_status: 'ชำระเงิน'
          }

          // create order
          createOrder(payload).then((response) => {
            return res.status(200).json(msg.isSuccess(response, null));
          }, (error) => {
            return res.status(200).json(msg.isSuccess("can't create order.", error));
          })

        },
        error => {
          return res.status(400).json(msg.isfail(null, error));
        }
      );
    });
  }
});

module.exports = router;