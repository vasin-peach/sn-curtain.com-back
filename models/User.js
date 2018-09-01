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
    type: String
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
    type: String
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