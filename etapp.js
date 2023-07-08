//const https=require('https');
const path = require('path');
require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const Sib = require('sib-api-v3-sdk');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
//const sequelize = require('./util/database');
const fs = require('fs');
const app = express();
const mongoose = require('mongoose');




const userroute = require('./routes/user');
const expenseroute = require('./routes/expenses');
const purchaseroute = require('./routes/purchase');
 const resetroute=require('./routes/resetpass');
//const User = require('./models/user-details');
//const Expenses = require('./models/expenses');
//const Order = require('./models/order');
//const Forgotpassword = require('./models/forgotpassword');

const accesslogstream = fs.createWriteStream(
    path.join(__dirname, 'access.log'),
    {
        flags: 'a'
    }
)

//const privateKey=fs.readFileSync('server.key');
//const certificate=fs.readFileSync('server.cert');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.json());
app.use(cors());
app.use(helmet());
app.use(morgan('combined', { stream: accesslogstream }));

app.use(function (req, res, next) {
    res.setHeader('Content-Security-Policy', "script-src 'self' 'unsafe-inline' 'unsafe-hashes'  https://cdnjs.cloudflare.com https://checkout.razorpay.com/");
    next();
});

app.use('/expense', userroute);
app.use('/user', expenseroute);
app.use('/premium', purchaseroute);
app.use('/called', resetroute);

app.use((req, res, next) => {
    //console.log(req.url);
    res.sendFile(path.join(__dirname, `frontend/${req.url}`))
})

// User.hasMany(Expenses);
// Expenses.belongsTo(User);

// User.hasMany(Order);
// Order.belongsTo(User);

// User.hasMany(Forgotpassword);
// Forgotpassword.belongsTo(User);

mongoose.connect('mongodb+srv://bcae208924402018:Surya%402001@cluster0.ieth7oj.mongodb.net/expensetracker?retryWrites=true&w=majority')
    .then(result => {
        console.log("Connected!");
        app.listen(4000);
    })
    .catch(err => console.log(err));


