const mongoose = require('mongoose');
const {
  Schema
} = mongoose;

const productSchema = new Schema({
  name: {
    type: String
  },
  desc: [{
    lang: {
      type: String
    },
    val: {
      type: String
    }
  }],
  price: [{
    text: {
      type: String
    },
    value: {
      type: Number
    },
    option: {
      type: String
    },
    weight: {
      type: Number
    }
  }],
  quantity: {
    type: Number
  },
  like: {
    type: Number
  },
  view: {
    type: Number
  },
  brand: {
    src: {
      type: String
    }
  },
  assets: [{
    name: {
      type: String
    },
    src: {
      type: String
    }
  }],
  category: {
    val: {
      type: String
    },
    type: {
      val: {
        type: String
      },
      nature: [{
        val: {
          type: String
        },
        text: {
          type: String
        },
        option: {
          type: String
        }
      }]
    }
  },
  tag: [{
    type: String
  }],
  specs: [{
    name: {
      type: String
    },
    val: {
      type: String
    }
  }],
  date: {
    type: Date,
    default: Date.now
  },
  comments: [{
    body: String,
    date: Date
  }],
  promotion: {
    expired: {
      expired: Boolean,
      expiredStart: Date,
      expiredEnd: Date,
    },
    discount: {
      percent: Number,
      amount: Number
    }
  }
})

module.exports = mongoose.model('Product', productSchema);