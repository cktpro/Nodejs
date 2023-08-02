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
};
