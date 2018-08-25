import express from 'express';
import localRouter from './local';

///
// Variable
///
const router = express.Router();

///
// Route
///

// Default
router.get("/", (req, res) => {
  return res.json(msg.isSuccess(null, 'Auth api.'));
})
router.post("/", (req, res) => {
  return res.json(msg.isSuccess(null, 'Auth api.'));
})

// local
router.use('/local', localRouter);






module.exports = router;