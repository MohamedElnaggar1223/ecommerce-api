const express = require('express')
const router = express.Router()
const { getCustomers, getCustomer, addCustomer, updateCart, checkOut, orderCompleted } = require('../controllers/customersController')
const verifyJwt  = require('../middleware/verifyJwt')

router.route('/')
    .get(getCustomers)
    .post(addCustomer)

router.route('/get/:id')
    .get(getCustomer)
    .patch(updateCart)

router.route('/orders')
    //.post(verifyJwt, checkOut)
    .post(checkOut)

router.route('/success/:id')
    .get(orderCompleted)

module.exports = router