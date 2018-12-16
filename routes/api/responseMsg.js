module.exports = {
  badRequest: (data = null, err = null) => {
    return {
      status: 400,
      message: 'the request is invalid.',
      err: err,
      data: data
    }
  },
  unAccess: (data = null, err = null) => {
    return {
      status: 403,
      message: 'forbidden, invalid access level.',
      err: err,
      data: data
    }
  },
  unAuth: (data = null, err = null) => {
    return {
      status: 400,
      message: 'bad request, not auth.',
      err: err,
      data: data
    }
  },
  isNumber: (data = null, err = null) => {
    return {
      status: 400,
      message: 'page argument must be number value.',
      err: err,
      data: data
    }
  },
  isEmpty: (data, err) => {
    return {
      status: 404,
      message: 'response is empty',
      err: err,
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
  },
  isExist: (data, err) => {
    return {
      status: 409,
      message: 'already exist',
      err: err,
      data: data
    }
  },
  isCreated: (data, err) => {
    return {
      status: 301,
      message: 'created success.',
      err: err,
      data: data
    }
  }
}