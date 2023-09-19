const yup = require("yup");
const validationLoginSchema = yup.object().shape({
  body: yup.object({
    email: yup.string().email().min(3,"UserName quá ngắn").max(50, "UserName quá dài").required(({ path }) => `${path.split(".")[1]} không được bỏ trống`),
    password: yup.string().min(3,"Password quá ngắn").max(50, "Password quá dài").required(({ path }) => `${path.split(".")[1]} không được bỏ trống`),
  }),
});
const validationRefreshTokenSchema = yup.object().shape({
  body: yup.object({
    refreshToken: yup.string().required(({ path }) => `${path.split(".")[1]} không được bỏ trống`),
  }),
})
module.exports = {
  validationLoginSchema,
  validationRefreshTokenSchema
};
