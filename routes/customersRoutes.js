const express = require('express')
const router = express.Router()
const { getCustomers, getCustomer, addCustomer, updateCart, checkOut, orderCompleted, getFavs, updateFavs } = require('../controllers/customersController')
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

router.route('/favs/:id')
    .get(getFavs)

router.route('/favs')
    .patch(updateFavs)

module.exports = router