# Aplikácia: otázky a odpovede

## Aké priečinky má aplikácia Total.js 5?

Framework načíta každý priečinok podľa jeho názvu:

```
index.js            the official start script
config              settings, one "key : value" per line
package.json        "total5" is the dependency
controllers/        routes
definitions/        auth.js, init.js, func.js, db.js: loaded at start
schemas/            actions
modules/            integrations with other systems
plugins/<name>/     a feature with its server part and its screen
views/              layout and pages
public/             static files for the browser
```

Malé API potrebuje iba `index.js`, `config`, `package.json`, `controllers/`, `schemas/` a `definitions/`.

## Čo patrí do index.js?

Oficiálny štartovací skript Total.js 5, celý a bez zmien: `helpers/index.js` z frameworku. Jeho jadro je toto a zakomentované voľby oficiálneho súboru v ňom zostávajú:

```js
require('total5');

const options = {};

options.release = process.argv.includes('--release');
options.servicemode = process.argv.includes('--service') || process.argv.includes('--servicemode');

Total.run(options);
```

Nepíš ručne kratší a nemeň jeho štýl: je to jediný súbor, ktorý si ponecháva vlastný štýl.

## Ako spustím aplikáciu Total.js 5?

```
npm install
node index.js 8000
```

Číslo je port. Pre režim release pridaj `--release`: `node index.js 8000 --release`.

## Čo potrebuje package.json?

Iba `total5`. Framework má v sebe server, routy, šablóny, nástroj na dopyty do databázy aj testy:

```json
{
	"name": "contacts",
	"version": "1.0.0",
	"private": true,
	"dependencies": {
		"total5": "latest"
	}
}
```

## Ako sa píše súbor config?

Je to obyčajný textový súbor s názvom `config`, bez prípony, s jedným `kľúč : hodnota` na riadok. Riadok, ktorý sa začína `//`, je komentár:

```
name              : Contacts

// The requests of the API must send this value in the header "x-token"
token             : change-this-token
```

Kód číta hodnotu cez `CONF.token`. Nie je to JSON a nie je to súbor `.env`.

## Kde v kóde prečítam nastavenie?

V `CONF`, pod kľúčom zo súboru `config`:

```js
if (token === CONF.token)
	$.success(BOT);
```

Nastavenia, ktoré patria frameworku, sa začínajú `$`, napríklad `$api`. Kľúče a adresy databáz zostávajú mimo repozitára.

## Kam patria spoločné pomocné funkcie?

Do `definitions/func.js`, ako funkcie objektu `FUNC`, s názvom malými písmenami a bez oddeľovačov:

```js
// definitions/func.js
FUNC.refreshtags = async function() {
	REPO.tags = await DATA.find('tbl_tag').fields('id,search').promise();
};
```

Akcie a kontroléry volajú `FUNC.refreshtags()`.

## Kde držím stav v pamäti?

V `MAIN`, objekte aplikácie, ktorý sa naplní v súbore v `definitions/`:

```js
// definitions/db.js
MAIN.products = [
	{ id: 'bread', name: 'Sourdough bread', price: 4.5 }
];
```

`REPO` drží údaje v cache, ktoré potrebuje aj rozhranie. Nevytváraj nové globálne premenné.

## Kam patrí práca pri štarte?

Do `ON('ready', ...)` v `definitions/init.js`: spustí sa, keď aplikácia beží.

```js
// definitions/init.js
ON('ready', function() {
	COMPONENTATOR('ui', 'exec,locale,input,form,validate', true);
});
```

## Ako pomenujem súbory a priečinky?

Všetko malými písmenami, slová oddelené `-`, nikdy `_`: `search-results.html`. Statické súbory idú podľa typu do `public/`: `/img/`, `/js/`, `/css/`, `/fonts/`. Jeden plugin na jednu funkciu, pomenovaný podľa nej: `plugins/redirects`.

## Čo je modul a ako ho použijem?

Súbor v `modules/` je integrácia s iným systémom alebo samostatná služba. Framework ho načíta a jeho exporty zaregistruje v `MODS` pod názvom súboru:

```js
var data = MODS.visitors.today();
```

Modul aplikácie nenačítavaj cez `require(PATH.root('modules/...'))`. Názov s pomlčkou používa hranaté zátvorky: `MODS['knowledge-source']`.

## Má nová aplikácia používať pluginy?

Závisí to od projektu. Aplikácia, ktorá bude rásť po funkciách, sa robí s pluginmi: každá funkcia je priečinok `plugins/<názov>/` so svojimi routami, akciami a obrazovkou. Malá služba s jednou alebo dvoma kolekciami ich nepotrebuje: stačia `controllers/` a `schemas/`.

## Potrebujem Express alebo iné balíčky?

Nie. Total.js 5 nie je postavený na Expresse a nepoužíva jeho middleware. Routy, akcie, validácia, šablóny, WebSocket, nástroj na dopyty do databázy aj testy sú v `total5`. Jediný ďalší balíček, ktorý bežná aplikácia pridáva, je adaptér jej databázy, napríklad `querybuilderpg` pre PostgreSQL.

## Ktorú verziu Total.js 5 mám nainštalovať?

`"total5": "latest"` v `package.json` je stabilná verzia. Beta je `npm install total5@beta`. `npm view total5 dist-tags` povie, ktoré verzie to sú dnes. Total.js 4 (`total4`) je predchádzajúci framework a jeho kód nie je rovnaký.
