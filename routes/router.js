const express = require("express");
const router = express.Router();
const app = express();

// Import Route
const CSRFRoute = require('./api/csrf/csrf');
const ProductRoute = require('./api/product/product');
const DiscountRoute = require('./api/discount/discount');
const AuthRoute = require("./api/auth/auth");
const DeliveryRoute = require('./api/delivery/delivery');
const GeneratorRoute = require('./api/generator/generator');
const PaymentRoute = require('./api/payment/main');
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
router.use('/discount', DiscountRoute);
router.use('/delivery', DeliveryRoute);
router.use('/auth', AuthRoute);
router.use('/generator', GeneratorRoute);
router.use('/payment', PaymentRoute);
router.use('/basket', BasketRoute);

module.exports = router;