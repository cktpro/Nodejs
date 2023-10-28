var express = require("express");
var router = express.Router();
const { upload_single, upload_multiple, get_file_detail,delete_single,get_list } = require("./controller");
const passport = require("passport");
// Upload File
router.post("/upload-single",passport.authenticate('jwt', { session: false }), upload_single);
router.post("/upload-multiple",passport.authenticate('jwt', { session: false }), upload_multiple);
router.delete("/:id",passport.authenticate('jwt', { session: false }), delete_single);
// get File
router.get("/:id", get_file_detail);
router.get("/", get_list);

module.exports = router;
