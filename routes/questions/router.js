var express = require("express");
var router = express.Router();
const { validateSchema } = require("../../helper");
const {
  question1,
  question1b,
  question2,
  question3,
  question4,
  question5,
  question6,
  question7,
  question8_10,
  question11_13,
  question14,
  question15,
  question16,
  question17,
  question18,
  question19,
  question20,
  question21,
  question22,
  question23,
  question24,
  question25,
  question26,
  question27,
  question28,
  question29,
  question30
} = require("./controller");
const checkIdSchema = require("../validationId");
const {
  validationCreateSchema,
  validationStatusSchema,
} = require("./validation");

// GET LIST & CREATE LIST
router.get("/1a", question1);
router.get("/1b", question1b);
router.get("/2a", question2);
router.get("/3", question3);
router.get("/4", question4);
router.get("/5", question5);
router.get("/6", question6);
router.get("/7", validateSchema(validationStatusSchema), question7);
router.get("/8_10", question8_10);
router.get("/11_13", question11_13);
router.get("/14", question14);
router.get("/15", question15);
router.get("/16", question16);
router.get("/17", question17);
router.get("/18", question18);
router.get("/19", question19);
router.get("/20", question20);
router.get("/21", question21);
router.get("/22", question22);
router.get("/23", question23);
router.get("/24", question24);
router.get("/25", question25);
router.get("/26", question26);
router.get("/27", question27);
router.get("/28", question28);
router.get("/29", question29);
router.get("/30", question30);

module.exports = router;
