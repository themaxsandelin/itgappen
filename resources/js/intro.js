"use strict";

var myType = new Swiper('#introMyScheduleType', {
	observer: true,
	observeParents: true,
	onSlideChangeStart: updateIntroType
});

var otherType = new Swiper('#introOtherScheduleType', {
	observer: true,
	observeParents: true,
	onSlideChangeStart: updateIntroType
});

var introSettings = {
	double: false,
	my: {},
	other: {},
	calendar: {}
}

function updateIntroType(swiper) {
	var i = swiper.activeIndex;
	var type;
	var list;
	var prev = (swiper.container[0].id === 'introMyScheduleType') ? document.getElementById('introMyBackType'):document.getElementById('introOtherBackType');
	var next = (swiper.container[0].id === 'introMyScheduleType') ? document.getElementById('introMyForwardType'):document.getElementById('introOtherForwardType');
	var element = (swiper.container[0].id === 'introMyScheduleType') ? 'introMySchedule':'introOtherSchedule';

	if (swiper.container[0].id === 'introMyScheduleType') {
		introSettings.my = {};
		document.getElementById('nextIntro').classList.add('disabled');
	} else {
		introSettings.other = {};
		document.getElementById('nextIntro').classList.add('disabled');
	}

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


	setDataList(type, list, element);
}

function updateMyIntroSchedule(el) {
	introSettings.my.id = el.value;
	introSettings.my.name = el.options[el.selectedIndex].innerHTML;
	if (el.options[el.selectedIndex].hasAttribute('data-class')) introSettings.my.class = el.options[el.selectedIndex].getAttribute('data-class');
	var next = document.getElementById('nextIntro');
	if (el.value === '0') {
		next.classList.add('disabled');
	} else {
		next.classList.remove('disabled');
	}
}

function updateOtherIntroSchedule(el) {
	introSettings.other.id = el.value;
	introSettings.other.name = el.options[el.selectedIndex].innerHTML;
	var next = document.getElementById('nextIntro');
	if (el.value === '0') {
		next.classList.add('disabled');
	} else {
		next.classList.remove('disabled');
	}
}

function moveIntroForward() {
	var cur = parseInt(document.getElementById('intro').getAttribute('data-page'));
	var next = cur + 1;
	if (cur < 5) document.getElementById('intro').setAttribute('data-page', next);

	if (cur === 5) saveIntroSettings();

	if (next === 2) {
		if (introSettings.double && (!introSettings.other.id || introSettings.other.id === '0')) {
			document.getElementById('nextIntro').classList.add('disabled');
		}
	} else if (next === 4) {
		introSettings.my.title = document.getElementById('introMyInput').value;
		introSettings.other.title = document.getElementById('introOtherInput').value;

		if (introSettings.my.class) {
			var list = document.getElementById('introCalendar');
			var index;

			for (var o = 0; o < list.options.length; o++) {
				var opt = list.options[o];
				if (opt.innerHTML === introSettings.my.class) {
					index = o;
					break;
				}
			}

			list.selectedIndex = index;
			introSettings.calendar.id = list.value;
			introSettings.calendar.name = introSettings.my.class;
		}

		if (!introSettings.calendar.id || introSettings.calendar.id === '0') document.getElementById('nextIntro').classList.add('disabled');
	}
}

function moveIntroBackward() {
	var cur = parseInt(document.getElementById('intro').getAttribute('data-page'));
	var next = cur - 1;
	if (cur > 1) document.getElementById('intro').setAttribute('data-page', next);

	if (next === 1) {
		if (introSettings.my.id && introSettings.my.id !== '0') document.getElementById('nextIntro').classList.remove('disabled');
	} else if (next === 3) {
		document.getElementById('nextIntro').classList.remove('disabled');
	}
}

function toggleDoubleSchedule() {
	var sw = document.getElementById('introDoubleSchedule');
	introSettings.double = !introSettings.double;
	document.getElementById('intro').setAttribute('data-double', introSettings.double);
	if (introSettings.double) {
		sw.classList.add('on');
		if (!introSettings.other.id || introSettings.other.id === '0') document.getElementById('nextIntro').classList.add('disabled');
	} else {
		sw.classList.remove('on');
		document.getElementById('nextIntro').classList.remove('disabled');
	}
}

function introCalendarChanged(el) {
	introSettings.calendar.id = el.value;
	introSettings.calendar.name = el.options[el.selectedIndex].innerHTML;
	if (el.value === '0') {
		document.getElementById('nextIntro').classList.add('disabled');
	} else {
		document.getElementById('nextIntro').classList.remove('disabled');
	}
}

function saveIntroSettings() {
	settings.double = introSettings.double;
	settings.main = {
		id: introSettings.my.id,
		name: introSettings.my.name,
		title: introSettings.my.title
	};
	settings.other = (!settings.double) ? {}:{
		id: introSettings.other.id,
		name: introSettings.other.name,
		title: introSettings.other.title
	};
	settings.calendar = introSettings.calendar;
	settings.setup = true;
	saveSettings();
	scheduleSetup();
	calendarSetup();
	settingsSetup();
	foodSetup();
	transitSetup();
	hideIntro();
	setTimeout(function() {
		document.querySelector('body').setAttribute('data-hidden', 'false');
	}, 200);
}

document.getElementById('introMyBackType').addEventListener('click', function() {
	myType.slidePrev();
});

document.getElementById('introMyForwardType').addEventListener('click', function() {
	myType.slideNext();
});

document.getElementById('introOtherBackType').addEventListener('click', function() {
	otherType.slidePrev();
});

document.getElementById('introOtherForwardType').addEventListener('click', function() {
	otherType.slideNext();
});

document.getElementById('introMySchedule').addEventListener('change', function() {
	updateMyIntroSchedule(this);
});

document.getElementById('introOtherSchedule').addEventListener('change', function() {
	updateOtherIntroSchedule(this);
});

document.getElementById('nextIntro').addEventListener('click', function() {
	moveIntroForward();
});

document.getElementById('prevIntro').addEventListener('click', function() {
	moveIntroBackward();
});

document.getElementById('toggleIntroDouble').addEventListener('click', function() {
	toggleDoubleSchedule();
});

document.getElementById('clearMyInput').addEventListener('click', function(){
	var inp = document.getElementById('introMyInput');
	inp.value = '';
	inp.focus();
});

document.getElementById('introMyInput').addEventListener('blur', function(){
	if (this.value === '') this.value = this.getAttribute('data-default');
});

document.getElementById('clearOtherInput').addEventListener('click', function(){
	var inp = document.getElementById('introOtherInput');
	inp.value = '';
	inp.focus();
});

document.getElementById('introOtherInput').addEventListener('blur', function(){
	if (this.value === '') this.value = this.getAttribute('data-default');
});

document.getElementById('introCalendar').addEventListener('change', function() {
	introCalendarChanged(this);
});

function hideLoading() {
	var l = document.getElementById('mainLoading');
	l.classList.remove('show');
	setTimeout(function() {
		l.classList.remove('display');
	}, 320);
}

function showLoading() {
	var l = document.getElementById('mainLoading');
	l.classList.add('display');
	setTimeout(function() {
		l.classList.add('show');
	}, 20);
}

function hideIntro() {
	var i = document.getElementById('intro');
	i.classList.add('hide');
	setTimeout(function() {
		i.classList.remove('display');
	}, 320);
}

function showIntro() {
	var i = document.getElementById('intro');
	i.classList.add('display');
	setTimeout(function() {
		i.classList.remove('hide');
	}, 20);
}

function setupApplication() {
	hideLoading();
	if (settings.setup) {
		// Settings exist, load the main application
		scheduleSetup();
		calendarSetup();
		settingsSetup();
		foodSetup();
		transitSetup();
		setTimeout(function(){
			document.querySelector('body').setAttribute('data-hidden', 'false');
		}, 200);
	} else {
		// Initiate the setup process
		showIntro();
	}
}