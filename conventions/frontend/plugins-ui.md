# Plugins with UI

A feature of an app is a **plugin**: a folder with a server part and a UI part that the framework loads and the app shell mounts.

```
plugins/redirects/
	index.js              server: metadata + routes
	schemas/redirects.js  actions (see backend/actions.md)
	public/index.html     the screen: markup + <script>PLUGIN(...)</script>
	public/form.html      the form that opens over the screen
```

## Server part: index.js

```js
exports.icon = 'ti ti-exchange';
exports.name = '@(Redirects)';
exports.position = 3;
exports.permissions = [{ id: 'redirects', name: 'Redirects' }];
exports.visible = function(user) {
	return user.sa || user.permissions.indexOf('redirects') !== -1 || user.permissions.indexOf('admin') !== -1;
};

exports.install = function() {
	ROUTE('+API    ?    -redirects_list               --> Redirects|list');
	ROUTE('+API    ?    +redirects_save               --> Redirects|save');
};
```

- `icon` is a Total Icons class (`ti ti-name`), `name` is translatable with `@(...)`, `position` orders the menu.
- `permissions` declares what the plugin adds; `visible` decides who sees it.
- Routes use the same syntax as everywhere (see [routes-and-auth](../backend/routes-and-auth.md)).

## UI part: a screen

A screen is HTML with a `<ui-plugin>` root and one `PLUGIN(function(exports) { ... })` block. Keep markup, scoped style and logic in the same file. Screens may also include a `virtualwire` toolbar, importer declarations and other app-shell wrappers; copy the nearest screen rather than enforcing exactly one root element.

```html
<style>
	.CLASS .listing2 figure { margin-bottom: 10px; }
</style>

<ui-plugin class="CLASS bg-white">
	<ui-component name="empty" path="?.items" config="parent:auto" class="invisible">
		...
	</ui-component>
</ui-plugin>

<script>
	PLUGIN(function(exports) {

		exports.reload = function() {
			exports.refresh();
		};

		exports.refresh = function() {
			exports.tapi('redirects_list', function(response) {
				exports.set('items', response);
			});
		};

	});
</script>
```

Rules:

- `CLASS` in selectors and class lists is replaced with a unique class for the plugin: it scopes the CSS so plugins do not collide.
- `?` in a path (`?.items`, `?/create`) means "this plugin": `?.items` is the data, `?/create` is `exports.create`.
- `exports.reload` runs every time the screen opens.
- Call the server with `exports.tapi('endpoint_name', data, callback)`. Add `ERROR` after the name (`'redirects_read ERROR'`) to show an error message to the user automatically.
- Set data with `exports.set('items', value)`, or globally with `SET('path @reset', value)`; read the model with `exports.model`.
- Handlers are attached in markup: `class="exec" data-exec="?/edit" data-id="{{ m.id }}"`. Read the attribute with `ATTRD(el)`.
- Text for people is always `@(Text)` so it can be translated.
- Naming: plugin, component and global names in **lowercase**; keep the names `exports`, `self`, `config`, `cls` as they are.

Official guide on names:

```js
// BAD
PLUGIN('Name', function(plugin) { plugin.doSomething = function() {}; });

// GOOD
PLUGIN('name', function(exports) { exports.dosomething = function() {}; });
```

See [binding and forms](binding-and-forms.md) for the importer, model path, submit callback and caller refresh as one connected flow.

## A form

A form is a second file loaded with an `importer` and shown by `miniform` / `form`. It has `?.field` inputs, a `validate` that enables the submit button, and a `submit` function.

```html
<ui-component name="miniform" path="common.form" config="if:CLASS;icon:ti ti-exchange;autofocus:true;reload:?/reload;submit:?/submit;width:400" class="hidden" plugin="CLASS">
	<div class="padding">
		<div class="m">
			<ui-component name="input" path="?.url" config="required:1;placeholder:@(Relative URL address)">@(URL)</ui-component>
		</div>
	</div>
	<nav>
		<ui-component name="validate" path="?">
			<button name="submit" disabled><i class="ti ti-check-circle"></i>@(SUBMIT)</button>
			<button name="cancel">@(Cancel)</button>
		</ui-component>
	</nav>
</ui-component>
```

Open it from the screen:

```js
exports.create = function() {
	SET('formredirect @default', {});
	SET('*form', 'formredirect');
};
```

## Confirm and menu

```js
SETTER('approve/show', '@(Are you sure you want to remove it?)', ':ti ti-trash: @(Remove)', function() {
	exports.tapi('redirects_remove/ ERROR', { id: id }, function() { exports.refresh(); });
});
SETTER('menu/show', opt);
```

## Think reusable

Components, plugins and global names are shared across projects. Before inventing one, look in the [catalogue of components](components.md) and in another app for the same name.
