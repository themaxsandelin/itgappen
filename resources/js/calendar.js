
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
		return 'https://www.googleapis.com/calendar/v3/calendars/'+pre+id+post+'?key='+key+'&maxResults=2500&timeMin='+date+'&singleEvents=True&orderBy=startTime';
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
		var today = (end.diff(start, 'days') === 0);
		if (today) {
			// Check the hourly difference between the times.
			// If both of them have 00:00, set as an all day event

		} else {
			// Return a text describing the event duration based on the date difference
			return 'Till den: ' + end.format('Do ') + capitalizeString(end.format('MMMM'));
		}

		console.log(
			start.format('YYYY-MM-DD – HH:mm'),
			end.format('YYYY-MM-DD – HH:mm')
		);

	}

	// Click event for when clicking on an event item to show the detailed overlay for the event
	function eventItemClick(e) {
		var i = parseInt(this.getAttribute('data-event-index'));
		console.log(events[i]);
	}



