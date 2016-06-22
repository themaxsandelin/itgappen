
	// Setup the stop swiper bar
	var stopSwiper = new Swiper('#stops', {
		slidesPerView: 2.2,
		centeredSlides: true,

		onProgress: stopProgress,
		onSetTransition: stopTransition,
		onSlideChangeStart: stopChange
	});

	var transitSwiper = new Swiper('#transitSwiper', {
		observer: true,
		observeParents: true
	});

	stopSwiper.params.control = transitSwiper;
  transitSwiper.params.control = stopSwiper;

	function stopProgress(swiper) {
		var spaces = swiper.slides.length - 1;
		var breakpoint = 1 / spaces;
		var index = Math.floor(swiper.progress / breakpoint);

		if (swiper.progress >= 0 && index < spaces) {
			var progress = (swiper.progress * spaces) - index;

			var fr = swiper.slides[index];
			var frScale = 1.2 - (0.2 * progress);
			var frOpac = 1 - (0.5 * progress);

			var to = swiper.slides[index+1];
			var toScale = 1.0 + (0.2 * progress);
			var toOpac = 0.5 + (0.5 * progress);

			setSlideStyles(fr, frScale, frOpac);
			setSlideStyles(to, toScale, toOpac);
		}
	}

	function stopTransition(swiper, transition) {
		var t = transition / 1000;

		var arr = document.getElementById('stops').querySelectorAll('.swiper-wrapper .swiper-slide');
		var slides = [];
		for(var i = arr.length; i--; slides.unshift(arr[i]));

		slides.forEach(function(slide) {
			slide.style.webkitTransition = '-webkit-transform '+t+'s ease, opacity '+t+'s ease';
			slide.style.mozTransition = '-moz-transform '+t+'s ease, opacity '+t+'s ease';
			slide.style.msTransition = '-ms-transform '+t+'s ease, opacity '+t+'s ease';
			slide.style.oTransition = '-o-transform '+t+'s ease, opacity '+t+'s ease';
			slide.style.transition = 'transform '+t+'s ease, opacity '+t+'s ease';
		});
	}

	function stopChange(swiper) {
		var stop = swiper.slides.length;

		for (var s = 0; s < stop; s++) {
			var slide = swiper.slides[s];
			var scale;
			var opac;
			if (s !== swiper.activeIndex) {
				scale = '1.0';
				opac = '0.5';
			} else {
				scale = '1.2';
				opac = '1';
			}
			setSlideStyles(slide, scale, opac);
		}
	}

	function setSlideStyles(slide, scale, opac) {
		slide.style.webkitTransform =
		slide.style.mozTransform =
		slide.style.msTransform =
		slide.style.oTransform =
		slide.style.transform = 'scale('+scale+')';
		slide.style.opacity = opac;
	}

	// Will load the transit information from the public API
	// and return the data as parsed JSON data
	function loadTransits(callback) {
		var req = new XMLHttpRequest();
		req.open('GET', 'http://139.59.171.126:1337/api/v2/transit', true);
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
			stopSwiper.appendSlide('<div class="swiper-slide">'+item.stop+'</div>');

			var slide =
				'<div class="swiper-slide transitStop" data-transit-stop="'+item.stop+'">'+
					'<ul class="trips"></ul>'+
				'</div>'
			;
			transitSwiper.appendSlide(slide);
			pushTransitResults(item);
		});
	});