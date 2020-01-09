//
// ─── IMPORT ─────────────────────────────────────────────────────────────────────
//

import express from 'express'
import msg from '../responseMsg'
import { getWeightPrice } from './weight.func'

//
// ─── INIT ───────────────────────────────────────────────────────────────────────
//

const router = express.Router()

//
// ─── ROUTE ──────────────────────────────────────────────────────────────────────
//

// ? Default
router.get('/', (req, res) => {
  return res.status(200).json(msg.isSuccess('weight api', ''))
})

// ? Get price by weight
router.get('/:weight', (req, res) => {
  /**
   * @param req.param param from url
   */

  // ! Validate
  if (!req.params.weight)
    res.status(404).json(msg.isEmpty('', 'payload is empty'))

  // ! Call
  getWeightPrice(req.params.weight).then(
    (result) => {
      return res.status(200).json(msg.isSuccess(result, ''))
    },
    (err) => {
      return res.status(400).json(msg.badRequest('', err))
    },
  )
})

module.exports = router
