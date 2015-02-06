var express = require('express');
var router = express.Router();
var models = require('../models');
var Counter = require('../async_counter');

router.get('/', function(req, res, next) {
	var hotels, restaurants, thingsToDo;
	var counter = new Counter(3, function() {
		res.render('index',{hotels: hotels, restaurants: restaurants, thingsToDo: thingsToDo});
	});

	models.Hotel.find().exec(function(err, async_hotels) {
		hotels = async_hotels;
		counter.count();
	});
	models.Restaurant.find().exec(function(err, async_restaurant) {
		restaurants = async_restaurant;
		counter.count();
	});
	models.ThingToDo.find().exec(function(err, async_thingsToDo) {
		thingsToDo = async_thingsToDo;
		counter.count();
	});
});

module.exports = router;