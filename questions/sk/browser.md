# Prehliadač: stav, udalosti, úložisko, požiadavky, nahrávanie a stránky bez načítania: otázky a odpovede

## Ako prečítam a zmením hodnotu odkiaľkoľvek v prehliadači?

Cez `GET(cesta)` a `SET(cesta, hodnota)`. Cesta začína cestou pluginu a každý binding tej cesty sa prekreslí:

```js
var count = GET('counter.count');
SET('counter.count', 10);
```

V plugine použi `exports.get('count')` a `exports.set('count', 10)`.

## Ako zvýšim číslo, prepnem príznak alebo pridám položku do zoznamu?

Cez `inc`, `toggle` a `push` pluginu; zmenia hodnotu a obrazovka sa prekreslí. `INC`, `TOGGLE` a `PUSH` robia to isté zvonka, s celou cestou:

```js
exports.inc('count', 1);
exports.toggle('isopen');
exports.push('items', 'new');

INC('counter.count', 5);
TOGGLE('counter.isopen');
PUSH('counter.items', 'new');
```

## Ako zobrazím alebo skryjem časť obrazovky?

Cez `ui-bind` a `show`: odstráni triedu `hidden`, keď je hodnota pravdivá.

```html
<ui-bind path="?.isopen" config="show" class="hidden">
	<div>@(Details)</div>
</ui-bind>
```

## Ako zareagujem na zmenu hodnoty?

Cez `exports.watch` v plugine alebo `WATCH` s celou cestou. Funkcia dostane novú hodnotu:

```js
exports.watch('count', function(value) {
	console.log(value);
});

WATCH('counter.count', function(value) {
	console.log(value);
});
```

## Ako pošlem udalosť z jedného pluginu do druhého?

`EMIT(názov, a, b)` ju pošle a každé `ON(názov, ...)` ju zachytí, v plugine cez `exports.on`:

```js
// the plugin that listens
exports.on('saved', function(id) {
	exports.refresh();
});

// the one that saved
EMIT('saved', id);
```

## Ako zavolám funkciu iného pluginu?

Cez `EXEC('plugin/funkcia', argumenty)`. Pluginy sú aj v `PLUGINS`:

```js
EXEC('counter/add', el);
PLUGINS.counter.refresh();
```

## Ako uložím hodnotu v prehliadači medzi návštevami?

Cez `CACHE(kľúč, hodnota, expirácia)`; `CACHE(kľúč)` ju prečíta a vráti `null`, keď tam nie je alebo jej čas uplynul. Ukladá sa do `localStorage`:

```js
CACHE('filter', { status: 'open' }, '1 day');
var filter = CACHE('filter');
```

## Ako uložím preferenciu používateľa v prehliadači?

Cez `PREF.set(názov, hodnota, expirácia)`; hodnota je potom vlastnosť `PREF`:

```js
PREF.set('theme', 'dark', '1 month');
var theme = PREF.theme;
```

## Ako prečítam a nastavím cookie v prehliadači?

Cez `COOKIES.get`, `COOKIES.set` a `COOKIES.rem`:

```js
COOKIES.set('language', 'sk', '1 day');
var language = COOKIES.get('language');
COOKIES.rem('language');
```

## Ako zavolám routu servera, ktorá nie je API endpoint?

Cez `AJAX`: metóda a adresa v jednom texte, dáta a callback. Odpoveď je spracovaná a jej dátumy sú objekty `Date`:

```js
AJAX('GET /api/ping/', function(response) {
	console.log(response);
});

AJAX('POST /api/echo/', { name: 'Anna' }, function(response) {
	console.log(response);
});
```

Pre API endpointy pluginu použi `exports.tapi`.

## Ako nahrám súbor z prehliadača s priebehom?

Cez `UPLOAD`: metóda a adresa, `FormData`, callback a funkcia, ktorá dostane percentá:

```js
var data = new FormData();
data.append('file', input.files[0]);

UPLOAD('POST /api/upload/', data, function(response) {
	exports.refresh();
}, function(percentage) {
	exports.set('progress', percentage);
});
```

Routa servera má `@upload` a svoj limit veľkosti.

## Ako spravím stránky v prehliadači bez načítania?

Cez `ROUTE` knižnice: adresa a funkcia, ktorá sa pre ňu spustí. `REDIRECT(url)` prejde na adresu bez načítania:

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

`NAV.url` je aktuálna adresa, `NAV.query` jej query string ako objekt a `NAV.back()` ide späť.

## Ako zdieľam nastavenie medzi časťami rozhrania?

Cez `ENV(názov, hodnota)`; `ENV(názov)` ho prečíta:

```js
ENV('apiurl', '/api/');
var url = ENV('apiurl');
```

## Sú pomocníci pre texty, čísla a dátumy aj v prehliadači?

Áno: knižnica má `format` textu, čísla a dátumu, `GUID`, `QUERIFY` a `NOW`, s rovnakými výsledkami ako na serveri.

```js
var text = 'Hello {0}'.format('Anna');           // Hello Anna
var price = (1234.5).format(2);                  // 1 234.50
var day = NOW.format('yyyy-MM-dd');
var url = QUERIFY('/api/', { q: 'a b' });        // /api/?q=a%20b
var id = GUID(8);
```
