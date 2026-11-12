require('total5');
require('total5/test');

// Native tests of the application. They copy it to a disposable folder, start it there as it is started by hand (node index.js <port>)
// and talk in its room with real WebSocket clients. Run: node test.js

var TMP = Total.Fs.mkdtempSync(Total.Path.join(Total.Os.tmpdir(), 'chat-test-'));
var PORT = 8106;
var URL = 'http://127.0.0.1:' + PORT;

var app;

// The application does not stay running when a check fails
process.on('exit', function() {
	app && app.kill();
});

function check(message, ok) {
	Test.print(message, ok ? null : 'failed');
}

function page(url) {
	return new Promise(function(resolve) {
		RESTBuilder.GET(URL + url).exec(function(err, response, output) {
			// A page of the framework (404) comes as an error with the status in its name
			var status = output && output.status ? output.status : (err && err.items && err.items[0] ? +err.items[0].name : 0);
			resolve({ status: status, html: output && typeof(output.response) === 'string' ? output.response : '' });
		});
	});
}

Test.push('start', function(next) {

	['index.js', 'config', 'controllers', 'definitions', 'views', 'public'].forEach(function(name) {
		Total.Fs.cpSync(Total.Path.join(__dirname, name), Total.Path.join(TMP, name), { recursive: true });
	});

	// The copy finds the framework where this folder finds it
	var modules = Total.Path.dirname(Total.Path.dirname(require.resolve('total5')));
	app = Total.Child.spawn(process.execPath, ['index.js', '' + PORT, '--release'], { cwd: TMP, env: Object.assign({}, process.env, { NODE_PATH: modules }), stdio: 'ignore' });

	// The server answers before its routes are loaded: the application is ready when the home page is there
	var tries = 0;
	var wait = function() {
		page('/').then(function(r) {
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

function wait(ms) {
	return new Promise(function(resolve) {
		setTimeout(resolve, ms);
	});
}

// A person in the room: the messages that arrive are kept in `got`
function join(name) {
	return new Promise(function(resolve) {
		var ws = new WebSocket('ws://127.0.0.1:' + PORT + '/chat/' + (name ? '?name=' + encodeURIComponent(name) : ''));
		var person = { ws: ws, got: [], closed: 0 };
		ws.onmessage = function(e) {
			person.got.push(JSON.parse(e.data));
		};
		ws.onclose = function(e) {
			person.closed = e.code;
		};
		ws.onopen = function() {
			resolve(person);
		};
	});
}

// Waits until something is true, for five seconds at most
async function until(fn) {
	for (var i = 0; i < 50 && !fn(); i++)
		await wait(100);
	return fn();
}

function last(person) {
	return person.got[person.got.length - 1] || {};
}

Test.push('pages', async function(next) {

	var r = await page('/');
	check('without a name the page asks for it', r.status === 200 && r.html.indexOf('name="name"') !== -1 && r.html.indexOf('name="websocket"') === -1);

	r = await page('/?name=Anna%20M');
	check('with a name the page is the room and connects with that name', r.status === 200 && r.html.indexOf('url:/chat/?name=Anna%20M') !== -1);

	next();
});

Test.push('the room', async function(next) {

	var anna = await join('Anna');
	await wait(400);
	check('who comes in gets the history and the people of the room', anna.got.length === 2 && anna.got[0].TYPE === 'history' && anna.got[0].items.length === 0 && anna.got[1].TYPE === 'users' && anna.got[1].items.join() === 'Anna');

	var zoe = await join('Zoe');
	await wait(400);
	check('the people of the room are told when someone comes in', last(anna).TYPE === 'users' && last(anna).items.join() === 'Anna,Zoe');

	anna.ws.send(JSON.stringify({ TYPE: 'message', text: '  Hello Zoe  ' }));
	await wait(400);
	check('a message reaches the others with the name of who wrote it', last(zoe).TYPE === 'message' && last(zoe).name === 'Anna' && last(zoe).text === 'Hello Zoe' && !!last(zoe).date);
	check('and it reaches who wrote it too', last(anna).TYPE === 'message' && last(anna).text === 'Hello Zoe');

	var count = zoe.got.length;
	anna.ws.send(JSON.stringify({ TYPE: 'message', text: '   ' }));
	anna.ws.send(JSON.stringify({ TYPE: 'other', text: 'x' }));
	anna.ws.send(JSON.stringify({ TYPE: 'message', text: 'x'.repeat(600) }));
	await wait(400);
	check('an empty message and an unknown type are ignored, and a long message is cut to 500 characters', zoe.got.length === count + 1 && last(zoe).text.length === 500);

	var late = await join('Late');
	await wait(400);
	check('who comes in later gets the messages that were written before', late.got[0].TYPE === 'history' && late.got[0].items.length === 2 && late.got[0].items[0].text === 'Hello Zoe');

	zoe.ws.close();
	check('the people of the room are told when someone leaves', await until(function() {
		return last(anna).TYPE === 'users' && last(anna).items.join() === 'Anna,Late';
	}));

	var nobody = await join('');
	check('a connection without a name gets nothing and is closed', await until(function() {
		return nobody.closed === 4001;
	}) && nobody.got.length === 0);

	anna.ws.close();
	late.ws.close();
	app.kill();
	Total.Fs.rmSync(TMP, { recursive: true, force: true });
	next();
});

Test.run();
