const express = require("express");
const router = express.Router();
const msg = require('../responseMsg');

///
// Get session
///
router.get("/get", (req, res, next) => {
  if (!req.params.key) return false;
  if (req.session[req.params.key]) {
    res.status(200).json({
      status: 200,
      message: 'Success',
      err: null,
      data: req.session.basket,
    })
  } else {
    res.status(404).json({
      status: 404,
      message: 'Item not found',
      err: null,
      data: req.session.basket
    })
  }
})

///
// Create session
///
router.get('/create/:key/:data', (req, res, next) => {
  // req.session.views ? req.session.views = 0 : req.session.views += 1;
  res.status(201).json({
    status: 201,
    message: 'Created!',
    err: null,
    data: req.session[req.params.key] = req.params.data
  })
})

///
// Delete session
///
router.get('/delete/:key', (req, res, next) => {
  res.status(200).json({
    status: 200,
    message: 'Deleted',
    err: null,
    data: req.session[req.params.key] = null
  })
})


module.exports = router;