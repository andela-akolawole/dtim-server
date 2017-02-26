require('dotenv').config();
var mongoose = require('mongoose');
mongoose.connect(process.env.MONGO_DB_URI);
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function callback () {
  console.log("h");
});

module.exports = mongoose;
