# Total.js 5: what 0.0.20 adds

The stable version of `total5` on npm is `0.0.19` (`latest`). Version `0.0.20` is the beta (`npm install total5@beta`, `0.0.20-3` when this page was written). An application with `"total5": "latest"` does not have what is on this page until 0.0.20 is the stable version: use a feature of this page only in a project that depends on `total5@beta` or on `0.0.20` and later, and say so.

Every example here was run with `0.0.20-3`. The source of the list is the `changelog.txt` of the framework.

## Actions as MCP tools

`$mcp : true` in the file `config` opens the route `POST /$mcp/`. Every action with `mcp: true` is a tool there. The comment of a field is the description of the argument, and the `summary` of the action is the description of the tool.

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

- The tool is named `Items_create`: a name of a tool cannot have the pipe.
- A client lists the tools with `tools/list` and calls one with `tools/call` and the arguments `{ input: {}, query: {}, params: {} }`.
- By default every caller is accepted as an administrator. An application that other programs reach replaces `Total.mcp.auth = function($) { ... }` with its own check, as it does with `AUTH`.

## The cache of an action

`cache` keeps the answer of an action for the same request, so the action does not run again.

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

`query: true`, `params: true` and `input: true` make one entry for each different value of them; `user: true` makes one for each user and `language: true` one for each language. `expire` is how long it is kept (`'5 minutes'` by default). Two calls with `?search=a` ran the action once; a call with `?search=b` ran it again.

## Two types for the fields: `JSON` and `IP`

```js
input: '*name:String, meta:JSON, address:IP'
```

- `JSON` accepts a text that is valid JSON. The value stays a text: the action parses it with `model.meta.parseJSON()`.
- `IP` accepts an IP address.
- A wrong value answers 400 with the name of the field, as the other types do.

## An answer with its own content type

```js
ROUTE('GET /export/', function($) {
	$.content('id;name\n1;Anna\n', 'text/csv');
});
```

`$.content(value, type)` answers with that text and that `content-type`. Without a type it is `application/octet-stream`.

## The environment of an action

A caller can name the environment of a call, and the action reads it in `$.env`:

```js
var response = await ACTION('Mail|send', model).env('test').promise();
```

```js
action: function($, model) {
	if ($.env === 'test') {
		$.callback({ sent: false });
		return;
	}
	// ...
}
```

## Tests: a command and fakes

`total5 test` runs the tests of the folder `tests` of the project (or of the current folder): it loads `tests/config` when it exists, then `tests/init.js`, then every other `.js` file. `total5 test name1 name2` runs only those files. A test file only needs `Test.push()`: the command loads the framework and runs them.

```js
// tests/orders.js
Test.push('orders', async function(next) {

	// The action that sends the email is replaced: the test does not send anything
	Test.fake('Mail|send', {
		name: 'Fake',
		action: function($) {
			$.callback({ sent: 'fake' });
		}
	});

	var response = await ACTION('Orders|close').promise();
	Test.print('closing an order sends the email', response.sent === 'fake' ? null : 'failed');

	Test.restore();
	next();
});
```

`Test.fake(name, definition)` takes the definition of an action, as `NEWACTION` does, and `Test.restore()` puts the real actions back.

## Smaller additions

| Addition | What it is |
|---|---|
| `Total.FsPromises` | The module `node:fs/promises`, as `Total.Fs` is `node:fs` |
| `User` | A global class: `new User({ id: '1', name: 'Anna' })` copies the fields to the object |
| `U.validhost(host)` | `true` for a plain hostname or a canonical IP address: `example.com` and `127.0.0.1` are valid, `0x7f.0.0.1` is not |
| `U.tohost(host)` | The canonical form of a hostname (`EXAMPLE.com` is `example.com`, `bücher.de` is `xn--bcher-kva.de`), or an empty text when it is not valid |

## In the changelog and not tried here

- `QueryBuilder.autoqueryjson($, column, schema, [defsort], [maxlimit])`: `autoquery()` for the properties of a JSON column.
- `JSONSchema.toAIObject(name, [description])` and `JSONSchema.toAITool(name)`.
- `$.throw(err)` and `$.touch([url])` in actions and controllers.
- The fixes of `CRON()` with a step (`*/15`), of the mail attachments, of `AJAX()` with XML and the hardening of hostnames.

## A problem found in 0.0.20-3

`$.invalidsafe(msg, err)` in an action throws `ReferenceError: path is not defined` and the request ends in a timeout. Use `$.invalid(msg)` and log the error apart until a later version fixes it.
