import mongoose from 'mongoose';

const {
  Schema
} = mongoose;
const chatSchema = new Schema({
  author: [{
    id: String,
    name: String
  }],
  msg: [{
    author: String,
    type: {
      type: Object,
      text: String,
      file: String
    },
    data: String
  }]
}, {
  timestamps: {
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  }
});

module.exports = mongoose.model('Chat', chatSchema);