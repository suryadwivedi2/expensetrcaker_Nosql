const express=require('express');

const usercontroller=require('../controller/user');
const router=express.Router();


 router.post('/add-user',usercontroller.addUser);

 router.post('/login-user',usercontroller.loginUser)





module.exports=router;