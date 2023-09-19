const mongoose = require('mongoose');
const { Schema, model } = mongoose;

const supplierSchema = new Schema(
    {
      name: {
        type: String,
        required: [true, "Tên danh mục không được bỏ trống"],
        maxLength: [100, "Tên danh mục không được vượt quá 100 ký tự"],
        required: true,
      },
      email: {
        type: String,
        maxLength: [50, "Email không được vượt quá 50 ký tự"],
        required: [true,"Email không được bỏ trống"],
        unique:[true,"Email không được trùng"]
      },
      phoneNumber: {
        type: String,
        maxLength: [50, "PhoneNumber không được vượt quá 50 ký tự"],
        unique:[true,"Số điệnt thoại không được trùng"]
      },
      isDeleted: {
        type: Boolean,
        default: false,
        required: true,
      },
      address: {
        type: String,
        maxLength:[500,"Địa chỉ không vượt quá 500 kí tự"],
        required: true,
      },
    },
    {
      versionKey: false,
      timestamps: true,
    }
  );

const Supplier = model('Suppliers', supplierSchema);
module.exports = Supplier;