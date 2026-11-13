NEWACTION('Sites|list', {
	name: 'List of websites with the result of their last check',
	action: function($) {
		$.callback(MAIN.monitor.sites);
	}
});

NEWACTION('Sites|create', {
	name: 'Add a website',
	input: '*name:String, *url:URL',
	action: function($, model) {

		if (MAIN.monitor.sites.findItem('url', model.url)) {
			$.invalid('@(The website is already in the list)');
			return;
		}

		model.id = UID();
		model.status = 0;
		model.ms = 0;
		model.checks = 0;
		model.failures = 0;
		model.isdown = false;
		model.dtchecked = null;
		model.dtcreated = NOW;

		MAIN.monitor.sites.push(model);
		MAIN.monitor.save();
		$.success(model.id);
	}
});

NEWACTION('Sites|remove', {
	name: 'Remove a website',
	params: '*id:UID',
	action: function($) {

		var index = MAIN.monitor.sites.findIndex('id', $.params.id);

		if (index === -1) {
			$.invalid(404);
			return;
		}

		MAIN.monitor.sites.splice(index, 1);
		MAIN.monitor.save();
		$.success($.params.id);
	}
});

NEWACTION('Sites|check', {
	name: 'Check every website now',
	action: function($) {

		// One request after another; a website that does not answer in time counts as down
		MAIN.monitor.sites.wait(function(site, next) {

			var start = Date.now();

			RESTBuilder.GET(site.url).timeout(CONF.timeout).exec(function(err, response, output) {
				site.status = output && output.status ? output.status : 0;
				site.ms = Date.now() - start;
				site.isdown = site.status < 200 || site.status >= 400;
				site.checks++;
				site.isdown && site.failures++;
				site.dtchecked = new Date();
				next();
			});

		}, function() {
			MAIN.monitor.save();
			$.callback(MAIN.monitor.sites);
		});
	}
});
