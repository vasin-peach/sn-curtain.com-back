//
// ─── IMPORT ─────────────────────────────────────────────────────────────────────
//

import express from "express";
import isEmpty from "lodash.isempty";
import msg from "../responseMsg";

// * Import Model
import {
  createBucket
} from './upload.func';

// * Declear Varaible
const router = express.Router();


//
// ─── ROUTER ─────────────────────────────────────────────────────────────────────
//

// ? Default
router.get("/", (req, res) => {
  return res.json(msg.isSuccess("upload atm api", null));
});

// ? Upload Payment Image
router.post("/", async (req, res) => {

  /**
   * @param req.files image upload data
   */

  // ! VALIDATE

  // check image upload data is empty
  if (isEmpty(req.files) || !req.files)
    return res.status(404).json(msg.isEmpty("", "payload is empty."));

  // ! UPLOAD

  req.send(req.files);

  async function uploadPayment(imageData, userData, req) {
    /**
     * @param imageData fileData from frontend
     * @param userData data from passport session in req
     * @param req request from router
     */

    // * check imageData
    if (!imageData || isEmpty(imageData))
      return res.status(404).json(msg.isEmpty("", "imageData is empty"));

    // * check UserData
    if (!userData || !userData.passport || isEmpty(userData.passport))
      return res.status(404).json(msg.isEmpty("", "UserData is empty"));

    // * get list of buckets
    let listBuckets = await getListBuckets().then(buckets => {
      return buckets.map(bucket => bucket.name);
    });

    // create bucket if 'sn-curtain-profile' is empty
    if (listBuckets.indexOf("sn-curtain-profile") < 0) {

      // create bucket
      const name = "sn-curtain-payment";
      const option = {
        location: "ASIA",
        storageClass: "COLDLINE"
      };

      // ! call
      await createBucket(name, option);

    }

    // * upload payment image
    const bucketName = 'sn-curtain-payment';
    const filename = imageData;
    const option = {
      gzip: true,
      metadata: {
        contentType: imageData.mimetype
        // cacheControl: 'public, max-age=31536000',
      }
    };

    // ! call
    const uploadImageResult = await uploadImage(
      bucketName,
      filename,
      option,
      userData
    );

    // * update payment order
    const updateProfileObject = {
      query: {
        _id: userData.passport.user._id
      },
      data: {
        photo: uploadImageResult
      },
      option: {
        new: true
      }
    }
  }
});

//
// ─── EXPORT ─────────────────────────────────────────────────────────────────────
//

module.exports = router;