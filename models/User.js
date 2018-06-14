const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
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
  username: {
    type: String,
  },
  password: {
    type: String
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