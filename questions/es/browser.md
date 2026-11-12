# El navegador: estado, eventos, almacenamiento, peticiones, subidas y páginas sin recargar: preguntas y respuestas

## ¿Cómo leo y cambio un valor desde cualquier parte del navegador?

Con `GET(ruta)` y `SET(ruta, valor)`. La ruta empieza por la del plugin, y cada enlace de esa ruta se vuelve a pintar:

```js
var count = GET('counter.count');
SET('counter.count', 10);
```

Dentro del plugin usa `exports.get('count')` y `exports.set('count', 10)`.

## ¿Cómo incremento un número, cambio un indicador o añado un elemento a una lista?

Con `inc`, `toggle` y `push` del plugin; cambian el valor y la pantalla se vuelve a pintar. `INC`, `TOGGLE` y `PUSH` hacen lo mismo desde fuera, con la ruta entera:

```js
exports.inc('count', 1);
exports.toggle('isopen');
exports.push('items', 'new');

INC('counter.count', 5);
TOGGLE('counter.isopen');
PUSH('counter.items', 'new');
```

## ¿Cómo muestro u oculto una parte de una pantalla?

Con un `ui-bind` y `show`: quita la clase `hidden` cuando el valor es verdadero.

```html
<ui-bind path="?.isopen" config="show" class="hidden">
	<div>@(Details)</div>
</ui-bind>
```

## ¿Cómo reacciono cuando cambia un valor?

Con `exports.watch` en el plugin, o `WATCH` con la ruta entera. La función recibe el valor nuevo:

```js
exports.watch('count', function(value) {
	console.log(value);
});

WATCH('counter.count', function(value) {
	console.log(value);
});
```

## ¿Cómo envío un evento de un plugin a otro?

`EMIT(nombre, a, b)` lo envía y cada `ON(nombre, ...)` lo oye, en un plugin con `exports.on`:

```js
// the plugin that listens
exports.on('saved', function(id) {
	exports.refresh();
});

// the one that saved
EMIT('saved', id);
```

## ¿Cómo llamo a una función de otro plugin?

Con `EXEC('plugin/función', argumentos)`. Los plugins están también en `PLUGINS`:

```js
EXEC('counter/add', el);
PLUGINS.counter.refresh();
```

## ¿Cómo guardo un valor en el navegador entre visitas?

Con `CACHE(clave, valor, caducidad)`; `CACHE(clave)` lo lee y da `null` cuando no está o su tiempo ha pasado. Se guarda en el `localStorage`:

```js
CACHE('filter', { status: 'open' }, '1 day');
var filter = CACHE('filter');
```

## ¿Cómo guardo una preferencia del usuario en el navegador?

Con `PREF.set(nombre, valor, caducidad)`; el valor es después una propiedad de `PREF`:

```js
PREF.set('theme', 'dark', '1 month');
var theme = PREF.theme;
```

## ¿Cómo leo y pongo una cookie en el navegador?

Con `COOKIES.get`, `COOKIES.set` y `COOKIES.rem`:

```js
COOKIES.set('language', 'sk', '1 day');
var language = COOKIES.get('language');
COOKIES.rem('language');
```

## ¿Cómo llamo a una ruta del servidor que no es un endpoint de la API?

Con `AJAX`: el método y la dirección en un texto, los datos y un callback. La respuesta viene interpretada, y sus fechas son objetos `Date`:

```js
AJAX('GET /api/ping/', function(response) {
	console.log(response);
});

AJAX('POST /api/echo/', { name: 'Anna' }, function(response) {
	console.log(response);
});
```

Para los endpoints de la API de un plugin usa `exports.tapi`.

## ¿Cómo subo un archivo desde el navegador con su progreso?

Con `UPLOAD`: el método y la dirección, un `FormData`, el callback y una función que recibe el porcentaje:

```js
var data = new FormData();
data.append('file', input.files[0]);

UPLOAD('POST /api/upload/', data, function(response) {
	exports.refresh();
}, function(percentage) {
	exports.set('progress', percentage);
});
```

La ruta del servidor lleva `@upload` y su límite de tamaño.

## ¿Cómo hago páginas en el navegador sin recargar?

Con `ROUTE` de la biblioteca: una dirección y la función que se ejecuta para ella. `REDIRECT(url)` va a una dirección sin recargar:

```js
ROUTE('/products/', function() {
	SET('common.page', 'products');
});

ROUTE('/products/{id}/', function(id) {
	SET('common.page', 'product');
	SET('product.id', id);
});

REDIRECT('/products/abc/');
```

`NAV.url` es la dirección actual, `NAV.query` su cadena de consulta como objeto, y `NAV.back()` vuelve atrás.

## ¿Cómo comparto un ajuste entre las partes de la interfaz?

Con `ENV(nombre, valor)`; `ENV(nombre)` lo lee:

```js
ENV('apiurl', '/api/');
var url = ENV('apiurl');
```

## ¿Están los ayudantes de textos, números y fechas también en el navegador?

Sí: la biblioteca tiene `format` de un texto, un número y una fecha, `GUID`, `QUERIFY` y `NOW`, con los mismos resultados que en el servidor.

```js
var text = 'Hello {0}'.format('Anna');           // Hello Anna
var price = (1234.5).format(2);                  // 1 234.50
var day = NOW.format('yyyy-MM-dd');
var url = QUERIFY('/api/', { q: 'a b' });        // /api/?q=a%20b
var id = GUID(8);
```
