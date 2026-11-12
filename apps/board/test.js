require('total5');
require('total5/test');

// Native tests of the application. They copy it to a disposable folder, start it there as it is started by hand (node index.js <port>)
// and call the API of its plugins. The screens are checked by hand in a browser. Run: node test.js

var TMP = Total.Fs.mkdtempSync(Total.Path.join(Total.Os.tmpdir(), 'board-test-'));
var PORT = 8103;
var URL = 'http://127.0.0.1:' + PORT;

var app;

// The application does not stay running when a check fails
process.on('exit', function() {
	app && app.kill();
});

function check(message, ok) {
	Test.print(message, ok ? null : 'failed');
}

function status(err, output) {
	// A page of the framework (404) comes as an error with the status in its name
	return output && output.status ? output.status : (err && err.items && err.items[0] ? +err.items[0].name : 0);
}

function api(schema, data) {
	return new Promise(function(resolve) {
		RESTBuilder.POST(URL + '/api/', { schema: schema, data: data }).exec(function(err, response, output) {
			resolve({ response: response, status: status(err, output) });
		});
	});
}

function page(url) {
	return new Promise(function(resolve) {
		RESTBuilder.GET(URL + url).exec(function(err, response, output) {
			resolve({ status: status(err, output), html: output && typeof(output.response) === 'string' ? output.response : '' });
		});
	});
}

Test.push('start', function(next) {

	['index.js', 'config', 'controllers', 'definitions', 'plugins', 'views', 'public'].forEach(function(name) {
		Total.Fs.cpSync(Total.Path.join(__dirname, name), Total.Path.join(TMP, name), { recursive: true });
	});

	// The copy finds the framework where this folder finds it
	var modules = Total.Path.dirname(Total.Path.dirname(require.resolve('total5')));
	app = Total.Child.spawn(process.execPath, ['index.js', '' + PORT, '--release'], { cwd: TMP, env: Object.assign({}, process.env, { NODE_PATH: modules }), stdio: 'ignore' });

	// The server answers before its routes are loaded: the application is ready when the API answers
	var tries = 0;
	var wait = function() {
		api('tasks').then(function(r) {
			if (r.status === 200) {
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

Test.push('the page and the plugins', async function(next) {

	var r = await page('/');
	check('the page has both plugins in the menu, in the order of their position', r.status === 200 && r.html.indexOf('data-if="tasks"') !== -1 && r.html.indexOf('data-if="tasks"') < r.html.indexOf('data-if="notes"'));
	check('the page mounts the screen and the form of each plugin', r.html.indexOf('url:/_tasks/index.html') !== -1 && r.html.indexOf('url:/_notes/form.html') !== -1);
	check('the first plugin is the screen that opens', /common\.page\s*=\s*'tasks'/.test(r.html));

	r = await page('/_tasks/index.html');
	check('the screen of a plugin is served from its public folder', r.status === 200 && r.html.indexOf('<ui-plugin') !== -1);

	r = await page('/_notes/form.html');
	check('the form of a plugin is served from its public folder', r.status === 200 && r.html.indexOf('name="miniform"') !== -1);

	next();
});

Test.push('tasks', async function(next) {

	var r = await api('tasks_save', { note: 'no name' });
	check('a task without a name is not created', r.status === 400);

	r = await api('tasks_save', { name: 'Buy flour', note: 'Two kilos' });
	var id = r.response.value;
	check('save answers with the id of the new task', r.response.success === true && typeof(id) === 'string' && id.length > 0);

	r = await api('tasks');
	check('the new task is in the list and is not done', r.response.length === 1 && r.response[0].name === 'Buy flour' && r.response[0].isdone === false);

	r = await api('tasks_save', { id: id, name: 'Buy flour and sugar', note: '' });
	check('save with an id updates the task', r.response.success === true && r.response.value === id);

	r = await api('tasks_read/' + id);
	check('the task has the new values', r.response.name === 'Buy flour and sugar' && r.response.note === '' && !!r.response.dtupdated);

	await api('tasks_done/' + id);
	r = await api('tasks_read/' + id);
	check('done marks the task', r.response.isdone === true);

	await api('tasks_done/' + id);
	r = await api('tasks_read/' + id);
	check('done again takes the mark away', r.response.isdone === false);

	r = await api('tasks_remove/' + id);
	check('remove answers with the id', r.response.success === true && r.response.value === id);

	r = await api('tasks_read/' + id);
	check('a removed task is not found', r.status === 404);

	next();
});

Test.push('notes', async function(next) {

	var r = await api('notes_create', {});
	check('a note without text is not created', r.status === 400);

	r = await api('notes_create', { body: 'Call the supplier on Monday' });
	var id = r.response.value;
	check('create answers with the id of the note', r.response.success === true && typeof(id) === 'string' && id.length > 0);

	r = await api('notes');
	check('the note is in the list', r.response.length === 1 && r.response[0].body === 'Call the supplier on Monday');

	r = await api('notes_remove/' + id);
	check('remove answers with the id', r.response.success === true && r.response.value === id);

	r = await api('notes_remove/' + id);
	check('a note that does not exist is not removed', r.status === 404);

	app.kill();
	Total.Fs.rmSync(TMP, { recursive: true, force: true });
	next();
});

Test.run();
