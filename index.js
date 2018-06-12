const express = require("express");
const app = express();

// listen on port 5000
app.listen(5000, function () {
  console.log("Express app listening on port 5000");
  console.log(process.env);
});