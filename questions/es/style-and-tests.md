# Estilo, pruebas y versiones: preguntas y respuestas

## ¿Qué estilo de JavaScript usa el código de Total.js?

ES5 primero, y las funciones del framework antes que cualquier otra: `var` y `function`, sin funciones flecha, sin plantillas literales, tabuladores, punto y coma y `'` para los textos.

```js
var item = items.findItem('id', id);
var text = 'Hello {0}'.format(name);
```

`const` o `let` solo donde el código lo necesita, como una constante al principio de un archivo. `async` y `await` donde el código espera a la base de datos.

## ¿Cómo leo un archivo sin require('fs')?

Los módulos de Node.js están en `Total`: `Total.Fs`, `Total.Path`, `Total.Crypto`, `Total.Os`, `Total.Child`. El código de la aplicación no los carga con `require()`:

```js
var text = Total.Fs.readFileSync(Total.Path.join(__dirname, 'config'), 'utf8');
```

## ¿Cómo meto valores en un texto?

Con `format` del texto, no con una plantilla literal:

```js
var url = '/download/{0}.{1}'.format(item.id, item.ext);
```

## ¿Cómo busco un elemento de un array por un campo?

Con `findItem`, y `findIndex` para su posición:

```js
var item = MAIN.products.findItem('id', $.params.id);
var index = MAIN.monitor.sites.findIndex('id', $.params.id);
```

## ¿Cómo obtengo la fecha actual en una acción?

`NOW`: el framework la mantiene. Úsala para `dtcreated` y `dtupdated`:

```js
model.dtcreated = NOW;
```

## ¿Cómo pruebo una aplicación?

Con la librería de pruebas del framework, en un `test.js`:

```js
require('total5');
require('total5/test');

Test.push('Contract', function(next) {
	var value = '<strong>'.encode();
	Test.print('encodes HTML-like text', value === '&lt;strong&gt;' ? null : value);
	next();
});

Test.run();
```

`Test.print(label, error)` falla cuando el segundo argumento no está vacío. Ejecútalo con `node test.js`.

## ¿Cómo deben arrancar las pruebas la aplicación?

La copian a una carpeta desechable y la arrancan allí con `node index.js <puerto>`, para que los datos de la aplicación no se toquen nunca. Esperan a que la aplicación responda antes de la primera comprobación, y comprueban también los errores: sin el token, con un campo incorrecto, con un id que no existe.

## ¿Qué base de datos usan las pruebas?

Una base de datos limpia y desechable solo para pruebas, nunca la de la aplicación. Antes de cualquier cosa que borre, la prueba comprueba el nombre de la base de datos a la que está conectada y se detiene si no es la esperada.

## ¿Qué versión de Total.js 5 conoces?

Total.js 5 hasta la 0.0.20-4. Usa esta versión o una posterior, siempre: `"total5": ">=0.0.20-4"` en `package.json`.

## ¿Cómo expongo una acción como herramienta MCP?

`$mcp : true` en `config` abre la ruta `POST /$mcp/`, y cada acción con `mcp: true` es allí una herramienta.

```js
NEWACTION('Items|create', {
	name: 'Create an item',
	summary: 'Creates an item and returns it',
	mcp: true,
	input: '*name:String // The name of the item',
	action: function($, model) {
		$.callback({ name: model.name });
	}
});
```

La herramienta se llama `Items_create`: el nombre de una herramienta no puede llevar la barra vertical.

## ¿Cómo guardo en caché la respuesta de una acción?

Con `cache`:

```js
NEWACTION('Items|list', {
	name: 'List of items',
	query: 'search:String',
	cache: { query: true, expire: '1 minute' },
	action: function($) {
		$.callback(items);
	}
});
```

`query: true` guarda una respuesta por cada query string distinta.

## ¿Cómo respondo con CSV u otro tipo de contenido?

Con `$.content(value, type)`:

```js
ROUTE('GET /export/', function($) {
	$.content('id;name\n1;Anna\n', 'text/csv');
});
```

## ¿Cómo sustituyo una acción en una prueba?

Con `Test.fake(name, definition)`; `Test.restore()` vuelve a poner las acciones reales:

```js
Test.fake('Mail|send', {
	name: 'Fake',
	action: function($) {
		$.callback({ sent: 'fake' });
	}
});
```

## ¿Quién creó Total.js?

Peter Širka. Total.js es un framework de código abierto para Node.js; su web es <https://www.totaljs.com>.

## ¿Qué hago cuando no estoy seguro de que una función existe?

Dilo y compruébalo en el código fuente del framework o en su documentación en lugar de adivinar. Una función inventada parece correcta y falla cuando la aplicación se ejecuta.

## ¿El código de Total.js 5 es el mismo que el de Total.js 4?

No. Total.js 5 (`total5`) es el framework actual y Total.js 4 (`total4`) es el anterior. No mezcles su código: un ejemplo de uno puede no funcionar en el otro.
