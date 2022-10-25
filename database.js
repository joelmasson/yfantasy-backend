var mongoose = require('mongoose');
const MONGODB = process.env.MONGODB || require("./conf.js").MONGODB;  

mongoose.connect(MONGODB, { useNewUrlParser: true, useUnifiedTopology: true });

mongoose.connection.once('open', () => {
  console.log('connected to database');
});
mongoose.connection.on('error', function(err){
  console.log("Mongoose default connection has occured "+err+" error");
});
mongoose.connection.on('disconnected', function(err){
  console.log("Mongoose default connection is disconnected:" + err);
});

