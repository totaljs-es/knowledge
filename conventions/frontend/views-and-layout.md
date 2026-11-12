# Views and layout

## Layout

The shell of an app is one HTML file in `views/` (`admin.html`, `index.html`). It sets the title, loads the UI library, registers global components once and mounts the plugins.

```html
@{layout('')}
@{title(config.name)}

<!DOCTYPE html>
<html>
<head>
	<meta charset="utf-8" />
	<meta name="viewport" content="width=device-width, initial-scale=1" />
	<link href="https://cdn.componentator.com/spa.min@20.css" rel="stylesheet" />
	<script src="https://cdn.componentator.com/spa.min@20.js"></script>
	<script src="@{REPO.ui}"></script>
	@{import('meta', 'head', 'default.js + func.js', 'default.css', 'favicon.ico')}
</head>
<body class="invisible">

	<ui-component name="exec"></ui-component>
	<ui-component name="errorhandler"></ui-component>
	<ui-component name="locale" config="requests:1;language:@{language}"></ui-component>
	<ui-component name="LAZY menu" config="style:2"></ui-component>

</body>
</html>
```

- Directives start with `@{...}`: `@{title()}`, `@{import()}`, `@{if}` / `@{fi}`, `@{REPO.ui}`, `https://cdn.componentator.com` (a config value).
- Global components are declared once in the layout. `LAZY` loads a component only when it is first used.
- The component bundle is loaded with `COMPONENTATOR('ui', 'exec,locale,input,...', true)` in `definitions/init.js`. List only the components the app uses; see [components](components.md).
- `<body class="invisible">` hides the page until the UI is ready.

## Runtime, bundles and application assets

New layouts load jComponent 20 from the CDN. An existing app on another major version requires a deliberate migration.

- Load `https://cdn.componentator.com/spa.min@20.css` and `https://cdn.componentator.com/spa.min@20.js` once per document. The runtime must precede component bundles and scripts that use its APIs.
- `COMPONENTATOR()` downloads the selected components; it does not replace the core runtime. Load the matching `@{REPO.ui}` or `@{REPO.webui}` after the runtime.
- Keep application helpers in app assets, such as `public/js/func.js`, and preserve the existing browser `FUNC` object when extending it. Load helpers before components that call them during initialization.
- Keep the app stylesheet and scoped component skins after the base stylesheet; see [CSS](css.md). Remove embedded copies of the runtime and obsolete custom loaders when adopting this setup.
- An isolated recipe iframe can intentionally use a pinned runtime with its own hashes and evidence. It is a separate document; preserve that version boundary.

Changing asset loading must preserve the existing title, language, canonical and alternate URLs, metadata, structured data, agent discovery links, landmarks and accessible navigation. Check the rendered HTML and browser console, keyboard interaction, mobile layout and reduced-motion behavior. A component initializing successfully does not establish that the whole layout is accessible.

## Translations

Every text a person reads is wrapped in `@(...)`, in views, in plugin HTML and in server messages: `@(Save)`. The text in English is the key.

## Two kinds of pages

- **App screens** (admin, tools): plugin HTML mounted in the layout, driven by `PLUGIN`.
- **Public pages**: server-rendered views returned by a controller (`$.view('index')`). They carry no `PLUGIN` logic.

## Naming

Lowercase file names with `-`: `search-results.html`, `form-offer.html`.
