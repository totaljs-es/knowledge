# Sessions, Markdown, a cache on disk, templates, backups, maintenance, commands and audit: questions and answers

## How do I sign users in with a session and a cookie?

Give `AUTH` an object instead of a function: the framework keeps the sessions and reads the cookie, and `onread` loads the user of a session the first time. Keep the object to sign users in and out:

```js
// definitions/auth.js
var opt = {};

opt.secret = CONF.secret;
opt.cookie = 'session';
opt.expire = '5 minutes';
opt.strict = false;

opt.onread = async function(meta, next) {
	var user = await DATA.read('nosql/tbl_user').id(meta.userid).promise();
	if (user)
		next(null, { id: user.id, name: user.name });
	else
		next(404);
};

AUTH(opt);
MAIN.session = opt;
```

`expire` is how long the framework keeps a session in memory before it reads it again with `onread`, not how long the cookie lives. A route with `+` then needs a signed-in user, who is in `$.user`.

## How do I sign a user in and out?

After checking the password, `authcookie` of the session object sets the cookie; `logout` removes the session and the cookie:

```js
NEWACTION('Account|login', {
	name: 'Sign in',
	input: '*email:Email, *password:String',
	action: async function($, model) {
		var user = await DATA.read('nosql/tbl_user').where('email', model.email).promise($);
		if (!user || user.password !== model.password.sha256(CONF.secret)) {
			$.invalid('@(Invalid credentials)');
			return;
		}
		MAIN.session.authcookie($, UID(), user.id, '1 month');
		$.success();
	}
});

NEWACTION('Account|logout', {
	name: 'Sign out',
	action: function($) {
		MAIN.session.logout($);
		$.success();
	}
});
```

```js
ROUTE('-POST /api/login/   --> Account|login');
ROUTE('+GET  /api/logout/  --> Account|logout');
```

The arguments of `authcookie` are the id of the new session, the id of the user and how long the cookie lives.

## How do I convert Markdown to HTML?

With `markdown` of the text. No package:

```js
var html = '# Title\n\nSome **bold** text.'.markdown();
```

The result is inside a `<div class="markdown">`.

## How do I cache a slow result on disk?

With `FILECACHE`: an id, how long it is good, the callback that gets the value and the function that makes it when there is none. Unlike `CACHE`, it stays after a restart:

```js
FILECACHE('rates', '1 hour', function(err, rates) {
	$.callback(rates);
}, function(next) {
	RESTBuilder.GET(CONF.ratesurl).callback(next);
});
```

## How do I render a text template on the server?

With `TEMPLATE(text, model)`, which returns a promise. The template is Tangular and the model is `value`:

```js
var html = await TEMPLATE('<b>{{ value.name }}</b> has {{ value.count }} items', { name: 'Anna', count: 3 });
```

## How do I back up a folder and restore it?

`BACKUP(file, folder, callback)` writes the folder into one file, and `RESTORE(file, folder, callback)` writes it back:

```js
BACKUP(PATH.root('backup.package'), PATH.root('databases'), function(err, meta) {
	// meta.files and meta.size
});

RESTORE(PATH.root('backup.package'), PATH.root('restored'), function(err, meta) {
});
```

## How do I put the application in maintenance?

With `PAUSESERVER(name, true)`: every request is answered with 503 until `PAUSESERVER(name, false)`. The name is the reason, so that two reasons do not cancel each other:

```js
PAUSESERVER('import', true);

importrows(function() {
	PAUSESERVER('import', false);
});
```

## How do I run a command of the system?

With `SHELL(command, callback)`; the callback gets the error and the output. Never put text of a user in the command:

```js
SHELL('df -h', function(err, output) {
	console.log(output);
});
```

## How do I compare the list of a form with the list in the database?

With `DIFFARR(field, db, form)`: it says what to add, what to update and which ids to remove.

```js
var diff = DIFFARR('id', db, model.items);

// diff.add: the items that are only in the form
// diff.upd: [{ db: item, form: item }] for the items in both
// diff.rem: the ids that are only in the database
```

## How do I download a file from another server?

With `DOWNLOAD(url, filename, callback)`: it saves the answer to the file.

```js
DOWNLOAD(CONF.reporturl, PATH.root('report.pdf'), function(err, response) {
	if (err || response.status !== 200)
		return;
	// response.size is the size of the file
});
```

## How do I mail myself an error or a note?

With `LOGMAIL(email, subject, text)`: a plain message, without a view. It uses the mail server of `config`.

```js
LOGMAIL('admin@example.com', 'Import failed', 'The import stopped at the row 12');
```

In Total.js 5 0.0.19 give it a text: an object as the body fails.

## How do I record who did what?

With `$.audit(message)` in an action: it writes a line to `logs/audit.log` with the user, the address of the client, the URL, the action and its data.

```js
NEWACTION('Orders|remove', {
	name: 'Remove an order',
	params: '*id:UID',
	action: async function($) {
		await DATA.remove('nosql/tbl_order').id($.params.id).error(404).promise($);
		$.audit('order removed');
		$.success($.params.id);
	}
});
```
