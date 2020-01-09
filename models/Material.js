import mongoose from 'mongoose'

// ────────────────────────────────────────────────────────────────────────────────
const { Schema } = mongoose
// ────────────────────────────────────────────────────────────────────────────────

//
// ──────────────────────────────────────────────────── I ──────────
//   :::::: S C H E M A : :  :   :    :     :        :          :
// ──────────────────────────────────────────────────────────────
//

const materialSchema = new Schema(
  {
    // color, image
    type: String,
    // category ex. head, rail, fabric, striped, loop
    category: [
      {
        // name of category
        name: String,
        // code ex. 00001 (for admin)
        code: String,
      },
    ],
    // name of meterial
    name: String,
    // meterial image url
    image: String,
  },
  {
    timestamps: {
      createdAt: 'created_at',
      updatedAt: 'updated_at',
    },
  },
)

module.exports = mongoose.model('Material', materialSchema)
