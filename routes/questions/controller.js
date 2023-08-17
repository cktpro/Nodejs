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
const { getDiscountedPrice } = require("../../helper");
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
        })
        .unwind("$customer")
        .group({
          _id: "$customer._id",
          firstName: { $first: "$customer.firstName" },
          lastName: { $first: "$customer.lastName" },
          email: { $first: "$customer.email" },
          phoneNumbber: { $first: "$customer.phoneNumber" },
          address: { $first: "$customer.address" },
          birthday: { $first: "$customer.birthday" },
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
  question22: async (req, res, next) => {
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
    try {
      const result = await Order.aggregate()
        .match({ ...conditionFind })
        .lookup({
          from: "customers",
          localField: "customerId",
          foreignField: "_id",
          as: "customer",
        })
        .unwind("orderDetails")
        .addFields({
          totalPrice: {
            $divide: [
              {
                $multiply: [
                  { $subtract: [100, "$orderDetails.discount"] },
                  "$orderDetails.price",
                ],
              },
              100,
            ],
          },
        })
        .unwind("customer")
        .group({
          _id: "$customerId",
          firstName: { $first: "$customer.firstName" },
          lastName: { $first: "$customer.lastName" },
          email: { $first: "$customer.email" },
          phoneNumbber: { $first: "$customer.phoneNumber" },
          address: { $first: "$customer.address" },
          total: { $sum: "$totalPrice" },
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
  question23: async (req, res, next) => {
    try {
      const result = await Order.aggregate()
        .unwind("orderDetails")
        .addFields({
          totalPrice: {
            $divide: [
              {
                $multiply: [
                  { $subtract: [100, "$orderDetails.discount"] },
                  "$orderDetails.price",
                ],
              },
              100,
            ],
          },
        })
        .group({
          _id: "$_id",
          createdDate: { $first: "$createdDate" },
          status: { $first: "$status" },
          Total: { $sum: "$totalPrice" },
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
  question24: async (req, res, next) => {
    try {
      const result = await Order.aggregate()
        .unwind("orderDetails")
        .lookup({
          from: "employees",
          localField: "employeeId",
          foreignField: "_id",
          as: "employee",
        })
        .unwind("employee")
        .group({
          _id: "$employee._id",
          firstName: { $first: "$employee.firstName" },
          lastName: { $first: "$employee.lastName" },
          email: { $first: "$employee.email" },
          phoneNumber: { $first: "$employee.phoneNumber" },
          address: { $first: "$employee.address" },
          birthday: { $first: "$employee.birthday" },
          Total: {
            $sum: {
              $multiply: [
                {
                  $divide: [
                    {
                      $multiply: [
                        { $subtract: [100, "$orderDetails.discount"] },
                        "$orderDetails.price",
                      ],
                    },
                    100,
                  ],
                },
                "$orderDetails.quantity",
              ],
            },
          },
        });
      if (result) {
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
  question25: async (req, res, next) => {
    try {
      const result = await Product.aggregate()
        .lookup({
          from: "orders",
          localField: "_id",
          foreignField: "orderDetails.productId",
          as: "order",
        })
        .match({ order: { $size: 0 } })
        .project({
          name: 1,
          price: 1,
          stock: 1,
          discount: 1,
          discountedPrice: getDiscountedPrice("discount", "price"),
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
  question26: async (req, res, next) => {
    const { fromDate, toDate } = req.query;
    try {
      let conditionFind = {};
      if (fromDate && toDate) {
        const startDate = new Date(fromDate);
        const endDate = new Date(toDate);
        // conditionFind.$expr={$and:[{orders:{$ne:null}},{$or:[{$lte:['orders.createdDate',startDate]},{$gte:['orders.createdDate',endDate]}]}]}
        conditionFind.$or = [
          { orders: null },
          {
            $and: [
              { orders: { $ne: null } },
              {
                $or: [
                  { "orders.createdDate": { $lte: startDate } },
                  { "orders.createdDate": { $gte: endDate } },
                ],
              },
            ],
          },
        ];
      }
      const result = await Product.aggregate()
        .lookup({
          from: "orders",
          localField: "_id",
          foreignField: "orderDetails.productId",
          as: "orders",
        })
        .unwind({
          path: "$orders",
          preserveNullAndEmptyArrays: true,
        })
        .match({ ...conditionFind })
        .lookup({
          from: "suppliers",
          localField: "supplierId",
          foreignField: "_id",
          as: "supplier",
        })
        .unwind("supplier")
        .group({
          _id: "$supplierId",
          name: { $first: "$supplier.name" },
          email: { $first: "$supplier.email" },
          phoneNumber: { $first: "$supplier.phoneNumber" },
          address: { $first: "$supplier.address" },
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
  question27: async (req, res, next) => {
    try {
      const result = await Employee.aggregate()
        .lookup({
          from: "orders",
          localField: "_id",
          foreignField: "employeeId",
          as: "orders",
        })
        .unwind("orders")
        .unwind("orders.orderDetails")
        .group({
          _id: "$_id",
          firstName: { $first: "$firstName" },
          lastName: { $first: "$lastName" },
          email: { $first: "$email" },
          phoneNumber: { $first: "$phoneNumber" },
          address: { $first: "$address" },
          sales: {
            $sum: getDiscountedPrice(
              "orders.orderDetails.discount",
              "orders.orderDetails.price",
              "orders.orderDetails.quantity"
            ),
          },
        })
        .sort({
          sales: -1,
        })
        .limit(2)
        .skip(0);
      if (result) {
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
  question28: async (req, res, next) => {
    const { fromDate, toDate } = req.query;
    try {
      let conditionFind = {};
      if ((fromDate && toDate)) {
        const startDate = new Date(fromDate);
        const endDate = new Date(toDate);
        conditionFind.$and=[{'orders.createdDate':{$lte:endDate}},{'orders.createdDate':{$gte:startDate}}]
        console.log('◀◀◀  ▶▶▶',conditionFind);
      }
      let result = await Customer.aggregate().lookup({
        from:'orders',
        localField:'_id',
        foreignField:'customerId',
        as:'orders'
      }).unwind({
        path:"$orders",
        preserveNullAndEmptyArrays:true
      }).match({...conditionFind}).unwind({
        path:'$orders.orderDetails',
        preserveNullAndEmptyArrays:true
      }).group({
        _id: '$_id',
            firstName: {$first:'$firstName'},
            lastName: {$first:'$lastName'},
            phoneNumber: {$first:'$phoneNumber'},
            address: {$first:'$address'},
            email: {$first:'$email'},
            birthday: {$first:'$birthday'},
            total:{$sum:getDiscountedPrice("orders.orderDetails.discount","orders.orderDetails.price","orders.orderDetails.quantity")}
      })
      if(result.length>0){
        return res.send({
        code: 200,
        mesage: 'Thành công',
        payload: result,
        });
      }
      return res.status(400).json({
      code: 404,
      mesage: 'Không tìm thấy',
      });
    } catch (error) {
      return res.status(500).json({
      code: 500,
      mesage: 'Thất bại',
      error: error,
      });
    }
  },
  question29:async(req,res,next)=>{
    try {
      const result=await Product.distinct("discount")
      if(result.length>0){
        return res.send({
        code: 200,
        mesage: 'Thành công',
        payload: result,
        });
      }
      return res.status(400).json({
      code: 404,
      mesage: 'Không tìm thấy',
      });
    } catch (error) {
      return res.status(500).json({
      code: 500,
      mesage: 'Thất bại',
      error: error,
      });
    }
  },
  question30:async(req,res,next)=>{
    try {
      const result=await Category.
      aggregate().lookup({
        from:'products',
        localField:'_id',
        foreignField:'categoryId',
        as:'products'
      }).unwind({
        path:'$products',
        preserveNullAndEmptyArrays:true
      }).lookup({
        from:'orders',
        localField:'products._id',
        foreignField:'orderDetails.productId',
        as:'orders'
      }).unwind({
        path:'$orders',
        preserveNullAndEmptyArrays:true
      })
      .unwind({
        path: '$orders.orderDetails',
        preserveNullAndEmptyArrays: true,
      }).addFields({
        total:getDiscountedPrice("orders.orderDetails.discount","orders.orderDetails.price","orders.orderDetails.quantity")
      }).group(
        {
          _id:'$_id',
          name:{$first:'$name'},
          description:{$first:'$description'},
          sales:{ $sum:'$total'}

        }
      ).sort({
        sales:-1
      })
      if(result.length>0){
        return res.send({
        code: 200,
        mesage: 'Thành công',
        payload: result,
        });
      }
      return res.status(400).json({
      code: 404,
      mesage: 'Không tìm thấy',
      });
    } catch (error) {
      return res.status(500).json({
      code: 500,
      mesage: 'Thất bại',
      error: error,
      });
    }
  }
};
