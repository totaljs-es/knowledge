# Trabajo programado, llamadas HTTP y WebSocket: preguntas y respuestas

## ¿Cómo ejecuto algo cada minuto?

El framework emite `service` cada minuto, con el número de minutos desde el arranque. Sin temporizador y sin paquete:

```js
// definitions/init.js
ON('service', function(counter) {
	if (counter % 5 === 0)
		ACTION('Sites|check').callback(ERROR('Sites|check'));
});
```

`counter % 5 === 0` es cada cinco minutos.

## ¿Cómo ejecuto algo a una hora del día?

Con `CRON` y los cinco campos de una línea de cron:

```js
// Every day at midnight
CRON('0 0 * * *', function() {
	MAIN.monitor.save();
});
```

En Total.js 5 0.0.19 un paso (`*/5`) se ejecuta cada minuto; está corregido en 0.0.20. Para «cada N minutos» usa `ON('service')`.

## ¿Debo usar setInterval para trabajo repetido?

No. Usa `ON('service', function(counter) { ... })`: un único oyente para la aplicación, con la cuenta de minutos, en lugar de un temporizador propio.

## ¿Cómo llamo a otro servicio HTTP?

Con `RESTBuilder`, que está en el framework:

```js
var response = await RESTBuilder.GET(CONF.serviceurl).promise($);
```

Comprueba el estado y la forma de la respuesta antes de responder con éxito.

## ¿Cómo envío un POST con JSON a otro servicio?

```js
RESTBuilder.POST(CONF.serviceurl, { name: 'Anna' }).header('x-token', CONF.servicetoken).callback(function(err, response) {
	if (err)
		$.invalid('@(The service did not answer)');
	else
		$.callback(response);
});
```

## ¿Cómo leo el estado HTTP de una respuesta remota?

Con `exec`, que entrega la salida con su estado:

```js
RESTBuilder.GET(site.url).timeout(CONF.timeout).exec(function(err, response, output) {
	site.status = output && output.status ? output.status : 0;
});
```

Una petición que tarda más que el tiempo límite tiene el estado 408, y una dirección donde nada escucha tiene 0.

## ¿Cómo declaro una ruta WebSocket?

Con `SOCKET` en un controlador. La función recibe el controlador de la sala:

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

## ¿Cómo envío un mensaje WebSocket a todos o a un cliente?

`$.send(message)` lo envía a todas las conexiones de la ruta, también al remitente. `client.send(message)` lo envía a un cliente. Los mensajes son objetos: el framework los envía como JSON.

## ¿Cómo recorro las conexiones de una ruta WebSocket?

Están en `$.connections`:

```js
var names = [];
for (var key in $.connections) {
	var client = $.connections[key];
	client.name && names.push(client.name);
}
```

## ¿Cómo leo la query string de una conexión WebSocket?

En `client.query`, dentro de `open`:

```js
$.on('open', function(client) {
	var name = (client.query.name || '').trim().substring(0, 30);
	client.name = name;
});
```

## ¿Cómo cierro una conexión WebSocket que no está permitida?

`client.close(code)`, un momento después de `open`, cuando la conexión está abierta del todo:

```js
if (!name) {
	setTimeout(function(client) {
		client.close(4001);
	}, 500, client);
	return;
}
```

## ¿Cómo registro un error de un trabajo que no tiene petición?

Con `ERROR('contexto')` como callback: escribe el error con ese nombre.

```js
ACTION('Sites|check').callback(ERROR('Sites|check'));
```

Usa `NOOP` solo para un resultado que ignoras a propósito.

## ¿Cómo recorro una lista con una llamada asíncrona, una detrás de otra?

Con `wait` del array:

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

## ¿Cómo reacciono a un cambio de la configuración?

Con `ON('configure', ...)`. La parte que cambia los ajustes lo emite con `EMIT('configure')`. Los ajustes guardados en una tabla se cargan con `LOADCONFIG(rows)`.
