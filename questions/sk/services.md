# Plánovaná práca, HTTP volania a WebSocket: otázky a odpovede

## Ako spustím niečo každú minútu?

Framework vysiela `service` každú minútu, s počtom minút od štartu. Bez časovača a bez balíčka:

```js
// definitions/init.js
ON('service', function(counter) {
	if (counter % 5 === 0)
		ACTION('Sites|check').callback(ERROR('Sites|check'));
});
```

`counter % 5 === 0` je každých päť minút.

## Ako spustím niečo v určitom čase dňa?

Cez `CRON` a päť polí riadku cronu:

```js
// Every day at midnight
CRON('0 0 * * *', function() {
	MAIN.monitor.save();
});
```

Krok (`*/5`) funguje od Total.js 5 0.0.20; vo verzii 0.0.19 sa spúšťa každú minútu. Pre „každých N minút“ funguje `ON('service')` v oboch.

## Mám na opakovanú prácu použiť setInterval?

Nie. Použi `ON('service', function(counter) { ... })`: jeden poslucháč pre aplikáciu, s počtom minút, namiesto vlastného časovača.

## Ako zavolám inú HTTP službu?

Cez `RESTBuilder`, ktorý je vo frameworku:

```js
var response = await RESTBuilder.GET(CONF.serviceurl).promise($);
```

Pred odpoveďou o úspechu skontroluj stav a tvar odpovede.

## Ako pošlem POST s JSON-om inej službe?

```js
RESTBuilder.POST(CONF.serviceurl, { name: 'Anna' }).header('x-token', CONF.servicetoken).callback(function(err, response) {
	if (err)
		$.invalid('@(The service did not answer)');
	else
		$.callback(response);
});
```

## Ako prečítam HTTP stav vzdialenej odpovede?

Cez `exec`, ktorý dá výstup s jeho stavom:

```js
RESTBuilder.GET(site.url).timeout(CONF.timeout).exec(function(err, response, output) {
	site.status = output && output.status ? output.status : 0;
});
```

Požiadavka, ktorá trvá dlhšie než časový limit, má stav 408, a adresa, kde nič nepočúva, má 0.

## Ako deklarujem routu WebSocket?

Cez `SOCKET` v kontroléri. Funkcia dostane kontrolér miestnosti:

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

## Ako pošlem správu cez WebSocket všetkým alebo jednému klientovi?

`$.send(message)` ju pošle každému spojeniu routy, aj odosielateľovi. `client.send(message)` ju pošle jednému klientovi. Správy sú objekty: framework ich posiela ako JSON.

## Ako prejdem spojenia routy WebSocket?

Sú v `$.connections`:

```js
var names = [];
for (var key in $.connections) {
	var client = $.connections[key];
	client.name && names.push(client.name);
}
```

## Ako prečítam query string spojenia WebSocket?

V `client.query`, vnútri `open`:

```js
$.on('open', function(client) {
	var name = (client.query.name || '').trim().substring(0, 30);
	client.name = name;
});
```

## Ako zatvorím spojenie WebSocket, ktoré nie je povolené?

`client.close(code)`, chvíľu po `open`, keď je spojenie úplne otvorené:

```js
if (!name) {
	setTimeout(function(client) {
		client.close(4001);
	}, 500, client);
	return;
}
```

## Ako zalogujem chybu práce, ktorá nemá požiadavku?

Cez `ERROR('kontext')` ako callback: zapíše chybu s týmto názvom.

```js
ACTION('Sites|check').callback(ERROR('Sites|check'));
```

`NOOP` použi iba pre výsledok, ktorý ignoruješ zámerne.

## Ako prejdem zoznam s asynchrónnym volaním, jedno po druhom?

Cez `wait` na poli:

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

## Ako zareagujem na zmenu konfigurácie?

Cez `ON('configure', ...)`. Časť, ktorá mení nastavenia, ju vyšle cez `EMIT('configure')`. Nastavenia držané v tabuľke sa načítajú cez `LOADCONFIG(rows)`.
