# The browser: state, events, storage, requests, uploads and pages without a reload: questions and answers

## How do I read and change a value from anywhere in the browser?

With `GET(path)` and `SET(path, value)`. The path starts with the path of the plugin, and every binding of that path draws again:

```js
var count = GET('counter.count');
SET('counter.count', 10);
```

Inside the plugin use `exports.get('count')` and `exports.set('count', 10)`.

## How do I increment a number, toggle a flag or add an item to a list?

With `inc`, `toggle` and `push` of the plugin; they change the value and the screen draws again. `INC`, `TOGGLE` and `PUSH` do the same from outside, with the whole path:

```js
exports.inc('count', 1);
exports.toggle('isopen');
exports.push('items', 'new');

INC('counter.count', 5);
TOGGLE('counter.isopen');
PUSH('counter.items', 'new');
```

## How do I show or hide a part of a screen?

With a `ui-bind` and `show`: it removes the class `hidden` when the value is true.

```html
<ui-bind path="?.isopen" config="show" class="hidden">
	<div>@(Details)</div>
</ui-bind>
```

## How do I react when a value changes?

With `exports.watch` in the plugin, or `WATCH` with the whole path. The function gets the new value:

```js
exports.watch('count', function(value) {
	console.log(value);
});

WATCH('counter.count', function(value) {
	console.log(value);
});
```

## How do I send an event from one plugin to another?

`EMIT(name, a, b)` sends it and every `ON(name, ...)` hears it, in a plugin with `exports.on`:

```js
// the plugin that listens
exports.on('saved', function(id) {
	exports.refresh();
});

// the one that saved
EMIT('saved', id);
```

## How do I call a function of another plugin?

With `EXEC('plugin/function', arguments)`. The plugins are also in `PLUGINS`:

```js
EXEC('counter/add', el);
PLUGINS.counter.refresh();
```

## How do I keep a value in the browser between visits?

With `CACHE(key, value, expire)`; `CACHE(key)` reads it and gives `null` when it is not there or its time is over. It is kept in the `localStorage`:

```js
CACHE('filter', { status: 'open' }, '1 day');
var filter = CACHE('filter');
```

## How do I keep a preference of the user in the browser?

With `PREF.set(name, value, expire)`; the value is then a property of `PREF`:

```js
PREF.set('theme', 'dark', '1 month');
var theme = PREF.theme;
```

## How do I read and set a cookie in the browser?

With `COOKIES.get`, `COOKIES.set` and `COOKIES.rem`:

```js
COOKIES.set('language', 'sk', '1 day');
var language = COOKIES.get('language');
COOKIES.rem('language');
```

## How do I call a route of the server that is not an API endpoint?

With `AJAX`: the method and the address in one text, the data and a callback. The answer is parsed, and its dates are `Date` objects:

```js
AJAX('GET /api/ping/', function(response) {
	console.log(response);
});

AJAX('POST /api/echo/', { name: 'Anna' }, function(response) {
	console.log(response);
});
```

For the endpoints of the API of a plugin use `exports.tapi`.

## How do I upload a file from the browser with its progress?

With `UPLOAD`: the method and the address, a `FormData`, the callback and a function that gets the percentage:

```js
var data = new FormData();
data.append('file', input.files[0]);

UPLOAD('POST /api/upload/', data, function(response) {
	exports.refresh();
}, function(percentage) {
	exports.set('progress', percentage);
});
```

The route of the server has `@upload` and its size limit.

## How do I make pages in the browser without a reload?

With `ROUTE` of the library: an address and the function that runs for it. `REDIRECT(url)` goes to an address without a reload:

```js
ROUTE('/products/', function() {
	SET('common.page', 'products');
});

ROUTE('/products/{id}/', function(id) {
	SET('common.page', 'product');
	SET('product.id', id);
});

REDIRECT('/products/abc/');
```

`NAV.url` is the current address, `NAV.query` its query string as an object, and `NAV.back()` goes back.

## How do I share a setting between the parts of the interface?

With `ENV(name, value)`; `ENV(name)` reads it:

```js
ENV('apiurl', '/api/');
var url = ENV('apiurl');
```

## Are the helpers of texts, numbers and dates in the browser too?

Yes: the library has `format` of a text, a number and a date, `GUID`, `QUERIFY` and `NOW`, with the same results as on the server.

```js
var text = 'Hello {0}'.format('Anna');           // Hello Anna
var price = (1234.5).format(2);                  // 1 234.50
var day = NOW.format('yyyy-MM-dd');
var url = QUERIFY('/api/', { q: 'a b' });        // /api/?q=a%20b
var id = GUID(8);
```
