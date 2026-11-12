# CSS

- File names lowercase, words separated by `-`.
- **One rule per line**: keep all declarations of a selector on the same line.
- Strings in `'` apostrophes.
- No vendor prefixes: current browsers do not need them. `/*auto*/` at the top of a file comes from Total.js 4, which added them; Total.js 5 keeps the mark and adds nothing.
- No LESS and no SASS. The shared colors and sizes are the CSS variables of the jComponent library: `var(--color)`, `var(--rgb)`, `var(--radius)`, `var(--gap)` and `var(--margin)`. Use them instead of a fixed color or radius.

```css
/*auto*/

.class { key1: value; key2: value; key3: value; }
.class > div { key1: value; key2: value; }
```

## In plugins

Style that belongs to a screen goes at the top of its HTML file, scoped with `CLASS`:

```html
<style>
	.CLASS .listing2 figure { margin-bottom: 10px; }
	.CLASS .listing2 .permanent { background-color: #F6E7EA; }
</style>
```

`CLASS` becomes a class unique to the plugin, so the rule cannot leak to other screens.

## Predefined classes

The `intranetcss` component provides the common design (panels, toolbars, badges, messages, listings, tabs, dark mode). Use its classes before writing new CSS: see [components](components.md).

## Global style

`public/default.css` holds what is shared. Colors that change per user or theme are CSS variables (`:root { --color: ... }`), set once in the layout.

## Static files

`/img/`, `/css/`, `/js/`, `/fonts/`, `/videos/`. Images use the file-name rule: lowercase with dashes.

## Component skins

Scope overrides to an app class combined with the official component class, for example `.app-backtotop.ui-backtotop`. Keep the official component's selectors and behavior intact. Component CSS can be injected after the app stylesheet; use deliberate specificity instead of depending only on load order or broad global overrides.

Skinning the official BackToTop works this way. Preserve visible keyboard focus, sufficient contrast, mobile positioning and `prefers-reduced-motion` when adapting its appearance. Semantic or focus changes belong in a small native initialization hook, as described in [components](components.md), rather than in CSS.
