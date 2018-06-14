// Import
import express from 'express';
import Raven from 'raven';
import mongoose from 'mongoose';
import graphqlHTTP from "express-graphql";
import {
  buildSchema
} from "graphql";
import {
  WSAEUSERS
} from 'constants';

const app = express();
const keys = require('./config/keys');

// Initialize Sentry.io
if (process.env.NODE_ENV === "production") {
  Raven.config(
    "https://9f6754c25e0a468bbe2e62817d5fa986@sentry.io/1224084"
  ).install();
} else if (process.env.NODE_ENV === "staging") {
  Raven.config(
    "https://00f59a7dc7f64065a422e74a084c6747@sentry.io/1224068"
  ).install();
}



// Declare MongoURI
var mongoURI = process.env.NODE_ENV === 'production' ?
  `mongodb://${keys.mongoUser}:${keys.mongoPass}@${keys.mongoURI}/sn-curtain` :
  `mongodb://${keys.mongoURI}/sn-curtain`

console.log(process.env.NODE_ENV || 'WTF NODE_ENV NOT FOUND');
console.log(mongoURI);


// Initialize Mongoose
mongoose.Promise = global.Promise;
mongoose.connect(mongoURI)
  .then(() => {
    // Start server at port 5000
    app.listen(5000, function () {
      console.log("Express app listening on port 5000 [" + process.env.NODE_ENV + "]");
    });
  })
  .catch((err) => {
    // Return error and exit(1)
    Raven.captureException(err)
    console.error('App starting error:', err.stack);
    process.exit(1);
  })

// Require MongoDB Models
const User = require('./models/User');

User.create({
  name: 'vasin sermsampan',
  username: 'peaches',
  password: 'password'
}, (err, data) => {
  console.log(err || data);
})