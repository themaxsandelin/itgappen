
	var double = true;

	var items = document.querySelectorAll('.toggleDoubleSchedule');
	for (var i = 0; i < items.length; i++) {
		items[i].addEventListener('click', toggleDoubleSchedule);
	}

	// Toggles the double schedule setting off and on both in the UI and in the settings object.
	function toggleDoubleSchedule(e) {
		var sw = document.getElementById('doubleSchedule');
		sw.classList.toggle('on');
	}

	document.getElementById('clearMain').addEventListener('click', clearScheduleTitle);
	document.getElementById('clearOther').addEventListener('click', clearScheduleTitle);

	// Clear schedule title based on the click target's ID
	function clearScheduleTitle(e) {
		var id = e.target.id;
		var target;

		if (id === 'clearMain') target = document.getElementById('mainInput');
		else target = document.getElementById('otherInput');

		target.value = '';
		target.focus();
	}

	function getSchedules(callback) {
		var req = new XMLHttpRequest();
		req.open('GET', 'http://139.59.171.126:1337/api/v2/schedules', true);
		req.send();
		req.onreadystatechange = function() {
			if (req.readyState == 4 && req.status == 200) callback(JSON.parse(req.responseText));
		}
	}

	function pushCalendarLists(list) {
		var settings = document.getElementById('calendarSource');
		settings.innerHTML = '<option value="0">Välj klass..</option>';
		list.forEach(function(item, i) {
			settings.innerHTML += '<option value="'+item.calendar+'">'+item.name+'</option>';
		});
	}

	getSchedules(function(list) {
		pushCalendarLists(list.classes);
	});