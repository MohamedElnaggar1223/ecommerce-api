const express = require('express')
const router = express.Router()
const { getOrders } = require('../controllers/ordersController')
const verifyAdmin  = require('../middleware/verifyAdmin')

//router.use(verifyAdmin)

router.route('/')
    .get(getOrders)

module.exports = router