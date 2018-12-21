import express from "express";
import isEmpty from "lodash.isempty";
import msg from "../responseMsg";

// * Import Model
import User from "../../../models/User";
import {
  authPermission
} from '../auth/auth.func';

// * Declear Variable
const router = express.Router();

//
// ─── ROUTER ─────────────────────────────────────────────────────────────────────
//


// ? Get membership
router.get("/", async (req, res) => {

  // ! Validate
  const authPermissionLevel = await authPermission(req).then((result) => result, (err) => [true, err]);
  if (authPermissionLevel[0]) return res.status(400).json(msg.badRequest(null, authPermissionLevel[1]))
  if (authPermissionLevel <= 2) return res.status(401).json(msg.unAccess('invalid access level'));

  const queryResult = await User.count();
  return res.status(201).json(msg.isSuccess(queryResult, null));

});


//
// ─── EXPORT ─────────────────────────────────────────────────────────────────────
//

module.exports = router;