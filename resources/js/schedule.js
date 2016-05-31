
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

	function slideChange(swiper) {
		document.querySelector('body').setAttribute('data-selected-day', swiper.activeIndex);
	}

	function sliderTransition(swiper, transition) {
		var bar = document.querySelector('ul.days span');
		var t = transition / 1000;

		bar.style.webkitTransition = '-webkit-transform '+t+'s ease';
		bar.style.mozTransition = '-moz-transform '+t+'s ease';
		bar.style.msTransition = '-ms-transform '+t+'s ease';
		bar.style.oTransition = '-o-transform '+t+'s ease';
		bar.style.transition = 'transform '+t+'s ease';
	}

	function sliderMove(swiper, progress) {
		var bar = document.querySelector('ul.days span');
		var move = 100 * (4 * swiper.progress);

		bar.style.webkitTransform =
		bar.style.mozTransform =
		bar.style.msTransform =
		bar.style.oTransform =
		bar.style.transform = 'translate3d('+move+'%,0px,0px)';
	}

	// Click on the main title
	document.querySelector('.titles').addEventListener('click', function() {
		if (currentPage === 'schedule') {
			// You are on the schedule page, switch between schedules
			switchSchedules();
		}
	});

	document.getElementById('weeks').addEventListener('click', function() {
		var display = (document.querySelector('body').getAttribute('data-display-weeks') === 'true') ? 'false':'true';
		document.querySelector('body').setAttribute('data-display-weeks', display);
	});

	// Click on the days to change day
	var days = document.querySelectorAll('ul.days li');
	for (var d = 0; d < days.length; d++) {
		days[d].addEventListener('click', dayClick);
	}

	function dayClick(e) {
		var day = e.target.getAttribute('data-day');
		var current = document.querySelector('body').getAttribute('data-selected-day');

		if (current !== day) {
			document.querySelector('body').setAttribute('data-selected-day', day);
			mainSwiper.slideTo(day);
		}
	}

	// Will switch between the two schedules based on which one is in view
	function switchSchedules() {
		var opposite = (document.querySelector('body').getAttribute('data-active-schedule') === 'main') ? 'other' : 'main';
		document.querySelector('body').setAttribute('data-active-schedule', opposite);
	}

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

	function pushScheduleImages(swiper, urls) {
		swiper.removeAllSlides();
		urls.forEach(function(url, i) {
			swiper.appendSlide(
				'<div class="swiper-slide">'+
					'<img src="'+url+'" alt="Schema bild">'+
				'</div>'
			);
		});
	}

	var mainID = '{1AFAF6FA-4F7D-42FB-8916-97BE0AD20A91}';
	var otherID = '{09EF1F69-CBD3-4FFC-B613-8967B2106FE9}';

	pushScheduleImages(mainSwiper, scheduleUrlFactory(mainID) );
	pushScheduleImages(otherSwiper, scheduleUrlFactory(otherID) );