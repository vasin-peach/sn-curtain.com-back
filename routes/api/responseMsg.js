module.exports = {
  badRequest: () => {
    return {
      status: 400,
      message: 'failed',
      err: 'the request is invalid.',
      data: null
    }
  },
  isNumber: (data = null, err = null) => {
    return {
      status: 400,
      message: 'failed',
      err: 'page argument must be number value.',
      data: data
    }
  },
  isEmpty: (data, err) => {
    return {
      status: 404,
      message: 'success',
      err: 'response is empty.',
      data: data
    }
  },
  isSuccess: (data, err) => {
    return {
      status: 200,
      message: 'success',
      err: err,
      data: data
    }
  },
  isfail: (data, err) => {
    return {
      status: 400,
      message: 'failed',
      err: err,
      data: data
    }
  }
}