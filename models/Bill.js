const mongoose = require('mongoose');
const autoIncrement = require('mongoose-auto-increment');
const {
  Schema
} = mongoose;

const billSchema = new Schema({
  bill_description: {
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
    option: {
      type: String,
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
    delivery_description: {
      type: String,
      required: true
    },
    user_id: {
      type: String,
      required: true
    },
    tel: {
      type: String,
    },
  },
  bill_status: {
    type: String,
    required: true
  },
  bill_image: {
    type: String,
  }
}, {
  timestamps: {
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  }
})

billSchema.plugin(autoIncrement.plugin, 'Bill');

module.exports = mongoose.model('Bill', billSchema);