require('should');

describe('Gardens', function () {
	var Garden = require('../model/Garden');
	var Plant = require('../model/Plant');
	var Plantation = require('../model/Plantation');
	var mongoose = require('mongoose');
	var _ = require('underscore');

	before(function (done) {
		if (! mongoose.connection.db) {
			mongoose.connect('mongodb://localhost/testUGarden', function (err, db){
				done(err);
			});
		} else done();
	});

	afterEach(function (done) {
		Garden.remove(function (err, element) {
			if (err) done(err);

			Plant.remove(done);
		});
	});

	var createGarden = function (callback) {
		var garden = new Garden({n: 'garden', d: 'garden description'});
		garden.save(callback);
	};

	var plantPlant = function (garden, plant, callback) {
		var perejil = new Plant({n: plant, g: plant + 'us', d: 'descripción ' + plant});
		perejil.save(function (err, planted) {
			Plantation.createPlantation(planted, garden, callback);			
		});
	}

	it('debe poder crearse un nuevo huerto con nombre y descripción', function (done) {
		var garden = new Garden({n: 'huerto'});

		garden.save(function (err, newGarden) {
			if (err) done(err);

			_(newGarden).isEqual(garden).should.be.ok;
			
			done();
		});
	});

	it('debe poder hacerse una plantación en un huerto y en una fecha', function (done) {
		createGarden(function (err, newGarden) {
			if (err) done(err);

			plantPlant(newGarden, 'perejil', function (err, plantedGarden) {
				if (err) done(err);

				plantedGarden.p[0].should.be.ok;

				done();
			});
		});
	});

	it('debe poder hacerse más de una plantación', function (done){
		var perejil = 'perejil';
		var tomillo = 'tomillo';
		
		createGarden(function (err, huerto) {
			if (err) done(err);

			plantPlant(huerto, perejil, function (err, huerto) {
				if (err) done(err);

				plantPlant(huerto, tomillo, function (err, huerto) {
					if (err) done(err);

					Plantation.findById(huerto.p[0], function (err, plantacion1) {
						if (err) done(err);

						Plant.findById(plantacion1.p, function (err, planta1) {
							if (err) done(err);

							planta1.n.should.be.equal(tomillo);

							Plantation.findById(huerto.p[1], function (err, plantacion2) {
								Plant.findById(plantacion2.p, function (err, planta2) {
									if (err) done(err);

									planta2.n.should.be.equal(perejil);
									done();
								});
							});
						});						
					});
				});
			});
		});
	});

	it('debe poder regarse una planta de una plantación en una fecha y con una cantidad concreta de agua', function (done) {
		createGarden(function (err, garden) {
			if (err) done(err);

			plantPlant(garden, 'perejil', function (err, garden) {
				if (err) done(err);

				var amount = 200;
				Plantation.water(garden.p[0], amount, function (err, plantation) {
					if (err) done(err);

					plantation.w[0].a.should.be.equal(amount);

					done();
				});
			});
		});
	});

	it('debe poder recuperarse la última fecha de regado para una plantación', function(done) {
		createGarden(function (err, garden) {
			if (err) done(err);

			plantPlant(garden, 'perejil', function (err, garden) {
				if (err) done(err);

				Plantation.water(garden.p[0], 200, function (err, plantation) {
					if (err) done(err);
					
					plantation.w[0].d.should.be.ok;

					done();
				});
			});
		});
	});
});