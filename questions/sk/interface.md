# Rozhranie s jComponent 20: otázky a odpovede

## Čo je plugin?

Jedna funkcia aplikácie: priečinok so svojou serverovou časťou a obrazovkou, ktorý framework načíta a kostra aplikácie vloží.

```
plugins/redirects/
	index.js              server: metadata and routes
	schemas/redirects.js  actions
	public/index.html     the screen
	public/form.html      the form that opens over the screen
```

## Čo patrí do index.js pluginu?

Jeho ikona, názov, pozícia v menu, kto ho vidí, a jeho routy:

```js
exports.icon = 'ti ti-check-circle';
exports.name = '@(Tasks)';
exports.position = 1;
exports.visible = function() {
	return true;
};

exports.install = function() {
	ROUTE('+API    ?    -tasks                   --> Tasks|list');
	ROUTE('+API    ?    +tasks_save              --> Tasks|save');
	ROUTE('+API    ?    -tasks_remove/{id}       --> Tasks|remove');
};
```

## Ako napíšem obrazovku pluginu?

HTML s koreňom `<ui-plugin>` a jedným blokom `PLUGIN(function(exports) { ... })`, v `public/index.html`:

```html
<ui-plugin class="CLASS">
	<button class="exec" data-exec="?/refresh">@(Refresh)</button>
</ui-plugin>

<script>
	PLUGIN(function(exports) {

		exports.reload = function() {
			exports.refresh();
		};

		exports.refresh = function() {
			exports.tapi('tasks', function(response) {
				exports.set('items', response);
			});
		};

	});
</script>
```

`exports.reload` sa spustí pri každom otvorení obrazovky.

## Ako obrazovka zavolá server?

Cez `exports.tapi('endpoint_name', data, callback)`. Za názov pridaj `ERROR`, aby sa chybová správa ukázala používateľovi sama:

```js
exports.tapi('tasks_save ERROR', model, function(response) {
	exports.refresh();
});
```

Názov je endpoint routy: `+tasks_save`.

## Čo znamená ? v ceste?

„Tento plugin“. `?.items` sú údaje `items` pluginu a `?/create` je jeho funkcia `exports.create`:

```html
<ui-bind path="?.items" config="template"></ui-bind>
<button class="exec" data-exec="?/create">@(Create)</button>
```

## Čo je CLASS?

Slovo, ktoré sa nahradí triedou jedinečnou pre plugin. Použi ho v triede koreňa a v selektoroch štýlu, aby CSS jednej obrazovky nezasiahlo inú:

```html
<style>
	.CLASS .task { padding: 10px 0; border-bottom: 1px solid #E8E8E8; }
</style>

<ui-plugin class="CLASS">
</ui-plugin>
```

## Ako obslúžim kliknutie na tlačidlo?

Triedou `exec` a atribútom `data-exec`. Nepridávaj `onclick` ani `addEventListener`:

```html
<button class="exec" data-exec="?/create"><i class="ti ti-plus-circle"></i>@(Create)</button>
<div class="exec" data-exec="?/edit" data-id="{{ m.id }}">{{ m.name }}</div>
```

```js
exports.edit = function(el) {
	var id = ATTRD(el);
};
```

`ATTRD(el)` prečíta `data-id` prvku.

## Ako nastavím a prečítam údaje obrazovky?

`exports.set('items', value)` ich nastaví a väzby ich znovu vykreslia. `exports.model` je model pluginu:

```js
exports.tapi('tasks', function(response) {
	exports.set('items', response);
});
```

## Ako na stránke načítam knižnicu jComponent 20?

Z CDN, raz na dokument, pred komponentmi:

```html
<link href="https://cdn.componentator.com/spa.min@20.css" rel="stylesheet" />
<script src="https://cdn.componentator.com/spa.min@20.js"></script>
<script src="@{REPO.ui}"></script>
```

`@{REPO.ui}` je súbor komponentov, ktorý vytvoril `COMPONENTATOR()`.

## Ako načítam komponenty?

Cez `COMPONENTATOR()` v `definitions/init.js`: stiahne komponenty, ktoré vymenuješ, ako jeden súbor a layout ho načíta cez `@{REPO.ui}`.

```js
ON('ready', function() {
	COMPONENTATOR('ui', 'exec,errorhandler,locale,input,validate,miniform,notify,approve', true);
});
```

Vymenuj iba komponenty, ktoré aplikácia používa.

## Ako dám komponent na obrazovku?

Cez `<ui-component>`: jeho názov, cesta k jeho údajom a jeho konfigurácia.

```html
<ui-component name="input" path="?.url" config="required:1;placeholder:@(Relative URL address)">@(URL)</ui-component>
```

## Kde nájdem komponent?

V Componentatore, katalógu komponentov jComponent: <https://componentator.com>. Pred ručným písaním časti rozhrania hľadaj existujúci komponent. `input` je jediný komponent pre každé pole formulára: jeho `type` vyberá druh.

## Ako urobím formulár?

Druhý súbor, `public/form.html`, s komponentom `miniform`, jeho vstupmi, komponentom `validate`, ktorý povolí tlačidlo odoslania, a funkciou `submit`:

```html
<ui-component name="miniform" path="common.form" config="if:CLASS;title:@(Redirect);reload:?/reload;submit:?/submit;width:400" class="hidden" plugin="CLASS">
	<div class="padding">
		<ui-component name="input" path="?.url" config="required:1">@(URL)</ui-component>
	</div>
	<nav>
		<ui-component name="validate" path="?">
			<button name="submit" disabled>@(SUBMIT)</button>
			<button name="cancel">@(Cancel)</button>
		</ui-component>
	</nav>
</ui-component>
```

## Ako otvorím formulár?

Obrazovka ho načíta cez `importer`, dá mu model a zobrazí ho:

```html
<ui-component name="importer" path="common.form" config="if:formredirect;url:/~ID~/form.html"></ui-component>
```

```js
exports.create = function() {
	SET('formredirect @default', {});
	SET('*form', 'formredirect');
};
```

## Ako formulár uloží údaje a obnoví obrazovku, ktorá ho otvorila?

Jeho `submit` zavolá server, po dobrej odpovedi formulár skryje a obnoví volajúceho:

```js
PLUGIN(function(exports) {

	var caller;

	exports.reload = function() {
		caller = exports.caller;
	};

	exports.submit = function(hide) {
		var model = exports.form;
		exports.tapi('redirects_save ERROR', model, function() {
			hide();
			caller.exec('refresh');
		});
	};

});
```

## Ako si pred zmazaním vyžiadam potvrdenie?

Komponentom `approve`:

```js
SETTER('approve/show', '@(Are you sure you want to remove it?)', ':ti ti-trash: @(Remove)', function() {
	exports.tapi('redirects_remove/ ERROR', { id: id }, function() {
		exports.refresh();
	});
});
```

## Ako pomenujem pluginy, komponenty a ich funkcie?

Malými písmenami. Názvy `exports`, `self`, `config` a `cls` nechaj tak, ako sú:

```js
// good
PLUGIN('name', function(exports) { exports.dosomething = function() {}; });
```

## Ako píšem CSS aplikácie?

Jedno pravidlo na riadok, texty v `'`, bez prefixov prehliadačov (`/*auto*/` na začiatku súboru pochádza z Total.js 4, ktorý ich pridával; Total.js 5 nepridáva nič), bez LESS a bez SASS:

```css
/*auto*/

.class { key1: value; key2: value; key3: value; }
.class > div { key1: value; key2: value; }
```

Štýl jednej obrazovky ide na začiatok jej HTML, ohraničený cez `CLASS`. Spoločné veci idú do `public/css/default.css`.

## Aké farby a rozmery použijem v CSS?

CSS premenné knižnice jComponent: `var(--color)` je farba aplikácie, `var(--radius)` polomer rohov, `var(--gap)` a `var(--margin)` medzery a `var(--rgb)` farba ako tri čísla. Použi ich namiesto pevnej hodnoty, aby nová obrazovka vyzerala ako ostatné:

```css
.CLASS .task { border: 1px solid #E0E0E0; border-radius: var(--radius); padding: var(--gap); }
.CLASS .task.selected { border-color: var(--color); }
```

Layout zmení farbu celej aplikácie na jednom mieste:

```html
@{if CONF.color}<style>:root{--color:@{CONF.color};}</style>@{fi}
```

## Aké ikony použijem?

Total Icons: trieda `ti ti-name`, napríklad `ti ti-check-circle` alebo `ti ti-trash`.

```html
<i class="ti ti-plus-circle"></i>
```
