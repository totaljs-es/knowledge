---
question: What does the jComponent 20 library include? Do I add jQuery or Bootstrap?
question_es: ¿Qué incluye la biblioteca jComponent 20? ¿Añado jQuery o Bootstrap?
---

# What does the jComponent 20 library include? Do I add jQuery or Bootstrap?

No. The interface of a Total.js application loads two files, and they already have what a screen needs:

```html
<link href="https://cdn.componentator.com/spa.min@20.css" rel="stylesheet" />
<script src="https://cdn.componentator.com/spa.min@20.js"></script>
```

| File | What is in it |
|---|---|
| `spa.min@20.js` | jQuery 3.7.1 (`$`), Tangular 5 (the templates with `{{ ... }}`) and the library itself: components, plugins, bindings, `AJAX`, the pages of the browser and the helpers |
| `spa.min@20.css` | The grid of Bootstrap 3, the helper classes of Total.js, the font of Total Icons and five CSS variables |

What the style sheet gives:

- **The grid of Bootstrap 3 and nothing else of Bootstrap**: `container`, `row`, `col-xs-6`, `col-sm-6`, `col-md-6`, `col-lg-6`, `hidden-xs`, `visible-xs`, the tables (`table`, `table-bordered`, `table-striped`) and `img-responsive`.
- **A grid of columns of the same width**: `grid-2` to `grid-12`.
- **Helper classes**: `m` (the margin under a field), `mt5`, `mt10`, `mr5`, `mr10`, `ml5`, `ml10`, `padding`, `b` (bold), `hellip`, `hidden`, `block`, `pointer`, `center`, `right`, `fs11`, `fs12`, `monospace`, `help`, and the colors `red`, `green`, `blue`, `gray`, `silver` and `orange`.
- **Total Icons**: `<i class="ti ti-check-circle"></i>`. The names are in [icons](../reference/icons.md).
- **The variables** `--color`, `--rgb`, `--radius`, `--gap` and `--margin`.

What is not there: the buttons, the forms, the modal windows and the JavaScript of Bootstrap. `class="btn btn-primary"` and `class="form-control"` do nothing, and `$('#x').modal()` does not exist. Those pieces are components:

| Instead of | Use |
|---|---|
| a second copy of jQuery, or Bootstrap | nothing: the two files are enough |
| `class="form-control"` and a `<form>` | the component `input` inside a `miniform` or a `form` |
| a modal of Bootstrap | the components `miniform`, `form`, `window` or `approve` |
| `addEventListener` and `onclick` | the class `exec` with `data-exec` |
| React, Vue or another framework | plugins, components and `<ui-bind>` |
| `fetch` and `axios` | `exports.tapi` and `AJAX` |
| Font Awesome or another icon font | Total Icons |
| a template library | Tangular, already loaded |

Before writing a piece of interface by hand, look for it in the [catalogue of components](../reference/components/readme.md). Checked in a browser with the files of the CDN: jQuery 3.7.1, Tangular 5.0.5 and the library 20.
