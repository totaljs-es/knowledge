# Routy a autentifikácia: otázky a odpovede

## Kam patria routy?

Do `exports.install` v súbore v `controllers/` alebo v `index.js` pluginu. Jeden riadok na routu:

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

## Ako čítam routu API?

```js
ROUTE('+API    ?    +tickets_create    --> Tickets|create', 1024 * 10);
```

- Prvé `+` znamená „iba pre prihlásených používateľov“. Bez neho je routa verejná.
- `?` je adresa API: predvolene `/api/`.
- `+tickets_create` je názov endpointu; jeho `+` hovorí, že požiadavka má telo, a `-`, že ho nemá.
- Za `-->` ide akcia.
- Číslo je maximálna veľkosť tela v bajtoch.

## Ako klient zavolá routu API?

Cez `POST` na adresu API (`/api/`), s názvom endpointu v `schema` a telom v `data`:

```
POST /api/
x-token: change-this-token
content-type: application/json

{ "schema": "contacts_create", "data": { "name": "Anna" } }
```

Endpoint s parametrom ho nesie v názve: `"schema": "contacts_read/ID"`.

## Ako pomenujem endpoint?

Malými písmenami s `_`: `tickets_create`, `users_remove/{id}`. Pred názvom použi `-` pri čítaní a mazaní a `+` pri vytváraní a úprave. `{id}` naplní `$.params.id`.

## Ako urobím routu, ktorá vráti stránku?

Routa `GET` s funkciou, ktorá dostane `$`:

```js
exports.install = function() {
	ROUTE('GET /', home);
	ROUTE('GET /products/{id}/', product);
};

function home($) {
	$.view('index');
}
```

## Ako odpoviem JSON-om z funkcie routy?

Cez `$.json(data)`. Vo funkcii routy má `$.callback(err, value)` chybu ako prvý argument, takže to nie je volanie z akcie:

```js
ROUTE('GET /status/', function($) {
	$.json({ ok: true });
});
```

## Ako urobím verejnú routu?

Vynechaj `+` pred metódou. `ROUTE('POST /notify/', notify)` je verejná; `ROUTE('+GET /setup/', setup)` je iba pre prihlásených používateľov.

## Ako aplikácia vie, od koho je požiadavka?

Jedným `AUTH` v `definitions/auth.js`. Zavolá `$.success(user)` alebo `$.invalid()`:

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

Každá routa s `+` potom potrebuje tohto používateľa.

## Ako ochránim API tokenom?

Daj token do `config`, skontroluj hlavičku v `AUTH` a označ routy znakom `+`:

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

## Ako obmedzím nesprávne pokusy o prihlásenie?

Cez `BLOCKED($, limit)`: počíta pokusy každého klienta a vráti `true`, keď sa limit prekročí. `BLOCKED($, -1)` ich po správnom prihlásení zabudne.

```js
if (BLOCKED($, 10)) {
	$.invalid();
	return;
}
```

## Ako vyzerá objekt používateľa?

Malý objekt: `{ id, name, sa, permissions }`. `sa` označuje superadministrátora. `AUTH` ho odovzdá cez `$.success(user)` a akcie ho čítajú v `$.user`.

## Ako dám route väčší limit tela?

Veľkosťou v bajtoch ako druhým argumentom `ROUTE`:

```js
ROUTE('+API    ?    +tickets_create    --> Tickets|create', 1024 * 10);
```

Nahrávanie súborov hovorí svoju veľkosť priamo v route: `<5MB`.

## Môže akcia deklarovať vlastnú routu?

Áno: `route: '+API ?'` v `NEWACTION` zaregistruje endpoint. V novej aplikácii píš routy do `controllers/` alebo do `index.js` pluginu, aby sa všetky čítali na jednom mieste, a nedeklaruj tú istú routu dvakrát.

## Je $.ip bezpečné pre bezpečnostný limit?

Nie. `$.ip` je prvá hodnota hlavičky `X-Forwarded-For`, ktorú môže klient napísať. Pre bezpečnostný limit použi `$.req.socket.remoteAddress`, alebo hlavičke dôveruj iba za vlastnou proxy.

## Ako odpoviem 404 zo stránky?

Cez `$.fallback(404)`: je to stránka 404 frameworku, ako pri adrese bez routy.

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

## Aký je rozdiel medzi $.fallback(404) a $.invalid(404)?

`$.fallback(404)` je pre routu, ktorá zobrazuje stránku: prehliadač dostane stránku 404. `$.invalid(404)` je pre akciu: API odpovie 404.

```js
// controllers/default.js
function product($) {
	var item = MAIN.products.findItem('id', $.params.id);
	if (!item) {
		$.fallback(404);
		return;
	}
	$.view('product', item);
}
```

```js
// actions/products.js
NEWACTION('Products|read', {
	name: 'Read a product',
	params: '*id:UID',
	action: async function($) {
		var item = await DATA.read('nosql/tbl_product').id($.params.id).error(404).promise($);
		$.callback(item);
	}
});
```

## Aký je rozdiel medzi $.json() a $.callback()?

`$.json(data)` odpovedá vo funkcii routy. `$.callback(data)` odpovedá v akcii.

## Ako volá klient moje API a ako volá server inú službu?

Klient (prehliadač, iný program) pošle `POST` na `/api/` s endpointom v `schema` a dátami v `data`; na obrazovke pluginu to robí `exports.tapi('contacts_create', data, callback)`. Server volá inú službu cez `RESTBuilder`.
