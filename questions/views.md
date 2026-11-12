# Views and pages: questions and answers

## How do I render a page?

A route calls `$.view()` with the name of a file of `views/`:

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

## How do I pass data to a view?

As the second argument of `$.view()`. The view reads it as `model`:

```js
$.view('product', item);
```

```html
@{title(model.name)}

<h1>@{model.name}</h1>
<p>@{model.description}</p>
```

## How do I make a layout for all the pages?

`views/layout.html` is the layout of every view. `@{body}` is where the view goes:

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

## How do I loop over a list in a view?

With `@{foreach}` and `@{end}`:

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

## How do I write a condition in a view?

With `@{if}` and `@{fi}`:

```html
@{if model.price}
	<p class="price">@{model.price.format(2)} EUR</p>
@{fi}
```

## How do I set the title of a page?

With `@{title()}` at the top of the view. The layout prints it through `@{import('meta')}`, and the framework adds " - " and the name of the application after it:

```html
@{title('@(Products)')}
```

## How do I mark a text for translation?

Wrap it in `@(...)`, in views, in the HTML of plugins and in the messages of the server. The text in English is the key:

```html
<a href="/products/">@(Products)</a>
```

```js
$.invalid('@(The website is already in the list)');
```

The translations are in `resources/<language>.resource`.

## How do I read a setting in a view?

`@{CONF.name}`:

```html
<a href="/" class="logo">@{CONF.name}</a>
<a href="mailto:@{CONF.email}">@{CONF.email}</a>
```

## How do I use a view without the layout?

Put `@{layout('')}` at the top of the view. The shell of an application with jComponent is a view like that: a whole HTML document of its own.

## How do I load the CSS and JavaScript of the application in the layout?

With `@{import()}` in the `<head>`. The files are in `public/css/` and `public/js/`:

```html
@{import('meta', 'head', 'default.js + func.js', 'default.css', 'favicon.ico')}
```

## Is the syntax of the views the same as Tangular?

No. A view of `views/` uses `@{...}` and is rendered on the server. Tangular uses `{{ ... }}` and is for templates, mostly in the browser. Do not write one inside the other expecting the other engine.

## What are the two kinds of pages?

Public pages are views that a controller returns with `$.view('index')`. Application screens (an admin, a tool) are the HTML of plugins, mounted in a shell and driven by `PLUGIN` with jComponent.

## Why do I not see my change of a static file in release mode?

In release mode static files are served from memory: restart the application after changing them. The browser also keeps them: force a reload while testing.
