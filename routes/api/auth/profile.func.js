//
// ─── IMPORT ─────────────────────────────────────────────────────────────────────
//

import isEmpty from 'lodash.isempty';
import User from '../../../models/User';

//
// ─── FUNCTION ───────────────────────────────────────────────────────────────────
//

const profileFunction = {
  async updateProfile(data) {

    /**
     * @param data OBJECT {
     *  // query to find object in mongodb
     *  query: OBJECT
     *  // data to update
     *  data: OBJECT
     *  // config query - optional
     *  option: OBJECT
     * }  
     */

    return new Promise((resolve, reject) => {

      // check param
      if (!data || isEmpty(data)) return reject('data is empty.');

      // query model
      User.findOneAndUpdate(data.query, {
        $set: data.data
      }, data.option || null, (err, result) => {
        if (err) return reject(err);
        else return resolve(result);
      });

    });
  }
}

module.exports = profileFunction