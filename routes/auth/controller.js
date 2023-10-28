const { Customer } = require("../../models");
const bcrypt = require("bcryptjs");
const {
  generateToken,
  generateRefreshToken,
} = require("../../helper/jwtHelper");
const JWT = require("jsonwebtoken");
const jwtSetting = require("../../constants/jwtSetting");
module.exports = {
  checkLogin: async (req, res, next) => {
    try {
      const {
        _id,
        firstName,
        lastName,
        phoneNumber,
        address,
        email,
        birthday,
        updatedAt,
      } = req.user;
      const token = generateToken({
        _id,
        firstName,
        lastName,
        phoneNumber,
        address,
        email,
        birthday,
        updatedAt,
      });
      const refreshToken = generateRefreshToken(_id);
      return res.send({
        code: 200,
        mesage: "Login thành công",
        payload: {
          token: token,
          refreshToken: refreshToken,
        },
      });
    } catch (err) {
      res.send(400, {
        mesage: "Thất bại",
        error: err,
      });
    }
  },
  checkRefreshToken: async (req, res, next) => {
    const { refreshToken } = req.body;
    try {
      JWT.verify(refreshToken, jwtSetting.SECRET, async (err, data) => {
        if (err) {
          return res.status(401).json({
            code: 400,
            mesage: "refreshToken is invalid",
          });
        } else {
          const { id } = data;
          const customer = await Customer.findOne({
            _id:id,
            isDeleted:false,
          }).select("-password").lean()
          if(customer){
            return res.send({
              code: 200,
              mesage: 'Thành công',
              payload: customer,
              });
          }
          return res.status(400).json({
          code: 400,
          mesage: 'refreshToken is invalid',
          });
        }
      });
    } catch (error) {
      return res.status(500).json({
        code: 500,
        mesage: "Thất bại",
        error: error,
      });
    }
  },
  basicLogin: async (req, res, next) => {
    try {
      const user = await Customer.findById(req.user._id)
        .select("-password")
        .lean();
      const token = generateToken(user);
      // const refreshToken = generateRefreshToken(user._id);

      res.json({
        token,
        // refreshToken,
      });
    } catch (err) {
      res.sendStatus(400);
    }
  },

  getMe: async (req, res, next) => {
    try {
      return res.send({
      code: 200,
      mesage: 'Thành công',
      payload: req.user,
      });
    } catch (err) {
      return res.status(500).json({
      code: 500,
      mesage: 'Thất bại',
      error: err,
      });
    }
  },
};
