import express from 'express';
import msg from '../responseMsg';
import _ from 'lodash';

// DECLEAR VARIABLE
const router = express.Router();

// ROUTE

// welcome get
router.get('/', (req, res) => {
  return res.status(200).json(msg.isSuccess('Session Cookie Api. Healty!', null));
});

// welcome post
router.post('/', (req, res) => {
  return res.status(200).json(msg.isSuccess('Session Cookie Api. Healty!', null));
});

// get basket
router.get('/get', (req, res) => {
  return res.status(200).json(msg.isSuccess(req.session.basket));
});

// create basket
router.post('/update', (req, res) => {
  const payload = req.body
  if (_.isEmpty(payload)) return res.status(400).json(msg.badRequest(null, null));
  req.session.basket = payload;
  return res.status(200).json(msg.isSuccess(req.session.basket, null));
});

// EXPORT
module.exports = router;