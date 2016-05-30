
	// Click on the main title
	document.querySelector('.titles').addEventListener('click', function() {
		if (currentPage === 'schedule') {
			// You are on the schedule page, switch between schedules
			switchSchedules();
		}
	});

	// Click on the days to change day
	var days = document.querySelectorAll('ul.days li');
	for (var d = 0; d < days.length; d++) {
		days[d].addEventListener('click', dayClick);
	}

	function dayClick(e) {
		var day = e.target.getAttribute('data-day'),
				current = document.querySelector('body').getAttribute('data-selected-day');

		if (current !== day) document.querySelector('body').setAttribute('data-selected-day', day);
	}

	document.getElementById('weeks').addEventListener('click', function() {
		var display = (document.querySelector('body').getAttribute('data-display-weeks') === 'true') ? 'false':'true';
		document.querySelector('body').setAttribute('data-display-weeks', display);
	});

	// Will switch between the two schedules based on which one is in view
	function switchSchedules() {
		var opposite = (document.querySelector('body').getAttribute('data-active-schedule') === 'main') ? 'other' : 'main';

		document.querySelector('body').setAttribute('data-active-schedule', opposite);
	}