
'use strict';


var maps = {
	get: function() {
		return $.ajax({
			method: 'get',
			url: '/maps',
    		contentType: 'application/json',
			dataType: 'json'
		});
	},
	create: function(map) {
		return $.post('/maps', map);
	}
};


module.exports = maps;