var mongoose = require('../connect');
var Schema = mongoose.Schema;

var DailyDevotion = new Schema({
    title: {
        type: String,
    },
    details: {
        type: String
    },
    imageUrl: {
        type: String
    },
    author: {
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

module.exports = mongoose.model('DailyDevotion', DailyDevotion);