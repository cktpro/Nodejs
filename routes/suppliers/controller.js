const { Supplier } = require("../../models");
const {
  fuzzySearch,
  // combineObjects,
} = require("../../helper");
module.exports = {
  getList: async (req, res, next) => {
    const{page,pageSize}=req.query
    const pages=page || 1
    const limit = pageSize || 10
    const skip= ((pages - 1) * limit)
    try {
      const conditionFind={isDeleted:false}
      const result = await Supplier.find(conditionFind).skip(skip).limit(limit);
      const total = await Supplier.countDocuments(conditionFind)
      res.send(200, {
        message: "Thành công",
        payload: result,
        total:total
      });
    } catch (err) {
      res.send(400, {
        message: "Thất bại",
        error: err,
      });
    }
  },
  search: async (req, res, next) => {
    try {
      const { name } = req.query;
      const conditionSearch = { isDeleted: false };
      if (name) conditionSearch.name = fuzzySearch(name);
      let result = await Supplier.find(conditionSearch);
      res.send(200, {
        message: "Thành công",
        payload: result
      });
    } catch (err) {
      res.send(404, {
        message: "Thất bại",
        error: err,
      });
    }
  },
  getDetail: async (req, res, next) => {
    const { id } = req.params;
    const itemDetail = itemList.find(
      (item) => item.id.toString() === id.toString()
    );
    if (itemDetail) {
      if (itemDetail.isDeleted) {
        return res.send(400, {
          message: "Sản phẩm đã bị xóa",
        });
      }
      return res.send(200, {
        message: "Thành công",
        payload: itemDetail,
      });
    }
    return res.send(404, {
      message: "Không tìm thấy",
    });
  },
  create: async (req, res, next) => {
    try {
      const { name, email, phoneNumber, address, isDeleted } = req.body;
      const newRecord = new Supplier({
        name,
        email,
        phoneNumber,
        address,
        isDeleted,
      });
      let result = await newRecord.save();
      return res.send(200, {
        message: "Thành công",
        payload: result,
      });
    } catch (err) {
      return res.send(400, {
        message: "Thất bại",
        error: err,
      });
    }
  },
  update: async (req, res, next) => {
    const { id } = req.params;
    const { name, email, phoneNumber, address, isDeleted } = req.body;
    try {
      let result = await Supplier.findOneAndUpdate(
        { _id: id, isDeleted: false },
        { name, email, phoneNumber, address, isDeleted },
        { new: true }
      );
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
  // updatePatch: async (req, res, next) => {
  //   const { id } = req.params;
  //   const { name, price, description, discount } = req.body;
  //   let updateData = {};
  //   let isErr = false;
  //   const newProductList = itemList.map((item) => {
  //     if (item.id.toString() === id.toString()) {
  //       if (item.isDeleted) {
  //         isErr = true;
  //         return item;
  //       } else {
  //         updateData = combineObjects(item, {
  //           name,
  //           price,
  //           description,
  //           discount,
  //         });
  //         return updateData;
  //       }
  //     }
  //     return item;
  //   });
  //   if (!isErr) {
  //     await writeFileSync(patch, newProductList);
  //     return res.send(200, {
  //       message: "Thành công",
  //       payload: updateData,
  //     });
  //   }
  //   return res.send(400, {
  //     message: "Cập nhật không thành công",
  //   });
  // },
  softDelete: async (req, res, next) => {
    const { id } = req.params;
    try {
      const result = await Supplier.findByIdAndUpdate(
        id,
        { isDeleted: true },
        { new: true }
      );
      if (result) {
        return res.send(200, {
          message: "Thành công xóa",
        });
      }
      return res.send(400, {
        message: "Thất bại",
      });
    } catch (error) {
      return res.send(400, {
        message: "Thất bại",
        error: error,
      });
    }
  },
  // hardDelete: async(req,res,next)=>{
  //   const {id} =req.params;
  //   const newProductList=products.filter((item)=>item.id.toString()!==id.toString())
  //   await writeFileSync(patch,newProductList)
  //   return res.send(200, {
  //       message: "Thành công xóa",
  //     });
  // }
};
