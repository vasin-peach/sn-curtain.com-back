import express from "express";
import msg from "../responseMsg";
import isEmpty from "lodash.isempty";
import View from "../../../models/View";
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


// ! GET
router.get("/", async (req, res) => {

  // * Validate
  const authPermissionLevel = await authPermission(req).then(
    result => result,
    err => [true, err]
  );
  if (authPermissionLevel[0])
    return res.status(400).json(msg.badRequest(null, authPermissionLevel[1]));
  else if (authPermissionLevel <= 2)
    return res.status(401).json(msg.unAccess("invalid access level"));

  try {
    // * Success
    const result = await View.find({}).sort({
      created_at: -1
    });
    return res.status(200).json(msg.isSuccess(result, null));
  } catch (error) {
    return res.status(400).json(msg.fail(null, error));
  }
});

// ! UPDATE
router.post("/", async (req, res) => {

  // * Declear
  const payload = req.body;

  // * Validate
  if (!payload || isEmpty(payload)) return res.status(400).json(msg.badRequest(null, 'param is empty'));


  try {
    const result = await View.create(payload);
    return res.status(201).json(msg.isCreated(result, null))
  } catch (error) {
    return res.status(400).json(msg.isfail(null, error));
  }
})

module.exports = router;