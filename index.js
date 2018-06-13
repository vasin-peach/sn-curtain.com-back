const express = require("express");
const app = express();
const Raven = require("raven");

// Import GraphQL
import graphqlHTTP from "express-graphql";
import { buildSchema } from "graphql";

var schema = buildSchema(`
  type Query {
    quoteOfTheDay: String
    random: Float!
    rollDice(numDice: Int!, numSides: Int): [Int]
  }
`);

var root = {
  rollDice: function({ numDice, numSides }) {
    var output = [];
    for (var i = 0; i < numDice; i++) {
      output.push(1 + Math.floor(Math.random() * (numSides || 6)));
    }
    return output;
  }
};

app.use(
  "/graphql",
  graphqlHTTP({
    schema: schema,
    rootValue: root,
    graphiql: true
  })
);

if (
  process.env.NODE_ENV === "developing" ||
  process.env.NODE_ENV === "staging"
) {
  Raven.config(
    "https://00f59a7dc7f64065a422e74a084c6747@sentry.io/1224068"
  ).install();
} else if (process.env.NODE_ENV === "production") {
  Raven.config(
    "https://9f6754c25e0a468bbe2e62817d5fa986@sentry.io/1224084"
  ).install();
}

// // The request handler must be the first middleware on the app
// app.use(Raven.requestHandler());

// // The error handler must be before any other error middleware
// app.use(Raven.errorHandler());

app.listen(5000, function() {
  console.log("Express app listening on port 5000");
});
