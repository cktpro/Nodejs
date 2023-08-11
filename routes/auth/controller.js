const { Customer } = require("../../models");
const bcrypt = require("bcryptjs");
module.exports = {
  checkLogin: async (req, res, next) => {
    const { username, password } = req.body;

    try {
      const result = await Customer.findOne({ email: username });
      if (result) {
        const salt = await bcrypt.genSalt(10);
        const hash = await bcrypt.hash(password, salt);
        const isCorrectPass = await result.isValidPass(password);
        console.log('◀◀◀ isCorrectPass ▶▶▶',isCorrectPass);
        if(isCorrectPass){
          return res.send({
            code: 200,
            mesage: "Login thành công",
            payload: result,
          });
        }
      }
      return res.status(404).json({
        code: 404,
        mesage: "Tài khoản hoặc mật khẩu không chính xác",
      });
    } catch (err) {
      res.send(400, {
        mesage: "Thất bại",
        error: err,
      });
    }
  },
};
