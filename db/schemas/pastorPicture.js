var mongoose = require('../connect');
var Schema = mongoose.Schema;

var PastorPicture = new Schema({
    url: {
        type: String,
    }
});

module.exports = mongoose.model('PastorPicture', PastorPicture);