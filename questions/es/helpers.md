# Ayudantes de textos, números, fechas y listas, cookies, cabeceras y middleware: preguntas y respuestas

## ¿Cómo hago un slug a partir de un texto?

Con `slug` del texto. También quita los acentos:

```js
var a = 'Hello World!'.slug();     // hello-world
var b = 'Čaj s mlékom'.slug();     // caj-s-mlekom
```

## ¿Cómo compruebo que un texto es un correo, una URL o un teléfono?

Con `isEmail`, `isURL` e `isPhone` del texto. En la entrada de una acción usa en su lugar los tipos `Email`, `URL` y `Phone`.

```js
var ok = 'anna@example.com'.isEmail();          // true
var no = 'anna'.isEmail();                      // false
var url = 'https://www.totaljs.com'.isURL();    // true
var phone = '+421903111222'.isPhone();          // true
```

## ¿Cómo convierto un texto en un número, una fecha o un objeto?

Con `parseInt`, `parseFloat`, `parseDate` y `parseJSON` del texto. No lanzan errores: un texto que no es un número da `0`, y un texto que no es JSON da `undefined`.

```js
var count = '12'.parseInt();            // 12
var zero = 'abc'.parseInt();            // 0
var price = '12.5'.parseFloat();        // 12.5
var date = '2026-11-12'.parseDate();    // a Date
var obj = '{"a":1}'.parseJSON();        // { a: 1 }
var none = 'not json'.parseJSON();      // undefined
```

## ¿Cómo acorto un texto o lo escribo con mayúsculas iniciales?

`max(longitud)` corta el texto y lo termina con `...`; `capitalize()` empieza cada palabra con mayúscula:

```js
var short = 'A long text of a product'.max(10);    // A long ...
var name = 'anna nowak'.capitalize();              // Anna Nowak
```

## ¿Cómo codifico un texto para HTML?

Con `encode` del texto, y `decode` para la vuelta:

```js
var safe = '<b>x</b>'.encode();     // &lt;b&gt;x&lt;/b&gt;
var html = '&lt;b&gt;'.decode();    // <b>
```

## ¿Cómo calculo el hash de un texto?

`sha256()` y `md5()` del texto dan el hash en hexadecimal; `sha256(sal)` le mezcla un secreto. `hash()` da un número corto, bueno para una clave y no para una contraseña:

```js
var password = model.password.sha256(CONF.secret);
var key = 'text'.hash();    // 3556653
```

## ¿Cómo hago un texto para buscar sin acentos?

Con `toSearch` del texto: en minúsculas y sin acentos. Guárdalo en una columna `search` y compáralo con la misma forma de lo que escribió el usuario.

```js
model.search = model.name.toSearch();    // 'Čučoriedka Nowák' becomes 'cucoriedka nowak'
```

## ¿Cómo doy formato a un número?

Con `format(decimales)` del número; los separadores de miles y de decimales son los dos argumentos siguientes. `padLeft`, `round`, `floor` y `filesize` también son del número:

```js
var a = (1234.5).format(2);              // 1 234.50
var b = (1234.5).format(2, ',', '.');    // 1,234.50
var c = (5).padLeft(3);                  // 005
var d = (1.005).round(2);                // 1.01
var e = (2.567).floor(2);                // 2.56
var f = (1536).filesize();               // 1.50 KB
```

## ¿Cómo escribo un plural con un número?

Con `pluralize` del número y cuatro textos: para cero, uno, unos pocos y muchos. `#` es el número:

```js
var text = (3).pluralize('no items', '# item', '# items', '# items');    // 3 items
```

## ¿Cómo doy formato a una fecha?

Con `format` de la fecha:

```js
var a = NOW.format('yyyy-MM-dd HH:mm');    // 2026-11-12 09:05
var b = NOW.format('dd.MM.yyyy');          // 12.11.2026
```

## ¿Cómo sumo tiempo a una fecha?

Con `add` de la fecha y un texto: un número y una unidad. Devuelve una fecha nueva y no cambia la primera; un número negativo va hacia atrás.

```js
var tomorrow = NOW.add('1 day');
var before = NOW.add('-2 hours');
var expire = NOW.add('1 month');
```

## ¿Cómo ordeno una lista de objetos?

Con `quicksort` del array y el nombre del campo; `_desc` tras el nombre lo ordena hacia abajo, y varios campos se separan con una coma:

```js
items.quicksort('name');
items.quicksort('name_desc');
items.quicksort('age_desc,name');
```

## ¿Cómo busco, filtro y quito elementos de una lista?

Con las funciones del array, por el nombre de un campo y su valor:

```js
var item = items.findItem('id', 'b');                 // the object, or undefined
var index = items.findIndex('id', 'b');               // its position, or -1
var adults = items.findAll('age', 30);                // every object with that value
var name = items.findValue('id', 'b', 'name', '');    // one field of the object, or the default
var rest = items.remove('id', 'a');                   // the list without it
var page = items.skip(20).take(10);
var first = items.first();
var last = items.last();
```

## ¿Cómo hago un texto aleatorio o un id?

`UID()` es el id de una fila: corto y único. `GUID(longitud)` es un texto aleatorio de esa longitud, para un token:

```js
model.id = UID();
model.token = GUID(30);
```

## ¿Cómo copio un objeto?

Con `CLONE(obj)`: una copia profunda, así un cambio en la copia no llega al primer objeto.

```js
var copy = CLONE(MAIN.settings);
copy.theme.color = 'red';
```

## ¿Cómo construyo una dirección con su cadena de consulta?

Con `QUERIFY(url, obj)`: codifica los valores.

```js
var url = QUERIFY('/api/', { q: 'a b', page: 2 });    // /api/?q=a%20b&page=2
```

## ¿Cómo leo y pongo una cookie?

Con `$.cookie`: un argumento la lee, y con un valor se pone. El tercer argumento es cuánto dura y el cuarto sus opciones:

```js
ROUTE('GET /theme/', function($) {
	var theme = $.cookie('theme');
	$.cookie('theme', 'dark', '7 days', { httponly: true });
	$.plain(theme);
});
```

Una cookie que no existe es un texto vacío. Para quitar una, ponla con un tiempo en el pasado: `$.cookie('theme', '', '-1 day')`.

## ¿Cómo leo una cabecera de la petición y pongo una en la respuesta?

Las cabeceras de la petición están en `$.headers`, con sus nombres en minúsculas. Las de la respuesta están en `$.response.headers`, y su estado en `$.response.status`:

```js
ROUTE('GET /version/', function($) {
	var client = $.headers['x-client'];
	$.response.headers['x-version'] = '1.2.0';
	$.response.status = 201;
	$.json({ client: client });
});
```

## ¿Qué sabe la petición sobre el cliente?

`$.ip` es su dirección, `$.url` la ruta, `$.query` la cadena de consulta como objeto, `$.method` el método, `$.mobile` si es un móvil y `$.language` el idioma que devolvió `LOCALIZE`.

```js
ROUTE('GET /who/', function($) {
	$.json({ ip: $.ip, url: $.url, page: $.query.page, method: $.method, mobile: $.mobile });
});
```

## ¿Cómo ejecuto código antes de las rutas que lo necesitan (un middleware)?

Decláralo con `MIDDLEWARE` en una definición y nómbralo en la ruta con `#`. Llama a `next()` para seguir, o responde y la ruta no se ejecuta:

```js
// definitions/init.js
MIDDLEWARE('onlyjson', function($, next) {
	if (($.headers.accept || '').indexOf('application/json') === -1)
		$.invalid(400);
	else
		next();
});
```

```js
ROUTE('GET /report/ #onlyjson', function($) {
	$.json({ ok: true });
});
```

Para saber quién es el usuario usa `AUTH`, no un middleware.

## ¿Cómo hago una ruta para todas las direcciones bajo una ruta?

Con `*` al final de la ruta. Las partes de la dirección están en `$.split`:

```js
ROUTE('GET /docs/*', function($) {
	// /docs/guide/install/ gives ['docs', 'guide', 'install']
	$.json($.split);
});
```

La ruta responde también a `/docs/`.
