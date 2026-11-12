# Standalone actions with tests

A kit is a repository of reusable actions that are not part of one application: one folder per action, with native tests. Pure parser tests need no network or credentials; SQL-backed actions may have explicitly configured database integration tests. An application copies the action, or loads it, and supplies the configuration.

## Layout

```
actions/<name>/
  action.js        one or more NEWACTION(), the folder is named after the provider or the topic (lower case)
  test.js          runs the actions with assertions
  config           test settings, only when needed
  init.sql         schema setup, only for SQL-backed actions
example/           the template: action.js and test.js
tools/check.js     checks structure and style, then runs test.js
```

Single files from an older layout (`actions/*.js`) stay as they are; a new action always has its folder and its test.

## Contract first

Name the action `Collection|verb` (see [actions](actions.md)) and write the contract before the code: `input`, `output`, `config` and the errors it returns. Split by responsibility:

- a `parse` action only transforms data it receives, no network;
- a `search` (or `read`, `send`, `ask`) action calls the provider and delegates the transformation to `parse` with `$.action('Shipments|parse', { data: response.body }).callback($)`.

The parser is tested with sample data, the caller with a local server. Keep small samples/setup inline; use separate fixture files only when their size or reuse justifies them. Match the existing repository rather than requiring a fixtures directory.

## action.js

```js
NEWACTION('Shipments|search', {
	name: 'Search shipments',
	summary: 'Searches shipments between two cities',
	input: '*from,*to,limit:Number',
	output: 'success:Boolean, items:[{ id:String, from:String, to:String, delay:Number }]',
	config: { url: 'https://api.example.com', token: '' },
	action: function($, model) {

		var opt = {};
		opt.method = 'GET';
		opt.url = $.config.url + '/shipments?from=' + encodeURIComponent(model.from) + '&to=' + encodeURIComponent(model.to);
		opt.headers = { Authorization: 'Bearer ' + $.config.token };
		opt.callback = function(err, response) {

			if (err || response.status !== 200) {
				$.invalid(err || response.status);
				return;
			}

			$.action('Shipments|parse', { data: response.body }).callback($);
		};

		REQUEST(opt);
	}
});

/*
	EXAMPLE:
	ACTION('Shipments|search', { from: 'Berlin', to: 'Vienna' }).config({ token: 'YOUR_TOKEN' }).callback(console.log);
*/
```

- Always give `name`, `summary`, `input` and `output`. `summary` is the description an AI client sees when the action is exposed with `mcp: true`. `output` is also a filter: only the declared keys leave the action.
- Provider options (base URL, token, limits) are in `config` and read as `$.config.<key>`. The default of a secret is an empty string or `YOUR_TOKEN`, never a real value. A caller overrides it with `.config({ ... })`. The base URL belongs in `config` because it lets a test point the action at a local server. Do not read `process.env` inside an action.
- Whatever the provider returns is not trusted: check that the keys you read exist and answer `$.invalid('@(Unknown format)')` instead of crashing. A non-2xx status is not an `err` of `REQUEST`: check `response.status`.
- Reuse other actions with `$.action(...)`: `.callback($)` passes its answer or error on; `await ... .promise($)` gives the value inside an `async` action.
- `route: true`, `user: true`, `permissions`, `timeout` and `mcp: true` only when the task asks for them. Add an `EXAMPLE:` comment at the end showing a call.

## Test

`test.js` runs the action the way an application does, with `ACTION(...)` and the Total.js test library, and asserts the result. A test that only prints is not a test.

```js
require('total5');
require('total5/test');
require('./action');

var FIXTURE = JSON.stringify({ items: [{ id: '1' }, { id: '2' }] });

function call(name, input, config) {
	return ACTION(name, input).env('test').config(config || {}).promise();
}

Test.push('Shipments|parse', async function(next) {

	var out = await call('Shipments|parse', { data: FIXTURE });
	Test.print('returns 2 items', out.items.length === 2 ? null : 'got ' + out.items.length);

	var rejected = false;
	try {
		await call('Shipments|parse', { data: '{}' });
	} catch (e) {
		rejected = true;
	}
	Test.print('rejects an unknown format', rejected ? null : 'did not fail');

	next();
});

Test.run();
```

- `Test.push(name, fn)` registers a step and `fn` calls `next()` when it ends. `Test.print(message)` records `[OK]`; `Test.print(message, error)` with a value records `[FAIL]` and the process exits with code 1. `Test.run()` runs the steps in order and ends the process.
- `.promise()` resolves with the answer and rejects with the error list, for example when a required field is missing.
- Cover for every action: a valid call, a missing required field, an empty or unknown answer of the provider and the edge cases of the data.
- Unit tests do not call the real provider. Use small inline samples or justified fixture files (trimmed, anonymized, without tokens or personal data): passed directly to a `parse` action, or served by a local `Total.Http.createServer` on port `0` and given to the caller through `.config({ url: url })`. Close the server so the test ends by itself.
- Call actions by their explicit name, not `Object.keys(Total.actions)[0]`: the order of files on disk is not a contract.
- `PATH.root(file)` is relative to the folder where `node test.js` runs: run the test from the action's folder.
- An npm dependency of the test is installed with `NPM.wait(NPMINSTALL, function() { ... })`; add one only when it is needed. A live-provider check must be explicitly identified and selected; it does not replace unit tests.

## Checker

`tools/check.js` follows the kit's execution context: new Total.js tools load `total5` and use `Total.*`; an existing plain Node tool may retain its imports (see [definitions and modules](definitions-and-modules.md)). For a folder it checks `node --check`, the `Collection|verb` name, `name`, `summary`, `input`, `output`, that every action answers, that `config` holds no real secret, the ES5 style and `require()` / `process.env` in the action, that the test asserts and uses a local URL, and then runs `test.js`. Run `node tools/check.js actions/<name>` or without arguments for every folder; it ends with the number of errors and the exit code. A passing check does not prove the real provider works: say which part was verified only against a fixture.

## SQL-backed actions and anonymous callers

Use the application's default adapter connection (`DATA.read('tbl_chat')`, for example). Do not prefix every table with `$.config.database` merely to choose a test database. The test initializes the connection; the action remains portable. See [native tests and database setup](../general/testing.md).

Do not add a user/session requirement to a public call-centre or anonymous workflow. Only construct `User` and call `.user(...)` when authentication is part of the action contract. An optional caller name is data, not an authenticated account. Keep audit columns when the schema requires them, leaving them null when no actor exists rather than inventing one.

Document the difference between an omitted optional update field, an explicit empty value and null. A truthiness guard preserves existing values for both omission and empty strings; do not describe it as allowing a clear operation. Specify the allowed values of fixed status fields and whether fields such as channel are unrestricted or enumerated.

## Scope and documentation

Copy the repository's existing example and preserve owner-supplied code. Add only the requested actions and required tests; do not duplicate responsibilities already implemented elsewhere. Tests/configuration/setup helpers are not automatically part of the files copied into an application. Keep setup instructions and test inventories next to the suite that owns them. Respect the repository's lockfile policy; do not introduce package-lock.json into a kit that excludes it.

Document purpose, contract, required setup, commands and actual limits. Omit personal names, conversation history, tool provenance and incidental environment details from deliverables. A comment should explain a necessary decision, not narrate the work.

References: the [native CMS widget tests](https://github.com/totaljs-es/cms-widgets/blob/63892ff/test.js) demonstrate direct Total.js bootstrap and suite config; Framework 5 [test.js](https://github.com/totaljs/framework5/blob/7d2d553fc774090081b4e3b1ae75a52ef06b42b8/test.js) defines the runner. SQL connection naming follows the consuming adapter and the existing DATA calls; verify its configured default before changing queries.
