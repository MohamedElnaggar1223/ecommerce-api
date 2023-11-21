const express = require('express')
const router = express.Router()
const { getAdmins, addAdmin, updateAdmin, getAdminIdentity } = require('../controllers/adminsController')
const verifyAdmin  = require('../middleware/verifyAdmin')

//router.use(verifyAdmin)

router.route('/')
    .get(getAdmins)
    .post(addAdmin)
    .patch(updateAdmin)

router.route('/identity')
    .get(getAdminIdentity)

module.exports = router