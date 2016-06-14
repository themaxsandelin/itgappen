
  // Set default moment locale (lang) so Swedish
  moment.locale('sv');

  if ('addEventListener' in document) {
    document.addEventListener('DOMContentLoaded', function() {
      FastClick.attach(document.body);
    }, false);
  }

	var double = true;
  var settings = getStoredSettings();

  var typeSwiper = new Swiper('.swiper-container#scheduleType', {
    observer: true,
    observeParents: true,
		onSlideChangeStart: function(swiper) {
			console.log(swiper.activeIndex);
		}
  });

  // Retrieves stored settings from localStorage, though if there is none(null) it returns a base object for settings
  function getStoredSettings() {
		var stored = (localStorage.getItem('itgappen_settings')) ? JSON.parse(localStorage.getItem('itgappen_settings')):{};
    var keys = Object.keys(stored);

    if (keys.indexOf('double') === -1) stored.double = true;
		if (!stored.main) stored.main = {};
		if (!stored.other) stored.other = {};

		if (!stored.main.title) stored.main.title = 'Mitt schema';
		if (!stored.other.title) stored.other.title = 'Annat schema';

		if (!stored.main.id) stored.main.id = '{1AFAF6FA-4F7D-42FB-8916-97BE0AD20A91}';
		if (!stored.other.id) stored.other.id = '{09EF1F69-CBD3-4FFC-B613-8967B2106FE9}';

		if (!stored.main.name) stored.main.name = '2C Joel Eriksson';
		if (!stored.other.name) stored.other.name = 'Johan Kivi';

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
		req.open('GET', 'http://139.59.171.126:1337/api/v2/schedules', true);
		req.send();
		req.onreadystatechange = function() {
			if (req.readyState == 4 && req.status == 200) callback(JSON.parse(req.responseText));
		}
	}

  // Pushes out the calendar list to the settings page
	function pushCalendarLists(list) {
		var settings = document.getElementById('calendarSource');
		settings.innerHTML = '<option value="0" selected disabled>Välj klass..</option>';
		list.forEach(function(item, i) {
			settings.innerHTML += '<option value="'+item.calendar+'">'+item.name+'</option>';
		});
	}

  // Toggles the double schedule setting off and on both in the UI and in the settings object.
  function toggleDoubleSchedule(e) {
    var sw = document.getElementById('doubleSchedule');
    sw.classList.toggle('on');
    settings.double = !settings.double;
    saveSettings();
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
    console.log(settings);
    // Setup double schedules
    if (settings.double) document.getElementById('doubleSchedule').classList.add('on');

    // Setup main schedule values
    if (settings.main) {
      if (settings.main.title) setupTitles('main', settings.main.title);
    }

    // Setup other schedule values
    if (settings.other) {
      if (settings.other.title) setupTitles('other', settings.other.title);
    }

    // Setup calendar value
    if (settings.calendar) document.getElementById('calendarSource').value = settings.calendar.id;
  }

  // Basic setup that calls methods for setting up the app.
  function setupActions() {
    updateSettingsValues();
  }


  // Add click event for all double schedule toggles.
  var items = document.querySelectorAll('.toggleDoubleSchedule');
  for (var i = 0; i < items.length; i++) {
    items[i].addEventListener('click', toggleDoubleSchedule);
  }

  getSchedules(function(list) {
    pushCalendarLists(list.classes);

    // Run the basic setup
    setupActions();
  });

  // Click on the clear icon of the schedule titles
  document.getElementById('clearMain').addEventListener('click', clearScheduleTitle);
  document.getElementById('clearOther').addEventListener('click', clearScheduleTitle);

  // Click to change the source of the main schedule
  document.getElementById('mainSource').addEventListener('click', function() {
    showModal('#picker');
  });

  // Change the value of the calendar source
  document.getElementById('calendarSource').addEventListener('change', calendarChanged);

  // Blur of the main schedule title input, check for updates
  document.getElementById('mainInput').addEventListener('blur', titleChanged);

  // Blur of the other schedule title input, check for updates
  document.getElementById('otherInput').addEventListener('blur', titleChanged);