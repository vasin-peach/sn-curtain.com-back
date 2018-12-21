import express from "express";
import isEmpty from "lodash.isempty";
import msg from "../responseMsg";

// * Import Model
import Order from "../../../models/Order";
import {
  authPermission
} from '../auth/auth.func';

// * Declear Variable
const router = express.Router();

//
// ─── ROUTER ─────────────────────────────────────────────────────────────────────
//


// ? Get sale by start - end day
router.post("/date", async (req, res) => {


  // ! Validate
  const authPermissionLevel = await authPermission(req).then((result) => result, (err) => [true, err]);
  if (authPermissionLevel[0]) return res.status(400).json(msg.badRequest(null, authPermissionLevel[1]));
  if (authPermissionLevel <= 2) return res.status(401).json(msg.unAccess('invalid access level'));
  if (!req.body.start || !req.body.end || isEmpty(req.body)) return res.status(400).json(msg.badRequest(null, 'bad param, `payload` is empty'));

  const start = req.body.start;
  const end = req.body.end;

  try {
    const queryResult = await Order.aggregate([{
        $match: {
          $and: [{
              order_status: "paid"
            },
            {
              updated_at: {
                $gte: new Date(start)
              }
            },
            {
              updated_at: {
                $lte: new Date(end)
              }
            }
          ]
        }
      },
      {
        $group: {
          _id: "$_id",
          sum: {
            $sum: "$pricing.summary_price"
          }
        }
      }
    ]);
    // response
    return res.status(200).json(msg.isSuccess(queryResult, null));
  } catch (err) {
    msg.isfail(null, err);
  }


});


//
// ─── EXPORT ─────────────────────────────────────────────────────────────────────
//

module.exports = router;