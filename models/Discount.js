const mongoose = require('mongoose');
const {
  Schema
} = mongoose;
const keys = require('../config/keys');


// Schema
const discountSchema = new Schema({
  name: {
    type: String
  },
  desc: {
    type: String
  },
  code: {
    type: String
  },
  quantity: {
    type: Number
  },
  owner: String,
  infinity: Boolean,
  expired: {
    expired: Boolean,
    expiredStart: Date,
    expiredEnd: Date,
  },
  discount: {
    percent: Number,
    amount: Number,
    delivery: Boolean
  }
}, {
  timestamps: {
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  }
})

// Exports
module.exports = mongoose.model('Discount', discountSchema);