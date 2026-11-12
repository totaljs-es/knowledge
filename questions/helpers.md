# Helpers of texts, numbers, dates and lists, cookies, headers and middleware: questions and answers

## How do I make a slug from a text?

With `slug` of the text. It removes the accents too:

```js
var a = 'Hello World!'.slug();     // hello-world
var b = 'Čaj s mlékom'.slug();     // caj-s-mlekom
```

## How do I check that a text is an email, a URL or a phone?

With `isEmail`, `isURL` and `isPhone` of the text. In the input of an action use the types `Email`, `URL` and `Phone` instead.

```js
var ok = 'anna@example.com'.isEmail();          // true
var no = 'anna'.isEmail();                      // false
var url = 'https://www.totaljs.com'.isURL();    // true
var phone = '+421903111222'.isPhone();          // true
```

## How do I turn a text into a number, a date or an object?

With `parseInt`, `parseFloat`, `parseDate` and `parseJSON` of the text. They do not throw: a text that is not a number gives `0`, and a text that is not JSON gives `undefined`.

```js
var count = '12'.parseInt();            // 12
var zero = 'abc'.parseInt();            // 0
var price = '12.5'.parseFloat();        // 12.5
var date = '2026-11-12'.parseDate();    // a Date
var obj = '{"a":1}'.parseJSON();        // { a: 1 }
var none = 'not json'.parseJSON();      // undefined
```

## How do I shorten a text or write it with capitals?

`max(length)` cuts the text and ends it with `...`; `capitalize()` starts every word with a capital:

```js
var short = 'A long text of a product'.max(10);    // A long ...
var name = 'anna nowak'.capitalize();              // Anna Nowak
```

## How do I encode a text for HTML?

With `encode` of the text, and `decode` for the way back:

```js
var safe = '<b>x</b>'.encode();     // &lt;b&gt;x&lt;/b&gt;
var html = '&lt;b&gt;'.decode();    // <b>
```

## How do I hash a text?

`sha256()` and `md5()` of the text give the hash in hexadecimal; `sha256(salt)` mixes a secret into it. `hash()` gives a short number, good for a key and not for a password:

```js
var password = model.password.sha256(CONF.secret);
var key = 'text'.hash();    // 3556653
```

## How do I make a text for searching without accents?

With `toSearch` of the text: lowercase and without accents. Keep it in a column `search` and compare it with the same form of what the user typed.

```js
model.search = model.name.toSearch();    // 'Čučoriedka Nowák' becomes 'cucoriedka nowak'
```

## How do I format a number?

With `format(decimals)` of the number; the separators of thousands and of decimals are the next two arguments. `padLeft`, `round`, `floor` and `filesize` are numbers too:

```js
var a = (1234.5).format(2);              // 1 234.50
var b = (1234.5).format(2, ',', '.');    // 1,234.50
var c = (5).padLeft(3);                  // 005
var d = (1.005).round(2);                // 1.01
var e = (2.567).floor(2);                // 2.56
var f = (1536).filesize();               // 1.50 KB
```

## How do I write a plural with a number?

With `pluralize` of the number and four texts: for zero, one, a few and many. `#` is the number:

```js
var text = (3).pluralize('no items', '# item', '# items', '# items');    // 3 items
```

## How do I format a date?

With `format` of the date:

```js
var a = NOW.format('yyyy-MM-dd HH:mm');    // 2026-11-12 09:05
var b = NOW.format('dd.MM.yyyy');          // 12.11.2026
```

## How do I add time to a date?

With `add` of the date and a text: a number and a unit. It returns a new date and does not change the first one; a negative number goes back.

```js
var tomorrow = NOW.add('1 day');
var before = NOW.add('-2 hours');
var expire = NOW.add('1 month');
```

## How do I sort a list of objects?

With `quicksort` of the array and the name of the field; `_desc` after the name sorts it downwards, and several fields are separated with a comma:

```js
items.quicksort('name');
items.quicksort('name_desc');
items.quicksort('age_desc,name');
```

## How do I find, filter and remove items of a list?

With the functions of the array, by the name of a field and its value:

```js
var item = items.findItem('id', 'b');                 // the object, or undefined
var index = items.findIndex('id', 'b');               // its position, or -1
var adults = items.findAll('age', 30);                // every object with that value
var name = items.findValue('id', 'b', 'name', '');    // one field of the object, or the default
var rest = items.remove('id', 'a');                   // the list without it
var page = items.skip(20).take(10);
var first = items.first();
var last = items.last();
```

## How do I make a random text or an id?

`UID()` is the id of a row: short and unique. `GUID(length)` is a random text of that length, for a token:

```js
model.id = UID();
model.token = GUID(30);
```

## How do I copy an object?

With `CLONE(obj)`: a deep copy, so a change of the copy does not reach the first object.

```js
var copy = CLONE(MAIN.settings);
copy.theme.color = 'red';
```

## How do I build an address with a query string?

With `QUERIFY(url, obj)`: it encodes the values.

```js
var url = QUERIFY('/api/', { q: 'a b', page: 2 });    // /api/?q=a%20b&page=2
```

## How do I read and set a cookie?

With `$.cookie`: one argument reads it, and with a value it is set. The third argument is how long it lives and the fourth its options:

```js
ROUTE('GET /theme/', function($) {
	var theme = $.cookie('theme');
	$.cookie('theme', 'dark', '7 days', { httponly: true });
	$.plain(theme);
});
```

A cookie that does not exist is an empty text. To remove one, set it with a time in the past: `$.cookie('theme', '', '-1 day')`.

## How do I read a header of the request and set one in the answer?

The headers of the request are in `$.headers`, with their names in lowercase. The ones of the answer are in `$.response.headers`, and its status in `$.response.status`:

```js
ROUTE('GET /version/', function($) {
	var client = $.headers['x-client'];
	$.response.headers['x-version'] = '1.2.0';
	$.response.status = 201;
	$.json({ client: client });
});
```

## What does the request know about the client?

`$.ip` is its address, `$.url` the path, `$.query` the query string as an object, `$.method` the method, `$.mobile` whether it is a phone and `$.language` the language that `LOCALIZE` returned.

```js
ROUTE('GET /who/', function($) {
	$.json({ ip: $.ip, url: $.url, page: $.query.page, method: $.method, mobile: $.mobile });
});
```

## How do I run code before the routes that need it (a middleware)?

Declare it with `MIDDLEWARE` in a definition and name it in the route with `#`. It calls `next()` to go on, or it answers and the route does not run:

```js
// definitions/init.js
MIDDLEWARE('onlyjson', function($, next) {
	if (($.headers.accept || '').indexOf('application/json') === -1)
		$.invalid(400);
	else
		next();
});
```

```js
ROUTE('GET /report/ #onlyjson', function($) {
	$.json({ ok: true });
});
```

For who the user is use `AUTH`, not a middleware.

## How do I make one route for every address under a path?

With `*` at the end of the path. The parts of the address are in `$.split`:

```js
ROUTE('GET /docs/*', function($) {
	// /docs/guide/install/ gives ['docs', 'guide', 'install']
	$.json($.split);
});
```

The route answers `/docs/` too.
