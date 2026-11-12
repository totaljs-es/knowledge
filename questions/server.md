# Mail, translations, redirects, CORS, encryption, cache and threads: questions and answers

## How do I send an email?

With `MAIL`, which is in the framework: the address, the subject, a view for the body and its model. The server of the mail goes in `config`:

```
mail_smtp          : smtp.example.com
mail_smtp_options  : {"port":465,"secure":true,"user":"shop@example.com","password":"..."}
mail_from          : shop@example.com
```

```js
MAIL('anna@example.com', 'Welcome', 'mails/welcome', { name: 'Anna' }, function(err) {
	err && console.error(err);
});
```

```html
@{layout('')}
<p>Welcome, @{model.name}</p>
```

The view is `views/mails/welcome.html`. No package for mail is needed.

## How do I send an email in the language of the user?

Give the language to `MAIL` before the callback. The subject and the view are translated when their texts are in `@(...)`:

```js
MAIL('anna@example.com', '@(Welcome)', 'mails/welcome', { name: 'Anna' }, 'sk', function(err) {
	err && console.error(err);
});
```

## How do I send an email without a view?

With `HTMLMAIL`: the body is the HTML itself.

```js
HTMLMAIL('anna@example.com', 'Your order', '<b>Thanks</b>', function(err) {
	err && console.error(err);
});
```

## How do I translate the texts of an application?

Write every text for people in English inside `@(...)` and add one file per language in `resources/`. A line is the key and the translation; the key is `T` and the hash of the English text:

```html
<h1>@(Welcome)</h1>
```

```
T1bx8wg2 : Vitajte
```

```js
var key = 'T' + 'Welcome'.hash(true).toString(36);
```

That line is in `resources/sk.resource`. A text without a translation stays in English.

## How does the application know the language of a request?

With `LOCALIZE` in a definition: a function that returns the language of the request. The views are then rendered in it, and it is in `$.language`:

```js
// definitions/init.js
LOCALIZE(function($) {
	return $.query.language || '';
});
```

An empty text is the default language: the texts as they are written.

## How do I translate a text in the code?

With `TRANSLATE(language, text)`: it translates every `@(...)` of the text.

```js
var text = TRANSLATE('sk', '@(Welcome)');
```

## How do I redirect to another address?

With `$.redirect(url)`. It answers 302; `true` as the second argument answers 301, a permanent redirect:

```js
ROUTE('GET /old/', function($) {
	$.redirect('/new/');
});

ROUTE('GET /moved/', function($) {
	$.redirect('/new/', true);
});
```

## How do I make my own page for an address that does not exist?

With the route `#404`: it runs for every address without a route. Set the status, because the answer of a route is 200:

```js
ROUTE('#404', function($) {
	$.response.status = 404;
	$.view('404');
});
```

## How do I allow requests from another website (CORS)?

With `CORS` in a definition and the origin that is allowed. `CORS()` without an origin allows every website:

```js
// definitions/init.js
CORS('https://shop.example.com');
```

A request from an allowed origin gets the `access-control-allow-origin` header, the preflight `OPTIONS` request too. A request from another origin is answered with 400, and a request without the `Origin` header (a server, `curl`) is not affected. No package and no middleware.

## How do I limit the requests of one address?

With `$httpreqlimit` in `config`: how many requests one IP address can make in a minute. The ones over the limit are answered with 503 until the next minute:

```
$httpreqlimit : 200
```

`0`, the default, is no limit.

## How do I encrypt and decrypt a value?

With `ENCRYPT(value, key)` and `DECRYPT(text, key)`. The value can be an object; the result is a text for a link or a cookie:

```js
var token = ENCRYPT({ id: 'abc', expire: 123 }, 'download');
var data = DECRYPT(token, 'download');

if (!data)
	$.invalid(401);
```

`DECRYPT` returns `null` for another key and for a text that was changed. Both use the `secret` of `config`, so give the application its own.

## How do I keep a value in memory for a while?

With `CACHE`: `CACHE.set(key, value, expire)` and `CACHE.read(key)`, which gives nothing when the time is over.

```js
var rates = CACHE.read('rates');

if (!rates) {
	rates = { eur: 1, usd: 1.1 };
	CACHE.set('rates', rates, '1 minute');
}
```

It is the memory of the process: a restart empties it. For a value that must stay after a restart use `MEMORIZE`.

## How do I run heavy work without blocking the application?

In a thread. The work is a file in `workers/`, and `NEWTHREAD(name, data)` starts it:

```js
// workers/sum.js
require('total5');

var worker = NEWTHREAD();
var total = 0;

for (var i = 1; i <= worker.data.max; i++)
	total += i;

worker.postMessage({ total: total });
```

```js
ROUTE('GET /sum/', function($) {
	var worker = NEWTHREAD('sum', { max: 1000 });
	worker.on('message', function(msg) {
		worker.terminate();
		$.json(msg);
	});
});
```

Inside the worker, `NEWTHREAD()` without a name is the thread itself: `worker.data` is what the application sent.
