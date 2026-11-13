# La aplicación: preguntas y respuestas

## ¿Qué carpetas tiene una aplicación Total.js 5?

El framework carga cada carpeta por su nombre:

```
index.js            the official start script
config              settings, one "key : value" per line
package.json        "total5" is the dependency
controllers/        routes
definitions/        auth.js, init.js, func.js, db.js: loaded at start
actions/            actions (an older application has them in schemas/)
modules/            integrations with other systems
plugins/<name>/     a feature with its server part and its screen
views/              layout and pages
public/             static files for the browser
```

Una API pequeña solo necesita `index.js`, `config`, `package.json`, `controllers/`, `actions/` y `definitions/`.

## ¿Qué va en index.js?

El script de arranque oficial de Total.js 5, entero y sin cambios: `helpers/index.js` del framework. Su núcleo es este, y las opciones comentadas del archivo oficial se quedan en él:

```js
require('total5');

const options = {};

options.release = process.argv.includes('--release');
options.servicemode = process.argv.includes('--service') || process.argv.includes('--servicemode');

Total.run(options);
```

No escribas uno más corto a mano ni le cambies el estilo: es el único archivo que conserva su propio estilo.

## ¿Cómo arranco una aplicación Total.js 5?

```
npm install
node index.js 8000
```

El número es el puerto. Añade `--release` para el modo release: `node index.js 8000 --release`.

## ¿Qué necesita package.json?

Solo `total5`. El framework lleva dentro el servidor, las rutas, las plantillas, el constructor de consultas y las pruebas:

```json
{
	"name": "contacts",
	"version": "1.0.0",
	"private": true,
	"dependencies": {
		"total5": ">=0.0.20-2"
	}
}
```

## ¿Cómo se escribe el archivo config?

Es un archivo de texto llamado `config`, sin extensión, con un `clave : valor` por línea. Una línea que empieza por `//` es un comentario:

```
name              : Contacts

// The requests of the API must send this value in the header "x-token"
token             : change-this-token
```

El código lee un valor con `CONF.token`. No es JSON y no es un archivo `.env`.

## ¿Dónde leo un ajuste en el código?

En `CONF`, con la clave del archivo `config`:

```js
if (token === CONF.token)
	$.success(BOT);
```

Los ajustes que son del framework empiezan por `$`, como `$api`. Las claves y las direcciones de las bases de datos se quedan fuera del repositorio.

## ¿Dónde van las funciones de ayuda compartidas?

En `definitions/func.js`, como funciones de `FUNC`, con el nombre en minúsculas y sin separadores:

```js
// definitions/func.js
FUNC.refreshtags = async function() {
	REPO.tags = await DATA.find('tbl_tag').fields('id,search').promise();
};
```

Las acciones y los controladores llaman a `FUNC.refreshtags()`.

## ¿Dónde guardo estado en memoria?

En `MAIN`, el objeto de la aplicación, que se rellena en un archivo de `definitions/`:

```js
// definitions/db.js
MAIN.products = [
	{ id: 'bread', name: 'Sourdough bread', price: 4.5 }
];
```

`REPO` guarda consultas en caché que la interfaz también necesita. No crees globales nuevas.

## ¿Dónde va el trabajo del arranque?

En `ON('ready', ...)` de `definitions/init.js`: se ejecuta cuando la aplicación está en marcha.

```js
// definitions/init.js
ON('ready', function() {
	COMPONENTATOR('ui', 'exec,locale,input,form,validate', true);
});
```

## ¿Cómo nombro los archivos y las carpetas?

Todo en minúsculas, las palabras separadas por `-`, nunca `_`: `search-results.html`. Los archivos estáticos van por tipo en `public/`: `/img/`, `/js/`, `/css/`, `/fonts/`. Un plugin por funcionalidad, con su nombre: `plugins/redirects`.

## ¿Qué es un módulo y cómo lo uso?

Un archivo de `modules/` es una integración con otro sistema o un servicio propio. El framework lo carga y registra lo que exporta en `MODS`, con el nombre del archivo:

```js
var data = MODS.visitors.today();
```

No cargues un módulo de la aplicación con `require(PATH.root('modules/...'))`. Un nombre con guion usa corchetes: `MODS['knowledge-source']`.

## ¿Una aplicación nueva debe usar plugins?

Depende del proyecto. Una aplicación que va a crecer por funcionalidades se hace con plugins: cada funcionalidad es una carpeta `plugins/<nombre>/` con sus rutas, sus acciones y su pantalla. Un servicio pequeño con una o dos colecciones no los necesita: bastan `controllers/` y `actions/`.

## ¿Necesito Express u otros paquetes?

No. Total.js 5 no está hecho sobre Express y no usa su middleware. Las rutas, las acciones, la validación, las plantillas, WebSocket, el constructor de consultas y las pruebas están en `total5`. También PostgreSQL, desde Total.js 5 0.0.20-4: `DATA.init('postgresql', '', CONF.database)`. Una aplicación corriente no añade ningún otro paquete.

## ¿Qué versión de Total.js 5 instalo?

`"total5": ">=0.0.20-2"` en `package.json`: la versión 0.0.20 o posterior. Hoy instala la beta de la 0.0.20, que corrige varios problemas de la 0.0.19, y la 0.0.20 estable cuando se publique. `npm view total5 dist-tags` dice qué versiones son hoy. Total.js 4 (`total4`) es el framework anterior y su código no es el mismo.
