var mongoose = require('../connect');
var Schema = mongoose.Schema;

var Ebook = new Schema({
    bookName: {
        type: String,
    },
    bookCover: {
        type: String
    },
    bookPaymentUrl: {
        type: String
    },
    bookDesc: {
        type: String
    },
    bookPrice: {
        type: String
    },
    createdAt: {
        type: Date,
        default: Date.now()
    }
});

module.exports = mongoose.model('Ebook', Ebook);