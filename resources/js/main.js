
	// Set default moment locale (lang) so Swedish
	moment.locale('sv');

	if ('addEventListener' in document) {
		document.addEventListener('DOMContentLoaded', function() {
	    FastClick.attach(document.body);
		}, false);
	}