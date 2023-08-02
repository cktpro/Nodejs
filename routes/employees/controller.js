const { Employee } = require("../../models");
const {
  fuzzySearch,
} = require("../../helper");
module.exports = {
  getList: async (req, res, next) => {
    try {
      const result = await Employee.find({ isDeleted: false });
      if (result) {
        return res.send({
          code: 200,
          mesage: "Thành công",
          payload: result,
        });
      }
      return res.send({
        code: 404,
        mesage: "Không tìm thấy",
      });
    } catch (err) {
      return res.send({
        code: 400,
        mesage: "Thất bại",
      });
    }
  },
  search: async (req, res, next) => {
    try {
      const { name } = req.query;
      const conditionFind = { isDeleted: false };
      if (name) conditionFind.name = fuzzySearch(name);
      const result = Employee.find(conditionFind);
      if (result) {
        return res.send({
          code: 200,
          mesage: "Thành công",
          payload: result,
        });
      }
      return res.send({
        code: 404,
        mesage: "Không tìm thấy",
      });
    } catch (error) {
      return res.send({
        code: 400,
        mesage: "Thất bại",
        error: error,
      });
    }
  },
  getDetail: async (req, res, next) => {
    const { id } = req.params;
    try {
      const result = await Employee.findOne({ _id: id,isDeleted: false  });
      if (result) {
        return res.send({
          code: 200,
          mesage: "Thành công",
          payload: result,
        });
      }
      return res.send({
        code: 404,
        mesage: "Thất bại",
      });
    } catch (err) {
      return res.send({
        code: 400,
        mesage: "Thất bại",
        error: err,
      });
    }
  },
  create: async (req, res, next) => {
    const {
      firstName,
      lastName,
      phoneNumber,
      address,
      email,
      birthday,
      isDeleted,
    } = req.body;
    try {
      const newRecord = new Employee({
        firstName,
        lastName,
        phoneNumber,
        address,
        email,
        birthday,
        isDeleted,
      });
      const result = await newRecord.save();
      if (result) {
        return res.send({
          code: 200,
          mesage: "Thành công",
          payload: result,
        });
      }
      return res.send({
        code: 400,
        mesage: "Thất bại",
      });
    } catch (err) {
      return res.send(400, {
        mesage: "Thất bại",
        error: err,
      });
    }
  },
  update: async (req, res, next) => {
    const { id } = req.params;
    const {
      firstName,
      lastName,
      phoneNumber,
      address,
      email,
      birthday,
      isDeleted,
    } = req.body;
    try {
      const result = await Employee.findOneAndUpdate(
        { _id: id },
        {
          firstName,
          lastName,
          phoneNumber,
          address,
          email,
          birthday,
          isDeleted,
        },
        { new: true }
      );
      if (result) {
        return res.send({
          code: 200,
          mesage: "Thành công",
          payload: result,
        });
      }
      return res.send({
        code: 400,
        mesage: "Thất bại",
      });
    } catch (err) {
      return res.send({
        code: 400,
        mesage: "Thất bại",
        error: err,
      });
    }
  },
  softDelete: async (req, res, next) => {
    const { id } = req.params;
    try {
      const result = await Employee.findByIdAndUpdate(
        id,
        { isDeleted: true },
        { new: true }
      );
      if (result) {
        return res.send({
          code: 200,
          mesage: "Thành công xóa",
        });
      }
      return res.send({
        code: 404,
        mesage: "Không tìm thấy",
      });
    } catch (err) {
      return res.send({
        code: 400,
        mesage: "Thất bại",
        error: err,
      });
    }
  },
};
