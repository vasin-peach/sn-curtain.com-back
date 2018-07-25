// Import
import express from 'express';
import Raven from 'raven';
import mongoose from 'mongoose';
import graphqlHTTP from "express-graphql";
import {
  buildSchema
} from "graphql";
import {
  emit
} from 'cluster';
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
const mongoURI = process.env.NODE_ENV === 'production' || process.env.NODE_ENV === 'staging' ?
  `mongodb://${keys.MONGO_USER}:${keys.MONGO_PASS}@${keys.MONGO_URI}/sn-curtain` :
  `mongodb://${keys.MONGO_URI}/sn-curtain`

// Listen app with port 5000
app.listen(5000, function () {
  console.log("Express app listening on port 5000 [" + process.env.NODE_ENV + "]");
});

// Connect to mongoDB
const db = mongoose.connection;
db.once('open', () => console.log("\x1b[32m", '\n[INFO] Mongodb connected.'));
db.on('error', function (error) {
  console.error("\x1b[31m", '\n[ERROR] Failed to connect to MongoDB - retrying in 5 sec \n', "\x1b[37m\n", error);
  setTimeout(() => {
    mongoose.disconnect();
  }, 5000);
});
db.on('disconnected', () => {
  console.log("\x1b[36m", "\n[INFO] Mongodb disconnected", "\x1b[37m");
  mongoose.connect(mongoURI, {
    auto_reconnect: true
  });
})
mongoose.connect(mongoURI, {
  auto_reconnect: true
});


// Include routes
const routes = require("./routes/router");
app.use("/", routes);