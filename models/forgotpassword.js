
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const forgotSchema = new Schema({
  id: {
    type: String,
  },
  isActive:{
    type:Boolean
  },
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
})


module.exports = mongoose.model('Forgotpass', forgotSchema);





// const Sequelize=require('sequelize');

// const sequelize=require('../util/database');


// const forgotpass=sequelize.define('forgotpass',{
//     id:{
//         type:Sequelize.UUID,
//         allowNull:true,
//         primaryKey:true
//     },
//     isActive:{
//         type:Sequelize.BOOLEAN,
//         defaultValue:false
//     }
// })

// module.exports=forgotpass;