//
// ─── IMPORT ─────────────────────────────────────────────────────────────────────
//

import isEmpty from 'lodash.isempty';
import Delivery from '../../../models/Delivery';

//
// ─── FUNCTION ───────────────────────────────────────────────────────────────────
//

const weightFunction = {
  async getWeightPrice(weight) {

    /**
     * @param weight NUMBER - delivery weight
     */


    return new Promise((resolve, reject) => {

      if (!weight) return reject('param is empty');

      if (weight <= 20) return resolve(32);
      else if (weight > 20 && weight <= 100) return resolve(37);
      else if (weight > 100 && weight <= 250) return resolve(42);
      else if (weight > 250 && weight <= 500) return resolve(52);
      else if (weight > 500 && weight <= 1000) return resolve(70);
      else if (weight > 1000 && weight <= 1500) return resolve(82);
      else if (weight > 1500 && weight <= 2000) return resolve(100);
      else if (weight > 2000 && weight <= 2500) return resolve(122);
      else if (weight > 2500 && weight <= 3000) return resolve(137);
      else if (weight > 3000) return resolve(137 + Math.ceil((weight - 3000) / 500) * 20);
      else return reject('bad weight.');
    })
  }
}

module.exports = weightFunction