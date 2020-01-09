import mongoose from 'mongoose'

const { Schema } = mongoose
const viewSchema = new Schema(
  {
    product: Object,
  },
  {
    timestamps: {
      createdAt: 'created_at',
      updatedAt: 'updated_at',
    },
  },
)

module.exports = mongoose.model('View', viewSchema)
