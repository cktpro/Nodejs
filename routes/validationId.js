const yup = require('yup');
const ObjectId = require('mongodb').ObjectId;

module.exports = yup.object({ // BỘ LỌC RIÊNG CHO TỪNG TRƯỜNG HỢP
  params: yup.object({
    id: yup.string().test('ID sai định dạng', '${path} không phải kiểu ObjectID', (value) => {
      return ObjectId.isValid(value);
    }),
  }),
});