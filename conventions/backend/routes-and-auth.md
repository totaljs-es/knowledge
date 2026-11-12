# Routes and authentication

## Where routes live

In `exports.install` of a file in `controllers/` or of a plugin's `index.js`. One line per route, aligned in columns.

```js
exports.install = function() {

	// Tickets
	ROUTE('+API    ?       -tickets                   --> Tickets|list');
	ROUTE('+API    ?       -tickets_detail/{id}       --> Tickets|read');
	ROUTE('+API    ?       +tickets_create            --> Tickets|create', 1024 * 10);
	ROUTE('+API    ?       +tickets_update/{id}       --> Tickets|update', 1024 * 10);
	ROUTE('+API    ?       -tickets_remove/{id}       --> Tickets|remove');

};
```

Group the lines with a short comment per collection.

## Reading an API route

```
ROUTE('+API    ?    +tickets_create    --> Tickets|create', 1024 * 10);
        |      |     |                     |                |
        |      |     |                     |                max body size in bytes
        |      |     |                     the action
        |      |     "+" the request has a body (input), "-" it has none
        |      the URL of the endpoint; "?" is replaced by CONF.$api ("/api/" by default)
        "+" only for logged-in users; without it the route is public
```

- Endpoint names are lowercase with `_`: `tickets_create`, `users_remove/{id}`. `{id}` fills `$.params.id`.
- Use `-` for reads and removals, `+` for creates and updates.
- A plugin may bind the endpoint to its own base: `ROUTE('+API /setup/ -users --> Users|list')`.
- Without a size, the default body limit applies. Give a limit to routes that take larger bodies.

## Other routes

```js
ROUTE('+GET    /setup/', setup);         // a page, only for logged-in users
ROUTE('POST    /notify/', notify);       // a public route with a handler function
ROUTE('+POST    ?/upload/    @upload <10MB    --> Files|insert');   // an upload: @upload for multipart, <10MB for the size
```

A handler function is `function($)`. Prefer an API route plus an action; use a plain handler for pages, files and webhooks.

## A route declared in the action

`NEWACTION` also accepts `route: '+API ?'` (or `route: true`) and registers the endpoint itself. It is not restricted to small apps; explicit controller or plugin routes are equally valid. Follow one registration style for the feature; do not add a duplicate explicit route for an action that already registers its own.

`route: true` builds an API route, adding authentication when `user` or `permissions` requires it. An explicit route string controls its own prefix; inspect it rather than assuming all `route:` forms imply authentication. Automatic endpoint names come from action IDs. Preserve their spelling in `tapi()` calls.

## Authentication

One `AUTH` in `definitions/auth.js`. It decides who the request is and calls `$.success(user)` or `$.invalid()`.

```js
AUTH(function($) {
	var token = $.headers['x-token'];
	if (token) {
		if (BLOCKED($, 10)) {      // too many wrong tries from this client
			$.invalid();
			return;
		}
		if (token === CONF.token) {
			BLOCKED($, -1);        // forget the failures
			$.success(BOT);
		} else
			$.invalid();
	} else
		$.invalid();
});
```

- The user object is small: `{ id, name, sa, permissions }`. `sa` marks a super administrator.
- Use `BLOCKED($, limit)` to rate-limit failed logins: it counts tries per `$.ip` and returns `true` once the limit is passed (`BLOCKED($, -1)` clears the count). Because it keys on `$.ip`, it inherits the `X-Forwarded-For` caveat below.
- `+` routes require authentication; action-level checks apply when configured. Test authenticated, anonymous and insufficient-permission requests.
- `$.ip` takes the first value of `X-Forwarded-For`, which a client can forge. For security limits use `$.req.socket.remoteAddress`, or trust the header only behind your own proxy.
