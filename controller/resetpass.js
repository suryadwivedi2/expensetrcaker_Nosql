
require('dotenv').config();
const bcryt = require('bcrypt');
const path=require('path');
const Sib=require("sib-api-v3-sdk");

const sequelize = require('../util/database');
const Forgot=require('../models/forgotpassword');
const User=require('../models/user-details');
const { v4: uuidv4 } = require('uuid');

let Uid;
let Id;

exports.forgotpass=async (req,res,next)=>{
   const email=req.body.email;
   const uuid=uuidv4();
   const client = Sib.ApiClient.instance;
   const user=await User.findOne({email:email})
   await Forgot.create({
    id:uuid,
    isActive:true,
    userId:user.id
   })

   const apiKey = client.authentications['api-key']
   apiKey.apiKey=process.env.API_KEY
   const tranEmailApi = new Sib.TransactionalEmailsApi()
const sender = {
    email: 'bcae2.08924402018@gmail.com',
    name: 'Surya',
}
const receivers = [
    {
        email: email,
    },
]
await tranEmailApi
    .sendTransacEmail({
        sender,
        to: receivers,
        subject: 'kindly click on the link to reset your password',
        htmlContent: `<a href="http://localhost:4000/called/reset-password/${uuid}">Reset password</a>`,
    })
    .then((result)=>{res.status(200).json(result)})
    .catch((err)=>res.status(400).json(err))
}


exports.resetpass=async (req,res,next)=>{
   try{
 const id=req.params.id;
 await Forgot.findOneAndUpdate({id:id},{isActive:false})

     res.status(200).send(`<html>
     <script>
         function formsubmitted(e){
             e.preventDefault();
             console.log('sucess')
         }
     </script>
     <form action="/called/update-password/${id}" method="get">
         <label for="password">Enter New password</label>
         <input name="password" type="password" required></input>
         <button>reset password</button>
     </form>
 </html>`
 )
 res.end();
}catch(err){
  res.status(400).json(err);
}
}

exports.updatepassword=async(req,res,next)=>{
try{
    const id=req.params.id;
    const password=req.query.password;
    const forgot=await Forgot.findOne({id:id})
    const user=await User.findOne({_id:forgot.userId});
    //console.log(user);
    const saltrounds = 10;

    if(user)
    {
        bcryt.hash(password, saltrounds, async (err, hash) => {
            console.log(err);
            await User.findOneAndUpdate({_id:forgot.userId},{password: hash})
            res.status(201).json({message:'succefully updated'});
        })
    }else{
        throw new Error('something went wrong')
    }
}catch(err){
    res.status(400).json(err)
}
}