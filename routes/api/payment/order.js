import OrderModel from '../../../models/Order';
// import isEmpty from 'lodash/isempty';

const Order = {
  async createOrder(data) {

    try {
      const response = OrderModel.create(data);
      console.log(response);

    } catch (error) {
      console.log(error);
    }

  }
}

module.exports = Order;