# Datos con DATA: preguntas y respuestas

## ¿Dónde guardo los registros de una aplicación nueva?

En la base de datos NoSQL embebida, a través de `DATA`, con el prefijo `nosql/` delante del nombre de la tabla. No necesita servidor, ni definición, ni dependencia:

```js
var items = await DATA.find('nosql/tbl_contact').sort('name').promise($);
```

El archivo es `databases/tbl_contact.nosql`.

## ¿Cómo listo registros?

```js
NEWACTION('Contacts|list', {
	name: 'List of contacts',
	action: async function($) {
		var items = await DATA.find('nosql/tbl_contact').sort('name').promise($);
		$.callback(items);
	}
});
```

## ¿Cómo leo un registro?

`DATA.read()` con `.id()`. `.error(404)` responde 404 cuando no existe:

```js
var item = await DATA.read('nosql/tbl_contact').id($.params.id).error(404).promise($);
```

## ¿Cómo inserto un registro?

Rellena el id con `UID()` y la fecha con `NOW` en la acción:

```js
model.id = UID();
model.dtcreated = NOW;
await DATA.insert('nosql/tbl_contact', model).promise($);
$.success(model.id);
```

## ¿Cómo actualizo un registro?

```js
model.dtupdated = NOW;
await DATA.modify('nosql/tbl_contact', model).id($.params.id).error(404).promise($);
$.success($.params.id);
```

## ¿Cómo borro un registro?

```js
await DATA.remove('nosql/tbl_contact').id($.params.id).error(404).promise($);
$.success($.params.id);
```

## ¿Cómo genero un id único?

`UID()`. Es una función del framework: sin paquete y sin `require`.

```js
model.id = UID();
```

## ¿Cómo filtro una consulta?

Con condiciones en el constructor: `where(field, value)`, `in(field, array)`, `notin(field, array)`, `search(field, keyword)`.

```js
var items = await DATA.find('tbl_tag').fields('id,search').where('folderid', id).promise($);
```

## ¿Cómo elijo los campos que devuelve una consulta?

`.fields('a,b')`. Nómbralos; no lo leas todo:

```js
var item = await DATA.read('tbl_user').fields('id,name').id(params.id).error('@(User not found)').promise($);
```

## ¿Cómo hago una lista con paginación, orden y filtros desde la query string?

Con `autoquery`: lee `?page=`, `limit`, `sort` y los campos que permitas, con un orden por defecto y un tamaño máximo de página.

```js
NEWACTION('Groups|list', {
	name: 'List of groups',
	action: function($) {
		DATA.find('op.view_group').autoquery($.query, 'id:UID,name,color,icon,users:Number,dtcreated:Date,dtupdated:Date', 'dtcreated_desc', 100).callback($);
	}
});
```

## ¿Cómo conecto la aplicación a PostgreSQL?

Pon la dirección de la base de datos en `config` y escribe una definición. Total.js 5 tiene su propio cliente de PostgreSQL desde la 0.0.20-4: no hay paquete que añadir.

```
database : postgresql://user:password@localhost/myapp
```

```js
// definitions/db.js
DATA.init('postgresql', '', CONF.database);
```

El nombre vacío es la base de datos por defecto. `?pooling=5` al final de la dirección mantiene un grupo de cinco conexiones.

Las consultas son las mismas llamadas a `DATA`, con el nombre de la tabla sin prefijo: `DATA.find('tbl_contact')`.

## ¿Cómo paso de la base de datos embebida a PostgreSQL?

Quita el prefijo `nosql/` de los nombres de las tablas, añade la definición con `DATA.init('postgresql', '', CONF.database)` y crea las tablas con `database.sql`. Las consultas no cambian:

```js
// before
var items = await DATA.find('nosql/tbl_contact').sort('name').promise($);

// after
var items = await DATA.find('tbl_contact').sort('name').promise($);
```

## ¿Qué es querybuilderpg?

El paquete que conectaba `DATA` con PostgreSQL antes de que Total.js 5 tuviera su propio cliente. Una aplicación hecha con él tiene `require('querybuilderpg').init(...)` en `definitions/db.js` y el paquete en `package.json`: déjala como está. Una aplicación nueva usa `DATA.init('postgresql', '', CONF.database)` y no añade ningún paquete.

## ¿Cómo ejecuto SQL directo?

`DATA.query()` con parámetros:

```js
await DATA.query('UPDATE tbl_ticket SET worked=worked+1 WHERE id=$1', [id]).promise($);
```

Prefiere los parámetros (`$1`). Cuando un valor tiene que ir en el texto, escápalo con `PG_ESCAPE(value)`. Nunca concatenes lo que envió un usuario.

## ¿Cómo respondo con éxito después de escribir, sin async?

`.callback($.done(id))` responde con el éxito de la aplicación y ese valor:

```js
DATA.remove('tbl_tag').id($.params.id).error(404).callback($.done($.params.id));
```

`.callback($)` responde en cambio con el resultado directo de la consulta.

## ¿Cómo uso DATA fuera de una petición?

`.promise()` sin `$`, con su propio control de errores, o un callback con el error primero:

```js
FUNC.refreshtags = async function() {
	REPO.tags = await DATA.find('tbl_tag').fields('id,search').promise();
};
```

## ¿Cómo busco un texto en varios campos?

Con `or` y `search`:

```js
builder.or(function(b) {
	b.search('name', text);
	b.search('email', text);
});
```

## ¿Tengo que configurar QueryBuilder para la base de datos embebida?

No. QueryBuilder viene cargado con Total.js 5 y el prefijo `nosql/` envía la consulta a la base de datos embebida. Solo un servidor de base de datos necesita una línea: `DATA.init('postgresql', '', CONF.database)`.

## ¿Cómo nombro las tablas y los campos en la base de datos embebida?

Como en SQL desde el primer día, para que la aplicación pueda pasar después a PostgreSQL: tablas `tbl_contact`, fechas `dtcreated` y `dtupdated`, indicadores `isdone`, una clave ajena como la tabla más `id` (`userid`).
