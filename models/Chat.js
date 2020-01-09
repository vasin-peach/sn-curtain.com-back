import mongoose from 'mongoose'

const { Schema } = mongoose
const chatSchema = new Schema(
  {
    author: [
      {
        id: String,
        name: String,
        image: String,
      },
    ],
    msg: [
      {
        author: String,
        type: {
          type: String,
        },
        data: Object,
      },
    ],
  },
  {
    timestamps: {
      createdAt: 'created_at',
      updatedAt: 'updated_at',
    },
  },
)

module.exports = mongoose.model('Chat', chatSchema)
