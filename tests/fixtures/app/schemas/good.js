NEWACTION('Tickets|list', {
	name: 'List',
	action: function($) {
		$.callback(Total.Os.platform());
	}
});
