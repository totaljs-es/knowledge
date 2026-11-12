# Šablóny Tangular: otázky a odpovede

## Čo je Tangular?

Šablónovací nástroj Total.js: text s príkazmi `{{ ... }}`, ktorý sa naplní modelom. jComponent ho používa v prehliadači na to, čo obrazovka kreslí z údajov, a framework má ten istý nástroj na serveri.

```js
var html = Tangular.render('Hello {{ name }}!', { name: 'Anna' });
```

Výsledok je `Hello Anna!`.

## Ako v Tangulare vypíšem hodnotu?

`{{ name }}`. Hodnota sa zakóduje ako HTML, takže text používateľa sa dá zobraziť tak, ako je. Vlastnosť objektu je `{{ user.name }}` a funguje aj výraz: `{{ age + 1 }}`.

## Ako v Tangulare vypíšem hodnotu bez kódovania HTML?

Pomocníkom `raw`:

```html
{{ html | raw }}
```

Použi ho iba pre HTML, ktoré vytvorila sama aplikácia, nikdy pre text, ktorý napísal používateľ. `{{ !html }}` nie je raw: `!` je negácia JavaScriptu.

## Ako v Tangulare napíšem podmienku?

`{{ if }}`, `{{ else if }}`, `{{ else }}` a `{{ fi }}`:

```html
{{ if age > 40 }}old{{ else if age > 30 }}middle{{ else }}young{{ fi }}
```

Podmienka je výraz JavaScriptu. Končí sa `{{ fi }}`.

## Ako v Tangulare prejdem zoznam?

`{{ foreach m in items }}` a `{{ end }}`:

```html
{{ foreach m in items }}
<div class="item">{{ m.name }}</div>
{{ end }}
```

Cyklus sa končí `{{ end }}` a podmienka `{{ fi }}`: nie je to to isté slovo.

## Ako v cykle Tangularu zistím pozíciu položky?

`$index`, od 0:

```html
{{ foreach m in items }}{{ $index }}:{{ m.name }} {{ end }}
```

`{{ continue }}` prejde na ďalšiu položku a `{{ break }}` cyklus ukončí.

## Ako v Tangulare naformátujem číslo alebo dátum?

Pomocníkom `format`:

```html
{{ price | format(2) }}
{{ date | format('yyyy-MM-dd') }}
```

`1234.5` bude `1 234.50` a dátum bude `2026-11-12`.

## Ako v Tangulare zobrazím text, keď je hodnota prázdna?

Cez `empty` alebo `def`:

```html
{{ name | empty('No name') }}
{{ nothing | def('nothing here') }}
```

`{{ name | empty }}` bez textu napíše `---`. Hodnota, ktorá je `null` alebo neexistuje, je prázdny text, nie chyba.

## Ako v Tangulare napíšem množné číslo?

Cez `pluralize` a štyri texty: pre nulu, jeden, niekoľko a veľa. `#` je číslo:

```html
{{ count | pluralize('no items', '# item', '# items', '# items') }}
```

## Ako si urobím vlastného pomocníka Tangularu?

```js
Thelpers.upper = function(value) {
	return Thelpers.encode((value || '').toUpperCase());
};
```

```html
{{ name | upper }}
```

Výsledok pomocníka sa zapíše bez kódovania: pomocník, ktorý vracia text používateľa, ho zakóduje cez `Thelpers.encode(value)`.

## Ako na obrazovke vykreslím zoznam šablónou?

Cez `ui-bind` a `config="template"`. Vykreslí svoju šablónu vždy, keď sa zmení jeho cesta k údajom, a vnútri šablóny sú údaje `value`:

```html
<ui-bind path="?.items" config="template" class="block">
	<script type="text/html">
		{{ foreach m in value }}
		<div class="item{{ if m.isdone }} done{{ fi }}">{{ m.name }}</div>
		{{ end }}
	</script>
</ui-bind>
```

Zmeň model a nechaj kresliť `ui-bind`; neskladaj HTML spájaním textov.

## Ako skompilujem šablónu, aby som ju použil veľakrát?

```js
var template = Tangular.compile('Hello {{ name }}!');
var html = template({ name: 'Zoe' });
```
