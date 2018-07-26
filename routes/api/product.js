const express = require("express");
const router = express.Router();

const Product = require('../../models/Product');

// Get product
router.get("/", (req, res, next) => {
  Product.find({}, (err, data) => {
    if (err) console.log(err);
    else {
      return res.status(200).json({
        status: 200,
        message: 'Success',
        err: err,
        data: data
      })
    }
  })
})

// Create product
router.post("/", (req, res, next) => {
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