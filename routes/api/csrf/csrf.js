const express = require("express");
const router = express.Router();
const csrf = require('csurf');
const msg = require('../responseMsg');

/*
  ROUTES
*/

router.get('/', (req, res) => {
  res.status(200).json(msg.isSuccess('CSRF Api, Healty.', null));
})

router.get('/get', (req, res) => {
  res.status(200).json(msg.isSuccess(req.csrfToken()));
})

router.post('/', (req, res) => {
  res.status(200).json(msg.isSuccess('access data with csrf'))
})

module.exports = router;