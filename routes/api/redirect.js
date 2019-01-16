//
// ─── IMPORT ─────────────────────────────────────────────────────────────────────
//

import express from "express";
import msg from "./responseMsg";
import isEmpty from 'lodash.isempty';
import {
  getSession,
  updateSession
} from './session.func';

// * Declear Variable
const router = express.Router();

//
// ─── ROUTE ──────────────────────────────────────────────────────────────────────
//

// * Get redirect path
router.get("/", async (req, res) => {

  // ! Retrieve
  const retrieveSessionResult = await getSession(req, 'redirect').then((result) => result);
  return res.status(200).json(msg.isSuccess(retrieveSessionResult, null));

})

// * Update redirect path
router.get("/update/:data", async (req, res) => {

  // ! Validate
  const data = req.params.data.replace(/\|/g, "/");
  if (!data || isEmpty(data)) return res.status(400).json(msg.badRequest(null, null));

  // ! Update
  try {
    const updateSessionResult = await updateSession(req, data, 'redirect').then((result) => result);
    return res.status(200).json(msg.isSuccess(updateSessionResult, null));
  } catch (err) {}

});


//
// ─── EXPORT ─────────────────────────────────────────────────────────────────────
//

module.exports = router;