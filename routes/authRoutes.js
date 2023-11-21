const express = require('express')
const router = express.Router()
const { customerLogin, adminLogin, deliveryLogin, refresh, logout } = require('../controllers/authController')

router.route('/customer')
    .post(customerLogin)

router.route('/admin')
    .post(adminLogin)

router.route('/delivery')
    .post(deliveryLogin)

router.route('/refresh')
    .get(refresh)

router.route('/logout')
    .get(logout)

module.exports = router