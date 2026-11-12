require('total5');
require('total5/test');

// Native tests of the application. They copy it to a disposable folder, start it there as it is started by hand (node index.js <port>)
// and call its API. Run: node test.js

var TMP = Total.Fs.mkdtempSync(Total.Path.join(Total.Os.tmpdir(), 'files-test-'));
var PORT = 8105;
var BASE = 'http://127.0.0.1:' + PORT;
var URL = BASE + '/api/';
var TOKEN = 'test-token';

var app;

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
	['index.js', 'config', 'controllers', 'definitions', 'schemas'].forEach(function(name) {
		Total.Fs.cpSync(Total.Path.join(__dirname, name), Total.Path.join(TMP, name), { recursive: true });
	});
	Total.Fs.appendFileSync(Total.Path.join(TMP, 'config'), '\ntoken : ' + TOKEN + '\n');

	// The copy finds the framework where this folder finds it
	var modules = Total.Path.dirname(Total.Path.dirname(require.resolve('total5')));
	app = Total.Child.spawn(process.execPath, ['index.js', '' + PORT, '--release'], { cwd: TMP, env: Object.assign({}, process.env, { NODE_PATH: modules }), stdio: 'ignore' });

	// The server answers before its routes are loaded: the application is ready when the API refuses a request without the token
	var tries = 0;
	var wait = function() {
		api('files').then(function(r) {
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

// A multipart upload, as a browser or a program sends it
function upload(name, content, token) {
	var form = new FormData();
	form.append('file', new Blob([content], { type: 'text/plain' }), name);
	return fetch(BASE + '/upload/', { method: 'POST', headers: token ? { 'x-token': token } : {}, body: form }).then(function(res) {
		return res.text().then(function(text) {
			return { status: res.status, response: text.isJSON() ? text.parseJSON() : text };
		});
	});
}

Test.push('authorization', async function(next) {
	var r = await upload('hello.txt', 'Hello');
	check('an upload without the token is refused', r.status === 401);
	r = await api('files');
	check('the list without the token is refused', r.status === 401);
	r = await api('files', null, TOKEN);
	check('the list with the token is empty at the start', r.status === 200 && r.response instanceof Array && r.response.length === 0);
	next();
});

Test.push('files', async function(next) {

	var r = await upload('hello.txt', 'Hello from a text file\n', TOKEN);
	var file = r.response[0];
	check('an upload answers with the file: id, name, size, type and address', r.status === 200 && r.response.length === 1 && file.name === 'hello.txt' && file.size === 23 && file.ext === 'txt' && file.type === 'text/plain' && file.url === '/download/' + file.id + '.txt');

	r = await api('files', null, TOKEN);
	check('the file is in the list with its address', r.response.length === 1 && r.response[0].id === file.id && r.response[0].url === file.url);

	var res = await fetch(BASE + file.url);
	check('the address of the file needs no token and gives its content and its type', res.status === 200 && res.headers.get('content-type').indexOf('text/plain') === 0 && (await res.text()) === 'Hello from a text file\n');

	res = await fetch(BASE + file.url + '?download=1');
	check('with download=1 the browser saves the file with its name', res.status === 200 && (res.headers.get('content-disposition') || '').indexOf('attachment') === 0 && res.headers.get('content-disposition').indexOf('hello.txt') !== -1);

	r = await upload('big.txt', 'x'.repeat(6 * 1024 * 1024), TOKEN);
	check('a file over the limit of the route is refused with 431', r.status === 431);

	r = await api('files', null, TOKEN);
	check('the refused file is not stored', r.response.length === 1);

	var empty = await fetch(BASE + '/upload/', { method: 'POST', headers: { 'x-token': TOKEN }, body: new FormData() });
	check('an upload without a file is an error for the user', empty.status === 400 && (await empty.text()).indexOf('No file was sent') !== -1);

	r = await api('files_remove/' + file.id, null, TOKEN);
	check('remove answers with the id', r.response.success === true && r.response.value === file.id);

	r = await api('files', null, TOKEN);
	check('the removed file is not in the list', r.response.length === 0);

	res = await fetch(BASE + file.url);
	check('the address of a removed file is a page 404', res.status === 404);

	r = await api('files_remove/' + file.id, null, TOKEN);
	check('a file that does not exist is not removed', r.status === 404);

	app.kill();
	Total.Fs.rmSync(TMP, { recursive: true, force: true });
	next();
});

Test.run();
