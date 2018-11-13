//
// ─── IMPORT ─────────────────────────────────────────────────────────────────────
//

//
// ─── FUNCTION ───────────────────────────────────────────────────────────────────
//

const sessionFunction = {
  async updateSession(req, data, target) {

    /**
     * @param req req param from router
     * @param data data to update
     * @param target target to update
     */

    return new Promise((resolve, reject) => {
      console.log(req.session);
    })
  }
}

module.exports = sessionFunction