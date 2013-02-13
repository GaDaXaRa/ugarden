var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var waterSchema = new Schema({
	d: {type: Date, default: Date.now},
	a: {type: Number}
}, { 
	_id: false, 
	autoIndex: false 
});

mongoose.model('Water', waterSchema);

var plantationSchema = new Schema({
	p: {type: mongoose.Schema.Types.ObjectId, required: true},
	s: {type: Number},
	d: {type: Date, default: Date.now},
	w: [waterSchema]
});

plantationSchema.statics.createPlantation = function (plant, garden, callback) {
	var plantation = new this({p: plant._id});	
	plantation.save(function (err, plantation) {
		garden.p.unshift(plantation._id);
		garden.save(callback);
	});
};

plantationSchema.statics.water = function (plantationId, amount, callback) {	
	var Water = mongoose.model('Water');
	var water = new Water({a: amount});
	this.findById(plantationId, function (err, plantation) {
		plantation.w.unshift(water);
		plantation.save(callback);
	});	
}

module.exports = mongoose.model("Plantation", plantationSchema);