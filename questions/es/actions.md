# Acciones: preguntas y respuestas

## ¿Qué es una acción?

Una unidad de lógica del servidor: un nombre, la entrada que acepta, quién puede llamarla y una función. Se define con `NEWACTION` en un archivo de `schemas/`:

```js
NEWACTION('Contacts|create', {
	name: 'Create a contact',
	input: '*name:String, email:Email, phone:Phone',
	action: async function($, model) {
		model.id = UID();
		model.dtcreated = NOW;
		await DATA.insert('nosql/tbl_contact', model).promise($);
		$.success(model.id);
	}
});
```

## ¿Cómo nombro una acción?

`Colección|verbo`: la colección en plural con mayúscula inicial, una barra vertical y el verbo. `Tickets|list`, `Groups|create`, `Users|remove`. Nunca `/` entre las partes.

```js
NEWACTION('Tickets|list', {
	name: 'List of tickets',
	action: function($) {
		DATA.find('nosql/tbl_ticket').callback($);
	}
});
```

## ¿Qué verbos usan las acciones?

| Verbo | Qué hace |
|---|---|
| `list` | devuelve una colección |
| `read` | devuelve un registro |
| `create` | inserta y responde con el id nuevo |
| `update` | modifica un registro |
| `save` | crea o actualiza según el `id` |
| `remove` | borra un registro |

## ¿Dónde pongo las acciones?

En `schemas/`, un archivo por colección: `schemas/contacts.js`. En una aplicación con plugins, en `plugins/<nombre>/schemas/`. Las rutas que las llaman van en `controllers/` o en el `index.js` del plugin.

## ¿Cómo declaro la entrada de una acción?

Con un texto en `input`: los campos separados por comas, `*` delante de un campo obligatorio y el tipo después de `:`.

```js
input: '*name:String, email:Email, phone:Phone, isactive:Boolean, tags:[String]'
```

El cuerpo llega validado como segundo argumento de la función: `action: function($, model)`.

## ¿Qué tipos puede tener un campo?

`String`, `String(100)` con una longitud máxima, `Number`, `Boolean`, `Date`, `UID`, `Email`, `Phone`, `URL`, `Color`, `Icon`, y una lista con corchetes: `[String]`. Un valor incorrecto responde 400 con el nombre del campo.

## ¿Cómo leo el id de la dirección?

Decláralo en `params` y léelo en `$.params`:

```js
NEWACTION('Contacts|read', {
	name: 'Read a contact',
	params: '*id:UID',
	action: async function($) {
		var item = await DATA.read('nosql/tbl_contact').id($.params.id).error(404).promise($);
		$.callback(item);
	}
});
```

La ruta lleva `{id}` en su dirección: `ROUTE('+API ? -contacts_read/{id} --> Contacts|read')`.

## ¿Cómo leo la query string en una acción?

Declárala en `query` y léela en `$.query`:

```js
NEWACTION('Items|list', {
	name: 'List of items',
	query: 'search:String',
	action: function($) {
		$.callback($.query.search);
	}
});
```

## ¿Cómo responde una acción?

| Llamada | Uso |
|---|---|
| `$.callback(data)` | devuelve datos: un registro, una lista |
| `$.success()` o `$.success(id)` | la respuesta de éxito, con un valor si lo pasas |
| `$.invalid(404)` | un error con ese estado HTTP |
| `$.invalid('@(Text for the user)')` | un error de validación o de negocio |

Responde una sola vez en cada camino, y pon `return` después de una respuesta anticipada.

## ¿Cómo respondo que un registro no existe?

`$.invalid(404)`. Con `DATA`, `.error(404)` lo hace cuando la consulta no encuentra nada:

```js
if (!item) {
	$.invalid(404);
	return;
}
```

```js
var item = await DATA.read('nosql/tbl_contact').id($.params.id).error(404).promise($);
```

## ¿Cómo respondo con un mensaje de error para el usuario?

`$.invalid('@(texto)')`. El `@(...)` marca el texto para traducirlo; el texto se escribe en inglés, que es la clave:

```js
if (MAIN.monitor.sites.findItem('url', model.url)) {
	$.invalid('@(The website is already in the list)');
	return;
}
```

## ¿Cómo restrinjo una acción a algunos usuarios?

Con `permissions` o `user: true` en la acción. El `+` de la ruta pide un usuario con sesión; la comprobación de la acción también protege una llamada que no viene de esa ruta.

```js
NEWACTION('Redirects|save', {
	name: 'Save redirect',
	input: 'id,*url,*target,permanent:Boolean',
	permissions: 'redirects,admin',
	action: function($, model) {
		$.success();
	}
});
```

## ¿Cómo reutilizo los campos de una entrada?

Con un esquema con nombre y `@`:

```js
NEWSCHEMA('@Group', '*name,color:Color,icon:Icon,reference,permissions:[String]');

NEWACTION('Groups|create', {
	name: 'Create group',
	input: '@Group',
	action: function($, model) {
		$.success();
	}
});
```

## ¿Cómo llamo a una acción desde otra?

`$.action('Nombre').promise()` dentro de una acción, y `ACTION('Nombre', model)` fuera de una petición:

```js
var types = await $.action('Items|types').promise();
```

```js
ACTION('Sites|check').callback(ERROR('Sites|check'));
```

## ¿Por qué mi acción es async?

Porque espera a la base de datos. Pasa `$` a `.promise($)`: así un error de la consulta responde la petición por sí solo.

```js
action: async function($) {
	var item = await DATA.read('nosql/tbl_contact').id($.params.id).error(404).promise($);
	$.callback(item);
}
```

## ¿Toda acción necesita un nombre?

Sí: `name` es un texto corto para personas ("Save redirect"). Lo usan los registros y las herramientas. El primer argumento de `NEWACTION` es su identificador (`Redirects|save`).

## ¿Por qué mi lista obligatoria rechaza una lista vacía?

Un campo `*tags:[String]` es obligatorio, y una lista vacía cuenta como ausente. Si una lista vacía es válida, quita el `*`: `tags:[String]`.

## ¿Por qué mi Boolean es false cuando no se envió el campo?

Un `Boolean` ausente es `false`. Cuando la ausencia debe significar «sin cambios», declara la acción con `partial: true`.
