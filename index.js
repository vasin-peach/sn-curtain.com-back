const express = require("express");
const app = express();
const Raven = require('raven');

if (process.env.NODE_ENV === 'developing' || process.env.NODE_ENV === 'staging') {
  Raven.config('https://00f59a7dc7f64065a422e74a084c6747@sentry.io/1224068').install();
} else if (process.env.NODE_ENV === 'production') {
  Raven.config('https://9f6754c25e0a468bbe2e62817d5fa986@sentry.io/1224084').install();
}

// The request handler must be the first middleware on the app
app.use(Raven.requestHandler());

// test
app.get('/', function mainHandler(req, res) {
  throw new Error('Broke!');
});

// The error handler must be before any other error middleware
app.use(Raven.errorHandler());

// Optional fallthrough error handler
app.use(function onError(err, req, res, next) {
  // The error id is attached to `res.sentry` to be returned
  // and optionally displayed to the user for support.
  res.statusCode = 500;
  res.end(res.sentry + '\n');
});

// listen on port 5000
app.listen(5000, function () {
  console.log("Express app listening on port 5000");
});