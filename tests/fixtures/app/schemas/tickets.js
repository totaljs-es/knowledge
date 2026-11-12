var fs = require('fs');

NEWACTION('Tickets/list', {
	name: 'List',
	action: function($) {
		$.callback([]);
	}
});
