# Components (jComponent)

For widgets, forms, lists, inputs and every other piece of UI, **use a component that already exists**. If none fits, **create a component** (do not build the piece with ad hoc markup and scripts). Load catalogue components with `COMPONENTATOR()`; custom app-owned components remain normal app assets.

## 1. Look for the component first

The catalogue of jComponent components, with a live preview, the documentation and the download of each, is Componentator: <https://componentator.com>.

Before writing UI:

1. Find the component that does the job (input, form, listing, datagrid, notify, menu, approve...).
2. Read its page: what it does, its **configuration** and its context (what path and data it expects, what it needs around it).
3. Use it from markup with `<ui-component name="..." path="..." config="...">`.

Machine-readable forms of the same catalogue (use these from code or an agent):

| What | URL |
|---|---|
| The index for models: rules, the reference component and the API of the library | `https://componentator.com/llms.txt` |
| One component as markdown | `https://raw.githubusercontent.com/totaljs/components/master/components/<name>/readme.md` (e.g. `input`, lowercase) |
| The source of one component, with its live example | `https://raw.githubusercontent.com/totaljs/components/master/components/<name>/component.html` |

The readme of each component says the versions of jComponent it works with (`jcomponent: v19,v20`).

## Match the UI version first

Apps load `spa.min@19` or `@20`. A catalogue entry for jComponent 20 does not prove its markup or options work in 19. Check the actual layout, bundle and nearby screen before using a component or copying `PLUGIN`/binding syntax. A backend Total.js 5 dependency does not select the browser UI major version.

## Preferred components

When several components could do the job, use these:

| For | Use | Notes |
|---|---|---|
| Form fields (text, email, phone, password, multiline, checkbox, select, date...) | `input` (j-Input) | One component for every field: `type` chooses the kind. It replaces j-Textbox and j-Dropdown. |
| A box with a fixed height and scroll | `viewbox` | `height` is a percentage, `parent` is the container (or `window`), `scroll` / `scrollbar` control scrolling. |
| Loaders | `loading` | Reacts to the `@showloading` and `@hideloading` flags; `style` picks the look (1 = spinner, 2 = line at the top). |
| Tables and data grids | `datagrid` | For single page and enterprise apps: filters, sorting, pages, `height` modes (`auto`, `fluid`, `parent`). |
| Buttons and calls to functions | `exec` | See below. |
| Predefined design (panels, toolbars, badges, messages, listings, tabs, dark mode) | `intranetcss` | Ready-made CSS classes; see below. |

### exec: buttons and function calls

`exec` is a singleton that works for the whole page: any element with the class `exec` calls a function when it is clicked. Do not add `onclick` handlers or `addEventListener` for buttons.

```html
<button class="exec" data-exec="?/create"><i class="ti ti-plus-circle"></i>@(Create)</button>
<span class="exec" data-exec="?/options" data-prevent="true">...</span>
<a class="exec" data-href="/offers/">@(Offers)</a>
```

- `data-exec="NAME"`: the function to call, with the form `function(element, event)`. A `?` calls a method of the current plugin (`?/create` is `exports.create`).
- `data-prevent="true"`: stops the click from going further (for a button inside a clickable row).
- `data-href="URL"`: redirects instead of calling a function.
- Double click and context menu use the same attributes with a suffix: `data-exec2` (class `exec2`) and `data-exec3` (class `exec3`).

### intranetcss: predefined design

`intranetcss` is a component made only of CSS. It brings the shared look of the intranet apps, with a dark mode, so a screen does not need its own style for the common pieces:

- containers: `.panel` (with `label` and `.toolbar`), `.padding`, `.divider`, `.bg-smoke`
- lists and menus: `.listing`, `.listing2`, `.nav`, `.tabmenu`, `.tabmenu2`, `.iconmenu`, `.keyvalue`
- messages and badges: `.message`, `.message-success`, `.message-error`, `.message-alert`, `.badge` (with colors and sizes)
- sizes: `.small`, `.medium`, `.large`

Use these classes before writing new CSS (see [css](css.md)). Its source (version 5) is served by the component download service.

## 2. If it does not exist, create a component

A piece of UI that has behaviour is a component, not a block of script inside a page.

```js
COMPONENT('name', function(self, config, cls) {
	// keep the names: "self", "config" and "cls"
});
```

- Names of components, plugins, variables and settings in **lowercase**.
- Keep at most 2-3 levels of nesting in objects.
- Avoid `_` in variable names.
- **Think reusable**: a component takes its data from `path` and its options from `config`, and knows nothing about the screen that uses it.
- Use the same name across projects for the same thing. Check the catalogue before choosing one.

## 3. Load components with COMPONENTATOR()

For shared catalogue components, use the app's `COMPONENTATOR()` bundle. App-owned components load through the app's existing assets. For example, in `definitions/init.js`:

```js
ON('ready', function() {
	COMPONENTATOR('ui', 'exec,locale,page,viewbox,input,form,validate,loading,datagrid,intranetcss,message,menu,approve,notify,errorhandler', true);
});
```

`COMPONENTATOR(name, components, removeprev, attrs)`:

- `name`: the name of the bundle (`'ui'`).
- `components`: the components of the bundle, comma-separated, without the `j-` prefix.
- `removeprev` (default `true`): deletes the older bundles of the same name when the list changes.
- `attrs`: optional extra parameters for the bundle.

The framework downloads the bundle once, saves it in `public/` as `ui-<name>-<hash>.min.js` and stores its address in `REPO.<name>`. The layout loads it:

```html
<script src="@{REPO.ui}"></script>
```

Rules:

- One `COMPONENTATOR()` call per bundle (`ui` for the app, `webui` for public pages).
- List **only** the components the app uses: the bundle is what every user downloads.
- When you start using a component, add it to the list; when no screen uses it any more, remove it.
- A component you created yourself is a normal file of the app (`public/` or the plugin's `public/`), not a `COMPONENTATOR()` entry.

## Adapt the official component's appearance

Reuse the official component and its configuration first. A different visual design usually needs a scoped CSS skin, not a copied component implementation or a file that embeds jComponent itself.

The official `backtotop` is loaded through `COMPONENTATOR('webui', 'backtotop', true)` and declared as:

```html
<ui-component name="backtotop" class="app-backtotop" config="icon:ti ti-arrow-up;$init:FUNC.backtotop" data-label="@(Back to top)"></ui-component>
```

A stylesheet changes the appearance; a `FUNC` function adds button semantics, a translated accessible name and keyboard focus handling through the native `$init` hook. The official component retains its scrolling and visibility behavior. The hook is needed because the official component renders a span; CSS cannot provide button semantics.

Verify hook timing against the installed runtime and component: jComponent's `library.js` calls `make` before applying `$init`, so the hook can adapt the generated markup. Keep such hooks small and idempotent, and check Enter, Space, pointer interaction, focus and reduced motion. If a component supplies the required semantics already, use them directly.

## 4. Quick check

- Is there a component for this in the catalogue? Use it.
- Did you read its configuration and context before using it? Do.
- Is it in the `COMPONENTATOR()` list? Add it.
- Is there none? Create a reusable `COMPONENT('name', ...)` and use it from markup.

See [plugins-ui](plugins-ui.md) for how screens and forms use components, and [views-and-layout](views-and-layout.md) for the layout that loads the bundle.
