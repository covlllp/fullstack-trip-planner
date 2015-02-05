var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/tripplanner');
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'mongodb connection error:'));

var Schema = mongoose.Schema;

var placeSchema = new Schema({
	address: String,
	city: String,
	state: String,
	phone: String,
	location: [Number]
});

var hotelSchema = new Schema({
	name: String,
	place: String,
	num_stars: {type: Number, min: 1, max: 5},
	amenities: [String]
});

var thingToDoSchema = new Schema({
	name: String,
	place: String,
	age_range: String
});

var restaurantSchema = new Schema({
	name: String,
	place: String,
	cuisine: [String],
	price: {type: Number, min: 1, max: 5}
});

var Place = mongoose.model('Place', placeSchema);
var Hotel = mongoose.model('Hotel', hotelSchema);
var ThingToDo = mongoose.model('ThingToDo', thingToDoSchema);
var Restaurant = mongoose.model('Restaurant', restaurantSchema);

module.exports = {
	Place: Place,
	Hotel: Hotel,
	ThingToDo: ThingToDo,
	Restaurant: Restaurant
};