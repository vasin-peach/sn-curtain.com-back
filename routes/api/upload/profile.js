import express from "express";
import isEmpty from "lodash.isempty";
import msg from "../responseMsg";

// * Import Model
import User from "../../../models/User";
import {
  getListBuckets,
  createBucket,
  uploadImage
} from './upload.func';

// * Declear Variable
const router = express.Router();

//
// ─── ROUTER ─────────────────────────────────────────────────────────────────────
//

// ? Default
router.get("/", (req, res) => {
  return res.json(msg.isSuccess("upload profile api", null));
});

// ? Upload Profile Image
router.post("/", (req, res) => {

  /**
   * @param req.files image upload data
   */


  // ! VALIDATE

  // check image upload data is empty
  if (isEmpty(req.files) || !req.files) return res.status(404).json(msg.isEmpty('', 'payload is empty.'));

  // check image type
  const type = ["image/gif", "image/jpeg", "image/png"].indexOf(
    req.files.image.mimetype
  );
  if (type < 0) return res.status(400).json(msg.isfail('', 'wrong image type.'));

  // check image size
  if (req.files.image.truncated) return res.status(400).json(msg.isfail('', 'wrong image size.'));


  // ! UPLOAD

  async function uploadProfile(imageData) {

    /**
     * @param imageData fileData from frontend
     */

    // check imageData
    if (!imageData || isEmpty(imageData)) return res.status(404).json(msg.isEmpty('', 'imageData is empty'));

    // * get list of buckets
    let listBuckets = await getListBuckets().then(buckets => {
      return buckets.map(bucket => bucket.name);
    });

    // create bucket if 'sn-curtain-profile' is empty
    if (listBuckets.indexOf('sn-curtain-profile') < 0) {

      // * create bucket
      const name = 'sn-curtain-profile';
      const option = {
        location: 'ASIA',
        storageClass: 'COLDLINE'
      }
      await createBucket(name, option);

    }

    // * upload image
    const bucketName = 'sn-curtain-profile';
    const filename = imageData;
    const option = {
      gzip: true,
      metadata: {
        contentType: imageData.mimetype
        // cacheControl: 'public, max-age=31536000',
      }
    }

    uploadImage(bucketName, filename, option).then(result => {
      console.log(result)
    }, err => {
      console.log(err);
    })


  }

  // call function upload
  uploadProfile(req.files.image);

  res.send(req.files);



})

//
// ─── EXPORT ─────────────────────────────────────────────────────────────────────
//

module.exports = router;