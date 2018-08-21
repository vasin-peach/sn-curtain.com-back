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
  price: {
    type: Number
  },
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
  fabric: {
    type: String
  },
  category: {
    type: {
      type: String
    },
    tag: [{
      type: String
    }],
    color: {
      val: {
        type: String
      },
      hex: {
        type: String
      }
    }
  },
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