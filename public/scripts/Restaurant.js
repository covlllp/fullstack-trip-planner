var Restaurant;

$(document).ready(function () {

	$.get('/restaurants', function (restaurantData) {
		Restaurant.prototype = generateAttraction({
			icon: '/images/restaurant.png',
			$listGroup: $('#my-restaurants .list-group'),
			$all: $('#all-restaurants'),
			all: restaurantData,
			constructor: Restaurant
		});

		// remove a restaurant from the current day
		Restaurant.prototype.delete = function () {
			var self = this;
			var index = currentDay.restaurants.indexOf(this),
				removed = currentDay.restaurants.splice(index, 1)[0];
			removed
				.eraseMarker()
				.eraseItineraryItem();
			$.ajax({
				type: 'DELETE',
				url: '/days/' + currentDay._id + '/restaurants/' + self._id
			});
		};
	});

	// construct a new restaurant for the current day
	Restaurant = function (data, day_num) {
		var self = this;
		eachKeyValue(data, function (key, val) {
			self[key] = val;
		});
		this.buildMarker()
			.buildItineraryItem()

		if (day_num == undefined) {
			currentDay.restaurants.push(this);
			this.drawMarker()
				.drawItineraryItem();
			$.post('/days/' + currentDay._id + '/restaurants/' + self._id);
		}
	}
});