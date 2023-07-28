let itemList = require("../../data/categories.json");
const {
  generationID,
  writeFileSync,
  fuzzySearch,
  // combineObjects,
} = require("../../helper");
const patch = "./data/categories.json";
module.exports = {
  getList: async (req, res, next) => {
    res.send(200, {
      mesage: "Thành công",
      payload: itemList.filter((item) => !item.isDeleted),
    });
  },
  search: async (req, res, next) => {
    const { name } = req.query;
    let itemFilter = [];
    if (name) {
      const searchRegex = fuzzySearch(name);
      itemFilter = itemList.filter((item) => {
        if (!item.isDeleted && searchRegex.test(item.name)) {
          return item;
        }
      });
    } else {
      itemFilter = itemList.filter((item) => !item.isDeleted);
    }
    res.send(200, {
      mesage: "Thành công",
      payload: itemFilter,
    });
  },
  getDetail: async (req, res, next) => {
    const { id } = req.params;
    const itemDetail = itemList.find(
      (item) => item.id.toString() === id.toString()
    );
    if (itemDetail) {
      if (itemDetail.isDeleted) {
        return res.send(400, {
          mesage: "Sản phẩm đã bị xóa",
        });
      }
      return res.send(200, {
        mesage: "Thành công",
        payload: itemDetail,
      });
    }
    return res.send(404, {
      mesage: "Không tìm thấy",
    });
  },
  create: async (req, res, next) => {
    const { name, description, isDeleted } = req.body;
    const exitName=itemList.find((item)=>item.name===name)
    if(exitName){
      return res.send(400, {
        mesage: "CategoryName đã tồn tại",
      });
    }
    const newItemList = [
      ...itemList,
      {
        id: generationID().toString(),
        name,
        description,
        isDeleted,
      },
    ];
    writeFileSync(patch, newItemList);
    return res.send(200, {
      mesage: "Thành công",
    });
  },
  update: async (req, res, next) => {
    const { id } = req.params;
    const { name,description, isDeleted } = req.body;
    const exitName=itemList.filter((item)=>item.id!==id).find((item)=>item.name===name)
    if(exitName){
      return res.send(400, {
        mesage: "Category Name đã tồn tại",
      });
    }
    const updateData = {
      id,
      name,
      description,
      isDeleted,
    };
    let isErr = false;
    const newItemList = itemList.map((item) => {
      if (item.id.toString() === id.toString()) {
        if (item.isDeleted) {
          isErr = true;
          return item;
        } else {
          return updateData;
        }
      }
      return item;
    });
    if (!isErr) {
      writeFileSync(patch, newItemList);
      return res.send(200, {
        message: "Thành công",
        payload: updateData,
      });
    }
    return res.send(400, {
      message: "Cập nhật không thành công",
    });
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
    const newItemList = itemList.map((item) => {
      if (item.id.toString() === id.toString()) {
        return { ...item, isDeleted: true };
      }
      return item;
    });
    await writeFileSync(patch, newItemList);
    return res.send(200, {
      message: "Thành công xóa",
    });
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
