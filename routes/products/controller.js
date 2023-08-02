const { Product, Category, Supplier } = require("../../models/");
const {
  writeFileSync,
  fuzzySearch,
  // combineObjects,
} = require("../../helper");
const { isError } = require("util");
const patch = "./data/products.json";
module.exports = {
  getList: async (req, res, next) => {
    try {
      const result = await Product.find({ isDeleted: false })
        .populate("category")
        .populate("supplier")
        .lean();

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
  search: async (req, res, next) => {
    try {
      const { name } = req.query;
      const searchRegex = fuzzySearch(name);
      const result = await Product.find({ name: searchRegex, isDeleted: false });
      return res.send(200, {
        mesage: "Thành công",
        payload: result,
      });
    } catch (err) {
      return res.send(404, {
        mesage: "Thất bại",
        error: err,
      });
    }
  },
  getDetail: async (req, res, next) => {
    const { id } = req.params;
    const product = products.find(
      (item) => item.id.toString() === id.toString()
    );
    if (product) {
      const { categoryId, supplierId } = product;

      if (product.isDeleted) {
        return res.send(400, {
          mesage: "Sản phẩm đã bị xóa",
        });
      }
      const category = categorys.find(
        (item) => item.id.toString() === categoryId.toString()
      );
      const supplier = suppliers.find(
        (item) => item.id.toString() === supplierId.toString()
      );
      delete product["categoryId"];
      delete product["supplierId"];
      return res.send(200, {
        mesage: "Thành công",
        payload: { ...product, category, supplier },
      });
    }
    return res.send(404, {
      mesage: "Không tìm thấy",
    });
  },
  create: async (req, res, next) => {
    const {
      name,
      price,
      discount,
      stock,
      categoryId,
      supplierId,
      description,
      isDeleted,
    } = req.body;
    try {
      const newRecord = new Product({
        name,
        price,
        discount,
        stock,
        categoryId,
        supplierId,
        description,
        isDeleted,
      });
      const result = await newRecord.save();
      return res.send(400, {
        mesage: "Thành công",
        payload: result,
      });
    } catch (err) {
      return res.send(400, {
        mesage: "Thất bại",
        error: err,
      });
    }
  },
  update: async (req, res, next) => {
    const { id } = req.params;
    const {
      name,
      price,
      discount,
      stock,
      categoryId,
      supplierId,
      description,
      isDeleted,
    } = req.body;
    const exitCategoryId = category.find(
      (item) => item.id.toString() === categoryId.toString()
    );
    const exitSupplierId = supplier.find(
      (item) => item.id.toString() === supplierId.toString()
    );
    if (!exitCategoryId || exitCategoryId.isDeleted) {
      return res.send(400, {
        mesage: "Category không tồn tại",
      });
    }
    if (!exitSupplierId || exitSupplierId.isDeleted) {
      return res.send(400, {
        mesage: "Supplier không tồn tại",
      });
    }
    const updateData = {
      id,
      name,
      price,
      discount,
      stock,
      categoryId,
      supplierId,
      description,
      isDeleted,
    };
    let isErr = false;
    const newProductList = products.map((item) => {
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
      writeFileSync(patch, newProductList);
      return res.send(200, {
        message: "Thành công",
        payload: updateData,
      });
    }
    return res.send(400, {
      message: "Cập nhật không thành công",
    });
  },
  // updatePatch: async(req,res,next)=>{
  //   const {id}=req.params;
  //   const { name, price, description, discount } = req.body;
  //   let updateData={};
  //   let isErr=false;
  //   const newProductList =products.map((item)=>{
  //       if(item.id.toString()===id.toString()){
  //           if(item.isDeleted){
  //               isErr=true;
  //               return item;
  //           }else{
  //               updateData= combineObjects(item, { name, price, description, discount });
  //               return updateData;
  //           }
  //       }
  //       return item;
  //   })
  //   if(!isErr){
  //       await writeFileSync('./data/products.json', newProductList);
  //       return res.send(200, {
  //           message: "Thành công",
  //           payload: updateData,
  //         });
  //   }
  //   return res.send(400, {
  //       message: "Cập nhật không thành công",
  //     });
  // },
  softDelete: async (req, res, next) => {
    const { id } = req.params;
    const newProductsList = products.map((item) => {
      if (item.id.toString() === id.toString()) {
        return { ...item, isDeleted: true };
      }
      return item;
    });
    await writeFileSync(patch, newProductsList);
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
