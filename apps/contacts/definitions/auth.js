var BOT = { id: 'bot', name: 'Bot', sa: true };

AUTH(function($) {

	var token = $.headers['x-token'];

	if (!token) {
		$.invalid();
		return;
	}

	// Too many wrong tokens from the same client
	if (BLOCKED($, 10)) {
		$.invalid();
		return;
	}

	if (token === CONF.token) {
		BLOCKED($, -1);
		$.success(BOT);
	} else
		$.invalid();
});
