var mongoose = require('../connect');
var Schema = mongoose.Schema;

var GallerySchema = new Schema({
    name: {
        type: String
    },
    url: {
        type: String
    },
    createdAt: {
        type: Date,
        default: Date.now()
    }
});

module.exports = mongoose.model('Gallery', GallerySchema);