import express from "express";
import isEmpty from "lodash.isempty";
import msg from "../responseMsg";

// * Import Model
import User from "../../../models/User";

// * Import Router
import uploadProfileRouter from "./profile";
import uploadAtmRouter from './atm';
import uploadSlideRouter from './slide';

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
router.use("/atm", uploadAtmRouter);
router.use("/slide", uploadSlideRouter)

module.exports = router