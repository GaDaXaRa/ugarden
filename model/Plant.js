var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var plantSchema = new Schema({
	n: {type: String, required: true},
	g: {type: String, required: true},
	d: {type: String, required: true}
});

module.exports = mongoose.model("Plant", plantSchema);