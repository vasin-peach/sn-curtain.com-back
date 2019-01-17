import OrderModel from '../../../models/Order';
import ProductModel from '../../../models/Product';
// import isEmpty from 'lodash/isempty';

const Order = {
  async createOrder(data) {

    try {
      const response = await OrderModel.create(data);
      const arrayofProduct = data.product.map(x => x.product_id);
      const update = await ProductModel.update({
        _id: {
          $in: arrayofProduct
        }
      }, {
        $inc: {
          buy: 1
        }
      }, {
        multi: true,
        new: true
      });
      return Promise.resolve(response);

    } catch (error) {
      return Promise.reject(error);
    }

  }
}

module.exports = Order;