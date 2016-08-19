
	function showLoader(selector, callback) {
		var loader = document.querySelector(selector);

		loader.classList.add('display');
		setTimeout(function() {
			loader.classList.add('show');
			if (callback) {
				setTimeout(function() {
					callback();
				}, 320);
			}
		}, 20);
	}

	function hideLoader(selector, callback) {
		var loader = document.querySelector(selector);

		loader.classList.remove('show');
		setTimeout(function() {
			loader.classList.remove('display');
			if (callback) {
				callback();
			}
		}, 320);
	}

	document.getElementById('update').addEventListener('click', function() {
		var page = document.querySelector('body').getAttribute('data-active-page');

		if (page === 'schedule') {
			showLoader('#schedule .pageLoader', function() {
				updateSchedules(function() {
					hideLoader('#schedule .pageLoader');
				});
			});
		} else if (page === 'calendar') {
			showLoader('#calendar .pageLoader', function() {
				updateCalendar(function() {
					hideLoader('#calendar .pageLoader');
				});
			});
		} else if (page === 'food') {
			showLoader('#food .pageLoader', function() {
				updateFood(function() {
					hideLoader('#food .pageLoader');
				});
			});
		} else if (page === 'transit') {
			showLoader('#transit .pageLoader', function() {
				updateTransit(function() {
					hideLoader('#transit .pageLoader');
				});
			});
		}
	});