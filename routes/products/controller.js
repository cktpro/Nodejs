let products = require("../../data/products.json");
let categorys = require("../../data/categories.json");
let suppliers = require("../../data/suppliers.json");
const {
  generationID,
  writeFileSync,
  fuzzySearch,
  // combineObjects,
} = require("../../helper");
const patch = "./data/products.json";
module.exports = {
  getList: async (req, res, next) => {
    let itemList = products.filter((item) => !item.isDeleted);
    itemList = itemList.map((product) => {
      const { categoryId, supplierId } = product;
      const category = categorys.find(
        (item) => item.id.toString() === categoryId.toString()
      );
      const supplier = suppliers.find(
        (item) => item.id.toString() === supplierId.toString()
      );
      delete product["categoryId"];
      delete product["supplierId"];
      return { ...product, category, supplier };
    });
    res.send(200, {
      mesage: "Thành công",
      payload: itemList,
    });
  },
  search: async (req, res, next) => {
    const { name } = req.query;
    let productFilter = [];
    if (name) {
      const searchRegex = fuzzySearch(name);
      productFilter = products.filter((item) => {
        if (!item.isDeleted && searchRegex.test(item.name)) {
          return item;
        }
      });
      productFilter = productFilter.map((product) => {
        const { categoryId, supplierId } = product;
        const category = categorys.find(
          (item) => item.id.toString() === categoryId.toString()
        );
        const supplier = suppliers.find(
          (item) => item.id.toString() === supplierId.toString()
        );
        // if (category && supplier) {
        //   delete product["categoryId"];
        //   delete product["supplierId"];
        // }
        return { ...product, category, supplier };
      });
    } else {
      productFilter = products.filter((item) => !item.isDeleted);
      productFilter = productFilter.map((product) => {
        const { categoryId, supplierId } = product;
        const category = categorys.find(
          (item) => item.id.toString() === categoryId.toString()
        );
        const supplier = suppliers.find(
          (item) => item.id.toString() === supplierId.toString()
        );
        delete product["categoryId"];
        delete product["supplierId"];
        return { ...product, category, supplier };
      });
    }
    res.send(200, {
      mesage: "Thành công",
      payload: productFilter,
    });
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
    const exitCategoryId = await category.find(
      (item) => item.id.toString() === categoryId.toString()
    );
    const exitSupplierId = await supplier.find(
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

    const newProductList = [
      ...products,
      {
        id: generationID(),
        name,
        price,
        discount,
        stock,
        categoryId,
        supplierId,
        description,
        isDeleted,
      },
    ];

    writeFileSync(patch, newProductList);
    return res.send(200, {
      mesage: "Thành công",
    });
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
