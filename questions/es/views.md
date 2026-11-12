# Vistas y páginas: preguntas y respuestas

## ¿Cómo muestro una página?

Una ruta llama a `$.view()` con el nombre de un archivo de `views/`:

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

## ¿Cómo paso datos a una vista?

Como segundo argumento de `$.view()`. La vista los lee como `model`:

```js
$.view('product', item);
```

```html
@{title(model.name)}

<h1>@{model.name}</h1>
<p>@{model.description}</p>
```

## ¿Cómo hago un layout para todas las páginas?

`views/layout.html` es el layout de todas las vistas. `@{body}` es donde va la vista:

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

## ¿Cómo recorro una lista en una vista?

Con `@{foreach}` y `@{end}`:

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

## ¿Cómo escribo una condición en una vista?

Con `@{if}` y `@{fi}`:

```html
@{if model.price}
	<p class="price">@{model.price.format(2)} EUR</p>
@{fi}
```

## ¿Cómo pongo el título de una página?

Con `@{title()}` al principio de la vista. El layout lo imprime con `@{import('meta')}`, y el framework añade detrás « - » y el nombre de la aplicación:

```html
@{title('@(Products)')}
```

## ¿Cómo marco un texto para traducirlo?

Envuélvelo en `@(...)`, en las vistas, en el HTML de los plugins y en los mensajes del servidor. El texto en inglés es la clave:

```html
<a href="/products/">@(Products)</a>
```

```js
$.invalid('@(The website is already in the list)');
```

Las traducciones están en `resources/<idioma>.resource`.

## ¿Cómo leo un ajuste en una vista?

`@{CONF.name}`:

```html
<a href="/" class="logo">@{CONF.name}</a>
<a href="mailto:@{CONF.email}">@{CONF.email}</a>
```

## ¿Cómo uso una vista sin el layout?

Pon `@{layout('')}` al principio de la vista. El armazón de una aplicación con jComponent es una vista así: un documento HTML entero y propio.

## ¿Cómo cargo el CSS y el JavaScript de la aplicación en el layout?

Con `@{import()}` en el `<head>`. Los archivos están en `public/css/` y `public/js/`:

```html
@{import('meta', 'head', 'default.js + func.js', 'default.css', 'favicon.ico')}
```

## ¿La sintaxis de las vistas es la misma que la de Tangular?

No. Una vista de `views/` usa `@{...}` y se genera en el servidor. Tangular usa `{{ ... }}` y es para plantillas, sobre todo en el navegador. No escribas una dentro de la otra esperando el otro motor.

## ¿Cuáles son los dos tipos de páginas?

Las páginas públicas son vistas que un controlador devuelve con `$.view('index')`. Las pantallas de una aplicación (un panel, una herramienta) son el HTML de los plugins, montado en un armazón y gobernado por `PLUGIN` con jComponent.

## ¿Por qué no veo mi cambio de un archivo estático en modo release?

En modo release los archivos estáticos se sirven desde memoria: reinicia la aplicación después de cambiarlos. El navegador también los guarda: fuerza una recarga mientras pruebas.
