var express = require('express');
var router = express.Router();
const { validateSchema } = require('../../helper');
const {getDetail,getList,search,create,update,softDelete,}=require('./controller')
const checkIdSchema = require('../validationId')
const {validationSchema} =require('./validation')

// GET LIST & CREATE LIST
router.route('/')
.get(getList)
.post(validateSchema(validationSchema),create)
// SEARCH LIST
router.get('/search',search)
// GET DETAIL UPDATE DELETE
router.put("/:id",update)
router.route('/:id')
  .get(validateSchema(checkIdSchema), getDetail)
  
  // .patch(updatePatch)
  // .delete(hardDelete)

router.patch('/delete/:id',softDelete);

module.exports= router
