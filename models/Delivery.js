const mongoose = require('mongoose');
const {
  Schema
} = mongoose;
const keys = require('../config/keys');


// Schema
const deliverySchema = new Schema({
  text: {
    type: String
  },
  value: {
    type: Number
  }
})

// Exports
module.exports = mongoose.model('Delivery', deliverySchema)