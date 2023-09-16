const express = require('express')
const router = express.Router()
const { getAdmins, addAdmin, updateAdmin } = require('../controllers/adminsController')
const verifyAdmin  = require('../middleware/verifyAdmin')

//router.use(verifyAdmin)

router.route('/')
    .get(getAdmins)
    .post(addAdmin)
    .patch(updateAdmin)

module.exports = router