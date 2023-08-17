const { Customer } = require("../../models");
const bcrypt = require("bcryptjs");
const {generateToken} = require('../../helper/jwtHelper');
module.exports = {
  checkLogin: async (req, res, next) => {
    try{
      const {
        _id,
        firstName,
        lastName,
        phoneNumber,
        address,
        email,
        birthday,
        updatedAt,
      } = req.user
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
          return res.send({
            code: 200,
            mesage: "Login thành công",
            payload: token,
          });
    } catch (err) {
      res.send(400, {
        mesage: "Thất bại",
        error: err,
      });
    }
  },
  basicLogin: async (req, res, next) => {
    try {
      const user = await Customer.findById(req.user._id).select('-password').lean();
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
      res.status(200).json({
        message: "Layas thoong tin thanfh coong",
        payload: req.user,
      });
    } catch (err) {
      res.sendStatus(500);
    }
  },
};
