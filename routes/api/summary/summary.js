import express from 'express'
import msg from '../responseMsg'
import sumUser from './sumUser'
import sumSale from './sumSale'

// * Declear Variable
const router = express.Router()

//
// ─── ROUTER ─────────────────────────────────────────────────────────────────────
//

// ? Default
router.get('/', (req, res) => {
  return res.json(msg.isSuccess('summary api', null))
})

//
// ─── EXPORT ───────────────────────────────────────────────────────────────────────
//

router.use('/user', sumUser)
router.use('/sale', sumSale)

module.exports = router
