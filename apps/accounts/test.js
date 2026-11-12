require('total5');
require('total5/test');

// Native tests of the application. They copy it to a disposable folder, start it there as it is started by hand (node index.js <port>)
// and call its API as two browsers would: each one keeps the cookie of its own session. Run: node test.js

var TMP = Total.Fs.mkdtempSync(Total.Path.join(Total.Os.tmpdir(), 'accounts-test-'));
var PORT = 8107;
var HOST = 'http://127.0.0.1:' + PORT;

var app;

// The application does not stay running when a check fails
process.on('exit', function() {
	app && app.kill();
});

function check(message, ok) {
	Test.print(message, ok ? null : 'failed');
}

// A browser: it keeps the cookie that the server sets and sends it back
function browser() {

	var self = {};
	self.cookie = '';

	self.api = function(schema, data) {
		return new Promise(function(resolve) {
			var builder = RESTBuilder.POST(HOST + '/api/', { schema: schema, data: data });
			self.cookie && builder.header('cookie', self.cookie);
			builder.exec(function(err, response, output) {

				var status = output && output.status ? output.status : (err && err.items && err.items[0] ? +err.items[0].name : 0);
				var cookies = output && output.headers ? output.headers['set-cookie'] : null;

				if (cookies) {
					var value = (cookies instanceof Array ? cookies[0] : cookies).split(';')[0];
					// A cookie that the server empties is a session that ended
					self.cookie = value.split('=')[1] ? value : '';
				}

				resolve({ err: err, response: response, status: status });
			});
		});
	};

	self.page = function(url) {
		return new Promise(function(resolve) {
			var builder = RESTBuilder.GET(HOST + url);
			self.cookie && builder.header('cookie', self.cookie);
			builder.exec(function(err, response, output) {
				resolve({ status: output ? output.status : 0, body: output ? (output.response || '') + '' : '' });
			});
		});
	};

	return self;
}

var admin = browser();
var anna = browser();
var nobody = browser();

Test.push('start', function(next) {

	['index.js', 'config', 'controllers', 'definitions', 'schemas', 'views', 'public'].forEach(function(name) {
		Total.Fs.cpSync(Total.Path.join(__dirname, name), Total.Path.join(TMP, name), { recursive: true });
	});

	// The copy finds the framework where this folder finds it
	var modules = Total.Path.dirname(Total.Path.dirname(require.resolve('total5')));
	app = Total.Child.spawn(process.execPath, ['index.js', '' + PORT, '--release'], { cwd: TMP, env: Object.assign({}, process.env, { NODE_PATH: modules }), stdio: 'ignore' });

	// The application is ready when the first user exists: the sign in answers
	var tries = 0;
	var wait = function() {
		admin.api('login', { email: 'admin@example.com', password: 'admin' }).then(function(r) {
			if (r.status === 200) {
				check('the application starts and has its first user', r.response.success === true && !!admin.cookie);
				next();
			} else if (tries++ < 50)
				setTimeout(wait, 200);
			else
				check('the application starts and has its first user', false);
		});
	};
	wait();
});

Test.push('without a session', async function(next) {

	var r = await nobody.api('notes');
	check('the API refuses a request without a session', r.status === 401);

	r = await nobody.api('account');
	check('and it does not say who the user is', r.status === 401);

	var page = await nobody.page('/');
	check('the address of the application shows the page to sign in', page.status === 200 && /<title>Sign in/.test(page.body));

	page = await nobody.page('/any/other/address/');
	check('and so does any other address', page.status === 200 && /<title>Sign in/.test(page.body));

	r = await nobody.api('login', { email: 'admin@example.com', password: 'wrong' });
	check('a wrong password is refused and no cookie is set', r.status === 400 && /Invalid credentials/.test(r.err + '') && !nobody.cookie);

	r = await nobody.api('login', { email: 'nobody@example.com', password: 'admin' });
	check('an email that does not exist gets the same answer', r.status === 400 && /Invalid credentials/.test(r.err + ''));

	r = await nobody.api('login', { email: 'not an email', password: 'admin' });
	check('an email that is not one is refused by the input', r.status === 400);
	next();
});

Test.push('the session', async function(next) {

	var r = await admin.api('account');
	check('the user of the session is the administrator, without its password', r.status === 200 && r.response.email === 'admin@example.com' && r.response.sa === true && r.response.password === undefined);

	var page = await admin.page('/');
	check('with a session the address shows the application', page.status === 200 && /<title>Accounts/.test(page.body) && /Admin/.test(page.body));

	r = await admin.api('login', { email: 'admin@example.com', password: 'admin' });
	check('the sign in is only for a request without a session', r.status === 401 || r.status === 404);
	next();
});

Test.push('users', async function(next) {

	var r = await admin.api('users_create', { name: 'Anna', email: 'anna@example.com', password: 'short' });
	check('a short password is not accepted', r.status === 400);

	r = await admin.api('users_create', { name: 'Anna', email: 'anna@example.com', password: 'anna-password' });
	var id = r.response.value;
	check('the administrator creates a user', r.response.success === true && typeof(id) === 'string');

	r = await admin.api('users_create', { name: 'Anna again', email: 'anna@example.com', password: 'anna-password' });
	check('the same email is not accepted twice', r.status === 400);

	r = await admin.api('users');
	check('the list has the two users and no password', r.response.length === 2 && r.response.every(u => u.password === undefined) && r.response[1].email === 'anna@example.com');

	r = await anna.api('login', { email: 'anna@example.com', password: 'anna-password' });
	check('the new user signs in', r.status === 200 && !!anna.cookie && anna.cookie !== admin.cookie);

	r = await anna.api('users');
	check('a user that is not an administrator cannot list the users', r.status === 401);

	r = await anna.api('users_create', { name: 'Eve', email: 'eve@example.com', password: 'eve-password' });
	check('or create one', r.status === 401);

	r = await admin.api('users_remove/' + (await admin.api('account')).response.id);
	check('the administrator cannot remove its own user', r.status === 400);
	next();
});

Test.push('the notes of each user', async function(next) {

	var r = await admin.api('notes_save', {});
	check('a note without text is not created', r.status === 400);

	r = await admin.api('notes_save', { body: 'A note of the administrator' });
	var mine = r.response.value;
	check('a note is created', r.response.success === true && typeof(mine) === 'string');

	r = await anna.api('notes_save', { body: 'A note of Anna' });
	var hers = r.response.value;

	r = await admin.api('notes');
	check('the administrator sees only its note', r.response.length === 1 && r.response[0].id === mine);

	r = await anna.api('notes');
	check('Anna sees only hers', r.response.length === 1 && r.response[0].id === hers && r.response[0].body === 'A note of Anna');

	r = await anna.api('notes_save', { id: mine, body: 'Changed by Anna' });
	check('Anna cannot change the note of another user: for her it does not exist', r.status === 404);

	r = await anna.api('notes_remove/' + mine);
	check('or remove it', r.status === 404);

	r = await admin.api('notes');
	check('the note of the administrator is as it was', r.response[0].body === 'A note of the administrator');

	r = await anna.api('notes_save', { id: hers, body: 'A note of Anna, changed' });
	check('Anna changes her own note', r.response.success === true);

	r = await anna.api('notes_remove/' + hers);
	check('and removes it', r.response.success === true && (await anna.api('notes')).response.length === 0);
	next();
});

Test.push('password and sign out', async function(next) {

	var r = await anna.api('account_password', { password: 'short' });
	check('a short password is not accepted', r.status === 400);

	r = await anna.api('account_password', { password: 'a-new-password' });
	check('Anna changes her password', r.response.success === true);

	r = await anna.api('logout');
	check('Anna signs out and the cookie is emptied', r.response.success === true && !anna.cookie);

	r = await anna.api('notes');
	check('without the session the API refuses her', r.status === 401);

	r = await anna.api('login', { email: 'anna@example.com', password: 'anna-password' });
	check('the old password does not work', r.status === 400);

	r = await anna.api('login', { email: 'anna@example.com', password: 'a-new-password' });
	check('the new one does', r.status === 200 && !!anna.cookie);

	r = await admin.api('account');
	check('the session of the administrator was not touched', r.status === 200 && r.response.sa === true);

	var users = (await admin.api('users')).response;
	var id = users.findItem('email', 'anna@example.com').id;
	await anna.api('notes_save', { body: 'The last note of Anna' });
	r = await admin.api('users_remove/' + id);
	check('the administrator removes a user', r.response.success === true && (await admin.api('users')).response.length === 1);
	next();
});

Test.push('stop', function(next) {
	app.kill();
	app = null;
	Total.Fs.rmSync(TMP, { recursive: true, force: true });
	next();
});

Test.run();
