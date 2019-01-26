import mongoose from 'mongoose';

// ────────────────────────────────────────────────────────────────────────────────  
const {
  Schema
} = mongoose
// ────────────────────────────────────────────────────────────────────────────────

//
// ──────────────────────────────────────────────────── I ──────────
//   :::::: S C H E M A : :  :   :    :     :        :          :
// ──────────────────────────────────────────────────────────────
//


const simulatorSchema = new Schema({
  material: {
    // ประเภทม่าน
    base: String,
    // หัวราง
    head: {
      enable: Boolean,
      data: Array
    },
    // ราง
    rail: {
      enable: Boolean,
      data: Array
    },
    // ผ้าเบอร์ --> เช่น ทึบ, ใส
    fabric: {
      enable: Boolean,
      data: Array
    },
    // ลายผ้า --> เช่น ผ้าเบอร์ 1 (ลาย + สี)
    striped: {
      enable: Boolean,
      data: Array
    },
    // ห่วงผ้า --> สามารถใช้กับคอกระเช้าได้ เช่น สี, ภาพ
    loop: {
      enable: Boolean,
      data: Array
    }
  },
  name: String,
}, {
  timestamps: {
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  }
});

module.exports = mongoose.model('Simulator', simulatorSchema);