const mongoose = require('mongoose');
const {
  Schema
} = mongoose;

const orderSchema = new Schema({
  order_name: {
    type: String,
    required: true
  },
  order_description: {
    type: String,
    required: true
  },
  product: [{
    product_id: {
      type: String,
      required: true
    },
    amount: {
      type: Number,
      required: true
    },
    data: {
      type: Object,
      required: true
    }
  }],
  pricing: {
    product_price: Number,
    discount_price: Number,
    delivery_price: Number,
    summary_price: {
      type: Number,
      required: true
    }
  },
  discount: {
    discount_code: String,
    discount_type: String,
    discount_amount: Number,
    discount_percent: Number,
  },
  delivery: {
    delivery_type: {
      type: String,
      required: true
    },
    delivery_amount: {
      type: Number,
      required: true
    },
    delivery_status: {
      type: String,
      required: true
    },
    delivery_description: Number
  },
  payment: {
    payment_type: {
      type: String,
      required: true
    },
    payment_evidence: {},
    customer_name: {
      type: String,
      required: true
    },
  },
  user_id: {
    type: String,
    required: true
  },
  order_status: {
    type: String,
    required: true
  },
}, {
  timestamps: {
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  }
});

module.exports = mongoose.model('Order', orderSchema);