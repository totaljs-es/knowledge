require('total5');
require('total5/test');

// Native tests of the application. They copy it to a disposable folder, start it there as it is started by hand (node index.js <port>)
// and call its API. The websites that it checks are a small server of this test, so nothing goes to the internet. Run: node test.js

var TMP = Total.Fs.mkdtempSync(Total.Path.join(Total.Os.tmpdir(), 'monitor-test-'));
var PORT = 8107;
var TARGET = 8117;
var URL = 'http://127.0.0.1:' + PORT + '/api/';
var TOKEN = 'test-token';

var app;

// The websites of the test: one that answers, one that fails and one that is slower than the timeout of the application
var target = Total.Http.createServer(function(req, res) {
	if (req.url === '/ok/') {
		res.writeHead(200);
		res.end('ok');
	} else if (req.url === '/broken/') {
		res.writeHead(500);
		res.end('broken');
	} else if (req.url === '/slow/')
		setTimeout(function() {
			res.writeHead(200);
			res.end('slow');
		}, 3000);
	else {
		res.writeHead(404);
		res.end();
	}
});


// The application does not stay running when a check fails
process.on('exit', function() {
	app && app.kill();
});

function check(message, ok) {
	Test.print(message, ok ? null : 'failed');
}

function api(schema, data, token) {
	return new Promise(function(resolve) {
		var builder = RESTBuilder.POST(URL, { schema: schema, data: data });
		token && builder.header('x-token', token);
		builder.exec(function(err, response, output) {
			// A page of the framework (401 without a user) comes as an error with the status in its name
			var status = output && output.status ? output.status : (err && err.items && err.items[0] ? +err.items[0].name : 0);
			resolve({ err: err, response: response, status: status });
		});
	});
}

Test.push('start', function(next) {

	// The copy has its own token and its own data
	['index.js', 'config', 'controllers', 'definitions', 'actions'].forEach(function(name) {
		Total.Fs.cpSync(Total.Path.join(__dirname, name), Total.Path.join(TMP, name), { recursive: true });
	});
	Total.Fs.appendFileSync(Total.Path.join(TMP, 'config'), '\ntoken : ' + TOKEN + '\ntimeout (Number) : 1000\n');
	target.listen(TARGET, '127.0.0.1');

	// The copy finds the framework where this folder finds it
	var modules = Total.Path.dirname(Total.Path.dirname(require.resolve('total5')));
	app = Total.Child.spawn(process.execPath, ['index.js', '' + PORT, '--release'], { cwd: TMP, env: Object.assign({}, process.env, { NODE_PATH: modules }), stdio: 'ignore' });

	// The server answers before its routes are loaded: the application is ready when the API refuses a request without the token
	var tries = 0;
	var wait = function() {
		api('sites').then(function(r) {
			if (r.status === 401) {
				check('the application starts', true);
				next();
			} else if (tries++ < 50)
				setTimeout(wait, 200);
			else
				check('the application starts', false);
		});
	};
	wait();
});

Test.push('authorization', async function(next) {
	var r = await api('sites');
	check('a request without the token is refused', r.status === 401);
	r = await api('sites', null, TOKEN);
	check('the list is empty at the start', r.status === 200 && r.response instanceof Array && r.response.length === 0);
	next();
});

Test.push('sites', async function(next) {

	var base = 'http://127.0.0.1:' + TARGET;

	var r = await api('sites_create', { name: 'No address' }, TOKEN);
	check('a website without an address is not added', r.status === 400);

	r = await api('sites_create', { name: 'Wrong', url: 'not an address' }, TOKEN);
	check('a wrong address is not accepted', r.status === 400);

	r = await api('sites_create', { name: 'Works', url: base + '/ok/' }, TOKEN);
	var ok = r.response.value;
	check('create answers with the id of the website', r.response.success === true && typeof(ok) === 'string' && ok.length > 0);

	r = await api('sites_create', { name: 'Works again', url: base + '/ok/' }, TOKEN);
	check('the same address is not added twice', r.status === 400);

	await api('sites_create', { name: 'Broken', url: base + '/broken/' }, TOKEN);
	await api('sites_create', { name: 'Slow', url: base + '/slow/' }, TOKEN);
	await api('sites_create', { name: 'Nothing there', url: 'http://127.0.0.1:9/' }, TOKEN);

	r = await api('sites', null, TOKEN);
	check('a new website has no check yet', r.response.length === 4 && r.response[0].checks === 0 && r.response[0].dtchecked === null && r.response[0].isdown === false);

	r = await api('sites_check', null, TOKEN);
	var sites = r.response;
	var by = function(name) {
		return sites.findItem('name', name);
	};
	check('a website that answers 200 is up, with its time', by('Works').status === 200 && by('Works').isdown === false && by('Works').checks === 1 && by('Works').failures === 0 && !!by('Works').dtchecked);
	check('a website that answers 500 is down', by('Broken').status === 500 && by('Broken').isdown === true && by('Broken').failures === 1);
	check('a website slower than the timeout is down, with the status 408', by('Slow').isdown === true && by('Slow').status === 408 && by('Slow').ms < 2500);
	check('an address where nothing listens is down', by('Nothing there').isdown === true && by('Nothing there').status === 0);

	r = await api('sites_check', null, TOKEN);
	check('every check is counted', r.response.findItem('name', 'Works').checks === 2 && r.response.findItem('name', 'Broken').failures === 2);

	r = await api('sites_remove/' + ok, null, TOKEN);
	check('remove answers with the id', r.response.success === true && r.response.value === ok);

	r = await api('sites_remove/' + ok, null, TOKEN);
	check('a website that does not exist is not removed', r.status === 404);

	next();
});

Test.push('the state is kept', async function(next) {

	// The object of MEMORIZE is written to a file a second after a change
	await new Promise(function(resolve) {
		setTimeout(resolve, 1800);
	});

	var file = Total.Path.join(TMP, 'databases', 'memorize_monitor.json');
	var saved = Total.Fs.existsSync(file) ? Total.Fs.readFileSync(file, 'utf8').parseJSON(true) : null;
	check('the websites and their last check are in the file of MEMORIZE', !!saved && saved.sites.length === 3 && saved.sites.findItem('name', 'Broken').failures === 2);

	// The application starts again and has the same websites
	app.kill();
	await new Promise(function(resolve) {
		setTimeout(resolve, 500);
	});

	var modules = Total.Path.dirname(Total.Path.dirname(require.resolve('total5')));
	app = Total.Child.spawn(process.execPath, ['index.js', '' + PORT, '--release'], { cwd: TMP, env: Object.assign({}, process.env, { NODE_PATH: modules }), stdio: 'ignore' });

	var r;
	for (var i = 0; i < 50; i++) {
		r = await api('sites', null, TOKEN);
		if (r.status === 200)
			break;
		await new Promise(function(resolve) {
			setTimeout(resolve, 200);
		});
	}

	check('after a restart the websites and their counts are the same', r.status === 200 && r.response.length === 3 && r.response.findItem('name', 'Broken').failures === 2);

	app.kill();
	target.close();
	Total.Fs.rmSync(TMP, { recursive: true, force: true });
	next();
});

Test.run();
