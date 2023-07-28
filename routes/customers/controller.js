let itemList = require("../../data/customers.json");
const {
  generationID,
  writeFileSync,
  fuzzySearch,
  // combineObjects,
} = require("../../helper");
const patch = "./data/customers.json";
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
          mesage: "Đã bị xóa",
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
    const {
      firstName,
      lastName,
      phoneNumber,
      address,
      email,
      birthday,
      isDeleted,
    } = req.body;
    const exitEmail = itemList.find((item) => item.email === email);
    const exitPhone = itemList.find((item) => item.phoneNumber === phoneNumber);
    if (exitEmail || exitPhone) {
      return res.send(400, {
        mesage: "Email hoặc PhoneNumber đã được sử dụng",
      });
    }
    const newItemList = [
      ...itemList,
      {
        id: generationID().toString(),
        firstName,
        lastName,
        phoneNumber,
        address,
        email,
        birthday,
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
    const {
      firstName,
      lastName,
      phoneNumber,
      address,
      email,
      birthday,
      isDeleted,
    } = req.body;
    const exitEmail = itemList
      .filter((item) => item.id !== id)
      .find((item) => item.email === email);
    const exitPhone = itemList
      .filter((item) => item.id !== id)
      .find((item) => item.phoneNumber === phoneNumber);
    if (exitEmail || exitPhone) {
      return res.send(400, {
        mesage: "Email hoặc PhoneNumber đã được sử dụng",
      });
    }
    const updateData = {
      id,
      firstName,
      lastName,
      phoneNumber,
      address,
      email,
      birthday,
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
    let isErr=false
    const newItemList = itemList.map((item) => {
      if (item.id.toString() === id.toString()) {
        if(item.isDeleted){
          isErr=true;
        }else
        return { ...item, isDeleted: true };
      }
        return item;
    });
    console.log('◀◀◀ isErr ▶▶▶',isErr);
    if(!isErr){
      await writeFileSync(patch, newItemList);
    return res.send(200, {
      message: "Thành công xóa",
    });
    }
    return res.send(400, {
      message: "Xóa thất bại",
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
