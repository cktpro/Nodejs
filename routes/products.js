var express = require("express");
const fs = require("fs");
var router = express.Router();

let products = require("../data/products.json");
const writeFileSync = (path, data) => {
  console.log("««««« data »»»»»", data);
  fs.writeFileSync(path, JSON.stringify(data), function (err) {
    if (err) {
      console.log("««««« err »»»»»", err);

      throw err;
    }
    console.log("Saved!");
  });
};
const generationID = () => Math.floor(Date.now());

/* GET LIST. */
router.get("/", function (req, res, next) {
  res.send(200, {
    message: "Thành công",
    payload: products.filter((item) => !item.isDelete),
  });
});

/* GET DETAIL. */
router.get("/:id", function (req, res, next) {
  const { id } = req.params;
  const product = products.find((item) => item.id.toString() === id.toString());
  if (product.isDelete) {
    return res.send(200, {
      message: "Sản phẩm không tồn tại",
    });
  }
  if (product && !product.isDelete) {
    return res.send(200, {
      message: "Thành công",
      payload: product,
    });
  }
  return res.send(404, {
    message: "Không tìm thấy",
  });
});

/* CREATE. */
router.post("/", function (req, res, next) {
  const { name, price } = req.body;
  console.log("<<<<<< res.body >>>>>>", res.body);
  const newProductList = [...products, { name, price, id: generationID() }];

  writeFileSync("./data/products.json", newProductList);

  return res.send(200, {
    message: "Thành công",
    // payload: products,
  });
});
/* UPDTAE-PUT */
router.put("/:id", function (req, res, next) {
  const { id } = req.params;

  const { name, price, description, discount } = req.body;

  const updateData = {
    id,

    name,

    price,

    description,

    discount,
  };
  let isErr = false;
  const newProductList = products.map((item) => {
    if (item.id.toString() === id.toString()) {
      if (item.isDelete) {
        isErr = true;
        return item;
      } else {
        return updateData;
      }
    }
    return item;
  });
  if (!isErr) {
    writeFileSync("./data/products.json", newProductList);

    res.send(200, {
      message: "Thành công",
      payload: updateData,
    });
  }
  res.send(400, {
    message: "Cập nhật thất bại",
  });
});
/* DELETE HARD */
router.delete("/:id", function (req, res, next) {
  const { id } = req.params;
  const newProductList = products.filter(
    (item) => item.id.toString() !== id.toString()
  );
  //   if (item.id.toString() === id.toString()) {
  //     return res.send(200, {
  //       message: "Thành công",
  //       payload: "A",
  //     });
  //   }
  //   return item;
  // });

  writeFileSync("./data/products.json", newProductList);

  return res.send(200, {
    message: "Thành công",
    payload: newProductList,
  });
});
/* DELETE SOFT */
router.patch("/:id", function (req, res, next) {
  const { id } = req.params;
  const newProductList = products.map((item) => {
    if (item.id.toString() === id.toString()) {
      return {
        ...item,
        isDelete: true,
      };
    }
    return item;
  });

  writeFileSync("./data/products.json", newProductList);
  return res.send(200, {
    message: "Thành công",
    payload: newProductList,
  });
});
/* SEARCH LIST */
router.post("/search", function (req, res, next) {
  const {key}=req.query
  return res.send(200, {
    message: "Thành công tìm",
    payload: key,
  });
  // const { id } = req.params;
  // const newProductList = products.map((item) => {
  //   if (item.id.toString() === id.toString()) {
  //     return {
  //       ...item,
  //       isDelete: true,
  //     };
  //   }
  //   return item;
  // });

  // writeFileSync("./data/products.json", newProductList);
  // return res.send(200, {
  //   message: "Thành công",
  //   payload: newProductList,
  // });
});

module.exports = router;
