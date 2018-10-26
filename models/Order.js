const mongoose = require('mongoose');
const {
  Schema
} = mongoose;

const orderSchema = new Schema({
  order_name: String,
  order_description: String,
  product: [{
    product_id: String,
    amount: Number,
    data: Object
  }],
  pricing: {
    product_price: Number,
    discount_price: Number,
    delivery_price: Number,
    summary_price: Number
  },
  discount: {
    discount_code: String,
    discount_type: String,
    discount_amount: Number,
    discount_percent: Number,
  },
  delivery: {
    delivery_type: String,
    delivery_amount: Number,
    delivery_description: Number,
    delivery_status: String,
  },
  payment: {
    payment_type: String,
    payment_evidence: String,
    customer_name: String,
  },
  order_status: String,
  created_at: new Date(),
  updated_at: new Date()
})

module.exports = mongoose.model('Order', orderSchema);