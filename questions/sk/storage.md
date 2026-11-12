# Úložisko a súbory: otázky a odpovede

## Ktoré úložisko si vyberiem pre novú aplikáciu?

Podľa toho, čo sú to za údaje:

| Údaje | Použi |
|---|---|
| Záznamy aplikácie (kontakty, úlohy, objednávky) | `DATA` nad vstavanou databázou: `DATA.find('nosql/tbl_contact')` |
| Vstavané úložisko, ktoré nikdy nebude SQL (log, fronta) | `NOSQL('name')` |
| Malý objekt, ktorý sa ukladá sám (nastavenia, počítadlá) | `MEMORIZE('name')` |
| Súbory | `FILESTORAGE('name')` |

## Ako si uchovám malý objekt medzi reštartmi bez databázy?

Cez `MEMORIZE`: framework objekt sám ukladá do súboru.

```js
// definitions/db.js
MAIN.monitor = MEMORIZE('monitor', 1000);

if (!MAIN.monitor.sites)
	MAIN.monitor.sites = [];
```

Druhý argument je oneskorenie uloženia v milisekundách. Po zmene zavolaj `MAIN.monitor.save()`.

## Ako uložím zmenu objektu MEMORIZE?

Zmeň objekt a zavolaj jeho `save()`:

```js
MAIN.monitor.sites.push(model);
MAIN.monitor.save();
$.success(model.id);
```

## Kedy použijem NOSQL() priamo?

Pre vstavané úložisko, ktoré nikdy nebude SQL: log, fronta, cache na disku. Záznamy aplikácie idú cez `DATA` s prefixom `nosql/`, ktorý číta ten istý súbor a umožní aplikácii neskôr prejsť na PostgreSQL.

```js
NOSQL('logs').insert({ id: UID(), message: 'Started', dtcreated: NOW });
```

## Ako prijmem nahraný súbor?

Routa `POST` s `@upload` a maximálnou veľkosťou a akcia, ktorá číta `$.files`:

```js
ROUTE('+POST   /upload/    @upload <5MB    --> Files|upload');
```

```js
NEWACTION('Files|upload', {
	name: 'Upload files',
	action: async function($) {

		if (!$.files.length) {
			$.invalid('@(No file was sent)');
			return;
		}

		var response = [];

		for (var i = 0; i < $.files.length; i++) {
			var meta = await $.files[i].fs('files', UID());
			response.push(meta);
		}

		$.callback(response);
	}
});
```

## Kde sa držia nahrané súbory?

Vo `FILESTORAGE`. `$.files[i].fs('files', UID())` presunie nahraný súbor do úložiska s názvom `files` s novým id a vráti jeho metadáta. Priečinok je `databases/fs-files`.

## Ako vypíšem súbory úložiska?

```js
var items = await FILESTORAGE('files').browse().promise($);
```

Každá položka má svoje `id`, názov, príponu (`ext`) a veľkosť.

## Ako pošlem uložený súbor do prehliadača?

Routou `FILE` a metódou `http()` úložiska:

```js
ROUTE('FILE /download/*.*', download);

function download($) {
	var name = $.split[1];
	var opt = {};
	opt.id = name.substring(0, name.lastIndexOf('.'));
	opt.download = $.query.download === '1';
	FILESTORAGE('files').http($, opt);
}
```

## Ako zmažem uložený súbor?

```js
FILESTORAGE('files').remove($.params.id, function(err) {
	if (err)
		$.invalid(404);
	else
		$.success($.params.id);
});
```

## Čo sa stane, keď je nahrávaný súbor väčší než limit routy?

Framework odmietne požiadavku so stavom 431 a akcia sa nespustí. Limit je v route: `@upload <5MB`.

## Má existujúca aplikácia zmeniť svoje úložisko?

Nie. Funkcia si ponecháva model, ktorý už má: metadáta v pamäti ukladané do súboru, SQL cez `DATA` alebo objekt `MEMORIZE`. Úložisko nemeň počas upratovania kódu.
