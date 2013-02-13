require('should');

describe('Plants', function () {
	var Plant = require('../model/Plant');
	var mongoose = require('mongoose');
	var _ = require('underscore');

	before(function(done) {
		if (!mongoose.connection.db) {
			mongoose.connect('mongodb://localhost/testUGarden', function (err, db){
				done(err);
			});
		} else done();
	});

	afterEach(function(done) {
		Plant.remove(function (err, element) {
			done(err);
		});
	});

	it('debe poder crearse una planta con nombre, nombre genérico y descripción', function (done) {
		var plant = new Plant({n: 'perejil', g: 'perejilus', d: 'descripción'});
		plant.save(function (err, planted) {
			if (err) return done(err);

			_(planted).isEqual(plant).should.be.ok;

			done();
		});
	});
});