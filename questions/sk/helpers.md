# Pomocníci pre texty, čísla, dátumy a zoznamy, cookies, hlavičky a middleware: otázky a odpovede

## Ako spravím slug z textu?

Cez `slug` textu. Odstráni aj diakritiku:

```js
var a = 'Hello World!'.slug();     // hello-world
var b = 'Čaj s mlékom'.slug();     // caj-s-mlekom
```

## Ako overím, že text je e-mail, URL alebo telefón?

Cez `isEmail`, `isURL` a `isPhone` textu. Vo vstupe akcie použi namiesto toho typy `Email`, `URL` a `Phone`.

```js
var ok = 'anna@example.com'.isEmail();          // true
var no = 'anna'.isEmail();                      // false
var url = 'https://www.totaljs.com'.isURL();    // true
var phone = '+421903111222'.isPhone();          // true
```

## Ako zmením text na číslo, dátum alebo objekt?

Cez `parseInt`, `parseFloat`, `parseDate` a `parseJSON` textu. Nevyhadzujú chybu: text, ktorý nie je číslo, dá `0`, a text, ktorý nie je JSON, dá `undefined`.

```js
var count = '12'.parseInt();            // 12
var zero = 'abc'.parseInt();            // 0
var price = '12.5'.parseFloat();        // 12.5
var date = '2026-11-12'.parseDate();    // a Date
var obj = '{"a":1}'.parseJSON();        // { a: 1 }
var none = 'not json'.parseJSON();      // undefined
```

## Ako skrátim text alebo ho napíšem s veľkými začiatočnými písmenami?

`max(dĺžka)` skráti text a ukončí ho `...`; `capitalize()` začne každé slovo veľkým písmenom:

```js
var short = 'A long text of a product'.max(10);    // A long ...
var name = 'anna nowak'.capitalize();              // Anna Nowak
```

## Ako zakódujem text pre HTML?

Cez `encode` textu a `decode` pre cestu späť:

```js
var safe = '<b>x</b>'.encode();     // &lt;b&gt;x&lt;/b&gt;
var html = '&lt;b&gt;'.decode();    // <b>
```

## Ako vypočítam hash textu?

`sha256()` a `md5()` textu vrátia hash v hexadecimálnom tvare; `sha256(soľ)` doň primieša tajomstvo. `hash()` vráti krátke číslo, vhodné ako kľúč, nie na heslo:

```js
var password = model.password.sha256(CONF.secret);
var key = 'text'.hash();    // 3556653
```

## Ako spravím text na vyhľadávanie bez diakritiky?

Cez `toSearch` textu: malé písmená a bez diakritiky. Ulož ho do stĺpca `search` a porovnaj s rovnakým tvarom toho, čo napísal používateľ.

```js
model.search = model.name.toSearch();    // 'Čučoriedka Nowák' becomes 'cucoriedka nowak'
```

## Ako naformátujem číslo?

Cez `format(desatinné)` čísla; oddeľovače tisícov a desatinných miest sú ďalšie dva argumenty. `padLeft`, `round`, `floor` a `filesize` sú tiež metódy čísla:

```js
var a = (1234.5).format(2);              // 1 234.50
var b = (1234.5).format(2, ',', '.');    // 1,234.50
var c = (5).padLeft(3);                  // 005
var d = (1.005).round(2);                // 1.01
var e = (2.567).floor(2);                // 2.56
var f = (1536).filesize();               // 1.50 KB
```

## Ako napíšem množné číslo s číslom?

Cez `pluralize` čísla a štyri texty: pre nulu, jeden, niekoľko a veľa. `#` je číslo:

```js
var text = (3).pluralize('no items', '# item', '# items', '# items');    // 3 items
```

## Ako naformátujem dátum?

Cez `format` dátumu:

```js
var a = NOW.format('yyyy-MM-dd HH:mm');    // 2026-11-12 09:05
var b = NOW.format('dd.MM.yyyy');          // 12.11.2026
```

## Ako pripočítam čas k dátumu?

Cez `add` dátumu a text: číslo a jednotka. Vráti nový dátum a pôvodný nemení; záporné číslo ide späť.

```js
var tomorrow = NOW.add('1 day');
var before = NOW.add('-2 hours');
var expire = NOW.add('1 month');
```

## Ako zoradím zoznam objektov?

Cez `quicksort` poľa a názov políčka; `_desc` za názvom zoradí zostupne a viac políčok sa oddelí čiarkou:

```js
items.quicksort('name');
items.quicksort('name_desc');
items.quicksort('age_desc,name');
```

## Ako nájdem, vyfiltrujem a odstránim položky zoznamu?

Cez funkcie poľa, podľa názvu políčka a jeho hodnoty:

```js
var item = items.findItem('id', 'b');                 // the object, or undefined
var index = items.findIndex('id', 'b');               // its position, or -1
var adults = items.findAll('age', 30);                // every object with that value
var name = items.findValue('id', 'b', 'name', '');    // one field of the object, or the default
var rest = items.remove('id', 'a');                   // the list without it
var page = items.skip(20).take(10);
var first = items.first();
var last = items.last();
```

## Ako spravím náhodný text alebo id?

`UID()` je id riadku: krátke a jedinečné. `GUID(dĺžka)` je náhodný text danej dĺžky, na token:

```js
model.id = UID();
model.token = GUID(30);
```

## Ako skopírujem objekt?

Cez `CLONE(obj)`: hlboká kópia, takže zmena kópie sa nedostane do pôvodného objektu.

```js
var copy = CLONE(MAIN.settings);
copy.theme.color = 'red';
```

## Ako zostavím adresu s query stringom?

Cez `QUERIFY(url, obj)`: zakóduje hodnoty.

```js
var url = QUERIFY('/api/', { q: 'a b', page: 2 });    // /api/?q=a%20b&page=2
```

## Ako prečítam a nastavím cookie?

Cez `$.cookie`: jeden argument ju prečíta a s hodnotou sa nastaví. Tretí argument je, ako dlho žije, a štvrtý jej možnosti:

```js
ROUTE('GET /theme/', function($) {
	var theme = $.cookie('theme');
	$.cookie('theme', 'dark', '7 days', { httponly: true });
	$.plain(theme);
});
```

Cookie, ktorá neexistuje, je prázdny text. Na odstránenie ju nastav s časom v minulosti: `$.cookie('theme', '', '-1 day')`.

## Ako prečítam hlavičku požiadavky a nastavím hlavičku odpovede?

Hlavičky požiadavky sú v `$.headers`, s názvami malými písmenami. Hlavičky odpovede sú v `$.response.headers` a jej status v `$.response.status`:

```js
ROUTE('GET /version/', function($) {
	var client = $.headers['x-client'];
	$.response.headers['x-version'] = '1.2.0';
	$.response.status = 201;
	$.json({ client: client });
});
```

## Čo vie požiadavka o klientovi?

`$.ip` je jeho adresa, `$.url` cesta, `$.query` query string ako objekt, `$.method` metóda, `$.mobile` či je to mobil a `$.language` jazyk, ktorý vrátil `LOCALIZE`.

```js
ROUTE('GET /who/', function($) {
	$.json({ ip: $.ip, url: $.url, page: $.query.page, method: $.method, mobile: $.mobile });
});
```

## Ako spustím kód pred routami, ktoré ho potrebujú (middleware)?

Deklaruj ho cez `MIDDLEWARE` v definícii a pomenuj ho v route cez `#`. Zavolá `next()`, aby sa pokračovalo, alebo odpovie a routa sa nespustí:

```js
// definitions/init.js
MIDDLEWARE('onlyjson', function($, next) {
	if (($.headers.accept || '').indexOf('application/json') === -1)
		$.invalid(400);
	else
		next();
});
```

```js
ROUTE('GET /report/ #onlyjson', function($) {
	$.json({ ok: true });
});
```

Na zistenie, kto je používateľ, použi `AUTH`, nie middleware.

## Ako spravím jednu routu pre všetky adresy pod cestou?

Cez `*` na konci cesty. Časti adresy sú v `$.split`:

```js
ROUTE('GET /docs/*', function($) {
	// /docs/guide/install/ gives ['docs', 'guide', 'install']
	$.json($.split);
});
```

Routa odpovie aj na `/docs/`.
