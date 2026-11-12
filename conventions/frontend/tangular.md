# Tangular templates

Tangular is the template engine of Total.js: text with `{{ ... }}` commands that is filled with a model. jComponent uses it in the browser for everything a screen draws from data, and the framework has the same engine on the server.

Every example of this page was run with the engine of Total.js 5 0.0.19; the result is after `=>`.

## Where it is used

In a screen, a `ui-bind` with `config="template"` draws its `<script type="text/html">` every time its path changes. Inside the template the data of the path is `value`:

```html
<ui-bind path="?.items" config="template" class="block">
	<script type="text/html">
		{{ foreach m in value }}
		<div class="item{{ if m.isdone }} done{{ fi }}">{{ m.name }}</div>
		{{ end }}
	</script>
</ui-bind>
```

On the server, and anywhere in JavaScript:

```js
var html = Tangular.render('Hello {{ name }}!', { name: 'Anna' });   // => Hello Anna!

var template = Tangular.compile('Hello {{ name }}!');                 // a function, to render many times
var html2 = template({ name: 'Zoe' });                                // => Hello Zoe!
```

Tangular is not the syntax of the views: a view of `views/` uses `@{...}` (see [views and layout](views-and-layout.md)). `{{ ... }}` is for templates.

## Values

| Template | Model | Result |
|---|---|---|
| `{{ name }}` | `{ name: 'Anna <b>' }` | `Anna &lt;b&gt;` |
| `{{ html \| raw }}` | `{ html: '<b>bold</b>' }` | `<b>bold</b>` |
| `{{ user.name }}` | `{ user: { name: 'Anna' } }` | `Anna` |
| `{{ age + 1 }}` | `{ age: 31 }` | `32` |
| `{{ nothing }}` | `{ nothing: null }` | an empty text |

- A value is HTML-encoded: text of a user can be shown as it is.
- `| raw` writes the value without encoding. Use it only for HTML that the application made itself.
- `{{ !html }}` is not raw: `!` is the negation of JavaScript, and the result is `false`.
- A value that is `null` or does not exist is an empty text, not an error.

## Conditions

```html
{{ if isadmin }}admin{{ else }}user{{ fi }}
{{ if age > 40 }}old{{ else if age > 30 }}middle{{ else }}young{{ fi }}
{{ if isadmin && age > 18 }}yes{{ fi }}
```

A condition is a JavaScript expression. It ends with `{{ fi }}`.

## Loops

```html
{{ foreach m in items }}[{{ m.name }}]{{ end }}                       => [Bread][Cake]
{{ foreach m in items }}{{ $index }}:{{ m.name }} {{ end }}           => 0:Bread 1:Cake
{{ foreach m in items }}{{ m.name }}{{ if $index < items.length - 1 }}, {{ fi }}{{ end }}   => Bread, Cake
```

- A loop ends with `{{ end }}`. A condition ends with `{{ fi }}`: they are not the same word.
- `$index` is the position of the item, from 0.
- `{{ continue }}` goes to the next item and `{{ break }}` ends the loop.

```html
{{ foreach m in items }}{{ if !m.isdone }}{{ continue }}{{ fi }}{{ m.name }}{{ end }}
```

## Helpers

A helper changes a value: `{{ value | helper }}` or `{{ value | helper(arguments) }}`.

| Template | Value | Result |
|---|---|---|
| `{{ price \| format(2) }}` | `1234.5` | `1 234.50` |
| `{{ date \| format('yyyy-MM-dd') }}` | a date | `2026-11-12` |
| `{{ date \| format('dd.MM.yyyy HH:mm') }}` | a date | `12.11.2026 09:30` |
| `{{ name \| empty('No name') }}` | `''` | `No name` |
| `{{ name \| empty }}` | `''` | `---` |
| `{{ nothing \| def('nothing here') }}` | `null` | `nothing here` |
| `{{ count \| pluralize('no items', '# item', '# items', '# items') }}` | `0`, `3` | `no items`, `3 items` |
| `{{ html \| raw }}` | `<b>bold</b>` | `<b>bold</b>` |

`format` uses the `format` of the value: decimals for a number, a pattern for a date. `empty` and `def` give a text when there is no value. The four texts of `pluralize` are for zero, one, a few and many, and `#` is the number.

## Your own helper

```js
Thelpers.upper = function(value) {
	return Thelpers.encode((value || '').toUpperCase());
};
```

```html
{{ name | upper }}
```

`Tangular.register('upper', fn)` does the same. The result of a helper is written as it is, without encoding: a helper that returns text of a user encodes it with `Thelpers.encode(value)`, as the one above. A helper is the place for what a template repeats (a badge, a status, a size of a file), not a function that builds HTML in the code of the screen.

## What to avoid

- Building HTML with text concatenation or with DOM calls when a template can draw it: change the model and let the `ui-bind` draw.
- `| raw` on text that a user wrote.
- `{{ end }}` to close a condition, or `{{ fi }}` to close a loop.
- `@{...}` inside a template, or `{{ ... }}` in a view of the server, expecting the other engine.
