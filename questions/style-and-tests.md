# Style, tests and versions: questions and answers

## Which JavaScript style does Total.js code use?

ES5 first, and the functions of the framework before any other: `var` and `function`, no arrow functions, no template literals, tabs, semicolons and `'` for texts.

```js
var item = items.findItem('id', id);
var text = 'Hello {0}'.format(name);
```

`const` or `let` only where the code needs it, as a constant at the top of a file. `async` and `await` where the code waits for the database.

## How do I read a file without require('fs')?

The modules of Node.js are in `Total`: `Total.Fs`, `Total.Path`, `Total.Crypto`, `Total.Os`, `Total.Child`. Application code does not `require()` them:

```js
var text = Total.Fs.readFileSync(Total.Path.join(__dirname, 'config'), 'utf8');
```

## How do I put values into a text?

With `format` of the text, not with a template literal:

```js
var url = '/download/{0}.{1}'.format(item.id, item.ext);
```

## How do I find an item of an array by a field?

With `findItem`, and `findIndex` for its position:

```js
var item = MAIN.products.findItem('id', $.params.id);
var index = MAIN.monitor.sites.findIndex('id', $.params.id);
```

## How do I get the current date in an action?

`NOW`: the framework keeps it. Use it for `dtcreated` and `dtupdated`:

```js
model.dtcreated = NOW;
```

## How do I test an application?

With the test library of the framework, in a `test.js`:

```js
require('total5');
require('total5/test');

Test.push('Contract', function(next) {
	var value = '<strong>'.encode();
	Test.print('encodes HTML-like text', value === '&lt;strong&gt;' ? null : value);
	next();
});

Test.run();
```

`Test.print(label, error)` fails when the second argument is not empty. Run it with `node test.js`.

## How should the tests start the application?

They copy it to a disposable folder and start it there with `node index.js <port>`, so the data of the application is never touched. They wait until the application answers before the first check, and they check the errors too: without the token, with a wrong field, with an id that does not exist.

## Which database do the tests use?

A clean, disposable database only for tests, never the one of the application. Before anything that deletes, the test checks the name of the database it is connected to and stops if it is not the expected one.

## What does Total.js 5 0.0.20 add?

Actions as MCP tools (`mcp: true`), the cache of an action (`cache`), the field types `JSON` and `IP`, `$.content()`, the environment of an action (`.env()` and `$.env`), the command `total5 test` and `Test.fake()`. It is the beta: use one of them only in a project that depends on `total5@beta` or on 0.0.20 and later, and say so.

## How do I expose an action as an MCP tool?

In Total.js 5 0.0.20 and later: `$mcp : true` in `config` opens the route `POST /$mcp/`, and every action with `mcp: true` is a tool there.

```js
NEWACTION('Items|create', {
	name: 'Create an item',
	summary: 'Creates an item and returns it',
	mcp: true,
	input: '*name:String // The name of the item',
	action: function($, model) {
		$.callback({ name: model.name });
	}
});
```

The tool is named `Items_create`: the name of a tool cannot have the pipe.

## How do I cache the answer of an action?

In Total.js 5 0.0.20 and later, with `cache`:

```js
NEWACTION('Items|list', {
	name: 'List of items',
	query: 'search:String',
	cache: { query: true, expire: '1 minute' },
	action: function($) {
		$.callback(items);
	}
});
```

`query: true` keeps one answer for each different query string.

## How do I answer with CSV or another content type?

In Total.js 5 0.0.20 and later, with `$.content(value, type)`:

```js
ROUTE('GET /export/', function($) {
	$.content('id;name\n1;Anna\n', 'text/csv');
});
```

## How do I replace an action in a test?

In Total.js 5 0.0.20 and later, with `Test.fake(name, definition)`; `Test.restore()` puts the real actions back:

```js
Test.fake('Mail|send', {
	name: 'Fake',
	action: function($) {
		$.callback({ sent: 'fake' });
	}
});
```

## Who created Total.js?

Peter Širka. Total.js is an open-source framework for Node.js; its website is <https://www.totaljs.com>.

## What do I do when I am not sure that a function exists?

Say so and check it in the source of the framework or in its documentation instead of guessing. A function that is invented looks right and fails when the application runs.

## Is Total.js 5 code the same as Total.js 4?

No. Total.js 5 (`total5`) is the current framework and Total.js 4 (`total4`) is the previous one. Do not mix their code: an example for one may not work in the other.
