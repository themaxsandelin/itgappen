
	// Swiper for the stop(s) bar
	var stopSwiper = new Swiper('#stops', {
		slidesPerView: 2.2,
		centeredSlides: true,

		onSlideChangeStart: swiperChange,
		onProgress: swiperProgress,
		onSetTransition: swiperTransition
	});

	// Swiper for the transit list(s)
	var transitSwiper = new Swiper('#transitSwiper', {
		observer: true,
		observeParents: true
	});

	// Tie together the controls of the swipers to control eachother upon progress change
	stopSwiper.params.control = transitSwiper;
  transitSwiper.params.control = stopSwiper;

	// Controls the index change of a slider
	function swiperChange(swiper) {
		var slides = swiper.slides.length;

		for (var s = 0; s < slides; s++) {
			var slide = swiper.slides[s];
			slide.style.opacity = (s === swiper.activeIndex) ? '1':'0.5';
		}
	}

	// Controllers the progress change of a slider
	function swiperProgress(swiper) {
		var spaces = swiper.slides.length - 1;
		var breakpoint = 1 / spaces;
		var index = Math.floor(swiper.progress / breakpoint);

		if (swiper.progress >= 0 && index < spaces) {
			var progress = (swiper.progress * spaces) - index;

			var fr = swiper.slides[index];
			fr.style.opacity = 1 - (0.5 * progress);

			var to = swiper.slides[index+1];
			to.style.opacity = 0.5 + (0.5 * progress);
		}
	}

	// Controlls the transition change of a slider
	function swiperTransition(swiper, transition) {
		var t = transition / 1000;
		var arr = swiper.slides;
		var slides = [];
		for(var i = arr.length; i--; slides.unshift(arr[i]));

		slides.forEach(function(slide) {
			slide.style.webkitTransition =
			slide.style.mozTransition =
			slide.style.msTransition =
			slide.style.oTransition =
			slide.style.transition = 'opacity '+t+'s ease';
		});
	}

	// Will load the transit information from the public API
	// and return the data as parsed JSON data
	function loadTransits(callback) {
		var req = new XMLHttpRequest();
		req.open('GET', 'http://139.59.171.126:8888/api/v2/transit', true);
		// req.open('GET', 'http://127.0.0.1:8888/api/v2/transit', true);
		req.send();
		req.onreadystatechange = function() {
			if (req.readyState === 4 && req.status === 200) callback(JSON.parse(req.responseText));
		}
	}

	// Orders the stops received from the API based on a specific order
	function orderStops(a, b) {
		var order = ['Chalmers', 'Kapellplatsen', 'Chalmers tvärgata', 'Chalmersplatsen'];

		var ai = order.indexOf(a.stop);
		var bi = order.indexOf(b.stop);

		if (ai < bi) return -1;
  	if (ai > bi) return 1;

		return 0;
	}

	// Order the trips based on their numerical line property value
	function orderTrips(a, b) {
		return a.line - b.line;
	}

	// Formats the time from a departure in a trip and returns the correct format
	function formatDeparture(time) {
		time = (time > 0) ? time+'m':'Nu';
		return time;
	}

	// Appends the trips of a stop in a list based on the data received from the API
	function pushTransitResults(stop) {
		var list = document.querySelector('.transitStop[data-transit-stop="'+stop.stop+'"] ul.trips');

		list.innerHTML = '';
		list.classList.remove('empty');
		var departures = stop.departures.sort(orderTrips);
		if (departures.length > 0) {
			// Append all trips
			departures.forEach(function(trip) {
				var first = formatDeparture(trip.departures[0].wait);
				var second = (trip.departures.length > 1) ? formatDeparture(trip.departures[1].wait):'-';

				list.innerHTML +=
					'<li>'+
						'<div class="tag" style="background-color:'+trip.foreground+'; color:'+trip.background+';">'+trip.line+'</div>'+
						'<h6>'+trip.direction+'</h6>'+
						'<ul class="departures">'+
							'<li>'+first+'</li>'+
							'<li>'+second+'</li>'+
						'</ul>'+
					'</li>'
				;
			});
		} else {
			// Append empty message
			list.classList.add('empty');
			list.innerHTML = '<li><h6 class="message">Kunde inte hitta några avgångar.</h6></li>';
		}
	}

	// Click handler for transit stops in the stop bar
	function stopSlideClick() {
		var index = parseInt(this.getAttribute('data-index'));
		if (stopSwiper.activeIndex !== index) stopSwiper.slideTo(index, 300);
	}

	// Initially loads the transit information and manages it.
	loadTransits(function(stops) {
		var stops = stops.sort(orderStops);

		stops.forEach(function(item, i) {
			var stopSlide = document.createElement('div');
			stopSlide.classList.add('swiper-slide');
			stopSlide.setAttribute('data-index', i);

			stopSlide.addEventListener('click', stopSlideClick);

			var stopText = document.createElement('h5');
			stopText.innerHTML = item.stop;

			stopSlide.appendChild(stopText);
			stopSwiper.appendSlide(stopSlide);

			var tripStop = document.createElement('div');
			tripStop.classList.add('swiper-slide');
			tripStop.classList.add('transitStop');
			tripStop.setAttribute('data-transit-stop', item.stop);

			var tripList = document.createElement('ul');
			tripList.classList.add('trips');

			tripStop.appendChild(tripList);
			transitSwiper.appendSlide(tripStop);
			pushTransitResults(item);
		});
	});