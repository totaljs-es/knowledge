# The interface with jComponent 20: questions and answers

## What is a plugin?

A feature of an application: a folder with its server part and its screen, which the framework loads and the shell of the application mounts.

```
plugins/redirects/
	index.js              server: metadata and routes
	schemas/redirects.js  actions
	public/index.html     the screen
	public/form.html      the form that opens over the screen
```

## What goes in the index.js of a plugin?

Its icon, its name, its position in the menu, who sees it, and its routes:

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

## How do I write the screen of a plugin?

HTML with a `<ui-plugin>` root and one `PLUGIN(function(exports) { ... })` block, in `public/index.html`:

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

`exports.reload` runs every time the screen opens.

## How does a screen call the server?

With `exports.tapi('endpoint_name', data, callback)`. Add `ERROR` after the name to show an error message to the user by itself:

```js
exports.tapi('tasks_save ERROR', model, function(response) {
	exports.refresh();
});
```

The name is the endpoint of the route: `+tasks_save`.

## What does ? mean in a path?

"This plugin". `?.items` is the data `items` of the plugin, and `?/create` is its function `exports.create`:

```html
<ui-bind path="?.items" config="template"></ui-bind>
<button class="exec" data-exec="?/create">@(Create)</button>
```

## What is CLASS?

A word that is replaced with a class unique to the plugin. Use it in the class of the root and in the selectors of the style, so the CSS of one screen cannot reach another:

```html
<style>
	.CLASS .task { padding: 10px 0; border-bottom: 1px solid #E8E8E8; }
</style>

<ui-plugin class="CLASS">
</ui-plugin>
```

## How do I handle the click of a button?

With the class `exec` and `data-exec`. Do not add `onclick` or `addEventListener`:

```html
<button class="exec" data-exec="?/create"><i class="ti ti-plus-circle"></i>@(Create)</button>
<div class="exec" data-exec="?/edit" data-id="{{ m.id }}">{{ m.name }}</div>
```

```js
exports.edit = function(el) {
	var id = ATTRD(el);
};
```

`ATTRD(el)` reads the `data-id` of the element.

## How do I set and read the data of a screen?

`exports.set('items', value)` sets it and the bindings draw it again. `exports.model` is the model of the plugin:

```js
exports.tapi('tasks', function(response) {
	exports.set('items', response);
});
```

## How do I load the jComponent 20 library in a page?

From the CDN, once per document, before the components:

```html
<link href="https://cdn.componentator.com/spa.min@20.css" rel="stylesheet" />
<script src="https://cdn.componentator.com/spa.min@20.js"></script>
<script src="@{REPO.ui}"></script>
```

`@{REPO.ui}` is the file of components that `COMPONENTATOR()` made.

## How do I load components?

With `COMPONENTATOR()` in `definitions/init.js`: it downloads the components you name as one file, and the layout loads it with `@{REPO.ui}`.

```js
ON('ready', function() {
	COMPONENTATOR('ui', 'exec,errorhandler,locale,input,validate,miniform,notify,approve', true);
});
```

List only the components the application uses.

## How do I put a component on a screen?

With `<ui-component>`: its name, the path of its data and its configuration.

```html
<ui-component name="input" path="?.url" config="required:1;placeholder:@(Relative URL address)">@(URL)</ui-component>
```

## Where do I find a component?

In Componentator, the catalogue of jComponent components: <https://componentator.com>. Look for an existing component before writing a piece of interface by hand. `input` is the one component for every field of a form: its `type` chooses the kind.

## How do I make a form?

A second file, `public/form.html`, with a `miniform`, its inputs, a `validate` that enables the submit button, and a `submit` function:

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

## How do I open a form?

The screen loads it with an `importer`, gives it a model and shows it:

```html
<ui-component name="importer" path="common.form" config="if:formredirect;url:/~ID~/form.html"></ui-component>
```

```js
exports.create = function() {
	SET('formredirect @default', {});
	SET('*form', 'formredirect');
};
```

## How does a form save and refresh the screen that opened it?

Its `submit` calls the server, hides the form after a good answer and refreshes the caller:

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

## How do I ask for a confirmation before removing?

With the component `approve`:

```js
SETTER('approve/show', '@(Are you sure you want to remove it?)', ':ti ti-trash: @(Remove)', function() {
	exports.tapi('redirects_remove/ ERROR', { id: id }, function() {
		exports.refresh();
	});
});
```

## How do I name plugins, components and their functions?

In lowercase. Keep the names `exports`, `self`, `config` and `cls` as they are:

```js
// good
PLUGIN('name', function(exports) { exports.dosomething = function() {}; });
```

## How do I write the CSS of an application?

One rule per line, texts in `'`, no vendor prefixes (`/*auto*/` at the top of the file adds them), no LESS and no SASS:

```css
/*auto*/

.class { key1: value; key2: value; key3: value; }
.class > div { key1: value; key2: value; }
```

The style of one screen goes at the top of its HTML, scoped with `CLASS`. What is shared goes in `public/css/default.css`.

## Which icons do I use?

Total Icons: the class `ti ti-name`, as `ti ti-check-circle` or `ti ti-trash`.

```html
<i class="ti ti-plus-circle"></i>
```
