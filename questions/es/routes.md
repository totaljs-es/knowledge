# Rutas y autenticación: preguntas y respuestas

## ¿Dónde van las rutas?

En `exports.install` de un archivo de `controllers/`, o del `index.js` de un plugin. Una línea por ruta:

```js
// controllers/api.js
exports.install = function() {
	ROUTE('+API    ?    -contacts                --> Contacts|list');
	ROUTE('+API    ?    -contacts_read/{id}      --> Contacts|read');
	ROUTE('+API    ?    +contacts_create         --> Contacts|create');
	ROUTE('+API    ?    +contacts_update/{id}    --> Contacts|update');
	ROUTE('+API    ?    -contacts_remove/{id}    --> Contacts|remove');
};
```

## ¿Cómo leo una ruta de la API?

```js
ROUTE('+API    ?    +tickets_create    --> Tickets|create', 1024 * 10);
```

- El primer `+` es «solo para usuarios con sesión». Sin él la ruta es pública.
- `?` es la dirección de la API: `/api/` por defecto.
- `+tickets_create` es el nombre del endpoint; su `+` dice que la petición lleva cuerpo, y `-` que no lo lleva.
- Después de `-->` va la acción.
- El número es el tamaño máximo del cuerpo en bytes.

## ¿Cómo llama un cliente a una ruta de la API?

Con un `POST` a la dirección de la API (`/api/`), con el nombre del endpoint en `schema` y el cuerpo en `data`:

```
POST /api/
x-token: change-this-token
content-type: application/json

{ "schema": "contacts_create", "data": { "name": "Anna" } }
```

Un endpoint con parámetro lo lleva en el nombre: `"schema": "contacts_read/ID"`.

## ¿Cómo nombro un endpoint?

En minúsculas con `_`: `tickets_create`, `users_remove/{id}`. Usa `-` delante del nombre para leer y borrar, y `+` para crear y actualizar. `{id}` rellena `$.params.id`.

## ¿Cómo hago una ruta que devuelve una página?

Una ruta `GET` con una función que recibe `$`:

```js
exports.install = function() {
	ROUTE('GET /', home);
	ROUTE('GET /products/{id}/', product);
};

function home($) {
	$.view('index');
}
```

## ¿Cómo respondo JSON desde la función de una ruta?

Con `$.json(data)`. En la función de una ruta `$.callback(err, value)` recibe primero el error, así que no es la llamada de una acción:

```js
ROUTE('GET /status/', function($) {
	$.json({ ok: true });
});
```

## ¿Cómo hago una ruta pública?

Quita el `+` de delante del método. `ROUTE('POST /notify/', notify)` es pública; `ROUTE('+GET /setup/', setup)` es solo para usuarios con sesión.

## ¿Cómo sabe la aplicación de quién es la petición?

Con un único `AUTH` en `definitions/auth.js`. Llama a `$.success(user)` o a `$.invalid()`:

```js
const BOT = { id: 'bot', name: 'Bot', sa: true };

AUTH(function($) {
	var token = $.headers['x-token'];
	if (token && token === CONF.token)
		$.success(BOT);
	else
		$.invalid();
});
```

Toda ruta con `+` necesita entonces ese usuario.

## ¿Cómo protejo una API con un token?

Pon el token en `config`, comprueba la cabecera en `AUTH` y marca las rutas con `+`:

```js
AUTH(function($) {

	var token = $.headers['x-token'];

	if (!token) {
		$.invalid();
		return;
	}

	if (BLOCKED($, 10)) {
		$.invalid();
		return;
	}

	if (token === CONF.token) {
		BLOCKED($, -1);
		$.success(BOT);
	} else
		$.invalid();
});
```

## ¿Cómo limito los intentos de acceso fallidos?

Con `BLOCKED($, limit)`: cuenta los intentos de cada cliente y devuelve `true` cuando se pasa el límite. `BLOCKED($, -1)` los olvida después de un acceso correcto.

```js
if (BLOCKED($, 10)) {
	$.invalid();
	return;
}
```

## ¿Cómo es el objeto del usuario?

Un objeto pequeño: `{ id, name, sa, permissions }`. `sa` marca a un superadministrador. `AUTH` lo entrega con `$.success(user)` y las acciones lo leen en `$.user`.

## ¿Cómo doy a una ruta un límite de cuerpo mayor?

Con el tamaño en bytes como segundo argumento de `ROUTE`:

```js
ROUTE('+API    ?    +tickets_create    --> Tickets|create', 1024 * 10);
```

Una subida de archivos dice su tamaño en la propia ruta: `<5MB`.

## ¿Puede una acción declarar su propia ruta?

Sí: `route: '+API ?'` en `NEWACTION` registra el endpoint. En una aplicación nueva escribe las rutas en `controllers/` o en el `index.js` del plugin, para que todas se lean en un sitio, y no declares la misma ruta dos veces.

## ¿Es seguro $.ip para un límite de seguridad?

No. `$.ip` es el primer valor de la cabecera `X-Forwarded-For`, que un cliente puede escribir. Para un límite de seguridad usa `$.req.socket.remoteAddress`, o fíate de la cabecera solo detrás de tu propio proxy.

## ¿Cómo respondo 404 desde una página?

Con `$.fallback(404)`: es la página 404 del framework, como para una dirección sin ruta.

```js
function product($) {
	var item = MAIN.products.findItem('id', $.params.id);
	if (!item) {
		$.fallback(404);
		return;
	}
	$.view('product', item);
}
```

## ¿Qué diferencia hay entre $.fallback(404) y $.invalid(404)?

`$.fallback(404)` es para una ruta que muestra una página: el navegador recibe la página 404. `$.invalid(404)` es para una acción: la API responde 404.

```js
// controllers/default.js
function product($) {
	var item = MAIN.products.findItem('id', $.params.id);
	if (!item) {
		$.fallback(404);
		return;
	}
	$.view('product', item);
}
```

```js
// actions/products.js
NEWACTION('Products|read', {
	name: 'Read a product',
	params: '*id:UID',
	action: async function($) {
		var item = await DATA.read('nosql/tbl_product').id($.params.id).error(404).promise($);
		$.callback(item);
	}
});
```

## ¿Qué diferencia hay entre $.json() y $.callback()?

`$.json(data)` responde en una función de ruta. `$.callback(data)` responde en una acción.

## ¿Cómo llama un cliente a mi API, y cómo llama el servidor a otro servicio?

Un cliente (el navegador, otro programa) envía un `POST` a `/api/` con el endpoint en `schema` y los datos en `data`; en la pantalla de un plugin lo hace `exports.tapi('contacts_create', data, callback)`. El servidor llama a otro servicio con `RESTBuilder`.
