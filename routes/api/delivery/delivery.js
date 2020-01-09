const express = require('express')
const _ = require('lodash')
const router = express.Router()
const msg = require('../responseMsg')
const keys = require('../../../config/keys')

// Model
const Delivery = require('../../../models/Delivery')
import { authPermission } from '../auth/auth.func'

///
// Route
///

// get all delivery
router.get('/', (req, res) => {
  Delivery.find({}, (err, data) => {
    if (err) return res.status(400).json(msg.isfail(data, err))
    else res.status(200).json(msg.isSuccess(data, err))
  })
})

router.post('/create', async (req, res) => {
  // must be admin

  // ! Validate
  const authPermissionLevel = await authPermission(req).then(
    (result) => result,
    (err) => [true, err],
  )
  if (authPermissionLevel[0])
    return res
      .status(400)
      .json(msg.badRequest(null, authPermissionLevel[1]))
  if (authPermissionLevel <= 2)
    return res.status(401).json(msg.unAccess('invalid access level'))
  if (_.isEmpty(req.body.payload))
    return res.status(400).json(msg.badRequest())

  var payload = req.body.payload
  Delivery.create(payload, (err, data) => {
    if (err) return res.status(400).json(msg.isfail(data, err))
    else {
      return res.status(201).json({
        status: 201,
        message: 'delivery created!',
        err: err,
        data: data,
      })
    }
  })
})

module.exports = router
