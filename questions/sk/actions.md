# Akcie: otázky a odpovede

## Čo je akcia?

Jedna jednotka logiky servera: názov, vstup, ktorý prijíma, kto ju smie volať, a funkcia. Definuje sa cez `NEWACTION` v súbore v `actions/`:

```js
NEWACTION('Contacts|create', {
	name: 'Create a contact',
	input: '*name:String, email:Email, phone:Phone',
	action: async function($, model) {
		model.id = UID();
		model.dtcreated = NOW;
		await DATA.insert('nosql/tbl_contact', model).promise($);
		$.success(model.id);
	}
});
```

## Ako pomenujem akciu?

`Kolekcia|sloveso`: kolekcia v množnom čísle s veľkým začiatočným písmenom, zvislá čiara a sloveso. `Tickets|list`, `Groups|create`, `Users|remove`. Medzi časťami nikdy nie je `/`.

```js
NEWACTION('Tickets|list', {
	name: 'List of tickets',
	action: function($) {
		DATA.find('nosql/tbl_ticket').callback($);
	}
});
```

## Aké slovesá používajú akcie?

| Sloveso | Čo robí |
|---|---|
| `list` | vráti kolekciu |
| `read` | vráti jeden záznam |
| `create` | vloží záznam a odpovie novým id |
| `update` | upraví jeden záznam |
| `save` | vytvorí alebo upraví podľa `id` |
| `remove` | zmaže jeden záznam |

## Kam dám akcie?

Do `actions/`, jeden súbor na kolekciu: `actions/contacts.js`. Aplikácia napísaná skôr, než Total.js 5 pridal tento priečinok, má akcie v `schemas/`, ktorý sa načíta rovnakým spôsobom: nechaj ich tam. V aplikácii s pluginmi do `plugins/<názov>/actions/`. Routy, ktoré ich volajú, idú do `controllers/` alebo do `index.js` pluginu.

## Čo je priečinok schemas/?

Priečinok akcií v aplikáciách napísaných skôr, než Total.js 5 pridal `actions/`. Total.js 5 načíta oba rovnakým spôsobom, takže `NEWACTION` v `schemas/tickets.js` funguje rovnako ako v `actions/tickets.js`. V aplikácii, ktorá má `schemas/`, píš jej akcie ďalej tam a nepresúvaj ich; nová aplikácia používa `actions/`. Názov pochádza z `NEWSCHEMA`, ktoré zoskupuje akcie a je tiež súčasťou Total.js 5.

## Je akcia súbor alebo priečinok?

V aplikácii je to súbor a ten má všetky akcie jednej kolekcie: `actions/tickets.js` má `Tickets|list`, `Tickets|read`, `Tickets|save` a `Tickets|remove`. Nie je priečinok na kolekciu ani súbor na akciu.

```js
// actions/tickets.js
NEWACTION('Tickets|list', {
	name: 'List of tickets',
	action: async function($) {
		var items = await DATA.find('nosql/tbl_ticket').promise($);
		$.callback(items);
	}
});

NEWACTION('Tickets|remove', {
	name: 'Remove a ticket',
	params: '*id:UID',
	action: async function($) {
		await DATA.remove('nosql/tbl_ticket').id($.params.id).error(404).promise($);
		$.success($.params.id);
	}
});
```

Priečinok pre každú akciu (`actions/<názov>/action.js`, s jej testom) je len rozloženie kitu samostatných akcií, čo je repozitár akcií, nie aplikácia.

## Môžem dať NEWACTION() do controllera?

Nie. `controllers/` má len routy, každú na jednom riadku, a routa ukazuje na akciu. Akcia je v `actions/`:

```js
// controllers/api.js
exports.install = function() {
	ROUTE('+API    ?    +tickets_create          --> Tickets|create');
};
```

```js
// actions/tickets.js
NEWACTION('Tickets|create', {
	name: 'Create a ticket',
	input: '*name:String',
	action: async function($, model) {
		model.id = UID();
		model.dtcreated = NOW;
		await DATA.insert('nosql/tbl_ticket', model).promise($);
		$.success(model.id);
	}
});
```

## Patrí NEWACTION() do definitions/?

Nie. `definitions/` je pre to, čo sa spustí raz pri štarte aplikácie: `AUTH`, `ON('ready')`, pomocníci vo `FUNC` a pripojenie databázy. Akcia je v `actions/` a framework ju načíta sám: nič ju nemusí registrovať.

## Aký je rozdiel medzi tickets_create a Tickets|create?

Sú to dva názvy dvoch vecí a sú vedľa seba v riadku routy:

```js
ROUTE('+API    ?    +tickets_create          --> Tickets|create');
```

`tickets_create` je endpoint: to, čo prehliadač alebo iný program pošle v `schema`, aby ju zavolal. `Tickets|create` je akcia: názov pre `NEWACTION`, s veľkým písmenom a zvislou čiarou. Akcia sa nikdy nepomenuje ako endpoint a endpoint nikdy nemá zvislú čiaru.

## Čo patrí do controllers/ a čo nie?

Routy a malé funkcie stránok, ktoré len vykreslia view. Logika nie: čítanie a zápis dát, overenie, kto to smie urobiť, a odpoveď s výsledkom sú v akcii. Controller, ktorý rastie, je znak, že jeho logika patrí do `actions/`.

## Ako deklarujem vstup akcie?

Textom v `input`: polia oddelené čiarkami, `*` pred povinným poľom a typ za `:`.

```js
input: '*name:String, email:Email, phone:Phone, isactive:Boolean, tags:[String]'
```

Telo príde zvalidované ako druhý argument funkcie: `action: function($, model)`.

## Aké typy môže mať pole?

`String`, `String(100)` s maximálnou dĺžkou, `Number`, `Boolean`, `Date`, `UID`, `Email`, `Phone`, `URL`, `Color`, `Icon` a zoznam v hranatých zátvorkách: `[String]`. Nesprávna hodnota odpovie 400 s názvom poľa.

## Ako prečítam id z adresy?

Deklaruj ho v `params` a čítaj v `$.params`:

```js
NEWACTION('Contacts|read', {
	name: 'Read a contact',
	params: '*id:UID',
	action: async function($) {
		var item = await DATA.read('nosql/tbl_contact').id($.params.id).error(404).promise($);
		$.callback(item);
	}
});
```

Routa má v adrese `{id}`: `ROUTE('+API ? -contacts_read/{id} --> Contacts|read')`.

## Ako v akcii prečítam query string?

Deklaruj ho v `query` a čítaj v `$.query`:

```js
NEWACTION('Items|list', {
	name: 'List of items',
	query: 'search:String',
	action: function($) {
		$.callback($.query.search);
	}
});
```

## Ako akcia odpovedá?

| Volanie | Použitie |
|---|---|
| `$.callback(data)` | vráti údaje: záznam, zoznam |
| `$.success()` alebo `$.success(id)` | odpoveď o úspechu, s hodnotou, ak ju pošleš |
| `$.invalid(404)` | chyba s týmto HTTP stavom |
| `$.invalid('@(Text for the user)')` | chyba validácie alebo obchodnej logiky |

Na každej ceste odpovedz raz a po skoršej odpovedi daj `return`.

## Ako odpoviem, že záznam neexistuje?

`$.invalid(404)`. Pri `DATA` to urobí `.error(404)`, keď dopyt nič nenájde:

```js
if (!item) {
	$.invalid(404);
	return;
}
```

```js
var item = await DATA.read('nosql/tbl_contact').id($.params.id).error(404).promise($);
```

## Ako odpoviem chybovou správou pre používateľa?

`$.invalid('@(text)')`. `@(...)` označuje text na preklad; text sa píše po anglicky, lebo je to kľúč:

```js
if (MAIN.monitor.sites.findItem('url', model.url)) {
	$.invalid('@(The website is already in the list)');
	return;
}
```

## Ako obmedzím akciu len pre niektorých používateľov?

Cez `permissions` alebo `user: true` v akcii. `+` v route žiada prihláseného používateľa; kontrola v akcii chráni aj volanie, ktoré neprichádza z tejto routy.

```js
NEWACTION('Redirects|save', {
	name: 'Save redirect',
	input: 'id,*url,*target,permanent:Boolean',
	permissions: 'redirects,admin',
	action: function($, model) {
		$.success();
	}
});
```

## Ako znovu použijem polia vstupu?

Pomenovanou schémou a `@`:

```js
NEWSCHEMA('@Group', '*name,color:Color,icon:Icon,reference,permissions:[String]');

NEWACTION('Groups|create', {
	name: 'Create group',
	input: '@Group',
	action: function($, model) {
		$.success();
	}
});
```

## Ako zavolám jednu akciu z druhej?

`$.action('Názov').promise()` vnútri akcie a `ACTION('Názov', model)` mimo požiadavky:

```js
var types = await $.action('Items|types').promise();
```

```js
ACTION('Sites|check').callback(ERROR('Sites|check'));
```

## Prečo je moja akcia async?

Lebo čaká na databázu. Pošli `$` do `.promise($)`: chyba dopytu potom odpovie na požiadavku sama.

```js
action: async function($) {
	var item = await DATA.read('nosql/tbl_contact').id($.params.id).error(404).promise($);
	$.callback(item);
}
```

## Potrebuje každá akcia názov?

Áno: `name` je krátky text pre ľudí ("Save redirect"). Používajú ho logy a nástroje. Prvý argument `NEWACTION` je jej identifikátor (`Redirects|save`).

## Prečo môj povinný zoznam odmietne prázdny zoznam?

Pole `*tags:[String]` je povinné a prázdny zoznam sa počíta ako chýbajúci. Ak je prázdny zoznam platný, odstráň `*`: `tags:[String]`.

## Prečo je môj Boolean false, keď pole nebolo poslané?

Chýbajúci `Boolean` je `false`. Keď má neprítomnosť znamenať „bez zmeny“, deklaruj akciu s `partial: true`.
