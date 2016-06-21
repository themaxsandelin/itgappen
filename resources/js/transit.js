
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

	loadTransits(function(data) {
		console.log(data);
	});