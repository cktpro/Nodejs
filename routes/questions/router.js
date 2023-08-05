var express = require('express');
var router = express.Router();
const { validateSchema } = require('../../helper');
const {question1,question1b}=require('./controller')
const checkIdSchema = require('../validationId')
const {validationCreateSchema} =require('./validation')

// GET LIST & CREATE LIST
router.get('/1a', question1);

module.exports= router
