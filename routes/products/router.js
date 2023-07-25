var express = require('express');
let products = require("../../data/products.json");
var router = express.Router();
const { validateSchema } = require('../../helper');
const {getDetail,getList,search,create,update,updatePatch,softDelete,hardDelete}=require('./controller')
const {checkIdSchema,validationProductInfoSchema,validationProductUpdateSchema} =require('./validation')

// GET LIST & CREATE LIST
router.route('/')
.get(getList)
.post(validateSchema(validationProductInfoSchema),create)
// SEARCH LIST
router.get('/search',search)
// GET DETAIL UPDATE DELETE
router.route('/:id')
  .get(validateSchema(checkIdSchema), getDetail)
  .put(validateSchema(validationProductUpdateSchema), update)
  .patch(updatePatch)
  .delete(hardDelete)

router.patch('/delete/:id', softDelete);

module.exports= router
