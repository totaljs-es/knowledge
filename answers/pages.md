---
question: How do I make a page with a layout?
question_es: ¿Cómo hago una página con un layout?
---

# How do I make a page with a layout?

A route calls a function, and the function renders a view of `views/` with its data. The view goes inside `views/layout.html`, where `@{body}` is.

```js
// controllers/default.js
exports.install = function() {
	ROUTE('GET /products/{id}/', product);
};

function product($) {
	var item = MAIN.products.findItem('id', $.params.id);
	if (!item) {
		$.fallback(404);
		return;
	}
	$.view('product', item);
}
```

```html
<!-- views/product.html -->
@{title(model.name)}

<h1>@{model.name}</h1>
<p>@{model.price.format(2)} EUR</p>
```

```html
<!-- views/layout.html -->
<!DOCTYPE html>
<html>
<head>
	<meta charset="utf-8" />
	@{import('meta', 'head', 'default.css')}
</head>
<body>
	@{body}
</body>
</html>
```

`@{title()}` sets the title (the framework adds the name of the application), `@{import()}` writes it and loads `public/css/default.css`, `@(Text)` marks a text for translation and `$.fallback(404)` answers with the page 404. Do not use `res.render`, `ejs` or `pug`.

The complete application: [`apps/website`](../apps/website).
