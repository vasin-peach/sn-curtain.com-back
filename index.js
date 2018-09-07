// Import
import express from "express";
import Raven from "raven";
import helmet from "helmet";
import bodyParser from "body-parser";
import cors from "cors";
import mongoose from "mongoose";
import session from "express-session";
import cookieParser from "cookie-parser";
import passport from "passport";
import mongoSanitize from 'express-mongo-sanitize';
import cookieSession from 'cookie-session';
import csrf from "csurf";
// import _ from 'lodash';
// import jwtDecode from 'jwt-decode';


const app = express();
const keys = require("./config/keys");
const middleware = require('./middlewares');

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
if (process.env.NODE_ENV != "developing") {
  // Raven for sentry
  app.use(Raven.requestHandler());
  app.use(Raven.errorHandler());
  app.use(function onError(err, req, res, next) {
    // The error id is attached to `res.sentry` to be returned
    // and optionally displayed to the user for support.
    res.statusCode = 500;
    res.end(res.sentry + "\n");
  });
}

///
// Use Cookie session
///
app.use(cookieSession({
  name: 'session',
  keys: ['keys.COOKIE_SECRET'],
  maxAge: 24 * 60 * 60 * 1000 // 24 hours
}))

// Use helmet for addional security
app.use(helmet());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}))
// Cors
app.use(
  cors({
    credentials: true,
    origin: true
  })
);
// cookie-parser
app.use(cookieParser());


// Init passport
app.use(
  session({
    secret: keys.SESSION_SECRET,
    resave: true,
    saveUninitialized: true
  })
);
app.use(passport.initialize());
app.use(passport.session());
app.use(mongoSanitize({
  replaceWith: '_'
}))


// Init CSRF
// app.use(csrf());
// app.use(middlewareCSRF);


// Declare MongoURI
const mongoURI =
  process.env.NODE_ENV === "production" || process.env.NODE_ENV === "staging" ?
  `mongodb://${keys.MONGO_USER}:${keys.MONGO_PASS}@${
        keys.MONGO_URI
      }/sn-curtain` :
  `mongodb://${keys.MONGO_URI}/sn-curtain`;


// Listen app with port 5000
app.listen(5000, function () {
  console.log(
    "Express app listening on port 5000 [" + process.env.NODE_ENV + "]"
  );
});


// Connect to mongoDB
const db = mongoose.connection;
db.on("open", () =>
  console.log("\x1b[32m", "\n[INFO] Connection Open - ready to connect.")
);
db.on("error", function (error) {
  console.error(
    "\x1b[31m",
    "\n[ERROR] Failed to connect to MongoDB - retrying in 30 sec",
    "\x1b[37m\n",
    error
  );
  mongoose.disconnect();
});
db.on("disconnected", () => {
  console.log("\x1b[36m", "\n[INFO] Mongodb disconnected", "\x1b[37m");
  setTimeout(() => {
    mongoose.connect(
      mongoURI, {
        auto_reconnect: true
      }
    );
  }, 30000);
});
db.on("connected", () =>
  console.log("\x1b[32m", "\n[INFO] Mongodb connected.")
);
mongoose.connect(
  mongoURI, {
    auto_reconnect: true
  }
);

// Include routes
const routes = require("./routes/router");
app.use("/", routes);