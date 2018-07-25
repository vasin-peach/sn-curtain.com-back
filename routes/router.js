const express = require("express");
const router = express.Router();

const AuthRoute = require("./api/auth");

// Default route
router.get("/", function (req, res) {
  res.status(200).json({
    status: 200,
    message: 'Healty!.'
  })
})

module.exports = router;