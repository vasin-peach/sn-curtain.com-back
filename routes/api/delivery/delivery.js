const express = require("express");
const _ = require('lodash');
const router = express.Router();
const msg = require('../responseMsg');
const keys = require('../../../config/keys');


// Model
const Delivery = require('../../../models/Delivery');

///
// Route
///

// get all delivery
router.get('/', (req, res) => {
  Delivery.find({}, (err, data) => {
    if (err) return res.status(400).json(msg.isfail(data, err));
    else res.status(200).json(msg.isSuccess(data, err));
  })
})

router.post('/create', (req, res) => { // must be admin
  if (_.isEmpty(req.body.payload)) return res.status(400).json(msg.badRequest());

  var payload = req.body.payload
  Delivery.create(payload, (err, data) => {
    if (err) return res.status(400).json(msg.isfail(data, err))
    else {
      return res.status(201).json({
        status: 201,
        message: 'delivery created!',
        err: err,
        data: data
      })
    }
  })
})


module.exports = router;