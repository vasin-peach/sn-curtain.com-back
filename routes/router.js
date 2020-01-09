const express = require('express')
const router = express.Router()
const app = express()
const Cron = require('node-cron')
const Product = require('../models/Product')
const Views = require('../models/View')

// Import Route
const CSRFRoute = require('./api/csrf/csrf')
const ProductRoute = require('./api/product/product')
const DiscountRoute = require('./api/discount/discount')
const AuthRoute = require('./api/auth/auth')
const DeliveryRoute = require('./api/delivery/delivery')
const GeneratorRoute = require('./api/generator/generator')
const PaymentRoute = require('./api/payment/main')
const BasketRoute = require('./api/basket/basket')
const OrderRoute = require('./api/order/order')
const UploadRoute = require('./api/upload/upload')
const WeightRoute = require('./api/weight/weight')
const Redirect = require('./api/redirect')
const Permission = require('./api/permission')
const Summary = require('./api/summary/summary')
const View = require('./api/summary/view')
const Slide = require('./api/slide/slide')
const Chat = require('./api/chat/chat')
const Guest = require('./api/guest')

// Default route
router.get('/', function(req, res) {
  res.status(200).json({
    status: 200,
    message: 'Healty!.',
  })
})

// Product Route
router.use('/csrf', CSRFRoute)
router.use('/product', ProductRoute)
router.use('/discount', DiscountRoute)
router.use('/delivery', DeliveryRoute)
router.use('/auth', AuthRoute)
router.use('/generator', GeneratorRoute)
router.use('/payment', PaymentRoute)
router.use('/basket', BasketRoute)
router.use('/order', OrderRoute)
router.use('/upload', UploadRoute)
router.use('/weight', WeightRoute)
router.use('/redirect', Redirect)
router.use('/permission', Permission)
router.use('/summary', Summary)
router.use('/slide', Slide)
router.use('/chat', Chat)
router.use('/guest', Guest)
router.use('/view', View)

// Schedule
Cron.schedule('* * * * Dec *', async () => {
  // Update all product view to zero.
  await Product.findOneAndUpdate(
    {},
    {
      view: 0,
    },
  )

  // Update all product buy to zero.
  await Product.findOneAndUpdate(
    {},
    {
      buy: 0,
    },
  )

  // Delete all product views.
  await Views.remove({})
})

module.exports = router
