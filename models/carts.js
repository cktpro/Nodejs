const mongoose = require("mongoose");
const { Schema, model } = mongoose;
const cartDetailSchema = new Schema(
  {
    productId: { type: Schema.Types.ObjectId, ref: "Product", require: true },
    quantity: { type: Number, require: true, min: 0 },
  },
  {
    versionKey: false,
  }
);
// Virtual with Populate
cartDetailSchema.virtual("product", {
  ref: "Product",
  localField: "productId",
  foreignField: "_id",
  justOne: true,
});
// Virtuals in console.log()
cartDetailSchema.set("toObject", { virtuals: true });
// Virtuals in JSON
cartDetailSchema.set("toJSON", { virtuals: true });
// -----------------------------------------------\
const cartSchema = new Schema(
  {
    customerId: { type: Schema.Types.ObjectId, ref: "Customer", require: true },
    product: [cartDetailSchema],
  },
  {
    versionKey: false,
  }
);
// Virtual with Populate
cartSchema.virtual('customer',{
    ref:'Customer',
    localField:'customerId',
    foreignField:'_id',
    justOne:true,
})
// Virtuals in console.log()
cartDetailSchema.set("toObject", { virtuals: true });
// Virtuals in JSON
cartDetailSchema.set("toJSON", { virtuals: true });
const Cart = model('carts', cartSchema);
module.exports = Cart;