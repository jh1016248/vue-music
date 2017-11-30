var mongoose = require('./db.js'),
    Schema = mongoose.Schema;

var SheetSchema = new Schema({
	sheetId: {type: Number},
	musicId: {type: Number},
});

module.exports = mongoose.model('sheets', SheetSchema);