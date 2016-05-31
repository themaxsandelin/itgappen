
	// Grab the basic number representation of the day of the week.
	// But take into account that moment starts the week on Sunday(0) so fix that.
	// Then just decrease the value by 1 to accomodate the week start (monday) being 1 and not 0
	var d = ((parseInt(moment().format('d')) === 0) ? 7:parseInt(moment().format('d'))) - 1;
	// Grab the day of the week number and make sure that if it is Friday, Saturday or Sunday you always set it to 4
	var day = (d < 4) ? d:4;

	// Main date variables
	var mainDay = day;
	var mainWeek = moment().format('w');
	// Other date variables
	var otherDay = day;
	var otherWeek = moment().format('w');

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

	// Update the selected day when the active swiper changes slide index.
	function slideChange(swiper) {
		if (document.querySelector('body').getAttribute('data-active-schedule') === 'main') mainDay = swiper.activeIndex;
		else otherDay = swiper.activeIndex;

		document.querySelector('body').setAttribute('data-selected-day', swiper.activeIndex);
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

	// Click on the main title
	document.querySelector('.titles').addEventListener('click', function() {
		if (currentPage === 'schedule') {
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
		var swiper;

		if (document.querySelector('body').getAttribute('data-active-schedule') === 'main') {
			document.querySelector('body').setAttribute('data-active-schedule', 'other');
			document.querySelector('body').setAttribute('data-selected-day', otherDay);

			swiper = otherSwiper;
		} else {
			document.querySelector('body').setAttribute('data-active-schedule', 'main');
			document.querySelector('body').setAttribute('data-selected-day', mainDay);

			swiper = mainSwiper;
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

		pushWeekNumber();
	}

	// Factory function to generate an array of URLs for all days of the week based on the {id} parameter
	function scheduleUrlFactory(id) {
		var width = window.innerWidth - 30;
		var height = width * 3;
		var week = moment().format('w');

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
	function pushScheduleImages(swiper, urls) {
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

	function pushWeekNumber() {
		var activeSchedule = document.querySelector('body').getAttribute('data-active-schedule');
		var week = (activeSchedule === 'main') ? mainWeek:otherWeek;

		document.getElementById('weekNumber').innerHTML = '<p>v.'+week+'</p>';
	}

	var mainID = '{1AFAF6FA-4F7D-42FB-8916-97BE0AD20A91}';
	var otherID = '{09EF1F69-CBD3-4FFC-B613-8967B2106FE9}';

	pushScheduleImages(mainSwiper, scheduleUrlFactory(mainID) );
	pushScheduleImages(otherSwiper, scheduleUrlFactory(otherID) );
	pushWeekNumber();