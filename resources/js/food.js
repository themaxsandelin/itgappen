
	function getCafeInfo(callback) {
		var req = new XMLHttpRequest();
		req.open('GET', 'http://139.59.171.126:8888/api/v2/cafe');
		req.send();
		req.onreadystatechange = function() {
			if (req.readyState == 4 && req.status == 200) callback(JSON.parse(req.responseText));
		}
	}

	getCafeInfo(function(data) {
		console.log(data);
	});