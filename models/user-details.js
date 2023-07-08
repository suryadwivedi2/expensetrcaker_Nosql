const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    ispremium: {
        type: Boolean,
        default:false
    },
    totalexpense: {
        type: Number,
        default:0

    }
})


module.exports = mongoose.model('User', userSchema);



// // const Sequelize=require('sequelize');


// // const sequelize=require('../util/database');

// // const exp=sequelize.define('user',{
// //     id:{
// //         type:Sequelize.INTEGER,
// //         autoIncrement:true,
// //         allowNull:false,
// //         primaryKey:true
// //       },
// //       name:{
// //         type:Sequelize.STRING,
// //         allowNull:false
// //       },
// //       email:{
// //         type:Sequelize.STRING,
// //         allowNull:false,
// //        unique: true
// //       },
// //       password:{
// //         type:Sequelize.STRING,
// //         allowNull:false
// //       },
// //       ispremium:{
// //         type:Sequelize.BOOLEAN
// //       },
// //       totalexpense:{
// //         type:Sequelize.INTEGER,
// //         defaultValue:0
// //       }
// // })


// module.exports=exp;