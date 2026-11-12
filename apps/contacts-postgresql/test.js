require('total5');
require('total5/test');

// Native tests of the application. They copy it to a disposable folder, start it there as it is started by hand (node index.js <port>)
// and call its API, with the data in PostgreSQL. Run: node test.js
//
// WARNING: the tests drop and create the table tbl_contact of this database. It must be a database only for tests, never the one of
// an application. Create it once: createdb knowledge_test
var DATABASE = 'postgresql://localhost/knowledge_test';

var TMP = Total.Fs.mkdtempSync(Total.Path.join(Total.Os.tmpdir(), 'contacts-postgresql-test-'));
var PORT = 8104;
var URL = 'http://127.0.0.1:' + PORT + '/api/';
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

Test.push('database', async function(next) {

	require('querybuilderpg').init('default', DATABASE, 1, NOOP);

	// Without PostgreSQL the tests cannot run: they say so and end with the code 3, which is not a failure and not a pass
	var name;
	try {
		name = (await DATA.query('SELECT current_database() AS name').promise())[0].name;
	} catch (e) {
		console.log('SKIPPED: PostgreSQL does not answer at ' + DATABASE + ' (' + e + ')');
		process.exit(3);
	}

	check('the database is the one for tests', name === 'knowledge_test');
	await DATA.query('DROP TABLE IF EXISTS tbl_contact').promise();
	check('the table does not exist before the first start', (await DATA.query("SELECT 1 FROM pg_tables WHERE schemaname='public' AND tablename='tbl_contact'").promise()).length === 0);

	var same = function(file) {
		return Total.Fs.readFileSync(Total.Path.join(__dirname, file), 'utf8') === Total.Fs.readFileSync(Total.Path.join(__dirname, '..', 'contacts', file), 'utf8');
	};
	check('the actions, the routes and the authorization are the same files as in apps/contacts', same('schemas/contacts.js') && same('controllers/api.js') && same('definitions/auth.js'));
	next();
});

Test.push('start', function(next) {

	// The copy has its own token and its own data
	['index.js', 'config', 'database.sql', 'controllers', 'definitions', 'schemas'].forEach(function(name) {
		Total.Fs.cpSync(Total.Path.join(__dirname, name), Total.Path.join(TMP, name), { recursive: true });
	});
	Total.Fs.appendFileSync(Total.Path.join(TMP, 'config'), '\ntoken : ' + TOKEN + '\ndatabase : ' + DATABASE + '\n');

	// The copy finds the framework where this folder finds it
	var modules = Total.Path.dirname(Total.Path.dirname(require.resolve('total5')));
	app = Total.Child.spawn(process.execPath, ['index.js', '' + PORT, '--release'], { cwd: TMP, env: Object.assign({}, process.env, { NODE_PATH: modules }), stdio: 'ignore' });

	// The server answers before its routes are loaded: the application is ready when the API refuses a request without the token
	var tries = 0;
	var wait = function() {
		api('contacts').then(function(r) {
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
	check('the first start created the table from database.sql', (await DATA.query("SELECT 1 FROM pg_tables WHERE schemaname='public' AND tablename='tbl_contact'").promise()).length === 1);
	var r = await api('contacts');
	check('a request without the token is refused', r.status === 401);
	r = await api('contacts', null, 'wrong');
	check('a request with a wrong token is refused', r.status === 401);
	r = await api('contacts', null, TOKEN);
	check('a request with the token is answered', r.status === 200 && r.response instanceof Array && r.response.length === 0);
	next();
});

Test.push('contacts', async function(next) {

	var r = await api('contacts_create', { email: 'anna@example.com' }, TOKEN);
	check('a contact without a name is not created', r.status === 400);

	r = await api('contacts_create', { name: 'Anna', email: 'not an email' }, TOKEN);
	check('a wrong email is not accepted', r.status === 400);

	r = await api('contacts_create', { name: 'Zoe', email: 'zoe@example.com' }, TOKEN);
	var zoe = r.response.value;
	check('create answers with the id of the contact', r.response.success === true && typeof(zoe) === 'string' && zoe.length > 0);

	r = await api('contacts_create', { name: 'Anna', phone: '+421900123456' }, TOKEN);
	var anna = r.response.value;

	r = await api('contacts', null, TOKEN);
	check('the list is sorted by name', r.response.length === 2 && r.response[0].name === 'Anna' && r.response[1].name === 'Zoe');

	r = await api('contacts?search=zo', null, TOKEN);
	check('the list is filtered by a part of the name', r.response.length === 1 && r.response[0].id === zoe);

	r = await api('contacts_read/' + anna, null, TOKEN);
	check('read answers with the contact', r.response.name === 'Anna' && r.response.phone === '+421900123456' && !!r.response.dtcreated);

	r = await api('contacts_update/' + anna, { name: 'Anna Nova', email: 'anna@example.com' }, TOKEN);
	check('update answers with the id', r.response.success === true && r.response.value === anna);

	r = await api('contacts_read/' + anna, null, TOKEN);
	check('the contact has the new values', r.response.name === 'Anna Nova' && r.response.email === 'anna@example.com' && !!r.response.dtupdated);

	r = await api('contacts_remove/' + zoe, null, TOKEN);
	check('remove answers with the id', r.response.success === true && r.response.value === zoe);

	r = await api('contacts_read/' + zoe, null, TOKEN);
	check('a removed contact is not found', r.status === 404);

	r = await api('contacts_update/' + zoe, { name: 'Nobody' }, TOKEN);
	check('a contact that does not exist is not updated', r.status === 404);

	r = await api('contacts_remove/' + zoe, null, TOKEN);
	check('a contact that does not exist is not removed', r.status === 404);

	app.kill();
	await DATA.query('DROP TABLE IF EXISTS tbl_contact').promise();
	Total.Fs.rmSync(TMP, { recursive: true, force: true });
	next();
});

Test.run();
