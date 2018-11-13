import express from "express";
import isEmpty from "lodash.isempty";
import msg from "../responseMsg";
import passport from "passport";

// * Import Model
import {
  getListBuckets,
  createBucket,
  uploadImage
} from "./upload.func";
import {
  updateProfile
} from "../auth/profile.func";

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
router.post("/", async (req, res) => {
  /**
   * @param req.files image upload data
   */

  // ! VALIDATE

  // check image upload data is empty
  if (isEmpty(req.files) || !req.files)
    return res.status(404).json(msg.isEmpty("", "payload is empty."));

  // check image type
  const type = ["image/gif", "image/jpeg", "image/png"].indexOf(
    req.files.image.mimetype
  );
  if (type < 0)
    return res.status(400).json(msg.isfail("", "wrong image type."));

  // check image size
  if (req.files.image.truncated)
    return res.status(400).json(msg.isfail("", "wrong image size."));

  // ! UPLOAD

  async function uploadProfile(imageData, userData, req) {
    /**
     * @param imageData fileData from frontend
     * @param userData data from passport session in req
     * @param req request from router
     */

    // check imageData
    if (!imageData || isEmpty(imageData))
      return res.status(404).json(msg.isEmpty("", "imageData is empty"));

    // check UserData
    if (!userData || !userData.passport || isEmpty(userData.passport))
      return res.status(404).json(msg.isEmpty("", "UserData is empty"));

    // * get list of buckets
    let listBuckets = await getListBuckets().then(buckets => {
      return buckets.map(bucket => bucket.name);
    });

    // create bucket if 'sn-curtain-profile' is empty
    if (listBuckets.indexOf("sn-curtain-profile") < 0) {

      // * create bucket
      const name = "sn-curtain-profile";
      const option = {
        location: "ASIA",
        storageClass: "COLDLINE"
      };

      // ! call
      await createBucket(name, option);

    }

    // * upload profile image
    const bucketName = "sn-curtain-profile";
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

    // * update profile data
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
    };

    // ! call
    const updateProfileResult = await updateProfile(updateProfileObject);

    // * callback
    return [uploadImageResult, updateProfileResult];
  }

  // * call function uploadprofile
  let uploadProfileResult = await uploadProfile(req.files.image, req.session, req).then(result => {
    return result;
  });

  req.session.passport.user.photo = uploadProfileResult[0];

  res.send(req.files);
});

//
// ─── EXPORT ─────────────────────────────────────────────────────────────────────
//

module.exports = router;