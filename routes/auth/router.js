var express = require('express');
var router = express.Router();
const { validateSchema } = require('../../helper');
const {checkLogin}=require('./controller')
const checkIdSchema = require('../validationId')
const {validationLoginSchema} =require('./validation')

// GET LIST & CREATE LIST
router.post('/login',validateSchema(validationLoginSchema),checkLogin)

module.exports= router
