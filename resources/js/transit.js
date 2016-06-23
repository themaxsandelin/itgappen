
	// Setup the stop swiper bar
	var stopSwiper = new Swiper('#stops', {
		slidesPerView: 2.2,
		centeredSlides: true,

		onSlideChangeStart: swiperChange,
		onProgress: swiperProgress,
		onSetTransition: swiperTransition
	});

	var transitSwiper = new Swiper('#transitSwiper', {
		observer: true,
		observeParents: true
	});

	stopSwiper.params.control = transitSwiper;
  transitSwiper.params.control = stopSwiper;



	function swiperChange(swiper) {
		var slides = swiper.slides.length;

		for (var s = 0; s < slides; s++) {
			var slide = swiper.slides[s];
			slide.style.opacity = (s === swiper.activeIndex) ? '1':'0.5';
		}
	}

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
		req.open('GET', 'http://139.59.171.126:1337/api/v2/transit', true);
		// req.open('GET', 'http://127.0.0.1:1337/api/v2/transit', true);
		req.send();
		req.onreadystatechange = function() {
			if (req.readyState === 4 && req.status === 200) callback(JSON.parse(req.responseText));
		}
	}

	function orderStops(a, b) {
		var order = ['Chalmers', 'Kapellplatsen', 'Chalmers tvärgata', 'Chalmersplatsen'];

		var ai = order.indexOf(a.stop);
		var bi = order.indexOf(b.stop);

		if (ai < bi) return -1;
  	if (ai > bi) return 1;

		return 0;
	}

	function orderTrips(a, b) {
		return a.line - b.line;
	}

	function pushTransitResults(stop) {
		var list = document.querySelector('.transitStop[data-transit-stop="'+stop.stop+'"] ul.trips');

		list.innerHTML = '';
		list.classList.remove('empty');
		var departures = stop.departures.sort(orderTrips);
		if (departures.length > 0) {
			// Append all trips
			departures.forEach(function(trip) {
				var first = trip.departures[0].wait + 'm';
				var second = (trip.departures.length > 1) ? trip.departures[1].wait + 'm':'-';

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
			list.innerHTML = '<li><h6>Kunde inte hitta några avgångar.</h6></li>';
		}
	}

	loadTransits(function(stops) {
		var stops = stops.sort(orderStops);

		stops.forEach(function(item) {
			stopSwiper.appendSlide('<div class="swiper-slide"><h5>'+item.stop+'</h5></div>');

			var slide =
				'<div class="swiper-slide transitStop" data-transit-stop="'+item.stop+'">'+
					'<ul class="trips"></ul>'+
				'</div>'
			;
			transitSwiper.appendSlide(slide);
			pushTransitResults(item);
		});
	});