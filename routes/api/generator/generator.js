const express = require('express')
const router = express.Router()
const _ = require('lodash')
const msg = require('../responseMsg')

// Import Model
const Product = require('../../../models/Product')

// Declare Variable
const natureList = [
  {
    text: 'น้ำเงิน',
    val: 'น้ำเงิน',
    option: '#225ebf',
  },
  {
    text: 'ม่วง',
    val: 'ม่วง',
    option: '#9a21bf',
  },
  {
    text: 'แดง',
    val: 'แดง',
    option: '#db5151',
  },
  {
    text: 'เหลือง',
    val: 'เหลือง',
    option: '#dbcf51',
  },
  {
    text: 'เขียว',
    val: 'เขียว',
    option: '#73db51',
  },
  {
    text: 'เขียวอ่อน',
    val: 'เขียวอ่อน',
    option: '#51dbb8',
  },
  {
    text: 'ฟ้า',
    val: 'ฟ้า',
    option: '#51d4db',
  },
]
/*
  ROUTES
*/

router.get('/', (req, res, next) => {
  return res.status(200).json(msg.isSuccess('healty', null))
})

router.post('/product', (req, res, next) => {
  for (let item = 1; item < 5; item++) {
    createProduct(item)
  }

  function createProduct(num) {
    // desc
    let name = 'สินค้าตัวอย่าง' + Math.floor(Math.random() * 1000 + 1)

    // desc
    let desc = [
      {
        lang: 'th',
        val:
          'Supakrit Ton ได้แชร์รูปภาพลงในกลุ่ม: ITKMITL Pre-Programming 611 ชม อันนี้เป็นเพจของOpenHouseของเรานะ เข้าไปกดไลค์ กดแชร์ให้ด้วยยย ช่วยๆกันกระจ่ายข่าว จะได้มีน้องมาเยอะๆน',
      },
    ]

    // price
    var optionList = [
      '100x250',
      '125x250',
      '150x250',
      '175x250',
      '200x250',
      '225x250',
      '250x250',
    ]
    var price = []
    for (let item = 0; item < 4; item++) {
      price.push({
        text:
          optionList[Math.floor(Math.random() * optionList.length)],
        value: Math.floor(Math.random() * 1000 + 1),
        weight: Math.floor(Math.random() * 10000 + 1),
      })
    }

    // quantity
    let quantity = Math.floor(Math.random() * 1000 + 1)

    // like
    let like = Math.floor(Math.random() * 1000 + 1)

    // view
    let view = Math.floor(Math.random() * 1000 + 1)

    // brand
    let brand = {
      src: '/static/images/test/test_0' + num + '.jpg',
    }

    let assets = [
      {
        name: 'assets1',
        src: '/static/images/test/test_0' + num + '.jpg',
      },
      {
        name: 'assets1',
        src: '/static/images/test/test_01.jpg',
      },
      {
        name: 'assets2',
        src: '/static/images/test/test_02.jpg',
      },
      {
        name: 'assets3',
        src: '/static/images/test/test_01.jpg',
      },
      {
        name: 'assets4',
        src: '/static/images/test/test_03.jpg',
      },
      {
        name: 'assets5',
        src: '/static/images/test/test_04.jpg',
      },
    ]

    var nature = []
    for (let x = 0; x <= Math.floor(Math.random() * 5 + 1); x++) {
      nature.push(natureList[x])
    }

    const typeList = [
      'ม่านตาไก่',
      'ม่านจีบ',
      'ม่านพับ',
      'ม่านคอกระเช้า',
      'ม่านหลุย',
      'ม่านมู่ลี่',
      'ม่านม้วน',
      'ม่านกั้นแอร์',
      'ม่านลอน',
      'วอลล์เปเปอร์',
      'มุ้งลวด-มุ้งจีบ',
      'อุปกรณ์ม่าน',
    ]
    const categoryList = ['ผ้าม่าน', 'ราง', 'วอลล์เปเปอร์', 'อุปกรณ์']

    let category = {
      val:
        categoryList[Math.floor(Math.random() * categoryList.length)],
      type: {
        val: typeList[Math.floor(Math.random() * typeList.length)],
        nature: nature,
      },
    }

    /// discount calculator
    let discount = Math.floor(Math.random() * 2)
      ? {
          percent: Math.floor(Math.random() * 100 + 1),
        }
      : {
          amount: Math.floor(Math.random() * 1000 + 1),
        }

    /// expired calculator
    let expired = null
    if (Math.floor(Math.random() * 2)) {
      expired = {
        expired: false,
      }
    } else {
      var start = new Date(2018, 0, 1)
      var end = new Date()
      expired = {
        expired: true,
        expiredStart: new Date(
          start.getTime() +
            Math.random() * (end.getTime() - start.getTime()),
        ),
        expiredEnd: new Date(
          start.getTime() +
            Math.random() * (end.getTime() - start.getTime()),
        ),
      }
    }

    let promotion = {
      expired: expired,
      discount: discount,
    }

    const schedule = {
      name,
      desc,
      price,
      quantity,
      like,
      view,
      brand,
      assets,
      category,
      promotion,
    }

    Product.create(schedule)
  }

  return res.status(200).json(msg.isSuccess('healty', null))
})

module.exports = router
