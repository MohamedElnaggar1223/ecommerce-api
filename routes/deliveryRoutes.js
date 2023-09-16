const express = require('express')
const router = express.Router()
const { getDeliveries, addDelivery, updateDelivery, acceptOrder, updateOrder } = require('../controllers/deliveryController')
const verifyDelivery  = require('../middleware/verifyDelivery')

//router.use(verifyDelivery)

router.route('/')
    .get(getDeliveries)
    .post(addDelivery)
    .patch(updateDelivery)

router.route('/orders')
    .post(acceptOrder)
    .patch(updateOrder)

module.exports = router