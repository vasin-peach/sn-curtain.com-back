const express = require("express");
const msg = require("../responseMsg");
const isEmpty = require('lodash/isempty');
const router = express.Router();

// Import Schema
import Order from '../../../models/Order';


router.get("/", (req, res) => { // Get User Order

  // get user data from session
  let user = req.session.passport.user;

  // notfound user data in session --> 401
  if (isEmpty(user)) return res.status(401).json(msg.badRequest(null, 'Unauthorized.'));

  Order.find({ // find order by user id
    user_id: user._id
  }, (err, data) => {

    // if query return error
    if (err) return res.status(400).json(msg.isfail(data, err));

    // success
    return res.status(200).json(msg.isSuccess(data, null));

  });
});

router.get("/:id", (req, res) => { // Get order by id

  // declear order_id
  const order_id = req.params.id

  // check id is exist & is number
  if (!order_id || isNaN(order_id)) return res.status(400).json(msg.badRequest(null, 'id notfound or id is not number.'));

  Order.findOne({ // find order by _id
    _id: order_id
  }, (err, data) => {

    // is error
    if (err) return res.status(400).json(msg.isfail(data, err));
    if (isEmpty(data)) return res.status(400).json(msg.isEmpty(data, err));

    // is success
    return res.status(200).json(msg.isSuccess(data, null));

  });
})


router.post("/", (req, res) => { // Create User Order

  // get user data from session
  let user = req.session.passport.user;
  let payload = req.body;

  // not found user data in session --> 401
  if (isEmpty(user)) return res.status(401).json(msg.badRequest(null, 'Unauthorized.'));

  // not found payload --> 400
  if (isEmpty(payload)) return res.status(400).json(msg.isEmpty(null, 'Payload is empty.'));

  Order.create(payload, (err, data) => { // query create 

    // error
    if (err) return res.status(400).json(msg.badRequest(data, err));

    // success
    return res.status(201).json(msg.isCreated(data, err));

  });
});

module.exports = router;