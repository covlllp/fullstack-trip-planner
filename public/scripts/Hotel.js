var Hotel;

$(document).ready(function () {

	$.get('/hotels', function (data) {
		Hotel.prototype = generateAttraction({
			icon: '/images/lodging_0star.png',
			$listGroup: $('#my-hotel .list-group'),
			$all: $('#all-hotels'),
			all: data,
			constructor: Hotel
		});
		// remove a hotel from the current day
		Hotel.prototype.delete = function () {
			currentDay.hotel
				.eraseMarker()
				.eraseItineraryItem();
			currentDay.hotel = null;
			$.ajax({
				type: 'DELETE',
				url: '/days/' + currentDay._id + '/hotel'
			});
		};
	});
	// construct a new hotel for the current day
	Hotel = function (data, day_num) {
		var self = this;
		eachKeyValue(data, function (key, val) {
			self[key] = val;
		});
		if (currentDay && currentDay.hotel) {
			currentDay.hotel.delete();
		}
		this.buildMarker()
			.buildItineraryItem();

		if (day_num == undefined) {
			this.drawMarker()
				.drawItineraryItem();
			currentDay.hotel = this;
			$.post('/days/' + currentDay._id + '/hotel',{hotel: self._id});
		}
	}
});