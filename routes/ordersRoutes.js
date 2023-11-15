const express = require('express')
const router = express.Router()
const { getOrders, getMyOrders } = require('../controllers/ordersController')
const verifyAdmin  = require('../middleware/verifyAdmin')

//router.use(verifyAdmin)

router.route('/')
    .get(getOrders)

router.route('/:id')
    .get(getMyOrders)

module.exports = router