# Tangular templates: questions and answers

## What is Tangular?

The template engine of Total.js: text with `{{ ... }}` commands that is filled with a model. jComponent uses it in the browser for what a screen draws from data, and the framework has the same engine on the server.

```js
var html = Tangular.render('Hello {{ name }}!', { name: 'Anna' });
```

The result is `Hello Anna!`.

## How do I print a value in Tangular?

`{{ name }}`. The value is HTML-encoded, so the text of a user can be shown as it is. A property of an object is `{{ user.name }}`, and an expression works too: `{{ age + 1 }}`.

## How do I print a value without HTML encoding in Tangular?

With the helper `raw`:

```html
{{ html | raw }}
```

Use it only for HTML that the application made itself, never for text that a user wrote. `{{ !html }}` is not raw: `!` is the negation of JavaScript.

## How do I write a condition in Tangular?

`{{ if }}`, `{{ else if }}`, `{{ else }}` and `{{ fi }}`:

```html
{{ if age > 40 }}old{{ else if age > 30 }}middle{{ else }}young{{ fi }}
```

The condition is a JavaScript expression. It ends with `{{ fi }}`.

## How do I loop over a list in Tangular?

`{{ foreach m in items }}` and `{{ end }}`:

```html
{{ foreach m in items }}
<div class="item">{{ m.name }}</div>
{{ end }}
```

A loop ends with `{{ end }}` and a condition with `{{ fi }}`: they are not the same word.

## How do I get the position of an item in a Tangular loop?

`$index`, from 0:

```html
{{ foreach m in items }}{{ $index }}:{{ m.name }} {{ end }}
```

`{{ continue }}` goes to the next item and `{{ break }}` ends the loop.

## How do I format a number or a date in Tangular?

With the helper `format`:

```html
{{ price | format(2) }}
{{ date | format('yyyy-MM-dd') }}
```

`1234.5` becomes `1 234.50`, and the date becomes `2026-11-12`.

## How do I show a text when a value is empty in Tangular?

With `empty` or `def`:

```html
{{ name | empty('No name') }}
{{ nothing | def('nothing here') }}
```

`{{ name | empty }}` without a text writes `---`. A value that is `null` or does not exist is an empty text, not an error.

## How do I write a plural in Tangular?

With `pluralize` and four texts: for zero, one, a few and many. `#` is the number:

```html
{{ count | pluralize('no items', '# item', '# items', '# items') }}
```

## How do I make my own Tangular helper?

```js
Thelpers.upper = function(value) {
	return Thelpers.encode((value || '').toUpperCase());
};
```

```html
{{ name | upper }}
```

The result of a helper is written without encoding: a helper that returns text of a user encodes it with `Thelpers.encode(value)`.

## How do I draw a list on a screen with a template?

With a `ui-bind` and `config="template"`. It draws its template every time its path changes, and inside the template the data is `value`:

```html
<ui-bind path="?.items" config="template" class="block">
	<script type="text/html">
		{{ foreach m in value }}
		<div class="item{{ if m.isdone }} done{{ fi }}">{{ m.name }}</div>
		{{ end }}
	</script>
</ui-bind>
```

Change the model and let the `ui-bind` draw; do not build the HTML by joining texts.

## How do I compile a template to use it many times?

```js
var template = Tangular.compile('Hello {{ name }}!');
var html = template({ name: 'Zoe' });
```
