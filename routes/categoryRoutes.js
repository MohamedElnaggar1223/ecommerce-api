const express = require('express')
const router = express.Router()
const { getCategories, getCategory, addCategory } = require('../controllers/categoryController')
const verifyAdmin  = require('../middleware/verifyAdmin')

router.route('/')
    .get(getCategories)
    //.post(verifyAdmin, addCategory)

router.route('/create')
    .post(addCategory)

router.route('/:id')
    .get(getCategory)

module.exports = router