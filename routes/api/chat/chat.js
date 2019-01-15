import express from "express";
import isEmpty from "lodash.isempty";
import msg from "../responseMsg";
import Chat from "../../../models/Chat";

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
// ! ─── GET CHAT ───────────────────────────────────────────────────────────────────
// !

router.get("/:uid", async (req, res) => {

  // * Declear
  let user = !isEmpty(req.session.passport) ? req.session.passport.user : req.params.uid;

  // const perm = req.session.passport ? user.permission.value : 0;

  // // * Validate
  // if (!user || !perm) return res.status(400).json(msg.isEmpty('bad request, auth is empty'))

  // * Model
  try {
    const result = await Chat.find({
      "author.id": user._id || user
    }).sort({
      updatedAt: -1
    });
    return res.status(200).json(msg.isSuccess(result, null));
  } catch (error) {
    return res.status(400).json(msg.isfail(null, error));
  }

})




//
// ──────────────────────────────────────────────────── I ──────────
//   :::::: E X P O R T : :  :   :    :     :        :          :
// ──────────────────────────────────────────────────────────────
//

module.exports = router;