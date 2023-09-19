const { Category } = require("../../models");
const { fuzzySearch } = require("../../helper");
const { isError } = require("util");
module.exports = {
  getList: async (req, res, next) => {
    const{page,pageSize}=req.query
    const pages=page || 1
    const limit = pageSize || 10
     const skip= ((pages - 1) * limit)
     const conditionFind={isDeleted:false}
    try {
      const result = await Category.find(conditionFind)
        .skip(skip)
        .limit(limit);
      const total=await Category.countDocuments(conditionFind)
      res.send(200, {
        mesage: "Thành công",
        payload: result,
        total:total
      });
    } catch (err) {
      res.send(400, {
        mesage: "Thất bại",
        error: err,
      });
    }
  },
  search: async (req, res, next) => {
    const { name } = req.query;
    const searchRegex = fuzzySearch(name);
    try {
      const result = await Category.find({
        name: searchRegex,
        isDeleted: false,
      });
      if (result) {
        res.send(200, {
          mesage: "Thành công",
          payload: result,
        });
      }
      res.send(400, {
        mesage: "Không tìm thấy",
      });
    } catch (error) {
      res.send(400, {
        mesage: "Thất bại",
        error: error,
      });
    }
  },
  getDetail: async (req, res, next) => {
    const { id } = req.params;
    try {
      const result = await Category.findOne({ _id: id, isDeleted: false });
      if (result) {
        return res.send(200, {
          mesage: "Thành công",
          payload: result,
        });
      }
      return res.send(404, {
        mesage: "Không tìm thấy",
      });
    } catch (err) {
      return res.send(400, {
        mesage: "Thất bại",
        error: isError,
      });
    }
  },
  create: async (req, res, next) => {
    try {
      const { name, description } = req.body;
      const newRecord = new Category({ name, description });
      let result = await newRecord.save();
      console.log("◀◀◀ result ▶▶▶", result);
      if (result) {
        return res.send(200, {
          message: "Thành công",
          payload: result,
        });
      }
      return res.send(400, {
        message: "Không tìm thấy",
      });
    } catch (err) {
      return res.send(400, {
        message: "Thất bại",
        errors: err,
      });
    }
  },
  update: async (req, res, next) => {
    const { id } = req.params;
    const { name, description, isDeleted } = req.body;
    try {
      const result = await Category.findOneAndUpdate(
        { _id: id, isDeleted: false },
        { name, description, isDeleted },
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
        errors: err,
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
      const result = await Category.findByIdAndUpdate(
        id,
        { isDeleted: true },
        { new: true }
      );
      if (result) {
        return res.send(200, {
          message: "Thành công xóa",
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
  // hardDelete: async(req,res,next)=>{
  //   const {id} =req.params;
  //   const newProductList=products.filter((item)=>item.id.toString()!==id.toString())
  //   await writeFileSync(patch,newProductList)
  //   return res.send(200, {
  //       message: "Thành công xóa",
  //     });
  // }
};
