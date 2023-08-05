const { Customer } = require("../../models");
const { fuzzySearch } = require("../../helper");
const { isError } = require("util");
module.exports = {
  getList: async (req, res, next) => {
    try {
      const result = await Customer.find({ isDeleted: false });
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
      const { name,yearOfBirthday,birthday } = req.query;
      const conditionFind = { isDeleted: false };
      if (name) {
        {
          conditionFind.$expr = {$or:[{firstName:fuzzySearch(name)},{lastName:fuzzySearch(name)}]};
        }
      }
      console.log('◀◀◀ conditionFind ▶▶▶',conditionFind);
      
      const result = await Customer.find(conditionFind);
      
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
        code: 500,
        mesage: "Thất bại",
        error: error,
      });
    }
  },
  getDetail: async (req, res, next) => {
    const { id } = req.params;
    try {
      const result = await Customer.findOne({ _id: id, isDeleted: false });
      console.log("◀◀◀ result ▶▶▶", result);
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
        error: isError,
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
      const newRecord = new Customer({
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
      const result = await Customer.findOneAndUpdate(
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
      const result = await Customer.findByIdAndUpdate(
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
