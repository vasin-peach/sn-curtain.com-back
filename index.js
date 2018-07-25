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



// Connect to mongodb
mongoose.connect(mongoURI, {
  autoReconnect: true,
  reconnectTries: Number.MAX_VALUE,
  reconnectTries: 1000,
});
const db = mongoose.connection;
db.on('reconnect', function () {
  emit('reconnect');
})
db.on('connecting', function () {
  console.log("\x1b[34m", '\n[INFO] Try connecting to MongoDB... \n');
});
db.once('open', function () {
  console.log("\x1b[32m", '\n[INFO] Connected to database \n');
})
db.on('error', function (err) {
  console.error("\x1b[31m", '\n[ERROR] Failed to connect to database \n');
  mongoose.disconnect();
});
db.on('reconnected', function () {
  console.log("\x1b[35m", '\n[INFO] MongoDB reconnected! \n');
});
db.on('disconnected', function () {
  console.log("\x1b[35m", '\n[INFO] MongoDB disconnected! \n');
  mongoose.connect(mongoURI, {
    autoReconnect: true,
    reconnectInterval: 36000
  });
});


// Include routes
const routes = require("./routes/router");
app.use("/", routes);


// // Initialize Mongoose
// mongoose.Promise = global.Promise;
// mongoose.connect(mongoURI)
//   .then(() => {
//     // Start server at port 5000
//     app.listen(5000, function () {
//       console.log("Express app listening on port 5000 [" + process.env.NODE_ENV + "]");
//     });
//   })
//   .catch((err) => {
//     // Return error and exit(1)
//     Raven.captureException(err)
//     console.error('App starting error:', err.stack);
//     router.get("/", function (req, res) {
//       res.status(403).json({
//         status: 403,
//         message: 'Forbidden',
//         error: "Can not connect to database."
//       })
//     })

//     // process.exit(1);
//   })

// // Require MongoDB Models
// const User = require('./models/User');

// User.create({
//   name: 'vasin sermsampan',
//   username: 'peaches',
//   password: 'password'
// }, (err, data) => {
//   console.log(err || data);
// })