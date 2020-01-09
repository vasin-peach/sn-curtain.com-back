//
// ─── IMPORT ─────────────────────────────────────────────────────────────────────
//

import express from 'express'
import msg from './responseMsg'
import isEmpty from 'lodash.isempty'
import { authPermission } from './auth/auth.func'

// * Declear Variable
const router = express.Router()

//
// ─── ROUTE ──────────────────────────────────────────────────────────────────────
//

// * Get current permission level
router.get('/', (req, res) => {
  // ! Call Func
  const callResult = authPermission(req).then(
    (result) => {
      return res.status(200).json(msg.isSuccess(result, null))
    },
    (error) => {
      return res.status(400).json(msg.isfail(null, error))
    },
  )
})

//
// ─── EXPORT ─────────────────────────────────────────────────────────────────────
//

module.exports = router
