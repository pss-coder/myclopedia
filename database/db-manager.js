var mongoose = require('mongoose');


var dbname = 'myclopedia-db';

//connect to MongoDB
// mongodb+srv://thekillerred:<password>@cluster0-ybhln.mongodb.net/test?retryWrites=true&w=majority
mongoose.connect(`mongodb+srv://thekillerred:thekiller97@cluster0-ybhln.mongodb.net/test?retryWrites=true&w=majority`,{useNewUrlParser: true});
var db = mongoose.connection;

module.exports = db;