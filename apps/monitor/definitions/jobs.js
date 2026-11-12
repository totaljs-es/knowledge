// The framework emits "service" every minute, with the number of minutes since the start
ON('service', function(counter) {
	if (counter % CONF.interval === 0)
		ACTION('Sites|check').callback(ERROR('Sites|check'));
});

// Every day at midnight the count of the checks of each website starts again
CRON('0 0 * * *', function() {
	var sites = MAIN.monitor.sites;
	for (var i = 0; i < sites.length; i++) {
		sites[i].checks = 0;
		sites[i].failures = 0;
	}
	MAIN.monitor.save();
});
