const yup = require("yup");
const validationCreateSchema = yup.object().shape({
  body: yup.object({
    name: yup.string().max(100,({ path }) => `${path.split(".")[1]} quá dài`).required(({ path }) => `${path.split(".")[1]} không được bỏ trống`),
    email: yup.string().email('Email không hợp lệ').max(50,({ path }) => `${path.split(".")[1]} quá dài`).required(({ path }) => `${path.split(".")[1]} không được bỏ trống`),
    phoneNumber: yup.string().max(50, ({ path }) => `${path.split(".")[1]} quá dài`).matches(/(84|0[3|5|7|8|9])+([0-9]{8})\b/g, 'Số điện thoại không hợp lệ'),
    address: yup.string().max(500,({ path }) => `${path.split(".")[1]} quá dài`).required(({ path }) => `${path.split(".")[1]} không được bỏ trống`),
    isDeleted: yup.boolean(),
  }),
});
module.exports = {
  validationCreateSchema,
};
