
	var currentSchedule = 'my';

	// Click on the main title
	document.querySelector('.titles').addEventListener('click', function() {
		if (currentPage === 'schedule') {
			// You are on the schedule page, switch between schedules
			switchSchedules();
		}
	});

	// Will switch between the two schedules based on which one is in view
	function switchSchedules() {
		var myTitle = document.getElementById('myTitle'),
					otherTitle = document.getElementById('otherTitle');

		if (currentSchedule === 'my') {
			// Switch to other schedule
			currentSchedule = 'other';
			myTitle.classList.add('push');
			otherTitle.classList.remove('pull');

		} else {
			// Switch to my schedule
			currentSchedule = 'my';
			myTitle.classList.remove('push');
			otherTitle.classList.add('pull');

		}
	}