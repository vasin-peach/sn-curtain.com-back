//
// ─── IMPORT ─────────────────────────────────────────────────────────────────────
//
import {
  Storage
} from '@google-cloud/storage';
import isEmpty from 'lodash.isempty';

//
// ─── INIT CLIENT ────────────────────────────────────────────────────────────────
//

// * init storage by environment
if (process.env.NODE_ENV == 'production') {
  var storage = new Storage({
    projectId: 'sn-curtain-prod',
    // keyFilename: 'config/google.key.prod.json'
  });
} else {
  var storage = new Storage({
    projectId: 'neural-passkey-225609',
    // keyFilename: 'config/google.key.dev.json'
  });
}

//
// ─── INIT FUNCTION ──────────────────────────────────────────────────────────────
//

// * get url by filename & bucketname
function getPublicUrl(bucketname, filename) {

  /**
   * @param filename image name
   * @param bucketname bucket name
   */

  return `https://storage.googleapis.com/${bucketname}/${filename}`;
}

//
// ─── FUNCTION ───────────────────────────────────────────────────────────────────
//

/**
 * @param storage object of google storage
 * 
 */


const uploadFunction = {
  async getListBuckets() {
    try {
      const [buckets] = await storage.getBuckets();
      return Promise.resolve(buckets);
    } catch (err) {
      return Promise.reject(new Error(err))
    }
  },

  async createBucket(name, option) {

    /**
     * @param name name of bucket
     * @param option object {location: [US, EU, ASIA], storageClass: [Multi - Regional, Regional, Nearline, Coldline]}
     */

    if (!name || !option || isEmpty(option)) return Promise.reject(new Error('params is empty'));

    await storage.createBucket(name, option);
  },



  async uploadImage(bucketName, filename, option, userData, objectId) {

    /**
     * @param bucketName name of bucket
     * @param filename data of image
     * @param option OBJECT - {
     *  gzip: ARRAY -[true, false]
     *  metadata: OBJECT - {
     *    // Enable long - lived HTTP caching headers
     *    // Use only if the contents of the file will never change
     *    // (If the contents will change, use cacheControl: 'no-cache')
     *    cacheControl: STRING - 'public, max-age=31536000',
     *  }
     * }
     * @param userData data from session
     * @param objectId STRING - id of item to use
     */

    return new Promise((resolve, reject) => {

      const gcsname = userData.passport.user.email + '-' + (objectId || "") + "-" + Date.now();
      const file = storage.bucket(bucketName).file(gcsname);
      const stream = file.createWriteStream(option)

      stream.end(filename.data);

      stream.on('finish', () => { // when finish
        file.makePublic();
        const publicUrl = getPublicUrl(bucketName, gcsname);
        return resolve(publicUrl);
      });

      stream.on('error', (err) => { // when error
        return reject(false)
      });

    });

  },

  async deleteImage(bucketname, filename) {

    /**
     * @param bucketname name of bucket
     * @param filename name of image
     */


    if (!bucketname || !filename) return Promise.reject('param is empty');

    try {
      const deleteImageResult = await storage.bucket(bucketname).file(filename).delete();
      return Promise.resolve(deleteImageResult);
    } catch (err) {
      return Promise.resolve(false);
    }
  }

}

module.exports = uploadFunction