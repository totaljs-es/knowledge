# Routes and authentication: questions and answers

## Where do the routes go?

In `exports.install` of a file of `controllers/`, or of the `index.js` of a plugin. One line per route:

```js
// controllers/api.js
exports.install = function() {
	ROUTE('+API    ?    -contacts                --> Contacts|list');
	ROUTE('+API    ?    -contacts_read/{id}      --> Contacts|read');
	ROUTE('+API    ?    +contacts_create         --> Contacts|create');
	ROUTE('+API    ?    +contacts_update/{id}    --> Contacts|update');
	ROUTE('+API    ?    -contacts_remove/{id}    --> Contacts|remove');
};
```

## How do I read an API route?

```js
ROUTE('+API    ?    +tickets_create    --> Tickets|create', 1024 * 10);
```

- The first `+` is "only for logged-in users". Without it the route is public.
- `?` is the address of the API: `/api/` by default.
- `+tickets_create` is the name of the endpoint; its `+` says the request has a body, and `-` says it has none.
- After `-->` goes the action.
- The number is the maximum size of the body in bytes.

## How does a client call an API route?

With a `POST` to the address of the API (`/api/`), with the name of the endpoint in `schema` and the body in `data`:

```
POST /api/
x-token: change-this-token
content-type: application/json

{ "schema": "contacts_create", "data": { "name": "Anna" } }
```

An endpoint with a parameter carries it in the name: `"schema": "contacts_read/ID"`.

## How do I name an endpoint?

In lowercase with `_`: `tickets_create`, `users_remove/{id}`. Use `-` before the name for reads and removals, and `+` for creates and updates. `{id}` fills `$.params.id`.

## How do I make a route that returns a page?

A `GET` route with a function that receives `$`:

```js
exports.install = function() {
	ROUTE('GET /', home);
	ROUTE('GET /products/{id}/', product);
};

function home($) {
	$.view('index');
}
```

## How do I answer JSON from a route function?

With `$.json(data)`. In a route function `$.callback(err, value)` takes the error first, so it is not the call of an action:

```js
ROUTE('GET /status/', function($) {
	$.json({ ok: true });
});
```

## How do I make a public route?

Leave out the `+` before the method. `ROUTE('POST /notify/', notify)` is public; `ROUTE('+GET /setup/', setup)` is only for logged-in users.

## How does the application know who the request is from?

With one `AUTH` in `definitions/auth.js`. It calls `$.success(user)` or `$.invalid()`:

```js
const BOT = { id: 'bot', name: 'Bot', sa: true };

AUTH(function($) {
	var token = $.headers['x-token'];
	if (token && token === CONF.token)
		$.success(BOT);
	else
		$.invalid();
});
```

Every route with `+` then needs that user.

## How do I protect an API with a token?

Put the token in `config`, check the header in `AUTH` and mark the routes with `+`:

```js
AUTH(function($) {

	var token = $.headers['x-token'];

	if (!token) {
		$.invalid();
		return;
	}

	if (BLOCKED($, 10)) {
		$.invalid();
		return;
	}

	if (token === CONF.token) {
		BLOCKED($, -1);
		$.success(BOT);
	} else
		$.invalid();
});
```

## How do I limit wrong login tries?

With `BLOCKED($, limit)`: it counts the tries of each client and returns `true` once the limit is passed. `BLOCKED($, -1)` forgets them after a good login.

```js
if (BLOCKED($, 10)) {
	$.invalid();
	return;
}
```

## What does the user object look like?

A small object: `{ id, name, sa, permissions }`. `sa` marks a super administrator. `AUTH` gives it with `$.success(user)` and actions read it in `$.user`.

## How do I give a route a larger body limit?

With the size in bytes as the second argument of `ROUTE`:

```js
ROUTE('+API    ?    +tickets_create    --> Tickets|create', 1024 * 10);
```

An upload says its size in the route itself: `<5MB`.

## Can an action declare its own route?

Yes: `route: '+API ?'` in `NEWACTION` registers the endpoint. In a new application write the routes in `controllers/` or in the `index.js` of the plugin, so that all of them are read in one place, and do not declare the same route twice.

## Is $.ip safe for a security limit?

No. `$.ip` is the first value of the header `X-Forwarded-For`, which a client can write. For a security limit use `$.req.socket.remoteAddress`, or trust the header only behind your own proxy.

## How do I answer 404 from a page?

With `$.fallback(404)`: it is the page 404 of the framework, as for an address without a route.

```js
function product($) {
	var item = MAIN.products.findItem('id', $.params.id);
	if (!item) {
		$.fallback(404);
		return;
	}
	$.view('product', item);
}
```
