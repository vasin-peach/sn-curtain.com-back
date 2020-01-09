//
// ─── IMPORT ─────────────────────────────────────────────────────────────────────
//

import isEmpty from 'lodash.isempty'

//
// ─── FUNCTION ───────────────────────────────────────────────────────────────────
//

const sessionFunction = {
  getSession(req, target) {
    /**
     * @param req req param from router
     * @target target target to retrieve
     */

    return new Promise((resolve, reject) => {
      // ! Validate

      if (!req || isEmpty(req))
        return reject('bad param, req is empty.')
      if (!target) return reject('bad param, target is empty.')

      // ! Retrieve

      try {
        return resolve(req.session[target])
      } catch (err) {
        return reject(
          'something wrong, cannot retrieve data. \n' + err,
        )
      }
    })
  },
  updateSession(req, data, target) {
    /**
     * @param req req param from router
     * @param data data to update
     * @param target target to update
     */

    return new Promise((resolve, reject) => {
      // ! Validate

      if (!req || isEmpty(req))
        return reject('bad param, req is empty.')
      else if (!data || isEmpty(data))
        return reject('bad param, data is empty.')
      else if (!target) return reject('bad param, target is empty.')

      // ! Update Session

      try {
        req.session[target] = data
        return resolve(req.session[target])
      } catch (err) {
        return reject(
          'something wrong, cannot set data to session. \n' + err,
        )
      }
    })
  },
}

module.exports = sessionFunction
