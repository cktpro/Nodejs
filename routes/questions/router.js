var express = require('express');
var router = express.Router();
const { validateSchema } = require('../../helper');
const {question18,question19,question20}=require('./controller')
const checkIdSchema = require('../validationId')
const {validationCreateSchema} =require('./validation')

// GET LIST & CREATE LIST
router.get('/18', question18);
router.get('/19', question19);
router.get('/20', question20);

module.exports= router
