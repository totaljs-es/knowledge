# Website

A small website with Total.js 5: a home page, a list of products and a page for each product. The pages are rendered on the server with views and one layout. There is no database: the content is a list in memory.

**The request it answers:** "Create a simple website for a bakery, with a home page and its products."

**The shape:** an application without plugins and without an API. It fits public pages that a person reads. An application with screens to manage data is made with plugins.

| File | What it has |
|---|---|
| `index.js` | Starts the framework |
| `config` | The name of the website and the email of the footer |
| `package.json` | `total5` is the only dependency |
| `controllers/default.js` | The routes of the pages and the function of each one |
| `definitions/products.js` | The products, in `MAIN.products` |
| `views/layout.html` | The HTML that every page shares: head, header, footer |
| `views/index.html`, `products.html`, `product.html` | The content of each page |
| `public/css/default.css` | The styles |
| `test.js` | The tests: they start the application and read every page |

## How a page is made

A route calls its function, and the function renders a view with its data:

```js
ROUTE('GET /products/{id}/', product);

function product($) {
	var item = MAIN.products.findItem('id', $.params.id);
	if (!item) {
		$.fallback(404);
		return;
	}
	$.view('product', item);
}
```

The view reads the data as `model` and goes inside `views/layout.html`, where `@{body}` is:

```html
@{title(model.name)}

<h1>@{model.name}</h1>
<p class="price">@{model.price.format(2)} EUR</p>
```

- `@{title(...)}` sets the title of the page; the framework adds the name of the application to it.
- `@{import('meta', 'head', 'default.css')}` in the layout writes the title and loads `public/css/default.css`.
- `@(Text)` marks a text for translation.
- `CONF.name` and `CONF.email` are the settings of the file `config`.

## Run it

```
npm install
node index.js 8000
```

Open `http://127.0.0.1:8000`.

## Test it

```
node test.js
```
