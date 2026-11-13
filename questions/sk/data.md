# Údaje cez DATA: otázky a odpovede

## Kde držím záznamy novej aplikácie?

Vo vstavanej NoSQL databáze, cez `DATA`, s prefixom `nosql/` pred názvom tabuľky. Nepotrebuje server, definíciu ani závislosť:

```js
var items = await DATA.find('nosql/tbl_contact').sort('name').promise($);
```

Súbor je `databases/tbl_contact.nosql`.

## Ako vypíšem záznamy?

```js
NEWACTION('Contacts|list', {
	name: 'List of contacts',
	action: async function($) {
		var items = await DATA.find('nosql/tbl_contact').sort('name').promise($);
		$.callback(items);
	}
});
```

## Ako prečítam jeden záznam?

`DATA.read()` s `.id()`. `.error(404)` odpovie 404, keď neexistuje:

```js
var item = await DATA.read('nosql/tbl_contact').id($.params.id).error(404).promise($);
```

## Ako vložím záznam?

V akcii naplň id cez `UID()` a dátum cez `NOW`:

```js
model.id = UID();
model.dtcreated = NOW;
await DATA.insert('nosql/tbl_contact', model).promise($);
$.success(model.id);
```

## Ako upravím záznam?

```js
model.dtupdated = NOW;
await DATA.modify('nosql/tbl_contact', model).id($.params.id).error(404).promise($);
$.success($.params.id);
```

## Ako zmažem záznam?

```js
await DATA.remove('nosql/tbl_contact').id($.params.id).error(404).promise($);
$.success($.params.id);
```

## Ako vytvorím jedinečné id?

`UID()`. Je to funkcia frameworku: bez balíčka a bez `require`.

```js
model.id = UID();
```

## Ako filtrujem dopyt?

Podmienkami na builderi: `where(field, value)`, `in(field, array)`, `notin(field, array)`, `search(field, keyword)`.

```js
var items = await DATA.find('tbl_tag').fields('id,search').where('folderid', id).promise($);
```

## Ako vyberiem polia, ktoré dopyt vráti?

`.fields('a,b')`. Vymenuj ich; nečítaj všetko:

```js
var item = await DATA.read('tbl_user').fields('id,name').id(params.id).error('@(User not found)').promise($);
```

## Ako urobím zoznam so stránkovaním, triedením a filtrami z query stringu?

Cez `autoquery`: číta `?page=`, `limit`, `sort` a polia, ktoré povolíš, s predvoleným triedením a maximálnou veľkosťou stránky.

```js
NEWACTION('Groups|list', {
	name: 'List of groups',
	action: function($) {
		DATA.find('op.view_group').autoquery($.query, 'id:UID,name,color,icon,users:Number,dtcreated:Date,dtupdated:Date', 'dtcreated_desc', 100).callback($);
	}
});
```

## Ako pripojím aplikáciu k PostgreSQL?

Daj adresu databázy do `config` a napíš jednu definíciu. Total.js 5 má vlastného klienta PostgreSQL: nepridávaš žiadny balíček.

```
database : postgresql://user:password@localhost/myapp
```

```js
// definitions/db.js
DATA.init('postgresql', '', CONF.database);
```

Prázdny názov je predvolená databáza. `?pooling=5` na konci adresy drží skupinu piatich spojení.

Dopyty sú tie isté volania `DATA`, s názvom tabuľky bez prefixu: `DATA.find('tbl_contact')`.

## Ako prejdem zo vstavanej databázy na PostgreSQL?

Odstráň prefix `nosql/` z názvov tabuliek, pridaj definíciu cez `DATA.init('postgresql', '', CONF.database)` a vytvor tabuľky cez `database.sql`. Dopyty sa nemenia:

```js
// before
var items = await DATA.find('nosql/tbl_contact').sort('name').promise($);

// after
var items = await DATA.find('tbl_contact').sort('name').promise($);
```

## Čo je querybuilderpg?

Balíček, ktorý pripájal `DATA` k PostgreSQL predtým, ako mal Total.js 5 vlastného klienta. Aplikácia urobená s ním má `require('querybuilderpg').init(...)` v `definitions/db.js` a balíček v `package.json`: nechaj ju tak. Nová aplikácia používa `DATA.init('postgresql', '', CONF.database)` a nepridáva žiadny balíček.

## Ako spustím priame SQL?

`DATA.query()` s parametrami:

```js
await DATA.query('UPDATE tbl_ticket SET worked=worked+1 WHERE id=$1', [id]).promise($);
```

Uprednostni parametre (`$1`). Keď musí ísť hodnota do textu, ošetri ju cez `PG_ESCAPE(value)`. Nikdy nespájaj to, čo poslal používateľ.

## Ako po zápise odpoviem úspechom bez async?

`.callback($.done(id))` odpovie úspechom aplikácie a touto hodnotou:

```js
DATA.remove('tbl_tag').id($.params.id).error(404).callback($.done($.params.id));
```

`.callback($)` naopak odpovie priamym výsledkom dopytu.

## Ako použijem DATA mimo požiadavky?

`.promise()` bez `$`, s vlastným ošetrením chýb, alebo callback s chybou na prvom mieste:

```js
FUNC.refreshtags = async function() {
	REPO.tags = await DATA.find('tbl_tag').fields('id,search').promise();
};
```

## Ako hľadám text vo viacerých poliach?

Cez `or` a `search`:

```js
builder.or(function(b) {
	b.search('name', text);
	b.search('email', text);
});
```

## Musím nastaviť QueryBuilder pre vstavanú databázu?

Nie. QueryBuilder je v Total.js 5 už načítaný a prefix `nosql/` pošle dopyt do vstavanej databázy. Iba databázový server potrebuje jeden riadok: `DATA.init('postgresql', '', CONF.database)`.

## Ako pomenujem tabuľky a polia vo vstavanej databáze?

Ako v SQL od prvého dňa, aby aplikácia mohla neskôr prejsť na PostgreSQL: tabuľky `tbl_contact`, dátumy `dtcreated` a `dtupdated`, príznaky `isdone`, cudzí kľúč ako tabuľka plus `id` (`userid`).
