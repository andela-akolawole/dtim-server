var mongoose = require('../connect');
var Schema = mongoose.Schema;

var TestimonySchema = new Schema({
    fullName: {
        type: String
    },
    testimony: {
        type: String
    },
    gender: {
        type: String
    },
    status: {
        type: String
    },
    createdAt: {
        type: Date,
        default: Date.now()
    }
});

module.exports = mongoose.model('Testimony', TestimonySchema);