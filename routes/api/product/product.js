const express = require("express");
const router = express.Router();
const _ = require('lodash');
const msg = require('../responseMsg');

// Import Model
const Product = require('../../../models/Product');

// Declare Variable
var amountPerPage = 12;
var currentPage = 1;
var fabric = null
var color = null
var type = null
var search = null

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
router.get('/get/:search/:page', (req, res) => {

  // check page is number
  if (isNaN(req.params.page)) return res.status(400).json(msg.isNumber());


  // define filter
  currentPage = (req.params.page ? req.params.page : currentPage);
  search = req.params.search == " " ? "" : req.params.search;

  // regix
  var regex = new RegExp(".*" + search + ".*");

  // query
  Product.find({
    "name": regex
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

// get product by page, fabric
router.get('/get/:page/:fabric/', (req, res) => {

  // check page is number
  if (isNaN(req.params.page)) return res.status(400).json(msg.isNumber());

  // define filter
  currentPage = (req.params.page ? req.params.page : currentPage);
  fabric = (req.params.fabric ? req.params.fabric : fabric);

  // query
  Product.find({
    "category.fabric": fabric
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

// get product by page, fabric, color
router.get('/get/:page/:fabric/:color', (req, res) => {
  console.log('test');
  // check page is number
  if (isNaN(req.params.page)) return res.status(400).json(msg.isNumber());

  // define filter
  currentPage = (req.params.page ? req.params.page : currentPage);
  fabric = (req.params.fabric ? req.params.fabric : fabric);
  color = (req.params.color ? req.params.color : color);

  // query
  Product.find({
    $and: [{
        "category.fabric": fabric
      },
      {
        "category.color.val": color
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

// get product by page, fabric, type, color
router.get('/get/:search/:page/:fabric/:color/:type', (req, res) => {
  // check page is number
  if (isNaN(req.params.page)) return res.status(400).json(msg.isNumber());

  // define filter
  currentPage = (req.params.page ? req.params.page : currentPage);
  search = (req.params.search && req.params.color != ' ' ? {
    "name": req.params.search
  } : {});
  fabric = (req.params.fabric && req.params.fabric != ' ' ? {
    "fabric": req.params.fabric
  } : {});
  color = (req.params.color && req.params.color != ' ' ? {
    "category.color.val": req.params.color
  } : {});
  type = (req.params.type && req.params.type != ' ' ? {
    "category.type": req.params.type
  } : {});


  // query
  Product.find({
    $and: [fabric, color, type]
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