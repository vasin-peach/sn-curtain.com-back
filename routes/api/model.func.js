//
// ─── IMPORT ─────────────────────────────────────────────────────────────────────
//

import isEmpty from 'lodash.isempty';
import Bill from '../../models/Bill';
import Discount from '../../models/Discount';
import Order from '../../models/Order';
import Product from '../../models/Product';
import User from '../../models/User';

//
// ─── FUNCTION ───────────────────────────────────────────────────────────────────
//

const modelFunction = {

  async updateModel(data) {

    /**
     * @param data OBJECT - {
     *  query: OBJECT - query to find ex. {target: find value}
     *  data: OBJECT - data to update ex. {target: update value}
     *  option: OBJECT - optional this a option to config when update ex. {new: true}
     *  document: STRING - document to update
     * }
     */

    return new Promise((resolve, reject) => {

      // ! Validate

      if (!data || isEmpty(data)) return reject('bad param, object `data` is empty.');
      if (!data.query || isEmpty(data.query)) return reject('bad param, object `data.query` is empty.');
      if (!data.data || isEmpty(data.data)) return reject('bad param, object `data.data` is empty.');
      if (!data.document) return reject('bad param, string `data.document` is empty.');

      // ! Query

      // query by document param switch case
      switch (data.document) {
        case 'Bill':
          Bill.findOneAndUpdate(data.query, {
            $set: data.data
          }, data.option || null, (err, result) => {
            if (err) return reject(err);
            else return resolve(result);
          });
          break;
        case 'Discount':
          Discount.findOneAndUpdate(data.query, {
            $set: data.data
          }, data.option || null, (err, result) => {
            if (err) return reject(err);
            else return resolve(result);
          });
          break;
        case 'Order':
          Order.findOneAndUpdate(data.query, {
            $set: data.data
          }, data.option || null, (err, result) => {
            if (err) return reject(err);
            else return resolve(result);
          });
          break;
        case 'Product':
          Product.findOneAndUpdate(data.query, {
            $set: data.data
          }, data.option || null, (err, result) => {
            if (err) return reject(err);
            else return resolve(result);
          });
          break;
        case 'User':
          User.findOneAndUpdate(data.query, {
            $set: data.data
          }, data.option || null, (err, result) => {
            if (err) return reject(err);
            else return resolve(result);
          });
          break;
      }
    })
  }
}

//
// ─── EXPORT ─────────────────────────────────────────────────────────────────────
//

module.exports = modelFunction