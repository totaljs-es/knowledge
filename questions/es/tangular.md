# Plantillas Tangular: preguntas y respuestas

## ¿Qué es Tangular?

El motor de plantillas de Total.js: texto con comandos `{{ ... }}` que se rellena con un modelo. jComponent lo usa en el navegador para lo que una pantalla dibuja a partir de datos, y el framework tiene el mismo motor en el servidor.

```js
var html = Tangular.render('Hello {{ name }}!', { name: 'Anna' });
```

El resultado es `Hello Anna!`.

## ¿Cómo imprimo un valor en Tangular?

`{{ name }}`. El valor se codifica como HTML, así que el texto de un usuario se puede mostrar tal cual. Una propiedad de un objeto es `{{ user.name }}`, y una expresión también funciona: `{{ age + 1 }}`.

## ¿Cómo imprimo un valor sin codificar el HTML en Tangular?

Con el helper `raw`:

```html
{{ html | raw }}
```

Úsalo solo para HTML que hizo la propia aplicación, nunca para texto que escribió un usuario. `{{ !html }}` no es raw: `!` es la negación de JavaScript.

## ¿Cómo escribo una condición en Tangular?

`{{ if }}`, `{{ else if }}`, `{{ else }}` y `{{ fi }}`:

```html
{{ if age > 40 }}old{{ else if age > 30 }}middle{{ else }}young{{ fi }}
```

La condición es una expresión de JavaScript. Termina con `{{ fi }}`.

## ¿Cómo recorro una lista en Tangular?

`{{ foreach m in items }}` y `{{ end }}`:

```html
{{ foreach m in items }}
<div class="item">{{ m.name }}</div>
{{ end }}
```

Un bucle termina con `{{ end }}` y una condición con `{{ fi }}`: no son la misma palabra.

## ¿Cómo obtengo la posición de un elemento en un bucle de Tangular?

`$index`, desde 0:

```html
{{ foreach m in items }}{{ $index }}:{{ m.name }} {{ end }}
```

`{{ continue }}` pasa al siguiente elemento y `{{ break }}` termina el bucle.

## ¿Cómo doy formato a un número o a una fecha en Tangular?

Con el helper `format`:

```html
{{ price | format(2) }}
{{ date | format('yyyy-MM-dd') }}
```

`1234.5` queda como `1 234.50`, y la fecha como `2026-11-12`.

## ¿Cómo muestro un texto cuando un valor está vacío en Tangular?

Con `empty` o `def`:

```html
{{ name | empty('No name') }}
{{ nothing | def('nothing here') }}
```

`{{ name | empty }}` sin texto escribe `---`. Un valor que es `null` o no existe es un texto vacío, no un error.

## ¿Cómo escribo un plural en Tangular?

Con `pluralize` y cuatro textos: para cero, uno, unos pocos y muchos. `#` es el número:

```html
{{ count | pluralize('no items', '# item', '# items', '# items') }}
```

## ¿Cómo hago mi propio helper de Tangular?

```js
Thelpers.upper = function(value) {
	return Thelpers.encode((value || '').toUpperCase());
};
```

```html
{{ name | upper }}
```

El resultado de un helper se escribe sin codificar: un helper que devuelve texto de un usuario lo codifica con `Thelpers.encode(value)`.

## ¿Cómo dibujo una lista en una pantalla con una plantilla?

Con un `ui-bind` y `config="template"`. Dibuja su plantilla cada vez que cambia su ruta de datos, y dentro de la plantilla los datos son `value`:

```html
<ui-bind path="?.items" config="template" class="block">
	<script type="text/html">
		{{ foreach m in value }}
		<div class="item{{ if m.isdone }} done{{ fi }}">{{ m.name }}</div>
		{{ end }}
	</script>
</ui-bind>
```

Cambia el modelo y deja que el `ui-bind` dibuje; no construyas el HTML uniendo textos.

## ¿Cómo compilo una plantilla para usarla muchas veces?

```js
var template = Tangular.compile('Hello {{ name }}!');
var html = template({ name: 'Zoe' });
```
