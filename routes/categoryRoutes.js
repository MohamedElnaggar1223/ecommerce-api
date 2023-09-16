const express = require('express')
const router = express.Router()
const { getCategories, addCategory } = require('../controllers/categoryController')
const verifyAdmin  = require('../middleware/verifyAdmin')

router.route('/')
    .get(getCategories)
    //.post(verifyAdmin, addCategory)
    .post(addCategory)

module.exports = router