const express = require('express');

const resetcontroller = require('../controller/resetpass');
//const auth=require('../middleware/authorization.js');

const router = express.Router();

router.post('/forgot-password', resetcontroller.forgotpass);
router.get('/reset-password/:id', resetcontroller.resetpass);
router.get('/update-password/:id', resetcontroller.updatepassword)

module.exports = router;