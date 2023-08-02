const yup = require("yup");
new Date()
const validationCreateSchema = yup.object().shape({
  body: yup.object({
    firstName: yup.string().max(50,({ path }) => `${path.split(".")[1]} quá dài`).required(({ path }) => `${path.split(".")[1]} không được bỏ trống`),
    lastName: yup.string().max(50,({ path }) => `${path.split(".")[1]} quá dài`).required(({ path }) => `${path.split(".")[1]} không được bỏ trống`),
    phoneNumber: yup.string().max(50, ({ path }) => `${path.split(".")[1]} quá dài`).matches(/(84|0[3|5|7|8|9])+([0-9]{8})\b/g, 'Số điện thoại không hợp lệ'),
    address: yup.string().max(500,({ path }) => `${path.split(".")[1]} quá dài`).required(({ path }) => `${path.split(".")[1]} không được bỏ trống`),
    email: yup.string().email('Email không hợp lệ').max(50,({ path }) => `${path.split(".")[1]} quá dài`).required(({ path }) => `${path.split(".")[1]} không được bỏ trống`),
    birthday:yup.date().max(new Date(),"Ngày sinh không hợp lệ"),
    isDeleted: yup.boolean().required(({ path }) => `${path.split(".")[1]} không được bỏ trống`),
  }),
});
module.exports = {
  validationCreateSchema,
};
