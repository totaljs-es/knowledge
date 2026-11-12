# Relácie, Markdown, cache na disku, šablóny, zálohy, údržba, príkazy a audit: otázky a odpovede

## Ako prihlásim používateľov cez reláciu a cookie?

Odovzdaj `AUTH` objekt namiesto funkcie: framework si drží relácie a číta cookie a `onread` načíta používateľa relácie prvýkrát. Objekt si ulož na prihlasovanie a odhlasovanie:

```js
// definitions/auth.js
var opt = {};

opt.secret = CONF.secret;
opt.cookie = 'session';
opt.expire = '5 minutes';
opt.strict = false;

opt.onread = async function(meta, next) {
	var user = await DATA.read('nosql/tbl_user').id(meta.userid).promise();
	if (user)
		next(null, { id: user.id, name: user.name });
	else
		next(404);
};

AUTH(opt);
MAIN.session = opt;
```

`expire` je, ako dlho si framework drží reláciu v pamäti, kým ju znova načíta cez `onread`, nie ako dlho žije cookie. Routa s `+` potom potrebuje prihláseného používateľa, ktorý je v `$.user`.

## Ako prihlásim a odhlásim používateľa?

Po overení hesla nastaví `authcookie` objektu relácie cookie; `logout` odstráni reláciu aj cookie:

```js
NEWACTION('Account|login', {
	name: 'Sign in',
	input: '*email:Email, *password:String',
	action: async function($, model) {
		var user = await DATA.read('nosql/tbl_user').where('email', model.email).promise($);
		if (!user || user.password !== model.password.sha256(CONF.secret)) {
			$.invalid('@(Invalid credentials)');
			return;
		}
		MAIN.session.authcookie($, UID(), user.id, '1 month');
		$.success();
	}
});

NEWACTION('Account|logout', {
	name: 'Sign out',
	action: function($) {
		MAIN.session.logout($);
		$.success();
	}
});
```

```js
ROUTE('-POST /api/login/   --> Account|login');
ROUTE('+GET  /api/logout/  --> Account|logout');
```

Argumenty `authcookie` sú id novej relácie, id používateľa a ako dlho žije cookie.

## Ako prevediem Markdown na HTML?

Cez `markdown` textu. Bez balíčka:

```js
var html = '# Title\n\nSome **bold** text.'.markdown();
```

Výsledok je vnútri `<div class="markdown">`.

## Ako uložím pomalý výsledok do cache na disku?

Cez `FILECACHE`: id, ako dlho platí, callback, ktorý dostane hodnotu, a funkcia, ktorá ju vytvorí, keď žiadna nie je. Na rozdiel od `CACHE` ostane aj po reštarte:

```js
FILECACHE('rates', '1 hour', function(err, rates) {
	$.callback(rates);
}, function(next) {
	RESTBuilder.GET(CONF.ratesurl).callback(next);
});
```

## Ako vykreslím textovú šablónu na serveri?

Cez `TEMPLATE(text, model)`, ktorý vráti promise. Šablóna je Tangular a model je `value`:

```js
var html = await TEMPLATE('<b>{{ value.name }}</b> has {{ value.count }} items', { name: 'Anna', count: 3 });
```

## Ako zálohujem priečinok a obnovím ho?

`BACKUP(súbor, priečinok, callback)` zapíše priečinok do jedného súboru a `RESTORE(súbor, priečinok, callback)` ho zapíše späť:

```js
BACKUP(PATH.root('backup.package'), PATH.root('databases'), function(err, meta) {
	// meta.files and meta.size
});

RESTORE(PATH.root('backup.package'), PATH.root('restored'), function(err, meta) {
});
```

## Ako prepnem aplikáciu do údržby?

Cez `PAUSESERVER(názov, true)`: každá požiadavka dostane 503 až do `PAUSESERVER(názov, false)`. Názov je dôvod, aby sa dva dôvody navzájom nezrušili:

```js
PAUSESERVER('import', true);

importrows(function() {
	PAUSESERVER('import', false);
});
```

## Ako spustím príkaz systému?

Cez `SHELL(príkaz, callback)`; callback dostane chybu a výstup. Nikdy nedávaj do príkazu text od používateľa:

```js
SHELL('df -h', function(err, output) {
	console.log(output);
});
```

## Ako porovnám zoznam z formulára so zoznamom v databáze?

Cez `DIFFARR(políčko, db, formulár)`: povie, čo pridať, čo upraviť a ktoré id odstrániť.

```js
var diff = DIFFARR('id', db, model.items);

// diff.add: the items that are only in the form
// diff.upd: [{ db: item, form: item }] for the items in both
// diff.rem: the ids that are only in the database
```

## Ako stiahnem súbor z iného servera?

Cez `DOWNLOAD(url, súbor, callback)`: uloží odpoveď do súboru.

```js
DOWNLOAD(CONF.reporturl, PATH.root('report.pdf'), function(err, response) {
	if (err || response.status !== 200)
		return;
	// response.size is the size of the file
});
```

## Ako si pošlem e-mailom chybu alebo poznámku?

Cez `LOGMAIL(e-mail, predmet, text)`: jednoduchá správa bez view. Používa poštový server z `config`.

```js
LOGMAIL('admin@example.com', 'Import failed', 'The import stopped at the row 12');
```

V Total.js 5 0.0.19 mu daj text: objekt ako telo zlyhá.

## Ako zaznamenám, kto čo urobil?

Cez `$.audit(správa)` v akcii: zapíše riadok do `logs/audit.log` s používateľom, adresou klienta, URL, akciou a jej dátami.

```js
NEWACTION('Orders|remove', {
	name: 'Remove an order',
	params: '*id:UID',
	action: async function($) {
		await DATA.remove('nosql/tbl_order').id($.params.id).error(404).promise($);
		$.audit('order removed');
		$.success($.params.id);
	}
});
```
