const mongoose = require('mongoose');

require('dotenv').config();
const User = require('../models/user-details');
const Expenses = require('../models/expenses');
const bcryt = require('bcrypt');
const jwt = require('jsonwebtoken');
const Razor = require('razorpay');
const Order = require('../models/order');
//const AWS = require('aws-sdk');

const generatetoken = (id, ispremium) => {
    return jwt.sign({ userId: id, ispremium }, process.env.JWT_STRING);
}


exports.purchasemembership = (req, res, next) => {
    const rzp = new Razor({
        key_id: process.env.KEY_ID,
        key_secret: process.env.KEY_SECRET
    })
    const amount = 25000;
    rzp.orders.create({ amount, currency: "INR" }, (err, order) => {
        if (err) {
            throw new Error(err);
        }
        Order.create({ orderId: order.id, status: "PENDING", userId: req.user.id })
            .then(() => {
                return res.status(201).json({ order, key_id: rzp.key_id })
            })
    }).catch(err => {
        res.status(401).json({ message: 'something went wrong' })
    })
}






exports.updatetransaction = (req, res, next) => {
    const payment_id = req.body.payment_id;
    const order_id = req.body.order_id;
    //console.log(payment_id+" "+order_id);
    const userId = req.user.id;

    if (payment_id == undefined) {
        Order.findOne({ orderId: order_id })
            .then(order => {
                order.update({ paymentId: payment_id, status: "FAILED" })
                    .then(() => {
                        return res.status(201).json({ success: false, message: 'transaction failed' });
                    }).catch(err => {
                        console.log(err)
                    })
            })
    } else {
        Order.findOneAndUpdate({ orderId: order_id }, { paymentId: payment_id, status: "SUCCESSFULL" })
            // order.update({paymentId:payment_id,status:"SUCCESSFULL"})
            .then(() => {
                User.findByIdAndUpdate({ _id: userId }, { ispremium: true })
                    .then(() => {
                        return res.status(201).json({ success: true, message: 'transaction successfull', token: generatetoken(userId, true) });
                    }).catch(err => {
                        console.log(err)
                    })
            }).catch(err => {
                console.log(err)
            })
    }
}


exports.showleaderboard = async (req, res, next) => {
    try {
        const leaderboardofuser = await User.find().sort({'totalexpense':-1})
        console.log(leaderboardofuser);
        res.status(201).json(leaderboardofuser);
    } catch (err) {
        res.status(401).json({ err });
    }
}

function uploadtos3(data, filename) {
    const BUCKET_NAME = process.env.BUCKET_NAME;
    const IAM_USER_KEY = process.env.S3_USER_KEY;
    const IAM_USER_SECRET = process.env.S3_USER_SECRET;

    let s3bucket = new AWS.S3({
        accessKeyId: IAM_USER_KEY,
        secretAccessKey: IAM_USER_SECRET
    })

    var params = {
        Bucket: BUCKET_NAME,
        Key: filename,
        Body: data,
        ACL: 'public-read'
    }
    return new Promise((resolve, reject) => {
        s3bucket.upload(params, (err, data) => {
            if (err) {
                console.log('something went worng', err);
                reject(err)
            } else {
                console.log("success", data);
                resolve(data.Location);
            }
        })
    })
}


exports.downloadexpense = async (req, res, next) => {
    try {
        const expenses = await req.user.getExpenses();
        console.log(expenses)
        const stringfiedexpenses = JSON.stringify(expenses);
        const userId = req.user.id;
        const filename = `Expense/${userId}/${new Date}.txt`;
        const fileURL = await uploadtos3(stringfiedexpenses, filename);
        res.status(200).json({ fileURL, succes: true })
    } catch (err) {
        console.log(err);
    }
}