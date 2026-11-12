---
question: How do I protect an API with a token?
question_es: ¿Cómo protejo una API con un token?
---

# How do I protect an API with a token?

One `AUTH` in `definitions/auth.js` decides who each request is. A route that starts with `+` is only for a request that `AUTH` accepted.

```js
// definitions/auth.js
const BOT = { id: 'bot', name: 'Bot', sa: true };

AUTH(function($) {

	var token = $.headers['x-token'];

	if (!token) {
		$.invalid();
		return;
	}

	// Too many wrong tokens from the same client
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

```js
ROUTE('+API    ?    -contacts    --> Contacts|list');
```

The token is a setting of the file `config` (`token : ...`), read with `CONF.token`. A request without it, or with a wrong one, is answered with 401. Inside an action the user is `$.user`.

See [`apps/contacts`](../apps/contacts) and [routes and authentication](../conventions/backend/routes-and-auth.md).
