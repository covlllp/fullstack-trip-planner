function eachKeyValue (obj, onEach) {
	Object.keys(obj).forEach(function (key) {
		onEach(key, obj[key])
	});
}

var days = [];
var currentDay;

$(document).ready(function () {
	$.get('/days', function(data) {
		days = data.map(function(day) {
			return new Day(day);
		});
		if (days.length) {
			currentDay = days[0];
		} else {
			currentDay = new Day();
		}
		currentDay.$button.addClass('current-day');
		currentDay.switchTo();
	});
});