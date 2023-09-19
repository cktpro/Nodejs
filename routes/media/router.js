var express = require("express");
var router = express.Router();
const { upload_single, upload_multiple, get_file } = require("./controller");
const passport = require("passport");
// Upload File
router.post("/upload-single",passport.authenticate('jwt', { session: false }), upload_single);
router.post("/upload-multiple",passport.authenticate('jwt', { session: false }), upload_multiple);
// get File
router.get("/:id", get_file);

module.exports = router;
