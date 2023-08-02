const yup = require("yup");
const validationCreateSchema = yup.object().shape({
  body: yup.object({
    name: yup.string().max(50, "Tên quá dài").required(({ path }) => `${path.split(".")[1]} không được bỏ trống`),
    description: yup.string().max(500, "Mô tả quá dài"),
    isDeleted: yup.boolean(),
  }),
});
module.exports = {
  validationCreateSchema,
};
