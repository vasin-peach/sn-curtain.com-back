const express = require("express");
const app = express();
const Raven = require('raven');

if (process.env.NODE_ENV == 'production') {
  Raven.config('https://ad54e369837b4311828b729541f044dd@sentry.io/1224038').install();
} else {
  Raven.config('https://c4abd30fb7374b0081bef526fb9517fd@sentry.io/1224030').install();
}

// The request handler must be the first middleware on the app
app.use(Raven.requestHandler());



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