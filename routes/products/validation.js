const yup = require("yup");
const validationSchema = yup.object().shape({
  body: yup.object({
    name: yup
      .string()
      .max(50, "Tên sản phẩm quá dài")
      .required("Tên không được bỏ trống"),
    price: yup
      .number()
      .min(0, "Giá không thể âm")
      .integer()
      .required(({ path }) => `${path.split(".")[1]} không được bỏ trống`),
    discount: yup
      .number()
      .min(0, "Giảm giá không thể âm")
      .max(75, "Giảm giá quá lớn")
      .integer()
      .required(({ path }) => `${path.split(".")[1]} không được bỏ trống`),
    stock: yup
      .number()
      .min(0, "Số lượng không hợp lệ")
      .integer()
      .required(({ path }) => `${path.split(".")[1]} không được bỏ trống`),
    description: yup
      .string()
      .max(3000, "Mô tả quá dài")
      .required(({ path }) => `${path.split(".")[1]} không được bỏ trống`),
      categoryId: yup
      .number()
      .required(({ path }) => `${path.split(".")[1]} không được bỏ trống`),
      supplierId: yup
      .number()
      .required(({ path }) => `${path.split(".")[1]} không được bỏ trống`),
    isDeleted: yup
      .boolean()
      .required(({ path }) => `${path.split(".")[1]} không được bỏ trống`),
  }),
});
module.exports = {
  validationSchema
};
