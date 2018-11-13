import express from "express";
import isEmpty from "lodash.isempty";
import msg from "../responseMsg";

// * Import Model
import User from "../../../models/User";

// * Import Router
import uploadProfileRouter from "./profile";

// * Declear Variable
const router = express.Router();

//
// ─── ROUTER ─────────────────────────────────────────────────────────────────────
//

// ? Default
router.get("/", (req, res) => {
  return res.json(msg.isSuccess("upload api", null));
});

//
// ─── EXPORT ───────────────────────────────────────────────────────────────────────
//

router.use("/profile", uploadProfileRouter);

module.exports = router