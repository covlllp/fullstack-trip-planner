var data = {};

$(document).ready(function() {
	data[getDay()] = new Day();

	$('#add-panel button').click(function() {
		var div_parent = $(this).parent();
		var header = div_parent.find("h4").text().toLowerCase().replace(/\s/g,'');
		var selected = div_parent.find("select option:selected").text();
		createListDiv(header, selected);
		updateMap();
	});

	$('.day-buttons button:first-child').on('click', switchAndLoadDay)

	$('.day-buttons button:last-child').on('click', function() {
		// remove current day class
		$(this).parent().find('.current-day').removeClass('current-day');
		clearDay();

		var new_button = $(this).prev().clone(true);
		var dayNum = new_button.text() * 1 + 1;
		$('#day-title').text('Day ' + dayNum);
		data[getDay()] = new Day();

		new_button.addClass('current-day');
		new_button.text(dayNum);
		$(this).before(new_button).before('\n');
	});

	$('#day-title').next().on('click', function() {
		var day = getDay();
		var day_num = day.substring(4, day.length) * 1;

		deleteDay();
		while (data.hasOwnProperty('Day ' + (day_num + 1))) {
			data['Day ' + day_num] = data['Day ' + (day_num + 1)];
			day_num++;
		};

		if (day_num != 1) {
			data['Day ' + day_num] = undefined;
			delete data['Day ' + day_num];
			$('.day-buttons button:last-child').prev().remove();
			// $('.day-buttons button:last-child').prev();

			switchAndLoadDay.call($('.day-buttons button')[0]);
		}
	});
});

function switchAndLoadDay () {
	$(this).parent().find('.current-day').removeClass('current-day');
	$(this).addClass('current-day');
	$('#day-title').text('Day ' + $(this).text());
	loadDay('Day ' + $(this).text());
}

function getDay() {
	return $('#day-title').text();
}

function deleteDay () {
	$('#my-panel ul button').each(function() {
		$(this).click();
	});
}

function clearDay () {
	$('#my-panel ul button').each(function() {
		var parent = $(this).parent();
		var selected = parent.find('span').text();
		$(this).data(selected).setMap(null);
		parent.remove();
	});
	// $('#my-panel ul').empty();
}

function loadDay (day) {	// day is a string
	clearDay();
	for (var header in data[day]) {
		for (var selected in data[day][header]) {
			createListDiv(header, selected);
		}
	}
	updateMap();
}

function updateMap () {
	var flag = false;
	var bounds = new google.maps.LatLngBounds();
	$('#my-panel ul button').each(function() {
		flag = true;
		var selected = $(this).parent().find('span').text();
		var marker = $(this).data(selected);
		bounds.extend(marker.position);
	});
	if (flag) map.fitBounds(bounds);
}


function createListDiv (header, selected) {
	// Check if duplicate
	var ul = $("#" + header + "-list")
	var ul_list = ul.find('div span');
	for (var i = 0; i < ul_list.length; i++) {
		if ($(ul_list[i]).text() == selected) return;
	};

	// Add event to data
	data[getDay()][header][selected] = selected;

	// Create list variable
	var list_div = $("<div></div>");
	list_div.addClass('itinerary-item');

	var span = $("<span></span");
	span.addClass('title');
	span.text(selected);

	var button = $("<button>x</button>");
	button.addClass('btn btn-xs btn-danger remove btn-circle');
	button.on('click', removeListObj);

	list_div.append(span);
	list_div.append(button);
	ul.append(list_div);

	// Add google marker
	addMarker(button, header, selected);
}

function removeListObj () {
	var div_parent = $(this).parent();
	var header_id = div_parent.parent().attr('id');
	var header = header_id.substring(0,header_id.indexOf('-'));
	var selected = div_parent.find('span').text();
	$(this).data(selected).setMap(null);
	div_parent.remove();

	// delete object from data
	delete data[getDay()][header][selected];
	updateMap();
}

// Map functions
function addMarker (button, header, selected) {
	models[header].forEach(function(model) {
		if (model.name == selected) {
			var marker = drawLocation(model.place[0].location, header);
			button.data(selected, marker);
		}
	});
}

function drawLocation (location, opts) {
	if (opts == 'hotels')
		opts = {icon: '/images/lodging_0star.png'};
	else if (opts == 'restaurants')
		opts = {icon: '/images/restaurant.png'};
	else if (opts == 'thingstodo')
		opts = {icon: '/images/star-3.png'};
	else opts = {};

    opts.position = new google.maps.LatLng(location[0], location[1]);
    opts.map = map;
    return marker = new google.maps.Marker(opts);
}



function Day () {
	this.hotels = {};
	this.restaurants = {};
	this.thingstodo = {};
}