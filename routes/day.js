var express = require('express');
var router = express.Router();
var attractionRouter = express.Router();
var models = require('../models');
var Day = models.Day;
var allModels = 'hotel restaurants thingsToDo';

// GET /days
router.get('/', function (req, res, next) {
	// serves up all daKys as json
	Day
		.find()
		.populate('hotel')
		.populate('restaurants')
		.exec(function(err, days) {
			if (err) next(err);
			res.json(days);
		});
});

// POST /days
router.post('/', function (req, res, next) {
	// creates a new day and serves it as json
	Day.create(req.body, function(err, day) {
		if (err) next(err);
		res.json(day.populate(allModels));
	});
});

// GET /days/:id
router.get('/:id', function (req, res, next) {
	// serves a particular day as json
	Day
		.findById(req.params.id)
		.populate(allModels)
		.exec(function(err, day) {
			if (err) next(err);
			res.json(day);
		});
});

// PUT /days/:id
router.put('/:id', function (req, res, next) {
	// serves a particular day as json
	Day
		.findByIdAndUpdate(req.params.id, req.body)
		.exec(function(err, day) {
			if (err) next(err);
			res.json(day);
		});
});

// DELETE /days/:id
router.delete('/:id', function (req, res, next) {
	// deletes a particular day
	Day.findByIdAndRemove(req.params.id).exec(function(err) {
		if (err) next(err);
		res.sendStatus(200);
	});
});



router.use('/:dayid', function(req, res, next) {
	req.body.dayid = req.params.dayid;
	next();
});

router.use('/:dayid', attractionRouter);

// POST /days/:id/hotel
attractionRouter.post('/hotel', function (req, res, next) {
	// creates a reference to the hotel
	Day
		.findByIdAndUpdate(req.body.dayid, {hotel: req.body.hotel})
		.exec(function(err, day) {
			if (err) next(err);
			res.json(day);
		});
});

// DELETE /days/:id/hotel
attractionRouter.delete('/hotel', function (req, res, next) {
	// deletes the reference of the hotel
	Day
		.findByIdAndUpdate(req.body.dayid, {hotel: undefined})
		.exec(function(err, day) {
			if (err) next(err);
			res.json(day);
		});
});


// POST /days/:id/:select
attractionRouter.post('/:select/:_id', function (req, res, next) {
	// creates a reference to a restaurant
	Day
	.findByIdAndUpdate(req.body.dayid, {$push: {restaurants: req.params._id}})
	.exec(function(err, day) {
		res.json(day);
	});
});

// DELETE /days/:dayId/:select/:restId
attractionRouter.delete('/restaurants/:_id', function (req, res, next) {
	// deletes a reference to a restaurant
	Day
	.findById(req.body.dayid)
	.exec(function(err, day) {
		if (err) next(err);
		var ind = day.restaurants.indexOf(req.params._id);
		day.restaurants.splice(ind, 1);
		day.save(function() {
			res.json(day);
		});
	});
});

// POST /days/:id/thingsToDo
attractionRouter.post('/thingsToDo/:_id', function (req, res, next) {
	// creates a reference to a thing to do
	Day
	.findByIdAndUpdate(req.body.dayid, {$push: {thingsToDo: req.params._id}})
	.exec(function(err, day) {
		res.json(day);
	});
});
// DELETE /days/:dayId/thingsToDo/:thingId
attractionRouter.delete('/thingsToDo/:id', function (req, res, next) {
	// deletes a reference to a thing to do
	Day
	.findById(req.body.dayid)
	.exec(function(err, day) {
		if (err) next(err);
		var ind = day.thingsToDo.indexOf(req.params._id);
		day.thingsToDo.splice(ind, 1);
		day.save(function() {
			res.json(day);
		});
	});
});



module.exports = router;