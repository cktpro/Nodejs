const mongoose = require("mongoose");
const { Schema, model } = mongoose;
const mongooseLeanVirtuals = require('mongoose-lean-virtuals');

const customerSchema = new Schema(
  {
    firstName: {
      type: String,
      required: [true, "First name không được bỏ trống"],
      maxLength: [50, "First name không được vượt quá 50 ký tự"],
    },
    lastName: {
        type: String,
        required: [true, "Last name không được bỏ trống"],
        maxLength: [50, "Last name không được vượt quá 50 ký tự"],
      },
      phoneNumber: {
        type: String,
        maxLength: [50, "Phone number không được vượt quá 50 ký tự"],
      },
      address: {
        type: String,
        required: [true, "Address không được bỏ trống"],
        maxLength: [500, "Address không được vượt quá 500 ký tự"],
        unique:[true,"Address không được trùng"]
      },
      email: {
        type: String,
        required: [true, "Email không được bỏ trống"],
        maxLength: [50, "Email không được vượt quá 50 ký tự"],
        unique:[true,"Email không được trùng"]
      },
      birthday: {
        type: Date,
      },
    isDeleted: {
      type: Boolean,
      default: false,
      required: true,
    },
  },
  {
    versionKey: false,
    timestamps: true,
  }
);
customerSchema.virtual('fullName').get(function () {
    return this.firstName+" "+this.lastName;
  });
  customerSchema.virtual('Age').get(function () {
    return new Date().getFullYear() - this.birthday.getFullYear();
  });
  // Virtual with Populate
  
  // Config
  customerSchema.set('toJSON', { virtuals: true });
  customerSchema.set('toObject', { virtuals: true });
  //
  customerSchema.plugin(mongooseLeanVirtuals);
const Customer = model("customers", customerSchema);
module.exports = Customer;