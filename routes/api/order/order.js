const express = require("express");
const msg = require("../responseMsg");
const _ = require('lodash');
const router = express.Router();

// Import Schema
import Order from '../../../models/Order';



router.get("/", (req, res) => { // Get User Order

  // get user data from session
  let user = req.session.passport.user;

  // notfound user data in session --> 401
  if (_.isEmpty(req.session.passport.user)) return res.status(401).json(msg.badRequest(null, 'Unauthorized.'));

  Order.find({ // find order by user id
    user_id: user.id
  }, (err, data) => {

    // if query return error
    if (err) return res.status(400).json(msg.isfail(data, err));

    // success
    return res.status(200).json(msg.isSuccess(data, null));

  });
});

router.post("/", (req, res) => { // Create User Order

})

module.exports = router;