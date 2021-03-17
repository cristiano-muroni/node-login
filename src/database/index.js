const mongoose = require('mongoose');
mongoose.Promisse = global.Promise;
mongoose.connect('mongodb://localhost/delivery',{useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true});


module.exports = mongoose;
