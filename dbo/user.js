var mongoose = require('./db.js'),
    Schema = mongoose.Schema;

var UserSchema = new Schema({
    userId: {type: Number},
    userName: { type: String },
    password: { type: String },
    nickName: { type: String },
    pic: { type: String },
});

module.exports = mongoose.model('users', UserSchema);

