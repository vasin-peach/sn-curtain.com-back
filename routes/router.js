const express = require("express");
const router = express.Router();

// Import Route
const AuthRoute = require("./api/auth");
const ProductRoute = require('./api/product/product');
const CSRFRoute = require('./api/csrf/csrf');
const BasketRoute = require('./api/basket/basket');

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
router.use('/auth', AuthRoute);
router.use('/basket', BasketRoute);

module.exports = router;