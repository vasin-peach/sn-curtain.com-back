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
    display_name: {
      type: String
    },
    first_name: {
      type: String
    },
    last_name: {
      type: String
    }
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
    house_no: {
      type: String
    },
    village_no: {
      type: String
    },
    amphoe: {
      type: String
    },
    district: {
      type: String
    },
    road: {
      type: String
    },
    province: {
      type: String
    },
    zip: {
      type: String
    },
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