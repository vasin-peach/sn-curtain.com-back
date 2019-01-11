import express from "express";
import msg from "../responseMsg";
import isEmpty from "lodash.isempty";
import Slide from "../../../models/Slide";
import mongoose from "mongoose";
import {
  authPermission
} from "../auth/auth.func";

// ────────────────────────────────────────────────────────────────────────────────
const router = express.Router();
// ────────────────────────────────────────────────────────────────────────────────

//
// ────────────────────────────────────────────────── I ──────────
//   :::::: R O U T E : :  :   :    :     :        :          :
// ────────────────────────────────────────────────────────────
//

// !
// ! ─── GET ────────────────────────────────────────────────────────────────────────
// !

// ? Get slide
router.get("/", async (req, res) => {
  try {
    // * success
    const modelResult = await Slide.find({}).sort({
      created_at: -1
    });
    return res.status(200).json(msg.isSuccess(modelResult, null));
  } catch (error) {
    // * error
    return res.status(400).json(msg.isfail(null, error));
  }
}); //// end `get` block here

// !
// ! ─── UPDATE ─────────────────────────────────────────────────────────────────────
// !

// ? Create & Update Slide
router.post("/", async (req, res) => {
  // * Declear
  const id = req.body.id || new mongoose.mongo.ObjectID();
  const payload = req.body;

  // * Validate
  const authPermissionLevel = await authPermission(req).then(
    result => result,
    err => [true, err]
  );
  if (authPermissionLevel[0])
    return res.status(400).json(msg.badRequest(null, authPermissionLevel[1]));
  else if (authPermissionLevel <= 2)
    return res.status(401).json(msg.unAccess("invalid access level"));
  else if (!payload)
    return res.status(400).json(msg.badRequest(null, "param is empty"));

  // * Update Slide
  Slide.findOneAndUpdate({
      _id: id
    },
    payload.update, {
      upsert: true,
      new: true,
      setDefaultsOnInsert: true
    },
    (err, data) => {
      if (err) return res.status(400).json(msg.isfail(data, err));
      return res.status(200).json(msg.isSuccess(data, err));
    }
  );
}); //// end `update` block here

// ? Delete Slide
router.post("/delete", async (req, res) => {

  // * Declear
  const id = req.body.id;

  // * Validate
  const authPermissionLevel = await authPermission(req).then(result => result, err => [true, err]);
  if (authPermissionLevel[0])
    return res.status(400).json(msg.badRequest(null, authPermissionLevel[1]));
  else if (authPermissionLevel <= 2)
    return res.status(401).json(msg.unAccess("invalid access level"));
  else if (!id)
    return res.status(400).json(msg.badRequest(null, "param is empty"));

  // * Update Slide
  Slide.findOneAndRemove({
      _id: id
    },
    (err, data) => {
      if (err) return res.status(400).json(msg.isfail(data, err));
      return res.status(200).json(msg.isSuccess(data, err));
    }
  );

}); //// end `update` block here

//
// ──────────────────────────────────────────────────── I ──────────
//   :::::: E X P O R T : :  :   :    :     :        :          :
// ──────────────────────────────────────────────────────────────
//

module.exports = router;