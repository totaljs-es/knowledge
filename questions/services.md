# Scheduled work, HTTP calls and WebSocket: questions and answers

## How do I run something every minute?

The framework emits `service` every minute, with the number of minutes since the start. No timer and no package:

```js
// definitions/init.js
ON('service', function(counter) {
	if (counter % 5 === 0)
		ACTION('Sites|check').callback(ERROR('Sites|check'));
});
```

`counter % 5 === 0` is every five minutes.

## How do I run something at a time of the day?

With `CRON` and the five fields of a cron line:

```js
// Every day at midnight
CRON('0 0 * * *', function() {
	MAIN.monitor.save();
});
```

A step works too: `*/5 * * * *` is every five minutes.

## Should I use setInterval for repeated work?

No. Use `ON('service', function(counter) { ... })`: one listener for the application, with the count of minutes, instead of a timer of your own.

## How do I call another HTTP service?

With `RESTBuilder`, which is in the framework:

```js
var response = await RESTBuilder.GET(CONF.serviceurl).promise($);
```

Check the status and the shape of the answer before you answer with success.

## How do I send a POST with JSON to another service?

```js
RESTBuilder.POST(CONF.serviceurl, { name: 'Anna' }).header('x-token', CONF.servicetoken).callback(function(err, response) {
	if (err)
		$.invalid('@(The service did not answer)');
	else
		$.callback(response);
});
```

## How do I read the HTTP status of a remote answer?

With `exec`, which gives the output with its status:

```js
RESTBuilder.GET(site.url).timeout(CONF.timeout).exec(function(err, response, output) {
	site.status = output && output.status ? output.status : 0;
});
```

A request that takes longer than the timeout has the status 408, and an address where nothing listens has 0.

## How do I declare a WebSocket route?

With `SOCKET` in a controller. The function receives the controller of the room:

```js
exports.install = function() {
	ROUTE('SOCKET /chat/', socket);
};

function socket($) {

	$.on('open', function(client) {
		client.send({ TYPE: 'hello' });
	});

	$.on('message', function(client, message) {
		$.send(message);
	});

	$.on('close', function(client) {
	});
}
```

## How do I send a WebSocket message to everybody or to one client?

`$.send(message)` sends it to every connection of the route, the sender too. `client.send(message)` sends it to one client. The messages are objects: the framework sends them as JSON.

## How do I go through the connections of a WebSocket route?

They are in `$.connections`:

```js
var names = [];
for (var key in $.connections) {
	var client = $.connections[key];
	client.name && names.push(client.name);
}
```

## How do I read the query string of a WebSocket connection?

In `client.query`, inside `open`:

```js
$.on('open', function(client) {
	var name = (client.query.name || '').trim().substring(0, 30);
	client.name = name;
});
```

## How do I close a WebSocket connection that is not allowed?

`client.close(code)`, a moment after `open`, when the connection is completely open:

```js
if (!name) {
	setTimeout(function(client) {
		client.close(4001);
	}, 500, client);
	return;
}
```

## How do I log an error of work that has no request?

With `ERROR('context')` as the callback: it writes the error with that name.

```js
ACTION('Sites|check').callback(ERROR('Sites|check'));
```

Use `NOOP` only for a result that you ignore on purpose.

## How do I go through a list with an asynchronous call, one after another?

With `wait` of the array:

```js
MAIN.monitor.sites.wait(function(site, next) {
	RESTBuilder.GET(site.url).exec(function(err, response, output) {
		site.status = output && output.status ? output.status : 0;
		next();
	});
}, function() {
	$.callback(MAIN.monitor.sites);
});
```

## How do I react to a change of the configuration?

With `ON('configure', ...)`. The part that changes the settings emits it with `EMIT('configure')`. Settings kept in a table are loaded with `LOADCONFIG(rows)`.
