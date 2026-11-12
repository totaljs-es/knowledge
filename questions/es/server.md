# Correo, traducciones, redirecciones, CORS, cifrado, caché e hilos: preguntas y respuestas

## ¿Cómo envío un correo?

Con `MAIL`, que está en el framework: la dirección, el asunto, una vista para el cuerpo y su modelo. El servidor de correo va en `config`:

```
mail_smtp          : smtp.example.com
mail_smtp_options  : {"port":465,"secure":true,"user":"shop@example.com","password":"..."}
mail_from          : shop@example.com
```

```js
MAIL('anna@example.com', 'Welcome', 'mails/welcome', { name: 'Anna' }, function(err) {
	err && console.error(err);
});
```

```html
@{layout('')}
<p>Welcome, @{model.name}</p>
```

La vista es `views/mails/welcome.html`. No hace falta ningún paquete para el correo.

## ¿Cómo envío un correo en el idioma del usuario?

Pasa el idioma a `MAIL` antes del callback. El asunto y la vista se traducen cuando sus textos están en `@(...)`:

```js
MAIL('anna@example.com', '@(Welcome)', 'mails/welcome', { name: 'Anna' }, 'sk', function(err) {
	err && console.error(err);
});
```

## ¿Cómo envío un correo sin una vista?

Con `HTMLMAIL`: el cuerpo es el propio HTML.

```js
HTMLMAIL('anna@example.com', 'Your order', '<b>Thanks</b>', function(err) {
	err && console.error(err);
});
```

## ¿Cómo traduzco los textos de una aplicación?

Escribe cada texto para personas en inglés dentro de `@(...)` y añade un archivo por idioma en `resources/`. Una línea es la clave y la traducción; la clave es `T` y el hash del texto en inglés:

```html
<h1>@(Welcome)</h1>
```

```
T1bx8wg2 : Vitajte
```

```js
var key = 'T' + 'Welcome'.hash(true).toString(36);
```

Esa línea está en `resources/sk.resource`. Un texto sin traducción se queda en inglés.

## ¿Cómo sabe la aplicación el idioma de una petición?

Con `LOCALIZE` en una definición: una función que devuelve el idioma de la petición. Las vistas se pintan en él, y está en `$.language`:

```js
// definitions/init.js
LOCALIZE(function($) {
	return $.query.language || '';
});
```

Un texto vacío es el idioma por defecto: los textos tal como están escritos.

## ¿Cómo traduzco un texto en el código?

Con `TRANSLATE(idioma, texto)`: traduce cada `@(...)` del texto.

```js
var text = TRANSLATE('sk', '@(Welcome)');
```

## ¿Cómo redirijo a otra dirección?

Con `$.redirect(url)`. Responde 302; `true` como segundo argumento responde 301, una redirección permanente:

```js
ROUTE('GET /old/', function($) {
	$.redirect('/new/');
});

ROUTE('GET /moved/', function($) {
	$.redirect('/new/', true);
});
```

## ¿Cómo hago mi propia página para una dirección que no existe?

Con la ruta `#404`: se ejecuta para cada dirección sin ruta. Pon el estado, porque la respuesta de una ruta es 200:

```js
ROUTE('#404', function($) {
	$.response.status = 404;
	$.view('404');
});
```

## ¿Cómo permito peticiones desde otro sitio web (CORS)?

Con `CORS` en una definición y el origen permitido. `CORS()` sin origen permite cualquier sitio web:

```js
// definitions/init.js
CORS('https://shop.example.com');
```

Una petición de un origen permitido recibe la cabecera `access-control-allow-origin`, también la petición previa `OPTIONS`. Una petición de otro origen se responde con 400, y una petición sin la cabecera `Origin` (un servidor, `curl`) no se ve afectada. Sin paquete y sin middleware.

## ¿Cómo limito las peticiones de una dirección?

Con `$httpreqlimit` en `config`: cuántas peticiones puede hacer una dirección IP en un minuto. Las que pasan del límite se responden con 503 hasta el minuto siguiente:

```
$httpreqlimit : 200
```

`0`, el valor por defecto, es sin límite.

## ¿Cómo cifro y descifro un valor?

Con `ENCRYPT(valor, clave)` y `DECRYPT(texto, clave)`. El valor puede ser un objeto; el resultado es un texto para un enlace o una cookie:

```js
var token = ENCRYPT({ id: 'abc', expire: 123 }, 'download');
var data = DECRYPT(token, 'download');

if (!data)
	$.invalid(401);
```

`DECRYPT` devuelve `null` con otra clave y con un texto que fue cambiado. Los dos usan el `secret` de `config`, así que pon a la aplicación el suyo.

## ¿Cómo guardo un valor en memoria durante un tiempo?

Con `CACHE`: `CACHE.set(clave, valor, caducidad)` y `CACHE.read(clave)`, que no devuelve nada cuando el tiempo ha pasado.

```js
var rates = CACHE.read('rates');

if (!rates) {
	rates = { eur: 1, usd: 1.1 };
	CACHE.set('rates', rates, '1 minute');
}
```

Es la memoria del proceso: un reinicio la vacía. Para un valor que debe seguir tras un reinicio usa `MEMORIZE`.

## ¿Cómo ejecuto trabajo pesado sin bloquear la aplicación?

En un hilo. El trabajo es un archivo en `workers/`, y `NEWTHREAD(nombre, datos)` lo arranca:

```js
// workers/sum.js
require('total5');

var worker = NEWTHREAD();
var total = 0;

for (var i = 1; i <= worker.data.max; i++)
	total += i;

worker.postMessage({ total: total });
```

```js
ROUTE('GET /sum/', function($) {
	var worker = NEWTHREAD('sum', { max: 1000 });
	worker.on('message', function(msg) {
		worker.terminate();
		$.json(msg);
	});
});
```

Dentro del worker, `NEWTHREAD()` sin nombre es el propio hilo: `worker.data` es lo que envió la aplicación.
