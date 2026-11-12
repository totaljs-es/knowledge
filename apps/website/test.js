require('total5');
require('total5/test');

// Native tests of the application. They copy it to a disposable folder, start it there as it is started by hand (node index.js <port>)
// and read its pages. Run: node test.js

var TMP = Total.Fs.mkdtempSync(Total.Path.join(Total.Os.tmpdir(), 'website-test-'));
var PORT = 8102;
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

Test.push('pages', async function(next) {

	var r = await page('/');
	check('the home page has the layout with the name of the config', r.html.indexOf('<title>Corner Bakery</title>') !== -1 && r.html.indexOf('class="logo">Corner Bakery</a>') !== -1);
	check('the home page has its own content inside the layout', r.html.indexOf('<h1>Fresh every morning</h1>') !== -1 && r.html.indexOf('<footer>') !== -1);
	check('the footer has the email of the config', r.html.indexOf('mailto:hello@example.com') !== -1);

	r = await page('/products/');
	check('the list has every product with its price', r.status === 200 && r.html.indexOf('Sourdough bread') !== -1 && r.html.indexOf('4.50 EUR') !== -1 && r.html.indexOf('Carrot cake') !== -1);
	check('the list links to the page of each product', r.html.indexOf('href="/products/croissant/"') !== -1);
	// The framework adds the name of the application to the title of a page
	check('the title of the list is its own, with the name of the application', r.html.indexOf('<title>Products - Corner Bakery</title>') !== -1);

	r = await page('/products/cake/');
	check('a product has its page', r.status === 200 && r.html.indexOf('<h1>Carrot cake</h1>') !== -1 && r.html.indexOf('3.20 EUR') !== -1 && r.html.indexOf('<title>Carrot cake - Corner Bakery</title>') !== -1);

	r = await page('/products/none/');
	check('a product that does not exist is a page 404', r.status === 404);

	r = await page('/nothing/');
	check('an address without a route is a page 404', r.status === 404);

	r = await page('/css/default.css');
	check('the stylesheet of public/ is served', r.status === 200);

	app.kill();
	Total.Fs.rmSync(TMP, { recursive: true, force: true });
	next();
});

Test.run();
