---
question: How do I use a WebSocket?
question_es: ¿Cómo uso un WebSocket?
---

# How do I use a WebSocket?

A WebSocket is a route with the method `SOCKET`. Its function receives the socket of the route once; the events receive each connection.

```js
// controllers/default.js
exports.install = function() {
	ROUTE('SOCKET /chat/', socket);
};

function socket($) {

	$.on('open', function(client) {
		client.send({ TYPE: 'hello' });        // to this connection
	});

	$.on('message', function(client, message) {
		$.send(message);                       // to everybody
	});

	$.on('close', function(client) {
	});
}
```

Messages are objects, sent and received as JSON; give each one a `TYPE`. `client.query` is the query of the address the browser connected to, and `$.connections` has the open connections. Check what the browser sends before using it.

In the browser, with jComponent 20:

```html
<ui-component name="websocket" config="url:/chat/"></ui-component>
```

```js
ON('message', function(msg) {
	// msg is the object the server sent
});

SETTER('websocket/send', { TYPE: 'message', text: 'Hello' });
```

Do not use `socket.io` or the package `ws`. The complete application: [`apps/chat`](../apps/chat).
