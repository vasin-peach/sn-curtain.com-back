const express = require("express");
const router = express.Router();
const _ = require('lodash');
const msg = require('../responseMsg');

// Import Model
const Product = require('../../../models/Product');

// Declare Variable
var amountPerPage = 12;
var currentPage = 1;
var category = null;
var nature = null;
var type = null;
var search = null;

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
router.get('/get/:search/:page/:category/:type/:nature', async (req, res) => {

  // define filter
  currentPage = (req.params.page ? req.params.page : currentPage);
  search = (req.params.search && req.params.search != ' ' ? {
    "name": RegExp(req.params.search)
  } : {});
  category = (req.params.category && req.params.category != ' ' ? {
    "category.category": req.params.category
  } : {});
  type = (req.params.type && req.params.type != ' ' ? {
    "category.type": req.params.type
  } : {});
  nature = (req.params.nature && req.params.nature != ' ' ? {
    "category.nature": req.params.nature
  } : {});



  try {
    // get count
    const count = await new Promise((resolve, reject) => {
      Product.find({
        $and: [search, category, type, nature]
      }).count((err, data) => {
        if (err) return reject(err)
        return resolve(data);
      });
    })

    // get data
    const data = await new Promise((resolve, reject) => {
      Product.find({
        $and: [search, category, type, nature]
      }, {}, { // get range of data
        skip: (currentPage - 1) * amountPerPage,
        limit: amountPerPage
      }, (err, data) => {
        if (err) return reject(err);
        return resolve(data);
      });
    })

    // create payload
    const payload = {
      count: await count,
      data: await data
    }

    // return response
    if (_.isEmpty(payload.data)) return res.status(404).json(msg.isEmpty(null, payload));
    else return res.status(200).json(msg.isSuccess(payload, null));

  } catch (e) {
    return res.status(404).json(msg.isEmpty(null, e));
  }
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

  returnResponse().then((data) => {
    console.log(data, "data");
  }).catch((error) => {
    console.log(error, "error");
  });

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
router.post("/create", (req, res, next) => { // *** don't forgot to add middleware admin when production
  Product.create(req.body, (err, data) => {
    if (err) return res.status(400).json(msg.isfail(data, err))
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