const express = require('express')
const router = express.Router()
const { getProducts, getProduct, addProduct, updateProduct, deleteProduct } = require('../controllers/productsController')
const verifyAdmin  = require('../middleware/verifyAdmin')

router.route('/')
    .get(getProducts)
    // .post(verifyAdmin, addProduct)
    // .patch(verifyAdmin, updateProduct)
    // .delete(verifyAdmin, deleteProduct)
    .post(addProduct)
    .patch(updateProduct)
    .delete(deleteProduct)

router.route('/:id')
    .get(getProduct)

module.exports = router