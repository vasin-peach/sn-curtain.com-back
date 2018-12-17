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
const OrderRoute = require('./api/order/order');
const UploadRoute = require('./api/upload/upload');
const WeightRoute = require('./api/weight/weight');
const Redirect = require('./api/redirect');
const Permission = require('./api/permission');


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
router.use('/order', OrderRoute);
router.use('/upload', UploadRoute);
router.use('/weight', WeightRoute);
router.use('/redirect', Redirect);
router.use('/permission', Permission);

module.exports = router;