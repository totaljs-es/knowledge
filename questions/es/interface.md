# La interfaz con jComponent 20: preguntas y respuestas

## ¿Qué es un plugin?

Una funcionalidad de una aplicación: una carpeta con su parte de servidor y su pantalla, que el framework carga y el armazón de la aplicación monta.

```
plugins/redirects/
	index.js              server: metadata and routes
	schemas/redirects.js  actions
	public/index.html     the screen
	public/form.html      the form that opens over the screen
```

## ¿Qué va en el index.js de un plugin?

Su icono, su nombre, su posición en el menú, quién lo ve y sus rutas:

```js
exports.icon = 'ti ti-check-circle';
exports.name = '@(Tasks)';
exports.position = 1;
exports.visible = function() {
	return true;
};

exports.install = function() {
	ROUTE('+API    ?    -tasks                   --> Tasks|list');
	ROUTE('+API    ?    +tasks_save              --> Tasks|save');
	ROUTE('+API    ?    -tasks_remove/{id}       --> Tasks|remove');
};
```

## ¿Cómo escribo la pantalla de un plugin?

HTML con una raíz `<ui-plugin>` y un bloque `PLUGIN(function(exports) { ... })`, en `public/index.html`:

```html
<ui-plugin class="CLASS">
	<button class="exec" data-exec="?/refresh">@(Refresh)</button>
</ui-plugin>

<script>
	PLUGIN(function(exports) {

		exports.reload = function() {
			exports.refresh();
		};

		exports.refresh = function() {
			exports.tapi('tasks', function(response) {
				exports.set('items', response);
			});
		};

	});
</script>
```

`exports.reload` se ejecuta cada vez que se abre la pantalla.

## ¿Cómo llama una pantalla al servidor?

Con `exports.tapi('endpoint_name', data, callback)`. Añade `ERROR` detrás del nombre para que el mensaje de error se muestre al usuario por sí solo:

```js
exports.tapi('tasks_save ERROR', model, function(response) {
	exports.refresh();
});
```

El nombre es el endpoint de la ruta: `+tasks_save`.

## ¿Qué significa ? en una ruta de datos?

«Este plugin». `?.items` son los datos `items` del plugin, y `?/create` es su función `exports.create`:

```html
<ui-bind path="?.items" config="template"></ui-bind>
<button class="exec" data-exec="?/create">@(Create)</button>
```

## ¿Qué es CLASS?

Una palabra que se sustituye por una clase única del plugin. Úsala en la clase de la raíz y en los selectores del estilo, para que el CSS de una pantalla no alcance a otra:

```html
<style>
	.CLASS .task { padding: 10px 0; border-bottom: 1px solid #E8E8E8; }
</style>

<ui-plugin class="CLASS">
</ui-plugin>
```

## ¿Cómo atiendo el clic de un botón?

Con la clase `exec` y `data-exec`. No añadas `onclick` ni `addEventListener`:

```html
<button class="exec" data-exec="?/create"><i class="ti ti-plus-circle"></i>@(Create)</button>
<div class="exec" data-exec="?/edit" data-id="{{ m.id }}">{{ m.name }}</div>
```

```js
exports.edit = function(el) {
	var id = ATTRD(el);
};
```

`ATTRD(el)` lee el `data-id` del elemento.

## ¿Cómo pongo y leo los datos de una pantalla?

`exports.set('items', value)` los pone y los enlaces los vuelven a dibujar. `exports.model` es el modelo del plugin:

```js
exports.tapi('tasks', function(response) {
	exports.set('items', response);
});
```

## ¿Cómo cargo la librería jComponent 20 en una página?

Desde la CDN, una vez por documento, antes de los componentes:

```html
<link href="https://cdn.componentator.com/spa.min@20.css" rel="stylesheet" />
<script src="https://cdn.componentator.com/spa.min@20.js"></script>
<script src="@{REPO.ui}"></script>
```

`@{REPO.ui}` es el archivo de componentes que hizo `COMPONENTATOR()`.

## ¿Cómo cargo componentes?

Con `COMPONENTATOR()` en `definitions/init.js`: descarga los componentes que nombres como un solo archivo, y el layout lo carga con `@{REPO.ui}`.

```js
ON('ready', function() {
	COMPONENTATOR('ui', 'exec,errorhandler,locale,input,validate,miniform,notify,approve', true);
});
```

Pon en la lista solo los componentes que usa la aplicación.

## ¿Cómo pongo un componente en una pantalla?

Con `<ui-component>`: su nombre, la ruta de sus datos y su configuración.

```html
<ui-component name="input" path="?.url" config="required:1;placeholder:@(Relative URL address)">@(URL)</ui-component>
```

## ¿Dónde encuentro un componente?

En Componentator, el catálogo de componentes de jComponent: <https://componentator.com>. Busca un componente que ya exista antes de escribir a mano una pieza de la interfaz. `input` es el único componente para todos los campos de un formulario: su `type` elige el tipo.

## ¿Cómo hago un formulario?

Un segundo archivo, `public/form.html`, con un `miniform`, sus campos, un `validate` que activa el botón de envío y una función `submit`:

```html
<ui-component name="miniform" path="common.form" config="if:CLASS;title:@(Redirect);reload:?/reload;submit:?/submit;width:400" class="hidden" plugin="CLASS">
	<div class="padding">
		<ui-component name="input" path="?.url" config="required:1">@(URL)</ui-component>
	</div>
	<nav>
		<ui-component name="validate" path="?">
			<button name="submit" disabled>@(SUBMIT)</button>
			<button name="cancel">@(Cancel)</button>
		</ui-component>
	</nav>
</ui-component>
```

## ¿Cómo abro un formulario?

La pantalla lo carga con un `importer`, le da un modelo y lo muestra:

```html
<ui-component name="importer" path="common.form" config="if:formredirect;url:/~ID~/form.html"></ui-component>
```

```js
exports.create = function() {
	SET('formredirect @default', {});
	SET('*form', 'formredirect');
};
```

## ¿Cómo guarda un formulario y refresca la pantalla que lo abrió?

Su `submit` llama al servidor, oculta el formulario después de una respuesta correcta y refresca a quien lo abrió:

```js
PLUGIN(function(exports) {

	var caller;

	exports.reload = function() {
		caller = exports.caller;
	};

	exports.submit = function(hide) {
		var model = exports.form;
		exports.tapi('redirects_save ERROR', model, function() {
			hide();
			caller.exec('refresh');
		});
	};

});
```

## ¿Cómo pido una confirmación antes de borrar?

Con el componente `approve`:

```js
SETTER('approve/show', '@(Are you sure you want to remove it?)', ':ti ti-trash: @(Remove)', function() {
	exports.tapi('redirects_remove/ ERROR', { id: id }, function() {
		exports.refresh();
	});
});
```

## ¿Cómo nombro los plugins, los componentes y sus funciones?

En minúsculas. Deja los nombres `exports`, `self`, `config` y `cls` como están:

```js
// good
PLUGIN('name', function(exports) { exports.dosomething = function() {}; });
```

## ¿Cómo escribo el CSS de una aplicación?

Una regla por línea, textos entre `'`, sin prefijos de navegador (`/*auto*/` al principio del archivo viene de Total.js 4, que los añadía; Total.js 5 no añade nada), sin LESS y sin SASS:

```css
/*auto*/

.class { key1: value; key2: value; key3: value; }
.class > div { key1: value; key2: value; }
```

El estilo de una pantalla va al principio de su HTML, acotado con `CLASS`. Lo compartido va en `public/css/default.css`.

## ¿Qué colores y medidas uso en el CSS?

Las variables CSS de la biblioteca jComponent: `var(--color)` es el color de la aplicación, `var(--radius)` el radio de las esquinas, `var(--gap)` y `var(--margin)` los espacios, y `var(--rgb)` el color como tres números. Úsalas en vez de un valor fijo, para que una pantalla nueva se parezca al resto:

```css
.CLASS .task { border: 1px solid #E0E0E0; border-radius: var(--radius); padding: var(--gap); }
.CLASS .task.selected { border-color: var(--color); }
```

El layout cambia el color de toda la aplicación en un solo sitio:

```html
@{if CONF.color}<style>:root{--color:@{CONF.color};}</style>@{fi}
```

## ¿Qué iconos uso?

Total Icons: la clase `ti ti-name`, como `ti ti-check-circle` o `ti ti-trash`.

```html
<i class="ti ti-plus-circle"></i>
```
