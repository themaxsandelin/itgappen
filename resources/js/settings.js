
  // Set default moment locale (lang) so Swedish
  moment.locale('sv');

  if ('addEventListener' in document) {
    document.addEventListener('DOMContentLoaded', function() {
      FastClick.attach(document.body);
    }, false);
  }

  var settings = getStoredSettings();
	var schedules = {};
	var setupOtherFirst = false;

	var tempSchedule = {};

  var typeSwiper = new Swiper('.swiper-container#scheduleType', {
    observer: true,
    observeParents: true,
		onSlideChangeStart: updatePickerType
  });

  // Retrieves stored settings from localStorage, though if there is none(null) it returns a base object for settings
  function getStoredSettings() {
		var stored = (localStorage.getItem('itgappen_settings')) ? JSON.parse(localStorage.getItem('itgappen_settings')):{};
		return stored;
  }

  function saveSettings() {
    localStorage.setItem('itgappen_settings', JSON.stringify(settings));
  }

	// Clear schedule title based on the click target's ID
	function clearScheduleTitle(e) {
		var id = e.target.id;
		var target;

		if (id === 'clearMain') target = document.getElementById('mainInput');
		else target = document.getElementById('otherInput');

		target.value = '';
		target.focus();
	}

  // GET request to the API to get all schedule data
	function getSchedules(callback) {
		var req = new XMLHttpRequest();
		req.open('GET', 'http://139.59.171.126:1337/api/2/schedules', true);
		// req.open('GET', 'http://127.0.0.1:1337/api/2/schedules', true);
		req.send();
		req.onreadystatechange = function() {
			if (req.readyState == 4 && req.status == 200) callback(JSON.parse(req.responseText));
		}
	}

  // Pushes out the calendar list to the settings page
	function pushCalendarLists(list, element) {
		var settings = document.getElementById(element);
		settings.innerHTML = '<option value="0" selected disabled>Välj klass..</option>';
		list.forEach(function(item, i) {
			settings.innerHTML += '<option value="'+item.calendar+'">'+item.name+'</option>';
		});
	}

  // Toggles the double schedule setting off and on both in the UI and in the settings object.
  function toggleDoubleSchedule(e) {
		if (!settings.double && Object.keys(settings.other).length === 0) {
			document.getElementById('picker').setAttribute('data-pick-for', 'other');
	    showModal('#picker');
			resetPicker();
			setupOtherFirst = true;
		} else {
			performAction();
		}

		function performAction() {
			var sw = document.getElementById('doubleSchedule');
	    settings.double = !settings.double;

			if (settings.double) {
				sw.classList.add('on');
				enableDoubleSchedule();
			} else {
				sw.classList.remove('on');
				disableDoubleSchedule();
			}
	    saveSettings();
		}
  }

	function setupDoubleFirst() {
		document.getElementById('doubleSchedule').classList.add('on');
		settings.double = true;
		saveSettings();
		enableDoubleSchedule();
		pushScheduleImages(otherSwiper, scheduleUrlFactory(settings.other.id, otherWeek), otherDay);
	}

	function enableDoubleSchedule() {
		document.querySelector('body').setAttribute('data-double-schedule', 'true');

		document.getElementById('otherInput').value = settings.other.title;
		document.getElementById('otherSourceName').innerHTML = settings.other.name;
	}

	function disableDoubleSchedule() {
		document.querySelector('body').setAttribute('data-double-schedule', 'false');

		document.getElementById('otherInput').value = ' ';
		document.getElementById('otherSourceName').innerHTML = '';

		if (document.querySelector('body').getAttribute('data-active-schedule') === 'other') {
			switchingSchedule = true;
			document.querySelector('body').setAttribute('data-active-schedule', 'main');
			document.querySelector('body').setAttribute('data-selected-day', mainDay);

			var swiper = mainSwiper;
			var week = mainWeek;
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
	}

  // Change event of the calendar source, update the settings object and save the settings.
  function calendarChanged(e) {
    var cal = {
      id: e.target.value,
      name: e.target.options[e.target.selectedIndex].text
    };

    if (cal.id !== '0')
      settings.calendar = cal;
      saveSettings();
  }

  // Handles the output (UI) of both the main and other scheule's title.
  function titleChanged(e) {
    var id = e.target.id;
    var val = e.target.value;
    var def;

    if (id === 'mainInput') {
      def = settings.main.title;
    } else {
      def = settings.other.title;
    }

    if (val === '') return e.target.value = def;

    if (val !== def) {
      if (id === 'mainInput') {
        settings.main.title = val
        setupTitles('main', val);
      } else {
        settings.other.title = val;
        setupTitles('other', val);
      }

      saveSettings();
    }
  }

  // Fill in elements containing the title of either the main or the other schedule
  function setupTitles(type, value) {
    if (type === 'main') {
      // Setup main schedule titles
      document.getElementById('mainTitle').innerHTML = value;
      document.getElementById('mainInput').value = value;
    } else {
      // Setup other schedule titles
      document.getElementById('otherTitle').innerHTML = value;
      document.getElementById('otherInput').value = value;
    }
  }

  function updateSettingsValues() {
    // Setup double schedules
    if (settings.double) {
			document.querySelector('body').setAttribute('data-double-schedule', 'true');
			document.getElementById('doubleSchedule').classList.add('on');

			// Setup other schedule values
	    if (settings.other) {
	      if (settings.other.title) setupTitles('other', settings.other.title);
				if (settings.other.name) document.getElementById('otherSourceName').innerHTML = settings.other.name;
	    }
		} else {
			document.getElementById('otherInput').value = ' ';
			document.getElementById('otherSourceName').innerHTML = '';
		}

    // Setup main schedule values
    if (settings.main) {
      if (settings.main.title) setupTitles('main', settings.main.title);
			if (settings.main.name) document.getElementById('mainSourceName').innerHTML = settings.main.name;
    }

    // Setup calendar value
    if (settings.calendar) document.getElementById('calendarSource').value = settings.calendar.id;
  }

	function resetPicker() {
		typeSwiper.slideTo(0, 0);
		setDataList('students', schedules.students, 'allSource');
	}

	function updatePickerType(swiper) {
		var i = swiper.activeIndex;
		var type;
		var list;
		var prev = document.getElementById('backType');
		var next = document.getElementById('forwardType');

		if (i === 0) {
			type = 'students';
			list = schedules.students;
			prev.classList.add('disabled');
		} else {
			prev.classList.remove('disabled');
			if (i === 3) {
				next.classList.add('disabled');

				type = 'classrooms';
				list = schedules.classrooms;
			} else {
				next.classList.remove('disabled');

				if (i === 1) {
					type = 'teachers';
					list = schedules.teachers;
				} else if (i === 2) {
					type = 'classes';
					list = schedules.classes;
				}
			}
		}

		setDataList(type, list, 'allSource');
	}

	function setDataList(type, list, element) {
		var select = document.getElementById(element);
		var text;
		if (type === 'students') text = 'Välj elev..';
		else if (type === 'teachers') text = 'Välj lärare..';
		else if (type === 'classes') text = 'Välj klass..';
		else text = 'Välj sal..';

		select.innerHTML = '<option selected value="0">'+text+'</option>';
		for (var s = 0; s < list.length; s++) {
			var item = list[s];
			var option = document.createElement('option');
			option.value = item.schedule;
			option.innerHTML = item.name;
			if (type === 'students') option.setAttribute('data-class', item.class);

			select.appendChild(option);
		}
	}

	function scheduleChange(el) {
		var id = el.value;
		if (id !== '0') {
			tempSchedule = {
				id: id,
				name: el.options[el.selectedIndex].text
			};

			document.getElementById('savePick').classList.remove('disabled');
		} else {
			document.getElementById('savePick').classList.add('disabled');
		}
	}

	function saveScheduleChange() {
		var type = document.getElementById('picker').getAttribute('data-pick-for');
		if (type === 'main') {
			settings.main.id = tempSchedule.id;
			settings.main.name = tempSchedule.name;
		} else {
			settings.other.id = tempSchedule.id;
			settings.other.name = tempSchedule.name;
		}
		updateSettingsValues();
		hideModal('#picker');
	}

  // Add click event for all double schedule toggles.
  var items = document.querySelectorAll('.toggleDoubleSchedule');
  for (var i = 0; i < items.length; i++) {
    items[i].addEventListener('click', toggleDoubleSchedule);
  }

  // Click on the clear icon of the schedule titles
  document.getElementById('clearMain').addEventListener('click', clearScheduleTitle);
  document.getElementById('clearOther').addEventListener('click', clearScheduleTitle);

  // Click to change the source of the main schedule
  document.getElementById('mainSource').addEventListener('click', function() {
		document.getElementById('picker').setAttribute('data-pick-for', 'main');
    showModal('#picker');
		resetPicker();
  });

	// Click to change the source of the other schedule
  document.getElementById('otherSource').addEventListener('click', function() {
		document.getElementById('picker').setAttribute('data-pick-for', 'other');
    showModal('#picker');
		resetPicker();
  });

  // Change the value of the calendar source
  document.getElementById('calendarSource').addEventListener('change', calendarChanged);

  // Blur of the main schedule title input, check for updates
  document.getElementById('mainInput').addEventListener('blur', titleChanged);

  // Blur of the other schedule title input, check for updates
  document.getElementById('otherInput').addEventListener('blur', titleChanged);

	// Change schedule type (backward)
	document.getElementById('backType').addEventListener('click', function() {
		typeSwiper.slidePrev();
	});

	// Change schedule type (forward)
	document.getElementById('forwardType').addEventListener('click', function() {
		typeSwiper.slideNext();
	});

	// Pick up change event on the schedule select element
	document.getElementById('allSource').addEventListener('change', function() {
		scheduleChange(this);
	});

	// Cancel schedule change
	document.getElementById('abortPick').addEventListener('click', function() {
		setupOtherFirst = false;
		hideModal('#picker');
	});

	// Save schedule change
	document.getElementById('savePick').addEventListener('click', function() {
		var disabled = this.classList.contains('disabled');
		if (!disabled) {
			if (setupOtherFirst) {
				document.getElementById('otherInput').value = 'Annat schema';
				document.getElementById('otherTitle').value = 'Annat schema';
				settings.other.title = 'Annat schema';
				setupOtherFirst = false;
				saveScheduleChange();
				setupDoubleFirst();
			} else {
				saveScheduleChange();
			}
		}
	});

	document.getElementById('reset').addEventListener('click', function() {
		showModal('#approveReset');
	});

	document.getElementById('abortReset').addEventListener('click', function() {
		hideModal('#approveReset');
	});

	document.getElementById('resetApp').addEventListener('click', function() {
		hideModal('#approveReset');
		showLoading();
		moveToPage('schedule');
		setTimeout(function() {
			hideSettings();
			resetIntro();
			resetApp();
			localStorage.removeItem('itgappen_settings');
			document.querySelector('body').setAttribute('data-hidden', 'false');
			showIntro();
			setTimeout(function() {
				hideLoading();
			}, 320);
		}, 320);
	});

	function resetApp() {
		document.getElementById('doubleSchedule').classList.remove('on');
	}

	// Basic setup that calls methods for setting up the app.
  function settingsSetup() {
    updateSettingsValues();
  }

  getSchedules(function(list) {
		schedules = list;
    pushCalendarLists(list.classes, 'calendarSource');
		pushCalendarLists(list.classes, 'introCalendar');
		setDataList('students', list.students, 'introMySchedule');
		setDataList('students', list.students, 'introOtherSchedule');

		setupApplication();
  });