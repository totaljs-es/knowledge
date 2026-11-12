# Sesiones, Markdown, caché en disco, plantillas, copias, mantenimiento, comandos y auditoría: preguntas y respuestas

## ¿Cómo inicio la sesión de los usuarios con una sesión y una cookie?

Pasa a `AUTH` un objeto en vez de una función: el framework guarda las sesiones y lee la cookie, y `onread` carga el usuario de una sesión la primera vez. Guarda el objeto para iniciar y cerrar sesiones:

```js
// definitions/auth.js
var opt = {};

opt.secret = CONF.secret;
opt.cookie = 'session';
opt.expire = '5 minutes';
opt.strict = false;

opt.onread = async function(meta, next) {
	var user = await DATA.read('nosql/tbl_user').id(meta.userid).promise();
	if (user)
		next(null, { id: user.id, name: user.name });
	else
		next(404);
};

AUTH(opt);
MAIN.session = opt;
```

`expire` es cuánto guarda el framework una sesión en memoria antes de volver a leerla con `onread`, no cuánto dura la cookie. Una ruta con `+` necesita entonces un usuario con sesión, que está en `$.user`.

## ¿Cómo inicio y cierro la sesión de un usuario?

Tras comprobar la contraseña, `authcookie` del objeto de sesión pone la cookie; `logout` quita la sesión y la cookie:

```js
NEWACTION('Account|login', {
	name: 'Sign in',
	input: '*email:Email, *password:String',
	action: async function($, model) {
		var user = await DATA.read('nosql/tbl_user').where('email', model.email).promise($);
		if (!user || user.password !== model.password.sha256(CONF.secret)) {
			$.invalid('@(Invalid credentials)');
			return;
		}
		MAIN.session.authcookie($, UID(), user.id, '1 month');
		$.success();
	}
});

NEWACTION('Account|logout', {
	name: 'Sign out',
	action: function($) {
		MAIN.session.logout($);
		$.success();
	}
});
```

```js
ROUTE('-POST /api/login/   --> Account|login');
ROUTE('+GET  /api/logout/  --> Account|logout');
```

Los argumentos de `authcookie` son el id de la sesión nueva, el id del usuario y cuánto dura la cookie.

## ¿Cómo convierto Markdown en HTML?

Con `markdown` del texto. Sin paquete:

```js
var html = '# Title\n\nSome **bold** text.'.markdown();
```

El resultado está dentro de un `<div class="markdown">`.

## ¿Cómo guardo en disco un resultado lento?

Con `FILECACHE`: un id, cuánto vale, el callback que recibe el valor y la función que lo crea cuando no hay. A diferencia de `CACHE`, sigue ahí tras un reinicio:

```js
FILECACHE('rates', '1 hour', function(err, rates) {
	$.callback(rates);
}, function(next) {
	RESTBuilder.GET(CONF.ratesurl).callback(next);
});
```

## ¿Cómo pinto una plantilla de texto en el servidor?

Con `TEMPLATE(texto, modelo)`, que devuelve una promesa. La plantilla es Tangular y el modelo es `value`:

```js
var html = await TEMPLATE('<b>{{ value.name }}</b> has {{ value.count }} items', { name: 'Anna', count: 3 });
```

## ¿Cómo hago una copia de una carpeta y la restauro?

`BACKUP(archivo, carpeta, callback)` escribe la carpeta en un archivo, y `RESTORE(archivo, carpeta, callback)` la vuelve a escribir:

```js
BACKUP(PATH.root('backup.package'), PATH.root('databases'), function(err, meta) {
	// meta.files and meta.size
});

RESTORE(PATH.root('backup.package'), PATH.root('restored'), function(err, meta) {
});
```

## ¿Cómo pongo la aplicación en mantenimiento?

Con `PAUSESERVER(nombre, true)`: cada petición se responde con 503 hasta `PAUSESERVER(nombre, false)`. El nombre es el motivo, para que dos motivos no se anulen entre sí:

```js
PAUSESERVER('import', true);

importrows(function() {
	PAUSESERVER('import', false);
});
```

## ¿Cómo ejecuto un comando del sistema?

Con `SHELL(comando, callback)`; el callback recibe el error y la salida. Nunca pongas texto de un usuario en el comando:

```js
SHELL('df -h', function(err, output) {
	console.log(output);
});
```

## ¿Cómo comparo la lista de un formulario con la lista de la base de datos?

Con `DIFFARR(campo, db, formulario)`: dice qué añadir, qué actualizar y qué ids quitar.

```js
var diff = DIFFARR('id', db, model.items);

// diff.add: the items that are only in the form
// diff.upd: [{ db: item, form: item }] for the items in both
// diff.rem: the ids that are only in the database
```

## ¿Cómo descargo un archivo de otro servidor?

Con `DOWNLOAD(url, archivo, callback)`: guarda la respuesta en el archivo.

```js
DOWNLOAD(CONF.reporturl, PATH.root('report.pdf'), function(err, response) {
	if (err || response.status !== 200)
		return;
	// response.size is the size of the file
});
```

## ¿Cómo me envío por correo un error o una nota?

Con `LOGMAIL(correo, asunto, texto)`: un mensaje sencillo, sin vista. Usa el servidor de correo de `config`.

```js
LOGMAIL('admin@example.com', 'Import failed', 'The import stopped at the row 12');
```

En Total.js 5 0.0.19 pásale un texto: un objeto como cuerpo falla.

## ¿Cómo registro quién hizo qué?

Con `$.audit(mensaje)` en una acción: escribe una línea en `logs/audit.log` con el usuario, la dirección del cliente, la URL, la acción y sus datos.

```js
NEWACTION('Orders|remove', {
	name: 'Remove an order',
	params: '*id:UID',
	action: async function($) {
		await DATA.remove('nosql/tbl_order').id($.params.id).error(404).promise($);
		$.audit('order removed');
		$.success($.params.id);
	}
});
```

## ¿Cómo uno varios scripts en un archivo?

Con `MERGE` en una definición: la dirección del resultado y los archivos, que se buscan en `public/js/`. El resultado va minificado:

```js
// definitions/init.js
MERGE('/js/all.js', 'first.js', 'second.js');
```

```html
<script src="/js/all.js"></script>
```

## ¿Necesito un paso de compilación para minificar CSS y JavaScript?

No. El framework minifica los archivos `.js` y `.css` de `public/` al servirlos: quita comentarios y espacios. Sin empaquetador y sin paquete.

```css
.box { display: flex; border-radius: 4px; }
.box > div { transition: all 0.2s; }
```

```css
.box{display:flex;border-radius:4px}.box>div{transition:all 0.2s}
```

El segundo bloque es lo que recibe el navegador.

## ¿Cómo reenvío las peticiones de una ruta a otro servidor?

Con `PROXY(ruta, destino)` en una definición. `.copy('replace')` conserva el resto de la dirección: `/remote/hello/` llega al otro servidor como `/hello/`, con su cadena de consulta:

```js
// definitions/init.js
PROXY('/remote/', 'http://127.0.0.1:8001/').copy('replace');
```

Sin `.copy('replace')` todas las direcciones bajo la ruta van a la raíz del destino. El otro servidor recibe la dirección del cliente en la cabecera `x-forwarded-for`.
