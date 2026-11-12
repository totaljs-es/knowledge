# Štýl, testy a verzie: otázky a odpovede

## Aký štýl JavaScriptu používa kód Total.js?

Najprv ES5 a funkcie frameworku pred akýmikoľvek inými: `var` a `function`, žiadne šípkové funkcie, žiadne šablónové reťazce, tabulátory, bodkočiarky a `'` pre texty.

```js
var item = items.findItem('id', id);
var text = 'Hello {0}'.format(name);
```

`const` alebo `let` iba tam, kde to kód potrebuje, ako konštanta na začiatku súboru. `async` a `await` tam, kde kód čaká na databázu.

## Ako prečítam súbor bez require('fs')?

Moduly Node.js sú v `Total`: `Total.Fs`, `Total.Path`, `Total.Crypto`, `Total.Os`, `Total.Child`. Kód aplikácie ich nenačítava cez `require()`:

```js
var text = Total.Fs.readFileSync(Total.Path.join(__dirname, 'config'), 'utf8');
```

## Ako vložím hodnoty do textu?

Metódou `format` textu, nie šablónovým reťazcom:

```js
var url = '/download/{0}.{1}'.format(item.id, item.ext);
```

## Ako nájdem položku poľa podľa poľa?

Cez `findItem`, a `findIndex` pre jej pozíciu:

```js
var item = MAIN.products.findItem('id', $.params.id);
var index = MAIN.monitor.sites.findIndex('id', $.params.id);
```

## Ako v akcii získam aktuálny dátum?

`NOW`: framework ho udržiava. Použi ho pre `dtcreated` a `dtupdated`:

```js
model.dtcreated = NOW;
```

## Ako otestujem aplikáciu?

Testovacou knižnicou frameworku, v súbore `test.js`:

```js
require('total5');
require('total5/test');

Test.push('Contract', function(next) {
	var value = '<strong>'.encode();
	Test.print('encodes HTML-like text', value === '&lt;strong&gt;' ? null : value);
	next();
});

Test.run();
```

`Test.print(label, error)` zlyhá, keď druhý argument nie je prázdny. Spusti ho cez `node test.js`.

## Ako majú testy spúšťať aplikáciu?

Skopírujú ju do dočasného priečinka a spustia ju tam cez `node index.js <port>`, takže sa údajov aplikácie nikdy nedotknú. Pred prvou kontrolou počkajú, kým aplikácia odpovie, a kontrolujú aj chyby: bez tokenu, s nesprávnym poľom, s id, ktoré neexistuje.

## Akú databázu používajú testy?

Čistú, dočasnú databázu iba pre testy, nikdy tú z aplikácie. Pred čímkoľvek, čo maže, test skontroluje názov databázy, ku ktorej je pripojený, a zastaví sa, ak to nie je tá očakávaná.

## Čo pridáva Total.js 5 0.0.20?

Akcie ako nástroje MCP (`mcp: true`), cache akcie (`cache`), typy polí `JSON` a `IP`, `$.content()`, prostredie akcie (`.env()` a `$.env`), príkaz `total5 test` a `Test.fake()`. Je to beta: niektorú z nich použi iba v projekte, ktorý závisí od `total5@beta` alebo od 0.0.20 a novšej, a povedz to.

## Ako sprístupním akciu ako nástroj MCP?

V Total.js 5 0.0.20 a novšom: `$mcp : true` v `config` otvorí routu `POST /$mcp/` a každá akcia s `mcp: true` je tam nástrojom.

```js
NEWACTION('Items|create', {
	name: 'Create an item',
	summary: 'Creates an item and returns it',
	mcp: true,
	input: '*name:String // The name of the item',
	action: function($, model) {
		$.callback({ name: model.name });
	}
});
```

Nástroj sa volá `Items_create`: názov nástroja nemôže obsahovať zvislú čiaru.

## Ako uložím odpoveď akcie do cache?

V Total.js 5 0.0.20 a novšom, cez `cache`:

```js
NEWACTION('Items|list', {
	name: 'List of items',
	query: 'search:String',
	cache: { query: true, expire: '1 minute' },
	action: function($) {
		$.callback(items);
	}
});
```

`query: true` drží jednu odpoveď pre každý odlišný query string.

## Ako odpoviem CSV alebo iným typom obsahu?

V Total.js 5 0.0.20 a novšom, cez `$.content(value, type)`:

```js
ROUTE('GET /export/', function($) {
	$.content('id;name\n1;Anna\n', 'text/csv');
});
```

## Ako v teste nahradím akciu?

V Total.js 5 0.0.20 a novšom, cez `Test.fake(name, definition)`; `Test.restore()` vráti skutočné akcie:

```js
Test.fake('Mail|send', {
	name: 'Fake',
	action: function($) {
		$.callback({ sent: 'fake' });
	}
});
```

## Kto vytvoril Total.js?

Peter Širka. Total.js je open-source framework pre Node.js; jeho web je <https://www.totaljs.com>.

## Čo urobím, keď si nie som istý, že funkcia existuje?

Povedz to a over si to v zdrojovom kóde frameworku alebo v jeho dokumentácii namiesto hádania. Vymyslená funkcia vyzerá správne a zlyhá, keď aplikácia beží.

## Je kód Total.js 5 rovnaký ako Total.js 4?

Nie. Total.js 5 (`total5`) je aktuálny framework a Total.js 4 (`total4`) je predchádzajúci. Nemiešaj ich kód: príklad pre jeden nemusí fungovať v druhom.
