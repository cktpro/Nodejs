const yup = require("yup");
new Date()
const validationCreateSchema = yup.object().shape({
  body: yup.object({
    createdDate: yup.date().required(({ path }) => `${path.split(".")[1]} không được bỏ trống`),
    shippedDate: yup.date().required(({ path }) => `${path.split(".")[1]} không được bỏ trống`),
    status: yup.string().max(50, ({ path }) => `${path.split(".")[1]} quá dài`).default("WAITING"),
    description:yup.string(),
    shippingAddress:yup.string().max(500,({ path }) => `${path.split(".")[1]} quá dài`).required(({ path }) => `${path.split(".")[1]} không được bỏ trống`),
    paymentType: yup.string().max(20,({ path }) => `${path.split(".")[1]} quá dài`).required(({ path }) => `${path.split(".")[1]} không được bỏ trống`),
    customerId: yup.string(),
    employeeId:yup.string(),
    isDeleted: yup.boolean(),
  }),
});
module.exports = {
  validationCreateSchema,
};
