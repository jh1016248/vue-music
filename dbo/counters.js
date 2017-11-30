var mongoose = require('./db.js'),
    Schema = mongoose.Schema;

var CountersSchema = new Schema({
    tag: {type: String},
    value: {type: Number}
});

module.exports = mongoose.model('counters', CountersSchema);