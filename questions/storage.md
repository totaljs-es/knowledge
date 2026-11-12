# Storage and files: questions and answers

## Which storage do I choose for a new application?

By what the data is:

| The data | Use |
|---|---|
| The records of the application (contacts, tasks, orders) | `DATA` on the embedded database: `DATA.find('nosql/tbl_contact')` |
| An embedded store that will never be SQL (a log, a queue) | `NOSQL('name')` |
| A small object that is kept by itself (settings, counters) | `MEMORIZE('name')` |
| Files | `FILESTORAGE('name')` |

## How do I keep a small object between restarts without a database?

With `MEMORIZE`: the framework keeps the object in a file by itself.

```js
// definitions/db.js
MAIN.monitor = MEMORIZE('monitor', 1000);

if (!MAIN.monitor.sites)
	MAIN.monitor.sites = [];
```

The second argument is the delay of the save in milliseconds. After a change call `MAIN.monitor.save()`.

## How do I save a change of a MEMORIZE object?

Change the object and call its `save()`:

```js
MAIN.monitor.sites.push(model);
MAIN.monitor.save();
$.success(model.id);
```

## When do I use NOSQL() directly?

For an embedded store that will never be SQL: a log, a queue, a cache on disk. The records of the application go through `DATA` with the prefix `nosql/`, which reads the same file and lets the application move to PostgreSQL later.

```js
NOSQL('logs').insert({ id: UID(), message: 'Started', dtcreated: NOW });
```

## How do I receive an uploaded file?

A `POST` route with `@upload` and the maximum size, and an action that reads `$.files`:

```js
ROUTE('+POST   /upload/    @upload <5MB    --> Files|upload');
```

```js
NEWACTION('Files|upload', {
	name: 'Upload files',
	action: async function($) {

		if (!$.files.length) {
			$.invalid('@(No file was sent)');
			return;
		}

		var response = [];

		for (var i = 0; i < $.files.length; i++) {
			var meta = await $.files[i].fs('files', UID());
			response.push(meta);
		}

		$.callback(response);
	}
});
```

## Where are uploaded files kept?

In a `FILESTORAGE`. `$.files[i].fs('files', UID())` moves the uploaded file to the storage named `files` with a new id, and returns its metadata. The folder is `databases/fs-files`.

## How do I list the files of a storage?

```js
var items = await FILESTORAGE('files').browse().promise($);
```

Each item has its `id`, its name, its extension (`ext`) and its size.

## How do I send a stored file to the browser?

With a `FILE` route and the `http()` of the storage:

```js
ROUTE('FILE /download/*.*', download);

function download($) {
	var name = $.split[1];
	var opt = {};
	opt.id = name.substring(0, name.lastIndexOf('.'));
	opt.download = $.query.download === '1';
	FILESTORAGE('files').http($, opt);
}
```

## How do I remove a stored file?

```js
FILESTORAGE('files').remove($.params.id, function(err) {
	if (err)
		$.invalid(404);
	else
		$.success($.params.id);
});
```

## What happens when an upload is larger than the limit of the route?

The framework rejects the request with the status 431 and the action does not run. The limit is in the route: `@upload <5MB`.

## Should an existing application change its storage?

No. A feature keeps the model it already has: metadata in memory saved to a file, SQL through `DATA`, or a `MEMORIZE` object. Do not switch the storage during a cleanup.
