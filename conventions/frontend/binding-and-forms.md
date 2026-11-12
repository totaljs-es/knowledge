# Binding and forms as one flow

The following connected example includes only the fields needed to show the lifecycle. It assumes the app shell, jComponent version, importer and `*form` alias setup; it is not a standalone page.

## Screen → model → importer

The screen declares the form importer and opens a model with the same name. The app's importer replaces `CLASS` when loading the form.

```html
<ui-component name="importer" path="common.form" config="if:formredirect;url:/~ID~/form.html"></ui-component>
```

```js
exports.create = function() {
	SET('formredirect @default', {});
	SET('*form', 'formredirect');
};

exports.edit = function(el) {
	var id = ATTRD(el);
	exports.tapi('redirects_read ERROR', { id: id }, function(response) {
		SET('formredirect @reset', response);
		SET('*form', 'formredirect');
	});
};
```

`formredirect`, the form's `CLASS`, the importer condition, `common.form` and `*form` must agree with the target shell. Do not copy the open function into another app without its alias/importer setup. Read data before showing an edit form; initialize a new model before showing create so the previous record does not leak into it.

## Form → submit → caller refresh

```html
<ui-component name="miniform" path="common.form" config="if:CLASS;title:@(Redirect);reload:?/reload;submit:?/submit;width:400" class="hidden" plugin="CLASS">
	<div class="padding">
		<ui-component name="input" path="?.url" config="required:1">@(URL)</ui-component>
		<ui-component name="input" path="?.target" config="required:1">@(Target URL)</ui-component>
	</div>
	<nav>
		<ui-component name="validate" path="?">
			<button name="submit" disabled>@(SUBMIT)</button>
			<button name="cancel">@(Cancel)</button>
		</ui-component>
	</nav>
</ui-component>

<script>
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
</script>
```

The form component owns the submit/cancel buttons. Ordinary screen buttons use `exec`; do not add a second submit listener. Hide only after a successful response, then refresh the caller. Verify `exports.form` / `exports.model` against the actual UI version and nearby form; they are not names to exchange mechanically.

## Binding and templates

Screens bind `?.items` through `ui-bind` and render a `script type="text/html"` with Tangular. Update the model (`exports.set('items', response)`) so the binding owns rendering, rather than keeping a parallel list in the DOM. Use `CLASS` for screen CSS, `?` for local paths and `data-exec="?/method"` for handlers. Preserve the shell's global model paths.

Treat user text as text in templates; do not add raw HTML rendering or string-built event attributes. Backend view directives (`@{...}`), translation markers (`@(...)`) and client Tangular (`{{ ... }}`) are distinct stages. Use the syntax supported by that app's library and compiler; check a working template for block terminators and escaping.

## Translations and icons

English text is the source key: `@(Save)`, `@(Target URL)`, translated through the app's `.resource` files. Keep resource keys, locale component configuration and any new error text synchronized. Avoid hard-coded translated copies in JS conditionals. Use the existing Total Icons `ti ti-*` assets and names from the app, with a label or accessible name for icon-only controls.

## Reusable components

Look for an existing component first. If new behaviour is reusable, use `COMPONENT('name', function(self, config, cls) { ... })` and the lifecycle supported by the installed jComponent version: build the DOM once, update from its bound value, react to configuration changes and release subscriptions/timers when destroyed. Read an existing component of that version for the exact methods. Keep feature permissions, API URLs and page model names in the plugin rather than baking them into the component.
