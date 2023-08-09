var express = require("express");
var router = express.Router();
const { validateSchema } = require("../../helper");
const {
  getDetail,
  getList,
  search,
  create,
  softDelete,
  updateStatus,
  updateEmployee,
  updateShippedDate
} = require("./controller");
const checkIdSchema = require("../validationId");
const { validationCreateSchema,updateStatusSchema,updateShippingDateSchema } = require("./validation");

// GET LIST & CREATE LIST
router
  .route("/")
  .get(getList)
  // .post(validateSchema(validationCreateSchema), create);
  .post(validateSchema(validationCreateSchema), create);
// SEARCH LIST
router.get("/search", search);
// GET DETAIL UPDATE DELETE
router
  .route("/:id")
  .get(validateSchema(checkIdSchema), getDetail)
  // .put(
  //   validateSchema(checkIdSchema),
  //   validateSchema(validationCreateSchema),
  //   update
  // );
router
  .route("/status/:id")
  .patch(validateSchema(updateStatusSchema), updateStatus);

router.route('/shipping/:id')
  .patch(validateSchema(updateShippingDateSchema), updateShippedDate)

router
  .route("/employee/:id")
  .patch(validateSchema(checkIdSchema), updateEmployee);
router.patch("/delete/:id", softDelete);

module.exports = router;
