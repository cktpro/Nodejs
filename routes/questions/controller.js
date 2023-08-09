const { getQueryDateTime, fuzzySearch } = require("../../helper");
const {
  Product,
  Category,
  Supplier,
  Customer,
  Order,
  Employee,
} = require("../../models");
const { validationStatusSchema } = require("./validation");
module.exports = {
  question1: async (req, res, next) => {
    try {
      const conditionFind = { isDeleted: false, discount: { $lte: 10 } };
      const result = await Product.find(conditionFind);
      res.send({
        code: 200,
        message: "Thành công",
        payload: result,
      });
    } catch (err) {
      res.status(500).json({
        code: 500,
        message: "Thất bại",
        error: err,
      });
    }
  },
  question1b: async (req, res, next) => {
    const conditionFind = { isDeleted: false, discount: { $lte: 10 } };
    const result = await Product.find(conditionFind)
      .populate("category")
      .populate("supplier")
      .lean();
    try {
      res.send(200, {
        message: "Thành công",
        payload: result,
      });
    } catch (err) {
      res.send(500, {
        message: "Thất bại",
        error: err,
      });
    }
  },
  question2: async (req, res, next) => {
    try {
      const { stock, populate } = req.query;
      const conditionSearch = { isDeleted: false, stock: { $lte: stock } };
      if (populate === true) {
        let result = await Product.find(conditionSearch)
          .populate("category")
          .populate("supplier")
          .lean();
        return res.send(200, {
          message: "Thành công",
          payload: result,
        });
      }
      let result = await Product.find(conditionSearch);

      return res.send(200, {
        message: "Thành công",
        payload: result,
      });
    } catch (err) {
      return res.send(404, {
        message: "Thất bại",
        error: err,
      });
    }
  },
  question3: async (req, res, next) => {
    const { discountedPrice } = req.query;
    // discountedPrice= (100-discount)* price/100
    const s = { $subtract: [100, "$discount"] }; //(100-discount)
    const m = { $multiply: ["$price", s] }; //(100-discount)* price
    const d = { $divide: [m, 100] }; //(100-discount)* price/100
    const conditionFind = { $expr: { $lte: [d, 1000] } };
    console.log("◀◀◀ condtionFind ▶▶▶", conditionFind);
    try {
      const result = await Product.aggregate()
        .addFields({ disPrice: d })
        .match({ $expr: { $lte: ["$disPrice", 1000] } })
        .project({
          categoryId: 0,
          supplierId: 0,
          description: 0,
          isDeleted: 0,
        });
      // let results = await Product.aggregate([
      //   {
      //     $match: { $expr: { $lte: [d, 1000] }},
      //   },
      // ]);
      // --------------------------------
      // const result =await Product.find(conditionFind)
      // if(result.length >0){
      //   return res.send({
      //   code: 200,
      //   mesage: 'Thành công',
      //   payload: result,
      //   });
      // }
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
  question4: async (req, res, next) => {
    const { address } = req.query;
    let conditionFind = {};
    if (address)
      conditionFind = {
        address: { $regex: new RegExp(`${address}`), $options: "i" },
      };
    console.log("◀◀◀ con ▶▶▶", address);
    try {
      const result = await Customer.find(conditionFind);
      if (result.length > 0) {
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
      return res.status(500).send({
        code: 500,
        mesage: "Thất bại",
        error: err,
      });
    }
  },
  question5: async (req, res, next) => {
    const { year } = req.query;
    const conditionFind = { isDeleted: false };
    if (year) conditionFind.$expr = { $eq: [{ $year: "$birthday" }, year] };
    try {
      let result = await Customer.find(conditionFind);
      if (result) {
        return res.send(200, {
          message: "Thành công",
          payload: result,
        });
      }
      return res.send(404, {
        message: "Không tìm thấy",
      });
    } catch (err) {
      return res.send(400, {
        message: "Thất bại",
        error: err,
      });
    }
  },
  question6: async (req, res, next) => {
    const { date } = req.query;
    let today;

    if (!date) {
      today = new Date();
    } else {
      today = new Date(date);
    }
    const conditionFind = {
      $expr: {
        $and: [
          {
            $eq: [{ $dayOfMonth: "$birthday" }, { $dayOfMonth: today }],
          },
          { $eq: [{ $month: "$birthday" }, { $month: today }] },
        ],
      },
    };
    try {
      let result = await Customer.find(conditionFind);
      if (result.length > 0) {
        return res.send(200, {
          message: "Thành công",
          payload: result,
        });
      }
      return res.send(404, {
        message: "Không tìm thấy",
      });
    } catch (err) {
      return res.send(400, {
        message: "Thất bại",
        error: err,
      });
    }
  },
  question7: async (req, res, next) => {
    const { status } = req.query;
    let conditionFind = { status: status };
    console.log("◀◀◀ conditionFind ▶▶▶", conditionFind);
    try {
      const result = await Order.find(conditionFind);
      if (result.length > 0) {
        return res.send({
          code: 200,
          mesage: "Thành công",
          payload: result,
        });
      }
      return res.status(400).json({
        code: 404,
        mesage: "Không tìm thấy",
      });
    } catch (error) {
      return res.status(500).json({
        code: 500,
        mesage: "Thất bại",
        error: error,
      });
    }
  },
  question8_10: async (req, res, next) => {
    const { status, fromDate, toDate, today } = req.query;
    let conditionFind = {};
    if (status) conditionFind.status = status;
    if (fromDate && toDate) {
      const startDate = new Date(fromDate);
      const endDate = new Date(toDate);
      conditionFind.$expr = {
        $and: [
          { $gte: ["$createdDate", startDate] },
          { $lte: ["$createdDate", endDate] },
        ],
      };
    } else if (today) {
      const date = new Date(today);
      const year = date.getFullYear();
      const month = date.getMonth() + 1;
      const day = date.getDate();
      conditionFind.$expr = {
        $and: [
          { $eq: [{ $year: "$createdDate" }, year] },
          { $eq: [{ $month: "$createdDate" }, month] },
          { $eq: [{ $dayOfMonth: "$createdDate" }, day] },
        ],
      };
      console.log("◀◀◀ conditionFind ▶▶▶", conditionFind);
      try {
        const result = await Order.find(conditionFind);
        if (result.length > 0) {
          return res.send({
            code: 200,
            mesage: "Thành công",
            payload: result,
          });
        }
        return res.status(400).json({
          code: 404,
          mesage: "Không tìm thấy",
        });
      } catch (error) {
        return res.status(500).json({
          code: 500,
          mesage: "Thất bại",
          error: error,
        });
      }
    }
  },
  question11_13: async (req, res, next) => {
    const { payment, address } = req.query;
    let conditionFind = {};

    if (payment) conditionFind.paymentType = payment;
    else if (address) conditionFind.shippingAddress = new RegExp(address);
    try {
      const result = await Order.find(conditionFind);
      if (result.length > 0) {
        return res.send({
          code: 200,
          mesage: "Thành công",
          payload: result,
        });
      }
      return res.status(400).json({
        code: 404,
        mesage: "Không tìm thấy",
      });
    } catch (error) {
      return res.status(500).json({
        code: 500,
        mesage: "Thất bại",
        error: error,
      });
    }
  },
  question14: async (req, res, next) => {
    const { date } = req.query;
    let today;
    if (date) today = new Date(date);
    else today = new Date();
    try {
      const conditionFind = {
        $expr: {
          $and: [
            { $eq: [{ $month: "$birthday" }, { $month: today }] },
            { $eq: [{ $dayOfMonth: "$birthday" }, { $dayOfMonth: today }] },
          ],
        },
      };
      console.log("◀◀◀ conditionFInd ▶▶▶", today);
      const result = await Employee.find(conditionFind);
      if (result.length > 0) {
        return res.send({
          code: 200,
          mesage: "Thành công",
          payload: result,
        });
      }
      return res.status(400).json({
        code: 404,
        mesage: "Không tìm thấy",
      });
    } catch (error) {
      return res.status(500).json({
        code: 500,
        mesage: "Thất bại",
        error: error,
      });
    }
  },
  question15: async (req, res, next) => {
    const { name } = req.query;
    console.log("◀◀◀ name ▶▶▶", name);
    try {
      const conditionFind = { name: { $in: name } };
      const result = await Supplier.find(conditionFind);
      if (result.length > 0) {
        return res.send({
          code: 200,
          mesage: "Thành công",
          payload: result,
        });
      }
      return res.status(400).json({
        code: 404,
        mesage: "Không tìm thấy",
      });
    } catch (error) {
      return res.status(500).json({
        code: 500,
        mesage: "Thất bại",
        error: error,
      });
    }
  },
  question16: async (req, res, next) => {
    try {
      const result = await Order.find().populate("customer");
      if (result.length > 0) {
        return res.send({
          code: 200,
          mesage: "Thành công",
          payload: result,
        });
      }
      return res.status(400).json({
        code: 404,
        mesage: "Không tìm thấy",
      });
    } catch (error) {
      return res.status(500).json({
        code: 500,
        mesage: "Thất bại",
        error: error,
      });
    }
  },
  question17: async (req, res, next) => {
    try {
      const result = await Product.find()
        .populate("category")
        .populate("supplier");
      if (result.length > 0) {
        return res.send({
          code: 200,
          mesage: "Thành công",
          payload: result,
        });
      }
      return res.status(400).json({
        code: 404,
        mesage: "Không tìm thấy",
      });
    } catch (error) {
      return res.status(500).json({
        code: 500,
        mesage: "Thất bại",
        error: error,
      });
    }
  },
  question18: async (req, res, next) => {
    try {
      let result = await Category.aggregate()
        .lookup({
          //same as inner join
          from: "products",
          localField: "_id",
          foreignField: "categoryId",
          as: "products",
        })
        .unwind({
          path: "$products",
          preserveNullAndEmptyArrays: true,
        })
        .group({
          _id: "$_id",
          name: { $first: "$name" },
          description: { $first: "$description" },
          totalProduct: {
            $sum: {
              $cond: { if: { $gt: ["$products", 0] }, then: 1, else: 0 },
            },
          },
          // count:
        })
        .sort({
          totalProduct: -1, //1: asc sort  2:desc sort
        });
      if (result.length > 0) {
        return res.send({
          code: 200,
          mesage: "Thành công",
          payload: result,
        });
      }
      return res.status(400).json({
        code: 404,
        mesage: "Không tìm thấy",
      });
    } catch (error) {
      return res.status(500).json({
        code: 500,
        mesage: "Thất bại",
        error: error,
      });
    }
  },
  question19: async (req, res, next) => {
    try {
      let result = await Supplier.aggregate()
        .lookup({
          from: "products",
          localField: "_id",
          foreignField: "supplierId",
          as: "products",
        })
        .unwind({
          path: "$products",
          preserveNullAndEmptyArrays: true,
        })
        .group({
          _id: "$_id",
          name: { $first: "$name" },
          email: { $first: "$email" },
          phoneNumbber: { $first: "$phoneNumber" },
          totalProduct: {
            $sum: {
              $cond: { if: { $gt: ["$products", 0] }, then: 1, else: 0 },
            },
          },
        })
        .sort({
          totalProduct: -1,
        });
      if (result.length > 0) {
        return res.send({
          code: 200,
          mesage: "Thành công",
          payload: result,
        });
      }
      return res.status(400).json({
        code: 404,
        mesage: "Không tìm thấy",
      });
    } catch (error) {
      return res.status(500).json({
        code: 500,
        mesage: "Thất bại",
        error: error,
      });
    }
  },
  question20: async (req, res, next) => {
    try {
      const { fromDate, toDate, status } = req.query;

      let conditionFind = {};
      if (status) {
        conditionFind.status = status;
      }
      if (fromDate && toDate) {
        const startDate = new Date(fromDate);
        const endDate = new Date(toDate);
        conditionFind.$expr = {
          $and: [
            { $gte: ["$createdDate", startDate] },
            { $lte: ["$createdDate", endDate] },
          ],
        };
      }
      let result = await Order.aggregate()
        .match({ ...conditionFind })
        .unwind("orderDetails")
        .lookup({
          from: "products",
          localField: "orderDetails.productId",
          foreignField: "_id",
          as: "orderDetails.product",
        })
        .unwind("$orderDetails.product")
        .group({
          _id: "$orderDetails.productId",
          name: { $first: "$orderDetails.product.name" },
          price: { $first: "$orderDetails.product.price" },
          discount: { $first: "$orderDetails.product.discount" },
          // sold:{$first:"$orderDetails.quantity"},
          total: { $sum: 1 },
        });
      if (result.length > 0) {
        return res.send({
          code: 200,
          mesage: "Thành công",
          payload: result,
        });
      }
      return res.status(400).json({
        code: 404,
        mesage: "Không tìm thấy",
      });
    } catch (error) {
      return res.status(500).json({
        code: 500,
        mesage: "Thất bại",
        error: error,
      });
    }
  },
  question21: async (req, res, next) => {
    try {
      const { fromDate, toDate } = req.query;
      let conditionFind = {};
      if (fromDate && toDate) {
        const startDate = new Date(fromDate);
        const endDate = new Date(toDate);
        conditionFind.$expr = {
          $and: [
            { $gte: ["$createdDate", startDate] },
            { $lte: ["$createdDate", endDate] },
          ],
        };
      }
      const result = await Order.aggregate()
        .match({ ...conditionFind })
        .lookup({
          from: "customers",
          localField: "customerId",
          foreignField: "_id",
          as: "customer",
        }).unwind('$customer')
        .group({
          _id:'$customer._id',
          firstName:{$first:'$customer.firstName'},
          lastName:{$first:'$customer.lastName'},
          email:{$first:'$customer.email'},
          phoneNumbber:{$first:'$customer.phoneNumber'},
          address:{$first:'$customer.address'},
         birthday:{$first:'$customer.birthday'},
        });
      if (result.length > 0) {
        return res.send({
          code: 200,
          mesage: "Thành công",
          payload: result,
        });
      }
      return res.status(400).json({
        code: 404,
        mesage: "Không tìm thấy",
      });
    } catch (error) {
      return res.status(500).json({
        code: 500,
        mesage: "Thất bại",
        error: error,
      });
    }
  },
};
