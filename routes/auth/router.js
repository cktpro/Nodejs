var express = require('express');
var router = express.Router();
const { validateSchema } = require('../../helper');
const {checkLogin,basicLogin,getMe, checkRefreshToken}=require('./controller')
const passport = require('passport');
const {validationLoginSchema,validationRefreshTokenSchema} =require('./validation')
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
  router.route('/checkrefreshtoken')
  .post(
    validateSchema(validationRefreshTokenSchema),
    checkRefreshToken
  );

router.route('/profile')
  .get(
    Authorization(),
    getMe,
  );

module.exports= router
