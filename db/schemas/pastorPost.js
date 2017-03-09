var mongoose = require('../connect');
var Schema = mongoose.Schema;

var PastorPostSchema = new Schema({
    title: {
        type: String,
    },
    details: {
        type: String
    },
    bibleText: {
        type: String
    },
    createdAt: {
        type: Date,
        default: Date.now()
    }
});

module.exports = mongoose.model('PastorPost', PastorPostSchema);