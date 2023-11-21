const express = require('express')
const router = express.Router()
const { getProducts, getProduct, addProduct, updateProduct, deleteProduct } = require('../controllers/productsController')
const verifyAdmin  = require('../middleware/verifyAdmin')

router.route('/')
    .get(getProducts)
    // .post(verifyAdmin, addProduct)
    // .patch(verifyAdmin, updateProduct)
    // .delete(verifyAdmin, deleteProduct)
router.route('/create')
    .post(addProduct)

router.route('/:id')
    .patch(updateProduct)
    .get(getProduct)

router.route('/delete/:id')
    .delete(deleteProduct)

router.route('/show/:id')
    .get(getProduct)

module.exports = router