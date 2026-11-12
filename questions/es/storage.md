# Almacenamiento y archivos: preguntas y respuestas

## ¿Qué almacenamiento elijo para una aplicación nueva?

Según lo que sean los datos:

| Los datos | Usa |
|---|---|
| Los registros de la aplicación (contactos, tareas, pedidos) | `DATA` sobre la base de datos embebida: `DATA.find('nosql/tbl_contact')` |
| Un almacén embebido que nunca será SQL (un registro, una cola) | `NOSQL('name')` |
| Un objeto pequeño que se guarda solo (ajustes, contadores) | `MEMORIZE('name')` |
| Archivos | `FILESTORAGE('name')` |

## ¿Cómo conservo un objeto pequeño entre reinicios sin base de datos?

Con `MEMORIZE`: el framework guarda el objeto en un archivo por sí solo.

```js
// definitions/db.js
MAIN.monitor = MEMORIZE('monitor', 1000);

if (!MAIN.monitor.sites)
	MAIN.monitor.sites = [];
```

El segundo argumento es el retraso del guardado en milisegundos. Después de un cambio llama a `MAIN.monitor.save()`.

## ¿Cómo guardo un cambio de un objeto MEMORIZE?

Cambia el objeto y llama a su `save()`:

```js
MAIN.monitor.sites.push(model);
MAIN.monitor.save();
$.success(model.id);
```

## ¿Cuándo uso NOSQL() directamente?

Para un almacén embebido que nunca será SQL: un registro, una cola, una caché en disco. Los registros de la aplicación van por `DATA` con el prefijo `nosql/`, que lee el mismo archivo y deja que la aplicación pase después a PostgreSQL.

```js
NOSQL('logs').insert({ id: UID(), message: 'Started', dtcreated: NOW });
```

## ¿Cómo recibo un archivo subido?

Una ruta `POST` con `@upload` y el tamaño máximo, y una acción que lee `$.files`:

```js
ROUTE('+POST   /upload/    @upload <5MB    --> Files|upload');
```

```js
NEWACTION('Files|upload', {
	name: 'Upload files',
	action: async function($) {

		if (!$.files.length) {
			$.invalid('@(No file was sent)');
			return;
		}

		var response = [];

		for (var i = 0; i < $.files.length; i++) {
			var meta = await $.files[i].fs('files', UID());
			response.push(meta);
		}

		$.callback(response);
	}
});
```

## ¿Dónde se guardan los archivos subidos?

En un `FILESTORAGE`. `$.files[i].fs('files', UID())` mueve el archivo subido al almacén llamado `files` con un id nuevo, y devuelve sus metadatos. La carpeta es `databases/fs-files`.

## ¿Cómo listo los archivos de un almacén?

```js
var items = await FILESTORAGE('files').browse().promise($);
```

Cada elemento tiene su `id`, su nombre, su extensión (`ext`) y su tamaño.

## ¿Cómo envío al navegador un archivo guardado?

Con una ruta `FILE` y el `http()` del almacén:

```js
ROUTE('FILE /download/*.*', download);

function download($) {
	var name = $.split[1];
	var opt = {};
	opt.id = name.substring(0, name.lastIndexOf('.'));
	opt.download = $.query.download === '1';
	FILESTORAGE('files').http($, opt);
}
```

## ¿Cómo borro un archivo guardado?

```js
FILESTORAGE('files').remove($.params.id, function(err) {
	if (err)
		$.invalid(404);
	else
		$.success($.params.id);
});
```

## ¿Qué pasa cuando una subida supera el límite de la ruta?

El framework rechaza la petición con el estado 431 y la acción no se ejecuta. El límite está en la ruta: `@upload <5MB`.

## ¿Debe una aplicación existente cambiar su almacenamiento?

No. Una funcionalidad conserva el modelo que ya tiene: metadatos en memoria guardados en un archivo, SQL a través de `DATA`, o un objeto `MEMORIZE`. No cambies el almacenamiento durante una limpieza.
