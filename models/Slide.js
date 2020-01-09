import mongoose from 'mongoose'

const { Schema } = mongoose
const slideSchema = new Schema(
  {
    src: String,
    type: String,
    url: String,
  },
  {
    timestamps: {
      createdAt: 'created_at',
      updatedAt: 'updated_at',
    },
  },
)

module.exports = mongoose.model('Slide', slideSchema)
