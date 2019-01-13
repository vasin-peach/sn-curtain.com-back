import express from "express";
import msg from "./responseMsg";
import isEmpty from "lodash.isempty";


// ────────────────────────────────────────────────────────────────────────────────
const router = express.Router();
const Env = process.env.NODE_ENV == 'production' ? 'prod' : 'dev'
// ────────────────────────────────────────────────────────────────────────────────


//
// ────────────────────────────────────────────────── I ──────────
//   :::::: R O U T E : :  :   :    :     :        :          :
// ────────────────────────────────────────────────────────────
//

// !
// ! ─── GET GUEST ──────────────────────────────────────────────────────────────────
// !

router.get("/", async (req, res) => {


  // return
  return res.status(200).json(msg.isSuccess(req.session.guest || null, null));
})



// !
// ! ─── UPDATE GUEST ───────────────────────────────────────────────────────────────
// !

router.post("/update", async (req, res) => {
  // validate
  if (!req.body || !req.body.payload || isEmpty(req.body.payload)) return res.status(400).json(msg.isfail(null, 'payload is empty'));

  // set session
  req.session.guest = req.body.payload

  // return
  return res.status(200).json(msg.isSuccess(req.session.guest, null));

})



//
// ──────────────────────────────────────────────────── I ──────────
//   :::::: E X P O R T : :  :   :    :     :        :          :
// ──────────────────────────────────────────────────────────────
//

module.exports = router;