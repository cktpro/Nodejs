const fs = require("fs");

const writeFileSync = (patch, data) => {
  fs.writeFileSync(patch, JSON.stringify(data), function (err) {
    if (err) {
      throw err;
    }
    console.log("<<<<<< Saved! >>>>>>");
  });
};
const combineObjects = (obj1, obj2) => {
  const combineObj = {};
  for (const key in obj1) {
    if (obj1.hasOwnProperty(key) && typeof obj1[key] !== undefined) {
      combineObj[key] = obj1[key];
    }
  }
  for (const key of obj2) {
    if (obj2.hasOwnProperty(key) && typeof obj2[key] !== undefined) {
      combineObj[key] = obj2[key];
    }
  }
  return combineObj;
};
const fuzzySearch = (text) => {
  const regex = text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
  return new RegExp(regex, "gi");
};
const generationID = () => Math.floor(Date.now());

const validateSchema = (schema) => async (req, res, next) => {
  try {
    await schema.validate(
      {
        body: req.body,
        query: req.query,
        params: req.params,
      },
      {
        abortEarly: false,
      }
    );
    return next();
  } catch (err) {
    return res
      .status(400)
      .json({ type: err.name, errors: err.errors, provider: "Yup" });
  }
};
module.exports = {
  writeFileSync,
  combineObjects,
  fuzzySearch,
  generationID,
  validateSchema,
  asyncForEach: async (array, callback) => {
    for (let index = 0; index < array.length; index += 1) {
      await callback(array[index], index, array); // eslint-disable-line
    }
  },
  getQueryDateTime: (from, to, type = 'IN') => {
    fromDate = new Date(from);
  
    const tmpToDate = new Date(to);
    toDate = new Date(tmpToDate.setDate(tmpToDate.getDate() + 1));
  
    let query = {};
  
    if (type === 'IN') {
      const compareFromDate = { $gte: ['$createdDate', fromDate] };
      const compareToDate = { $lt: ['$createdDate', toDate] };
    
      query = {
        $expr: { $and: [compareFromDate, compareToDate] },
      };
    } else {
      const compareFromDate = { $lt: ['$createdDate', fromDate] };
      const compareToDate = { $gt: ['$createdDate', toDate] };
    
      query = {
        $expr: { $or: [compareFromDate, compareToDate] },
      };
    }
  
    return query;
  } ,
  getDiscountedPrice:(discountName,priceName,quantityName)=>{
    return { $multiply:[{$divide: [
      {
        $multiply: [
          { $subtract: [100, "$orderDetails.discount"] },
          "$orderDetails.price",
        ],
      },
      100,
    ]},'$orderDetails.quantity']
      
    }
  }
};
