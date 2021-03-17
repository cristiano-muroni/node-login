const mongoose = require ('../database/index');
const bcrypt = require('bcryptjs');

 const UserShema = new mongoose.Schema({
     name: {
         type: String,
         require: true,
     },
     email: {
         type: String,
         unique: true,
         required: true,
         lowercase: true,
     },
     password: {
         type: String,
         required: true,
         select: false,
     },
     foneNumber:{
         type: String,
         required: true
     },
     businessOwner: {
         type:Boolean,
         required:true
     },
     createdAt: {
         type: Date,
         default: Date.now,
     },
 });

 UserShema.pre('save', async function(next) {
     const hash = await bcrypt.hash(this.password,10);
     this.password = hash;

     next();
 });

 const User = mongoose.model('User', UserShema);

 module.exports = User;