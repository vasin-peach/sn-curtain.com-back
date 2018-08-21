const express = require("express");
const router = express.Router();

// Import Route
const CSRFRoute = require('./api/csrf/csrf');
const ProductRoute = require('./api/product/product');
const DiscountRoute = require('./api/discount/discount');
const AuthRoute = require("./api/auth");

// Default route
router.get("/", function (req, res) {
  res.status(200).json({
    status: 200,
    message: 'Healty!.'
  })
})

// Product Route
router.use('/csrf', CSRFRoute);
router.use('/product', ProductRoute);
router.use('/discount', DiscountRoute);
router.use('/auth', AuthRoute);

module.exports = router;