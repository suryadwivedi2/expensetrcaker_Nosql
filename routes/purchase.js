const express = require('express');


const purchasecontroller = require('../controller/purchase.js');
const auth = require('../middleware/authorization.js');

const router = express.Router();


router.get('/purchase-premium', auth.authenticate, purchasecontroller.purchasemembership);
router.post('/update-transaction', auth.authenticate, purchasecontroller.updatetransaction);
 router.get('/show-leaderboard',auth.authenticate,purchasecontroller.showleaderboard);
 router.get('/download',auth.authenticate,purchasecontroller.downloadexpense);

module.exports = router;