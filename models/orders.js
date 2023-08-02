const mongoose = require("mongoose");
const { Schema, model } = mongoose;
const mongooseLeanVirtuals = require("mongoose-lean-virtuals");

const orderSchema = new Schema(
  {
    createdDate: {
      type: Date,
      required: [true, "createDate không được bỏ trống"],
      default: Date.now,
    },
    shippedDate: {
      type: Date,
      min:[function(){
        return this.createdDate
      },"shippedDate phải lớn hơn createdDate"],
      max: [Date.now,"shippedDate phải nhỏ hơn hiện tại"]
    },
    status: {
      type: String,
      maxLength: [50, "Status không được vượt quá 50 ký tự"],
      enum: {
        values: ['WAITING', 'COMPLETED','CANCELED'],
        message: '{VALUE} is WAITING,  COMPLETED or CANCELED'
      },
      default:"WAITING",
      required: [true, "{VALUE} không được bỏ trống"],
    },
    description: {
      type: String,
    },
    shippingAddress: {
      type: String,
      required: [true, "Địa chỉ ship không được bỏ trống 2"],
      maxLength: [500, "Địa chỉ ship không được vượt quá 50 ký tự"],
    },
    paymentType: {
      type: String,
      enum: {
        values: ['CASH', 'CREDIT CARD'],
        message: '{VALUE} is CASH or CREDIT CARD'
      },
      default:"CASH",
    },
    customerId:{type:Schema.Types.ObjectId,maxLength: [50, "Id khách hàng không được vượt quá 50 ký tự"],ref:"Customer",require:true},
    employeeId:{type:Schema.Types.ObjectId,maxLength: [50, "Id nhân viên không được vượt quá 50 ký tự"],ref:"Employee",require:true},
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

// Virtual with Populate

// Config
orderSchema.set("toJSON", { virtuals: true });
orderSchema.set("toObject", { virtuals: true });
//
orderSchema.plugin(mongooseLeanVirtuals);
const Order = model("orders", orderSchema);
module.exports = Order;
