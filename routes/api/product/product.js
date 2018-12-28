const express = require("express");
const router = express.Router();
const _ = require("lodash");
const msg = require("../responseMsg");
import isEmpty from 'lodash.isempty';

// Import Model
const Product = require("../../../models/Product");
import {
  getListBuckets,
  createBucket,
  uploadImage,
  deleteImage,
  uploadBase64
} from "../upload/upload.func";
import {
  authPermission
} from '../auth/auth.func';

// Declare Variable
var amountPerPage = 12;
var currentPage = 1;
var category = null;
var nature = null;
var type = null;
var search = null;


if (process.env.NODE_ENV == 'production') {
  var bucketEnv = 'prod'
} else {
  var bucketEnv = 'dev'
}

/*
  ROUTES
*/

///
// Get product all
///
router.get("/all", async (req, res, next) => {

  // ! Validate
  const authPermissionLevel = await authPermission(req).then((result) => result, (err) => [true, err]);
  if (authPermissionLevel[0]) return res.status(400).json(msg.badRequest(null, authPermissionLevel[1]))
  if (authPermissionLevel <= 2) return res.status(401).json(msg.unAccess('invalid access level'));

  Product.find({}, (err, data) => {
    if (err) {
      return res.status(400).json(msg.isfail(data, err));
    } else {
      return res.status(200).json(msg.isSuccess(data, err));
    }
  });
});

///
// Get product by id
///
router.get("/id/:id", (req, res) => {
  Product.find({
      _id: req.params.id
    },
    (err, data) => {
      return _.isEmpty(data) ?
        res.status(404).json(msg.isEmpty(data, err)) :
        res.status(200).json(msg.isSuccess(data, err));
    }
  );
});

///
// Get product by page, fabric, type, color
///
router.get("/get/:search/:page/:category/:type/:nature", async (req, res) => {
  // define filter
  currentPage = req.params.page ? req.params.page : currentPage;
  search =
    req.params.search && req.params.search != " " ? {
      name: RegExp(req.params.search)
    } : {};
  category =
    req.params.category && req.params.category != " " ? {
      "category.val": req.params.category
    } : {};
  type =
    req.params.type && req.params.type != " " ? {
      "category.type.val": req.params.type
    } : {};
  nature =
    req.params.nature && req.params.nature != " " ? {
      "category.type.nature.val": req.params.nature
    } : {};

  try {
    // get count
    const count = await new Promise((resolve, reject) => {
      Product.find({
        $and: [search, category, type, nature]
      }).count((err, data) => {
        if (err) return reject(err);
        return resolve(data);
      });
    });

    // get data
    const data = await new Promise((resolve, reject) => {
      Product.find({
          $and: [search, category, type, nature]
        }, {}, {
          // get range of data
          skip: (currentPage - 1) * amountPerPage,
          limit: amountPerPage
        },
        (err, data) => {
          if (err) return reject(err);
          return resolve(data);
        }
      );
    });

    // create payload
    const payload = {
      count: await count,
      data: await data
    };

    // return response
    if (_.isEmpty(payload.data))
      return res.status(404).json(msg.isEmpty(null, payload));
    else return res.status(200).json(msg.isSuccess(payload, null));
  } catch (e) {
    return res.status(404).json(msg.isEmpty(null, e));
  }
});

///
// Get category
///
router.get("/category", async (req, res) => {
  const response = await new Promise((resolve, reject) => {
    Product.distinct("category", (err, data) => {
      return _.isEmpty(data) ? reject(err) : resolve(data);
    });
  });

  // return response
  if (_.isEmpty(response)) return res.status(404).json(msg.isEmpty(null, null));
  else return res.status(200).json(msg.isSuccess(response, null));

});

///
// Get popular product
///
router.get("/popular", (req, res) => {
  // query get top 6 of product
  Product.find({})
    .sort({})
    .sort({
      view: -1
    })
    .limit(6)
    .exec((err, data) => {
      if (_.isEmpty(data)) {
        // check response is empty
        return res.status(404).json(msg.isEmpty(data, err));
      }
      if (err) {
        return res.status(400).json(msg.isfail(data, err));
      } else {
        return res.status(200).json(msg.isSuccess(data, err));
      }
    });
});

///
// Get num of product
///
router.get("/count", (req, res) => {
  Product.find({}).count((err, data) => {
    return data ?
      res.status(200).json(msg.isSuccess(data, err)) :
      res.status(404).json(msg.isEmpty(data, err));
  });
});

///
// Create product
///
router.post("/create", async (req, res, next) => {

  // ! Validate
  const authPermissionLevel = await authPermission(req).then((result) => result, (err) => [true, err]);
  if (authPermissionLevel[0]) return res.status(400).json(msg.badRequest(null, authPermissionLevel[1]))
  if (authPermissionLevel <= 2) return res.status(401).json(msg.unAccess('invalid access level'));

  // *** don't forgot to add middleware admin when production
  Product.create(req.body, (err, data) => {
    if (err) return res.status(400).json(msg.isfail(data, err));
    else {
      return res.status(201).json({
        status: 201,
        message: "Created",
        err: err,
        data: data
      });
    }
  });
});

// !
// ! ─── DELETE PRODUCT ─────────────────────────────────────────────────────────────
// !

router.post("/delete", async (req, res) => {

  // * Validate
  const authPermissionLevel = await authPermission(req).then((result) => result, (err) => [true, err]);
  if (authPermissionLevel[0]) return res.status(400).json(msg.badRequest(null, authPermissionLevel[1]))
  if (authPermissionLevel <= 2) return res.status(401).json(msg.unAccess('invalid access level'));
  if (!req.body || isEmpty(req.body)) return res.status(400).json(msg.badRequest(null, 'bad request, `req.body` is empty.'));

  // * Query
  const id = req.body.id;
  Product.find({
    _id: id
  }).remove().exec((err, data) => {
    if (err) return res.status(400).json(msg.isfail(null, err));
    else return res.status(200).json(msg.isSuccess(data, null));
  });
}); // ! END BLOCK


// !
// ! ─── UPDATE PRODUCT ─────────────────────────────────────────────────────────────
// !

router.post("/update", async (req, res) => {

  // * Validate
  const authPermissionLevel = await authPermission(req).then((result) => result, (err) => [true, err]);
  if (authPermissionLevel[0]) return res.status(400).json(msg.badRequest(null, authPermissionLevel[1]))
  if (authPermissionLevel <= 2) return res.status(401).json(msg.unAccess('invalid access level'));
  if (!req.body || isEmpty(req.body)) return res.status(400).json(msg.badRequest(null, 'bad request, `req.body` is empty.'));

  // * Get Image Data
  var product = req.body;
  const brandImage = req.body.brand.status == 'temp' ? req.body.brand : false;
  const assetsImage = req.body.assets.filter(x => x.status == 'temp') || false;
  const name = `sn-curtain-${bucketEnv}-product`;

  // * get list of buckets
  let listBuckets = await getListBuckets().then(buckets => {
    return buckets.map(bucket => bucket.name);
  });

  // * create bucket if 'sn-curtain-product' is empty
  if (listBuckets.indexOf(`sn-curtain-${bucketEnv}-product`) < 0) {
    const name = `sn-curtain-${bucketEnv}-product`;
    const option = {
      location: "ASIA",
      storageClass: "COLDLINE"
    };
    await createBucket(name, option);
  }

  // * Upload Brand Image
  if (brandImage) {

    // upload
    const uploadBrandResult = await uploadBase64(brandImage.src, name, req.session);

    // update brand src to img url
    product.brand.src = uploadBrandResult;
    delete product.brand.status;
  }

  // * Upload Assets Image
  if (assetsImage) {

    // upload
    const uploadAssetsResult = await Promise.all(assetsImage.map((item) => uploadBase64(item.src, name, req.session)))

    // update assets src to img url
    var index = 0;
    product.assets.map((item, count) => {
      if (item.status == 'temp') {
        product.assets[count].src = uploadAssetsResult[index]
        delete product.assets[count].status;
        delete product.assets[count]._id;
        index += 1;
      }
    })
  }

  // * Mongoose Query
  try {
    const queryResult = await Product.findByIdAndUpdate({
      _id: product._id
    }, product, {
      upsert: true,
      new: true
    });
    res.status(200).json(msg.isSuccess(queryResult));
  } catch (err) {
    res.status(400).json(msg.isFail(err));
  }

}); // ! END BLOCK




// Update product
router.put("/", (req, res, next) => {});

router.delete("/", (req, res, next) => {});

module.exports = router;