//
// ─── IMPORT ─────────────────────────────────────────────────────────────────────
//

import isEmpty from 'lodash.isempty'
import User from '../../../models/User'

//
// ─── FUNCTION ───────────────────────────────────────────────────────────────────
//

const authFunction = {
  async authPermission(req) {
    /**
     * @param req object from router
     */

    return new Promise(async (resolve, reject) => {
      // ! Validate
      if (!req.session.passport || isEmpty(req.session.passport))
        return reject('bad param, `session.passport` is empty.')
      if (
        !req.session.passport.user ||
        isEmpty(req.session.passport.user)
      )
        return reject('bad param, `session.passport.user` is empty.')
      if (
        !req.session.passport.user ||
        isEmpty(req.session.passport.user.email)
      )
        return reject('bad param, `email` is empty.')

      // ! Get user email
      const email = req.session.passport.user.email

      // ! Query data by email
      const queryResult = await User.findOne(
        {
          email: email,
        },
        (err, result) => {
          if (err) return err
          else return result
        },
      )

      // ! Return
      if (queryResult) return resolve(queryResult.permission.value)
      else reject('not found')
    })
  },
}

//
// ─── EXPORT ─────────────────────────────────────────────────────────────────────
//

module.exports = authFunction
