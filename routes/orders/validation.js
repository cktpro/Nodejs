const yup = require("yup");
const ObjectId = require("mongodb").ObjectId;
const updateStatusSchema = yup.object({
  body: yup.object({
    // status: yup.string().test('validationStatus', 'Trạng thái không hợp lệ', (value) => {
    //     if (['WAITING', 'COMPLETED', 'CANCELED', 'REJECTED', 'DELIVERING'].includes(value)) {
    //       return true;
    //     }
    //     return false;
    // }),
    status: yup
      .string()
      .required()
      .oneOf(
        ["WAITING", "COMPLETED", "CANCELED", "REJECTED", "DELIVERING"],
        "Trạng thái không hợp lệ"
      ),
  }),
});
const validationCreateSchema = yup.object().shape({
  body: yup.object({
    createdDate: yup.date(),
    shippedDate: yup
      .date()
      .test("check date", "${path} ngày tháng không hợp lệ", (value) => {
        if (!value) return true;

        if (value && this.createdDate && value < this.createdDate) {
          return false;
        }

        if (value < new Date()) {
          return false;
        }

        return true;
      }),
    status: yup
      .string()
      .oneOf(["WAITING", "COMPLETED", "CANCELED", "REJECTED", "DELIVERING"])
      .required(({ path }) => `${path.split(".")[1]} không được bỏ trống`),

    description: yup.string(),
    shippingAddress: yup
      .string()
      .max(500, ({ path }) => `${path.split(".")[1]} quá dài`)
      .required(({ path }) => `${path.split(".")[1]} không được bỏ trống`),
    paymentType: yup
      .string()
      .oneOf(["CASH", "CREDIT_CARD"])
      .required(({ path }) => `${path.split(".")[1]} không được bỏ trống`),
    customerId: yup
      .string()
      .test("validationCustomerID", "ID sai định dạng", (value) => {
        return ObjectId.isValid(value);
      }),
    employeeId: yup
      .string()
      .test("validationCustomerID", "ID sai định dạng", (value) => {
        return ObjectId.isValid(value);
      }),
    orderDetails: yup.array().of(
      yup.object().shape({
        productId: yup
          .string()
          .test("validationProductID", "ID sai định dạng", (value) => {
            return ObjectId.isValid(value);
          }),

        quantity: yup.number().required().min(0),

        price: yup.number().required().min(0),

        discount: yup.number().required().min(0),
      })
    ),
  }),
});
const updateShippingDateSchema= yup.object({
  body: yup.object({
    shippedDate: yup
      .date()
      .test('check date', '${path} ngày tháng không hợp lệ', (value) => {
        if (!value) return true;

        if (value && this.createdDate && value < this.createdDate) {
          return false;
        }

        if (value < new Date()) {
          return false;
        }

        return true;
      }),
  }),
})
module.exports = {
  validationCreateSchema,
  updateStatusSchema,
  updateShippingDateSchema,
};
