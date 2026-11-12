# Pohľady a stránky: otázky a odpovede

## Ako vykreslím stránku?

Routa zavolá `$.view()` s názvom súboru z `views/`:

```js
// controllers/default.js
exports.install = function() {
	ROUTE('GET /', home);
};

function home($) {
	$.view('index');
}
```

```html
<!-- views/index.html -->
@{title(CONF.name)}

<h1>@(Fresh every morning)</h1>
```

## Ako pošlem údaje do pohľadu?

Ako druhý argument `$.view()`. Pohľad ich číta ako `model`:

```js
$.view('product', item);
```

```html
@{title(model.name)}

<h1>@{model.name}</h1>
<p>@{model.description}</p>
```

## Ako urobím layout pre všetky stránky?

`views/layout.html` je layout každého pohľadu. `@{body}` je miesto, kam ide pohľad:

```html
<!DOCTYPE html>
<html>
<head>
	<meta charset="utf-8" />
	<meta name="viewport" content="width=device-width, initial-scale=1" />
	@{import('meta', 'head', 'default.css')}
</head>
<body>
	<main>
		@{body}
	</main>
</body>
</html>
```

## Ako v pohľade prejdem zoznam?

Cez `@{foreach}` a `@{end}`:

```html
<ul class="products">
@{foreach m in model}
	<li>
		<a href="/products/@{m.id}/">@{m.name}</a>
		<span>@{m.price.format(2)} EUR</span>
	</li>
@{end}
</ul>
```

## Ako v pohľade napíšem podmienku?

Cez `@{if}` a `@{fi}`:

```html
@{if model.price}
	<p class="price">@{model.price.format(2)} EUR</p>
@{fi}
```

## Ako nastavím titulok stránky?

Cez `@{title()}` na začiatku pohľadu. Layout ho vypíše cez `@{import('meta')}` a framework zaň pridá „ - “ a názov aplikácie:

```html
@{title('@(Products)')}
```

## Ako označím text na preklad?

Obaľ ho do `@(...)`, v pohľadoch, v HTML pluginov aj v správach servera. Anglický text je kľúč:

```html
<a href="/products/">@(Products)</a>
```

```js
$.invalid('@(The website is already in the list)');
```

Preklady sú v `resources/<jazyk>.resource`.

## Ako v pohľade prečítam nastavenie?

`@{CONF.name}`:

```html
<a href="/" class="logo">@{CONF.name}</a>
<a href="mailto:@{CONF.email}">@{CONF.email}</a>
```

## Ako použijem pohľad bez layoutu?

Daj `@{layout('')}` na začiatok pohľadu. Kostra aplikácie s jComponentom je taký pohľad: celý vlastný HTML dokument.

## Ako v layoute načítam CSS a JavaScript aplikácie?

Cez `@{import()}` v `<head>`. Súbory sú v `public/css/` a `public/js/`:

```html
@{import('meta', 'head', 'default.js + func.js', 'default.css', 'favicon.ico')}
```

## Je syntax pohľadov rovnaká ako Tangular?

Nie. Pohľad z `views/` používa `@{...}` a vykresľuje sa na serveri. Tangular používa `{{ ... }}` a je pre šablóny, najmä v prehliadači. Nepíš jedno do druhého v očakávaní toho druhého nástroja.

## Aké sú dva druhy stránok?

Verejné stránky sú pohľady, ktoré kontrolér vráti cez `$.view('index')`. Obrazovky aplikácie (administrácia, nástroj) sú HTML pluginov, vložené do kostry a riadené cez `PLUGIN` s jComponentom.

## Prečo v režime release nevidím svoju zmenu statického súboru?

V režime release sa statické súbory posielajú z pamäte: po ich zmene aplikáciu reštartuj. Aj prehliadač si ich drží: pri testovaní vynúť znovunačítanie.
