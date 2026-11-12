# E-mail, preklady, presmerovania, CORS, šifrovanie, cache a vlákna: otázky a odpovede

## Ako odošlem e-mail?

Cez `MAIL`, ktorý je vo frameworku: adresa, predmet, view pre telo a jeho model. Poštový server je v `config`:

```
mail_smtp          : smtp.example.com
mail_smtp_options  : {"port":465,"secure":true,"user":"shop@example.com","password":"..."}
mail_from          : shop@example.com
```

```js
MAIL('anna@example.com', 'Welcome', 'mails/welcome', { name: 'Anna' }, function(err) {
	err && console.error(err);
});
```

```html
@{layout('')}
<p>Welcome, @{model.name}</p>
```

View je `views/mails/welcome.html`. Na e-mail netreba žiadny balíček.

## Ako odošlem e-mail v jazyku používateľa?

Jazyk odovzdaj do `MAIL` pred callbackom. Predmet a view sa preložia, keď sú ich texty v `@(...)`:

```js
MAIL('anna@example.com', '@(Welcome)', 'mails/welcome', { name: 'Anna' }, 'sk', function(err) {
	err && console.error(err);
});
```

## Ako odošlem e-mail bez view?

Cez `HTMLMAIL`: telo je priamo HTML.

```js
HTMLMAIL('anna@example.com', 'Your order', '<b>Thanks</b>', function(err) {
	err && console.error(err);
});
```

## Ako preložím texty aplikácie?

Každý text pre ľudí napíš po anglicky v `@(...)` a pridaj jeden súbor na jazyk do `resources/`. Riadok je kľúč a preklad; kľúč je `T` a hash anglického textu:

```html
<h1>@(Welcome)</h1>
```

```
T1bx8wg2 : Vitajte
```

```js
var key = 'T' + 'Welcome'.hash(true).toString(36);
```

Ten riadok je v `resources/sk.resource`. Text bez prekladu ostane po anglicky.

## Ako aplikácia zistí jazyk požiadavky?

Cez `LOCALIZE` v definícii: funkcia, ktorá vráti jazyk požiadavky. View sa potom vykreslia v ňom a je v `$.language`:

```js
// definitions/init.js
LOCALIZE(function($) {
	return $.query.language || '';
});
```

Prázdny text je predvolený jazyk: texty tak, ako sú napísané.

## Ako preložím text v kóde?

Cez `TRANSLATE(jazyk, text)`: preloží každé `@(...)` v texte.

```js
var text = TRANSLATE('sk', '@(Welcome)');
```

## Ako presmerujem na inú adresu?

Cez `$.redirect(url)`. Odpovie 302; `true` ako druhý argument odpovie 301, trvalé presmerovanie:

```js
ROUTE('GET /old/', function($) {
	$.redirect('/new/');
});

ROUTE('GET /moved/', function($) {
	$.redirect('/new/', true);
});
```

## Ako spravím vlastnú stránku pre adresu, ktorá neexistuje?

Cez routu `#404`: spustí sa pre každú adresu bez routy. Nastav status, lebo odpoveď routy je 200:

```js
ROUTE('#404', function($) {
	$.response.status = 404;
	$.view('404');
});
```

## Ako povolím požiadavky z inej webovej stránky (CORS)?

Cez `CORS` v definícii a povolený origin. `CORS()` bez originu povolí každú stránku:

```js
// definitions/init.js
CORS('https://shop.example.com');
```

Požiadavka z povoleného originu dostane hlavičku `access-control-allow-origin`, aj predbežná požiadavka `OPTIONS`. Požiadavka z iného originu dostane 400 a požiadavky bez hlavičky `Origin` (server, `curl`) sa to netýka. Bez balíčka a bez middleware.

## Ako obmedzím požiadavky z jednej adresy?

Cez `$httpreqlimit` v `config`: koľko požiadaviek môže jedna IP adresa spraviť za minútu. Tie nad limit dostanú 503 až do ďalšej minúty:

```
$httpreqlimit : 200
```

`0`, predvolená hodnota, znamená bez limitu.

## Ako zašifrujem a dešifrujem hodnotu?

Cez `ENCRYPT(hodnota, kľúč)` a `DECRYPT(text, kľúč)`. Hodnota môže byť objekt; výsledok je text do odkazu alebo cookie:

```js
var token = ENCRYPT({ id: 'abc', expire: 123 }, 'download');
var data = DECRYPT(token, 'download');

if (!data)
	$.invalid(401);
```

`DECRYPT` vráti `null` pri inom kľúči a pri zmenenom texte. Oba používajú `secret` z `config`, takže daj aplikácii vlastný.

## Ako uložím hodnotu do pamäte na určitý čas?

Cez `CACHE`: `CACHE.set(kľúč, hodnota, expirácia)` a `CACHE.read(kľúč)`, ktoré po uplynutí času nevráti nič.

```js
var rates = CACHE.read('rates');

if (!rates) {
	rates = { eur: 1, usd: 1.1 };
	CACHE.set('rates', rates, '1 minute');
}
```

Je to pamäť procesu: reštart ju vyprázdni. Pre hodnotu, ktorá má ostať aj po reštarte, použi `MEMORIZE`.

## Ako spustím náročnú prácu bez blokovania aplikácie?

Vo vlákne. Práca je súbor vo `workers/` a `NEWTHREAD(názov, dáta)` ju spustí:

```js
// workers/sum.js
require('total5');

var worker = NEWTHREAD();
var total = 0;

for (var i = 1; i <= worker.data.max; i++)
	total += i;

worker.postMessage({ total: total });
```

```js
ROUTE('GET /sum/', function($) {
	var worker = NEWTHREAD('sum', { max: 1000 });
	worker.on('message', function(msg) {
		worker.terminate();
		$.json(msg);
	});
});
```

Vo workeri je `NEWTHREAD()` bez názvu samotné vlákno: `worker.data` je to, čo poslala aplikácia.
