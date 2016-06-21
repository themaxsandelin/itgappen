
	// Grab the basic number representation of the day of the week.
	// But take into account that moment starts the week on Sunday(0) so fix that.
	// Then just decrease the value by 1 to accomodate the week start (monday) being 1 and not 0
	var d = ((parseInt(moment().format('d')) === 0) ? 7:parseInt(moment().format('d'))) - 1;
	// Grab the day of the week number and make sure that if it is Friday, Saturday or Sunday you always set it to 4
	var day = (d < 4) ? d:4;
	var week = parseInt(moment().format('w'));

	// Main date variables
	var mainDay = day;
	var mainWeek = week;
	// Other date variables
	var otherDay = day;
	var otherWeek = week;

	var switchingSchedule = false;
	var builtOtherSchedule = false;

	// Main schedule slider
	var mainSwiper = new Swiper('.swiper-container#main', {
		onProgress: sliderMove,
		onSetTransition: sliderTransition,
		onSlideChangeStart: slideChange
	});

	// Other schedule slider
	var otherSwiper = new Swiper('.swiper-container#other', {
		onProgress: sliderMove,
		onSetTransition: sliderTransition,
		onSlideChangeStart: slideChange
	});

	var weekSwiper = new Swiper('.swiper-container#weeks', {
		slidesPerView: 5,
		centeredSlides: true,
		onSlideChangeStart: weekChange
	});

	// Handles the weekSwiper's week change
	function weekChange(swiper) {
		if (switchingSchedule) return;

		var w = swiper.activeIndex + 1;
		var a = document.querySelector('body').getAttribute('data-active-schedule');
		var s = (a === 'main') ? mainSwiper:otherSwiper;
		var i = (a === 'main') ? settings.main.id:settings.other.id;
		var d = (a === 'main') ? mainDay:otherDay;

		if (a === 'main') mainWeek = w;
		else otherWeek = w;

		pushWeekNumber();
		pushScheduleImages(s, scheduleUrlFactory(i, w), d);
	}

	// Update the selected day when the active swiper changes slide index.
	function slideChange(swiper) {
		var i = swiper.container[0].id;
		var s = document.querySelector('body').getAttribute('data-active-schedule');

		if (s === 'main') mainDay = swiper.activeIndex;
		else otherDay = swiper.activeIndex;

		if (s === i) document.querySelector('body').setAttribute('data-selected-day', swiper.activeIndex);
	}

	// Set transition on the day bar when the swiper changes it's transition
	function sliderTransition(swiper, transition) {
		var bar = document.querySelector('ul.days span');
		var t = transition / 1000;

		bar.style.webkitTransition = '-webkit-transform '+t+'s ease';
		bar.style.mozTransition = '-moz-transform '+t+'s ease';
		bar.style.msTransition = '-ms-transform '+t+'s ease';
		bar.style.oTransition = '-o-transform '+t+'s ease';
		bar.style.transition = 'transform '+t+'s ease';
	}

	// Move the day bar when the active swiper moves the slides
	function sliderMove(swiper, progress) {
		var bar = document.querySelector('ul.days span');
		var m = 100 * (4 * swiper.progress);

		bar.style.webkitTransform =
		bar.style.mozTransform =
		bar.style.msTransform =
		bar.style.oTransform =
		bar.style.transform = 'translate3d('+m+'%,0px,0px)';
	}

	// Handle the click even of a day tab
	function dayClick(e) {
		var day = e.target.getAttribute('data-day');
		var current = document.querySelector('body').getAttribute('data-selected-day');

		if (current !== day) {
			document.querySelector('body').setAttribute('data-selected-day', day);
			if (document.querySelector('body').getAttribute('data-active-schedule') === 'main') mainSwiper.slideTo(day);
			else otherSwiper.slideTo(day);
		}
	}

	// Will switch between the two schedules based on which one is in view
	function switchSchedules() {
		switchingSchedule = true;

		var swiper;
		var week;

		if (document.querySelector('body').getAttribute('data-active-schedule') === 'main') {
			document.querySelector('body').setAttribute('data-active-schedule', 'other');
			document.querySelector('body').setAttribute('data-selected-day', otherDay);

			swiper = otherSwiper;
			week = otherWeek;
		} else {
			document.querySelector('body').setAttribute('data-active-schedule', 'main');
			document.querySelector('body').setAttribute('data-selected-day', mainDay);

			swiper = mainSwiper;
			week = mainWeek;
		}

		var t = swiper.params.speed / 1000;
		var m = 100 * (4 * swiper.progress);
		var bar = document.querySelector('ul.days span');

		bar.style.webkitTransition = '-webkit-transform '+t+'s ease';
		bar.style.mozTransition = '-moz-transform '+t+'s ease';
		bar.style.msTransition = '-ms-transform '+t+'s ease';
		bar.style.oTransition = '-o-transform '+t+'s ease';
		bar.style.transition = 'transform '+t+'s ease';

		bar.style.webkitTransform =
		bar.style.mozTransform =
		bar.style.msTransform =
		bar.style.oTransform =
		bar.style.transform = 'translate3d('+m+'%,0px,0px)';

		weekSwiper.slideTo((week - 1), 300);

		pushWeekNumber();

		setTimeout(function() {
			switchingSchedule = false;
		}, 300);
	}

	// Factory function to generate an array of URLs for all days of the week based on the {id} parameter
	function scheduleUrlFactory(id, week) {
		var width = window.innerWidth - 30;
		var height = width * 3;

		var days = {
			1: 1,
			2: 2,
			3: 4,
			4: 8,
			5: 16
		};

		var urls = [];
		for (var d = 1; d < 6; d++) {
			urls.push(
				'http://www.novasoftware.se/ImgGen/schedulegenerator.aspx?format=png&schoolid=80220/sv-se&type=3&id=' + id +
				'&period=&week=' + week +
				'&mode=0&printer=0&colors=32&head=0&clock=0&foot=0&day=' + days[d] +
				'&width=' + width +
				'&height=' + height +
				'&maxwidth=' + width +
				'&maxheight=' + height
			);
		}
		return urls;
	}

	// Push the schedule images to the {swiper} parameter using the {urls} array parameter
	function pushScheduleImages(swiper, urls, day) {
		swiper.removeAllSlides();
		urls.forEach(function(url, i) {
			swiper.appendSlide(
				'<div class="swiper-slide">'+
					'<img src="'+url+'" alt="Schema bild">'+
				'</div>'
			);
		});
		swiper.slideTo(day, 0);
	}


	// Appends the current week number to the week button in the main header
	function pushWeekNumber() {
		var activeSchedule = document.querySelector('body').getAttribute('data-active-schedule');
		var week = (activeSchedule === 'main') ? mainWeek:otherWeek;

		document.getElementById('weekNumber').innerHTML = '<p>v.'+week+'</p>';
	}

	// Loops through weeks to append each week to the slider and choose the current week
	function populateWeekSlider() {
		weekSwiper.removeAllSlides();
		for (var w = 1; w < 53; w++) {
			var classlist = 'swiper-slide';

			if (w === parseInt(moment().format('w'))) classlist += ' currentWeek';
			weekSwiper.appendSlide(
				'<div class="'+classlist+'" data-slide-index="'+(w-1)+'" onclick="changeWeek(event)">'+w+'</div>'
			);
		}
		var current = document.querySelector('body').getAttribute('data-active-schedule');
		var week = ((current === 'main') ? mainWeek:otherWeek) - 1;

		weekSwiper.slideTo(week, 0);
	}

	// Click handler for the week slides
	function changeWeek(e) {
		var i = parseInt(e.target.getAttribute('data-slide-index'));
		weekSwiper.slideTo(i, 300);
	}


	// Event listeners

	document.querySelector('body').setAttribute('data-selected-day', mainDay);

	// Click on the main title
	document.querySelector('.titles').addEventListener('click', function() {
		if (currentPage === 'schedule' && settings.double) {
			// You are on the schedule page, switch between schedules
			switchSchedules();
		}
	});

	// Click event on the week button to show / hide the week slider
	document.getElementById('weekNumber').addEventListener('click', function() {
		var display = (document.querySelector('body').getAttribute('data-display-weeks') === 'true') ? 'false':'true';
		document.querySelector('body').setAttribute('data-display-weeks', display);
	});

	// Click on the days to change day
	var days = document.querySelectorAll('ul.days li');
	for (var d = 0; d < days.length; d++) {
		days[d].addEventListener('click', dayClick);
	}

	document.getElementById('nextWeek').addEventListener('click', function() {
		weekSwiper.slideNext();
	});

	document.getElementById('previousWeek').addEventListener('click', function() {
		weekSwiper.slidePrev();
	});


	// Init events

	// Build the main schedule
	pushScheduleImages(mainSwiper, scheduleUrlFactory(settings.main.id, mainWeek), mainDay);

	// If the double schedule is turned on, build the other schedule
	if (settings.double) {
		builtOtherSchedule = true;
		pushScheduleImages(otherSwiper, scheduleUrlFactory(settings.other.id, otherWeek), otherDay);
	}

	// Push out the current week number
	pushWeekNumber();

	// Setup the week slider
	populateWeekSlider();