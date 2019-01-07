//
// ─── IMPORT ─────────────────────────────────────────────────────────────────────
//
const express = require("express");
const msg = require("../responseMsg");
const isEmpty = require("lodash.isempty");
const router = express.Router();
const CryptoJS = require("crypto-js");
const keys = require("../../../config/keys");
const Discount = require("../../../models/Discount");
const moment = require("moment");

import Order from "../../../models/Order";
import {
  authPermission
} from '../auth/auth.func';
import {
  createOrder
} from "../payment/order";

//
// ─── ROUTER ─────────────────────────────────────────────────────────────────────
//

// ? Get User Order
router.get("/", (req, res) => {
  // get user data from session
  let user = req.session.passport.user;

  // notfound user data in session --> 401
  if (!user || !user._id || isEmpty(user))
    return res.status(401).json(msg.badRequest(null, "Unauthorized."));

  Order.find({
      user_id: user._id
    })
    .sort({
      _id: -1
    })
    .exec((err, data) => {
      // if query return error
      if (err) return res.status(400).json(msg.isfail(data, err));

      // success
      return res.status(200).json(msg.isSuccess(data, null));
    });
});

// ? Get User Order by id
router.get("/:id", (req, res) => {
  // declear order_id
  const order_id = req.params.id;

  // check id is exist & is number
  if (!order_id || isNaN(order_id))
    return res
      .status(400)
      .json(msg.badRequest(null, "id notfound or id is not number."));

  Order.findOne({
      // find order by _id
      _id: order_id
    },
    (err, data) => {
      // is error
      if (err) return res.status(400).json(msg.isfail(data, err));
      if (isEmpty(data)) return res.status(400).json(msg.isEmpty(data, err));

      // is success
      return res.status(200).json(msg.isSuccess(data, null));
    }
  );
});

// ? Create Order
router.post("/", async (req, res) => {
  // *
  // * ─── VALIDATE ───────────────────────────────────────────────────────────────────
  // *

  // get user data from session
  var user = req.session.passport.user;
  var payload = req.body;

  // not found user data in session --> 401
  if (isEmpty(user))
    return res.status(401).json(msg.badRequest(null, "Unauthorized."));

  // not found payload --> 400
  if (isEmpty(payload) || !payload.product)
    return res.status(400).json(msg.isEmpty(null, "Payload is empty."));

  // *
  // * ─── DECLEAR ────────────────────────────────────────────────────────────────────
  // *

  // list of payload
  const email = req.body.email + ", ";
  const product = await JSON.parse(req.body.product);
  const discountCode = await JSON.parse(req.body.discount || 0);
  const delivery = await JSON.parse(req.body.delivery || 0);
  const payment = req.body.payment;

  // list of price
  var discountPrice = 0;
  var deliveryPrice = delivery;
  var productPrice = 0;
  var productPriceTemp = 0;
  var description = "";

  // *
  // * ─── CALCULATE ────────────────────────────────────────────────────────────────────
  // *

  // price
  productPrice = product.reduce((sum, item) => {
    return sum + item.buyOption * item.amount;
  }, 0);

  // temp product price
  productPriceTemp = productPrice;

  // create description
  description = product.reduce((sum, item) => {
    return `${sum + item.data.name} (${item.buyOption}฿)[${item.amount}].`;
  }, email);

  // ! discount
  // validate discount
  if (discountCode && discountCode != "" && discountCode != " ") {
    // get discount list from db

    var discountList = [];
    await Discount.find({}, (err, data) => {

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
    });

    // check discountcode is exist in discount list
    const discountExist = await discountList.filter(data => {
      // check code date

      if (data.expired.expired) {
        var checkExpired = moment().isBetween(
          data.expired.expiredStart,
          data.expired.expiredEnd
        );
      }
      return (
        data.code == discountCode &&
        (!data.expired.expired || checkExpired) &&
        (data.infinity || data.quantity > 0)
      );
    });

    // get discount amount
    if (!isEmpty(discountExist)) {
      // get amount from discount type
      if (discountExist[0].discount.percent) {
        // percent type
        var discountType = "percent";
        var discountPercent = discountExist[0].discount.percent;
        discountPrice = Math.floor(
          (discountExist[0].discount.percent * parseFloat(productPrice)) / 100
        );
      } else if (discountExist[0].discount.amount) {
        // amount type
        var discountType = "amount";
        discountPrice = Math.floor(discountExist[0].discount.amount);
      } else if (discountExist[0].discount.delivery) {
        var discountType = "delivery";
        discountPrice = deliveryPrice
      }
    }
  }

  // *
  // * ─── SUMMARY PRICE ──────────────────────────────────────────────────────────────
  // *

  productPrice = productPrice - discountPrice + deliveryPrice;
  productPrice = productPrice <= 0 ? 20 : productPrice;
  productPrice = String(productPrice) + "00";

  // *
  // * ─── QUERY MONGO ────────────────────────────────────────────────────────────────
  // *

  // change product format
  const product_new = product.map(item => {
    return {
      product_id: item.data._id,
      amount: item.amount,
      option: item.buyOption,
      data: item.data
    };
  });

  // create pricing format
  const pricing_new = {
    product_price: productPriceTemp,
    discount_price: discountPrice,
    delivery_price: deliveryPrice,
    summary_price: productPrice
  };

  // create discount format
  const discount_new = {
    discount_code: discountCode || null,
    discount_type: discountType || null,
    discount_percent: discountPercent || null,
    discount_amount: discountPrice || null
  };

  // create delivery format
  const delivery_new = {
    delivery_type: 0,
    delivery_amount: delivery,
    delivery_status: "progress",
    delivery_description: (payment.house_no || "") +
      " " +
      payment.village_no +
      " " +
      payment.amphoe +
      " " +
      payment.district +
      " " +
      payment.road +
      " " +
      payment.province +
      " " +
      payment.zip +
      " "
  };

  // create obj to insert to db
  const obj = {
    order_name: email,
    order_description: description,
    product: product_new,
    pricing: pricing_new,
    discount: discount_new,
    delivery: delivery_new,
    user_id: req.session.passport.user._id || null,
    tel: payment.tel,
    order_status: "wait_upload"
  };

  // create order
  createOrder(obj).then(
    response => {
      return res.status(200).json(msg.isSuccess(response, null));
    },
    error => {
      return res.status(400).json(msg.isfail("can't create order.", error));
    }
  );
});

// ? delete order
router.post("/delete", async (req, res) => {
  // *
  // * ─── DECLEAR ────────────────────────────────────────────────────────────────────
  // *

  let delete_id = req.body.delete_id;
  let delete_user = req.session.passport.user._id;



  // *
  // * ─── VALIDATE ───────────────────────────────────────────────────────────────────
  // *

  // // validate param
  // if (!delete_id)
  //   return res
  //     .status(400)
  //     .json(msg.badRequest(null, "bad request, `req.body.id` is invalid."));
  // if (!delete_user)
  //   return res
  //     .status(400)
  //     .json(
  //       msg.unAuth(
  //         null,
  //         "unauthorized, `req.session.passport.user` is invalid."
  //       )
  //     );

  if (!delete_id || !delete_user) {

    // * Validate
    const authPermissionLevel = await authPermission(req).then((result) => result, (err) => [true, err]);
    if (authPermissionLevel[0]) return res.status(400).json(msg.badRequest(null, authPermissionLevel[1]))
    if (authPermissionLevel <= 2) return res.status(401).json(msg.unAccess('invalid access level'));
  }


  // validate user is owner order
  await Order.findOne({
      _id: delete_id
    },
    (error, result) => {
      if (error) return res.status(400).json(msg.isfail(null, error));
      if (!result)
        return res.status(200).json(msg.isEmpty(null, "result is empty."));
      if (!result.user_id)
        return res.status(404).json(msg.isEmpty(null, "order not found"));
      if (result.user_id != delete_user)
        return res
          .status(400)
          .json(msg.unAuth(null, "you are not owner this order."));
    }
  );

  // *
  // * ─── DELETE ─────────────────────────────────────────────────────────────────────
  // *

  // delete order
  await Order.findOneAndRemove({
      $and: [{
          _id: delete_id
        },
        {
          user_id: delete_user
        }
      ]
    },
    (error, result) => {
      if (error) return res.status(400).json(msg.isfail(null, error));
      else return res.status(200).json(msg.isSuccess(result, null));
    }
  );
}); // // delete order block end

// !
// ! ─── GET ALL ORDER ──────────────────────────────────────────────────────────────
// !

router.post("/all", async (req, res) => {

  // * Validate
  const authPermissionLevel = await authPermission(req).then((result) => result, (err) => [true, err]);
  if (authPermissionLevel[0]) return res.status(400).json(msg.badRequest(null, authPermissionLevel[1]))
  if (authPermissionLevel <= 2) return res.status(401).json(msg.unAccess('invalid access level'));

  Order.find({}).sort({
    "date": -1
  }).exec((err, data) => {
    if (err) return res.status(400).json(msg.isfail(data, err));
    else res.status(200).json(msg.isSuccess(data, err));
  })

});

// !
// ! ─── UPDATE ORDER ───────────────────────────────────────────────────────────────
// !
router.post("/update", async (req, res) => {

  // * validate
  const authPermissionLevel = await authPermission(req).then((result) => result, (err) => [true, err]);
  if (authPermissionLevel[0]) return res.status(400).json(msg.badRequest(null, authPermissionLevel[1]))
  if (authPermissionLevel <= 2) return res.status(401).json(msg.unAccess('invalid access level'));
  if (!req.body) return res.status(400).json(msg.isEmpty(null, 'payload is empty'));

  // * declear variable
  const query = req.body.query;
  const data = req.body.data;

  // * call model
  Order.findOneAndUpdate(query, data, (error, result) => {
    if (error) return res.status(400).json(msg.isfail(null, error));
    else return res.status(200).json(msg.isSuccess(result, null));
  });



})






module.exports = router;