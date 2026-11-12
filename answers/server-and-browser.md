---
question: Where does the server end and the browser begin in a Total.js application?
question_es: ¿Dónde acaba el servidor y dónde empieza el navegador en una aplicación Total.js?
---

# Where does the server end and the browser begin in a Total.js application?

Total.js 5 is the server and jComponent 20 is the browser. The server sends **models**, which are data, and the browser decides how they look. Neither does the work of the other.

| | The server: Total.js 5 | The browser: jComponent 20 |
|---|---|---|
| Where | `controllers/`, `schemas/`, `definitions/`, `plugins/<name>/index.js` | `views/` once it is loaded, `public/`, `plugins/<name>/public/*.html` |
| What it does | routes, actions, validation, the database, files, mail, schedules | screens, components, bindings, forms, clicks, the pages of the browser |
| How it answers or asks | `$.callback(model)`, `$.success()`, `$.invalid()`, `$.view('name', model)` | `exports.tapi('endpoint', data, callback)`, `AJAX('GET /url/', callback)` |
| What it never does | HTML for a screen, jQuery, `document`, components | a query to the database, `CONF`, secrets, `NEWACTION`, `ROUTE` of the server |

A model crosses the border in two ways.

As JSON, when a screen asks for it. The action answers with data and the screen puts it in its state; the bindings draw it:

```js
// schemas/tasks.js (server)
NEWACTION('Tasks|list', {
	name: 'List of tasks',
	action: async function($) {
		var items = await DATA.find('nosql/tbl_task').promise($);
		$.callback(items);
	}
});
```

```js
// plugins/tasks/public/index.html (browser)
exports.refresh = function() {
	exports.tapi('tasks', function(response) {
		exports.set('items', response);
	});
};
```

In a view, when the server renders a page. The view reads the model once, while the page is made:

```js
$.view('product', item);
```

```html
<h1>@{model.name}</h1>
```

The rules of the border:

- **The server does not build the HTML of a screen.** It answers with a model, and a `<ui-bind>` with a Tangular template or a component draws it. Do not join texts into HTML in an action.
- **The browser does not decide what is valid or who may do it.** The `input` of the action and its permissions decide; the form only helps the person.
- **In the browser, jComponent 20 is in charge**: its components, its plugins and its bindings, not another framework and not code by hand with `document.querySelector`. What the library has is in [the answer about it](frontend-library.md).
- **`@{...}` is the server and `{{ ... }}` is the browser.** A view of `views/` uses `@{model.name}`; a template inside a `<ui-bind>` uses `{{ value.name }}`.
- **Some names exist on both sides and are not the same function.** `ROUTE` on the server declares an HTTP route, and in the browser a page without a reload. `ON` and `EMIT`, `CACHE`, `AJAX` and `LOCALIZE` are also two different functions with the same name: write each one in the file of its side.
- **`plugins/<name>/index.js` is the server part of a plugin** (its routes and its place in the menu). `PLUGIN(function(exports) { ... })` is the browser part, in `public/index.html`.

The application [`apps/board`](../apps/board) has both sides in each plugin, and the pages [plugins with UI](../conventions/frontend/plugins-ui.md) and [actions](../conventions/backend/actions.md) are the two halves.
