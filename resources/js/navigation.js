
	var currentPage = 'schedule',
			titles = {
				'calendar': 'Kalender',
				'food': 'Lunch & fika',
				'transit': 'Kollektivtrafik',
				'news': 'Nyheter',
				'union': 'Elevkåren',
				'developers': 'Utvecklare',
				'faq': 'Vanliga frågor',
				'feedback': 'Skicka feedback'
			};

	// Click on the menu button to show the main navigation drawer
  document.getElementById('menuButton').addEventListener('click', function() { showDrawer(); });

	// Click on the left arrow in the main navigation drawer to close it
  document.getElementById('closeMenu').addEventListener('click', function() { hideDrawer(); });

	// Click on the overlay to close the main navigation drawer
  document.getElementById('coreOverlay').addEventListener('click', function() { hideDrawer(); });

	// Add click event to all list items for changing page
	var items = document.querySelectorAll('ul.drawerMenu li');
	for (var i = 0; i < items.length; i++) {
		items[i].addEventListener('click', function(e) {
			// Get the page attribute and move to that page, if the selected page isn't the items page attribute
			var page = e.currentTarget.getAttribute('data-page');
			if (page !== currentPage) {
				document.querySelector('ul.drawerMenu li.selected').classList.remove('selected');
				e.currentTarget.classList.add('selected');
				moveToPage(page);
			}
		});
	}

	// Click on the settings button to go to settings
	document.getElementById('gotoSettings').addEventListener('click', function() {
		hideDrawer();
		showSettings();
	});

	// Click on the close button to hide the settings page
	document.getElementById('closeSettings').addEventListener('click', function() {
		hideSettings();
	});

	// Will show the settings page through an animation
	function showSettings() {
		var settings = document.getElementById('settings');
		settings.classList.add('display');
		setTimeout(function() {
			settings.classList.add('show');
		}, 20);
	}

	// Will hide the settings page through an animation
	function hideSettings() {
		var settings = document.getElementById('settings');
		settings.classList.remove('show');
		setTimeout(function() {
			settings.classList.remove('display');
		}, 320);
	}

	// Move to a specific page by taking the page_id as a parameter
	function moveToPage(page) {
		hideDrawer();
		currentPage = page;
		document.querySelector('body').setAttribute('data-active-page', page);
		if (page !== 'schedule') document.getElementById('defaultTitle').innerHTML = titles[page];

		document.querySelector('section.display').classList.remove('display');
		document.getElementById(page).classList.add('display');
	}

	// Shows the main navigation drawer through a class animation
  function showDrawer() {
		var nav = document.querySelector('nav'),
	      overlay = document.querySelector('#coreOverlay');

    overlay.classList.add('display');
    setTimeout(function() {
      overlay.classList.add('show');
      nav.classList.add('show');
    }, 20);
  }

	// Hides the main navigation drawer through a class animation
  function hideDrawer() {
		var nav = document.querySelector('nav'),
	      overlay = document.querySelector('#coreOverlay');

    overlay.classList.remove('show');
    nav.classList.remove('show');
    setTimeout(function() {
      overlay.classList.remove('display');
    }, 320);
  }