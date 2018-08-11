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

///
// Get product all
///
router.get("/all", (req, res, next) => {
  Product.find({}, (err, data) => {
    if (err) {
      return res.status(400).json(msg.isfail(data, err))
    } else {
      return res.status(200).json(msg.isSuccess(data, err))
    }
  })
})

///
// Get product by id
///
router.get('/id/:id', (req, res) => {
  Product.find({
    _id: req.params.id
  }, (err, data) => {
    return _.isEmpty(data) ? res.status(404).json(msg.isEmpty(data, err)) : res.status(200).json(msg.isSuccess(data, err))
  })
})


///
// Get product by page, fabric, type, color
///
router.get('/get/:search/:page/:fabric/:color/:type', async (req, res) => {

  async function returnResponse(search, fabric, color, type) {

    let count = new Promise((resolve, reject) => {
      // query count item
      Product.find({
        $and: [search, fabric, color, type]
      }).count((err, data) => {
        return resolve(data);
      })
    })

    let data = new Promise((resolve, reject) => {
      // query data
      Product.find({
        $and: [search, fabric, color, type]
      }, {}, { // get range of data
        skip: (currentPage - 1) * amountPerPage,
        limit: amountPerPage
      }, (err, data) => {

        return resolve(data);
      })
    })

    let payload = {
      count: await count,
      data: await data
    }

    return _.isEmpty(payload.data) ? res.status(404).json(msg.isEmpty(payload, null)) : res.status(200).json(msg.isSuccess(payload, null))
  }

  // check page is number
  if (isNaN(req.params.page)) return res.status(400).json(msg.isNumber());

  // define filter
  currentPage = (req.params.page ? req.params.page : currentPage);
  search = (req.params.search && req.params.search != ' ' ? {
    "name": RegExp(req.params.search)
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

  returnResponse(search, fabric, color, type);
})


///
// Get category
///
router.get('/category', async (req, res) => {

  async function returnResponse() {
    let filter = []

    let type = new Promise((resolve, reject) => {
      Product.distinct("category.type", (err, data) => {
        return _.isEmpty(data) ? reject(err) : resolve(data);
      })
    })
    let color = new Promise((resolve, reject) => {
      Product.distinct("category.color.val", (err, data) => {
        return _.isEmpty(data) ? reject(err) : resolve(data);
      })
    })
    let fabric = new Promise((resolve, reject) => {
      Product.distinct("fabric", (err, data) => {
        return _.isEmpty(data) ? reject(err) : resolve(data);
      })
    })

    let result = {
      "type": await type,
      "color": await color,
      "fabric": await fabric
    }
    return _.isEmpty(result) ? res.status(404).json(msg.isEmpty(result, null)) : res.status(200).json(msg.isSuccess(result, null))

  }

  returnResponse();

})


///
// Get popular product
///
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

///
// Get num of product
///
router.get('/count', (req, res) => {
  Product.find({}).count((err, data) => {
    return data ? res.status(200).json(msg.isSuccess(data, err)) : res.status(404).json(msg.isEmpty(data, err))
  })
})


///
// Create product
///
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