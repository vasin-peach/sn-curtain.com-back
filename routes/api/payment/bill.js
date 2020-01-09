import BillModel from '../../../models/Bill'

const Bill = {
  async createBill(data) {
    try {
      const response = await BillModel.create(data)
      return Promise.resolve(response)
    } catch (error) {
      return Promise.reject(error)
    }
  },
}

module.exports = Bill
