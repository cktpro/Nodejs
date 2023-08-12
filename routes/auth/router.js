var express = require('express');
var router = express.Router();
const { validateSchema } = require('../../helper');
const {checkLogin,basicLogin,getMe}=require('./controller')
const passport = require('passport');
const {validationLoginSchema} =require('./validation')
const {Authorization} =require('../../helper/jwtHelper')
// LOGIN
router.route('/login')
  .post(
    validateSchema(validationLoginSchema),
    passport.authenticate('local', { session: false }),
    checkLogin,
  );
  router.route('/basic')
  .post(
    passport.authenticate('basic', { session: false }),
    basicLogin
  );

router.route('/profile')
  .get(
    Authorization(),
    getMe,
  );

module.exports= router
