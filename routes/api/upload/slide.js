import express from "express";
import isEmpty from "lodash.isempty";
import msg from "../responseMsg";
import {
  authPermission
} from '../auth/auth.func';
import {
  getListBuckets,
  createBucket,
  uploadImage,
  deleteImage
} from "./upload.func";

// ────────────────────────────────────────────────────────────────────────────────
const router = express.Router();
const Env = process.env.NODE_ENV == 'production' ? 'prod' : 'dev';
// ────────────────────────────────────────────────────────────────────────────────

//
// ────────────────────────────────────────────────── I ──────────
//   :::::: R O U T E : :  :   :    :     :        :          :
// ────────────────────────────────────────────────────────────
//

// !
// ! ─── UPLOAD ─────────────────────────────────────────────────────────────────────
// !

router.post("/", async (req, res) => {

  // * Validate
  const authPermissionLevel = await authPermission(req).then((result) => result, (err) => [true, err]);
  if (authPermissionLevel[0]) return res.status(400).json(msg.badRequest(null, authPermissionLevel[1]))
  else if (authPermissionLevel <= 2) return res.status(401).json(msg.unAccess('invalid access level'));
  else if (isEmpty(req.files) || !req.files) return res.status(400).json(msg.isEmpty(null, "payload is empty."))

  // * Declear
  const files = req.files.image;
  const type = req.body.objectId;
  const old = req.body.old;

  // * Check Buckets
  let listBuckets = await getListBuckets().then(x => x.map(y => y.name))
  if (listBuckets.indexOf(`sn-curtain-${Env}-slide-${type}`) < 0) {
    // create bucket if not exist
    const name = `sn-curtain-${Env}-slide-${type}`;
    const option = {
      location: "ASIA",
      storageClass: "COLDLINE"
    };
    await createBucket(name, option);
  }

  // * Upload image
  const bucketName = `sn-curtain-${Env}-slide-${type}`;
  const option = {
    gzip: true,
    metadata: {
      contentType: files.mimetype
      // cacheControl: 'public, max-age=31536000',
    }
  };

  const uploadResult = await uploadImage(bucketName, files, option, req.session)


  // * Delete Old Image
  if (old) {

  }

  return res.status(200).json(msg.isSuccess(uploadResult, null))
});

//
// ──────────────────────────────────────────────────── I ──────────
//   :::::: E X P O R T : :  :   :    :     :        :          :
// ──────────────────────────────────────────────────────────────
//

module.exports = router;