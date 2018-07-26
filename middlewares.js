import {
  verifyJWTToken
} from './libs/auth'

export function verfiyJWT_MW(req, res, next) {
  let token = (req.method === 'POST') ? req.body.token : req.query.token

  verifyJWTToken(token).then((decoddedToken) => {
      req.user = decodedToken.data
      next()
    })
    .catch((err) => {
      res.status(400).json({
        status: 400,
        message: "Invalid auth token provided."
      });
    })
}