//
// ─── IMPORT ─────────────────────────────────────────────────────────────────────
//

import express from 'express'
import isEmpty from 'lodash.isempty'
import msg from '../responseMsg'

// * Declear Bucket Enviroment
if (process.env.NODE_ENV == 'production') {
  var bucketEnv = 'prod'
} else {
  var bucketEnv = 'dev'
}

// * Import Model
import {
  getListBuckets,
  createBucket,
  uploadImage,
} from './upload.func'

import { updateModel } from '../model.func'

// * Declear Varaible
const router = express.Router()

//
// ─── ROUTER ─────────────────────────────────────────────────────────────────────
//

// ? Default
router.get('/', (req, res) => {
  return res.json(msg.isSuccess('upload atm api', null))
})

// ? Upload Payment Image
router.post('/', async (req, res) => {
  /**
   * @param req.files image upload data
   */

  // ! VALIDATE

  // check image upload data is empty
  if (isEmpty(req.files) || !req.files)
    return res.status(404).json(msg.isEmpty('', 'payload is empty.'))

  // ! UPLOAD

  async function uploadAtm(imageData, userData, req, objectId) {
    /**
     * @param imageData fileData from frontend
     * @param userData data from passport session in req
     * @param req request from router
     * @param objectId useful to find or update item
     */

    // * check imageData
    if (!imageData || isEmpty(imageData))
      return res
        .status(404)
        .json(msg.isEmpty('', 'imageData is empty'))

    // * check UserData
    if (!userData || !userData.passport || isEmpty(userData.passport))
      return res
        .status(404)
        .json(msg.isEmpty('', 'UserData is empty'))

    // * get list of buckets
    let listBuckets = await getListBuckets().then((buckets) => {
      return buckets.map((bucket) => bucket.name)
    })

    // * create bucket if 'sn-curtain-payment' is empty
    if (listBuckets.indexOf(`sn-curtain-${bucketEnv}-payment`) < 0) {
      // * create bucket
      const name = `sn-curtain-${bucketEnv}-payment`
      const option = {
        location: 'ASIA',
        storageClass: 'COLDLINE',
      }
      await createBucket(name, option)
    }

    // * upload payment image
    const bucketName = `sn-curtain-${bucketEnv}-payment`
    const filename = imageData
    const option = {
      gzip: true,
      metadata: {
        contentType: imageData.mimetype,
        // cacheControl: 'public, max-age=31536000',
      },
    }
    const uploadImageResult = await uploadImage(
      bucketName,
      filename,
      option,
      userData,
      objectId,
    )

    // * update payment order
    const updateOrderObject = {
      query: {
        _id: objectId,
      },
      data: {
        order_image: uploadImageResult,
        order_status: 'evidence',
      },
      option: {
        new: true,
      },
      document: 'Order',
    }

    const updateModelResult = await updateModel(updateOrderObject)

    return [uploadImageResult, updateModelResult]
  }

  // ! Call
  const uploadAtmResult = await uploadAtm(
    req.files.image,
    req.session,
    req,
    req.body.objectId,
  ).then((result) => result)

  res.status(201).json(msg.isCreated(uploadAtmResult, null))
})

//
// ─── EXPORT ─────────────────────────────────────────────────────────────────────
//

module.exports = router
