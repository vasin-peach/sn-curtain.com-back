const mongoose = require('mongoose');
const bcrypt = require('bcrypt-nodejs');
const {
  Schema
} = mongoose;

const userSchema = new Schema({
  uid: {
    type: String
  },
  name: {
    display_name: String,
    first_name: String,
    last_name: String
  },
  email: {
    type: String,
  },
  password: {
    type: String
  },
  provider: {
    type: String
  },
  address: {
    house_no: String,
    village_no: String,
    amphoe: String,
    district: String,
    road: String,
    province: String,
    zip: String
  },
  permission: {
    name: String,
    value: Number
  },
  gender: {
    type: String
  },
  photo: {
    type: String
  },
  tel: {
    type: String
  },
  birthday: {
    type: Date
  },
  date: {
    type: Date,
    default: Date.now
  },
}, {
  timestamps: {
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  }
})



// Use to generate encrypted password
userSchema.methods.generateHash = (password) => {
  return bcrypt.compareSync(password, this.password);
}

// Compare correct password or not
userSchema.methods.validPassword = (password) => {
  return bcrypt.compareSync(password, this.password);
};

module.exports = mongoose.model('Users', userSchema);