$(function(){
	// Key to controll scrolling state
	var disableScroll = true;
	$(window).on({
		touchmove: function (e) {
			if (disableScroll) {
				// Disables touch scroll
				e.preventDefault();
			}
		}
	});

	$(document).ready(function(){

		// Date info variables
		var year = 0,
			month = 0,
			date = 0,
			week = 0,
			day = 0,
		// Local variables
			firstTime = "true",
			doubleSchedules = "true",
			myScheduleName = "Mitt schema",
			myScheduleSource = undefined,
			myScheduleID = "{1AFAF6FA-4F7D-42FB-8916-97BE0AD20A91}",
			otherScheduleName = "Annat schema",
			otherScheduleSource = undefined,
			otherScheduleID = "{09EF1F69-CBD3-4FFC-B613-8967B2106FE9}",
			calendarSource = undefined,
			calendarID = undefined,
		// Controlling the state of the remote content and the schedule images (loaded)
			remoteContentLoaded = false,
			scheduleLoaded = false,
		// Intro variables
			introPage = 1,
			introDoubleSchedule = false,
			introMySchedule = undefined,
			introMyScheduleSource = undefined,
			introMyScheduleClass = undefined,
			introMyScheduleClassID = undefined,
			introOtherSchedule = undefined,
			introOtherScheduleSource = undefined,
			introOtherScheduleClass = undefined,
			introOtherScheduleClassID = undefined,
			introClassSource = undefined,
			introClassID = undefined,
			introClassType = "standard",
			introMyName = "Mitt schema",
			introOtherName = "Annat schema",
			oldData = "",
		// Global variables
			activePage = "schedule",
			activePageNumber = 1,
			weekSwitchState = "hidden",
			animationRunning = false,
			scheduleState = "mySchedule",
			myScheduleDay = 0,
			otherScheduleDay = 0,
			scheduleToolsState = "visible",
			settingsModalState = "hidden",
			modalMode = "",
			myWeek = 0,
			otherWeek = 0,
			loadingScreenState = "visible",
			teachers = "",
			classes = "",
			students = "",
			rooms = "",
			prices = "",
			transitRequest = "done",
			open = false,
			firstTransitLoad = false,
			stopCount = 0,
			stops = [],
			stopInterval = undefined;

		function showStopEl () {
			if (stopCount < stops.length) {
				$('.postWrapper[data-stop="'+ stops[stopCount] +'"]').removeClass("hide");
				stopCount++;
			} else {
				stops = [];
				stopCount = 0;
				clearInterval(stopInterval);
			}
		}

		function pushTransitInfo (info) {
			$("#trafficPage").find(".pageLoader").addClass("hide");
			setTimeout(function(){
				$("#trafficPage").find(".pageLoader").remove();
			}, 320);
			// Push the content
			var x = 0;
			var nearest = {};
			for (var stop in info) {
				if ($('.postWrapper[data-stop="'+stop+'"]').length === 0) {
					if (x !== 0) {
						$(".trafficWrapper").append(
							'<div class="postSplitter"></div>'
						);
					}
					$(".trafficWrapper").append(
						'<div class="postWrapper hide" data-stop="'+stop+'">'+
							'<div class="postTitle">'+stop+'</div>'+
							'<div class="openSection transit">'+
								'<div class="tracksOuter"></div>'+
								'<div class="nearestWrap"></div>'+
							'</div>'+
						'</div>'
					);
					if (info[stop].length !== 0) {
						$('.postWrapper[data-stop="'+stop+'"]').append(
							'<div class="toggleView">'+
								'<svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" xmlns:a="http://ns.adobe.com/AdobeSVGViewerExtensions/3.0/" x="0px" y="0px" width="40px" height="40px" viewBox="0 0 40 40" style="enable-background:new 0 0 40 40;" xml:space="preserve"><rect class="noFill" width="40" height="40"/><g><polygon class="lightFill" points="24.3,23.6 20,19.3 15.7,23.6 14.3,22.1 20,16.4 25.7,22.1 "/></g></svg>'+
							'</div>'
						);
					} else {
						$('.postWrapper[data-stop="'+stop+'"]').append('<div class="error">Kunde inte hitta några resor..</div>');
					}
					firstTransitLoad = true;
				} else {
					firstTransitLoad = false;
				}
				if (firstTransitLoad) {
					stops.push(stop);
				}
				nearest[stop] = [];
				$('.postWrapper[data-stop="'+stop+'"] .openSection .tracksOuter').empty();
				for (var track in info[stop]) {
					$('.postWrapper[data-stop="'+stop+'"] .openSection .tracksOuter').append(
						'<div class="trackContainer" data-track="'+track+'">'+
							'<div class="trackWrap">'+
								'<div class="name">Läge: <span>'+track+'</span></div>'+
								'<div class="trackRight">'+
									'<div class="next">N</div>'+
									'<div class="after">D</div>'+
								'</div>'+
							'</div>'+
							'<div class="trips"></div>'+
						'</div>'
					);
					for (var trip in info[stop][track]) {
						trip = info[stop][track][trip];
						var ne = "-";
						if (trip.next) {
							ne = trip.next.left;
						}
						if (trip.firstOnStop) {
							nearest[stop][0] = trip;
						} else if (trip.secondOnStop) {
							nearest[stop][1] = trip;
						} else if (trip.onlyOnStop) {
							nearest[stop][0] = trip;
						}
						$('.postWrapper[data-stop="'+stop+'"] .openSection .tracksOuter .trackContainer[data-track="'+track+'"] .trips').append(
							'<div class="tripWrap">'+
								'<div class="tripTag" style="background:'+trip.fgColor+'; color:'+trip.bgColor+';">'+trip.num+'</div>'+
								'<div class="tripMeta">'+
									'<div class="direction">'+trip.direction+'</div>'+
									'<div class="departures">'+
										'<div class="time"><span>'+trip.departure.left+'</span></div>'+
										'<div class="time">'+ne+'</div>'+
									'</div>'+
								'</div>'+
							'</div>'
						);
					}
				}
				x += 1;
			}
			for (var stop in nearest) {
				var length = nearest[stop].length;
				if (length > 0) {
					$('.postWrapper[data-stop="'+stop+'"] .openSection .nearestWrap').empty();
					if (length === 1) {
						trip = nearest[stop][0];
						$('.postWrapper[data-stop="'+stop+'"] .openSection .nearestWrap').append(
							'<div class="tripWrap">'+
								'<div class="tripTag" style="background:'+trip.fgColor+'; color:'+trip.bgColor+';">'+trip.num+'</div>'+
								'<div class="tripMeta">'+
									'<div class="direction">'+trip.direction+'</div>'+
									'<div class="departures">'+
										'<div class="time"><span>'+trip.departure.left+'</span></div>'+
										'<div class="time">'+ne+'</div>'+
									'</div>'+
								'</div>'+
							'</div>'
						);
					} else if (length === 2) {
						for (var x = 0; x < length; x++) {
							trip = nearest[stop][x];
							$('.postWrapper[data-stop="'+stop+'"] .openSection .nearestWrap').append(
								'<div class="tripWrap">'+
									'<div class="tripTag" style="background:'+trip.fgColor+'; color:'+trip.bgColor+';">'+trip.num+'</div>'+
									'<div class="tripMeta">'+
										'<div class="direction">'+trip.direction+'</div>'+
										'<div class="departures">'+
											'<div class="time"><span>'+trip.departure.left+'</span></div>'+
											'<div class="time">'+ne+'</div>'+
										'</div>'+
									'</div>'+
								'</div>'
							);
						}
					}
				}
			}
			if (firstTransitLoad) {
				stopInterval = setInterval(function(){
					showStopEl();
				}, 100);
			}
		}

		function getTransitInfo () {
			if (transitRequest === "done") {
				transitRequest = "pending";
				var req = $.ajax({
					// url: "http://localhost:8888/vasttrafik.php",
					url: "http://itgappen.se/vasttrafik",
				});
				req.done(function(data, responce){
					transitRequest = "done";
					if (responce === "success") {
						pushTransitInfo(data);
					} else {
						console.log("!! There was a problem..");
					}
				});
			}
		}

		// Reload content every 3rd second to look for new data
		function reloadContent () {
			$.ajax({
				url: 'http://www.itgappen.se/api'
			}).success(function(data){
				if (oldData !== JSON.stringify(data)) {
					oldData = JSON.stringify(data);

					// All placeholders (variables) for the API content types
					teachers = data.teachers;
					classes = data.classes;
					students = data.students;
					rooms = data.rooms;
					prices = data.cafe.prices;
					hours = data.cafe.hours;
					open = data.cafe.open;

					// All date placeholders (variables) from the API
					year = parseInt(data.date.year);
					month = parseInt(data.date.month);
					date = parseInt(data.date.date);
					week = parseInt(data.date.week);
					day = parseInt(data.date.day);
					myWeek = week;
					otherWeek = week;

					$("#openHoursSection").empty();
					// Checks if the Café is open based on a BOOL sent from the API
					if (open) {
						$("#openHoursSection").append(
							'<div class="cafeStatus">'+
								'Elevcaféet är <span class="open">öppet!</span>'+
							'</div>'
						);
					} else {
						$("#openHoursSection").append(
							'<div class="cafeStatus">'+
								'Elevcaféet är <span class="closed">stängt.</span>'+
							'</div>'
						);
					}

					// Pulls out the café open hours as objects and appends them to the app based on content
					$days = ["Sön", "Mån", "Tis", "Ons", "Tors", "Fre", "Lör"];
					$.each(hours, function(key, openHours){
						var type = openHours.type;
						var dayStart = $days[openHours.day_start];
						var dayEnd = $days[openHours.day_end];
						var timeStart = openHours.time_start.substr(0, openHours.time_start.length - 3);
						var timeEnd = openHours.time_end.substr(0, openHours.time_end.length - 3);
						if (type === "1") {
							$("#openHoursSection").append(
								'<div class="hours">'+dayStart+' - '+dayEnd+'<br><span>'+timeStart+' - '+timeEnd+'</span></div>'
							);
						} else if (type === "2") {
							$("#openHoursSection").append(
								'<div class="hours">Lunch stängt<br><span>'+timeStart+' - '+timeEnd+'</span></div>'
							);
						}
					});

					// Goes through all prices in the object and appends them as sections inside the #pricesSection element
					$("#pricesSection").empty();
					$.each(prices, function(key, price){
						$("#pricesSection").append(
							'<div class="postSection">'+
								'<div class="itemName">'+price.name+'</div>'+
								'<div class="itemPrice">'+price.price+':-</div>'+
							'</div>'
						);
					});

					// Goes through all classes in the object and appends them to the different <select> elements
					$("#introCalendarSource, #calendarSelectSettings").empty().append('<option value="0">Välj klass...</option>');
					$.each(classes, function(key, studentClass){
						$("#introCalendarSource, #calendarSelectSettings").append(
							'<option value="'+studentClass.googleID+'">'+studentClass.name+'</option>'
						);
					});
				}
			});
			getTransitInfo();
		}

		// Loads all content from the API (database content)
		function loadRemoteContent () {
			$.ajax({
				url: 'http://www.itgappen.se/api' /* <- Open API URL */
			}).success(function(data){
				// API Content loaded
				oldData = JSON.stringify(data);
				remoteContentLoaded = true;
				if (firstTime === "true") {
					// Checks if the user is using the app for the first time, then dismiss the loading screen upon success
					hideLoadingScreen();
				} else {
					// If it isn't the first time the user is using the app, the loading screen should only be dismissed if the schedule image is loaded
					if (scheduleLoaded) {
						hideLoadingScreen();
					}
				}
				// All placeholders (variables) for the API content types
				teachers = data.teachers;
				classes = data.classes;
				students = data.students;
				rooms = data.rooms;
				prices = data.cafe.prices;
				hours = data.cafe.hours;
				open = data.cafe.open;

				// All date placeholders (variables) from the API
				year = parseInt(data.date.year);
				month = parseInt(data.date.month);
				date = parseInt(data.date.date);
				week = parseInt(data.date.week);
				day = parseInt(data.date.day);
				myWeek = week;
				otherWeek = week;

				$("#openHoursSection").empty();
				// Checks if the Café is open based on a BOOL sent from the API
				if (open) {
					$("#openHoursSection").append(
						'<div class="cafeStatus">'+
							'Elevcaféet är <span class="open">öppet!</span>'+
						'</div>'
					);
				} else {
					$("#openHoursSection").append(
						'<div class="cafeStatus">'+
							'Elevcaféet är <span class="closed">stängt.</span>'+
						'</div>'
					);
				}

				// Pulls out the café open hours as objects and appends them to the app based on content
				$days = ["Sön", "Mån", "Tis", "Ons", "Tors", "Fre", "Lör"];
				$.each(hours, function(key, openHours){
					var type = openHours.type;
					var dayStart = $days[openHours.day_start];
					var dayEnd = $days[openHours.day_end];
					var timeStart = openHours.time_start.substr(0, openHours.time_start.length - 3);
					var timeEnd = openHours.time_end.substr(0, openHours.time_end.length - 3);
					if (type === "1") {
						$("#openHoursSection").append(
							'<div class="hours">'+dayStart+' - '+dayEnd+'<br><span>'+timeStart+' - '+timeEnd+'</span></div>'
						);
					} else if (type === "2") {
						$("#openHoursSection").append(
							'<div class="hours">Lunch stängt<br><span>'+timeStart+' - '+timeEnd+'</span></div>'
						);
					}
				});

				// Goes through all prices in the object and appends them as sections inside the #pricesSection element
				$("#pricesSection").empty();
				$.each(prices, function(key, price){
					$("#pricesSection").append(
						'<div class="postSection">'+
							'<div class="itemName">'+price.name+'</div>'+
							'<div class="itemPrice">'+price.price+':-</div>'+
						'</div>'
					);
				});

				// Goes through all classes in the object and appends them to the different <select> elements
				$("#introCalendarSource, #calendarSelectSettings").empty().append('<option value="0">Välj klass...</option>');
				$.each(classes, function(key, studentClass){
					$("#introCalendarSource, #calendarSelectSettings").append(
						'<option value="'+studentClass.googleID+'">'+studentClass.name+'</option>'
					);
				});

				// Loads all dynamic elements and contents of the app after the remote content is retrieved
				loadAppElements();
			});
		}

		// This handles all the transitions between the different intro pages
		function toIntroPage (page) {
			disableScroll = true;
			animationRunning = true;
			if (page === 1) {
				// To the first page in the intro
				$("#nextIntro").css({
					'-webkit-transform':'translate3d(-45px,0px,0px) scale(1)',
					'-moz-transform':'translate3d(-45px,0px,0px) scale(1)',
					'-ms-transform':'translate3d(-45px,0px,0px) scale(1)',
					'-o-transform':'translate3d(-45px,0px,0px) scale(1)',
					'transform':'translate3d(-45px,0px,0px) scale(1)'
				});
				$("#prevIntro").css({
					'-webkit-transform':'translate3d(45px,0px,0px) scale(1)',
					'-moz-transform':'translate3d(45px,0px,0px) scale(1)',
					'-ms-transform':'translate3d(45px,0px,0px) scale(1)',
					'-o-transform':'translate3d(45px,0px,0px) scale(1)',
					'transform':'translate3d(45px,0px,0px) scale(1)',
					'opacity':'0'
				});
				$("#introMyScheduleSource").removeAttr("disabled");
			} else if (page === 2) {
				// To the second page in the intro
				$("#nextIntro, #prevIntro").removeClass("calendar").css({
					'-webkit-transform':'translate3d(0px,0px,0px)',
					'-moz-transform':'translate3d(0px,0px,0px)',
					'-ms-transform':'translate3d(0px,0px,0px)',
					'-o-transform':'translate3d(0px,0px,0px)',
					'transform':'translate3d(0px,0px,0px)',
					'opacity':'1'
				});
				$("#introMyScheduleSource, #introCalendarSource").attr("disabled", "disabled");
				if (!introDoubleSchedule || $("#introOtherScheduleSource").val() !== "0") {
					$("#nextIntro").removeClass("disabled");
				}
				if (introDoubleSchedule) {
					$("#introOtherScheduleSource").removeAttr("disabled");
				}
			} else if (page === 3) {
				// To the third page in the intro
				$("#introOtherScheduleSource, #introMyName, #introOtherName").attr("disabled", "disabled");
				if (introClassType === "standard") {
					$("#introCalendarSource").removeAttr("disabled");
				}
				if (introMyScheduleClass !== undefined) {
					$("#myClass").show().attr("data-class-id", introMyScheduleClassID).attr("data-class", introMyScheduleClass);
					$("#myClass .topSwitchTitleClass").html(introMyScheduleClass+" ");
				}
				if (introOtherScheduleClass !== undefined) {
					$("#otherClass").show().attr("data-class-id", introOtherScheduleClassID).attr("data-class", introOtherScheduleClass);
					$("#otherClass .topSwitchTitleClass").html(introOtherScheduleClass+" ");
				}
				if (!introDoubleSchedule) {
					turnOffDoubleSchedules();
				} else if (introDoubleSchedule) {
					turnOnDoubleSchedules();
				}
				if (introClassID === undefined) {
					$("#nextIntro").addClass("disabled");
				}
				$("#nextIntro, #prevIntro").addClass("calendar");
			} else if (page === 4) {
				// To the fourth page in the intro
				$("#introCalendarSource").attr("disabled", "disabled");
				$("#introMyName, #introOtherName").removeAttr("disabled");
				$("#nextIntro, #prevIntro").removeClass("calendar done");
			} else if (page === 5) {
				// To the fifth page in the intro
				$("#introMyName, #introOtherName").attr("disabled", "disabled");
				$("#nextIntro").addClass("done");
			}
			// Transition events
			introButtonsMove = (($("article[data-modal-number='"+page+"'] .settingsModal").height() - 60) / 2) + 45;
			$("#introButtons").css({
				'-webkit-transform':'translate3d(0px,'+introButtonsMove+'px,0px)',
				'-moz-transform':'translate3d(0px,'+introButtonsMove+'px,0px)',
				'-ms-transform':'translate3d(0px,'+introButtonsMove+'px,0px)',
				'-o-transform':'translate3d(0px,'+introButtonsMove+'px,0px)',
				'transform':'translate3d(0px,'+introButtonsMove+'px,0px)'
			});
			$("#introArticles").css({
				'-webkit-transform':'translate3d(-'+((page-1)*20)+'%,0px,0px)',
				'-moz-transform':'translate3d(-'+((page-1)*20)+'%,0px,0px)',
				'-ms-transform':'translate3d(-'+((page-1)*20)+'%,0px,0px)',
				'-o-transform':'translate3d(-'+((page-1)*20)+'%,0px,0px)',
				'transform':'translate3d(-'+((page-1)*20)+'%,0px,0px)'
			});
			setTimeout(function(){
				animationRunning = false;
			}, 320);
		}

		function loadIntro () {
			// Loads up the intro
			disableScroll = true;
			$("body").css("overflow", "hidden");
			$("#startModal").removeClass("hide");
			$("#nextIntro").css({
				'-webkit-transform':'translate3d(-45px,0px,0px) scale(1)',
				'-moz-transform':'translate3d(-45px,0px,0px) scale(1)',
				'-ms-transform':'translate3d(-45px,0px,0px) scale(1)',
				'-o-transform':'translate3d(-45px,0px,0px) scale(1)',
				'transform':'translate3d(-45px,0px,0px) scale(1)'
			});
			$("#prevIntro").css({
				'-webkit-transform':'translate3d(45px,0px,0px) scale(1)',
				'-moz-transform':'translate3d(45px,0px,0px) scale(1)',
				'-ms-transform':'translate3d(45px,0px,0px) scale(1)',
				'-o-transform':'translate3d(45px,0px,0px) scale(1)',
				'transform':'translate3d(45px,0px,0px) scale(1)',
				'opacity':'0'
			});
		}

		function resetIntro () {
			// Resets the intro and all the element contents
			introPage = 1;
			introDoubleSchedule = false;
			introMySchedule = undefined;
			introMyScheduleSource = undefined;
			introMyScheduleClass = undefined;
			introMyScheduleClassID = undefined;
			introOtherSchedule = undefined;
			introOtherScheduleSource = undefined;
			introOtherScheduleClass = undefined;
			introOtherScheduleClassID = undefined;
			introClassSource = undefined;
			introClassID = undefined;
			introClassType = "standard";
			introMyName = "Mitt schema";
			introOtherName = "Annat schema";

			$("#introMyName").val(introMyName);
			$("#introOtherName").val(introOtherName);
			introMyScheduleTypeSwiper.slideTo(0);
			introOtherScheduleTypeSwiper.slideTo(0);

			$("#introMyScheduleSource, #introOtherScheduleSource").attr("disabled");

			$("#introDoubleSchedule .introSwitch").removeClass("on");
			$("#otherClass .introSwitch, #myClass .introSwitch").removeClass("on");
			$("#introArticles").css({
				'-webkit-transform':'translate3d(0px,0px,0px)',
				'-moz-transform':'translate3d(0px,0px,0px)',
				'-ms-transform':'translate3d(0px,0px,0px)',
				'-o-transform':'translate3d(0px,0px,0px)',
				'transform':'translate3d(0px,0px,0px)'
			});
			$("#introButtons").css({
				'-webkit-transform':'translate3d(0px,165px,0px)',
				'-moz-transform':'translate3d(0px,165px,0px)',
				'-ms-transform':'translate3d(0px,165px,0px)',
				'-o-transform':'translate3d(0px,165px,0px)',
				'transform':'translate3d(0px,165px,0px)'
			});
			$("#nextIntro, #prevIntro").removeClass("calendar done").addClass("hide");
			$("#nextIntro").css({
				'-webkit-transform':'translate3d(-45px,0px,0px) scale(0)',
				'-moz-transform':'translate3d(-45px,0px,0px) scale(0)',
				'-ms-transform':'translate3d(-45px,0px,0px) scale(0)',
				'-o-transform':'translate3d(-45px,0px,0px) scale(0)',
				'transform':'translate3d(-45px,0px,0px) scale(0)'
			});
			$("#prevIntro").css({
				'-webkit-transform':'translate3d(45px,0px,0px) scale(0)',
				'-moz-transform':'translate3d(45px,0px,0px) scale(0)',
				'-ms-transform':'translate3d(45px,0px,0px) scale(0)',
				'-o-transform':'translate3d(45px,0px,0px) scale(0)',
				'transform':'translate3d(45px,0px,0px) scale(0)',
				'opacity':'0'
			});
			$("#startModal").addClass("hide");
			$("#endModal").removeClass("hide");
		}

		function showIntro () {
			// Runs a transition to show the intro element
			animationRunning = true;
			disableScroll = true;
			$("body").css("overflow", "hidden");
			$("#intro").show();
			setTimeout(function(){
				$("#intro, #startModal").removeClass("hide");
				$("#nextIntro").css({
					'-webkit-transform':'translate3d(-45px,0px,0px) scale(1)',
					'-moz-transform':'translate3d(-45px,0px,0px) scale(1)',
					'-ms-transform':'translate3d(-45px,0px,0px) scale(1)',
					'-o-transform':'translate3d(-45px,0px,0px) scale(1)',
					'transform':'translate3d(-45px,0px,0px) scale(1)'
				});
				$("#prevIntro").css({
					'-webkit-transform':'translate3d(45px,0px,0px) scale(1)',
					'-moz-transform':'translate3d(45px,0px,0px) scale(1)',
					'-ms-transform':'translate3d(45px,0px,0px) scale(1)',
					'-o-transform':'translate3d(45px,0px,0px) scale(1)',
					'transform':'translate3d(45px,0px,0px) scale(1)',
					'opacity':'0'
				});
				setTimeout(function(){
					animationRunning = false;
				}, 320);
			}, 20);
		}

		function hideIntro () {
			// Runs a transition to hide the intro
			animationRunning = true;
			$("#endModal, #intro").addClass("hide");
			$("#nextIntro, #prevIntro").css({
				'-webkit-transform':'scale(0)',
				'-moz-transform':'scale(0)',
				'-ms-transform':'scale(0)',
				'-o-transform':'scale(0)',
				'transform':'scale(0)'
			});
			setTimeout(function(){
				animationRunning = false;
				disableScroll = false;
				$("body").css("overflow", "visible");
				$("#intro").hide();
			}, 320);
		}

		// Gets the windows size for the schedule sliders size
		function getWindowSize () {
			w_width = $(window).width();
			w_height = $(window).height();
		}

		// Sets the position of the slider bar
		function setSliderBar (index) {
			var translSize = $(window).width() / 5;
			var move = index * translSize;
			$(".day").removeClass("selected");
			$("#day"+(index+1)).addClass("selected");
			$("#sliderBar").addClass("animate");
			setTimeout(function(){
				$("#sliderBar").css({
					'-webkit-transform': 'translate3d('+move+'px,0px,0px)',
					'-moz-transform': 'translate3d('+move+'px,0px,0px)',
					'-ms-transform': 'translate3d('+move+'px,0px,0px)',
					'-o-transform': 'translate3d('+move+'px,0px,0px)',
					'transform': 'translate3d('+move+'px,0px,0px)'
				});
			}, 10);
		}

		// Updates the slider bar
		function updateSliderBar (translate) {
			var move = (translate / 5) * -1;
			$("#sliderBar").css({
				'-webkit-transform': 'translate3d('+move+'px,0px,0px)',
				'-moz-transform': 'translate3d('+move+'px,0px,0px)',
				'-ms-transform': 'translate3d('+move+'px,0px,0px)',
				'-o-transform': 'translate3d('+move+'px,0px,0px)',
				'transform': 'translate3d('+move+'px,0px,0px)'
			});
		}

		// Updates the schedules of a specific class (like "mySchedule" or "otherSchedule")
		function updateSchedule (scheduleID, scheduleClass) {
			var scheduleWidth = w_width - 30;
			var scheduleHeight = Math.round(scheduleWidth * 2.6);
			var dayC = 1;
			$("."+scheduleClass).each(function(){
				var srcStr = 'http://www.novasoftware.se/ImgGen/schedulegenerator.aspx?format=png&schoolid=80220/sv-se&type=-1&id='+scheduleID+'&period=&week='+week+'&mode=0&printer=0&colors=32&head=0&clock=0&foot=0&day='+dayC+'&width='+scheduleWidth+'&height='+scheduleHeight+'&maxwidth='+scheduleWidth+'&maxheight='+scheduleHeight;
				$(this).attr("src", srcStr);
				dayC *= 2;
			});
			swipeHeight = scheduleHeight + 30;
		}

		// Uses the day variable to set upp the application
		function setMyDay () {
			var translSize = $(window).width() / 5;
			var move = (day - 1) * translSize;
			$("#day"+day).addClass("selected");
			$("#sliderBar").css({
				'-webkit-transform': 'translate3d('+move+'px,0px,0px)',
				'-moz-transform': 'translate3d('+move+'px,0px,0px)',
				'-ms-transform': 'translate3d('+move+'px,0px,0px)',
				'-o-transform': 'translate3d('+move+'px,0px,0px)',
				'transform': 'translate3d('+move+'px,0px,0px)'
			});
			if (day > 0 && day < 6) {
				var toSlide = day - 1;
			} else {
				var toSlide = 4;
			}
			myScheduleSwiper.slideTo(toSlide);
			otherScheduleSwiper.slideTo(toSlide);
			myScheduleDay = toSlide;
			otherScheduleDay = toSlide;
			setTimeout(function(){
				$("#sliderBar").addClass("animate");
			}, 10);
		}


		function changeScheduleSlide (id) {
			var imgIndex = id.replace("day", "");
			imgIndex = parseInt(imgIndex);
			imgIndex -= 1;
			$(".day").removeClass("selected");
			$("#"+id).addClass("selected");
			if (scheduleState === "mySchedule") {
				myScheduleSwiper.slideTo(imgIndex);
			} else if (scheduleState === "otherSchedule") {
				otherScheduleSwiper.slideTo(imgIndex);
			}
			setSliderBar(imgIndex);
		}

		function setupWeekChoser (week) {
			var startWeek = 1;
			var endWeek = 53;
			for (var x = startWeek; x <= endWeek; x++) {
				$("#weekChooser .swiper-wrapper").append(
					'<div class="swiper-slide">'+
						'<div class="weekNumber current"><span>v. </span>'+x+'</div>'+
					'</div>'
				);
				if (x === week) {
					$(".weekNumber.current").addClass("currentWeek");
				}
				$(".weekNumber.current").removeClass("current");
			}
		}

		function hideWeekSwitch () {
			animationRunning = true;
			$(".weekTabWrap .bubble").addClass("hide");
			$(".weekTabWrap .weekNum").removeClass("active");
			$("#weekChooserWrap").addClass("hide");
			$("#appContainer").removeClass("weekActive");
			setTimeout(function(){
				weekSwitchState = "hidden";
				animationRunning = false;
			}, 320);
		}

		function showWeekSwitch () {
			animationRunning = true;
			$(".weekTabWrap .bubble").removeClass("hide");
			$(".weekTabWrap .weekNum").addClass("active");
			$("#weekChooserWrap").removeClass("hide");
			$("#appContainer").addClass("weekActive");
			weekSwitchState = "visible";
			setTimeout(function(){
				animationRunning = false;
			}, 320);
		}

		function hideOtherSchedule () {
			animationRunning = true;
			setSliderBar(myScheduleDay);
			scheduleState = "mySchedule";
			$("#myScheduleTitle").removeClass("hideLeft");
			$("#otherScheduleTitle").addClass("hideRight");
			$(".scheduleSwitchWrap .bubble").addClass("hide");
			$(".scheduleSwitchWrap .scheduleArrow").css("fill", "#ffffff");
			$("#scheduleSwitchIcon").css({
				'-webkit-transform' : 'rotate3d(0,0,0, 0deg)',
				'-moz-transform' : 'rotate3d(0,0,0, 0deg)',
				'-ms-transform' : 'rotate3d(0,0,0, 0deg)',
				'-o-transform' : 'rotate3d(0,0,0, 0deg)',
				'transform' : 'rotate3d(0,0,0, 0deg)'
			});
			$("#schedulePage").removeClass("switchSchedule");
			if (myWeek !== week) {
				week = myWeek;
				updateWeekNumber(week-1);
				weekSliderTo(week-1);
			}
			setTimeout(function(){
				animationRunning = false;
			}, 320);
		}

		function showOtherSchedule () {
			animationRunning = true;
			setSliderBar(otherScheduleDay);
			scheduleState = "otherSchedule";
			$("#myScheduleTitle").addClass("hideLeft");
			$("#otherScheduleTitle").removeClass("hideRight");
			$(".scheduleSwitchWrap .bubble").removeClass("hide");
			$(".scheduleSwitchWrap .scheduleArrow").css("fill", "#0296d2");
			$("#scheduleSwitchIcon").css({
				'-webkit-transform' : 'rotate3d(0,0,1, -180deg)',
				'-moz-transform' : 'rotate3d(0,0,1, -180deg)',
				'-ms-transform' : 'rotate3d(0,0,1, -180deg)',
				'-o-transform' : 'rotate3d(0,0,1, -180deg)',
				'transform' : 'rotate3d(0,0,1, -180deg)'
			});
			$("#schedulePage").addClass("switchSchedule");
			if (otherWeek !== week) {
				week = otherWeek;
				updateWeekNumber(week-1);
				weekSliderTo(week-1);
			}
			setTimeout(function(){
				animationRunning = false;
			}, 320);
		}

		// Changes the active page in the application
		function changePage (page, id, pageNumber) {
			$(window).scrollTop("0");
			if (activePage !== page) {
				animationRunning = true;
				$("#mainNav li .bubble").addClass("hide");
				$("#"+id+" .bubble").removeClass("hide");
				$("#mainNav li").removeClass("selected");
				$("#"+id).addClass("selected");
				$("header").attr("class", page);
				$("#"+activePage+"Page").hide();
				$("#"+page+"Page").show();
				$("nav .navBar .bar").attr("class", "bar "+page);
				if (page !== "schedule" && scheduleToolsState === "visible") {
					scheduleToolsState = "hidden";
					$("#days, .weekTabWrap, .scheduleSwitchWrap").addClass("hide");
					$("#weekChooserWrap").addClass("hideMore");
					$("#topMenu").css("height", "64px");
					$(".mainTitleWrapper").addClass("move");
				} else if (page === "schedule" && scheduleToolsState === "hidden") {
					scheduleToolsState = "visible";
					$("#days, .weekTabWrap, .scheduleSwitchWrap").removeClass("hide");
					$("#weekChooserWrap").removeClass("hideMore");
					$("#topMenu").css("height", "auto");
					$(".mainTitleWrapper").removeClass("move");
				}
				if (page !== "schedule" && weekSwitchState === "visible") {
					hideWeekSwitch();
				}
				$(".pageTitle").each(function(){
					if ($(this).attr("data-page-number") < pageNumber) {
						$(this).removeClass("hideRight").addClass("hideLeft");
					} else if ($(this).attr("data-page-number") > pageNumber) {
						$(this).removeClass("hideLeft").addClass("hideRight");
					}
				});
				$("#"+page+"Title").removeClass("hideRight hideLeft");
				activePageNumber = pageNumber;
				activePage = page;
			} else if (activePage === page) {
				// The page item clicked on was the same as the page that is active

				// $("html, body").animate({
				// 	scrollTop: "0px"
				// }, 150);
			}
			setTimeout(function(){
				animationRunning = false;
			}, 320);
		}

		function loadLocalContent () {
			if (localStorage.getItem("firstTime")) {
				firstTime = localStorage.getItem("firstTime");
				$("#intro").addClass("hide").hide();
			} else {
				loadIntro();
			}
			if (localStorage.getItem("myScheduleName")) {
				myScheduleName = localStorage.getItem("myScheduleName");
			}
			if (localStorage.getItem("myScheduleID")) {
				myScheduleID = localStorage.getItem("myScheduleID");
			}
			if (localStorage.getItem("myScheduleSource")) {
				myScheduleSource = localStorage.getItem("myScheduleSource");
			}
			if (localStorage.getItem("otherScheduleName")) {
				otherScheduleName = localStorage.getItem("otherScheduleName");
			}
			if (localStorage.getItem("otherScheduleID")) {
				otherScheduleID = localStorage.getItem("otherScheduleID");
			}
			if (localStorage.getItem("otherScheduleSource")) {
				otherScheduleSource = localStorage.getItem("otherScheduleSource");
			}
			if (localStorage.getItem("doubleSchedules")) {
				doubleSchedules = localStorage.getItem("doubleSchedules");
			}
			if (localStorage.getItem("calendarID")) {
				calendarID = localStorage.getItem("calendarID");
			}
			if (localStorage.getItem("calendarSource")) {
				calendarSource = localStorage.getItem("calendarSource");
			}
			if (doubleSchedules === "false") {
				$(".doubleScheduleSwitch").removeClass("on");
				$("#otherScheduleWrapper").addClass("hide");
				$("#otherScheduleWrapper .overlay").show();
				$(".scheduleSwitchWrap").hide();
			}
			updateScheduleNames();
			$(".myScheduleNameInput").val(myScheduleName);
			$(".otherScheduleNameInput").val(otherScheduleName);
		}


		// Updates all elements that contains names or titles from the locally stored content
		function updateScheduleNames () {
			$(".otherScheduleNameHolder").html(otherScheduleName);
			$(".myScheduleNameHolder").html(myScheduleName);
			$(".changeMySchedule .sourceTitle").html(myScheduleSource);
			$(".changeOtherSchedule .sourceTitle").html(otherScheduleSource);
			$(".changeCalendar .sourceTitle").html(calendarSource);
		}

		// Resets all the local content on the device.
		function resetLocalContent () {
			localStorage.removeItem("firstTime", "false");
			localStorage.removeItem("myScheduleID", introMySchedule);
			localStorage.removeItem("myScheduleName", introMyName);
			localStorage.removeItem("myScheduleSource", introMyScheduleSource);
			localStorage.removeItem("otherScheduleID", introOtherSchedule);
			localStorage.removeItem("otherScheduleName", introOtherName);
			localStorage.removeItem("otherScheduleSource", introOtherScheduleSource);
			localStorage.removeItem("otherScheduleID", introOtherSchedule);
			localStorage.removeItem("otherScheduleName", introOtherName);
			localStorage.removeItem("otherScheduleSource", introOtherScheduleSource);
			myScheduleName = "Mitt schema";
			otherScheduleName = "Annat schema";
			$(".myScheduleNameInput").val(myScheduleName);
			$(".otherScheduleNameInput").val(otherScheduleName);
			turnOnDoubleSchedules();
			updateScheduleNames();
		}

		// Hides the loadingscreen
		function hideLoadingScreen () {
			$("#loadingOverlay, #loadingWrap").addClass("hide");
			setTimeout(function(){
				loadingScreenState = "hidden";
				$("#loadingOverlay").hide();
				animationRunning = false;
			}, 320);

		}

		// Shows the loadingscreen
		function showLoadingScreen () {
			animationRunning = true;
			loadingScreenState = "visible";
			$("#loadingOverlay").show();
			setTimeout(function(){
				$("#loadingOverlay, #loadingWrap").removeClass("hide");
				setTimeout(function(){
					animationRunning = false;
				}, 320);
			}, 20);
		}

		function turnOnDoubleSchedules () {
			animationRunning = true;
			doubleSchedules = "true";
			$(".settingsSwitch.doubleScheduleSwitch").addClass("on");
			$("#otherScheduleWrapper").removeClass("hide");
			$(".scheduleSwitchWrap").show();
			localStorage.setItem("doubleSchedules", "true");
			setTimeout(function(){
				$("#otherScheduleWrapper .overlay").hide();
				animationRunning = false;
			}, 320);
		}

		function turnOffDoubleSchedules () {
			animationRunning = true;
			doubleSchedules = "false";
			localStorage.setItem("doubleSchedules", "false");
			if (scheduleState === "otherSchedule") {
				hideOtherSchedule();
			}
			$(".scheduleSwitchWrap").hide();
			$("#otherScheduleWrapper").addClass("hide");
			$("#otherScheduleWrapper .overlay").show();
			$(".settingsSwitch.doubleScheduleSwitch").removeClass("on");
			setTimeout(function(){
				animationRunning = false;
			}, 320);
		}

		function hideSettingsModal () {
			animationRunning = true;
			$(".declineButton, .acceptButton, #settingsModal, #settingsOverlay").addClass("hide")
			$(".scheduleSource").attr("disabled", "disabled");
			setTimeout(function(){
				$("#settingsOverlay").hide();
				animationRunning = false;
				disableScroll = false;
				settingsModalState = "hidden";
			}, 320);
		}

		function showSettingsModal () {
			animationRunning = true;
			disableScroll = true;
			$("#settingsOverlay").show();
			settingsModalState = "visible";
			setTimeout(function(){
				$(".declineButton, .acceptButton, #settingsModal, #settingsOverlay").removeClass("hide")
				setTimeout(function(){
					animationRunning = false;
				}, 320);
			}, 20);
		}

		function loadModalAsSchedule (title) {
			$("#settingsModal .modalTop").removeClass("calendar").removeClass("warning").addClass("schedule").html('<div class="modalTitle">'+title+'</div>');
			$(".scheduleSettingWrapper").show();
			$("#settingsModal .modalContent").show();
			$(".calendarSettingWrapper, .generalSettingWrapper").hide();
		}

		function loadModalAsWarning (title, text, warning) {
			$("#settingsModal .modalTop").removeClass("calendar").removeClass("schedule").addClass("warning").html('<div class="modalTitle">'+title+'</div><div class="modalSubTitle">'+text+'</div><div class="modalSubTitle warning">'+warning+'</div>');
			$(".generalSettingWrapper").show();
			$(".scheduleSettingWrapper, .calendarSettingWrapper").hide();
			$("#settingsModal .modalContent").hide();
		}

		function loadModalAsCalendar () {
			$("#calendarSelectSettings").val("0");
			$("#settingsModal .modalTop").removeClass("schedule").removeClass("warning").addClass("calendar").html('<div class="modalTitle">Provkalendern</div>');
			$(".calendarSettingWrapper").show();
			$("#settingsModal .modalContent").show();
			$(".scheduleSettingWrapper, .generalSettingWrapper").hide();
		}

		function updateWeekNumber (newWeek) {
			week = newWeek + 1;
			$("#fullWeek").html("v."+week);
			$("#justWeek").html(week);
			if (scheduleState === "mySchedule") {
				updateSchedule(myScheduleID, "mySchedule");
			} else if (scheduleState === "otherSchedule") {
				updateSchedule(otherScheduleID, "otherSchedule");
			}
		}

		function weekSliderTo (slide) {
			weekSwiper.slideTo(slide);
		}

		function updateSelectContent (index, id) {
			$("#"+id).empty();
			if (index === 0) {
				// Returned to "Välj schema typ..."
				$("#"+id).attr("disabled", "disabled");
			} else {
				// Chose an actual type
				$("#"+id).removeAttr("disabled");
				if (index === 1) {
					// Chose the type "Lärare"
					var firstOption = "Välj lärare...";
					$.each(teachers, function(key, teacher){
						$("#"+id).append(
							'<option value="'+teacher.id+'">'+teacher.name+'</option>'
						);
					});
				} else if (index === 2) {
					// Chose the type "Klass"
					var firstOption = "Välj klass...";
					$.each(classes, function(key, schoolClass){
						$("#"+id).append(
							'<option value="'+schoolClass.id+'" data-class="'+schoolClass.name+'" data-class-id="'+schoolClass.googleID+'">'+schoolClass.name+'</option>'
						);
					});
				} else if (index === 3) {
					// Chose the type "Elev"
					var firstOption = "Välj elev...";
					$.each(students, function(key, student){
						$("#"+id).append(
							'<option value="'+student.id+'" data-class="'+student.class+'" data-class-id="'+classes[student.class].googleID+'">'+student.name+'</option>'
						);
					});
				} else if (index === 4) {
					// Chose the type "Sal"
					var firstOption = "Välj sal...";
					$.each(rooms, function(key, room){
						$("#"+id).append(
							'<option value="'+room.id+'">'+room.name+'</option>'
						);
					});
				}
				$("#"+id).prepend(
					'<option value="0">'+firstOption+'</option>'
				);
			}
		}

		function pushCalendarEvents (events) {
			events.sort(function(a,b){
				return new Date(a.date).getTime() - new Date(b.date).getTime()
			});
			$(".calendarWrapper").empty();
			var length = events.length;
			if (length > 0) {
				for (var x = 0; x < length; x++) {
					var item = events[x];
					var deadline = '';
					if (item.left < 0) {
						deadline = '<span class="grey">passerad.</span>';
					} else if (item.left == 0) {
						deadline = '<span class="red">idag!</span>';
					} else if (item.left == 1) {
						deadline = '<span class="red">imorgon.</span>';
					} else if (item.left < 5)  {
						deadline = '<span class="yellow">om '+item.left+' dagar.</span>';
					} else if (item.left < 14) {
						deadline = '<span class="green">om '+item.left+' dagar.</span>';
					} else if (item.left >= 14) {
						deadline = '<span class="green">'+item.displayDate+'</span>';
					}
					if (x !== 0) {
						$(".calendarWrapper").append(
							'<div class="postSplitter"></div>'
						);
					}
					$(".calendarWrapper").append(
						'<div class="postWrapper">'+
							'<div class="postTitle">'+ item.summary +'</div>'+
							'<div class="openSection">'+
								'<div class="deadline">Deadline: '+deadline+'</div>'+
							'</div>'+
						'</div>'
					);
				}
			} else {
				$(".calendarWrapper").append(
					'<div class="postMessage">Din kalender är tom..</div>'
				);
			}
		}

		// Load all calendar events
		function loadCalendarEvents () {
			var id = "itggot.se_" + calendarID + "@resource.calendar.google.com/events/";
			var key = "AIzaSyBMBbVIAhAfKBn5K8XSU9W-YGyxAJ_YsUQ";
			var events = [];
			var dateString = (new Date()).toISOString();
			var cal = $.ajax({
				url: "https://www.googleapis.com/calendar/v3/calendars/"+id+"?key="+key+"&maxResults=2500&timeMin="+dateString,
				type: "GET"
			});
			cal.done(function(data, resp){
				var events = [];
				$.each(data.items, function(){
					var item = this;
					if (item.status !== "cancelled") {
						if (item.start.date === undefined) {
							due = moment(item.start.dateTime).format('YYYY-MM-DD');
						} else {
							due = moment(item.start.date).format('YYYY-MM-DD');
						}
						var now = moment().format("YYYY-MM-DD");
						var diff = moment(due).diff(moment(now), "days");
						if (diff >= 0) {
							item.left = diff;
							item.displayDate = moment(due).locale("sv").format('ll'); // <- Change this to change format on output:ed date
							item.date = due;
							events.push(item);
						}
					}
				});
				pushCalendarEvents(events);
			});
		}

		function fixPageLoaderHeights () {
			$(".pageLoader").each(function(){
				var height = $(window).height() - 114;
				$(this).parents(".pageContainer").css("min-height", height + 64);
				$(this).css("height", height);
			});
		}

		function loadPageLoaders () {
			fixPageLoaderHeights();
			$(".pageLoader").each(function(){
				$(this).append(
					'<div class="loader">'+
						'<svg class="loaderIcon" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" xmlns:a="http://ns.adobe.com/AdobeSVGViewerExtensions/3.0/" x="0px" y="0px" width="40px" height="40px" viewBox="0 0 40 40" style="enable-background:new 0 0 40 40;" xml:space="preserve"><defs></defs><g class="loadOpac"><path class="loadFull" d="M20,40C9,40,0,31,0,20C0,9,9,0,20,0c11,0,20,9,20,20C40,31,31,40,20,40z M20,2C10.1,2,2,10.1,2,20c0,9.9,8.1,18,18,18c9.9,0,18-8.1,18-18C38,10.1,29.9,2,20,2z"/></g><g><path class="loadFull" d="M20,40C9,40,0,31,0,20h2c0,9.9,8.1,18,18,18V40z"/></g></svg>'+
					'</div>'
				);
			});
		}

		loadPageLoaders();

		$(window).resize(function(){
			fixPageLoaderHeights();
		});

		// Sliders

		var myScheduleSwiper = $('#mySchedule').swiper({
			mode:'horizontal',
			watchSlidesProgress: true,
			loop: false,
			onSliderMove: function () {
				updateSliderBar(myScheduleSwiper.translate);
			},
			onTouchStart: function () {
				$("#sliderBar").removeClass("animate");
			},
			onTransitionStart: function () {
				myScheduleDay = myScheduleSwiper.activeIndex;
				setSliderBar(myScheduleSwiper.activeIndex);
			},
		});

		var otherScheduleSwiper = $('#otherSchedule').swiper({
			mode:'horizontal',
			watchSlidesProgress: true,
			loop: false,
			onSliderMove: function () {
				updateSliderBar(otherScheduleSwiper.translate);
			},
			onTouchStart: function () {
				$("#sliderBar").removeClass("animate");
			},
			onTransitionStart: function () {
				otherScheduleDay = otherScheduleSwiper.activeIndex;
				setSliderBar(otherScheduleSwiper.activeIndex);
			},
		});

		var scheduleTypeSwiper = $('#scheduleTypeSwiper').swiper({
			mode:'horizontal',
			watchSlidesProgress: true,
			loop: false,
			onTransitionStart: function () {
				$("#scheduleSelectSettings").attr("disabled", "disabled");
				if ((scheduleTypeSwiper.activeIndex + 1) === scheduleTypeSwiper.slides.length) {
					$("#nextType").css("opacity", "0.35");
				} else if (scheduleTypeSwiper.activeIndex === 0) {
					$("#prevType").css("opacity", "0.35");
				} else {
					$("#nextType, #prevType").css("opacity", "1");
				}
			},
			onTransitionEnd: function () {
				updateSelectContent(scheduleTypeSwiper.activeIndex, "scheduleSelectSettings");
			}
		});

		var introMyScheduleTypeSwiper = $('#introMyScheduleSwiper').swiper({
			mode:'horizontal',
			watchSlidesProgress: true,
			loop: false,
			onTransitionStart: function () {
				$("#nextIntro").addClass("disabled");
				$("#introMyScheduleSource").attr("disabled", "disabled");
				if ((introMyScheduleTypeSwiper.activeIndex + 1) === introMyScheduleTypeSwiper.slides.length) {
					$("#nextIntroType").css("opacity", "0.35");
				} else if (introMyScheduleTypeSwiper.activeIndex === 0) {
					$("#prevIntroType").css("opacity", "0.35");
				} else {
					$("#nextIntroType, #prevIntroType").css("opacity", "1");
				}
			},
			onTransitionEnd: function () {
				// Update the intro select element based on the index of the type slider
				updateSelectContent(introMyScheduleTypeSwiper.activeIndex, "introMyScheduleSource");
			}
		});

		var introOtherScheduleTypeSwiper = $('#introOtherScheduleSwiper').swiper({
			mode:'horizontal',
			watchSlidesProgress: true,
			loop: false,
			onTransitionStart: function () {
				$("#nextIntro").addClass("disabled");
				$("#introOtherScheduleSource").attr("disabled", "disabled");
				if ((introOtherScheduleTypeSwiper.activeIndex + 1) === introOtherScheduleTypeSwiper.slides.length) {
					$("#nextOtherIntroType").css("opacity", "0.35");
				} else if (introOtherScheduleTypeSwiper.activeIndex === 0) {
					$("#prevOtherIntroType").css("opacity", "0.35");
				} else {
					$("#nextOtherIntroType, #prevOtherIntroType").css("opacity", "1");
				}
			},
			onTransitionEnd: function () {
				// Update intro double schedule select based on index of the double schedule slider
				updateSelectContent(introOtherScheduleTypeSwiper.activeIndex, "introOtherScheduleSource");
			}
		});

		$("#settingsOverlay").hide();
		var weekSwiper = "";
		showLoadingScreen();
		loadLocalContent();
		loadRemoteContent();

		function loadAppElements () {
			getTransitInfo();
			$(".calendarItemDate").html(date);
			setupWeekChoser(week);
			weekSwiper = $('#weekChooser').swiper({
				mode:'horizontal',
				watchSlidesProgress: true,
				loop: false,
				slidesPerView: 1,
				onTransitionStart: function () {
					if ((weekSwiper.activeIndex + 1) === weekSwiper.slides.length) {
						$("#nextWeek").css("opacity", "0.35");
					} else {
						$("#nextWeek").css("opacity", "1");
					}
					if (weekSwiper.activeIndex === 0) {
						$("#prevWeek").css("opacity", "0.35");
					} else if (weekSwiper.activeIndex > 0) {
						$("#prevWeek").css("opacity", "1");
					}
				},
				onTransitionEnd: function () {
					if (scheduleState === "mySchedule") {
						myWeek = weekSwiper.activeIndex + 1;
					} else if (scheduleState === "otherSchedule") {
						otherWeek = weekSwiper.activeIndex + 1;
					}
					updateWeekNumber(weekSwiper.activeIndex);
				}
			});
			weekSliderTo(week-1);
			getWindowSize();
			updateSchedule(myScheduleID, "mySchedule");
			updateSchedule(otherScheduleID, "otherSchedule");
			setMyDay();
			$("#fullWeek").html("v."+week);
			$("#justWeek").html(week);

			$("#mySchedule, #otherSchedule, #mySchedule .swiper-slide, #otherSchedule .swiper-slide").css({
				"width": w_width,
				"height": swipeHeight
			});

			if (firstTime === "false") {
				loadCalendarEvents();
				animationRunning = true;
				$("#myFriday").load(function(){
					scheduleLoaded = true;
					$("header, #days, #weekChooserWrap, nav").removeClass("move");
					setTimeout(function(){
						if (remoteContentLoaded) {
							hideLoadingScreen();
						}
						animationRunning = false;
						$("#schedulePage").removeClass("hide");
						setTimeout(function(){
							disableScroll = false;
						}, 320);
					}, 320);
				});
			}
		}

		$(".day").on({
			tap: function(){
				changeScheduleSlide($(this).attr("id"));
			}
		});

		$(".scheduleSwitchWrap").on({
			tap: function () {
				if (!animationRunning) {
					if (scheduleState === "mySchedule") {
						showOtherSchedule();
					} else if (scheduleState === "otherSchedule") {
						hideOtherSchedule();
					}
				}
			}
		});

		$(".weekTabWrap").on({
			tap: function () {
				if (!animationRunning) {
					if (weekSwitchState === "hidden") {
						showWeekSwitch();
					} else if (weekSwitchState === "visible") {
						hideWeekSwitch();
					}
				}
			}
		});

		$("#mainNav li").on({
			tap: function () {
				if (!animationRunning) {
					changePage($(this).attr("data-change-to-page"), $(this).attr("id"), $(this).attr("data-page-number"));
				}
			}
		});

		$("input").on({
			tap: function () {
				$(this).focus();
			}
		});

		$(".myScheduleNameInput").on({
			blur: function () {
				var myNewName = $(".myScheduleNameInput").val();
				if (myNewName !== "" && myNewName !== myScheduleName && myNewName.length <= 20) {
					// Changed the name of My schedule name
					myScheduleName = myNewName;
					localStorage.setItem("myScheduleName", myNewName);
					updateScheduleNames();
				} else if (myNewName === "" || myNewName === myScheduleName) {
					$(".myScheduleNameInput").val(myScheduleName);
					updateScheduleNames();
				}
			},
			input: function () {
				var myNewName = $(".myScheduleNameInput").val();
				$(".myScheduleNameHolder").html(myNewName);
			}
		});

		$(".otherScheduleNameInput").on({
			blur: function () {
				var otherNewName = $(".otherScheduleNameInput").val();
				if (otherNewName !== "" && otherNewName !== otherScheduleName && otherNewName.length <= 20) {
					// Changed the name of My schedule name
					otherScheduleName = otherNewName;
					localStorage.setItem("otherScheduleName", otherNewName);
					updateScheduleNames();
				} else if (otherNewName === "" || otherNewName === otherScheduleName) {
					$(".otherScheduleNameInput").val(otherScheduleName);
					updateScheduleNames();
				}
			},
			input: function () {
				var otherNewName = $(".otherScheduleNameInput").val();
				$(".otherScheduleNameHolder").html(otherNewName);
			}
		});

		$(".focusOnMyInput").on({
			tap: function () {
				$(".myScheduleNameInput").focus();
			}
		});

		$(".focusOnOtherInput").on({
			tap: function () {
				$(".otherScheduleNameInput").focus();
			}
		});

		$(".doubleScheduleSwitch").on({
			tap: function () {
				if (!animationRunning) {
					if (doubleSchedules === "true") {
						turnOffDoubleSchedules();
					} else if (doubleSchedules === "false") {
						turnOnDoubleSchedules();
					}
				}
			}
		});

		$("#removeLocalContent").on({
			tap: function () {
				if (!animationRunning) {
					if (settingsModalState === "hidden") {
						modalMode = "removeLocalContent";
						showSettingsModal();
						loadModalAsWarning("Återställ alla inställningar", "Är du säker på att du vill återsälla alla inställningar?", "Detta är permanent.");
					}
				}
			}
		});

		$(".changeMySchedule").on({
			tap: function () {
				if (!animationRunning) {
					if (settingsModalState === "hidden") {
						modalMode = "mySchedule";
						showSettingsModal();
						loadModalAsSchedule(myScheduleName);
					}
				}
			}
		});

		$(".changeOtherSchedule").on({
			tap: function () {
				if (!animationRunning) {
					if (settingsModalState === "hidden") {
						modalMode = "otherSchedule";
						showSettingsModal();
						loadModalAsSchedule(otherScheduleName);
					}
				}
			}
		});

		$(".changeCalendar").on({
			tap: function () {
				if (!animationRunning) {
					if (settingsModalState === "hidden") {
						modalMode = "calendar";
						showSettingsModal();
						loadModalAsCalendar();
					}
				}
			}
		});

		$("#nextWeek").on({
			tap: function () {
				weekSwiper.slideTo(week);
			}
		});

		$("#prevWeek").on({
			tap: function () {
				weekSwiper.slideTo(week-2);
			}
		});

		$(".declineButton").on({
			tap: function () {
				if (!animationRunning) {
					if (settingsModalState === "visible") {
						setTimeout(function(){
							scheduleTypeSwiper.slideTo(0);
							$("#scheduleSelectSettings").empty();
						}, 200);
						hideSettingsModal();
					}
				}
			}
		});

		$(".acceptButton").on({
			tap: function () {
				if (!animationRunning) {
					if (settingsModalState === "visible") {
						if (modalMode === "removeLocalContent") {
							showLoadingScreen();
							$("#intro").show();
							setTimeout(function(){
								$("#intro").removeClass("hide");
							},20);
							resetIntro();
							setTimeout(function(){
								resetLocalContent();
								setTimeout(function(){
									hideLoadingScreen();
									hideSettingsModal();
									changePage("schedule", "scheduleItem", "1");
									$("header, #days, #weekChooserWrap, nav").addClass("move");
									$("#schedulePage").addClass("hide");
									setTimeout(function(){
										showIntro();
									}, 320);
								}, 1000);
							}, 320);
						} else if (modalMode === "mySchedule") {
							var chosenSchedule = $("#scheduleSelectSettings").val();
							if (chosenSchedule !== "0") {
								// User chose an actual schedule, save it to the local content.
								myScheduleID = chosenSchedule;
								myScheduleSource = $("#scheduleSelectSettings option:selected").html();
								localStorage.setItem("myScheduleID", myScheduleID);
								localStorage.setItem("myScheduleSource", myScheduleSource);
								hideSettingsModal();
								updateScheduleNames();
								updateSchedule(myScheduleID, "mySchedule");
								// updateSchedule(otherScheduleID, "otherSchedule");
								setTimeout(function(){
									scheduleTypeSwiper.slideTo(0);
									$("#scheduleSelectSettings").empty();
								}, 200);
							} else {
								// User didn't choose an actual class, throw exception
								$("#scheduleSelectSettings").addClass("error");
							}
						} else if (modalMode === "otherSchedule") {
							var chosenSchedule = $("#scheduleSelectSettings").val();
							if (chosenSchedule !== "0") {
								// User chose an actual schedule, save it to the local content.
								otherScheduleID = chosenSchedule;
								otherScheduleSource = $("#scheduleSelectSettings option:selected").html();
								localStorage.setItem("otherScheduleID", otherScheduleID);
								localStorage.setItem("otherScheduleSource", otherScheduleSource);
								hideSettingsModal();
								updateScheduleNames();
								updateSchedule(otherScheduleID, "otherSchedule");
								setTimeout(function(){
									scheduleTypeSwiper.slideTo(0);
									$("#scheduleSelectSettings").empty();
								}, 200);
							} else {
								// User didn't choose an actual class, throw exception
								$("#scheduleSelectSettings").addClass("error");
							}
						} else if (modalMode === "calendar") {
							var chosenClass = $("#calendarSelectSettings").val();
							if (chosenClass !== "0") {
								// User chose an actual class, save it to the local content
								calendarSource = $("#calendarSelectSettings option:selected").html();
								calendarID = chosenClass;
								localStorage.setItem("calendarID", calendarID);
								localStorage.setItem("calendarSource", calendarSource);
								loadCalendarEvents();
								hideSettingsModal();
								updateScheduleNames();
							} else {
								// User didn't chose an actual class, throw exception
								$("#calendarSelectSettings").addClass("error");
							}
						}
					}
				}
			}
		});

		$("#nextType").on({
			tap: function () {
				scheduleTypeSwiper.slideTo(scheduleTypeSwiper.activeIndex+1);
			}
		});

		$("#prevType").on({
			tap: function () {
				scheduleTypeSwiper.slideTo(scheduleTypeSwiper.activeIndex-1);
			}
		});

		$("#nextIntro").on({
			tap: function () {
				if (!$(this).hasClass("disabled")) {
					if (introPage !== 5 && !animationRunning) {
						introPage++;
						toIntroPage(introPage);
					} else if (introPage === 5 && !animationRunning) {
						// INTRO SETTINGS DONE
						animationRunning = true;
						localStorage.setItem("firstTime", "false");
						localStorage.setItem("myScheduleID", introMySchedule);
						localStorage.setItem("myScheduleName", introMyName);
						localStorage.setItem("myScheduleSource", introMyScheduleSource);
						myScheduleName = introMyName;
						myScheduleID = introMySchedule;
						myScheduleSource = introMyScheduleSource;
						$(".myScheduleNameInput").val(myScheduleName);
						if (introDoubleSchedule) {
							localStorage.setItem("otherScheduleID", introOtherSchedule);
							localStorage.setItem("otherScheduleName", introOtherName);
							localStorage.setItem("otherScheduleSource", introOtherScheduleSource);
							otherScheduleName = introOtherName;
							otherScheduleID = introOtherSchedule;
							otherScheduleSource = introOtherScheduleSource;
							updateSchedule(otherScheduleID, "otherSchedule");
							$(".otherScheduleNameInput").val(otherScheduleName);
						}
						calendarID = introClassID;
						calendarSource = introClassSource;
						localStorage.setItem("calendarID", calendarID);
						localStorage.setItem("calendarSource", calendarSource);
						loadCalendarEvents();
						updateScheduleNames();
						showLoadingScreen();
						hideIntro();
						setTimeout(function(){
							updateSchedule(myScheduleID, "mySchedule");
							if (introDoubleSchedule) {
								updateSchedule(otherScheduleID, "otherSchedule");
							}
							$("#myFriday").load(function(){
								$(window).scrollTop(0);
								hideLoadingScreen();
								setTimeout(function(){
									$("header, #days, #weekChooserWrap, nav").removeClass("move");
									setTimeout(function(){
										animationRunning = false;
										$("#schedulePage").removeClass("hide");
									}, 320);
									$("#schedulePage").removeClass("hide");
								}, 320);
							});
						}, 320);
					}
				}
			},
		});

		$("#prevIntro").on({
			tap: function () {
				if (introPage !== 1 && !animationRunning) {
					introPage--;
					toIntroPage(introPage);
				}
			},
		});

		$("#nextIntroType").on({
			tap: function () {
				introMyScheduleTypeSwiper.slideTo(introMyScheduleTypeSwiper.activeIndex+1);
			}
		});

		$("#prevIntroType").on({
			tap: function () {
				introMyScheduleTypeSwiper.slideTo(introMyScheduleTypeSwiper.activeIndex-1);
			}
		});

		$("#nextOtherIntroType").on({
			tap: function () {
				introOtherScheduleTypeSwiper.slideTo(introOtherScheduleTypeSwiper.activeIndex+1);
			}
		});

		$("#prevOtherIntroType").on({
			tap: function () {
				introOtherScheduleTypeSwiper.slideTo(introOtherScheduleTypeSwiper.activeIndex-1);
			}
		});

		$("#introDoubleSchedule").on({
			tap: function () {
				if (!animationRunning) {
					if (!introDoubleSchedule) {
						$("#nextIntro").addClass("disabled");
						$("#introOtherScheduleSource, #introOtherScheduleSwiper").removeClass("hide");
						$("#doubleScheduleContent .shield").hide();
						introDoubleSchedule = true;
						animationRunning = true;
						$(".introSwitch", this).addClass("on");
						$("#introOtherName").removeAttr("disabled").show();
						setTimeout(function(){
							animationRunning = false;
						}, 320);
					} else if (introDoubleSchedule) {
						$("#nextIntro").removeClass("disabled");
						$("#doubleScheduleContent .shield").show();
						$("#introOtherScheduleSource, #introOtherScheduleSwiper").addClass("hide");
						introDoubleSchedule = false;
						animationRunning = true;
						$(".introSwitch", this).removeClass("on");
						$("#introOtherName").attr("disabled", "disabled").hide();
						setTimeout(function(){
							animationRunning = false;
						}, 320);
					}
				}
			}
		});

		$("#myClass").on({
			tap: function () {
				if (!animationRunning) {
					if (introClassType === "standard" || introClassType === "other") {
						introClassType = "my";
						introClassID = $(this).attr("data-class-id");
						introClassSource = $(this).attr("data-class");
						$("#nextIntro").removeClass("disabled");
						$("#myClass .introSwitch").addClass("on");
						$("#otherClass .introSwitch").removeClass("on");
						$("#introCalendarSource").attr("disabled", "disabled");
						animationRunning = true;
						setTimeout(function(){
							animationRunning = false;
						}, 320);
					} else if (introClassType === "my") {
						introClassType = "standard";
						if ($("#introCalendarSource").val() === "0") {
							$("#nextIntro").addClass("disabled");
							introClassID = undefined;
							introClassSource = undefined;
						} else {
							$("#nextIntro").removeClass("disabled");
							introClassID = $("#introCalendarSource").val();
							introClassSource = $("#introCalendarSource option:selected").html();
						}
						$("#myClass .introSwitch").removeClass("on");
						$("#introCalendarSource").removeAttr("disabled");
						animationRunning = true;
						setTimeout(function(){
							animationRunning = false;
						}, 320);
					}
				}
			}
		});

		$("#otherClass").on({
			tap: function () {
				if (!animationRunning) {
					if (introClassType === "standard" || introClassType === "my") {
						introClassType = "other";
						introClassID = $(this).attr("data-class-id");
						introClassSource = $(this).attr("data-class");
						$("#nextIntro").removeClass("disabled");
						$("#otherClass .introSwitch").addClass("on");
						$("#myClass .introSwitch").removeClass("on");
						$("#introCalendarSource").attr("disabled", "disabled");
						animationRunning = true;
						setTimeout(function(){
							animationRunning = false;
						}, 320);
					} else if (introClassType === "other") {
						introClassType = "standard";
						if ($("#introCalendarSource").val() === "0") {
							$("#nextIntro").addClass("disabled");
							introClassID = undefined;
							introClassSource = undefined;
						} else {
							$("#nextIntro").removeClass("disabled");
							introClassID = $("#introCalendarSource").val();
							introClassSource = $("#introCalendarSource option:selected").html();
						}
						$("#otherClass .introSwitch").removeClass("on");
						$("#introCalendarSource").removeAttr("disabled");
						animationRunning = true;
						setTimeout(function(){
							animationRunning = false;
						}, 320);
					}
				}
			}
		});

		$("#introMyName").on({
			input: function () {
				var introMyNameVal = $("#introMyName").val();
				if (introMyNameVal.length <= 20) {
					$("#myScheduleNameClass").html("("+introMyNameVal+")");
				}
			},
			blur: function () {
				var introMyNameVal = $("#introMyName").val();
				if (introMyNameVal === "") {
					$("#introMyName").val(introMyName);
					$("#myScheduleNameClass").html("("+introMyName+")");
				} else if (introMyNameVal !== "" && introMyNameVal.length <= 20) {
					introMyName = introMyNameVal;
					$("#myScheduleNameClass").html("("+introMyNameVal+")");
				}
			}
		});

		$("#introOtherName").on({
			input: function () {
				var introOtherNameVal = $("#introOtherName").val();
				if (introOtherNameVal.length <= 20) {
					$("#otherScheduleNameClass").html("("+introOtherNameVal+")");
				}
			},
			blur: function () {
				var introOtherNameVal = $("#introOtherName").val();
				if (introOtherNameVal === "") {
					$("#introOtherName").val(introOtherName);
					$("#otherScheduleNameClass").html("("+introOtherName+")");
				} else if (introOtherNameVal !== "" && introOtherNameVal.length <= 20) {
					introOtherName = introOtherNameVal;
					$("#otherScheduleNameClass").html("("+introOtherNameVal+")");
				}
			}
		});

		$("#introMyScheduleSource").on({
			change: function () {
				var scheduleVal = $(this).val();
				if (scheduleVal !== "0") {
					// The user chose a new schedule
					introMySchedule = scheduleVal;
					introMyScheduleSource = $("option:selected", this).html();
					if ($("option:selected", this).attr("data-class")) {
						introMyScheduleClass = $("option:selected", this).attr("data-class");
						introMyScheduleClassID = $("option:selected", this).attr("data-class-id");
					}
					$("#nextIntro").removeClass("disabled");
				}
			}
		});

		$("#introOtherScheduleSource").on({
			change: function () {
				var scheduleVal = $(this).val();
				if (scheduleVal !== "0") {
					// The user chose a new schedule
					introOtherSchedule = scheduleVal;
					introOtherScheduleSource = $("option:selected", this).html();
					if ($("option:selected", this).attr("data-class")) {
						introOtherScheduleClass = $("option:selected", this).attr("data-class");
						introOtherScheduleClassID = $("option:selected", this).attr("data-class-id");
					}
					$("#nextIntro").removeClass("disabled");
				}
			}
		});

		$("#introCalendarSource").on({
			change: function () {
				var calendarVal = $(this).val();
				if (calendarVal !== "0") {
					$("#nextIntro").removeClass("disabled");
					introClassID = calendarVal;
					introClassSource = $("option:selected", this).html();
				} else {
					$("#nextIntro").addClass("disabled");
					introClassID = undefined;
					introClassSource = undefined;
				}
			}
		});

		$("input, select").on({
			focus: function () {
				$(this).removeClass("error");
			}
		});

		$("body").on("tap", ".toggleView", function(){
			if (!animationRunning) {
				animationRunning = true;
				if ($(this).hasClass("expanded")) {
					$(window).scrollTop("0px");
					$(this).removeClass("expanded");
					$(this).siblings(".openSection").removeClass("expanded");
					$(this).siblings(".openSection").find(".tracksOuter").hide();
					$(this).siblings(".openSection").find(".nearestWrap").show();
				} else {
					$(this).addClass("expanded");
					$(this).siblings(".openSection").addClass("expanded");
					$(this).siblings(".openSection").find(".tracksOuter").show();
					$(this).siblings(".openSection").find(".nearestWrap").hide();
				}
				setTimeout(function(){
					animationRunning = false;
				}, 100);
			}
		});

		setInterval(function(){
			reloadContent();
		}, 3000);

	/* ----- END for code that  ----- */
	});
});