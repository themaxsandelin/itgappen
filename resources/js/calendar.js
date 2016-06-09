
	var cal = '3936333335373833343930',
			url = calendarUrlFactory(cal);
			events = [];

	// Get all calendar events and then push the data ti the calendar page
	getCalendarEvents(calendarUrlFactory(cal), function(res) {
		pushCalendarEvents(JSON.parse(res).items);
	});

	// Factory function to generate the Google Calendar API url based on the calendar_id and some parameters
	function calendarUrlFactory(id) {
		var pre = 'itggot.se_',
				post = '@resource.calendar.google.com/events/',
				key = 'AIzaSyBMBbVIAhAfKBn5K8XSU9W-YGyxAJ_YsUQ',
				date = moment().toISOString();
		// return 'https://www.googleapis.com/calendar/v3/calendars/'+pre+id+post+'?key='+key+'&maxResults=2500&timeMin='+date+'&singleEvents=True&orderBy=startTime';
		return 'https://www.googleapis.com/calendar/v3/calendars/'+pre+id+post+'?key='+key+'&maxResults=2500&singleEvents=True&orderBy=startTime';
	}

	// An basic GET XMLHttpRequest to get the calendar events and then respond by running the callback function
	function getCalendarEvents(url, callback) {
		var req = new XMLHttpRequest();
		req.open('GET', url, true);
		req.send();
		req.onreadystatechange = function() {
			if (req.readyState === 4 && req.status === 200) callback(req.response);
		}
	}

	// Takes in a calendar event list and pushes it to the calendar page
	function pushCalendarEvents(list) {
		events = [];
		for (var i in list) {
			var item = list[i],
					eventList = document.getElementById('calendarEvents');

			// Set start and end moment objects.
			item.start = (item.start.date) ? (moment(item.start.date)):(moment(item.start.dateTime));
			item.end = (item.end.date) ? (moment(item.end.date)):(moment(item.end.dateTime));

			item.duration = setDurationLabel(item.start, item.end);

			// Create HTML element and append data
			var element = document.createElement('li'),
					date = document.createElement('div'),
					description = document.createElement('div');

			// Setup the date element
			date.classList.add('date');
			date.innerHTML = '<h3>'+item.start.format('D')+'</h3>';
			date.innerHTML += '<p class="small">'+item.start.locale("sv").format('MMM')+'</p>';

			// Setup the description element
			description.classList.add('description');
			description.innerHTML += '<h5>'+item.summary+'</h5>';
			description.innerHTML += '<p class="small">'+item.duration+'</p>';

			element.appendChild(date);
			element.appendChild(description);
			element.setAttribute('data-event-index', i);

			events.push(item);
			element.addEventListener('click', eventItemClick.bind(element));

			eventList.appendChild(element);
		}
	}

	// Capitalizes a string (makes the first letter of the word uppercase).
	function capitalizeString(str) {
		return str.charAt(0).toUpperCase() + str.slice(1);
	}

	// Creates a formatted string that tells the user the "duration" of the event
	function setDurationLabel(start, end) {
		// Check if the start and end times are at the same day
		var days = end.diff(start, 'days');
		if (days === 0) {
			// Check the hourly difference between the times.
			// If both of them have 00:00, set as an all day event
			if (end.format('HHmm') === start.format('HHmm')) {
				// Their time is the same, just check if it's 00:00, otherwise print the time
				if (start.format('HHmm') === '0000' && end.format('HHmm') === '0000') return 'Hela dagen'; // The times were 00:00 so return all day

				return end.format('HH:mm');
			}
			return start.format('HH:mm') + ' - ' + end.format('HH:mm');
		} else if (days === 1 && (start.format('HHmm') === '0000' && end.format('HHmm') === '0000')) {
			return 'Hela dagen';
		} else {
			// Get the month difference, if there is none you can print just the dates + one month
			// otherwise print two repetitions for date and the month
			var thisMonth = (parseInt((end.format('M')) - parseInt(start.format('M'))) === 0);
			if (thisMonth) {
				return start.format('D') + ' - ' + end.format('D ') + capitalizeString(end.format('MMMM'));
			} else {
				return start.format('D ') + capitalizeString(start.format('MMMM')) + ' - ' + end.format('D ') + capitalizeString(end.format('MMMM'));
			}
		}
	}

	// Click event for when clicking on an event item to show the detailed overlay for the event
	function eventItemClick(e) {
		var i = parseInt(this.getAttribute('data-event-index'));
		pushEventDetails(events[i]);
		showModal('#event');
	}

	function pushEventDetails(event) {
		var container = document.querySelector('#event .modal .details');
		container.innerHTML = '';

		var title = document.createElement('h3');
		title.innerHTML = event.summary;
		container.appendChild(title);

		var meta = document.createElement('div');
		meta.classList.add('meta');

		var date = document.createElement('p');
		date.classList.add('small');
		date.classList.add('date');

		var time = document.createElement('p');
		var appendTime = false;
		time.classList.add('small');
		time.classList.add('time');

		// Check if the event start and end are on different dates, if they are then only show the date differences
		// If they are on the same day, show the date and if the time is set to something different than 00:00 then show the time as well.

		var start = event.start,
				end = event.end;

		var days = end.diff(start, 'days');
		if (days === 0) {
			// It's the same day
			appendTime = true;
			date.innerHTML = end.format('Do ') + capitalizeString(end.format('MMMM'));

			if (end.format('HHmm') === start.format('HHmm')) {
				// Their time is the same, just check if it's 00:00, otherwise print the time
				if (start.format('HHmm') === '0000' && end.format('HHmm') === '0000') time.innerHTML = 'Hela dagen'; // The times were 00:00 so return all day

				time.innerHTML = end.format('HH:mm');
			} else {
        time.innerHTML = start.format('HH:mm') + ' - ' + end.format('HH:mm');
      }
		} else {
			// It's atleast one(1) days difference
			var thisMonth = (parseInt((end.format('M')) - parseInt(start.format('M'))) === 0);
			if (thisMonth) {
				// It's the same month
				date.innerHTML = start.format('D') + ' - ' + end.format('D ') + capitalizeString(end.format('MMMM'));
			} else {
				// It's two seperate months
				date.innerHTML = start.format('D ') + capitalizeString(start.format('MMMM')) + ' - ' + end.format('D ') + capitalizeString(end.format('MMMM'));
			}
			if (days === 1 && (start.format('HHmm') === '0000' && end.format('HHmm') === '0000')) {
				appendTime = true;
				time.innerHTML = 'Hela dagen';
			}
		}

		meta.appendChild(date);
		if (appendTime) meta.appendChild(time); // Only append the time element if there is a time string
		container.appendChild(meta);
	}


	// Event modal scripts

	document.getElementById('closeEvent').addEventListener('click', function() {
    hideModal('#event');
  });

	function showModal(sel) {
		var modal = document.querySelector(sel);
    var overlay = document.querySelector('#coreOverlay');

		modal.classList.add('display');
		overlay.classList.add('display');
		setTimeout(function() {
			modal.classList.add('show');
			overlay.classList.add('show');
		}, 20);
	}

	function hideModal(sel) {
		var modal = document.querySelector(sel);
    var overlay = document.querySelector('#coreOverlay');

		modal.classList.remove('show');
		overlay.classList.remove('show');
		setTimeout(function() {
			modal.classList.remove('display');
			overlay.classList.remove('display');
		}, 320);
	}



