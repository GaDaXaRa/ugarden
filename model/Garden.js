var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var gardenSchema = new Schema({
	n: {type: String, required: true},
	d: {type: String},
	p: [mongoose.Schema.Types.ObjectId]
});

module.exports = mongoose.model("Garden", gardenSchema);