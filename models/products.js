const mongoose = require("mongoose");
const { Schema, model } = mongoose;
const mongooseLeanVirtuals = require('mongoose-lean-virtuals');

const productSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, "Tên danh mục không được bỏ trống"],
      maxLength: [50, "Tên sản  phẩm không được vượt quá 50 ký tự"],
      unique: [true, "Tên sản phẩm không được trùng"],
    },
    price: {
      type: Number,
      require:[true,"Giá không được để trống"],
      min:0,
      default:0
    },
    discount: {
        type: Number,
        min:0,
        max:75,
        default:0
      },
      stock: {
        type: Number,
        min:0,
        default:0
      },
      categoryId:{type:Schema.Types.ObjectId,maxLength: [50, "Tên sản  phẩm không được vượt quá 50 ký tự"],ref:"Category",require:true},
      supplierId:{type : Schema.Types.ObjectId,ref:"Supplier",require:true},
    description:{type:String,maxLength:[3000,"Mô tả không vượt quá 3000 ký tự"]},
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
productSchema.virtual('discountedPrice').get(function () {
    return (this.price * (100 - this.discount)) / 100;
  });
  
  // Virtual with Populate
  productSchema.virtual('category', {
    ref: 'Categories',
    localField: 'categoryId',
    foreignField: '_id',
    justOne: true,
  });
  
  productSchema.virtual('supplier', {
    ref: 'Suppliers',
    localField: 'supplierId',
    foreignField: '_id',
    justOne: true,
  });
  
  // Config
  productSchema.set('toJSON', { virtuals: true });
  productSchema.set('toObject', { virtuals: true });
  //
  productSchema.plugin(mongooseLeanVirtuals);
const Product = model("Products", productSchema);
module.exports = Product;