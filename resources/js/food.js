
	var foodSwiper = new Swiper('#foodTabs', {
		observer: true,
    observeParents: true,
		onProgress: sliderMove,
		onSetTransition: sliderTransition,
		onSlideChangeStart: sliderChange
	});

	// Update the selected day when the active swiper changes slide index.
	function sliderChange(swiper) {
		var arr = document.querySelector('ul.food').querySelectorAll('li');
		var tabs = [];
		for(var i = arr.length; i--; tabs.unshift(arr[i]));

		tabs.forEach(function(item, i) {
			if (i !== swiper.activeIndex) {
				item.style.opacity = 0.5;
			} else {
				item.style.opacity = 1.0;
			}
		});
	}

	// Set transition on the day bar when the swiper changes it's transition
	function sliderTransition(swiper, transition) {
		var bar = document.querySelector('ul.food span');
		var t = transition / 1000;

		bar.style.webkitTransition = '-webkit-transform '+t+'s ease';
		bar.style.mozTransition = '-moz-transform '+t+'s ease';
		bar.style.msTransition = '-ms-transform '+t+'s ease';
		bar.style.oTransition = '-o-transform '+t+'s ease';
		bar.style.transition = 'transform '+t+'s ease';

		var arr = document.querySelector('ul.food').querySelectorAll('li');
		var tabs = [];
		for(var i = arr.length; i--; tabs.unshift(arr[i]));

		tabs.forEach(function(item) {
			item.style.webkitTransition =
			item.style.mozTransition =
			item.style.msTransition =
			item.style.oTransition =
			item.style.transition = 'opacity '+t+'s ease';
		});
	}

	// Move the day bar when the active swiper moves the slides
	function sliderMove(swiper, progress) {
		var bar = document.querySelector('ul.food span');
		var m = 100 * progress;

		bar.style.webkitTransform =
		bar.style.mozTransform =
		bar.style.msTransform =
		bar.style.oTransform =
		bar.style.transform = 'translate3d('+m+'%,0px,0px)';

		var prog = progress;
		if (prog >= 0 && prog < 1) {
			var tabs = document.querySelector('ul.food').querySelectorAll('li');
			var fr = tabs[0];
			var to = tabs[1];

			if (progress <= 1) {
				var raise = 0.5 + (progress / 2);
				var lower = 1 - (progress / 2);

				fr.style.opacity = lower;
				to.style.opacity = raise;
			}
		}
	}

	// Retrieve the cafe info from the API
	function getCafeInfo(callback) {
		var req = new XMLHttpRequest();
		req.open('GET', 'http://139.59.171.126:1337/api/2/cafe', true);
		req.send();
		req.onreadystatechange = function() {
			if (req.readyState == 4 && req.status == 200) callback(JSON.parse(req.responseText));
		}
	}

	// Retrieve the lunch list of the week from the API
	function getLunchList(callback) {
		var req = new XMLHttpRequest();
		req.open('GET', 'http://139.59.171.126:1337/api/2/lunch'), true;
		req.send();
		req.onreadystatechange = function() {
			if (req.readyState == 4 && req.status == 200) callback(JSON.parse(req.responseText));
		}
	}

	function pushCafePreview() {

	}

	function pushCafeOpenInfo() {

	}

	function pushCafePrices(prices) {
		var list = document.querySelector('ul.pricelist');

		prices.forEach(function(item, i) {
			var li = document.createElement('li');
			li.innerHTML = item.name;
			li.innerHTML += '<span>'+item.price+'kr</span>';

			list.appendChild(li);
		});
	}

	function pushLunchList(list) {
		var ul = document.querySelector('ul.lunch');
		var now = moment();
		ul.innerHTML = '';

		list.forEach(function(day, i) {
			var mmt = moment.unix(day.date);
			var li = document.createElement('li');

			if (now.format('d') > 0 && now.format('d') < 5) {
				if (now.format('d') === mmt.format('d')) li.classList.add('active');
			} else {
				if (mmt.format('d') === '5') li.classList.add('active');
			}

			var date = document.createElement('div');
			date.classList.add('date');
			date.innerHTML =
				'<span>'+mmt.format('ddd')+'</span>'+
					mmt.format('D')+
				'<span>'+mmt.format('MMM')+'</span>'
			;

			var content = document.createElement('div');
			content.classList.add('content');
			if (day.meals) {
				day.meals.forEach(function(meal, i) {
					content.innerHTML += '<span>'+meal.value+'</span>';
				});
			} else if (day.reason) {
				content.classList.add('nope');
				content.innerHTML = '<span>'+day.reason+'</span>';
			}

			li.appendChild(date);
			li.appendChild(content);
			ul.appendChild(li);
		});
	}

	// Setup click events for the food tabs
	var arr = document.querySelectorAll('ul.food li');
	var tabs = [];
	for(var i = arr.length; i--; tabs.unshift(arr[i]));

	tabs.forEach(function(tab) {
		tab.addEventListener('click', function() {
			var toTab = tab.getAttribute('data-tab');
			if (toTab === 'cafe') {
				foodSwiper.slideTo(0, 300);
			} else {
				foodSwiper.slideTo(1, 300);
			}
		});
	});

	function foodSetup() {
		// Retrieve cafe information and push it to the page
		getCafeInfo(function(data) {
			pushCafePrices(data.prices);
		});

		// Retrieve lunch information and push it to the page
		getLunchList(function(data) {
			pushLunchList(data);
		});
	}