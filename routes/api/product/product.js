const express = require("express");
const router = express.Router();
const _ = require('lodash');
const msg = require('../responseMsg');

// Import Model
const Product = require('../../../models/Product');

// Declare Variable
var amountPerPage = 12;
var currentPage = 1;
var tag = null
var color = null

/*
  ROUTES
*/

// get product all
router.get("/all", (req, res, next) => {
  Product.find({}, (err, data) => {
    if (err) {
      return res.status(400).json(msg.isfail(data, err))
    } else {
      return res.status(200).json(msg.isSuccess(data, err))
    }
  })
})


// get product by page
router.get('/get/:page', (req, res) => {

  // check page is number
  if (isNaN(req.params.page)) return res.status(400).json(msg.isNumber());


  // define filter
  currentPage = (req.params.page ? req.params.page : currentPage);

  // query
  Product.find({}, {}, { // get range of data
    skip: (currentPage - 1) * amountPerPage,
    limit: amountPerPage
  }, (err, data) => {
    if (_.isEmpty(data)) { // check response is empty
      return res.status(404).json(msg.isEmpty(data, err))
    }
    if (err) {
      return res.status(400).json(msg.isfail(data, err))
    } else {
      return res.status(200).json(msg.isSuccess(data, err))
    }
  })
})

// get product by page, tag
router.get('/get/:page/:tag/', (req, res) => {

  // check page is number
  if (isNaN(req.params.page)) return res.status(400).json(msg.isNumber());

  // define filter
  currentPage = (req.params.page ? req.params.page : currentPage);
  tag = (req.params.tag ? req.params.tag : tag);

  // query
  Product.find({
    "category.tag.name": tag
  }, {}, { // get range of data
    skip: (currentPage - 1) * amountPerPage,
    limit: amountPerPage
  }, (err, data) => {
    if (_.isEmpty(data)) { // check response is empty
      return res.status(404).json(msg.isEmpty(data, err))
    }
    if (err) {
      return res.status(400).json(msg.isfail(data, err))
    } else {
      return res.status(200).json(msg.isSuccess(data, err))
    }
  })
})

// get product by page, tag, color
router.get('/get/:page/:tag/:color', (req, res) => {

  // check page is number
  if (isNaN(req.params.page)) return res.status(400).json(msg.isNumber());

  // define filter
  currentPage = (req.params.page ? req.params.page : currentPage);
  tag = (req.params.tag ? req.params.tag : tag);
  color = (req.params.color ? req.params.color : color);

  // query
  Product.find({
    $and: [{
        "category.tag.name": tag
      },
      {
        "category.color.name": color
      }
    ]
  }, {}, { // get range of data
    skip: (currentPage - 1) * amountPerPage,
    limit: amountPerPage
  }, (err, data) => {
    if (_.isEmpty(data)) { // check response is empty
      return res.status(404).json(msg.isEmpty(data, err))
    }
    if (err) {
      return res.status(400).json(msg.isfail(data, err))
    } else {
      return res.status(200).json(msg.isSuccess(data, err))
    }
  })
})

// get popular product
router.get('/popular', (req, res) => {

  // query get top 6 of product
  Product.find({}).sort({}).sort({
    view: -1
  }).limit(6).exec((err, data) => {
    if (_.isEmpty(data)) { // check response is empty
      return res.status(404).json(msg.isEmpty(data, err))
    }
    if (err) {
      return res.status(400).json(msg.isfail(data, err))
    } else {
      return res.status(200).json(msg.isSuccess(data, err))
    }
  })
})

// Create product
router.post("/create", (req, res, next) => {
  Product.create(req.body, (err, data) => {
    if (err) console.log(err);
    else {
      return res.status(201).json({
        status: 201,
        message: 'Created',
        err: err,
        data: data,
      })
    }
  })
})

// Update product
router.put("/", (req, res, next) => {

})

router.delete("/", (req, res, next) => {

})


module.exports = router;