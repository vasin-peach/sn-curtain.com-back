import OrderModel from '../../../models/Order';
// import isEmpty from 'lodash/isempty';

const Order = {
  async createOrder(data) {

    try {
      const response = await OrderModel.create(data);
      return Promise.resolve(response);

    } catch (error) {
      return Promise.reject(error);
    }

  }
}

module.exports = Order;