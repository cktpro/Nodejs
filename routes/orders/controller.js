const { Order, Customer, Employee, Product } = require('../../models');
const { asyncForEach,fuzzySearch } = require('../../helper');
module.exports = {
  getList: async (req, res, next) => {
    try {
      const result = await Order.find();

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
      const result = Order.find(conditionFind);
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
      const result = await Order.findOne({ _id: id});
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
  create: async function (req, res, next) {
    try {
      const data = req.body;

      const { customerId, employeeId, orderDetails } = data;

      const getCustomer = Customer.findOne({
        _id: customerId,
        isDeleted: false,
      });

      const getEmployee = Employee.findOne({
        _id: employeeId,
        isDeleted: false,
      });

      const [customer, employee] = await Promise.all([
        getCustomer,
        getEmployee,
      ]);

      const errors = [];
      if (!customer || customer.isDelete)
        errors.push('Khách hàng không tồn tại');
      if (!employee || employee.isDelete)
        errors.push('Nhân viên không tồn tại');

      await asyncForEach(orderDetails, async (item) => {
        const product = await Product.findOne({
          _id: item.productId,
          isDeleted: false,
          // stock: { $gte : item.quantity },
        });

        if (!product) errors.push(`Sản phẩm ${item.productId} không khả dung`);

        if (product && product.stock < item.quantity) errors.push(`Số lượng sản phẩm ${item.productId} không khả dụng`);
      });

      if (errors.length > 0) {
        return res.status(404).json({
          code: 404,
          message: 'Lỗi',
          errors,
        });
      }

      const newItem = new Order(data);

      let result = await newItem.save();

      await asyncForEach(result.orderDetails, async (item) => {
        await Product.findOneAndUpdate(
          { _id: item.productId },
          { $inc: { stock: -item.quantity } }
          );
      });

      return res.send({
        code: 200,
        message: 'Tạo thành công',
        payload: result,
      });
    } catch (err) {
      console.log('««««« err »»»»»', err);
      return res.status(500).json({ code: 500, error: err });
    }
  },
  updateStatus:async(req,res,next)=>{
    try {
      const { id } = req.params;
      const { status } = req.body;

      let found = await Order.findOne({
        _id: id,
        $nor: [{ status: 'CANCELED' }, { status: 'REJECTED' }, { status: 'COMPLETED' }]
      });

      if (found) {
        const result = await Order.findByIdAndUpdate(
          found._id,
          { status },
          { new: true },
        );
        if(status==='CANCELED' || status==='REJECTED')
        await asyncForEach(result.orderDetails, async (item) => {
          await Product.findOneAndUpdate(
            { _id: item.productId },
            { $inc: { stock: +item.quantity } }
            );
        });

        return res.send({
          code: 200,
          payload: result,
          message: 'Cập nhật trạng thái thành công',
        });
      }

      return res.status(410).send({ code: 404, message: 'Thất bại' });
    } catch (err) {
      return res.status(500).json({ code: 500, error: err });
    }
  },
  updateShippedDate:async(req,res,next)=>{
    try {
      const { id } = req.params;
      const { shippedDate } = req.body;

      let found = await Order.findOne({
        _id: id,
        $nor: [{ status: 'CANCELED' }, { status: 'REJECTED' }, { status: 'COMPLETED' }]
      });

      if (found) {
        const result = await Order.findByIdAndUpdate(
          found._id,
          { shippedDate },
          { new: true },
        );

        return res.send({
          code: 200,
          message: 'Cập nhật ngày giao thành công',
          payload: result,
        });
      }

      return res.status(410).send({ code: 404, message: 'Thất bại' });
    } catch (err) {
      return res.status(500).json({ code: 500, error: err });
    }
  },
  updateEmployee: async function (req, res, next) {
    try {
      const { id } = req.params;
      const { employeeId } = req.body;

      let checkOrder = await Order.findOne({
        _id: id,
        $or: [{ status: 'DELIVERING' }, { status: 'WAITING' }]
      });

      if (!checkOrder) {
        return res.status(404).json({
          code: 404,
          message: 'Đơn hàng không thể cập nhật',
        });
      }
      
      if (checkOrder.employeeId !== employeeId) {
        const employee = await Employee.findOne({
          _id: employeeId,
          isDeleted: false,
        });
  
        if (!employee) {
          return res.status(404).json({
            code: 404,
            message: 'Nhân viên không tồn tại',
          });
        }
  
        const updateOrder = await Order.findByIdAndUpdate(id, { employeeId }, {
          new: true,
        });
  
        if (updateOrder) {
          return res.send({
            code: 200,
            message: 'Cập nhật thành công',
            payload: updateOrder,
          });
        }
  
        return res.status(404).send({ code: 404, message: 'Không tìm thấy' });
      }

      return res.send({ code: 400, message: 'Không thể cập nhật' });
    } catch (error) {
      return res.status(500).json({ code: 500, error: err });
    }
  },
  softDelete: async (req, res, next) => {
    const { id } = req.params;
    try {
      const result = await Order.findByIdAndUpdate(
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
