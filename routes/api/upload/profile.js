import express from "express";
import isEmpty from "lodash.isempty";
import msg from "../responseMsg";

// * Import Model
import User from "../../../models/User";

// * Declear Variable
const router = express.Router();

//
// ─── ROUTER ─────────────────────────────────────────────────────────────────────
//

// ? Default
router.get("/", (req, res) => {
  return res.json(msg.isSuccess("upload api", null));
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
  res.send(req.files);



})

//
// ─── EXPORT ─────────────────────────────────────────────────────────────────────
//

module.exports = router;