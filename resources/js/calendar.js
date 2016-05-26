
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

	var cal = '3936333335373833343930',
			url = calendarUrlFactory(cal);

	getCalendarEvents(calendarUrlFactory(cal), function(res) {
		pushCalendarEvents(JSON.parse(res).items);
	});

	function pushCalendarEvents(list) {
		for (var i in list) {
			var item = list[i],
					eventList = document.getElementById('calendarEvents');

			console.log(item);

			// Set start and end moment objects.
			item.start = (item.start.date) ? (moment(item.start.date)):(moment(item.start.dateTime));
			item.end = (item.end.date) ? (moment(item.end.date)):(moment(item.end.dateTime));

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
			description.innerHTML = '<h5>'+item.summary+'</h5>';

			element.appendChild(date);
			element.appendChild(description);

			eventList.appendChild(element);
		}
	}



